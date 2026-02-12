# TradeOS Project Roadmap

Status: Demo-ready frontend foundation
Last updated: 2026-02-12

---

## What Exists Today

- TradeOS landing and console demo in `apps/web`
- Deterministic sample ledger + cryptographic verification primitives
- shared domain packages: `@truthgrid/types`, `@truthgrid/crypto`
- Monorepo tooling with pnpm + Turborepo

---

## What Does Not Exist Yet

- `apps/api` backend service
- `apps/docs` documentation app
- dedicated test suites (Vitest/RTL/Playwright)
- CI workflows
- deploy automation

---

## Delivery Phases

### Phase A - Truthful Demo Foundation (Complete)

- remove non-deterministic randomness in critical demo paths
- stabilize lint/typecheck/build pipeline
- normalize docs to current state

### Phase B - Product Credibility (Next)

- add `apps/api` deterministic replay + proof endpoints
- move crypto/domain types into reusable packages
- add unit tests for hashing/merkle correctness

### Phase C - Sales-Ready Platform Demo

- audit export artifacts (JSON/CSV + proof bundle)
- operator/entity filtering in console
- scenario presets for GTM demos

### Phase D - Production Hardening

- CI/CD workflows
- observability + error tracking
- auth and role boundaries

---

## Milestones and Exit Criteria

1. API milestone: replay + proof verify endpoints available
2. Test milestone: crypto tests >= 90% line coverage
3. Reliability milestone: CI required checks green on PR
4. Demo milestone: 15-minute scripted flow without manual patching

---

## Verified by Command Output

Date: 2026-02-12

```bash
pnpm lint      # pass
pnpm typecheck # pass
pnpm test      # pass
pnpm build     # pass
```
