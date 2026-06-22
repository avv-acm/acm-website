import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── Admin Users & Sessions ───────────────────────────────
  admin_users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
    name: v.string(),
    role: v.union(v.literal("super_admin"), v.literal("admin"), v.literal("editor")),
    lastLogin: v.optional(v.string()),
    createdAt: v.string(),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),

  admin_sessions: defineTable({
    userId: v.id("admin_users"),
    token: v.string(),
    expiresAt: v.number(),
    userAgent: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"])
    .index("by_expiresAt", ["expiresAt"]),

  // ─── Rate Limiting ────────────────────────────────────────
  rate_limits: defineTable({
    key: v.string(),
    attempts: v.number(),
    windowStart: v.number(),
  }).index("by_key", ["key"]),

  // ─── Members (expanded) ───────────────────────────────────
  members: defineTable({
    name: v.string(),
    email: v.string(),
    studentId: v.string(),
    type: v.optional(v.union(v.literal("student"), v.literal("faculty"))),
    designation: v.optional(v.string()),
    sigRole: v.optional(v.string()),
    sigAssociation: v.optional(v.id("sigs")),
    section: v.optional(v.string()),
    socialLinks: v.optional(
      v.object({
        github: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        instagram: v.optional(v.string()),
        whatsapp: v.optional(v.string()),
      })
    ),
    year: v.optional(v.string()),
    department: v.optional(v.string()),
    role: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("alumni"), v.literal("pending")),
    joinDate: v.string(),
    phone: v.optional(v.string()),
    interests: v.array(v.string()),
    profileImageUrl: v.optional(v.string()),
    // Student portal auth
    portalPasswordHash: v.optional(v.string()),
    portalPasswordSalt: v.optional(v.string()),
    portalEnabled: v.optional(v.boolean()),
    lastPortalLogin: v.optional(v.string()),
    // Legacy field mapping
    rollNo: v.optional(v.string()),
    interest: v.optional(v.string()),
    joinedAt: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_studentId", ["studentId"])
    .index("by_status", ["status"])
    .index("by_joinDate", ["joinDate"])
    .index("by_department", ["department"])
    .index("by_joinedAt", ["joinedAt"]),

  // ─── Events ───────────────────────────────────────────────
  events: defineTable({
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
    registrationCount: v.optional(v.number()),
    createdBy: v.optional(v.id("admin_users")),
    createdAt: v.string(),
    updatedAt: v.string(),
    sigId: v.optional(v.id("sigs")),
    resourcePerson: v.optional(
      v.object({
        name: v.string(),
        designation: v.optional(v.string()),
        organization: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })
    ),
  })
    .index("by_date", ["date"])
    .index("by_category", ["category"])
    .index("by_published", ["published"])
    .index("by_featured", ["featured"]),

  // ─── Event Registrations ──────────────────────────────────
  event_registrations: defineTable({
    eventId: v.id("events"),
    memberId: v.id("members"),
    registeredAt: v.string(),
    status: v.union(v.literal("confirmed"), v.literal("cancelled"), v.literal("waitlisted")),
  })
    .index("by_eventId", ["eventId"])
    .index("by_memberId", ["memberId"]),

  // ─── SIGs (Special Interest Groups) ───────────────────────
  sigs: defineTable({
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
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  // ─── SIG Committee Members ────────────────────────────────
  sig_committee: defineTable({
    sigId: v.id("sigs"),
    name: v.string(),
    role: v.string(),
    bio: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socialLinks: v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    displayOrder: v.number(),
    createdAt: v.string(),
  }).index("by_sigId", ["sigId"]),

  // ─── SIG Faculty Advisors ────────────────────────────────
  sig_faculty: defineTable({
    sigId: v.id("sigs"),
    name: v.string(),
    role: v.string(),
    department: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socialLinks: v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    displayOrder: v.number(),
    createdAt: v.string(),
  }).index("by_sigId", ["sigId"]),

  // ─── Core Committee (Club-level) ─────────────────────────
  core_committee: defineTable({
    name: v.string(),
    role: v.string(),
    bio: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socialLinks: v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    displayOrder: v.number(),
    createdAt: v.string(),
  }),

  // ─── Faculty Advisors (Club-level) ───────────────────────
  faculty_advisors: defineTable({
    name: v.string(),
    role: v.string(),
    department: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socialLinks: v.object({
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    displayOrder: v.number(),
    createdAt: v.string(),
  }),

  // ─── Audit Logs ──────────────────────────────────────────
  audit_logs: defineTable({
    userId: v.optional(v.id("admin_users")),
    userName: v.optional(v.string()),
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    details: v.optional(v.string()),
    severity: v.union(v.literal("info"), v.literal("warning"), v.literal("error"), v.literal("critical")),
    timestamp: v.string(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_resource", ["resource"])
    .index("by_severity", ["severity"]),

  // ─── Student Portal Sessions ─────────────────────────────
  student_sessions: defineTable({
    memberId: v.id("members"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.string(),
  })
    .index("by_token", ["token"])
    .index("by_memberId", ["memberId"]),

  // ─── Event Memories (Gallery) ───────────────────────────
  event_memories: defineTable({
    eventId: v.id("events"),
    title: v.string(),
    summary: v.string(),
    photos: v.array(v.string()),
    videoUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    published: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_eventId", ["eventId"])
    .index("by_published", ["published"]),

  // ─── Contact Inquiries (existing, preserved) ─────────────
  contact_inquiries: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    message: v.string(),
    timestamp: v.string(),
  }).index("by_timestamp", ["timestamp"]),
});
