import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdminSession, logAuditEvent } from "./lib/auth";
import { validateMemoryInput } from "./lib/validation";

// ─── Public Queries ──────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("event_memories")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("event_memories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ─── Admin Queries ───────────────────────────────────────────

export const listAdmin = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);
    return await ctx.db.query("event_memories").collect();
  },
});

// ─── Admin Mutations ─────────────────────────────────────────

export const create = mutation({
  args: {
    token: v.string(),
    eventId: v.id("events"),
    title: v.string(),
    summary: v.string(),
    photos: v.array(v.string()),
    videoUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const validated = validateMemoryInput({
      title: args.title,
      summary: args.summary,
      photos: args.photos,
      videoUrl: args.videoUrl,
      tags: args.tags,
    });

    const now = new Date().toISOString();

    const id = await ctx.db.insert("event_memories", {
      eventId: args.eventId,
      title: validated.title,
      summary: validated.summary,
      photos: validated.photos,
      videoUrl: validated.videoUrl,
      tags: validated.tags,
      published: args.published,
      createdAt: now,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "MEMORY_CREATED",
      resource: "event_memories",
      resourceId: id,
      details: `Created memory: "${validated.title}"`,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("event_memories"),
    eventId: v.id("events"),
    title: v.string(),
    summary: v.string(),
    photos: v.array(v.string()),
    videoUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Memory record not found");

    const validated = validateMemoryInput({
      title: args.title,
      summary: args.summary,
      photos: args.photos,
      videoUrl: args.videoUrl,
      tags: args.tags,
    });

    await ctx.db.patch(args.id, {
      eventId: args.eventId,
      title: validated.title,
      summary: validated.summary,
      photos: validated.photos,
      videoUrl: validated.videoUrl,
      tags: validated.tags,
      published: args.published,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "MEMORY_UPDATED",
      resource: "event_memories",
      resourceId: args.id,
      details: `Updated memory: "${validated.title}"`,
    });

    return { success: true };
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("event_memories") },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const memory = await ctx.db.get(args.id);
    if (!memory) throw new Error("Memory record not found");

    await ctx.db.delete(args.id);

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "MEMORY_DELETED",
      resource: "event_memories",
      resourceId: args.id,
      details: `Deleted memory: "${memory.title}"`,
      severity: "warning",
    });

    return { success: true };
  },
});

export const togglePublish = mutation({
  args: { token: v.string(), id: v.id("event_memories"), published: v.boolean() },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const memory = await ctx.db.get(args.id);
    if (!memory) throw new Error("Memory record not found");

    await ctx.db.patch(args.id, {
      published: args.published,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: args.published ? "MEMORY_PUBLISHED" : "MEMORY_UNPUBLISHED",
      resource: "event_memories",
      resourceId: args.id,
      details: `Toggled published state of memory "${memory.title}" to ${args.published}`,
    });

    return { success: true };
  },
});
