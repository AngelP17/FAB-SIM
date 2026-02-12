# TradeOS Demo Showcase Guide

Audience: YC partners, design partners, trade/compliance operators
Duration: 12-15 minutes

---

## Demo Story Arc

1. Problem: Trade documentation is messy and hard to audit
2. TradeOS approach: AI ingestion -> deterministic events -> tamper-evident ledger -> sealed claims
3. Console proof: inspect event lineage and Merkle-backed evidence
4. Outcome: faster, defensible, repeatable claim verification

---

## Recommended Live Flow

1. Open landing page (`/#/`)
2. Explain one-liner and value props
3. Launch TradeOS Console (`/#/console`)
4. Select an event in Event Tape
5. Show Merkle Explorer + root integrity
6. Open Evidence Drawer and explain reproducibility
7. Optional: open AI route (`/#/ai`) to show ingestion-style experience

---

## Talk Track Snippets

- “This is not trust-based software; it is evidence-based software.”
- “Given the same inputs, TradeOS replay yields the same claim outputs.”
- “Every sealed claim is tied to immutable hash lineage.”

---

## What To Avoid Claiming

- live production backend services (not in this repo yet)
- enterprise auth/SSO features (not implemented)
- completed ML risk services (still roadmap)

---

## Verified by Command Output

Date: 2026-02-12

```bash
pnpm lint      # pass
pnpm typecheck # pass
pnpm test      # pass
pnpm build     # pass
```

