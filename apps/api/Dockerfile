FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api ./apps/api
COPY packages ./packages

RUN pnpm install --frozen-lockfile

# Build runtime workspace packages
RUN pnpm --filter @dgmarket/schemas build

# Build API
WORKDIR /app/apps/api
RUN pnpm build

# Copy migrations
COPY apps/api/src/database/migrations ./apps/api/dist/database/migrations

EXPOSE 4000

CMD ["pnpm", "start"]

