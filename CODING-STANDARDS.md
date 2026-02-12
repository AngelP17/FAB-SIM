# TRUTHGRID Coding Standards

**Version**: 1.0.0 | **Applies to**: All TRUTHGRID repositories | **Last Updated**: 2026-02-12

---

## Philosophy

> "Code is read 10x more than it's written. Write for the next engineer."

We optimize for:
1. **Clarity** over cleverness
2. **Maintainability** over brevity
3. **Correctness** over speed (premature optimization)
4. **Accessibility** over aesthetics

---

## Monorepo Structure (pnpm workspaces)

```
truthgrid/
├── apps/
│   ├── web/                 # Next.js/Vite marketing + console
│   ├── docs/                # Documentation site
│   └── api/                 # FastAPI backend
├── packages/
│   ├── ui/                  # Shared React components
│   ├── crypto/              # WASM cryptography
│   ├── types/               # Shared TypeScript
│   ├── config-eslint/       # Shared ESLint config
│   ├── config-ts/           # Shared TS config
│   └── config-tailwind/     # Shared Tailwind config
└── tooling/
    └── scripts/             # Build, deploy scripts
```

### Workspace Configuration

```json
// package.json (root)
{
  "name": "truthgrid",
  "private": true,
  "packageManager": "pnpm@8.15.0",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^1.12.0"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Package Naming

- Apps: `@truthgrid/web`, `@truthgrid/api`
- Packages: `@truthgrid/ui`, `@truthgrid/crypto`

---

## TypeScript Standards

### Strict Mode Required

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Patterns

```typescript
// ✅ GOOD: Explicit return types on exports
export function hashEvent(event: MaterialLossEvent): Promise<Hex> {
  // implementation
}

// ✅ GOOD: Discriminated unions for state
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// ✅ GOOD: Branded types for primitives
type Hex = string & { __brand: 'Hex' };
type EventId = string & { __brand: 'EventId' };

// ❌ BAD: Implicit any
function process(data) { } // No!

// ❌ BAD: Object type without index signature
interface Config {
  [key: string]: any; // Avoid
}
```

### Interface vs Type

```typescript
// Use interface for object shapes that may be extended
interface ComponentProps {
  children: React.ReactNode;
}

interface ButtonProps extends ComponentProps {
  variant: 'primary' | 'secondary';
}

// Use type for unions, tuples, function types
type ClickHandler = (event: MouseEvent) => void;
type Status = 'idle' | 'loading' | 'success' | 'error';
```

---

## React Standards

### Component Structure

```typescript
// ✅ GOOD: Named export, explicit props interface, functional
import { useState, useCallback, useMemo, memo } from 'react';

interface EventCardProps {
  event: MaterialLossEvent;
  isSelected: boolean;
  onSelect: (id: EventId) => void;
}

export const EventCard = memo(function EventCard({
  event,
  isSelected,
  onSelect
}: EventCardProps): JSX.Element {
  // Derived state with useMemo
  const displayHash = useMemo(() => 
    truncateHash(event.eventHash),
    [event.eventHash]
  );

  // Event handlers with useCallback
  const handleClick = useCallback(() => {
    onSelect(event.id);
  }, [onSelect, event.id]);

  return (
    <button 
      onClick={handleClick}
      aria-pressed={isSelected}
    >
      {displayHash}
    </button>
  );
});

// ❌ BAD: Default export, FC type, inline props
import React, { FC } from 'react'; // Don't import React

const EventCard: FC<{ event: any }> = (props) => { }; // No any
export default EventCard; // No default exports
```

### Hooks Rules

```typescript
// ✅ GOOD: Hooks at top level only
function useEventData(eventId: EventId) {
  const [data, setData] = useState<Event | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      try {
        const result = await fetchEvent(eventId);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e as Error);
      }
    }
    
    void load();
    return () => { cancelled = true; };
  }, [eventId]); // Complete dependency array
  
  return { data, error };
}

// ❌ BAD: Conditional hooks
if (condition) {
  useEffect(() => { }, []); // Never!
}

// ❌ BAD: Missing dependencies
useEffect(() => {
  fetchData(id);
}, []); // Missing 'id'
```

### Performance Patterns

```typescript
// Split heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));

// Memoize expensive computations
const merkleRoot = useMemo(() => 
  computeMerkleRoot(events),
  [events]
);

// Stable callbacks for children
const handleSelect = useCallback((id: EventId) => {
  setSelectedId(id);
}, []);

// Virtualize long lists
<Virtuoso
  data={events}
  itemContent={(index, event) => <EventRow event={event} />}
/>
```

---

## Styling Standards (Tailwind)

### Class Ordering

```typescript
// 1. Layout (display, position)
// 2. Sizing (width, height)
// 3. Spacing (margin, padding, gap)
// 4. Typography (font, text)
// 5. Visual (bg, border, shadow)
// 6. Interactive (hover, focus)
// 7. Motion (transition, animate)

<div className="
  flex items-center justify-between
  w-full h-12
  px-4 py-2 gap-2
  text-sm font-mono
  bg-slate-900 text-slate-200 border border-slate-800
  hover:bg-slate-800
  transition-colors duration-200
"/>
```

### Design Tokens Only

```typescript
// ✅ GOOD: Semantic colors
<div className="bg-slate-900 text-blue-400" />

