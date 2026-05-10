# Helix Protocol

A next-generation Web3 financial infrastructure landing site and live dashboard — showcasing real-time cross-chain transaction routing, network health, and protocol statistics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/helix-app run dev` — run the frontend (port from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS, Wouter routing, Framer Motion
- API: Express 5 (no database — all data is generated in-memory)
- Validation: Zod (`zod/v4`)
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas
- `artifacts/helix-app/src/pages/` — LandingPage, Dashboard, Transactions, Nodes
- `artifacts/helix-app/src/components/layout/` — PublicLayout, AppLayout
- `artifacts/api-server/src/routes/` — stats, transactions, nodes, activity

## Architecture decisions

- No database: all API data is generated in-memory (realistic seed data) — suitable for a protocol demo/marketing site
- Dark-only theme: CSS variables set once in `:root, .dark` — no light/dark toggle needed
- OpenAPI-first: all routes typed from the spec via Orval codegen
- Layouts split into PublicLayout (landing site) and AppLayout (dashboard sidebar)

## Product

- `/` — Marketing landing page: hero, live network stats, protocol features, blockchain partners, CTA
- `/app` — Dashboard: total volume, transaction count, avg settlement, success rate, activity feed, system status
- `/app/transactions` — Full transaction table with status, trust scores, chain info
- `/app/nodes` — Global node network grid with health, load, region

## User preferences

- Use the provided logo assets from `attached_assets/` directory via `@assets` alias
- Dark electric theme: deep navy bg, electric cyan/blue accents

## Gotchas

- After OpenAPI spec changes, always run `pnpm --filter @workspace/api-spec run codegen` before touching frontend
- The `@assets` alias in Vite points to `attached_assets/` at the workspace root
- No DATABASE_URL needed — backend routes return in-memory data

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
