import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateSessionToken,
  logAuditEvent,
  validateAdminSession,
} from "./lib/auth";
import { sanitizeText, isValidLength } from "./lib/validation";

// ─── Student Authentication ──────────────────────────────────

/**
 * Authenticate student portal login, returns session token.
 */
export const studentLogin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!member || !member.portalEnabled || !member.portalPasswordHash || !member.portalPasswordSalt) {
      throw new Error("Invalid credentials or portal access disabled");
    }

    if (member.status === "inactive" || member.status === "pending") {
      throw new Error("Member account is suspended or pending approval");
    }

    const valid = await verifyPassword(args.password, member.portalPasswordHash, member.portalPasswordSalt);
    if (!valid) {
      throw new Error("Invalid credentials");
    }

    // Create student session
    const token = generateSessionToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await ctx.db.insert("student_sessions", {
      memberId: member._id,
      token,
      expiresAt,
      createdAt: new Date().toISOString(),
    });

    await ctx.db.patch(member._id, {
      lastPortalLogin: new Date().toISOString(),
    });

    return {
      token,
      expiresAt,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        studentId: member.studentId,
      },
    };
  },
});

// ─── Student Data Isolation Helper ───────────────────────────

async function validateStudentSession(ctx: any, token: string) {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid student token");
  }

  const session = await ctx.db
    .query("student_sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();

  if (!session) throw new Error("Student session not found");
  if (session.expiresAt < Date.now()) throw new Error("Student session expired");

  const member = await ctx.db.get(session.memberId);
  if (!member || member.status === "inactive") throw new Error("Student account invalid");

  return { member, session };
}

// ─── Isolated Student Queries ────────────────────────────────

/**
 * Get student's own profile. Strict data isolation.
 */
export const getMyProfile = query({
  args: { studentToken: v.string() },
  handler: async (ctx, args) => {
    const { member } = await validateStudentSession(ctx, args.studentToken);
    
    // Return only necessary profile information, excluding security credentials
    return {
      id: member._id,
      name: member.name,
      email: member.email,
      studentId: member.studentId,
      year: member.year,
      department: member.department,
      role: member.role,
      status: member.status,
      joinDate: member.joinDate,
      phone: member.phone,
      interests: member.interests,
      profileImageUrl: member.profileImageUrl,
    };
  },
});

/**
 * Get student's registered events. Strict data isolation.
 */
export const getMyRegisteredEvents = query({
  args: { studentToken: v.string() },
  handler: async (ctx, args) => {
    const { member } = await validateStudentSession(ctx, args.studentToken);

    const regs = await ctx.db
      .query("event_registrations")
      .withIndex("by_memberId", (q) => q.eq("memberId", member._id))
      .collect();

    const result = [];
    for (const reg of regs) {
      const event = await ctx.db.get(reg.eventId);
      if (event) {
        result.push({
          registrationId: reg._id,
          registeredAt: reg.registeredAt,
          status: reg.status,
          event: {
            id: event._id,
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            category: event.category,
            bannerImageUrl: event.bannerImageUrl,
          },
        });
      }
    }
    return result;
  },
});

// ─── Isolated Student Mutations ──────────────────────────────

/**
 * Update student's own details. Strictly limited fields.
 */
export const updateMyProfile = mutation({
  args: {
    studentToken: v.string(),
    phone: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { member } = await validateStudentSession(ctx, args.studentToken);

    const patch: any = {};
    if (args.phone !== undefined) patch.phone = args.phone.trim();
    if (args.interests !== undefined) {
      patch.interests = args.interests.map((i) => sanitizeText(i.trim()).substring(0, 30)).slice(0, 10);
    }
    if (args.profileImageUrl !== undefined) patch.profileImageUrl = args.profileImageUrl;

    await ctx.db.patch(member._id, patch);
    return { success: true };
  },
});

// ─── Admin Student Management Utilities ──────────────────────

/**
 * Admin action: Enable/disable portal access for a student and set/reset their password.
 */
export const configurePortalAccess = mutation({
  args: {
    token: v.string(),
    memberId: v.id("members"),
    enabled: v.boolean(),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");

    const patch: any = { portalEnabled: args.enabled };

    if (args.enabled && args.password) {
      if (!isValidLength(args.password, 8, 128)) {
        throw new Error("Password must be between 8 and 128 characters");
      }
      const salt = generateSalt();
      const hash = await hashPassword(args.password, salt);
      patch.portalPasswordHash = hash;
      patch.portalPasswordSalt = salt;
    }

    await ctx.db.patch(args.memberId, patch);

    // Terminate active sessions if disabled
    if (!args.enabled) {
      const activeSessions = await ctx.db
        .query("student_sessions")
        .withIndex("by_memberId", (q) => q.eq("memberId", args.memberId))
        .collect();
      for (const s of activeSessions) {
        await ctx.db.delete(s._id);
      }
    }

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: args.enabled ? "STUDENT_PORTAL_ENABLED" : "STUDENT_PORTAL_DISABLED",
      resource: "members",
      resourceId: args.memberId,
      details: `${args.enabled ? "Configured" : "Revoked"} student portal access for ${member.name} (${member.email})`,
    });

    return { success: true };
  },
});
