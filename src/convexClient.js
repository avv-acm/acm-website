import { ConvexReactClient } from "convex/react";
import { api } from "../convex/_generated/api";

// SECURITY: Convex URL must come from environment variables only.
// Never hardcode the self-hosted server IP in source code.
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.error(
    "[ACM Website] VITE_CONVEX_URL is not set. " +
    "Create a .env.local file with VITE_CONVEX_URL=<your-convex-url>. " +
    "The application will run but database features will be unavailable."
  );
}

export const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export { api };
