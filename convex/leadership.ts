import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdminSession, logAuditEvent } from "./lib/auth";
import { sanitizeText, isValidEmail, validateSocialLinks } from "./lib/validation";

// ─── Public Queries ──────────────────────────────────────────

export const listCommittee = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("core_committee").collect();
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

export const listFaculty = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("faculty_advisors").collect();
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// ─── Admin Queries ───────────────────────────────────────────

export const listCommitteeAdmin = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);
    const list = await ctx.db.query("core_committee").collect();
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

export const listFacultyAdmin = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);
    const list = await ctx.db.query("faculty_advisors").collect();
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// ─── Core Committee Mutations ────────────────────────────────

export const addCommitteeMember = mutation({
  args: {
    token: v.string(),
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

    const id = await ctx.db.insert("core_committee", {
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
      action: "LEADERSHIP_COMMITTEE_ADD",
      resource: "core_committee",
      resourceId: id,
      details: `Added core committee member: ${args.name}`,
    });

    return id;
  },
});

export const updateCommitteeMember = mutation({
  args: {
    token: v.string(),
    id: v.id("core_committee"),
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
    if (!existing) throw new Error("Core committee member not found");

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
      action: "LEADERSHIP_COMMITTEE_UPDATE",
      resource: "core_committee",
      resourceId: args.id,
      details: `Updated core committee member: ${args.name}`,
    });

    return { success: true };
  },
});

export const removeCommitteeMember = mutation({
  args: { token: v.string(), id: v.id("core_committee") },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const member = await ctx.db.get(args.id);
    if (!member) throw new Error("Core committee member not found");

    await ctx.db.delete(args.id);

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "LEADERSHIP_COMMITTEE_REMOVE",
      resource: "core_committee",
      resourceId: args.id,
      details: `Removed core committee member: ${member.name}`,
      severity: "warning",
    });

    return { success: true };
  },
});

// ─── Faculty Advisor Mutations ───────────────────────────────

export const addFacultyAdvisor = mutation({
  args: {
    token: v.string(),
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

    const id = await ctx.db.insert("faculty_advisors", {
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
      action: "LEADERSHIP_FACULTY_ADD",
      resource: "faculty_advisors",
      resourceId: id,
      details: `Added club faculty advisor: ${args.name}`,
    });

    return id;
  },
});

export const updateFacultyAdvisor = mutation({
  args: {
    token: v.string(),
    id: v.id("faculty_advisors"),
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
    if (!existing) throw new Error("Faculty advisor not found");

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
      action: "LEADERSHIP_FACULTY_UPDATE",
      resource: "faculty_advisors",
      resourceId: args.id,
      details: `Updated club faculty advisor: ${args.name}`,
    });

    return { success: true };
  },
});

export const removeFacultyAdvisor = mutation({
  args: { token: v.string(), id: v.id("faculty_advisors") },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const mentor = await ctx.db.get(args.id);
    if (!mentor) throw new Error("Faculty advisor not found");

    await ctx.db.delete(args.id);

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "LEADERSHIP_FACULTY_REMOVE",
      resource: "faculty_advisors",
      resourceId: args.id,
      details: `Removed club faculty advisor: ${mentor.name}`,
      severity: "warning",
    });

    return { success: true };
  },
});
