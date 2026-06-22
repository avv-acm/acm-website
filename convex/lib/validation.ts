// ─── Input Validation & Sanitization Utilities ─────────────────────────────
// Used by all Convex mutations to validate and sanitize user input server-side.

/**
 * Sanitize a string to prevent XSS attacks.
 * Encodes HTML entities in user-provided strings.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Light sanitization — strips dangerous patterns but preserves readability.
 * Use for display text that won't be rendered as HTML.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .trim();
}

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate string length within bounds.
 */
export function isValidLength(
  value: string,
  min: number,
  max: number
): boolean {
  if (typeof value !== "string") return false;
  return value.trim().length >= min && value.trim().length <= max;
}

/**
 * Validate phone number format (basic international format).
 */
export function isValidPhone(phone: string): boolean {
  if (typeof phone !== "string" || phone.trim() === "") return true; // optional
  const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate URL format (for social media links, image URLs).
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== "string" || url.trim() === "") return true; // optional
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate a student ID format (e.g., AM.EN.U4CSE23005).
 */
export function isValidStudentId(id: string): boolean {
  if (typeof id !== "string") return false;
  // Accept flexible format: alphanumeric with dots and hyphens
  return /^[A-Za-z0-9.\-]{5,30}$/.test(id);
}

/**
 * Validate year format (e.g., "1st Year", "2nd Year", "3rd Year", "4th Year").
 */
export function isValidYear(year: string): boolean {
  if (typeof year !== "string" || year.trim() === "") return true; // optional
  return isValidLength(year, 1, 30);
}

/**
 * Validate social links object. Returns sanitized object.
 */
export function validateSocialLinks(links: Record<string, string | undefined>): {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
} {
  const result: Record<string, string | undefined> = {};
  const allowedKeys = ["github", "linkedin", "twitter", "instagram", "website"];

  for (const key of allowedKeys) {
    const value = links[key];
    if (value && typeof value === "string" && value.trim() !== "") {
      if (!isValidUrl(value)) {
        throw new Error(`Invalid URL for ${key}: ${value}`);
      }
      result[key] = sanitizeText(value.trim());
    }
  }

  return result;
}

/**
 * Validate and sanitize a complete member record.
 * Throws on validation failure.
 */
export function validateMemberInput(data: {
  name: string;
  email: string;
  studentId: string;
  type?: string;
  designation?: string;
  sigRole?: string;
  sigAssociation?: any;
  section?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    whatsapp?: string;
  };
  year?: string;
  department?: string;
  role?: string;
  phone?: string;
  interests?: string[];
}) {
  if (!isValidLength(data.name, 2, 100)) {
    throw new Error("Name must be between 2 and 100 characters");
  }
  if (!isValidEmail(data.email)) {
    throw new Error("Invalid email address format");
  }
  if (!isValidStudentId(data.studentId)) {
    throw new Error("Invalid student ID format");
  }
  if (data.phone && !isValidPhone(data.phone)) {
    throw new Error("Invalid phone number format");
  }
  if (data.year && !isValidYear(data.year)) {
    throw new Error("Invalid year format");
  }
  if (data.department && !isValidLength(data.department, 1, 100)) {
    throw new Error("Department must be under 100 characters");
  }
  if (data.role && !isValidLength(data.role, 1, 50)) {
    throw new Error("Role must be under 50 characters");
  }
  if (data.interests && data.interests.length > 10) {
    throw new Error("Maximum 10 interest tags allowed");
  }
  if (data.designation && !isValidLength(data.designation, 1, 100)) {
    throw new Error("Designation must be under 100 characters");
  }
  if (data.sigRole && !isValidLength(data.sigRole, 1, 100)) {
    throw new Error("SIG Role must be under 100 characters");
  }
  if (data.section && !isValidLength(data.section, 1, 10)) {
    throw new Error("Section must be under 10 characters");
  }

  let validatedSocialLinks;
  if (data.socialLinks) {
    validatedSocialLinks = validateSocialLinks(data.socialLinks);
  }

  const memberType = data.type === "faculty" ? "faculty" : "student";

  return {
    name: sanitizeText(data.name.trim()),
    email: data.email.trim().toLowerCase(),
    studentId: data.studentId.trim(),
    type: memberType as "student" | "faculty",
    designation: data.designation ? sanitizeText(data.designation.trim()) : undefined,
    sigRole: data.sigRole ? sanitizeText(data.sigRole.trim()) : undefined,
    sigAssociation: data.sigAssociation ? data.sigAssociation : undefined,
    section: data.section ? sanitizeText(data.section.trim()) : undefined,
    socialLinks: validatedSocialLinks,
    year: data.year ? sanitizeText(data.year.trim()) : undefined,
    department: data.department ? sanitizeText(data.department.trim()) : undefined,
    role: data.role ? sanitizeText(data.role.trim()) : undefined,
    phone: data.phone ? data.phone.trim() : undefined,
    interests: (data.interests ?? []).map((i) => sanitizeText(i.trim())),
  };
}

