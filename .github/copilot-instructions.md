# Copilot instructions for Jus Naturels Ben's

## Big picture architecture
- This is a Vite + React + TypeScript SPA with two route areas: public site and protected admin (`src/app/router/index.tsx`).
- App-wide state is centralized in `DataContext` (`src/app/providers/DataContext.tsx`), not in per-page fetch hooks.
- `DataProvider` loads all feature datasets once via `Promise.all(...)`, then pages read/write via `useData()`.
- Persistence is feature-service based (`src/features/*/services/*.service.ts`) and each service delegates to shared Supabase helpers in `src/lib/api/http-client.ts`.
- The data model is mostly "whole-table sync": `updateX()` in context sets local state and calls `service.save(array)`; `syncAll()` upserts by `id` then deletes stale rows.

## Data + backend conventions
- Supabase is optional at runtime: if env vars are missing, app runs in offline seed mode (`src/lib/supabase/client.ts` + `src/shared/constants/seed-data.ts`).
- Each table has a seed fallback; keep new feature tables mirrored in `TableName` union and seed constants.
- IDs are client-generated strings with prefixes (`p`, `r`, `a`, etc.) using `Date.now()` patterns across admin pages.
- `settings` is a single-row JSON payload (`id=1`) accessed via `fetchSettings()` / `syncSettings()`.
- Storage uploads use bucket `product-images` through `uploadImage()` in `http-client.ts`.

## Auth + routing specifics
- Admin auth is local-state password check against `settings.password` (no Supabase Auth yet).
- `AuthContext` does not persist session; refresh logs user out.
- Protected admin routes are wrapped by `ProtectedRoute` and redirect to `/login`.
- Hidden admin entry exists: 5 quick footer copyright clicks navigate to login (`PublicLayout.tsx`).

## UI and implementation patterns
- UI uses inline style objects heavily (no Tailwind/CSS modules). Reuse `C` color tokens from `src/shared/constants/colors.ts` and shared style snippets when available.
- Keep imports using `@/*` alias configured in `tsconfig.json` and `vite.config.ts`.
- Internationalization uses `react-i18next`; user-facing strings in public pages should use `t(...)` keys (`src/lib/i18n/index.ts`).
- Assets are served from `/images-bens/...` under `public/images-bens`; preserve this path style when adding media.
- Feature layout is consistent: `features/<domain>/{pages,services,types}` (+ `components`/`validations` when needed).

## Developer workflows
- Install and run: `npm install`, then `npm run dev`.
- Build uses type-check + Vite build: `npm run build`.
- Lint command is strict and fails on warnings: `npm run lint`.
- No test runner is currently configured in `package.json`; do not reference nonexistent test commands.

## When adding/changing features
- Update route constants first in `src/shared/constants/routes.ts`, then router config.
- Extend `DataContextValue`, initial load `Promise.all`, and `updateX()` sync methods together (single source of truth pattern).
- Keep service files thin and generic (delegate CRUD mechanics to `http-client.ts`).
- For new persisted entities, also update Supabase schema/seed SQL (`supabase/schema.sql`, `supabase/seed.sql`) and local `seed-data.ts` fallback.
