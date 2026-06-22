import { query, mutation } from "./_generated/server";
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
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("contact_inquiries") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
