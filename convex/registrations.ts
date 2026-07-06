import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// ─── Add a new registration ─────────────────────────────────
export const add = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    department: v.string(),
    year: v.string(),
    interests: v.array(v.string()),
    agreedToTerms: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check for duplicate email
    const existing = await ctx.db
      .query("registrations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("This email is already registered. Please use a different email address.");
    }

    const id = await ctx.db.insert("registrations", {
      ...args,
      status: "pending",
      registeredAt: new Date().toISOString(),
    });

    // Schedule welcome email (non-blocking)
    try {
      await ctx.scheduler.runAfter(0, internal.email.sendWelcomeEmail, {
        to: args.email,
        name: args.name,
      });
    } catch (e) {
      // Don't fail registration if email fails
      console.error("Failed to schedule welcome email:", e);
    }

    return id;
  },
});

// ─── List all registrations (for admin portal) ──────────────
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("registrations")
      .withIndex("by_registeredAt")
      .order("desc")
      .collect();
  },
});

// ─── Update registration status (approve/reject) ────────────
export const updateStatus = mutation({
  args: {
    id: v.id("registrations"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// ─── Delete a registration ──────────────────────────────────
export const remove = mutation({
  args: { id: v.id("registrations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
