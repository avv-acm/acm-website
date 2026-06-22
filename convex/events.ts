import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdminSession, logAuditEvent } from "./lib/auth";
import { validateEventInput, sanitizeText } from "./lib/validation";

// ─── Public Queries ──────────────────────────────────────────

export const list = query({
  args: {
    category: v.optional(v.string()),
    onlyPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const eventsQuery = args.onlyPublished
      ? ctx.db.query("events").withIndex("by_published", (q) => q.eq("published", true))
      : ctx.db.query("events").withIndex("by_date");

    let events = await eventsQuery.collect();

    if (args.category && args.category !== "all") {
      events = events.filter((e) => e.category === args.category);
    }

    return events;
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
  },
});

export const getByIdPublic = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event || !event.published) return null;
    return event;
  },
});

// ─── Admin Queries ───────────────────────────────────────────

export const listAdmin = query({
  args: {
    token: v.string(),
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);

    let events = await ctx.db.query("events").withIndex("by_date").order("desc").collect();

    if (args.category && args.category !== "all") {
      events = events.filter((e) => e.category === args.category);
    }

    if (args.search && args.search.trim() !== "") {
      const search = args.search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(search) ||
          e.location.toLowerCase().includes(search) ||
          e.description.toLowerCase().includes(search)
      );
    }

    return events;
  },
});

export const getByIdAdmin = query({
  args: { token: v.string(), id: v.id("events") },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);
    return await ctx.db.get(args.id);
  },
});

// ─── Admin Mutations ─────────────────────────────────────────

export const create = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    date: v.string(),
    time: v.string(),
    endTime: v.optional(v.string()),
    location: v.string(),
    description: v.string(),
    capacity: v.optional(v.number()),
    registrationStatus: v.union(
      v.literal("open"),
      v.literal("closed"),
      v.literal("full"),
      v.literal("upcoming")
    ),
    category: v.union(
      v.literal("hackathon"),
      v.literal("workshop"),
      v.literal("sig"),
      v.literal("seminar"),
      v.literal("social"),
      v.literal("other")
    ),
    featured: v.boolean(),
    published: v.boolean(),
    bannerImageUrl: v.optional(v.string()),
    sigId: v.optional(v.id("sigs")),
    resourcePerson: v.optional(
      v.object({
        name: v.string(),
        designation: v.optional(v.string()),
        organization: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const validated = validateEventInput({
      title: args.title,
      date: args.date,
      time: args.time,
      location: args.location,
      description: args.description,
      capacity: args.capacity,
      category: args.category,
      sigId: args.sigId,
      resourcePerson: args.resourcePerson,
    });

    const now = new Date().toISOString();

    const id = await ctx.db.insert("events", {
      title: validated.title,
      date: validated.date,
      time: validated.time,
      endTime: args.endTime ? sanitizeText(args.endTime.trim()) : undefined,
      location: validated.location,
      description: validated.description,
      capacity: validated.capacity,
      registrationStatus: args.registrationStatus,
      category: validated.category,
      featured: args.featured,
      published: args.published,
      bannerImageUrl: args.bannerImageUrl,
      sigId: validated.sigId as any,
      resourcePerson: validated.resourcePerson,
      registrationCount: 0,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "EVENT_CREATED",
      resource: "events",
      resourceId: id,
      details: `Created event: "${validated.title}"`,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("events"),
    title: v.string(),
    date: v.string(),
    time: v.string(),
    endTime: v.optional(v.string()),
    location: v.string(),
    description: v.string(),
    capacity: v.optional(v.number()),
    registrationStatus: v.union(
      v.literal("open"),
      v.literal("closed"),
      v.literal("full"),
      v.literal("upcoming")
    ),
    category: v.union(
      v.literal("hackathon"),
      v.literal("workshop"),
      v.literal("sig"),
      v.literal("seminar"),
      v.literal("social"),
      v.literal("other")
    ),
    featured: v.boolean(),
    published: v.boolean(),
    bannerImageUrl: v.optional(v.string()),
    sigId: v.optional(v.id("sigs")),
    resourcePerson: v.optional(
      v.object({
        name: v.string(),
        designation: v.optional(v.string()),
        organization: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Event not found");

    const validated = validateEventInput({
      title: args.title,
      date: args.date,
      time: args.time,
      location: args.location,
      description: args.description,
      capacity: args.capacity,
      category: args.category,
      sigId: args.sigId,
      resourcePerson: args.resourcePerson,
    });

    const now = new Date().toISOString();

    await ctx.db.patch(args.id, {
      title: validated.title,
      date: validated.date,
      time: validated.time,
      endTime: args.endTime ? sanitizeText(args.endTime.trim()) : undefined,
      location: validated.location,
      description: validated.description,
      capacity: validated.capacity,
      registrationStatus: args.registrationStatus,
      category: validated.category,
      featured: args.featured,
      published: args.published,
      bannerImageUrl: args.bannerImageUrl,
      sigId: validated.sigId as any,
      resourcePerson: validated.resourcePerson,
      updatedAt: now,
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "EVENT_UPDATED",
      resource: "events",
      resourceId: args.id,
      details: `Updated event: "${validated.title}"`,
    });

    return { success: true };
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("events") },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");

    // Delete associated registrations
    const regs = await ctx.db
      .query("event_registrations")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.id))
      .collect();

    for (const reg of regs) {
      await ctx.db.delete(reg._id);
    }

    await ctx.db.delete(args.id);

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: "EVENT_DELETED",
      resource: "events",
      resourceId: args.id,
      details: `Deleted event: "${event.title}" and ${regs.length} registrations`,
      severity: "warning",
    });

    return { success: true };
  },
});

