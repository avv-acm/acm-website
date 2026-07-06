import { action } from "./_generated/server";
import { v } from "convex/values";

export const chatProxy = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("system"), v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
    apiKey: v.string(),
    baseUrl: v.string(),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const response = await fetch(args.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${args.apiKey}`
        },
        body: JSON.stringify({
          model: args.model || "opencode/deepseek-v4-flash-free",
          messages: args.messages,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API Error:", errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch failed in Convex Action:", error);
      throw new Error("Failed to contact AI API via Convex proxy.");
    }
  }
});
