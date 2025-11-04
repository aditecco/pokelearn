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

## Game Mechanics

- **3 attempts per challenge** - Users get 3 tries to answer correctly
- **Points system**:
  - Facile (Easy): 10 points
  - Medio (Medium): 20 points
  - Difficile (Hard): 30 points
  - Failed challenge: -5 points
- **Legendary unlock**: Reach 100 points to unlock legendary Pokemon
- **Pokemon rewards**: Claim a Pokemon after each successful challenge

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
- **Sanity CMS** - Content management for challenges (optional)

## Content Management

### Using Demo Content (Default)

The app includes hardcoded demo challenges and challenge sets in `src/data/`. If Sanity is not configured, the app automatically falls back to this demo content.

### Using Sanity CMS (Optional)

To use Sanity CMS for managing challenges:

1. **Create a Sanity project** at https://www.sanity.io/
2. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```
3. **Add your Sanity credentials** to `.env`:
   ```
   VITE_SANITY_PROJECT_ID=your_project_id
   VITE_SANITY_DATASET=production
   SANITY_AUTH_TOKEN=your_auth_token  # Only for migration
   ```

4. **Migrate demo data to Sanity**:
   ```bash
   npm run migrate
   ```

5. **Run Sanity Studio** (optional, for content editing):
   ```bash
   npm run studio
   ```
   Studio will be available at http://localhost:3333

### Sanity Studio Deployment

To deploy the Studio for team collaboration:
```bash
npm run studio:deploy
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run studio` - Run Sanity Studio locally
- `npm run migrate` - Migrate demo data to Sanity

## License

MIT

<!-- -->
