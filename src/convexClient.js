import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "../convex/_generated/api";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

export const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export { api };
