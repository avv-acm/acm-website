/**
 * Centralized localStorage adapter for the ACM Admin Portal.
 * All admin modules use this instead of Convex.
 *
 * Storage keys:
 *  - acm_portal_members   → Member[]
 *  - acm_portal_events    → Event[]
 *  - acm_portal_sigs      → Record<string, Sig>  (public app format)
 *  - acm_admin_sigs       → AdminSig[]           (admin-specific format with _id)
 *  - acm_portal_committee → CommitteeMember[]
 *  - acm_portal_faculty   → FacultyMember[]
 *  - acm_admin_resources  → Resource[]
 *  - acm_admin_gallery    → Memory[]
 *  - acm_audit_logs       → AuditLog[]
 */

// ── ID generator ──────────────────────────────────────────────────────────────
export function genId(prefix = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Generic CRUD ──────────────────────────────────────────────────────────────
export function dbLoad<T>(key: string, defaults: T[] = []): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

export function dbSave<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function dbAdd<T extends { _id: string }>(key: string, item: Omit<T, "_id">, defaults?: any[]): T {
  const list = dbLoad<T>(key, defaults);
  const newItem = { _id: genId(), ...item } as T;
  dbSave(key, [newItem, ...list]);
  return newItem;
}

export function dbUpdate<T extends { _id: string }>(key: string, id: string, updates: Partial<T>, defaults?: any[]): void {
  const list = dbLoad<T>(key, defaults);
  dbSave(key, list.map((item) => (item._id === id ? { ...item, ...updates } : item)));
}

export function dbRemove<T extends { _id: string }>(key: string, id: string, defaults?: any[]): void {
  const list = dbLoad<T>(key, defaults);
  dbSave(key, list.filter((item) => item._id !== id));
}

// ── Audit log ─────────────────────────────────────────────────────────────────
const AUDIT_KEY = "acm_audit_logs";

export function auditLog(action: string, resource: string, details?: string, severity: "info" | "warning" | "critical" = "info") {
  const logs = dbLoad<any>(AUDIT_KEY);
  const newLog = {
    _id: genId("log"),
    action,
    resource,
    details: details || "",
    severity,
    timestamp: new Date().toISOString(),
  };
  // Keep last 200 logs
  const updated = [newLog, ...logs].slice(0, 200);
  dbSave(AUDIT_KEY, updated);
}

// ── Members ───────────────────────────────────────────────────────────────────
const MEMBERS_KEY = "acm_portal_members";

export const DEFAULT_MEMBERS = [
  { _id: "ACM-129034", name: "Aswin Kumar", email: "aswin@am.amrita.edu", studentId: "AM.EN.U4CSE23005", rollNo: "AM.EN.U4CSE23005", year: "3rd Year", department: "Computer Science and Engineering", interest: "web", status: "active", type: "student", role: "Member", joinedAt: "2026-03-12T10:30:00Z" },
  { _id: "ACM-903482", name: "Nisha Sundar", email: "nisha@am.amrita.edu", studentId: "AM.EN.U4CSE23114", rollNo: "AM.EN.U4CSE23114", year: "3rd Year", department: "Computer Science and Engineering", interest: "ai-ml", status: "active", type: "student", role: "Member", joinedAt: "2026-04-01T15:20:00Z" },
  { _id: "ACM-549832", name: "Adithya R", email: "adithya@am.amrita.edu", studentId: "AM.EN.U4ECE23012", rollNo: "AM.EN.U4ECE23012", year: "3rd Year", department: "Electrical and Communication Engineering", interest: "cp", status: "active", type: "student", role: "Member", joinedAt: "2026-04-18T09:12:00Z" },
  { _id: "ACM-763421", name: "Maria Sharon", email: "maria@am.amrita.edu", studentId: "AM.EN.U4CSE23055", rollNo: "AM.EN.U4CSE23055", year: "3rd Year", department: "Computer Science and Engineering", interest: "ui-ux", status: "active", type: "student", role: "Member", joinedAt: "2026-05-02T14:45:00Z" },
  { _id: "ACM-219803", name: "Rahul Krishnan", email: "rahul@am.amrita.edu", studentId: "AM.EN.U4CSE23087", rollNo: "AM.EN.U4CSE23087", year: "3rd Year", department: "Computer Science and Engineering", interest: "cyber", status: "active", type: "student", role: "Member", joinedAt: "2026-05-20T11:00:00Z" },
];

export function loadMembers(): any[] {
  return dbLoad<any>(MEMBERS_KEY, DEFAULT_MEMBERS);
}
export function saveMembers(members: any[]): void {
  dbSave(MEMBERS_KEY, members);
}

// ── Events ────────────────────────────────────────────────────────────────────
const EVENTS_KEY = "acm_portal_events";

export const DEFAULT_EVENTS = [
  { _id: "hacknight", title: "ACM Hardening HackNight 2026", category: "hackathon", date: "June 28-29", location: "Nagercoil Main Lab", desc: "A 24-hour non-stop coding competition.", featured: true, time: "09:00 AM", published: true, registrationStatus: "open", image: "", bannerImageUrl: "" },
  { _id: "gemini-bootcamp", title: "AI Bootcamp: Gemini Core Concepts", category: "workshop", date: "July 04", location: "Seminar Hall II", desc: "Hands-on workshop for Gemini developer API.", featured: true, time: "10:00 AM", published: true, registrationStatus: "open", image: "", bannerImageUrl: "" },
  { _id: "sig-cyber", title: "Zero-Trust Architectures & Pen Testing", category: "sig", date: "July 12", location: "Virtual Classroom 3", desc: "CTF demo.", featured: false, time: "02:00 PM", published: true, registrationStatus: "open", image: "", bannerImageUrl: "" },
];

export function loadEvents(): any[] {
  return dbLoad<any>(EVENTS_KEY, DEFAULT_EVENTS);
}
export function saveEvents(events: any[]): void {
  dbSave(EVENTS_KEY, events);
  // Also sync the key the public app uses
  dbSave(EVENTS_KEY, events);
}

// ── SIGs (Admin format with _id) ─────────────────────────────────────────────
const ADMIN_SIGS_KEY = "acm_admin_sigs";

export const DEFAULT_ADMIN_SIGS = [
  { _id: "sig-ai-ml", name: "SIG-AI/ML", focusArea: "Artificial Intelligence & Machine Learning", description: "Deep learning, NLP, Gemini APIs, and real-world intelligence integration.", membersCount: 45, status: "active", lead: "Nisha Sundar", joinNowEnabled: true },
  { _id: "sig-web", name: "SIG-Web", focusArea: "Web Development & Design", description: "Modern web architectures, performance, UI/UX, and responsive layouts.", membersCount: 60, status: "active", lead: "Mounesh S.", joinNowEnabled: true },
  { _id: "sig-security", name: "SIG-CyberSecurity", focusArea: "Application & Network Security", description: "Security architectures, app hardening, authentication protocols, and cryptography.", membersCount: 30, status: "active", lead: "Rahul Krishnan", joinNowEnabled: true },
  { _id: "sig-cp", name: "SIG-CP", focusArea: "Competitive Programming", description: "Advanced data structures, algorithms, and global competition preparation.", membersCount: 50, status: "active", lead: "Adithya R.", joinNowEnabled: true },
];

export function loadAdminSigs(): any[] {
  return dbLoad<any>(ADMIN_SIGS_KEY, DEFAULT_ADMIN_SIGS);
}
export function saveAdminSigs(sigs: any[]): void {
  dbSave(ADMIN_SIGS_KEY, sigs);
}

// ── Gallery / Memories ────────────────────────────────────────────────────────
const GALLERY_KEY = "acm_admin_gallery";

export const DEFAULT_GALLERY: any[] = [];

export function loadGallery(): any[] {
  return dbLoad<any>(GALLERY_KEY, DEFAULT_GALLERY);
}
export function saveGallery(items: any[]): void {
  dbSave(GALLERY_KEY, items);
}

// ── Resources ─────────────────────────────────────────────────────────────────
// Note: ResourceList.tsx already manages its own key "acm_admin_resources"
// We expose these helpers for consistency
const RESOURCES_KEY = "acm_admin_resources";

export function loadResources(): any[] {
  return dbLoad<any>(RESOURCES_KEY, []);
}

// ── Audit logs (read) ─────────────────────────────────────────────────────────
export function loadAuditLogs(): any[] {
  return dbLoad<any>(AUDIT_KEY, []);
}
