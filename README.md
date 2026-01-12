[![API Tests](https://github.com/toukohan/dgmarket/actions/workflows/api-tests.yml/badge.svg)](https://github.com/toukohan/dgmarket/actions/workflows/api-tests.yml)



# Disc Golf Marketplace

A monorepo-based marketplace platform for disc golf products, built with a clear separation between buyer, seller, and backend concerns.

This repository is structured to scale cleanly while staying simple: SEO-focused buyer experience, app-like seller dashboard, and a well-structured API.

---

## Product Overview

The Disc Golf Marketplace has two primary user experiences:

- **Buyers** – Browse and search disc golf products with fast load times and strong SEO
- **Sellers** – Manage listings, inventory, and pricing in an authenticated dashboard

The system is designed so that each experience can evolve independently while sharing core logic where it makes sense.

---

## Tech Stack

### Frontend

- **Buyer app**: Next.js (SSR / SSG)
- **Seller dashboard**: React SPA (Vite)
- **Styling**: Tailwind CSS
- **UI components**: Custom components + shadcn/ui

### Backend

- **API**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Validation**: Zod
- **Authentication**: JWT (access + refresh tokens)

### Tooling

- **Monorepo**: pnpm workspaces
- **Testing**: Vitest + Supertest
- **Linting / formatting**: ESLint + Prettier

---

## Repository Structure

```
root/
├─ apps/
│  ├─ web/            # Next.js buyer app (SEO-focused)
│  ├─ dashboard/      # React SPA for sellers
│  └─ api/            # Express backend API
│
├─ packages/
│  ├─ schemas/        # Shared Zod schemas
│  ├─ types/          # Shared types
│  ├─ eslint-config/  # Eslint config
│  └─ api-client/     # Shared API client
│
├─ docs/
│  └─ decisions.md
│
└─ package.json       # pnpm workspace config & scripts
```

### Structure Principles

- **Apps** are deployment units
- **Packages** contain shared logic only
- No app-specific behavior inside `packages/`

---

## Architecture Guidelines

### Buyer App (Next.js)

- SSR / SSG for public pages
- API-only data access (no direct DB access)
- Optimized for SEO and performance

### Seller Dashboard (React SPA)

- Client-side routing
- Authenticated views only
- Uses shared API client and schemas

### Backend API

- Thin route handlers
- Business logic in services
- Database access isolated in repositories
- Zod schemas used for request and response validation

---

## Shared Packages

### `packages/schemas`

- Zod schemas only
- No framework-specific imports
- Used by frontend and backend

### `packages/api-client`

- Centralized API calls
- Typed using shared schemas
- Handles auth headers and token refresh

### `packages/types`

- Shared types between apps
- Remove these after everything uses zod schemas

### `packages/eslint-config`

- Customizable eslint-config for different apps

---

## Authentication Model

- Short-lived **access token** (JWT)
- Long-lived **refresh token**
- Refresh tokens stored server-side
- Logout revokes refresh token

Frontend behavior:

- Silent refresh via API client
- Logout clears client state

---

## Testing Strategy

### Backend

- Unit tests for services
- Integration tests for API routes
- Isolated test database with reset helpers

### Frontend

- Behavior-focused tests
- Form validation driven by shared schemas

---

## Documentation

- **`README.md`** – Single source of truth for architecture and conventions
- **`docs/decisions.md`** – Record of important architectural decisions and trade-offs

When working with ChatGPT, reference the baseline explicitly:

> "This is the disc golf marketplace project. Use `README.md` as the baseline."

---

## Project Philosophy

- Prefer clarity over cleverness
- Avoid premature abstraction
- Keep shared code minimal and intentional
- Document non-obvious decisions

---

## Deployment Architecture (Production)

This project is designed to be deployed on a single VPS using Docker.

All applications run as isolated containers behind a shared reverse proxy.

### High-level overview

- A single reverse proxy terminates HTTPS and routes traffic by domain
- Buyer app, seller dashboard, API, and WordPress (optional) run as separate services
- Databases are private and never exposed publicly
- Only ports 80 and 443 are exposed on the host

### Domain-based routing

Example production setup:

- example.com → Buyer app (Next.js)
- dashboard.example.com → Seller dashboard (SPA)
- api.example.com → Backend API
- blog.example.com → WordPress (optional)

### Infrastructure principles

- Apps are deployment units
- Reverse proxy is the only public entry point
- No app binds directly to the host network
- Infrastructure configuration lives in `infra/`
- Operational details are documented separately

See `infra/README.md` for concrete deployment instructions.

## Use of AI tools

This project was developed with the assistance of large language models (LLMs) as part of my learning and development process.

I used AI tools to:

- reason about architecture and project structure

- generate boilerplate and common patterns

- debug errors and explore alternative solutions

- validate my understanding of unfamiliar concepts

All architectural decisions, integrations, and final implementations were reviewed, adapted, and tested by me. I treat AI as a productivity and learning aid rather than an authority, and I avoid using generated code that I don’t understand.

_Last updated: 12.01.2026_