/**
 * Validate event input. Throws on validation failure.
 */
export function validateEventInput(data: {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity?: number;
  category: string;
  sigId?: any;
  resourcePerson?: {
    name: string;
    designation?: string;
    organization?: string;
    imageUrl?: string;
  };
}) {
  if (!isValidLength(data.title, 3, 200)) {
    throw new Error("Event title must be between 3 and 200 characters");
  }
  if (!isValidLength(data.date, 1, 50)) {
    throw new Error("Event date is required");
  }
  if (!isValidLength(data.time, 1, 50)) {
    throw new Error("Event time is required");
  }
  if (!isValidLength(data.location, 2, 200)) {
    throw new Error("Event location must be between 2 and 200 characters");
  }
  if (!isValidLength(data.description, 10, 5000)) {
    throw new Error("Event description must be between 10 and 5000 characters");
  }
  if (data.capacity !== undefined && (data.capacity < 0 || data.capacity > 10000)) {
    throw new Error("Capacity must be between 0 and 10,000");
  }

  const validCategories = ["hackathon", "workshop", "sig", "seminar", "social", "other"];
  if (!validCategories.includes(data.category)) {
    throw new Error("Invalid event category");
  }

  let validatedResourcePerson;
  if (data.resourcePerson) {
    if (!isValidLength(data.resourcePerson.name, 2, 100)) {
      throw new Error("Resource person name must be between 2 and 100 characters");
    }
    validatedResourcePerson = {
      name: sanitizeText(data.resourcePerson.name.trim()),
      designation: data.resourcePerson.designation ? sanitizeText(data.resourcePerson.designation.trim()) : undefined,
      organization: data.resourcePerson.organization ? sanitizeText(data.resourcePerson.organization.trim()) : undefined,
      imageUrl: data.resourcePerson.imageUrl ? data.resourcePerson.imageUrl.trim() : undefined,
    };
  }

  return {
    title: sanitizeText(data.title.trim()),
    date: sanitizeText(data.date.trim()),
    time: sanitizeText(data.time.trim()),
    location: sanitizeText(data.location.trim()),
    description: sanitizeText(data.description.trim()),
    capacity: data.capacity,
    category: data.category as "hackathon" | "workshop" | "sig" | "seminar" | "social" | "other",
    sigId: data.sigId ? data.sigId : undefined,
    resourcePerson: validatedResourcePerson,
  };
}

/**
 * Validate gallery memory input.
 */
export function validateMemoryInput(data: {
  title: string;
  summary: string;
  photos: string[];
  videoUrl?: string;
  tags?: string[];
}) {
  if (!isValidLength(data.title, 3, 200)) {
    throw new Error("Memory title must be between 3 and 200 characters");
  }
  if (!isValidLength(data.summary, 10, 2000)) {
    throw new Error("Memory summary must be between 10 and 2000 characters");
  }
  if (!Array.isArray(data.photos) || data.photos.length === 0) {
    throw new Error("At least one photo is required for memories");
  }

  return {
    title: sanitizeText(data.title.trim()),
    summary: sanitizeText(data.summary.trim()),
    photos: data.photos.map((url) => url.trim()),
    videoUrl: data.videoUrl ? data.videoUrl.trim() : undefined,
    tags: (data.tags ?? []).map((t) => sanitizeText(t.trim())),
  };
}
