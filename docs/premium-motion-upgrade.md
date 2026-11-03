# Portfolio: premium motion upgrade plan

**Branch:** `prototype/field-kit-hero` · **Written:** 2026-11-02 · **Status:** proposal, awaiting approval

This plan grows out of the Bloom Boba build, a photoreal scroll film with a builder and a 3D layer. It lists what that work taught us and where the portfolio still reads as a template.

## Already done on this branch

- **`DeskScene`** (`src/components/site/DeskScene.tsx`): a photographed desk with the project's walkthrough projected onto the laptop screen through a solved `matrix3d` homography.
  - On desktop the section pins and scroll scrubs the video. On touch and under reduced motion it loops instead.
  - Projects opt in with the new `deskScene` field in `src/lib/projects.ts`.
- **Bloom Boba entry** in `projects.ts` (`/work/bloom-boba`) with a study, metrics, real screens, the walkthrough and the desk scene.
- **Home "Lab" strip:** the Bloom Boba desk scene sits right after `FlagshipWork` in `src/app/page.tsx`.

**Assets added:**
- `public/desk/bloom-boba-desk.webp` (AI photo, 1536×864).
- `public/desk/bloom-boba-scrub.mp4` (80 s, 960 px, keyframe every 8 frames so scrubbing is smooth).
- `public/walkthroughs/bloom-boba.mp4`.
- `public/previews/bloomboba/*.webp`.

## Where it still feels template-grade, in priority order

### 1. One reveal everywhere
Every section uses the same `Reveal` (opacity plus y 24, 0.7 s) with index-based stagger: `Services.tsx:82`, `Process.tsx:76`, `Voices.tsx:59`, `Impact.tsx:55`, `WalkthroughPlayer.tsx:26/51/83`, and twelve uses in `CaseStudy.tsx` (lines 168–437).

**Fix:** give each section its own entrance, using variants that already exist in `src/lib/motion.ts`:
- **Services:** `maskRise` headlines, with rows drawing in by `drawLine` rules.
- **Process:** a pinned, scroll-scrubbed step rail that moves on scroll, like the Bloom Boba chapter rail.
- **Impact:** count-ups (`CountUp.tsx`) that fire once, plus `clipReveal` image wipes.
- **Voices:** no fade. Quotes type in, or swap with a slot-machine word cycle.

### 2. Projects are shown as screenshots in a browser frame
`BrowserMockup` plus webp captures, and 20 coded previews in `src/components/previews/`.

**Fix:**
- Roll `DeskScene` out to the flagship projects. Each needs one AI desk photo (the same Figma AI prompt with a different prop on the desk: a croissant for bakery, socks for Chale Socks, a hard hat for PrimeTijara) plus a scrub encode of its walkthrough.
- Keep `BrowserMockup` for the case-study detail tabs only.
- **Recipe:**
  1. Generate the desk with `gpt-image-2.5-sunburst` and the prompt "laptop with a flat pure black screen … [prop] beside it".
  2. Detect the screen corners with the dark-run script (see "Recipes" below).
  3. Encode the scrub video: `ffmpeg -vf scale=960:-2,fps=24 -crf 30 -g 8 -keyint_min 8 -sc_threshold 0`.
  4. Add `deskScene` to the project entry.

### 3. Placeholder testimonials
`Voices.tsx:8` says "Placeholder testimonials - swap copy with real client quotes", and the authors are anonymous. Collect 3 real quotes (Anis, PrimeTijara, Zaina's) with name, role and permission. **Until then, hide `Voices`.**

### 4. No scroll-linked moments after the hero
Services, Process, Impact and Voices are static. Add exactly **one** scroll-linked moment per viewport, not more:
- **Process:** a pinned 4-step rail.
- **Impact:** a giant number that scrubs.
- **Footer:** an oversized wordmark cropped by the page bottom.

### 5. Reduced-motion gaps
- `Reveal` still animates opacity under reduced motion. That's fine for comfort, but it should be instant.
- `ScrollProgress.tsx` has no reduced-motion check.
- The desk scene already handles this.

### 6. Dead weight
- `src/components/ProjectCard.tsx` is unused.
- `Hero.tsx`, `Range.tsx` and `TickerBand.tsx` are no longer on the home page.
- Default Next files remain in `/public`: `next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg`.

Delete these once the branch merges.

### 7. Imagery
`/public` has no real photography, so everything is UI. Add 2–3 art-directed studio photos (a desk, hands on a POS, a phone in hand at a Makola stall) generated with the same lens/light language. They give the home page a physical world between the UI sections.

## Recipes from the Bloom Boba build (reuse them)

- **Consistent AI sets:** repeat one locked "set" paragraph (lens, light, backdrop, negative space) in every prompt and change only the subject line. Figma AI's `gpt-image-2.5-sunburst` works on this account; the Gemini key is free tier with no image quota.
- **Frame alignment:** store the subject's `cx`/`rim`/`base` per frame, and size and offset each image so the subject lands in the same spot (`bloom-boba/app/components/Film.tsx`).
- **Hold-then-crossfade:** each frame holds for 50% of its scroll span and crossfades over the other 50%. Add a 5% push-in while it's on screen.
- **Screen corners:** threshold luminance under 16, take the longest dark run per row, then pick the first and last stable rows.
- **Tailwind gotcha:** colours defined as `var(--x)` silently break `/opacity` modifiers. Use `rgb(r g b / <alpha-value>)` channel tokens. In this repo that applies to anything with Tailwind v4 `@theme` colours: check with a quick `bg-x/50` test.
- **Machine limits:** this MacBook throttles on a 30 W charger. Never batch-render locally; generate in the cloud (Figma AI) and only encode with ffmpeg here.

## Suggested order

1. Hide `Voices` (or ship real quotes), and delete the dead files. *(30 min)*
2. Roll `DeskScene` to PrimeTijara and Anis. *(about 2 h each, mostly asset prep)*
3. Per-section entrances, plus the pinned Process rail. *(half a day)*
4. Studio photography strip. *(2 h)*
5. Reduced-motion and `ScrollProgress` fixes. *(30 min)*
