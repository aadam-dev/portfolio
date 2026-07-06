# Portfolio Redesign Spec — "The Proof"

**Status:** ready to execute · **Owner:** Aadam · **Written:** 2026-07-05
**For the executing model:** This spec is the single source of truth. Follow it exactly. Where it says "keep", do not touch. Where it gives values (hex, ms, easing, copy), use them verbatim. Work phase by phase, in order; each phase ends with acceptance criteria you must verify (run `npm run dev`, check visually + `npm run build` must pass) before starting the next. If something is ambiguous, choose the option that best matches [Resources/ai-website-prompts/00-master-guide.md](../Resources/ai-website-prompts/00-master-guide.md).

---

## 1. Concept

This portfolio's job: make a Ghanaian SME owner or an international client think *"if this is their own site, imagine what they'd build for me."* The site itself is the proof of craft — every scroll interaction demonstrates a capability we sell.

**Design concept: "The Proof."** A dark, warm, editorial studio site where the 17 live project previews are the heroes, motion is choreographed (not decorated), and a new "Range" section shows we ship for every industry in our lead pipeline.

**What's wrong today (fix):** dark + purple `#7c6afa` + Inter display = the exact generic-AI combo; uniform riseIn reveals everywhere; WorkIndex is a filter grid (browsing, not storytelling); no smooth scroll; no scroll-driven moments; CursorGlow is decoration, not interaction.

**What's already excellent (keep, do not break):**
- `src/lib/projects.ts` data + all 17 `src/components/previews/*` live preview components
- `MagneticButton`, `Marquee`, `Reveal`, `ScrollProgress`, `BrowserMockup`, `ScaledIframe`
- SEO: `layout.tsx` metadata, `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`
- `useReducedMotion` discipline — extend it to every new effect
- Framer Motion as the only animation library — do NOT add GSAP; implement scroll effects with `useScroll`/`useTransform`/`useSpring`

## 2. Design system (Phase 0 values)

### Palette — replace in `src/app/globals.css` `:root`
Warm charcoal + gold. Kill all purple.

```css
/* Surfaces (warmed) */
--background: #0B0A08;
--surface: #12100D;
--surface-2: #181511;
--surface-3: #201C16;
/* Ink (warm off-white) */
--foreground: #F2EEE6;
--ink-2: rgba(242, 238, 230, 0.72);
--ink-3: rgba(242, 238, 230, 0.48);
--ink-4: rgba(242, 238, 230, 0.28);
--ink-5: rgba(242, 238, 230, 0.12);
/* Lines */
--line: rgba(242, 238, 230, 0.07);
--line-strong: rgba(242, 238, 230, 0.14);
/* Accent — gold, used on <10% of any viewport */
--accent: #E8B23A;
--accent-2: #F2CB6B;
--accent-glow: rgba(232, 178, 58, 0.14);
/* Deep secondary for large tinted blocks (Range section, case-study bands) */
--ember: #B33A2B;
--forest: #1E3B2E;
--success: #4ADE80;
```

Search the whole `src/` for hardcoded `#7c6afa`, `#a89fff`, `124, 106, 250`, `74, 108, 250` (Hero auroras, CursorGlow, any preview-card chrome) and replace with the gold equivalents above. Preview components (`src/components/previews/*`) keep their own per-project brand colors — they are artifacts, not site chrome.

### Typography — change in `src/app/layout.tsx`
- **Display:** `Archivo` (next/font/google, `variable: "--font-display"`, weights 500–900, `axes: ["wdth"]` if available). Headlines use weight 800, tracking `-0.03em`, and width-expanded feel via `font-stretch: 110%` where supported.
- **Editorial accent:** keep `Instrument_Serif` (italic) — used for exactly one italic word/phrase per section headline.
- **Meta/mono:** keep `JetBrains_Mono` — eyebrows, numbers, labels, always uppercase 11–12px tracking `0.14em`.
- **Body:** Inter stays for body text ONLY (≤18px). It never renders a headline again.
- Map in `globals.css` `@theme inline`: `--font-display: var(--font-archivo)`.

Type scale: hero name `clamp(4rem, 12vw, 11rem)`; section headlines `clamp(2.4rem, 5.5vw, 4.5rem)`; the ratio between a section headline and its body text must be ≥ 3:1.

