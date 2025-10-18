import { create } from "zustand";
import type {
  AppState,
  Pokemon,
  SavedPokemon,
  Settings,
  Subject,
  Difficulty,
  ChallengeSet,
} from "../types";
import {
  getAllPokemon,
  savePokemon as savePokemonDB,
  deletePokemon as deletePokemonDB,
  clearAllPokemon,
  saveProgress,
  getProgress,
  saveSettings as saveSettingsDB,
  getSettings,
} from "../services/db";
import { getRandomChallenge, getChallengeById } from "../data/challenges";
import { getChallengeSetById } from "../data/challengeSets";

const LEGENDARY_THRESHOLD = 100;

type StoreState = AppState & {
  initialized: boolean;
  initialize: () => Promise<void>;
  startChallengePath: (challengeSet: ChallengeSet) => void;
  loadChallengeAt: (setId: string, index: number) => void;
  clearChallengeSet: () => void;
  setUserName: (name: string) => Promise<void>;
  completeTutorial: (pokemon: Pokemon) => Promise<void>;
  startChallenge: (subject: Subject, difficulty: Difficulty) => void;
  advanceToNextChallenge: () => boolean;
  submitAnswer: (answer: string) => boolean;
  claimPokemon: (pokemon: Pokemon) => Promise<void>;
  savePokemonToCollection: (pokemon: Pokemon) => Promise<void>;
  removePokemonFromCollection: (id: number) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetProgress: () => Promise<void>;
};

