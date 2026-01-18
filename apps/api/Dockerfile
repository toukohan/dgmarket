# ---------- Base ----------
    FROM node:20-alpine AS base

    WORKDIR /app
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps/api ./apps/api
    COPY packages ./packages
    
    # ---------- Dev / Test ----------
    FROM base AS test
    
    RUN pnpm install --frozen-lockfile
    RUN pnpm --filter @dgmarket/schemas build
    
    WORKDIR /app/apps/api
    CMD ["pnpm", "test"]
    
    # ---------- Build ----------
    FROM base AS builder
    
    RUN pnpm install --frozen-lockfile
    RUN pnpm --filter @dgmarket/schemas build
    WORKDIR /app/apps/api
    RUN pnpm build
    
    # ---------- Prod ----------
    FROM node:20-alpine AS prod
    
    WORKDIR /app
    ENV NODE_ENV=production
    
    RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
    
    COPY --from=builder /app/apps/api/dist ./dist
    COPY --from=builder /app/apps/api/package.json ./package.json
    COPY --from=builder /app/apps/api/pnpm-lock.yaml ./pnpm-lock.yaml
    
    RUN corepack enable \
    && corepack prepare pnpm@latest --activate \
    && pnpm install --prod --frozen-lockfile
    
    RUN chown -R nodejs:nodejs /app
    USER nodejs
    EXPOSE 4000
    CMD ["pnpm", "start"]
    