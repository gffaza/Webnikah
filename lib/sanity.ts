import "server-only";
import { createClient, type SanityClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

/** Null until SANITY_PROJECT_ID and SANITY_API_TOKEN are set; callers degrade gracefully. */
export const sanity: SanityClient | null =
  projectId && token
    ? createClient({
        projectId,
        dataset,
        token,
        apiVersion: "2025-01-01",
        useCdn: false,
        perspective: "published",
      })
    : null;
