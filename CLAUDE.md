# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PokeLearn is a Pokemon-themed educational app for 2nd graders to learn Italian, Math (Matematica), and English (Inglese) through interactive challenges. Users complete challenges to earn Pokemon, build a collection, and unlock legendary Pokemon.

## Commands

### Development
- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check with TypeScript and build for production
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier (targets `src/**/*.{ts,tsx,scss,css}`)

## Architecture

### State Management (Zustand)

The app uses a single Zustand store (`src/store/useStore.ts`) as the source of truth for all application state:

- **AppState**: Contains settings, progress, current challenge, collection, and challenge set navigation
- **Persistence**: State is persisted to IndexedDB via `src/services/db.ts`
- **Key actions**:
  - `initialize()` - Loads persisted data from IndexedDB on app start
  - `startChallengePath(challengeSet)` - Begins a multi-challenge path
  - `advanceToNextChallenge()` - Progresses through challenge sets
  - `submitAnswer(answer)` - Handles answer validation and point awards
  - `claimPokemon(pokemon)` / `savePokemonToCollection(pokemon)` - Manages Pokemon rewards
  - `resetProgress()` - Clears all progress and collection

### Data Persistence (IndexedDB)

`src/services/db.ts` handles all IndexedDB operations with three object stores:
- **pokemon**: Stores collected Pokemon (keyed by id)
- **progress**: Stores user progress (singleton "main")
- **settings**: Stores user settings (singleton "main")

Key functions:
- `exportAllData()` / `importData(data)` - Backup/restore functionality
- All database operations return Promises and handle errors gracefully

### Challenge System

**Two challenge modes**:

1. **Challenge Sets** (`src/data/challengeSets.ts`): Pre-defined sequences of challenges grouped by subject/difficulty
   - Each set has a fixed order of `challengeIds`
   - Tracked via `selectedChallengeSet` and `currentChallengeIndex` in store
   - URLs: `/challenge/:setId/:index`
   - Completion tracked in `progress.completedChallengeSets`

2. **Random Challenges**: Single challenges selected randomly (legacy mode)
   - Used via `getRandomChallenge(subject, difficulty)` from `src/data/challenges.ts`

**Challenge definitions** (`src/data/challenges.ts`):
- ~300 lines of challenges for grade 2
- Three types: `multiple-choice`, `true-false`, `fill-blank`
- Three difficulties: `Facile` (10pts), `Medio` (20pts), `Difficile` (30pts)
- Three subjects: `Italiano`, `Matematica`, `Inglese`

### Pokemon Integration

`src/services/pokeapi.ts` fetches Pokemon data from PokeAPI:
- `getRandomPokemon(legendaryOnly)` - Get random Pokemon (or legendary-only)
- `getPokemonById(id)` - Fetch specific Pokemon
- Legendary unlock: Crossing 100-point milestones (100, 200, 300...) sets `legendariesUnlocked: true`
- Legendary pool: 75+ legendary Pokemon IDs hardcoded in the service

### Routing & Navigation

React Router setup in `src/App.tsx`:
- `/welcome` - Tutorial/onboarding (shown if `!progress.tutorialCompleted`)
- `/start` - Main challenge selection page (StartPage)
- `/challenge/:setId/:index` - Active challenge with set navigation
- `/collection` - View and manage collected Pokemon
- `/settings` - App settings and data import/export
- `RequireOnboarded` guard redirects to `/welcome` if tutorial not completed

### Component Structure

Key components:
- `Challenge` - Main challenge UI with answer validation and attempt tracking
- `ChallengeSetSelection` - Displays available challenge sets grouped by subject/difficulty
- `PrizeModal` - Pokemon reward claim modal after successful challenges
- `PokemonCard` - Displays Pokemon with stats, types, and playable cries
- `Collection` - Grid view of collected Pokemon
- `Settings` - Grade/difficulty settings, sound toggle, import/export
- `Tutorial` - Onboarding flow explaining game mechanics

### Styling

- **Sass Modules**: Component-scoped styles (`.module.scss`)
- Global styles in `src/index.css` and `src/App.css`
- Theme toggle via `ThemeToggle` component with CSS custom properties
- Color scheme: Subject-based colors (red for Italiano, blue for Matematica, green for Inglese)

### Points & Game Mechanics

- **Attempts**: 3 attempts per challenge
- **Points**: +10/20/30 based on difficulty, -5 for failed challenges (removed in current code)
- **Legendary unlock**: Every 100-point milestone crossed
- **Progress tracking**: `totalPoints`, `challengesCompleted`, `challengesFailed`, `pokemonCollected`
- **Duplicate prevention**: Collection checks prevent duplicate Pokemon saves

### Type Definitions

All types defined in `src/types/index.ts`:
- Core types: `Challenge`, `Pokemon`, `ChallengeSet`, `SavedPokemon`
- App state: `AppState`, `UserProgress`, `Settings`, `ChallengeAttempt`
- Enums: `Subject`, `Difficulty`, `Grade`, `ChallengeType`
- Data transfer: `ExportData` for import/export functionality

## Deployment

- Deployed to Vercel
- `vercel.json` configures SPA routing (all routes to `/`)
- No environment variables or API keys required (uses public PokeAPI)