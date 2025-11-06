import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: "2024-01-01",
});

export const isSanityConfigured = !!projectId;
