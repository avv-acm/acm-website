import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("contact_inquiries")
      .withIndex("by_timestamp")
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("contact_inquiries", {
      ...args,
      timestamp: new Date().toISOString(),
    });

    // Schedule acknowledgement email (non-blocking)
    try {
      await ctx.scheduler.runAfter(0, internal.email.sendSupportAck, {
        to: args.email,
        name: args.name,
        subject: args.subject || "General Inquiry",
      });
    } catch (e) {
      console.error("Failed to schedule support ack email:", e);
    }

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("contact_inquiries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