// ❌ BAD: Arbitrary values (exceptions need justification)
<div className="bg-[#1a1a2e]" /> // Avoid
```

### Component Variants (cva)

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
        ghost: 'hover:bg-slate-800 text-slate-400',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

---

## Animation Standards (GSAP)

### Accessibility First

```typescript
function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export function useGsapAnimation(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    
    const ctx = gsap.context(() => {
      // Animation logic
    }, ref);

    return () => ctx.revert();
  }, []);
}
```

### Timing Standards

| Property | Value | Notes |
|----------|-------|-------|
| Duration | 0.25–0.6s | Never > 1s |
| Easing | `power2.out` | Crisp, professional |
| Stagger | 0.06s | Subtle, sequential |
| Y-offset | 6–12px | Small, precise |

**Forbidden**: elastic, bounce, excessive scale/rotation

---

## Crypto Standards

### WebCrypto Required

```typescript
// ✅ GOOD: Native WebCrypto
export async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(digest);
}

// ❌ BAD: External crypto libraries (bundle bloat)
import { sha256 } from 'some-crypto-lib'; // Avoid
```

### Deterministic Operations

```typescript
// ✅ GOOD: Stable serialization
export function canonicalize(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

// ✅ GOOD: Explicit domain separators
const EVENT_SEPARATOR = new TextEncoder().encode('TRUTHGRID_EVENT_V1');
const LEDGER_SEPARATOR = new TextEncoder().encode('TRUTHGRID_LEDGER_V1');
```

---

## Testing Standards

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { buildMerkleRoot } from '@truthgrid/crypto';

describe('merkle tree', () => {
  it('produces deterministic root for same inputs', async () => {
    const leaves = ['0xabc...', '0xdef...'];
    const [root1, root2] = await Promise.all([
      buildMerkleRoot(leaves),
      buildMerkleRoot(leaves),
    ]);
    expect(root1).toBe(root2);
  });

  it('handles empty leaf array', async () => {
    const root = await buildMerkleRoot([]);
    expect(root).toMatch(/^0x[a-f0-9]{64}$/);
  });
});
```

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from './EventCard';

it('calls onSelect when clicked', () => {
  const handleSelect = vi.fn();
  render(<EventCard event={mockEvent} onSelect={handleSelect} />);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleSelect).toHaveBeenCalledWith(mockEvent.id);
});

it('shows selected state', () => {
  render(<EventCard event={mockEvent} isSelected />);
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can navigate to console', async ({ page }) => {
  await page.goto('/');
  await page.click('text=View Console');
  await expect(page).toHaveURL('/#/console');
  await expect(page.locator('text=Event Tape')).toBeVisible();
});
```

---

## Git Standards

### Commit Messages (Conventional Commits)

```
feat(console): add real-time event streaming
fix(crypto): handle odd leaf count in merkle tree
docs(readme): update installation instructions
refactor(hooks): extract useCountUp to shared package
test(crypto): add property-based tests for hashing
perf(landing): add content-visibility for sections
chore(deps): update typescript to 5.3
```

### Branch Naming

```
feature/merkle-verification
fix/event-tape-scroll
refactor/monorepo-migration
hotfix/security-patch
```

### PR Requirements

- [ ] Type check passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] No console errors
- [ ] Accessibility verified (axe-core)
- [ ] Performance budget met
- [ ] Reviewed by 1+ engineer

---

## Code Review Checklist

### For Authors

- [ ] Self-reviewed diff
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No `any` types without comment
- [ ] No `console.log` left in
- [ ] Accessibility considered

### For Reviewers

- [ ] Logic correctness
- [ ] Performance implications
- [ ] Security considerations
- [ ] Test coverage adequate
- [ ] Naming clear and consistent
- [ ] No unnecessary complexity

---

## Performance Budgets

| Metric | Budget | Enforcement |
|--------|--------|-------------|
| First JS | < 300KB | Bundle analyzer |
| Lazy chunks | < 50KB | Build check |
| Lighthouse | > 90 | CI gate |
| TTI | < 3.5s | Lighthouse |
| CLS | < 0.1 | Lighthouse |

---

## Security Checklist

- [ ] No secrets in code (use env vars)
- [ ] Input validation on all APIs
- [ ] Output encoding for display
- [ ] CSP headers configured
- [ ] Dependencies audited (`pnpm audit`)
- [ ] CORS properly configured

---

## Documentation Standards

### JSDoc for Public APIs

```typescript
/**
 * Builds a Merkle tree from leaf hashes using SHA-256.
 * If odd number of leaves, duplicates the last leaf.
 * 
 * @param leaves - Array of hex-encoded leaf hashes (0x...)
 * @returns Root hash as hex string
 * @throws Error if leaves array is malformed
 * 
 * @example
 * ```ts
 * const root = await buildMerkleRoot(['0xabc...', '0xdef...']);
 * console.log(root); // '0x7d2a...'
 * ```
 */
export async function buildMerkleRoot(leaves: Hex[]): Promise<Hex> {
  // implementation
}
```

### README Structure

```markdown
# Package Name

One-line description.

## Installation

## Usage

## API

## Configuration

## Troubleshooting

## License
```

---

**Questions?** Ping `#engineering` or check `AGENTS.md` for workflow details.
