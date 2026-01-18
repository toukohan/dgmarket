# ---------- Build stage ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps/web ./apps/web
    COPY packages ./packages
    
    RUN pnpm install --frozen-lockfile
    
    # Build shared packages
    RUN pnpm --filter @dgmarket/schemas build
    RUN pnpm --filter @dgmarket/api-client build
    
    # Build-time public env
    ARG NEXT_PUBLIC_API_BASE_URL
    ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
    
    WORKDIR /app/apps/web
    RUN pnpm build
    
    
    # ---------- Runtime stage ----------
    FROM node:20-alpine
    
    WORKDIR /app
    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=1

    
    RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
    
    COPY --from=builder /app/apps/web/.next/standalone ./
    COPY --from=builder /app/apps/web/.next/static ./.next/static
    COPY --from=builder /app/apps/web/public ./public
    
    USER nodejs
    
    EXPOSE 3000
    
    CMD ["node", "server.js"]
    