import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdminSession, logAuditEvent } from "./lib/auth";
import { sanitizeText, isValidEmail, validateSocialLinks } from "./lib/validation";

// ─── Query Operations ────────────────────────────────────────

export const listPeopleBySig = query({
  args: { sigId: v.id("sigs") },
  handler: async (ctx, args) => {
    const committee = await ctx.db
      .query("sig_committee")
      .withIndex("by_sigId", (q) => q.eq("sigId", args.sigId))
      .collect();

    const faculty = await ctx.db
      .query("sig_faculty")
      .withIndex("by_sigId", (q) => q.eq("sigId", args.sigId))
      .collect();

    // Sort by displayOrder
    committee.sort((a, b) => a.displayOrder - b.displayOrder);
    faculty.sort((a, b) => a.displayOrder - b.displayOrder);

    return { committee, faculty };
  },
});

// ─── Committee Mutations ─────────────────────────────────────

export const addCommittee = mutation({
  args: {
    token: v.string(),
    sigId: v.id("sigs"),
    name: v.string(),
    role: v.string(),
    bio: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socialLinks: v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    if (args.email && !isValidEmail(args.email)) throw new Error("Invalid email format");

    const validatedLinks = validateSocialLinks(args.socialLinks);

    const id = await ctx.db.insert("sig_committee", {
      sigId: args.sigId,
      name: sanitizeText(args.name.trim()),
      role: sanitizeText(args.role.trim()),
      bio: args.bio ? sanitizeText(args.bio.trim()) : undefined,
      email: args.email ? args.email.trim().toLowerCase() : undefined,
      imageUrl: args.imageUrl,
      socialLinks: validatedLinks,
      displayOrder: args.displayOrder,
      createdAt: new Date().toISOString(),
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "SIG_COMMITTEE_ADD",
      resource: "sig_committee",
      resourceId: id,
      details: `Added committee member ${args.name} to SIG ${args.sigId}`,
    });

    return id;
  },
});

export const updateCommittee = mutation({
  args: {
    token: v.string(),
    id: v.id("sig_committee"),
    name: v.string(),
    role: v.string(),
    bio: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socialLinks: v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Committee member not found");

    if (args.email && !isValidEmail(args.email)) throw new Error("Invalid email format");

    const validatedLinks = validateSocialLinks(args.socialLinks);

    await ctx.db.patch(args.id, {
      name: sanitizeText(args.name.trim()),
      role: sanitizeText(args.role.trim()),
      bio: args.bio ? sanitizeText(args.bio.trim()) : undefined,
      email: args.email ? args.email.trim().toLowerCase() : undefined,
      imageUrl: args.imageUrl,
      socialLinks: validatedLinks,
      displayOrder: args.displayOrder,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "SIG_COMMITTEE_UPDATE",
      resource: "sig_committee",
      resourceId: args.id,
      details: `Updated committee member ${args.name}`,
    });

    return { success: true };
  },
});

export const removeCommittee = mutation({
  args: { token: v.string(), id: v.id("sig_committee") },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const member = await ctx.db.get(args.id);
    if (!member) throw new Error("Committee member not found");

    await ctx.db.delete(args.id);

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "SIG_COMMITTEE_REMOVE",
      resource: "sig_committee",
      resourceId: args.id,
      details: `Removed committee member ${member.name} from SIG ${member.sigId}`,
      severity: "warning",
    });

    return { success: true };
  },
});

// ─── Faculty Mutations ───────────────────────────────────────

export const addFaculty = mutation({
  args: {
    token: v.string(),
    sigId: v.id("sigs"),
    name: v.string(),
    role: v.string(),
    department: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socialLinks: v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const validatedLinks = validateSocialLinks(args.socialLinks);

    const id = await ctx.db.insert("sig_faculty", {
      sigId: args.sigId,
      name: sanitizeText(args.name.trim()),
      role: sanitizeText(args.role.trim()),
      department: args.department ? sanitizeText(args.department.trim()) : undefined,
      bio: args.bio ? sanitizeText(args.bio.trim()) : undefined,
      imageUrl: args.imageUrl,
      socialLinks: validatedLinks,
      displayOrder: args.displayOrder,
      createdAt: new Date().toISOString(),
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "SIG_FACULTY_ADD",
      resource: "sig_faculty",
      resourceId: id,
      details: `Added faculty mentor ${args.name} to SIG ${args.sigId}`,
    });

    return id;
  },
});

export const updateFaculty = mutation({
  args: {
    token: v.string(),
    id: v.id("sig_faculty"),
    name: v.string(),
    role: v.string(),
    department: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socialLinks: v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Faculty member not found");

    const validatedLinks = validateSocialLinks(args.socialLinks);

    await ctx.db.patch(args.id, {
      name: sanitizeText(args.name.trim()),
      role: sanitizeText(args.role.trim()),
      department: args.department ? sanitizeText(args.department.trim()) : undefined,
      bio: args.bio ? sanitizeText(args.bio.trim()) : undefined,
      imageUrl: args.imageUrl,
      socialLinks: validatedLinks,
      displayOrder: args.displayOrder,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "SIG_FACULTY_UPDATE",
      resource: "sig_faculty",
      resourceId: args.id,
      details: `Updated faculty mentor ${args.name}`,
    });

    return { success: true };
  },
});

export const removeFaculty = mutation({
  args: { token: v.string(), id: v.id("sig_faculty") },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const mentor = await ctx.db.get(args.id);
    if (!mentor) throw new Error("Faculty member not found");

    await ctx.db.delete(args.id);

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "SIG_FACULTY_REMOVE",
      resource: "sig_faculty",
      resourceId: args.id,
      details: `Removed faculty mentor ${mentor.name} from SIG ${mentor.sigId}`,
      severity: "warning",
    });

    return { success: true };
  },
});
