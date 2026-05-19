# OurFlat

One app. Two people. Every shared task, list, and reminder. Always in sync.

## Architecture

- **Mobile**: React Native + Expo Router (iOS, Android, Web)
- **Web**: Next.js 16 + React 19
- **Backend**: Supabase (PostgreSQL, Realtime, Auth, Storage, Edge Functions)
- **Shared**: TypeScript packages for types, database queries, and UI components
- **AI**: OpenAI GPT-4o (Flatmate assistant)

## Project Structure

```
ourflat/
├── packages/
│   ├── shared/          # Shared types, constants, utils
│   ├── database/        # Supabase client & query functions
│   └── ui/              # Shared UI components & theme
├── mobile/              # Expo React Native app
│   ├── app/             # Expo Router file-based routes
│   └── src/             # Providers, hooks, services
├── web/                 # Next.js web app
│   └── src/
│       ├── app/         # Next.js App Router pages
│       ├── components/  # Web-specific components
│       ├── hooks/       # Web-specific hooks
│       └── lib/         # Supabase clients
├── supabase/
│   └── migrations/      # Database schema migrations
└── package.json         # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI (`npm install -g expo-cli`)
- Supabase CLI (`npm install -g supabase`)

### Setup

1. **Clone and install dependencies**:

```bash
cd ourflat
npm install
```

2. **Start Supabase locally**:

```bash
supabase init
supabase start
```

3. **Apply database migrations**:

```bash
supabase db push
```

4. **Start the web app**:

```bash
npm run web
```

5. **Start the mobile app**:

```bash
npm run mobile
```

### Environment Variables

Copy `.env.example` to `.env.local` in both `web/` and `mobile/` directories and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (for Flatmate AI features)

## Features

| Module | Mobile | Web | Status |
|--------|--------|-----|--------|
| Shopping Lists | ✅ | ✅ | Core |
| Pantry Tracker | ✅ | ✅ | Core |
| Meal Planning (Gousto) | ✅ | ✅ | Core |
| Chores | ✅ | ✅ | Core |
| Calendar | ✅ | ✅ | Core |
| Money & Bills | ✅ | ✅ | Core |
| Notes & Documents | ✅ | ✅ | Core |
| Pet Care | ✅ | 🔄 | Core |
| Plant Care | ✅ | 🔄 | Core |
| Habits & Goals | ✅ | 🔄 | Core |
| Packages & Errands | ✅ | 🔄 | Core |
| AI Assistant (Flatmate) | ✅ | ✅ | Core |

## Key Design Decisions

- **Real-time sync**: All data uses Supabase Realtime with WebSocket subscriptions for <1s sync
- **Offline-first**: Mobile app uses WatermelonDB for local SQLite storage with automatic sync
- **Two-tap actions**: Common actions (add item, check chore, add event) achievable in ≤2 taps
- **Built for two**: No admin/member hierarchy — both partners have equal access
- **Privacy zones**: Notes, habits, and goals can be marked private per user
- **AI-first**: Flatmate assistant is integrated into every module, not just a separate chat

## Scripts

| Command | Description |
|---------|-------------|
| `npm run web` | Start Next.js dev server |
| `npm run mobile` | Start Expo dev server |
| `npm run build:web` | Build Next.js for production |
| `npm run db:migrate` | Push Supabase migrations |
| `npm run typecheck` | Type-check all packages |

## License

Private — All rights reserved.