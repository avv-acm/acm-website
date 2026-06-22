/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_auth from "../admin_auth.js";
import type * as audit from "../audit.js";
import type * as contact_inquiries from "../contact_inquiries.js";
import type * as events from "../events.js";
import type * as leadership from "../leadership.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_validation from "../lib/validation.js";
import type * as members from "../members.js";
import type * as memories from "../memories.js";
import type * as sig_people from "../sig_people.js";
import type * as sigs from "../sigs.js";
import type * as student_portal from "../student_portal.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin_auth: typeof admin_auth;
  audit: typeof audit;
  contact_inquiries: typeof contact_inquiries;
  events: typeof events;
  leadership: typeof leadership;
  "lib/auth": typeof lib_auth;
  "lib/validation": typeof lib_validation;
  members: typeof members;
  memories: typeof memories;
  sig_people: typeof sig_people;
  sigs: typeof sigs;
  student_portal: typeof student_portal;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
