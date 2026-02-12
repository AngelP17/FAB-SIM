# TradeOS Web App

Frontend demo app for TradeOS landing + console.

---

## Routes

- `/#/` - landing
- `/#/console` - TradeOS Console
- `/#/ai` - AI extraction demo
- `/#/demo` - guided walkthrough

---

## Local Development

```bash
pnpm --filter @truthgrid/web dev
```

Build:

```bash
pnpm --filter @truthgrid/web build
```

Lint:

```bash
pnpm --filter @truthgrid/web lint
```

Typecheck:

```bash
pnpm --filter @truthgrid/web typecheck
```

---

## Notes

- Uses hash-based routing for static deployment compatibility.
- Console/AI/demo routes are lazy-loaded.
- Deterministic sample data generation lives in `src/lib/sampleData.ts`.
- Shared crypto and type primitives come from workspace packages:
  `@truthgrid/crypto` and `@truthgrid/types`.

---

## Verified by Command Output

Date: 2026-02-12

```bash
pnpm --filter @truthgrid/web lint      # pass
pnpm --filter @truthgrid/web typecheck # pass
pnpm --filter @truthgrid/web build     # pass
```