export const useStore = create<StoreState>((set, get) => ({
  initialized: false,
  settings: {
    grade: 2,
    difficulty: "Facile",
    soundEnabled: true,
    language: "it",
  },
  progress: {
    totalPoints: 0,
    challengesCompleted: 0,
    challengesFailed: 0,
    pokemonCollected: 0,
    legendariesUnlocked: false,
    tutorialCompleted: false,
    userName: null,
    completedChallengeSets: [],
  },
  currentChallenge: null,
  currentAttempt: null,
  collection: [],
  lastRewardPokemon: null,
  selectedChallengeSet: null,
  currentChallengeIndex: 0,
  selectedDifficulty: null,

  initialize: async () => {
    try {
      const savedProgress = await getProgress();
      const savedSettings = await getSettings();
      const savedCollection = await getAllPokemon();

      // Ensure completedChallengeSets exists for backward compatibility
      const progress = savedProgress
        ? {
            ...savedProgress,
            completedChallengeSets:
              savedProgress.completedChallengeSets || [],
          }
        : get().progress;

      set({
        initialized: true,
        progress,
        settings: savedSettings || get().settings,
        collection: savedCollection,
      });
    } catch (error) {
      console.error("Error initializing DB:", error);
      set({
        initialized: true,
        progress: get().progress,
        settings: get().settings,
        collection: [],
      });
    }
  },

  loadChallengeAt: (setId: string, index: number) => {
    const challengeSet = getChallengeSetById(setId);
    if (!challengeSet) return;
    const challengeId = challengeSet.challengeIds[index];
    const challenge = challengeId ? getChallengeById(challengeId) : null;
    if (!challenge) return;

    set({
      selectedChallengeSet: challengeSet,
      selectedDifficulty: null,
      currentChallengeIndex: index,
      currentChallenge: challenge,
      currentAttempt: {
        challengeId: challenge.id,
        attempts: 0,
        maxAttempts: 3,
        completed: false,
        success: false,
      },
      lastRewardPokemon: null,
    });
  },

  startChallengePath: (challengeSet: ChallengeSet) => {
    set({
      selectedChallengeSet: challengeSet,
      selectedDifficulty: challengeSet.difficulty,
      currentChallengeIndex: 0,
      currentChallenge: null,
      currentAttempt: null,
      lastRewardPokemon: null,
    });

    // Load first challenge
    const firstChallengeId = challengeSet.challengeIds[0];
    if (firstChallengeId) {
      const challenge = getChallengeById(firstChallengeId);
      if (challenge) {
        set({
          currentChallenge: challenge,
          currentAttempt: {
            challengeId: challenge.id,
            attempts: 0,
            maxAttempts: 3,
            completed: false,
            success: false,
          },
        });
      }
    }
  },

  clearChallengeSet: () => {
    set({
      selectedChallengeSet: null,
      selectedDifficulty: null,
      currentChallenge: null,
      currentAttempt: null,
      lastRewardPokemon: null,
      currentChallengeIndex: 0,
    });
  },

  advanceToNextChallenge: () => {
    const { selectedChallengeSet, currentChallengeIndex, progress } = get();
    if (!selectedChallengeSet) return false;

    const nextIndex = currentChallengeIndex + 1;
    if (nextIndex >= selectedChallengeSet.challengeIds.length) {
      // Path completed - mark challenge set as complete
      const completedSets = progress.completedChallengeSets || [];
      const isAlreadyCompleted = completedSets.includes(
        selectedChallengeSet.id,
      );
      if (!isAlreadyCompleted) {
        const newProgress = {
          ...progress,
          completedChallengeSets: [...completedSets, selectedChallengeSet.id],
        };
        set({ progress: newProgress });
        saveProgress(newProgress);
      }
      return false;
    }

    const nextChallengeId = selectedChallengeSet.challengeIds[nextIndex];
    const nextChallenge = getChallengeById(nextChallengeId);

    if (!nextChallenge) return false;

    set({
      currentChallengeIndex: nextIndex,
      currentChallenge: nextChallenge,
      currentAttempt: {
        challengeId: nextChallenge.id,
        attempts: 0,
        maxAttempts: 3,
        completed: false,
        success: false,
      },
      lastRewardPokemon: null,
    });

    return true;
  },

  setUserName: async (name: string) => {
    const { progress } = get();
    const newProgress = {
      ...progress,
      userName: name,
    };
    set({ progress: newProgress });
    await saveProgress(newProgress);
  },

  completeTutorial: async (pokemon: Pokemon) => {
    const { progress } = get();
    const savedPokemon: SavedPokemon = {
      ...pokemon,
      savedAt: Date.now(),
    };

    await savePokemonDB(savedPokemon);

    const newProgress = {
      ...progress,
      tutorialCompleted: true,
      pokemonCollected: 1,
    };

    const { collection } = get();
    set({
      progress: newProgress,
      collection: [...collection, savedPokemon],
      lastRewardPokemon: pokemon,
    });

    await saveProgress(newProgress);
  },

  startChallenge: (subject: Subject, difficulty: Difficulty) => {
    const challenge = getRandomChallenge(subject, difficulty);
    if (!challenge) return;

    set({
      currentChallenge: challenge,
      currentAttempt: {
        challengeId: challenge.id,
        attempts: 0,
        maxAttempts: 3,
        completed: false,
        success: false,
      },
      lastRewardPokemon: null,
    });
  },

  submitAnswer: (answer: string) => {
    const { currentChallenge, currentAttempt, progress } = get();
    if (!currentChallenge || !currentAttempt || currentAttempt.completed) {
      return false;
    }

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = currentChallenge.correctAnswer
      .trim()
      .toLowerCase();
    const isCorrect = normalizedAnswer === normalizedCorrect;

    const newAttempts = currentAttempt.attempts + 1;
    const isLastAttempt = newAttempts >= currentAttempt.maxAttempts;

    if (isCorrect) {
      const oldPoints = progress.totalPoints;
      const newPoints = oldPoints + currentChallenge.points;
      // Unlock legendary only when crossing a 100-point milestone (100, 200, 300, etc.)
      const crossedMilestone = Math.floor(oldPoints / LEGENDARY_THRESHOLD) < Math.floor(newPoints / LEGENDARY_THRESHOLD);
      
      const newProgress = {
        ...progress,
        totalPoints: newPoints,
        challengesCompleted: progress.challengesCompleted + 1,
        legendariesUnlocked: crossedMilestone,
      };

      set({
        currentAttempt: {
          ...currentAttempt,
          attempts: newAttempts,
          completed: true,
          success: true,
        },
        progress: newProgress,
      });

      saveProgress(newProgress);
      return true;
    } else if (isLastAttempt) {
      const newProgress = {
        ...progress,
        totalPoints: progress.totalPoints,
        challengesFailed: progress.challengesFailed + 1,
      };

      set({
        currentAttempt: {
          ...currentAttempt,
          attempts: newAttempts,
          completed: true,
          success: false,
        },
        progress: newProgress,
      });

      saveProgress(newProgress);
      return false;
    } else {
      set({
        currentAttempt: {
          ...currentAttempt,
          attempts: newAttempts,
        },
      });
      return false;
    }
  },

  claimPokemon: async (pokemon: Pokemon) => {
    set({ lastRewardPokemon: pokemon });
  },

  savePokemonToCollection: async (pokemon: Pokemon) => {
    const { collection } = get();

    // Check if Pokemon already exists in collection
    const alreadyExists = collection.some((p) => p.id === pokemon.id);
    if (alreadyExists) {
      return; // Don't add duplicates
    }

    const savedPokemon: SavedPokemon = {
      ...pokemon,
      savedAt: Date.now(),
    };

    await savePokemonDB(savedPokemon);

    const { progress } = get();
    const newProgress = {
      ...progress,
      pokemonCollected: progress.pokemonCollected + 1,
      // Reset legendary unlock after claiming
      legendariesUnlocked: false,
    };

    set({
      collection: [...collection, savedPokemon],
      progress: newProgress,
    });

    await saveProgress(newProgress);
  },

  removePokemonFromCollection: async (id: number) => {
    await deletePokemonDB(id);
    const { collection } = get();
    set({
      collection: collection.filter((p) => p.id !== id),
    });
  },

  updateSettings: async (newSettings: Partial<Settings>) => {
    const { settings } = get();
    const updated = { ...settings, ...newSettings };
    set({ settings: updated });
    await saveSettingsDB(updated);
  },

  resetProgress: async () => {
    const defaultProgress = {
      totalPoints: 0,
      challengesCompleted: 0,
      challengesFailed: 0,
      pokemonCollected: 0,
      legendariesUnlocked: false,
      tutorialCompleted: false,
      userName: null,
      completedChallengeSets: [],
    };

    // Clear all Pokemon from the database
    await clearAllPokemon();

    set({
      progress: defaultProgress,
      currentChallenge: null,
      currentAttempt: null,
      lastRewardPokemon: null,
      selectedChallengeSet: null,
      selectedDifficulty: null,
      currentChallengeIndex: 0,
      collection: [],
    });

    await saveProgress(defaultProgress);
  },
}));
