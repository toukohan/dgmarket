FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy only what the API needs
COPY apps/api ./apps/api
COPY packages ./packages

# Install deps
RUN pnpm install --frozen-lockfile

# Build API
WORKDIR /app/apps/api
RUN pnpm build

EXPOSE 4000

CMD ["pnpm", "start"]
