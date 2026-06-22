import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateSessionToken,
  validateAdminSession,
  logAuditEvent,
} from "./lib/auth";
import { isValidEmail, isValidLength } from "./lib/validation";

// ─── Constants ─────────────────────────────────────────────
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// ─── Seed Admin (one-time setup) ───────────────────────────
export const seedAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if any admin exists
    const existing = await ctx.db.query("admin_users").first();
    if (existing) {
      throw new Error("Admin user already exists. Use the admin panel to create new users.");
    }

    if (!isValidEmail(args.email)) {
      throw new Error("Invalid email format");
    }
    if (!isValidLength(args.password, 8, 128)) {
      throw new Error("Password must be between 8 and 128 characters");
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(args.password, salt);

    const userId = await ctx.db.insert("admin_users", {
      email: args.email.trim().toLowerCase(),
      passwordHash,
      salt,
      name: args.name.trim(),
      role: "super_admin",
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    await logAuditEvent(ctx, {
      userId,
      userName: args.name,
      action: "ADMIN_SEED",
      resource: "admin_users",
      resourceId: userId,
      details: `Initial admin user created: ${args.email}`,
      severity: "info",
    });

    return { success: true, message: "Admin user created successfully" };
  },
});

// ─── Login ─────────────────────────────────────────────────
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    // Rate limiting check
    const rateLimitKey = `login:${email}`;
    const rateLimit = await ctx.db
      .query("rate_limits")
      .withIndex("by_key", (q) => q.eq("key", rateLimitKey))
      .first();

    if (rateLimit) {
      const windowExpired = Date.now() - rateLimit.windowStart > RATE_LIMIT_WINDOW_MS;
      if (!windowExpired && rateLimit.attempts >= MAX_LOGIN_ATTEMPTS) {
        const retryAfter = Math.ceil(
          (rateLimit.windowStart + RATE_LIMIT_WINDOW_MS - Date.now()) / 1000
        );
        await logAuditEvent(ctx, {
          action: "LOGIN_RATE_LIMITED",
          resource: "admin_auth",
          details: `Rate limited login for ${email}. Retry after ${retryAfter}s`,
          severity: "warning",
        });
        throw new Error(`RATE_LIMITED:${retryAfter}`);
      }
      if (windowExpired) {
        await ctx.db.patch(rateLimit._id, { attempts: 0, windowStart: Date.now() });
      }
    }

    // Find user
    const user = await ctx.db
      .query("admin_users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user || !user.isActive) {
      await incrementRateLimit(ctx, rateLimitKey);
      await logAuditEvent(ctx, {
        action: "LOGIN_FAILED",
        resource: "admin_auth",
        details: `Failed login: user not found for ${email}`,
        severity: "warning",
      });
      throw new Error("AUTH_INVALID_CREDENTIALS");
    }

    // Verify password
    const valid = await verifyPassword(args.password, user.passwordHash, user.salt);
    if (!valid) {
      await incrementRateLimit(ctx, rateLimitKey);
      await logAuditEvent(ctx, {
        userId: user._id,
        userName: user.name,
        action: "LOGIN_FAILED",
        resource: "admin_auth",
        details: `Invalid password for ${email}`,
        severity: "warning",
      });
      throw new Error("AUTH_INVALID_CREDENTIALS");
    }

    // Clear rate limit on success
    if (rateLimit) {
      await ctx.db.patch(rateLimit._id, { attempts: 0, windowStart: Date.now() });
    }

    // Create session
    const token = generateSessionToken();
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    await ctx.db.insert("admin_sessions", {
      userId: user._id,
      token,
      expiresAt,
      userAgent: args.userAgent,
      createdAt: new Date().toISOString(),
    });

    // Update last login
    await ctx.db.patch(user._id, { lastLogin: new Date().toISOString() });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "LOGIN_SUCCESS",
      resource: "admin_auth",
      details: `Admin login successful for ${email}`,
      severity: "info",
    });

    return {
      token,
      expiresAt,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },
});

// ─── Logout ────────────────────────────────────────────────
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("admin_sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      const user = await ctx.db.get(session.userId);
      await ctx.db.delete(session._id);
      await logAuditEvent(ctx, {
        userId: session.userId,
        userName: user?.name,
        action: "LOGOUT",
        resource: "admin_auth",
        details: "Admin session terminated",
        severity: "info",
      });
    }

    return { success: true };
  },
});

// ─── Validate Session (query) ──────────────────────────────
export const validate = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    try {
      const { user } = await validateAdminSession(ctx, args.token);
      return {
        valid: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch {
      return { valid: false, user: null };
    }
  },
});

// ─── Change Password ───────────────────────────────────────
export const changePassword = mutation({
  args: {
    token: v.string(),
    oldPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    if (!isValidLength(args.newPassword, 8, 128)) {
      throw new Error("New password must be between 8 and 128 characters");
    }

    const valid = await verifyPassword(args.oldPassword, user.passwordHash, user.salt);
    if (!valid) {
      throw new Error("Current password is incorrect");
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(args.newPassword, newSalt);

    await ctx.db.patch(user._id, {
      passwordHash: newHash,
      salt: newSalt,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "PASSWORD_CHANGED",
      resource: "admin_users",
      resourceId: user._id,
      details: "Admin password changed",
      severity: "info",
    });

    return { success: true };
  },
});

// ─── Create Additional Admin ───────────────────────────────
export const createAdmin = mutation({
  args: {
    token: v.string(),
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor")),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);
    if (user.role !== "super_admin") {
      throw new Error("Only super admins can create new admin users");
    }

    if (!isValidEmail(args.email)) throw new Error("Invalid email format");
    if (!isValidLength(args.password, 8, 128)) throw new Error("Password must be 8-128 characters");
    if (!isValidLength(args.name, 2, 100)) throw new Error("Name must be 2-100 characters");

    const existing = await ctx.db
      .query("admin_users")
      .withIndex("by_email", (q) => q.eq("email", args.email.trim().toLowerCase()))
      .first();

    if (existing) throw new Error("An admin with this email already exists");

    const salt = generateSalt();
    const passwordHash = await hashPassword(args.password, salt);

    const newId = await ctx.db.insert("admin_users", {
      email: args.email.trim().toLowerCase(),
      passwordHash,
      salt,
      name: args.name.trim(),
      role: args.role,
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "ADMIN_CREATED",
      resource: "admin_users",
      resourceId: newId,
      details: `Created admin user ${args.email} with role ${args.role}`,
      severity: "info",
    });

    return { success: true, id: newId };
  },
});

// ─── Helper: Increment Rate Limit ──────────────────────────
async function incrementRateLimit(ctx: any, key: string) {
  const existing = await ctx.db
    .query("rate_limits")
    .withIndex("by_key", (q: any) => q.eq("key", key))
    .first();

  if (existing) {
    const windowExpired = Date.now() - existing.windowStart > RATE_LIMIT_WINDOW_MS;
    if (windowExpired) {
      await ctx.db.patch(existing._id, { attempts: 1, windowStart: Date.now() });
    } else {
      await ctx.db.patch(existing._id, { attempts: existing.attempts + 1 });
    }
  } else {
    await ctx.db.insert("rate_limits", {
      key,
      attempts: 1,
      windowStart: Date.now(),
    });
  }
}