export const togglePublish = mutation({
  args: { token: v.string(), id: v.id("events"), published: v.boolean() },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);

    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");

    await ctx.db.patch(args.id, {
      published: args.published,
      updatedAt: new Date().toISOString(),
    });

    await logAuditEvent(ctx, {
      userId: user._id,
      userName: user.name,
      action: args.published ? "EVENT_PUBLISHED" : "EVENT_UNPUBLISHED",
      resource: "events",
      resourceId: args.id,
      details: `Toggled published state of event "${event.title}" to ${args.published}`,
    });

    return { success: true };
  },
});

// ─── Registration Operations ──────────────────────────────────

export const registerForEvent = mutation({
  args: {
    eventId: v.id("events"),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    if (!event.published || event.registrationStatus === "closed") {
      throw new Error("Registration is closed for this event");
    }

    const member = await ctx.db.get(args.memberId);
    if (!member) throw new Error("Member not found");

    // Check if already registered
    const existingReg = await ctx.db
      .query("event_registrations")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("memberId"), args.memberId))
      .first();

    if (existingReg) {
      if (existingReg.status === "confirmed") {
        return { regId: existingReg._id, status: "confirmed", message: "Already registered" };
      }
      // Re-activate registration
      await ctx.db.patch(existingReg._id, {
        status: "confirmed",
        registeredAt: new Date().toISOString(),
      });
      return { regId: existingReg._id, status: "confirmed" };
    }

    // Check capacity
    const currentRegsCount = event.registrationCount ?? 0;
    if (event.capacity && currentRegsCount >= event.capacity) {
      // Waitlist registration
      const regId = await ctx.db.insert("event_registrations", {
        eventId: args.eventId,
        memberId: args.memberId,
        registeredAt: new Date().toISOString(),
        status: "waitlisted",
      });
      return { regId, status: "waitlisted" };
    }

    const regId = await ctx.db.insert("event_registrations", {
      eventId: args.eventId,
      memberId: args.memberId,
      registeredAt: new Date().toISOString(),
      status: "confirmed",
    });

    // Update event registration count
    await ctx.db.patch(args.eventId, {
      registrationCount: currentRegsCount + 1,
      registrationStatus: event.capacity && currentRegsCount + 1 >= event.capacity ? "full" : event.registrationStatus,
    });

    return { regId, status: "confirmed" };
  },
});

export const getRegistrations = query({
  args: { token: v.string(), eventId: v.id("events") },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);

    const regs = await ctx.db
      .query("event_registrations")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .collect();

    const result = [];
    for (const reg of regs) {
      const member = await ctx.db.get(reg.memberId);
      if (member) {
        let sigName = undefined;
        if (member.sigAssociation) {
          const sig = await ctx.db.get(member.sigAssociation);
          if (sig) {
            sigName = sig.name;
          }
        }
        result.push({
          registrationId: reg._id,
          registeredAt: reg.registeredAt,
          status: reg.status,
          member: {
            id: member._id,
            name: member.name,
            email: member.email,
            studentId: member.studentId,
            department: member.department,
            year: member.year,
            section: member.section,
            sigAssociation: member.sigAssociation,
            sigName,
          },
        });
      }
    }
    return result;
  },
});
