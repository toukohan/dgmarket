# ---------- Build stage ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Enable pnpm
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # Copy workspace files
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps/dashboard ./apps/dashboard
    COPY packages ./packages
    
    # Install dependencies
    RUN pnpm install --frozen-lockfile
    
    # Build shared packages
    RUN pnpm --filter @dgmarket/schemas build
    RUN pnpm --filter @dgmarket/api-client build
    
    # Inject env
    ARG VITE_API_BASE_URL
    ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
    
    # Build the dashboard
    WORKDIR /app/apps/dashboard
    RUN pnpm build
    
    
    # ---------- Runtime stage ----------
    FROM nginx:1.25-alpine
    
    # Remove default nginx config
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Copy built static files
    COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    