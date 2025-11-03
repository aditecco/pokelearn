import type { ChallengeSet, Grade, Difficulty } from "../types";

export const challengeSets: ChallengeSet[] = [
  // Italiano - Grade 2
  {
    id: "1a1a1a1a-1b1b-41c1-a1d1-1e1f1a1b1c1d",
    name: "Italiano Base",
    description: "Impara le basi della lingua italiana",
    grade: 2,
    subject: "Italiano",
    difficulty: "Facile",
    icon: "📚",
    color: "#ef4444",
    challengeIds: [
      "a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6",
      "b2c3d4e5-f6a7-48b9-c0d1-e2f3a4b5c6d7",
      "c3d4e5f6-a7b8-49c0-d1e2-f3a4b5c6d7e8",
    ],
  },
  {
    id: "2b2b2b2b-2c2c-42d2-b2e2-2f2a2b2c2d2e",
    name: "Italiano Base",
    description: "Impara le basi della lingua italiana",
    grade: 2,
    subject: "Italiano",
    difficulty: "Medio",
    icon: "📚",
    color: "#ef4444",
    challengeIds: [
      "d4e5f6a7-b8c9-40d1-e2f3-a4b5c6d7e8f9",
      "e5f6a7b8-c9d0-41e2-f3a4-b5c6d7e8f9a0",
      "f6a7b8c9-d0e1-42f3-a4b5-c6d7e8f9a0b1",
    ],
  },
  {
    id: "3c3c3c3c-3d3d-43e3-c3f3-3a3b3c3d3e3f",
    name: "Italiano Base",
    description: "Impara le basi della lingua italiana",
    grade: 2,
    subject: "Italiano",
    difficulty: "Difficile",
    icon: "📚",
    color: "#ef4444",
    challengeIds: [
      "a7b8c9d0-e1f2-43a4-b5c6-d7e8f9a0b1c2",
      "b8c9d0e1-f2a3-44b5-c6d7-e8f9a0b1c2d3",
    ],
  },
  // Matematica - Grade 2
  {
    id: "4d4d4d4d-4e4e-44f4-d4a4-4b4c4d4e4f4a",
    name: "Matematica Base",
    description: "Addizioni, sottrazioni e molto altro",
    grade: 2,
    subject: "Matematica",
    difficulty: "Facile",
    icon: "🔢",
    color: "#3b82f6",
    challengeIds: [
      "c9d0e1f2-a3b4-45c6-d7e8-f9a0b1c2d3e4",
      "d0e1f2a3-b4c5-46d7-e8f9-a0b1c2d3e4f5",
      "e1f2a3b4-c5d6-47e8-f9a0-b1c2d3e4f5a6",
    ],
  },
  {
    id: "5e5e5e5e-5f5f-45a5-e5b5-5c5d5e5f5a5b",
    name: "Matematica Base",
    description: "Addizioni, sottrazioni e molto altro",
    grade: 2,
    subject: "Matematica",
    difficulty: "Medio",
    icon: "🔢",
    color: "#3b82f6",
    challengeIds: [
      "f2a3b4c5-d6e7-48f9-a0b1-c2d3e4f5a6b7",
      "a3b4c5d6-e7f8-49a0-b1c2-d3e4f5a6b7c8",
      "b4c5d6e7-f8a9-40b1-c2d3-e4f5a6b7c8d9",
    ],
  },
  {
    id: "6f6f6f6f-6a6a-46b6-f6c6-6d6e6f6a6b6c",
    name: "Matematica Base",
    description: "Addizioni, sottrazioni e molto altro",
    grade: 2,
    subject: "Matematica",
    difficulty: "Difficile",
    icon: "🔢",
    color: "#3b82f6",
    challengeIds: [
      "c5d6e7f8-a9b0-41c2-d3e4-f5a6b7c8d9e0",
      "d6e7f8a9-b0c1-42d3-e4f5-a6b7c8d9e0f1",
    ],
  },
  // Inglese - Grade 2
  {
    id: "7a7a7a7a-7b7b-47c7-a7d7-7e7f7a7b7c7d",
    name: "Inglese Base",
    description: "Le prime parole in inglese",
    grade: 2,
    subject: "Inglese",
    difficulty: "Facile",
    icon: "🌍",
    color: "#10b981",
    challengeIds: [
      "e7f8a9b0-c1d2-43e4-f5a6-b7c8d9e0f1a2",
      "f8a9b0c1-d2e3-44f5-a6b7-c8d9e0f1a2b3",
      "a9b0c1d2-e3f4-45a6-b7c8-d9e0f1a2b3c4",
    ],
  },
  {
    id: "8b8b8b8b-8c8c-48d8-b8e8-8f8a8b8c8d8e",
    name: "Inglese Base",
    description: "Le prime parole in inglese",
    grade: 2,
    subject: "Inglese",
    difficulty: "Medio",
    icon: "🌍",
    color: "#10b981",
    challengeIds: [
      "b0c1d2e3-f4a5-46b7-c8d9-e0f1a2b3c4d5",
      "c1d2e3f4-a5b6-47c8-d9e0-f1a2b3c4d5e6",
      "d2e3f4a5-b6c7-48d9-e0f1-a2b3c4d5e6f7",
    ],
  },
  {
    id: "9c9c9c9c-9d9d-49e9-c9f9-9a9b9c9d9e9f",
    name: "Inglese Base",
    description: "Le prime parole in inglese",
    grade: 2,
    subject: "Inglese",
    difficulty: "Difficile",
    icon: "🌍",
    color: "#10b981",
    challengeIds: [
      "e3f4a5b6-c7d8-49e0-f1a2-b3c4d5e6f7a8",
      "f4a5b6c7-d8e9-40f1-a2b3-c4d5e6f7a8b9",
    ],
  },
];

export function getChallengeSetsByGradeAndDifficulty(
  grade: Grade,
  difficulty: Difficulty,
): ChallengeSet[] {
  return challengeSets.filter(
    (set) => set.grade === grade && set.difficulty === difficulty,
  );
}

export function getChallengeSetById(id: string): ChallengeSet | undefined {
  return challengeSets.find((set) => set.id === id);
}
