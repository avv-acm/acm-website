import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdminSession, logAuditEvent } from "./lib/auth";
import { validateMemberInput, sanitizeText } from "./lib/validation";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("members").withIndex("by_joinDate").order("desc").collect();
  },
});

export const listAdmin = query({
  args: {
    token: v.string(),
    status: v.optional(v.string()),
    department: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);
    let members;
    if (args.status && args.status !== "all") {
      members = await ctx.db.query("members").withIndex("by_status", (q) => q.eq("status", args.status as any)).collect();
    } else {
      members = await ctx.db.query("members").withIndex("by_joinDate").order("desc").collect();
    }
    if (args.department && args.department !== "all") {
      members = members.filter((m) => m.department === args.department);
    }
    if (args.search && args.search.trim()) {
      const s = args.search.toLowerCase();
      members = members.filter((m) =>
        m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s) || m.studentId.toLowerCase().includes(s) || (m.rollNo && m.rollNo.toLowerCase().includes(s))
      );
    }
    return members;
  },
});

export const getById = query({
  args: { token: v.string(), id: v.id("members") },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);
    return await ctx.db.get(args.id);
  },
});

export const getStats = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await validateAdminSession(ctx, args.token);
    const all = await ctx.db.query("members").collect();
    const active = all.filter((m) => m.status === "active").length;
    const inactive = all.filter((m) => m.status === "inactive").length;
    const alumni = all.filter((m) => m.status === "alumni").length;
    const pending = all.filter((m) => m.status === "pending").length;
    const interests: Record<string, number> = {};
    for (const m of all) {
      for (const i of m.interests) { interests[i] = (interests[i] ?? 0) + 1; }
      if (m.interest) { interests[m.interest] = (interests[m.interest] ?? 0) + 1; }
    }
    const departments: Record<string, number> = {};
    for (const m of all) {
      const dept = m.department ?? "Unspecified";
      departments[dept] = (departments[dept] ?? 0) + 1;
    }
    return { total: all.length, active, inactive, alumni, pending, interests, departments };
  },
});

export const add = mutation({
  args: {
    token: v.string(), name: v.string(), email: v.string(), studentId: v.string(),
    type: v.optional(v.string()), designation: v.optional(v.string()),
    sigRole: v.optional(v.string()), sigAssociation: v.optional(v.id("sigs")),
    section: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      instagram: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
    })),
    year: v.optional(v.string()), department: v.optional(v.string()), role: v.optional(v.string()),
    status: v.optional(v.string()), phone: v.optional(v.string()),
    interests: v.optional(v.array(v.string())), profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);
    const validated = validateMemberInput({
      name: args.name, email: args.email, studentId: args.studentId,
      type: args.type, designation: args.designation, sigRole: args.sigRole,
      sigAssociation: args.sigAssociation, section: args.section, socialLinks: args.socialLinks,
      year: args.year, department: args.department, role: args.role, phone: args.phone, interests: args.interests
    });
    const existingEmail = await ctx.db.query("members").withIndex("by_email", (q) => q.eq("email", validated.email)).first();
    if (existingEmail) throw new Error("A member with this email already exists");
    const existingId = await ctx.db.query("members").withIndex("by_studentId", (q) => q.eq("studentId", validated.studentId)).first();
    if (existingId) throw new Error("A member with this student ID already exists");
    const status = (args.status as "active" | "inactive" | "alumni" | "pending") ?? "active";
    const now = new Date().toISOString();
    const id = await ctx.db.insert("members", {
      name: validated.name, email: validated.email, studentId: validated.studentId,
      type: validated.type, designation: validated.designation, sigRole: validated.sigRole,
      sigAssociation: validated.sigAssociation as any, section: validated.section, socialLinks: validated.socialLinks,
      year: validated.year, department: validated.department, role: validated.role,
      status, joinDate: now, phone: validated.phone, interests: validated.interests,
      profileImageUrl: args.profileImageUrl, rollNo: validated.studentId, interest: validated.interests[0], joinedAt: now,
    });
    await logAuditEvent(ctx, { userId: user._id, userName: user.name, action: "MEMBER_CREATED", resource: "members", resourceId: id, details: `Created member: ${validated.name} (${validated.email})` });
    return id;
  },
});

