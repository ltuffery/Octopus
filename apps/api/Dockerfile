FROM oven/bun:1-alpine AS base
WORKDIR /app

# Copier les fichiers de configuration du workspace
COPY package.json bun.lockb* ./
COPY pnpm-workspace.yaml* ./

# Copier tous les package.json
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/db/package.json* ./packages/db/

# Installer toutes les dépendances (workspace entier)
RUN bun install --frozen-lockfile

# Copier tout le code source
COPY apps/api ./apps/api
COPY packages ./packages

# Définir le working directory
WORKDIR /app/apps/api

# Exposer le port
EXPOSE 8080

# Commande de démarrage
CMD ["bun", "--watch", "src/index.ts"]