### Motion system — extend `src/lib/motion.ts`
Keep `EASE_OUT`/`EASE_IN_OUT` and existing variants. Add and export:
- `maskRise`: parent has `overflow-hidden`; child `{ y: "110%" } → { y: 0 }`, 1.0s, EASE_OUT — the default headline reveal everywhere (replaces uniform riseIn for headings).
- `drawLine`: `scaleX: 0 → 1`, origin left, 0.8s EASE_IN_OUT — for hairline rules.
- Section reveal rule: **each section must use a different entrance** (mask-rise / fade-scale / clip-path inset / draw-in). Never the same variant twice in adjacent sections.
- **Smooth scroll:** add `lenis` package (`npm i lenis`). Create `src/components/site/SmoothScroll.tsx` (client component wrapping children; lerp `0.1`; disabled when `prefers-reduced-motion` or `window.matchMedia("(pointer: coarse)")`). Mount once in `layout.tsx` around `{children}`. Remove `scroll-behavior: smooth` from globals.css (conflicts).

### Hard bans (inherited from the prompt library)
No purple; no Inter headlines; no emoji icons; no three-identical-cards rows; no uniform fade-up; no new gradients except the gold `--accent-glow` radial and the Range section's tinted bands; nothing animates `width/height/top/left` (transform/opacity only).

## 3. Page architecture (new section order in `src/app/page.tsx`)

```
<Preloader />            NEW  (Phase 5)
<ScrollProgress />       keep (recolor to gold)
<Cursor />               UPGRADED from CursorGlow (Phase 5)
<Nav />                  keep structure, retype (Phase 1)
<Hero />                 REBUILT (Phase 1)
<Marquee ticker />       moved out of Hero to its own full-width band (Phase 1)
<FlagshipWork />         NEW — 3 case studies, sticky stack (Phase 2)
<WorkIndex />            REBUILT as editorial index rows (Phase 2)
<Range />                NEW — 15 verticals (Phase 3)
<Services />             restyle only (Phase 3)
<Process />              restyle + draw-in connector (Phase 3)
<Impact />               restyle + count-ups (Phase 3)
<Voices />               restyle only (Phase 3)
<Contact />              REBUILT — giant mailto (Phase 4)
<Footer />               restyle only (Phase 4)
```

## 4. Section specs

### 4.1 Hero (rebuild `src/components/site/Hero.tsx`)
Kinetic-type hero; the name is the visual. No aurora blobs (delete both divs).

- Layout: full viewport (`min-h-[100svh]`), 12-col grid, content bottom-anchored.
- Line 1 (mono eyebrow, gold dot pulse): `AADAM — FULL-STACK STUDIO, ACCRA → WORLDWIDE`.
- Lines 2–4 (Archivo 800, `clamp(4rem, 12vw, 11rem)`, uppercase, leading 0.92, tracking -0.03em):
  - `WEBSITES` — solid foreground
  - `THAT [CYCLING WORD]` — where `[CYCLING WORD]` slot-machine cycles through `SELL` / `MOVE` / `CONVERT` / `IMPRESS` (Instrument Serif italic, gold, lowercase, vertical roll 0.5s EASE_IN_OUT every 2.6s; fixed width = longest word; pauses on `prefers-reduced-motion` showing `CONVERT`)
  - `& SHIP FAST.` — outlined text (`-webkit-text-stroke: 1.5px var(--ink-3)`, transparent fill) that fills to solid on scroll (see below)
- Right-aligned meta block (mono, 12px): local time in Accra (live, `Intl.DateTimeFormat`), `AVAILABLE [CURRENT QUARTER]` with pulsing dot, `17 PRODUCTS LIVE`.
- CTAs: existing `MagneticButton` — primary `See the work ↓` (anchors to FlagshipWork), ghost `Start a project`.
- Load choreography: eyebrow fades (0.5s) → headline lines mask-rise sequentially (stagger 0.12s, 1.0s each) → meta + CTAs fade (0.4s delay). Total under 2s.
- Scroll: via `useScroll` on the section — headline translates y `0 → -8%` and opacity `1 → 0.3` over the first 60vh (parallax exit); the outlined line 4 fills to solid between scroll progress 0.1–0.35.
- Background: keep existing grain (`body::before`); add a single barely-visible gold radial `--accent-glow` at bottom-left 30% — nothing else.

