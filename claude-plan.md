Plan: Consolidate FAB-SIM Spec + Visual/Performance Upgrades
Context
FAB-SIM has three overlapping spec files (FAB-SIM.md v1, FAB-SIM-v2.md, IMPLEMENTATION-PLAN.md) that are now partially stale. The editorial component decomposition is already done (HeroSection, ProductStrip, ProcessTimeline, StatsStrip, DemoSection exist in app/src/components/editorial/), but there are bugs, performance issues, and visual refinements remaining. The goal is to:

Create a single definitive FAB-SIM.md consolidating all three files
Apply visual refinements to match the "nitro" editorial aesthetic
Fix bugs and apply React performance best practices
Step 1: Fix Critical Tailwind Config Bug
File: tailwind.config.js

The config has two colors keys inside theme.extend (lines 12-55 and lines 67-76). JavaScript silently overwrites the first with the second, meaning all shadcn/ui color tokens (border, primary, secondary, etc.) are dropped. Merge them into a single colors object containing both shadcn tokens and editorial colors.

Step 2: Code-Split Console via React.lazy
Create: app/src/pages/ConsolePage.tsx
Modify: App.tsx

Extract the inline Console function (lines 12-268) from App.tsx into a new ConsolePage.tsx with export default. In App.tsx, use React.lazy(() => import('@/pages/ConsolePage')) + <Suspense> with a loading fallback. This separates the Console and all its dependencies (EventTape, MerkleExplorer, LineageGraph, EvidenceDrawer, crypto, sampleData) into a lazy-loaded chunk, reducing initial bundle for landing page visitors.

Step 3: Fix Math.random() in Render
File: ProductStrip.tsx:76

Math.random().toString(16) is called inside .map() during render, producing different values on every re-render (flicker). Replace with a static array of pre-computed hex strings.

Step 4: Hoist Static Data Outside Components
Move constant arrays to module level (React best practice: avoids recreating on every render):

File Data Current Location
StatsStrip.tsx:122 stats array Inside StatsStrip component
ProductStrip.tsx:33 Feature list in FabsimCard Inside component
ProductStrip.tsx:157 Feature list in DutyosCard Inside component
ProductStrip.tsx:188 proofs array in TrustSection Inside component
Step 5: Extract Reusable Hooks
Create: app/src/hooks/useCountUp.ts
Modify: StatsStrip.tsx

Move the useCountUp hook (lines 5-56) from StatsStrip.tsx to its own file for reusability. Update the import in StatsStrip.

Step 6: Extract ConsolePreview Component
Create: app/src/components/editorial/ConsolePreview.tsx
Modify: HeroSection.tsx
Modify: editorial/index.ts

Move ConsolePreview (lines 28-89) from HeroSection to its own file. Add export to barrel file.

Step 7: Visual Refinements to HeroSection
File: HeroSection.tsx

Consolidate four <h1> tags (lines 149-164) into a single <h1> with <span className="block"> children for proper HTML semantics
Tighten leading from leading-[0.95] to leading-[0.9] for more aggressive editorial feel
Add 2xl:text-9xl breakpoint for ultra-wide screens (spec calls for up to 120px)
Add backdrop-blur-sm bg-black/20 fallback to the mix-blend-difference nav for readability safety
Step 8: Fix ProcessTimeline Off-Screen Interval
File: ProcessTimeline.tsx:146

The setInterval for auto-advancing steps runs continuously, even when the section is off-screen. Add IntersectionObserver gating so the interval only runs when the section is visible.

Step 9: Add content-visibility for Below-Fold Sections
Add style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }} to root <section> elements in:

StatsStrip.tsx
ProductStrip.tsx
ProcessTimeline.tsx
DemoSection.tsx
This tells browsers to skip layout/paint for off-screen sections (Chrome 85+, Firefox 125+; Safari gracefully ignores).

Step 10: Write Consolidated FAB-SIM.md
Overwrite: FAB-SIM.md (project root)
Delete: FAB-SIM-v2.md, IMPLEMENTATION-PLAN.md

Create a single definitive spec with this structure:

Vision -- one-paragraph mission (TRUTHGRID brand, not TradeOS)
Architecture -- component tree with actual file paths, hash-based routing, data flow
Design System -- typography (Instrument Serif / Inter / JetBrains Mono), color palette (base dark + editorial accents), component variants
Landing Page Spec -- section-by-section with typography scale, animations, nitro editorial aesthetic
Console Spec -- layout, tabs, responsive breakpoints, console components
Crypto Spec -- domain types, hashing (WebCrypto SHA-256), Merkle tree, ledger chain
Component Inventory -- full file listing with responsibilities
Design References -- nitro template elements + Bloomberg terminal elements
Acceptance Criteria -- updated checklist reflecting actual state
Key corrections from v1:

Brand: TRUTHGRID (not TradeOS)
Routing: hash-based (not react-router-dom)
GSAP: custom Web Animations API stub (not real gsap import)
Remove codex-prompt-style deliverable language
Verification
Run cd app && npm run build -- confirm no TypeScript errors
Run npm run dev -- visually inspect landing page sections
Navigate to /#/console -- confirm lazy loading (check Network tab for separate chunk)
Test at breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px+ (ultra-wide)
Toggle prefers-reduced-motion in OS settings -- confirm all animations disabled
Confirm Math.random() flicker is gone in ProductStrip device mockup
Files Summary
Action File
Fix app/tailwind.config.js (merge duplicate colors)
Create app/src/pages/ConsolePage.tsx (extracted from App.tsx)
Modify app/src/App.tsx (React.lazy + Suspense)
Create app/src/hooks/useCountUp.ts (extracted from StatsStrip)
Create app/src/components/editorial/ConsolePreview.tsx (extracted from HeroSection)
Modify app/src/components/editorial/index.ts (add ConsolePreview export)
Modify app/src/components/editorial/HeroSection.tsx (semantics, typography, nav safety)
Modify app/src/components/editorial/ProductStrip.tsx (fix Math.random, hoist data)
Modify app/src/components/editorial/StatsStrip.tsx (extract hook, hoist data)
Modify app/src/components/editorial/ProcessTimeline.tsx (fix interval, content-visibility)
Modify app/src/components/editorial/DemoSection.tsx (content-visibility)
Overwrite FAB-SIM.md (consolidated spec)
Delete FAB-SIM-v2.md
Delete IMPLEMENTATION-PLAN.md
Stayed in plan mode
