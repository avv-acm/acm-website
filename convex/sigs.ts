import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdminSession, logAuditEvent } from "./lib/auth";
import { sanitizeText, isValidEmail, isValidLength } from "./lib/validation";

// ─── Public Queries ──────────────────────────────────────────

export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let sigsQuery = ctx.db.query("sigs");
    
    if (args.status) {
      sigsQuery = sigsQuery.withIndex("by_status", (q) => q.eq("status", args.status as any));
    }

    return await sigsQuery.collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sigs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// ─── Admin Queries ───────────────────────────────────────────

export const listAdmin = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);
    return await ctx.db.query("sigs").collect();
  },
});

// ─── Admin Mutations ─────────────────────────────────────────

export const create = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    focusArea: v.string(),
    contactEmail: v.optional(v.string()),
    bannerImageUrl: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("archived")),
    membersCount: v.number(),
    activeProject: v.optional(v.string()),
    projectStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    if (!isValidLength(args.name, 2, 100)) throw new Error("Name must be 2-100 characters");
    if (!isValidLength(args.slug, 2, 50)) throw new Error("Slug must be 2-50 characters");
    if (!isValidLength(args.description, 10, 2000)) throw new Error("Description must be 10-2000 characters");
    if (args.contactEmail && !isValidEmail(args.contactEmail)) throw new Error("Invalid email format");

    // Check unique slug
    const existing = await ctx.db
      .query("sigs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) throw new Error("A SIG with this slug already exists");

    const now = new Date().toISOString();

    const id = await ctx.db.insert("sigs", {
      name: sanitizeText(args.name.trim()),
      slug: args.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, ""),
      description: sanitizeText(args.description.trim()),
      focusArea: sanitizeText(args.focusArea.trim()),
      contactEmail: args.contactEmail ? args.contactEmail.trim().toLowerCase() : undefined,
      bannerImageUrl: args.bannerImageUrl,
      status: args.status,
      membersCount: Math.max(0, args.membersCount),
      activeProject: args.activeProject ? sanitizeText(args.activeProject.trim()) : undefined,
      projectStatus: args.projectStatus ? sanitizeText(args.projectStatus.trim()) : undefined,
      createdAt: now,
      updatedAt: now,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "SIG_CREATED",
      resource: "sigs",
      resourceId: id,
      details: `Created SIG: ${args.name}`,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("sigs"),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    focusArea: v.string(),
    contactEmail: v.optional(v.string()),
    bannerImageUrl: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("archived")),
    membersCount: v.number(),
    activeProject: v.optional(v.string()),
    projectStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("SIG not found");

    if (!isValidLength(args.name, 2, 100)) throw new Error("Name must be 2-100 characters");
    if (!isValidLength(args.slug, 2, 50)) throw new Error("Slug must be 2-50 characters");
    if (!isValidLength(args.description, 10, 2000)) throw new Error("Description must be 10-2000 characters");
    if (args.contactEmail && !isValidEmail(args.contactEmail)) throw new Error("Invalid email format");

    // Check unique slug if changed
    if (args.slug !== existing.slug) {
      const dup = await ctx.db
        .query("sigs")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug))
        .first();
      if (dup) throw new Error("A SIG with this slug already exists");
    }

    const now = new Date().toISOString();

    await ctx.db.patch(args.id, {
      name: sanitizeText(args.name.trim()),
      slug: args.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, ""),
      description: sanitizeText(args.description.trim()),
      focusArea: sanitizeText(args.focusArea.trim()),
      contactEmail: args.contactEmail ? args.contactEmail.trim().toLowerCase() : undefined,
      bannerImageUrl: args.bannerImageUrl,
      status: args.status,
      membersCount: Math.max(0, args.membersCount),
      activeProject: args.activeProject ? sanitizeText(args.activeProject.trim()) : undefined,
      projectStatus: args.projectStatus ? sanitizeText(args.projectStatus.trim()) : undefined,
      updatedAt: now,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "SIG_UPDATED",
      resource: "sigs",
      resourceId: args.id,
      details: `Updated SIG: ${args.name}`,
    });

    return { success: true };
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("sigs") },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const sig = await ctx.db.get(args.id);
    if (!sig) throw new Error("SIG not found");

    // Delete associated people records (committee, faculty)
    const committee = await ctx.db
      .query("sig_committee")
      .withIndex("by_sigId", (q) => q.eq("sigId", args.id))
      .collect();
    for (const p of committee) {
      await ctx.db.delete(p._id);
    }

    const faculty = await ctx.db
      .query("sig_faculty")
      .withIndex("by_sigId", (q) => q.eq("sigId", args.id))
      .collect();
    for (const p of faculty) {
      await ctx.db.delete(p._id);
    }

    await ctx.db.delete(args.id);

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "SIG_DELETED",
      resource: "sigs",
      resourceId: args.id,
      details: `Deleted SIG: ${sig.name} along with all committee/faculty records`,
      severity: "warning",
    });

    return { success: true };
  },
});
