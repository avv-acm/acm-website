import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logInterest = mutation({
  args: {
    sessionId: v.string(),
    userMessage: v.string(),
    aiResponse: v.string(),
    extractedInterest: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = new Date().toISOString();
    await ctx.db.insert("chat_logs", {
      sessionId: args.sessionId,
      userMessage: args.userMessage,
      aiResponse: args.aiResponse,
      extractedInterest: args.extractedInterest,
      timestamp,
    });
    return { success: true };
  },
});
