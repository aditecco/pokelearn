import type {
  Challenge,
  ChallengeSet,
  Subject,
  Difficulty,
  Grade,
} from "../types";
import { sanityClient, isSanityConfigured } from "./sanity";
import { challenges as demoChallenges } from "../data/challenges";
import { challengeSets as demoChallengesSets } from "../data/challengeSets";

type SanityChallenge = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  slug: { current: string };
  subject: Subject;
  grade: Grade;
  difficulty: Difficulty;
  type: "multiple-choice" | "true-false" | "fill-blank";
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
  hint?: string;
  media?: Array<{
    type: "image" | "audio";
    asset: { url: string };
    alt?: string;
  }>;
  tags?: string[];
  isPublished?: boolean;
};

type SanityChallengeSet = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  slug: { current: string };
  name: string;
  description: string;
  grade: Grade;
  subject: Subject;
  difficulty: Difficulty;
  challenges: Array<{ _id: string }>;
  icon: string;
  color: string;
  estimatedMinutes?: number;
  prerequisites?: Array<{ _id: string }>;
  isPublished?: boolean;
};

function transformSanityChallenge(sanityChallenge: SanityChallenge): Challenge {
  return {
    id: sanityChallenge._id,
    subject: sanityChallenge.subject,
    grade: sanityChallenge.grade,
    difficulty: sanityChallenge.difficulty,
    type: sanityChallenge.type,
    question: sanityChallenge.question,
    options: sanityChallenge.options,
    correctAnswer: sanityChallenge.correctAnswer,
    points: sanityChallenge.points,
    explanation: sanityChallenge.explanation,
    hint: sanityChallenge.hint,
    media: sanityChallenge.media?.map((m) => ({
      type: m.type,
      url: m.asset.url,
      alt: m.alt,
    })),
    tags: sanityChallenge.tags,
    isPublished: sanityChallenge.isPublished,
    _createdAt: sanityChallenge._createdAt,
    _updatedAt: sanityChallenge._updatedAt,
  };
}

function transformSanityChallengeSet(
  sanityChallengeSet: SanityChallengeSet,
): ChallengeSet {
  return {
    id: sanityChallengeSet._id,
    name: sanityChallengeSet.name,
    description: sanityChallengeSet.description,
    grade: sanityChallengeSet.grade,
    subject: sanityChallengeSet.subject,
    difficulty: sanityChallengeSet.difficulty,
    challengeIds: sanityChallengeSet.challenges.map((c) => c._id),
    icon: sanityChallengeSet.icon,
    color: sanityChallengeSet.color,
    estimatedMinutes: sanityChallengeSet.estimatedMinutes,
    prerequisites: sanityChallengeSet.prerequisites?.map((p) => p._id),
    isPublished: sanityChallengeSet.isPublished,
    _createdAt: sanityChallengeSet._createdAt,
    _updatedAt: sanityChallengeSet._updatedAt,
  };
}

async function fetchChallengesFromSanity(): Promise<Challenge[]> {
  const query = `*[_type == "challenge" && isPublished == true] {
    _id,
    _createdAt,
    _updatedAt,
    slug,
    subject,
    grade,
    difficulty,
    type,
    question,
    options,
    correctAnswer,
    points,
    explanation,
    hint,
    media[] {
      type,
      asset-> { url },
      alt
    },
    tags,
    isPublished
  }`;

  const sanityChallenges = await sanityClient.fetch<SanityChallenge[]>(query);
  return sanityChallenges.map(transformSanityChallenge);
}

async function fetchChallengeSetsFromSanity(): Promise<ChallengeSet[]> {
  const query = `*[_type == "challengeSet" && isPublished == true] {
    _id,
    _createdAt,
    _updatedAt,
    slug,
    name,
    description,
    grade,
    subject,
    difficulty,
    challenges[]-> { _id },
    icon,
    color,
    estimatedMinutes,
    prerequisites[]-> { _id },
    isPublished
  }`;

  const sanitySets = await sanityClient.fetch<SanityChallengeSet[]>(query);
  return sanitySets.map(transformSanityChallengeSet);
}

export async function fetchChallenges(): Promise<Challenge[]> {
  if (!isSanityConfigured) {
    console.info("Sanity not configured, using demo challenges");
    return demoChallenges;
  }

  try {
    const challenges = await fetchChallengesFromSanity();
    if (challenges.length === 0) {
      console.warn("No challenges found in Sanity, using demo challenges");
      return demoChallenges;
    }
    return challenges;
  } catch (error) {
    console.error("Failed to fetch challenges from Sanity:", error);
    console.info("Falling back to demo challenges");
    return demoChallenges;
  }
}

export async function fetchChallengeSets(): Promise<ChallengeSet[]> {
  if (!isSanityConfigured) {
    console.info("Sanity not configured, using demo challenge sets");
    return demoChallengesSets;
  }

  try {
    const sets = await fetchChallengeSetsFromSanity();
    if (sets.length === 0) {
      console.warn("No challenge sets found in Sanity, using demo sets");
      return demoChallengesSets;
    }
    return sets;
  } catch (error) {
    console.error("Failed to fetch challenge sets from Sanity:", error);
    console.info("Falling back to demo challenge sets");
    return demoChallengesSets;
  }
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  const challenges = await fetchChallenges();
  return challenges.find((c) => c.id === id) || null;
}

export async function getChallengeSetById(
  id: string,
): Promise<ChallengeSet | null> {
  const sets = await fetchChallengeSets();
  return sets.find((s) => s.id === id) || null;
}

export async function getChallengesByFilters(
  subject: Subject,
  difficulty: Difficulty,
): Promise<Challenge[]> {
  const challenges = await fetchChallenges();
  return challenges.filter(
    (c) => c.subject === subject && c.difficulty === difficulty,
  );
}

export async function getRandomChallenge(
  subject: Subject,
  difficulty: Difficulty,
): Promise<Challenge | null> {
  const filtered = await getChallengesByFilters(subject, difficulty);
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export async function getChallengeSetsByGradeAndDifficulty(
  grade: Grade,
  difficulty: Difficulty,
): Promise<ChallengeSet[]> {
  const sets = await fetchChallengeSets();
  return sets.filter(
    (set) => set.grade === grade && set.difficulty === difficulty,
  );
}
