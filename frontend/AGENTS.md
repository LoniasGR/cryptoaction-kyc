# React + Vite + TanStack frontend

## Project layout

```
src/api/          API client functions (axios) for the backend
src/auth/         Keycloak auth provider and client setup
src/components/
  ui/             shadcn/ui primitives (Button, Card, Dialog, ...)
  forms/          Reusable form building blocks (TanStack Form)
  layout/         App shell / navigation
  pages/          Page-level components, organized by feature (admin-page, user-page)
src/config/       Query keys, env vars, and other app configuration
src/forms/        Feature-specific form definitions and contexts
src/lib/          Shared utilities (e.g. `cn` helper)
src/routes/       TanStack Router file-based routes (`_authenticated` = requires login)
src/services/     Business logic that talks to the blockchain/backend (e.g. kyc.ts)
src/types/        Shared TypeScript types
src/web3/         viem client, contract bindings, and web3 React context
vite.config.ts
eslint.config.ts
components.json   shadcn/ui config (style, aliases, base color)
```

## Tech stack

- React 19 + Vite 8
- TanStack Router (file-based, generated via `pnpm generate-routes`)
- TanStack Query for server state (queries/mutations, cache invalidation via `queryKeys`)
- TanStack Form for form state, built through the custom `useAppForm` hook in `src/forms/`
- TanStack Table for tabular data (e.g. the admin applications table)
- TanStack Devtools (`react-devtools`, `router-devtools`, `query-devtools`, `form-devtools`, `table-devtools`) wired up for local development
- Tailwind CSS v4 + shadcn/ui (radix-ui primitives) for components
- Keycloak for authentication
- viem for blockchain interaction
- Vitest + Testing Library for tests

## Working in this project

- Add new UI primitives with the shadcn CLI (`npx shadcn@latest add <component>`) rather than hand-rolling them, so they match the project's `radix-rhea` style and stay consistent with `components.json`. When the CLI prompts to overwrite existing files (e.g. shared dependencies like `button.tsx`), decline unless you intend to update that primitive.
- After adding a shadcn component, double check the generated import for `cn` — it should come from `@/lib/utils`, not a standalone `cn` package; fix the import and revert any stray dependency the CLI adds to `package.json`/`package-lock.json` if it isn't actually needed.
- Compose feature UI out of `src/components/ui` primitives; keep feature-specific components (e.g. confirmation dialogs, decision panels) in `src/components/` and import primitives rather than duplicating markup.
- `src/components/ui/` is reserved for shadcn-generated primitives only — do not add hand-written components there. Category folders (`ui/`, `forms/`, `layout/`, `pages/`) hold flat files, one per component, not a subfolder per component. Your own standalone reusable components go directly under `src/components/` as a single file (e.g. `confirm-dialog.tsx`). Only promote a component to its own subfolder (with an `index.ts` barrel, following the `pages/admin-page` pattern) once it grows into a small cluster of related files (variants, sub-parts, colocated tests, etc.).
- Routes are file-based under `src/routes`; after adding/removing route files, run `pnpm generate-routes` to regenerate the route tree.
- Prefer TanStack Query for server state (queries/mutations) and invalidate the relevant `queryKeys` entry after mutations that change server data.
- Follow the existing lint/style rules (e.g. semicolons — see `eslint.config.ts`); run `pnpm lint` (or `pnpm check` for zero-warnings) before finishing a change, and `pnpm run -w eslint --fix <files>` to auto-fix style issues.
- Run `pnpm test` for Vitest, and `npx tsc --noEmit` for a full type-check when relevant.

## Docs

- TanStack Router — https://tanstack.com/router/latest
- TanStack Query — https://tanstack.com/query/latest
- shadcn/ui — https://ui.shadcn.com/docs
- Tailwind CSS v4 — https://tailwindcss.com/docs
- viem — https://viem.sh/llms.txt