export const update = mutation({
  args: {
    token: v.string(), id: v.id("members"), name: v.string(), email: v.string(), studentId: v.string(),
    type: v.optional(v.string()), designation: v.optional(v.string()),
    sigRole: v.optional(v.string()), sigAssociation: v.optional(v.id("sigs")),
    section: v.optional(v.string()),
    socialLinks: v.optional(v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      instagram: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
    })),
    year: v.optional(v.string()), department: v.optional(v.string()), role: v.optional(v.string()),
    status: v.optional(v.string()), phone: v.optional(v.string()),
    interests: v.optional(v.array(v.string())), profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Member not found");
    const validated = validateMemberInput({
      name: args.name, email: args.email, studentId: args.studentId,
      type: args.type, designation: args.designation, sigRole: args.sigRole,
      sigAssociation: args.sigAssociation, section: args.section, socialLinks: args.socialLinks,
      year: args.year, department: args.department, role: args.role, phone: args.phone, interests: args.interests
    });
    if (validated.email !== existing.email) {
      const dup = await ctx.db.query("members").withIndex("by_email", (q) => q.eq("email", validated.email)).first();
      if (dup) throw new Error("A member with this email already exists");
    }
    if (validated.studentId !== existing.studentId) {
      const dup = await ctx.db.query("members").withIndex("by_studentId", (q) => q.eq("studentId", validated.studentId)).first();
      if (dup) throw new Error("A member with this student ID already exists");
    }
    const status = (args.status as "active" | "inactive" | "alumni" | "pending") ?? existing.status;
    await ctx.db.patch(args.id, {
      name: validated.name, email: validated.email, studentId: validated.studentId,
      type: validated.type, designation: validated.designation, sigRole: validated.sigRole,
      sigAssociation: validated.sigAssociation as any, section: validated.section, socialLinks: validated.socialLinks,
      year: validated.year, department: validated.department, role: validated.role,
      status, phone: validated.phone, interests: validated.interests, profileImageUrl: args.profileImageUrl,
      rollNo: validated.studentId, interest: validated.interests[0]
    });
    await logAuditEvent(ctx, { userId: user._id, userName: user.name, action: "MEMBER_UPDATED", resource: "members", resourceId: args.id, details: `Updated member: ${validated.name}` });
    return { success: true };
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("members") },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);
    const member = await ctx.db.get(args.id);
    if (!member) throw new Error("Member not found");
    await ctx.db.delete(args.id);
    await logAuditEvent(ctx, { userId: user._id, userName: user.name, action: "MEMBER_DELETED", resource: "members", resourceId: args.id, details: `Deleted member: ${member.name} (${member.email})`, severity: "warning" });
    return { success: true };
  },
});

export const bulkDelete = mutation({
  args: { token: v.string(), ids: v.array(v.id("members")) },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);
    let count = 0;
    for (const id of args.ids) {
      const member = await ctx.db.get(id);
      if (member) { await ctx.db.delete(id); count++; }
    }
    await logAuditEvent(ctx, { userId: user._id, userName: user.name, action: "MEMBERS_BULK_DELETED", resource: "members", details: `Bulk deleted ${count} members`, severity: "warning" });
    return { success: true, deleted: count };
  },
});

export const bulkUpdateStatus = mutation({
  args: { token: v.string(), ids: v.array(v.id("members")), status: v.union(v.literal("active"), v.literal("inactive"), v.literal("alumni"), v.literal("pending")) },
  handler: async (ctx, args) => {
    const { user } = await validateAdminSession(ctx, args.token);
    for (const id of args.ids) { const m = await ctx.db.get(id); if (m) await ctx.db.patch(id, { status: args.status }); }
    await logAuditEvent(ctx, { userId: user._id, userName: user.name, action: "MEMBERS_BULK_STATUS", resource: "members", details: `Updated ${args.ids.length} members to ${args.status}` });
    return { success: true, updated: args.ids.length };
  },
});

export const addPublic = mutation({
  args: { name: v.string(), email: v.string(), rollNo: v.string(), interest: v.string() },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("members", {
      name: sanitizeText(args.name.trim()), email: args.email.trim().toLowerCase(),
      studentId: args.rollNo.trim(), status: "pending", joinDate: now,
      interests: [args.interest], rollNo: args.rollNo.trim(), interest: args.interest, joinedAt: now,
    });
  },
});
