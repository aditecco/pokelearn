import type { ChallengeSet, Grade, Difficulty } from "../types";

export const challengeSets: ChallengeSet[] = [
  // Italiano - Grade 2
  {
    id: "italiano-facile",
    name: "Italiano Base",
    description: "Impara le basi della lingua italiana",
    grade: 2,
    subject: "Italiano",
    difficulty: "Facile",
    icon: "📚",
    color: "#ef4444",
    challengeIds: ["ita-2-f-1", "ita-2-f-2", "ita-2-f-3"],
  },
  {
    id: "italiano-medio",
    name: "Italiano Base",
    description: "Impara le basi della lingua italiana",
    grade: 2,
    subject: "Italiano",
    difficulty: "Medio",
    icon: "📚",
    color: "#ef4444",
    challengeIds: ["ita-2-m-1", "ita-2-m-2", "ita-2-m-3"],
  },
  {
    id: "italiano-difficile",
    name: "Italiano Base",
    description: "Impara le basi della lingua italiana",
    grade: 2,
    subject: "Italiano",
    difficulty: "Difficile",
    icon: "📚",
    color: "#ef4444",
    challengeIds: ["ita-2-d-1", "ita-2-d-2"],
  },
  // Matematica - Grade 2
  {
    id: "matematica-facile",
    name: "Matematica Base",
    description: "Addizioni, sottrazioni e molto altro",
    grade: 2,
    subject: "Matematica",
    difficulty: "Facile",
    icon: "🔢",
    color: "#3b82f6",
    challengeIds: ["mat-2-f-1", "mat-2-f-2", "mat-2-f-3"],
  },
  {
    id: "matematica-medio",
    name: "Matematica Base",
    description: "Addizioni, sottrazioni e molto altro",
    grade: 2,
    subject: "Matematica",
    difficulty: "Medio",
    icon: "🔢",
    color: "#3b82f6",
    challengeIds: ["mat-2-m-1", "mat-2-m-2", "mat-2-m-3"],
  },
  {
    id: "matematica-difficile",
    name: "Matematica Base",
    description: "Addizioni, sottrazioni e molto altro",
    grade: 2,
    subject: "Matematica",
    difficulty: "Difficile",
    icon: "🔢",
    color: "#3b82f6",
    challengeIds: ["mat-2-d-1", "mat-2-d-2"],
  },
  // Inglese - Grade 2
  {
    id: "inglese-facile",
    name: "Inglese Base",
    description: "Le prime parole in inglese",
    grade: 2,
    subject: "Inglese",
    difficulty: "Facile",
    icon: "🌍",
    color: "#10b981",
    challengeIds: ["eng-2-f-1", "eng-2-f-2", "eng-2-f-3"],
  },
  {
    id: "inglese-medio",
    name: "Inglese Base",
    description: "Le prime parole in inglese",
    grade: 2,
    subject: "Inglese",
    difficulty: "Medio",
    icon: "🌍",
    color: "#10b981",
    challengeIds: ["eng-2-m-1", "eng-2-m-2", "eng-2-m-3"],
  },
  {
    id: "inglese-difficile",
    name: "Inglese Base",
    description: "Le prime parole in inglese",
    grade: 2,
    subject: "Inglese",
    difficulty: "Difficile",
    icon: "🌍",
    color: "#10b981",
    challengeIds: ["eng-2-d-1", "eng-2-d-2"],
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
