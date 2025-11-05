import { createClient } from "@sanity/client";
import { challenges } from "../data/challenges.ts";
import { challengeSets } from "../data/challengeSets.ts";

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId) {
  console.error("Missing VITE_SANITY_PROJECT_ID environment variable");
  process.exit(1);
}

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN environment variable");
  console.log("Get your token from: https://www.sanity.io/manage");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: "2024-01-01",
  token,
});

async function migrateChallenges() {
  console.log(`\nMigrating ${challenges.length} challenges...`);

  for (const challenge of challenges) {
    const doc = {
      _type: "challenge",
      _id: challenge.id,
      slug: {
        _type: "slug",
        current: challenge.id,
      },
      subject: challenge.subject,
      grade: challenge.grade,
      difficulty: challenge.difficulty,
      type: challenge.type,
      question: challenge.question,
      options: challenge.options || [],
      correctAnswer: challenge.correctAnswer,
      points: challenge.points,
      isPublished: true,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`✓ Migrated challenge: ${challenge.id}`);
    } catch (error) {
      console.error(`✗ Failed to migrate challenge ${challenge.id}:`, error);
    }
  }
}

async function migrateChallengeSets() {
  console.log(`\nMigrating ${challengeSets.length} challenge sets...`);

  for (const set of challengeSets) {
    const doc = {
      _type: "challengeSet",
      _id: set.id,
      slug: {
        _type: "slug",
        current: set.id,
      },
      name: set.name,
      description: set.description,
      grade: set.grade,
      subject: set.subject,
      difficulty: set.difficulty,
      challenges: set.challengeIds.map((id) => ({
        _type: "reference",
        _ref: id,
        _key: id,
      })),
      icon: set.icon,
      color: set.color,
      isPublished: true,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`✓ Migrated set: ${set.id}`);
    } catch (error) {
      console.error(`✗ Failed to migrate set ${set.id}:`, error);
    }
  }
}

async function main() {
  console.log("Starting migration to Sanity CMS");
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);

  try {
    await migrateChallenges();
    await migrateChallengeSets();
    console.log("\n✓ Migration completed successfully!");
  } catch (error) {
    console.error("\n✗ Migration failed:", error);
    process.exit(1);
  }
}

main();
