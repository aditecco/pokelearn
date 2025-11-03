export type Subject = "Italiano" | "Matematica" | "Inglese";

export type Difficulty = "Facile" | "Medio" | "Difficile";

export type Grade = 1 | 2 | 3 | 4 | 5;

export type ChallengeType = "multiple-choice" | "true-false" | "fill-blank";

export type ChallengeMedia = {
  type: "image" | "audio";
  url: string;
  alt?: string;
};

export type Challenge = {
  id: string;
  subject: Subject;
  grade: Grade;
  difficulty: Difficulty;
  type: ChallengeType;
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
  hint?: string;
  media?: ChallengeMedia[];
  tags?: string[];
  isPublished?: boolean;
  _createdAt?: string;
  _updatedAt?: string;
};

export type ChallengeSet = {
  id: string;
  name: string;
  description: string;
  grade: Grade;
  subject: Subject;
  difficulty: Difficulty;
  icon: string;
  color: string;
  challengeIds: string[];
  estimatedMinutes?: number;
  prerequisites?: string[];
  isPublished?: boolean;
  _createdAt?: string;
  _updatedAt?: string;
};

export type ChallengeAttempt = {
  challengeId: string;
  attempts: number;
  maxAttempts: number;
  completed: boolean;
  success: boolean;
};

export type Pokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: PokemonStat[];
  cries?: {
    latest?: string;
    legacy?: string;
  };
  isLegendary: boolean;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type SavedPokemon = Pokemon & {
  savedAt: number;
};

export type UserProgress = {
  totalPoints: number;
  challengesCompleted: number;
  challengesFailed: number;
  pokemonCollected: number;
  legendariesUnlocked: boolean;
  tutorialCompleted: boolean;
  userName: string | null;
  completedChallengeSets: string[];
};

export type Settings = {
  grade: Grade;
  difficulty: Difficulty;
  soundEnabled: boolean;
  language: "it";
};

export type AppState = {
  settings: Settings;
  progress: UserProgress;
  currentChallenge: Challenge | null;
  currentAttempt: ChallengeAttempt | null;
  collection: SavedPokemon[];
  lastRewardPokemon: Pokemon | null;
  selectedChallengeSet: ChallengeSet | null;
  currentChallengeIndex: number;
  selectedDifficulty: Difficulty | null;
  pathChallengeIds?: string[];
};

export type ExportData = {
  version: string;
  exportedAt: number;
  userName: string | null;
  collection: SavedPokemon[];
  progress: UserProgress;
};