### 4.2 Ticker band
Move `TICKER` array out of Hero into a standalone full-width `Marquee` band directly under the hero: 1px `--line` rules top/bottom, mono uppercase, `✳` separators (gold), 35s loop, pause on hover. Keep existing ticker copy.

### 4.3 FlagshipWork (new `src/components/site/FlagshipWork.tsx`)
Sticky-stacking case studies for the 3 best projects — the "we do serious work" section.

- Pick: `ethika` (fintech), `primehub` (B2B commerce), `koyi` (edtech). Read all display data from `projects.ts`; add an optional `flagship?: boolean` field there and set it on these three.
- Section header: mono eyebrow `SELECTED WORK — 01/03`, headline `Built to *perform*` (serif italic on "perform"), rule draws in.
- Each card: `position: sticky; top: 8vh`, `min-h-[84vh]`, `--surface-2` background, 1px `--line-strong` border, radius 24px, internal 2-col layout — left: category tag, project name (Archivo, `clamp(2rem,4vw,3.5rem)`), tagline, 3 outcome stats (from `projects.ts` outcomes; count-up on view, mono, gold), stack chips, `View case study →` link to existing project route; right: the project's existing live preview component inside `BrowserMockup`, `scale 0.97 → 1` when card becomes active.
- Stacking behavior: as card N+1 scrolls up, card N scales to `0.95`, dims to `0.55` opacity, blurs `2px` (drive with `useScroll` progress of the incoming card; transform/opacity/filter only).
- Mobile (<768px): no sticky stacking — cards stack normally, previews full-width above text.

### 4.4 WorkIndex (rebuild `src/components/site/WorkIndex.tsx`)
From filter-grid to an editorial index with hover-reveal previews. Keep the category filter (it proves range) but restyle as an inline mono link-row, not pills.

- Each project = full-width row: 1px bottom rule; grid `[index number | name | category+year | arrow]`; name in Archivo `clamp(1.6rem, 3.2vw, 2.6rem)`.
- Rows reveal on view with `maskRise`, stagger 0.05s.
- **Hover-reveal preview (desktop, `pointer: fine` only):** hovering a row shows a floating `320×220` panel at the cursor (lag: `useMotionValue` + `useSpring` stiffness 150/damping 20; rotation ±3° from cursor x-velocity) containing that project's preview screenshot (`public/previews/` — generate any missing ones with the existing `capture-screenshots.js`). Row name shifts right 12px, arrow rotates 45°, other rows dim to 0.4.
- Filter change: rows re-stagger in; use `AnimatePresence` `mode="popLayout"`.
- Mobile: rows show a small inline thumbnail; no floating panel.

### 4.5 Range (new `src/components/site/Range.tsx`)
Answers "do they know MY industry?" — mirrors the 15 verticals in [Resources/ai-website-prompts/03-local-business-prompts.md](../Resources/ai-website-prompts/03-local-business-prompts.md).

- Dark band section (`--surface`), headline: `One studio. *Every* industry.`
- 15 vertical chips in a flowing cloud (mono, 13px, 1px border): Restaurants ✳ Hotels ✳ Pharmacies ✳ Salons ✳ Construction ✳ Auto ✳ Retail ✳ Schools ✳ Real Estate ✳ Fintech ✳ Farms ✳ Events ✳ Faith orgs ✳ Fashion ✳ Professional services.
- Chips pop in with 0.04s stagger (scale 0.9→1, spring). Hovering a chip that matches a built project (`restaurant→anisfoods/jireh`, `pharmacy→lenus`, `retail→redrow/makossa`, `fintech→ethika`, `real estate→rentcheck`, `fashion→chalesocks`, `sports→madinabasketball`, `hotel→thepalms`…) lights it gold and shows a tiny `→ [project name]` tail; clicking scrolls to that WorkIndex row. Unmatched chips get tail `→ next?` in `--ink-4`.
- One closing line (serif italic, `--ink-2`): `If your industry isn't here yet, it's next.`

### 4.6 Services / Process / Impact / Voices (restyle in place)
- All: retype headlines to Archivo + one serif-italic word; swap purple accents to gold; each gets a distinct entrance per the §2 rule.
- `Process`: steps connected by an SVG line that draws in as you scroll (`pathLength` via `useScroll`); step numbers mono gold.
- `Impact`: stats become count-ups (once, 1.2s, EASE_OUT, `tabular-nums`), triggered at 60% in view.
- `Voices`: single strong quote at a time, oversized serif; no carousel dots — a mono `01/03` counter with prev/next.

