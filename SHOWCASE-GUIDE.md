# FAB-SIM v2 Showcase Demo Guide

## What Was Created

### New Design Direction: "Nitro Editorial" x "Bloomberg Terminal"

A premium, editorial-inspired landing page that combines:
- **Bold typography** using Instrument Serif Italic for headlines
- **Color-blocked product sections** (orange for FAB-SIM, cobalt for DutyOS, gold for trust)
- **Asymmetric layouts** with full-bleed visuals
- **Dense terminal aesthetic** for the console/data sections

---

## Files Created/Modified

### 1. Documentation
- `FAB-SIM-v2.md` — Complete specification for the new design
- `IMPLEMENTATION-PLAN.md` — Step-by-step build guide
- `SHOWCASE-GUIDE.md` — This file

### 2. Configuration
- `app/tailwind.config.js` — Added font families and editorial colors
- `app/src/index.css` — Added @font-face for Instrument Serif

### 3. Font Assets
- `app/public/fonts/InstrumentSerif-Italic.woff2` — Editorial display font

### 4. New Components (`app/src/components/editorial/`)

| Component | Purpose |
|-----------|---------|
| `HeroSection.tsx` | Full-viewport hero with massive typography |
| `ProductStrip.tsx` | Color-blocked FAB-SIM/DutyOS/Trust cards |
| `StatsStrip.tsx` | Animated counter stats with sparklines |
| `ProcessTimeline.tsx` | Auto-advancing 4-step pipeline |
| `DemoSection.tsx` | Split CTA with benefits + form |
| `index.ts` | Barrel export |

### 5. Updated Pages
- `app/src/pages/LandingPage.tsx` — Refactored to use new editorial sections

---

## How to Run

```bash
cd /Users/apinzon/Desktop/Active\ Projects/FAB-SIM/app

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Open browser
open http://localhost:5173
```

---

## Design System

### Typography
```
Display:  font-display (Instrument Serif Italic) — 80px–120px headlines
UI:       font-sans (Inter) — 13px–16px buttons, labels
Data:     font-mono (JetBrains Mono) — 11px–14px console, hashes
```

### Colors
```
Base:
  Background: #020408 (near-black)
  Surface:    bg-slate-900/40
  Border:     border-slate-800

Editorial Accents:
  Orange:  #c2410c (FAB-SIM sections)
  Cobalt:  #1d4ed8 (DutyOS sections)
  Yellow:  #ca8a04 (Trust/verification sections)

Status:
  Blue:    #3b82f6 (primary actions)
  Green:   #10b981 (valid/success)
  Purple:  #8b5cf6 (sealed/verified)
```

---

## Key Features

### 1. Editorial Hero
- Full viewport height
- Massive serif typography (Instrument Serif Italic)
- Console preview card with glow effect
- Animated scroll indicator

### 2. Color-Blocked Products
- **FAB-SIM**: Orange gradient, event stream mockup
- **DutyOS**: Cobalt gradient, Merkle tree mockup
- **Trust**: Gold gradient, cryptographic proofs

### 3. Animated Stats
- Count-up animation on scroll
- Sparkline visualizations
- Live activity indicators

### 4. Interactive Timeline
- Auto-advancing steps (3s interval)
- Progress line animation
- Active/past state styling

### 5. Demo Form
- Split layout (benefits left, form right)
- Form validation
- Success state with confirmation

---

## Animations (GSAP)

### Page Load
```
Nav:          slide down + fade
Hero text:    stagger reveal (y: 40px)
CTAs:         fade up
Console card: slide in from right
```

### Scroll Triggers
```
Product cards:  fade up + scale
Stats:          count up
Timeline:       progress line draw
```

### Interactions
```
Buttons:    scale 0.98 on press
Cards:      lift on hover
Terminal:   row highlight on hover
```

---

## Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (<640px) | Single column, stacked sections |
| Tablet (640–1024px) | 2-column grids |
| Desktop (>1024px) | Full asymmetric layouts, console floats right |

---

## Next Steps (Optional Enhancements)

1. **Add actual device mockups** — Replace CSS mockups with Framer-style device frames
2. **More GSAP scroll effects** — Parallax on hero, pin sections
3. **Interactive console preview** — Make the hero console actually scroll/type
4. **Dark mode toggle** — Though it's already dark-first
5. **Performance optimization** — Lazy load below-fold sections

---

## Screenshots to Capture

1. **Hero** — Full viewport with massive typography
2. **FAB-SIM Card** — Orange gradient with event stream
3. **DutyOS Card** — Cobalt gradient with Merkle tree
4. **Stats** — All counters animating
5. **Timeline** — Step 3 active with progress line
6. **Demo Form** — Split layout

---

## Acceptance Checklist

- [ ] Font loads correctly (check Network tab for InstrumentSerif-Italic.woff2)
- [ ] Headlines render in italic serif font
- [ ] Orange/cobalt/gold sections display correctly
- [ ] Stats animate on scroll
- [ ] Timeline auto-advances
- [ ] Form validates and shows success state
- [ ] Console link works
- [ ] Mobile responsive (single column)
- [ ] Reduced motion respected

---

**Demo URL:** http://localhost:5173  
**Console URL:** http://localhost:5173/#/console
