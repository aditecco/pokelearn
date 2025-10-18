## PokeLearn app prompt

---

### Role / Style
- Produce concise, production-ready code

---

### Prompt Template
Build a learning app targeted at 2nd-graders, with a Pokemon theme.

#### Mechanics:

- User is presented with a Challenge with selectable difficulty level
  - Each grade has 3 difficulty levels (i.e. 2nd grade; difficulty Easy, Medium, Hard)
  - Each won challenge scores points
  - Greater difficulty level earns more points
  - User gets 3 tries, after which the challenge fails and User can request a new challenge
  - A failed challenge deducts points from the overall score
- If challenge is solved, user can request a random Pokemon
- After a certain amount of points is reached, User earns the ability to request a legendary Pokemon
- Pokemon is presented in a  card, with image and detailed info including playable sounds
- User can save the Pokemon to a Pokemon collection
- Pokemon collection can be browsed and consulted at any time

#### Implementation

- Data saved locally in the browser, also in structured formats like IndexedDB (recommend)
- App can be statically hosted ( Vercel, Netlify)
- Static content management organized by Subject
- Available Subjects: "Italiano, Matematica, Inglese"
- Pokemon data sourced from `https://pokeapi.co/`


### Scope

All features described in the Goal section


### Stack

- Vite
- React
- Typescript
- Prettier
- Zustand
- React-hook-form
- React-hot-toast
- Sass with CSS modules


### Code prefs

- prefer types over interfaces
- prefer function declarations over function expressions
- use comments only when necessary
- enable prettier with default options


### Security

- All dependencies MUST be current (as of 2025) and vulnerability-free


### UX Constraints

- Modern look & feel, playful and Pokemon-themed
- Content (Challenges) language: Italian
- UI language visible to the user: Italian
- UI language pertaining to technical sections, like "settings": English

### Integrations

https://pokeapi.co/


### Data Model

- Settings
- Challenge
- Content
- Subjects
- Difficulty
- Grade
- Pokemon
…recommend
