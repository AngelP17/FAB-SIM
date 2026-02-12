# TradeOS - Audit-Grade Fintech Landing & Console Spec

Brand: TradeOS
Sub-brand module: DutyOS
App surface: TradeOS Console

---

## Product Narrative

TradeOS is the operating system for free trade zones.

Flow:

1. AI customs agent converts messy trade documents into structured customs records
2. Predictive logistics derives route/delay risk events from normalized entries
3. Invoice factoring computes risk-scored financing decisions from verified events
4. Tamper-evident ledgering seals provenance (hash chain + Merkle) for replay/audit

---

## Demo Goals (YC-grade)

- Explain value in under 30 seconds
- Show evidence-first compliance posture
- Demonstrate deterministic replay credibility
- Make console interactions feel audit-ready

---

## Current Implemented Experience

Routes:

- `/#/` - landing page
- `/#/console` - console demo
- `/#/ai` - AI extraction demo
- `/#/demo` - guided full demo

Key implemented UI blocks:

- hero + editorial sections
- service-chain messaging: AI customs -> predictive logistics -> invoice factoring
- console workspaces tab flow with mock operational I/O for the three services
- actionable workspace progression controls (run, advance step, reset, run full chain)
- event tape
- Merkle explorer
- lineage graph
- evidence drawer

---

## Current Technical Reality

Implemented now:

- deterministic hash/ledger generation in `apps/web/src/lib/sampleData.ts`
- shared SHA-256 + Merkle utilities in `packages/crypto/src/index.ts` (`@truthgrid/crypto`)
- shared domain types in `packages/types/src/index.ts` (`@truthgrid/types`)
- lazy route chunking for console/AI/demo pages

Not implemented now:

- backend verification API
- persistent execution engine
- production model-serving stack

---

## Required Consistency Rules

- Brand naming in content: TradeOS / DutyOS / TradeOS Console
- No random behavior in deterministic or render-critical paths
- Any “complete” statement must reference passing command output

---

## Verified by Command Output

Date: 2026-02-12

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

All commands pass in the current repo state.
