# Nexa — Payment Crypto

A full-stack Web3 financial application: dark gold-themed marketing landing page, user wallet dashboard (multi-currency, digital card, send/receive/QR), merchant dashboard (POS terminal, payment links, revenue with CSV export), auth system, and server-side PDF receipt/coupon generation.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/helix-app run dev` — run the frontend (port from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS (Space Grotesk font), Wouter routing, react-qr-code
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
- Brand: NEXA — dark (#07070d) background, amber/gold (#FBBF24) accents throughout
- Primary CSS color: HSL(43, 96%, 56%) — gold/amber
- Font: Space Grotesk (headings), Inter (body)
- OpenAPI-first: all routes typed from the spec via Orval codegen
- Layouts: PublicLayout (landing), AppLayout (user dashboard), MerchantLayout (merchant)
- `artifacts/helix-app/src/lib/api.ts` — global fetch override for `credentials: 'include'`

## Routes

- `/` — Dark gold marketing landing page (hero with Nexa logo, live stats, features, architecture, CTAs)
- `/login` — Sign in (dark + gold)
- `/register` — Create account: Personal or Merchant (dark + gold)
- `/dashboard` — User wallet: multi-currency balances, digital card, quick actions
- `/dashboard/send` — Send funds to any address
- `/dashboard/receive` — Receive / Tap to Pay QR code per currency
- `/merchant` — Merchant overview: revenue stats, recent payments
- `/merchant/pos` — POS terminal with numpad
- `/merchant/links` — Create & manage shareable payment links
- `/merchant/revenue` — Full transaction history with CSV export
- `/pay/:code` — Public payment page (no login needed), PDF coupon + receipt on success

## User preferences

- Brand name: NEXA / Nexa Payment Crypto (NOT Helix)
- Logo: `@assets/BF005E4B-DBB8-4941-97BB-BD3D0186FEBA_1781548526676.png` (gold Nexa N logo)
- Theme: DARK (#07070d bg) + GOLD (amber-400 #FBBF24) accents everywhere
- Font: Space Grotesk for headings/branding

## Gotchas

- After OpenAPI spec changes, always run `pnpm --filter @workspace/api-spec run codegen` before touching frontend
- The `@assets` alias in Vite points to `attached_assets/` at the workspace root
- The `user_sessions` PG table was manually created (connect-pg-simple `createTableIfMissing` doesn't work when bundled — the `table.sql` asset isn't included in the esbuild bundle)
- Session cookie: `secure: false`, `httpOnly: true` — works behind the Replit reverse proxy

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
