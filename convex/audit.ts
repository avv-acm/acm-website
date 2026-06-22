import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdminSession } from "./lib/auth";

// ─── Admin Queries ───────────────────────────────────────────

export const listLogs = query({
  args: {
    token: v.string(),
    severity: v.optional(v.string()),
    resource: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);

    let logsQuery = ctx.db.query("audit_logs").withIndex("by_timestamp").order("desc");

    let logs = await logsQuery.collect();

    if (args.severity && args.severity !== "all") {
      logs = logs.filter((l) => l.severity === args.severity);
    }

    if (args.resource && args.resource !== "all") {
      logs = logs.filter((l) => l.resource === args.resource);
    }

    const limitVal = args.limit ?? 200;
    return logs.slice(0, limitVal);
  },
});

// ─── Retention Cleanup Mutation ────────────────────────────────

export const cleanupOldLogs = mutation({
  args: {
    token: v.string(),
    retentionDays: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);
    
    // Only super_admin can purge logs manually
    if (user.role !== "super_admin") {
      throw new Error("UNAUTHORIZED: Only super admins can clean up logs");
    }

    const cutOffDate = new Date(Date.now() - args.retentionDays * 24 * 60 * 60 * 1000).toISOString();
    
    const oldLogs = await ctx.db
      .query("audit_logs")
      .withIndex("by_timestamp", (q) => q.lt("timestamp", cutOffDate))
      .collect();

    let deletedCount = 0;
    for (const log of oldLogs) {
      await ctx.db.delete(log._id);
      deletedCount++;
    }

    await ctx.db.insert("audit_logs", {
      userId: user._id,
      userName: user.name,
      action: "AUDIT_CLEANUP",
      resource: "audit_logs",
      details: `Cleaned up ${deletedCount} audit logs older than ${args.retentionDays} days`,
      severity: "warning",
      timestamp: new Date().toISOString(),
    });

    return { success: true, count: deletedCount };
  },
});
