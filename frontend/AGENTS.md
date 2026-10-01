# React + Vite frontend

## Project layout

```
src/api/          API client functions (axios) for the backend
src/auth/         Keycloak auth provider and client setup
src/components/
  ui/             shadcn/ui primitives (Button, Card, Dialog, ...)
  forms/          Reusable form building blocks (TanStack Form)
  layout/         App shell / navigation
  pages/          Page-level components, organized by feature (admin-page, user-page)
src/config/       Query keys, environment variables, contract and wagmi configuration
src/forms/        Shared TanStack Form hook and contexts
src/lib/          Shared utilities (e.g. `cn` helper)
src/routes/       TanStack Router file-based routes (`_authenticated` = requires login)
src/services/     Business logic that coordinates API and blockchain-related operations
src/types/        Shared TypeScript types
src/web3/         Blockchain chain configuration
vite.config.ts
eslint.config.ts
components.json   shadcn/ui config (style, aliases, base color)
```

## Tech stack

- React 19 + Vite 8
- TanStack Router (file-based, route tree generated via `npm run generate-routes`)
- TanStack Query for server state (queries/mutations, cache invalidation via `queryKeys`)
- TanStack Form for form state, built through the custom `useAppForm` hook in `src/forms/`
- TanStack Table for tabular data (e.g. the admin applications table)
- TanStack Devtools for local development
- Tailwind CSS v4 + shadcn/ui (radix-ui primitives) for components
- Keycloak for authentication
- wagmi and viem for wallet and blockchain interaction
- Vitest + Testing Library for tests
- Node.js 24 or newer (see `package.json`)

## Working in this project

- Use npm with the checked-in `package-lock.json`; use Node.js 24 or newer.
- Add UI primitives with the shadcn CLI (`npx shadcn@latest add <component>`) when appropriate, matching the project's `radix-rhea` style and `components.json` aliases. Decline prompts to overwrite existing primitives unless you intend to change them.
- Use the shared `cn` helper from `@/lib/utils` for class merging. Review CLI changes to `package.json` and `package-lock.json` rather than reverting them automatically.
- Compose feature UI out of `src/components/ui` primitives; keep feature-specific components (e.g. confirmation dialogs, decision panels) in `src/components/` and import primitives rather than duplicating markup.
- `src/components/ui/` is reserved for shadcn-generated primitives only — do not add hand-written components there. Category folders (`ui/`, `forms/`, `layout/`, `pages/`) hold flat files, one per component, not a subfolder per component. Your own standalone reusable components go directly under `src/components/` as a single file (e.g. `confirm-dialog.tsx`). Only promote a component to its own subfolder (with an `index.ts` barrel, following the `pages/admin-page` pattern) once it grows into a small cluster of related files (variants, sub-parts, colocated tests, etc.).
- Routes are file-based under `src/routes`; after adding, removing, or renaming route files, run `npm run generate-routes` to regenerate `src/routeTree.gen.ts`. Do not hand-edit the generated route tree.
- Prefer TanStack Query for server state (queries/mutations) and invalidate the relevant `queryKeys` entry after mutations that change server data.
- Follow the existing lint/style rules (including required semicolons in `eslint.config.ts`). Run `npm run lint` or `npm run check` (zero warnings) before finishing; use `npm run format -- <files>` to apply ESLint fixes to specific files.
- Run `npm test` for Vitest. Add or update focused tests when changing behavior; the current repository has no checked-in test files.
- Run `npm run build` to verify the production bundle. Use `npx tsc --noEmit` when a standalone type-check is useful.

## Docs

- TanStack Router — https://tanstack.com/router/latest
- TanStack Query — https://tanstack.com/query/latest
- shadcn/ui — https://ui.shadcn.com/docs
- Tailwind CSS v4 — https://tailwindcss.com/docs
- viem — https://viem.sh/llms.txt
