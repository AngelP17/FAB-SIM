# TradeOS

**The Operating System for Free Trade Zones**

AI customs agent -> predictive logistics -> invoice factoring -> tamper-evident proof rails.

---

## One-Liner

TradeOS uses AI to convert messy shipping documents into schema-bound events, then runs predictive logistics and invoice factoring decisions with deterministic, auditable evidence.

## Primary Value Props

- Vision-to-Hash ingestion (unstructured -> structured)
- AI customs agent service (document-to-entry automation)
- predictive logistics service (route and risk forecasts)
- invoice factoring service (risk-scored financing decisions)
- Deterministic replay (seed-consistent proofs)
- Tamper-evident ledger (hash chains + Merkle batching)
- Sealed financial artifacts (immutable artifacts)

---

## Current Repository State (Truthful)

This repository currently contains:

- `apps/web`: Vite + React landing + console demo
- Console workspaces simulation for:
  - AI customs agent
  - predictive logistics
  - invoice factoring
  - actionable step controls (`Run Intake`, `Recompute Forecast`, `Issue Advance`, `Run Full Chain`)
- `packages/config-ts`: shared TypeScript config package
- `packages/types`: shared domain types package (`@truthgrid/types`)
- `packages/crypto`: shared crypto utilities package (`@truthgrid/crypto`)
- Turborepo + pnpm workspace orchestration

Not yet implemented in this repo:

- `apps/api`
- `apps/docs`
- shared UI package (`@truthgrid/ui`)
- CI workflows under `.github/workflows`

---

## Quick Start

```bash
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

---

## Repository Layout

```text
FAB-SIM/
  apps/
    web/
  packages/
    config-ts/
    types/
    crypto/
  tooling/
  README.md
  AGENTS.md
  FAB-SIM.md
  CODING-STANDARDS.md
  PROJECT-ROADMAP.md
  PROJECT-EXECUTION-LOG.md
  ML-SYSTEM-DESIGN-ANALYSIS.md
  SHOWCASE-GUIDE.md
```

---

## Documentation

- [FAB-SIM.md](./FAB-SIM.md) - YC-grade landing + console spec for TradeOS
- [AGENTS.md](./AGENTS.md) - engineering workflow guide
- [CODING-STANDARDS.md](./CODING-STANDARDS.md) - implementation standards
- [PROJECT-ROADMAP.md](./PROJECT-ROADMAP.md) - delivery roadmap
- [PROJECT-EXECUTION-LOG.md](./PROJECT-EXECUTION-LOG.md) - latest execution/audit log
- [ML-SYSTEM-DESIGN-ANALYSIS.md](./ML-SYSTEM-DESIGN-ANALYSIS.md) - ML research direction
- [SHOWCASE-GUIDE.md](./SHOWCASE-GUIDE.md) - live demo script

---

## Verified by Command Output

Date: 2026-02-12

```bash
pnpm lint
# success (turbo + @truthgrid/types + @truthgrid/crypto + @truthgrid/web)

pnpm typecheck
# success

pnpm test
# success (currently build-backed pipeline; dedicated tests still to add)

pnpm build
# success
# notable bundle outputs:
# - main app chunk ~364.94 kB
# - console chunk ~8.60 kB
# - AI demo chunk ~51.44 kB
```
