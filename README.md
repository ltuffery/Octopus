# Octopus 🐙

Gestionnaire de webhooks et crons avec monitoring.

## Stack

- **Runtime**: Bun ⚡
- **Backend**: HonoJS + Drizzle ORM + PostgreSQL
- **Frontend**: Vue 3 + Vite + TailwindCSS + Shadcn-vue
- **Tests**: Bun Test + Playwright

## Installation

\`\`\`bash
bun install
\`\`\`

## Développement

\`\`\`bash
# Tout démarrer
bun dev

# API seule
bun dev:api

# Web seul
bun dev:web
\`\`\`

## Database

\`\`\`bash
# Générer migrations
bun db:generate

# Appliquer migrations
bun db:migrate

# Drizzle Studio
bun db:studio
\`\`\`

## Tests

\`\`\`bash
# Tests unitaires
bun test

# Tests E2E
bun test:e2e
\`\`\`

## URLs

- API: http://localhost:8080
- Web: http://localhost:3000
- Drizzle Studio: http://localhost:4983
