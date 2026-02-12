# TradeOS Coding Standards

Version: 2.0
Last updated: 2026-02-12

---

## Core Principles

1. Determinism first.
2. Evidence over claims.
3. Readability over cleverness.
4. Accessibility and performance are required, not optional.

---

## Stack Standards

- TypeScript strict mode
- React 19 functional components
- Vite build toolchain
- TailwindCSS utility-first styling
- WebCrypto for hashing primitives

---

## Determinism Rules

- Do not use `Math.random()` in render paths.
- Do not use non-seeded randomness in sample ledger generation.
- Hashing must use stable canonical serialization (`stableStringify`).
- Any demo value claiming reproducibility must be seed- or input-derived.

---

## React Rules

- Keep components pure.
- Avoid direct state-setting in effects when value can be derived or initialized directly.
- Keep hook dependency arrays complete.
- Use lazy loading for heavy routes/components.

---

## Documentation Rules

- Never mark a feature “done” without command or artifact evidence.
- Keep roadmap items clearly separated from implemented features.
- Include `Verified by command output` section when updating major docs.

---

## Monorepo Rules

Current repo is intentionally minimal:

- `apps/web`
- `packages/config-ts`
- `packages/types`
- `packages/crypto`

Do not document non-existent apps/packages as implemented.

---

## Quality Gate

Required before merge:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Recommended:

```bash
pnpm test
```

---

## Verified by Command Output

Date: 2026-02-12

```bash
pnpm lint      # pass
pnpm typecheck # pass
pnpm test      # pass
pnpm build     # pass
```
