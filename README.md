# PokeLearn

A Pokemon-themed educational app for 2nd graders to learn Italian, Math, and English through interactive challenges.

## Features

- **Challenge System**: Multiple subjects (Italiano, Matematica, Inglese) with 3 difficulty levels
- **Pokemon Rewards**: Earn Pokemon by completing challenges successfully
- **Collection System**: Save and browse your Pokemon collection
- **Legendary Pokemon**: Unlock legendary Pokemon after reaching 100 points
- **Local Storage**: All data saved locally using IndexedDB
- **Sound Effects**: Pokemon cries playable from cards
- **Progress Tracking**: Track points, completed challenges, and collected Pokemon

## Tech Stack

- **Vite** - Build tool
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Sass** - Styling with CSS modules
- **IndexedDB** - Local data persistence
- **PokeAPI** - Pokemon data source

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Format Code

```bash
npm run format
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Challenge/      # Challenge UI
│   ├── Collection/     # Pokemon collection browser
│   ├── PokemonCard/    # Pokemon card display
│   └── Settings/       # App settings
├── data/               # Static challenge data
├── services/           # External services (DB, API)
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

## Game Mechanics

- **3 attempts per challenge** - Users get 3 tries to answer correctly
- **Points system**:
  - Facile (Easy): 10 points
  - Medio (Medium): 20 points
  - Difficile (Hard): 30 points
  - Failed challenge: -5 points
- **Legendary unlock**: Reach 100 points to unlock legendary Pokemon
- **Pokemon rewards**: Claim a Pokemon after each successful challenge

## Deployment

This app can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Connect your git repository or drag & drop the `dist` folder

## License

MIT