### 4.7 Contact (rebuild) + Footer
- Contact: near-full-viewport closer. Mono eyebrow `HAVE A PROJECT?`; the CTA is a giant mailto — email address at `clamp(2.2rem, 7vw, 6.5rem)` Archivo, underline draws on hover, entire line magnetic (reuse MagneticButton logic at low strength 6px), click = `mailto:`, secondary click-to-copy icon with `Copied ✓` morph (roll old text up / new down, revert 1.6s). Below: WhatsApp + LinkedIn + GitHub as mono links.
- Footer: keep content; add oversized dimmed wordmark (`AADAM`, Archivo 800, ~14vw, `--ink-5`) cropped by the page bottom edge (`translate-y-[35%]`, `overflow-hidden` on footer); year + `Built by hand, shipped with AI` line.

### 4.8 Preloader + Cursor (Phase 5)
- `Preloader.tsx`: only on first visit per session (`sessionStorage.setItem("seen")`) — counter `0→100` (mono, bottom-left) over max 1.4s while wordmark mask-rises center; panel exits `y: -100%` 0.8s EASE_IN_OUT; hero entrance starts at 60% of exit. Skips entirely on reduced motion.
- Replace `CursorGlow` with `Cursor.tsx`: 10px gold dot (instant) + 32px ring (spring lag). Ring scales 2× and dot fades over links/buttons; over WorkIndex rows it morphs to a `VIEW` pill. `pointer: fine` only; native cursor stays visible (dot is additive); zero layout thrash (transform-only, `requestAnimationFrame`).

## 5. Execution phases & acceptance criteria

| Phase | Scope | Done when |
|---|---|---|
| **0. Foundation** | globals.css palette, fonts in layout.tsx, motion.ts additions, Lenis mount, purple purge | Build passes; site renders with gold/warm tokens; no `#7c6afa` remains anywhere in `src/` (grep); scroll feels damped on desktop, native on touch |
| **1. Hero + ticker** | 4.1, 4.2 | Load choreography matches spec order/timings; word cycle has no layout shift; outlined line fills on scroll; Lighthouse CLS ≈ 0; reduced-motion shows static hero |
| **2. Work** | 4.3, 4.4 | 3 flagships stack/dim/blur correctly; all 17 rows render; hover preview follows with lag on desktop, absent on touch; every project route still works |
| **3. Range + supporting** | 4.5, 4.6 | Chips map to correct projects and scroll-link works; Process line draws with scroll; Impact counts up once; adjacent sections have different entrances |
| **4. Contact + footer** | 4.7 | mailto + copy morph work; cropped wordmark doesn't cause horizontal scroll on any viewport ≥360px |
| **5. Polish** | 4.8 + QA below | Full QA checklist passes |

### Final QA checklist (Phase 5 gate)
1. `npm run build` clean; no console errors on any route.
2. 390px, 768px, 1280px, 1680px viewports: no horizontal scroll, no broken layout, motion simplified on mobile per specs.
3. `prefers-reduced-motion`: no scroll-driven transforms, no preloader, no cursor, content fully readable — verify with DevTools emulation.
4. Keyboard: all interactive elements focusable with visible focus ring (gold, 2px offset); skip-link to `#main` still works.
5. Performance: hero LCP < 2.5s local; previews below the fold lazy; no animation of layout properties (audit with DevTools performance pane — no purple layout bars during scroll).
6. SEO untouched: metadata, OG image, sitemap, robots still correct; update `opengraph-image.tsx` colors to the new palette.
7. Every section screenshot passes the squint test: could this be mistaken for a template? If yes, revisit that section's spec.

## 6. Copy bank (use verbatim, adjust facts only)

- Hero eyebrow: `AADAM — FULL-STACK STUDIO, ACCRA → WORLDWIDE`
- Hero lines: `WEBSITES / THAT convert / & SHIP FAST.` (cycling: sell, move, convert, impress)
- Flagship header: `Built to perform`
- WorkIndex header: `The index — 17 products, zero templates`
- Range header: `One studio. Every industry.` + closer `If your industry isn't here yet, it's next.`
- Contact eyebrow: `HAVE A PROJECT?` · Contact headline = the email address itself
- Footer line: `Built by hand, shipped with AI · Accra, GH · © 2026`
