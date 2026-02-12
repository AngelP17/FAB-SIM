# TradeOS Agent Development Guide

Repository: `FAB-SIM`

Last updated: 2026-02-12

---

## Scope of This Repo (Current)

This repository is a frontend-first demo implementation for TradeOS.

Implemented:

- `apps/web` (React 19 + TypeScript + Vite)
- `packages/types` (`@truthgrid/types`)
- `packages/crypto` (`@truthgrid/crypto`)
- Hash-based landing + console demo routes
- Deterministic sample ledger generation
- Merkle visualization and evidence inspection
- Turborepo + pnpm workspace setup

Not implemented yet:

- backend API service
- docs site app
- shared UI component package

---

## Local Setup

```bash
pnpm install
pnpm dev
```

Quality gates:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

---

## Engineering Rules

1. Keep docs truthful to actual code state.
2. Any “completed” claim must be backed by a command run.
3. Deterministic demo behavior: no `Math.random()` in render paths or deterministic data paths.
4. Keep branding consistent: TradeOS (platform), DutyOS (calculation module), TradeOS Console.
5. Prefer small verifiable iterations over large speculative docs.

---

## Working Structure

```text
apps/
  web/
packages/
  config-ts/
  types/
  crypto/
```

If new apps/packages are introduced, update this file and `README.md` in the same PR.

---

## Current Known Gaps

- No backend (`apps/api`) yet
- No documentation app (`apps/docs`) yet
- No dedicated unit/e2e test suites yet
- No CI workflow files yet

---

## Definition of Done for Changes

A change is complete only when all are true:

1. `pnpm lint` passes
2. `pnpm typecheck` passes
3. `pnpm build` passes
4. related docs are updated
5. `PROJECT-EXECUTION-LOG.md` includes command verification summary

---

## Verified by Command Output

Date: 2026-02-12

```bash
pnpm lint      # pass
pnpm typecheck # pass
pnpm test      # pass
pnpm build     # pass
```
