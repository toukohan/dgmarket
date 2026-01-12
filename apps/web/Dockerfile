# ---------- Build stage ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Enable pnpm
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # Copy workspace files
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps/web ./apps/web
    COPY packages ./packages
    
    # Install dependencies (including dev deps, needed for build)
    RUN pnpm install --frozen-lockfile
    
    # Build the Next.js app
    WORKDIR /app/apps/web
    RUN pnpm build
    
    
    # ---------- Runtime stage ----------
    FROM node:20-alpine
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # Create non-root user
    RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
    
    # Copy standalone output
    COPY --from=builder /app/apps/web/.next/standalone ./
    COPY --from=builder /app/apps/web/.next/static ./.next/static
    COPY --from=builder /app/apps/web/public ./public
    
    USER nodejs
    
    EXPOSE 3000
    
    # IMPORTANT: listen on all interfaces
    CMD ["node", "server.js"]
    