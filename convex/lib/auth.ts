import { MutationCtx, QueryCtx } from "../_generated/server";

// ─── Password Hashing (Web Crypto API compatible with Convex runtime) ──────

/**
 * Generate a random salt for password hashing.
 */
export function generateSalt(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash a password with the given salt using PBKDF2 via Web Crypto API.
 */
export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(derivedBits), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

/**
 * Verify a password against a stored hash and salt.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  // Constant-time comparison to prevent timing attacks
  if (hash.length !== storedHash.length) return false;
  let result = 0;
  for (let i = 0; i < hash.length; i++) {
    result |= hash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return result === 0;
}

// ─── Session Token Generation ──────────────────────────────────────────────

/**
 * Generate a cryptographically secure session token.
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(48);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Session Validation ────────────────────────────────────────────────────

/**
 * Validate an admin session token. Returns the admin user or throws.
 * Use this as middleware in all admin-only queries and mutations.
 */
export async function validateAdminSession(
  ctx: QueryCtx | MutationCtx,
  token: string
) {
  if (!token || typeof token !== "string" || token.length < 10) {
    throw new Error("AUTH_INVALID_TOKEN");
  }

  const session = await ctx.db
    .query("admin_sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();

  if (!session) {
    throw new Error("AUTH_SESSION_NOT_FOUND");
  }

  if (session.expiresAt < Date.now()) {
    throw new Error("AUTH_SESSION_EXPIRED");
  }

  const user = await ctx.db.get(session.userId);
  if (!user || !user.isActive) {
    throw new Error("AUTH_USER_INACTIVE");
  }

  return { user, session };
}

/**
 * Check if the admin has a specific role level.
 * Role hierarchy: super_admin > admin > editor
 */
export function requireRole(
  userRole: string,
  requiredRole: "super_admin" | "admin" | "editor"
): boolean {
  const hierarchy: Record<string, number> = {
    super_admin: 3,
    admin: 2,
    editor: 1,
  };
  return (hierarchy[userRole] ?? 0) >= (hierarchy[requiredRole] ?? 0);
}

// ─── Audit Logging Helper ──────────────────────────────────────────────────

/**
 * Log an admin action to the audit_logs table.
 */
export async function logAuditEvent(
  ctx: MutationCtx,
  params: {
    userId?: any;
    userName?: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: string;
    severity?: "info" | "warning" | "error" | "critical";
  }
) {
  await ctx.db.insert("audit_logs", {
    userId: params.userId,
    userName: params.userName,
    action: params.action,
    resource: params.resource,
    resourceId: params.resourceId,
    details: params.details,
    severity: params.severity ?? "info",
    timestamp: new Date().toISOString(),
  });
}
