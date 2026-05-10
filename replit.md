# Helix Protocol

A full-stack Web3 financial application: light-theme marketing landing page, user wallet dashboard (multi-currency, digital card, send/receive/QR), merchant dashboard (POS terminal, payment links, revenue with CSV export), auth system, and server-side PDF receipt/coupon generation.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/helix-app run dev` — run the frontend (port from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS, Wouter routing, react-qr-code
- API: Express 5 + PostgreSQL (drizzle-orm + @workspace/db)
- Auth: express-session + bcryptjs + connect-pg-simple (PG session store)
- PDFs: pdf-lib (server-side receipt & coupon generation)
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/index.ts` — Drizzle schema (users, wallets, cards, transactions, payment_links)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `artifacts/helix-app/src/pages/` — all frontend pages
- `artifacts/helix-app/src/contexts/AuthContext.tsx` — auth context (useAuth hook)
- `artifacts/helix-app/src/components/layout/` — PublicLayout, AppLayout, MerchantLayout
- `artifacts/api-server/src/routes/` — auth, user, merchant, payment routes
- `artifacts/api-server/src/lib/pdf.ts` — PDF receipt + coupon generation
- `artifacts/api-server/src/middlewares/auth.ts` — requireAuth / requireMerchant

## Architecture decisions

- PostgreSQL for all data (users, wallets, cards, transactions, payment links, sessions)
- Sessions stored in `user_sessions` PG table via connect-pg-simple
- Landing page: LIGHT theme (white bg, indigo/blue accents)
- Dashboards: DARK electric navy + cyan theme
- OpenAPI-first: all routes typed from the spec via Orval codegen
- Layouts: PublicLayout (landing), AppLayout (user dashboard), MerchantLayout (merchant)
- `artifacts/helix-app/src/lib/api.ts` — global fetch override for `credentials: 'include'`

## Routes

- `/` — Light-theme marketing landing page (hero, live stats, features, partners, CTAs)
- `/login` — Sign in (dark)
- `/register` — Create account: Personal or Merchant (dark)
- `/dashboard` — User wallet: multi-currency balances, digital card, quick actions
- `/dashboard/send` — Send funds to any address
- `/dashboard/receive` — Receive / Tap to Pay QR code per currency
- `/merchant` — Merchant overview: revenue stats, recent payments
- `/merchant/pos` — POS terminal with numpad
- `/merchant/links` — Create & manage shareable payment links
- `/merchant/revenue` — Full transaction history with CSV export
- `/pay/:code` — Public payment page (no login needed), PDF coupon + receipt on success

## User preferences

- Use the provided logo assets from `attached_assets/` directory via `@assets` alias
- Landing page: LIGHT theme (white bg, indigo/blue text and gradients)
- Dashboards: DARK electric theme (deep navy bg, electric cyan/blue accents)

## Gotchas

- After OpenAPI spec changes, always run `pnpm --filter @workspace/api-spec run codegen` before touching frontend
- The `@assets` alias in Vite points to `attached_assets/` at the workspace root
- The `user_sessions` PG table was manually created (connect-pg-simple `createTableIfMissing` doesn't work when bundled — the `table.sql` asset isn't included in the esbuild bundle)
- Session cookie: `secure: false`, `httpOnly: true` — works behind the Replit reverse proxy

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
