# Field Kit: forward deployed engineer rebrand (prototype)

## Context
The X trend research (Zara Zhang's "personal website is the new resume", Benji Taylor's "should feel like you've briefly left the internet") showed what people share: **one ownable concept from your craft, something to play with above the fold, work told through that metaphor, one metric per project, restraint**. Our live site (aadambuilds.dev) is a well-made but generic "studio template" (giant Archivo caps, serif italic word, outline text, marquee) aimed at Ghanaian SMEs.

New target: **foreign remote roles**. Positioning: **forward deployed engineer (FDE)**. I embed with operators, analysts and coaches, ship the system they run on, and stay until the numbers move. Range covers POS/ops, service workflows, fashion commerce, finance and analyst models, ERP/Odoo/data, sports/community data, edtech and platforms.

**Concept: "Field Kit".** A single physical-looking device (a hardware object in the Teenage Engineering / Braun spirit) that runs every deployment. A rotary mode dial turns as you scroll, the screen switches modes, and each mode is a real, playable toy built from shipped work. Every action writes to **one shared event log** on the device, the FDE story of many surfaces and one source of truth. At the end, the same device becomes a **Build desk** (a POS for ordering a build) that prints a ticket and sends it as an inquiry.

Branch: `prototype/field-kit-hero` (already created). Already written there, uncommitted: `src/components/fieldkit/events.ts`, `modes/CounterMode.tsx`, `modes/LaundryMode.tsx`, `modes/FinanceMode.tsx`. These are kept and refined.

## Page structure (home, on the branch)
1. **Hero (chapter 00):** left: eyebrow `AADAM · FORWARD DEPLOYED ENGINEER · ACCRA GMT+0, OVERLAPS EU + US EAST`; H1 "I ship the systems *people run on.*"; sub: embed, build, stay; CTAs "Play with the kit" / "Build with me"; meta: live clock, availability, "20+ systems in production". Right: the device **boots** (screen flicker, LEDs, log lines `kit.boot ok · 8 deployments loaded`).
2. **Deployments (scrollytelling):** on desktop (≥1024px) the device stays sticky on the right through the hero and every chapter. Left column: chapters 01–07, each about 100vh. The active chapter sets the device mode. The dial rotation and the progress ticks are scroll-linked. Each chapter has: index, display title + one serif-italic accent, a 2-line field note (problem → what shipped), 3 count-up metrics, project chips linking to `/work/[slug]`, and a "Try it" hint.
3. **Existing** `FlagshipWork` + `WorkIndex` stay as "All deployments" (the full list of 22). `Range` is dropped (the chapters cover range). `Services`, `Process`, `Impact` and `Voices` are kept for now, with copy reframed later.
4. **Build desk (chapter 08)** replaces the top of `Contact`: the device opens centred in Build mode, with the existing `InquiryForm` as the "or just write to me" fallback.
5. `TickerBand`, the old `Hero` and the outline/marquee tropes are removed from the home page (files kept until approval).

Mobile: no sticky. Each chapter renders its own compact inline device, which mounts on view. No tilt, touch-first controls, and only the active toy is mounted.

## The deployments (modes)
| # | Mode | Projects it represents | Toy |
|---|---|---|---|
| 01 | **Counter** (POS & ops) | Al Boyut, PrimeTijara, Jireh, Anis Foods, Makossa, Redrow | Tap stock to ring up a sale, then "Charge": a **receipt prints out of a slot on top of the device**, stock decrements, and a low-stock flag appears. A "Send to cashier" toggle plays the **voice handoff** (chime + SpeechSynthesis "New order from Baria", muted by default). |
| 02 | **Laundry** (service workflow) | An-Nur laundry ops | **Drag garments** from a basket into the drum (tap fallback), then Start: water fills, the drum sloshes then spins, and stages run Received → Washing → Drying → Pressing → Ready. Then "Text customer" (SMS bubble) and "Scan & collect", and the ticket number increments. |
| 03 | **Atelier** (fashion commerce) | Muna Muse, Zaina's Couture, Chale Socks, Gaskiya | Pick a silhouette (kaftan, boubou, shirt dress, kente socks) and a **procedural print** coded as SVG `<pattern>`s in `prints.tsx`: kente (woven stripe blocks), adinkra stamps (gye nyame, sankofa), wax-print (Dutch-wax bubbles/leaves), bogolan mudcloth, adire indigo. Each has 2–3 colourways. Realism comes from the garment rendering: a silhouette path clip, a fold-shadow gradient overlay, seam lines, a soft drop shadow and a fabric-weave noise filter (`feTurbulence`), and the print "drapes" (a slight `feDisplacementMap` warp). Switching print uses a cloth-wipe transition. A market toggle shows **USD / GHS priced per market, not FX-converted** (the Muna detail). "Add to bag" builds a WhatsApp order message ("the bag is the order"). |
| 04 | **Analyst desk** (finance models) | Ethika, Lady Angel, SIIF, plus analyst background (50+ SMEs screened, VC fund) with no Mirepa mention | **Deal model with stress tests.** Sliders for revenue, growth, gross margin, capex and discount rate. **Shock buttons:** cedi −30%, rates +500bp, demand −20%, delayed receivables. Outputs: NPV/IRR, DSCR covenant light (pass/breach), a scenario fan chart (base/bear/bull) and a tornado chart of sensitivities. Second tab **"Compare"**: the existing murabaha vs loan tool (`FinanceMode.tsx`). |
| 05 | **Ledger** (ERP, Odoo, data) | Delish (Odoo 19), Anis/Jireh back offices, PrimeTijara procurement | "Sell 1 Jollof + chicken": the **BOM explodes** into ingredients, which deduct with real unit conversions (crate → 53 bottles, kg → g). Stock bars drop and a reorder point **drafts a PO**. "Run physical count" shows variance per SKU and a reconcile step (the auditable-formula story). |
| 06 | **Court** (sports + community data) | Madina Basketball (GHS 40K+, solar court) | Half-court: click or tap anywhere to **shoot**. The ball arcs to the hoop and make probability falls with distance. Live stats: FG%, eFG%, points per shot, a zone heatmap and a shot chart. Tab **"Court ops"**: booking utilisation by hour, solar kWh, and a donation transparency ledger (where the GHS 40K went). Copy line: the pipeline that tracks shots is the one that tracks donors. |
| 07 | **Classroom & platforms** (index chapter, lighter toy) | Kōyi, Rentcheck, Lenus, Rockmotion, Pronaj, The Palms, Magilo | Kōyi WASSCE pathway picker: choose a target programme and see the required subjects/grades light up. The other projects appear as chips with hover previews (reusing the WorkIndex preview pattern). |
| 08 | **Build desk** (contact) | — | A physical **HIRE / BUILD** slide switch on the device. **Build**: a POS for a build. Catalogue keys: Storefront, POS register, Inventory & stock-takes, Back office/dashboards, WhatsApp ordering, Payments (Paystack/MoMo/Stripe), Odoo ERP setup, Data model & reporting, Brand identity, i18n EN/FR/AR, AI assistant. Each adds indicative weeks, and a **timeline bar** (parallel vs sequential tracks) builds as items are added. No prices. **Hire**: role keys (Full-time FDE, Contract, Embedded per project), start window, timezone overlap (your TZ vs GMT+0 working-hours bar), and stack focus chips. Both modes **print a ticket** that also lists what the visitor did on the kit (e.g. "rang 2 sales, stress-tested 1 deal, 4/7 from the field"). "Send" posts the ticket text to the existing `/api/inquiry`, with the existing WhatsApp fallback. |

## Device design (signature motif)
- Body: anodised warm-grey shell, radius 28, engraved mono label `FIELD KIT · FDE-01`, two status LEDs, speaker grille, a **rotary dial** with 8 detents (scroll-linked rotation on desktop, clickable on all sizes) and chunky physical mode keys (press = translateY 2px + shadow shrink).
- Screen: dark inset, a mode header, the toy area, and a 3-line **event log** at the bottom (`HH:MM:SS pos.sale.completed #0042 · GHS 275.00`).
- Receipt slot on top: a paper strip grows out with a perforated edge and a slight jitter.
- Mode switch: a scanline wipe (clip-path inset) plus the dial detent click.
- Tilt follows the pointer (spring, ±4°), desktop only.

## Visual system (rebrand): night + day
- **Day (default):** paper `#ECE8DF` background, surfaces `#E3DED3`/`#D9D3C6`, ink `#121110` with alpha steps, signal orange `#FF5B1F` accent, graphite device shell with a dark screen.
- **Night:** the current warm charcoal tokens (`#0B0A08`…), with accent shifted to the same signal orange for one identity (gold retired). The device shell turns warm aluminium.
- The switch is a **physical toggle on the device** (plus a small one in the Nav). Tokens live under `:root[data-theme="light"|"dark"]` in `globals.css`. Choice is persisted in `localStorage` with try/catch, and an inline script in `layout.tsx` `<head>` sets `data-theme` before paint (no flash). The theme change animates as a View Transition circle wipe from the switch where supported, otherwise a crossfade.
- The grain and grid backdrops in `body::before/::after` read token colours. Site components are already almost all token-driven; the few hardcoded colours in `Nav.tsx`, `Services.tsx`, `Voices.tsx`, `MobileCtaBar.tsx`, `InquiryForm.tsx` and `CaseStudy.tsx` get tokenised. `BrowserMockup` chrome and `src/components/previews/*` keep their own colours (they're artifacts).

Type: keep **Archivo** (display, sentence case now, not shouting caps), **Instrument Serif** italic (one accent per heading), **JetBrains Mono** (labels and the device). Inter only for body text. Kill the outline text and the marquee. Grain stays. The accent stays under 10% of any viewport.

## Motion
- Load: mask-rise headline (reuse the `HeroLine` pattern from `src/components/site/Hero.tsx`), the device rises with rotateX 12° → 0, then boots.
- Scroll: one sticky device (no other hijack). Dial rotation, progress ticks and slight device scale come from `useScroll`/`useTransform`. Chapter titles use clip reveal and metrics count up. Each chapter's entrance differs from the last (no uniform fade-up).
- Micro: key presses, receipt print, drum physics, ball arc (quadratic path), bars and number tweening (`animate()` as in `FinanceMode.tsx`).
- `useReducedMotion` everywhere: no tilt, spins or arcs, instant mode swaps, opacity only.
- Framer Motion + Lenis only (no GSAP or three.js), per REDESIGN-SPEC.

## Files
New, in `src/components/fieldkit/`:
- `events.ts` (done), `chapters.ts` (chapter data: mode, copy, metrics, project ids resolved through `findProject` in `src/lib/projects.ts`)
- `Device.tsx`, `Dial.tsx`, `Receipt.tsx`, `EventLog.tsx`
- `modes/CounterMode.tsx` (done, add voice handoff), `LaundryMode.tsx` (done, add drag-in, remove the stray `layoutId`), `AtelierMode.tsx`, `AnalystMode.tsx` (+ `FinanceMode.tsx` as the Compare tab), `LedgerMode.tsx`, `CourtMode.tsx`, `ClassroomMode.tsx`, `BuildMode.tsx`
- `FieldKit.tsx` (hero + sticky scrollytelling), `BuildDesk.tsx`
- `prints.tsx` (SVG print patterns + garment silhouettes + cloth filters), `ThemeSwitch.tsx` (device toggle + nav toggle, shared `useTheme` hook)
- `src/components/ui/CountUp.tsx`: extracted from `StatValue` in `src/components/site/FlagshipWork.tsx` and reused by both
- No new image assets. All toys are SVG/CSS.

Edits:
- `src/app/page.tsx`: swap `Hero` + `TickerBand` + `Range` for `FieldKit`; add `BuildDesk` before `Contact`
- `src/app/globals.css`: palette tokens, `.fk-range`, receipt perforation, device shadows
- `messages/en.json`: new `fieldkit` namespace + FDE hero copy. `fr.json`/`ar.json` get the same keys in English as placeholders (translation is a follow-up), so next-intl never shows raw keys
- `src/components/site/Nav.tsx`: links become Deployments / Work / Build / Contact
- `src/app/layout.tsx`: title/description reframed to forward deployed engineer
- Reused unchanged: `MagneticButton`, `Reveal`, `ScrollProgress`, `SmoothScroll`, `EASE_OUT`/`EASE_IN_OUT` in `src/lib/motion.ts`, `/api/inquiry` + the WhatsApp fallback logic in `InquiryForm.tsx`

Copy rules: no em-dashes, "Al Boyut" without a hyphen, no Mirepa mention, and Al Boyut laundry framed as An-Nur.

## Build order (one pass before review; each step smoke-checked with build + screenshots)
1. Theme tokens (day/night) + no-flash script + ThemeSwitch; tokenise the stray hardcoded colours
2. Device shell + dial + receipt + event log + FieldKit sticky layout, with Counter and Laundry wired
3. Analyst (+ Compare), Ledger, Court
4. Atelier (procedural prints) + Classroom
5. Build desk (Hire/Build) + session summary on the ticket + inquiry wiring
6. Page integration, nav/metadata, mobile pass, reduced-motion pass, both themes screenshotted

## Verification
- Dev server with Node 22 in the background: `export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"; npm run dev -- -p 3001` (preview_start uses the broken Node 18, and the Browser pane throttles rAF).
- Puppeteer-core with system Chrome (scratchpad `xscrape/`): screenshots at 1440×900 and 390×844 for each chapter's scroll position, **in both day and night**; theme persists across reload with no flash; scripted interactions (ring up and charge → receipt visible; laundry cycle reaches Ready; shock buttons change NPV; shots update FG%; build ticket prints and the POST to `/api/inquiry` fires); `emulateMediaFeatures` reduced-motion pass; console has no errors; no horizontal overflow at 390px.
- `npm run lint` and `npm run build` pass.
## Review gate (main stays untouched)
- All work lives on the local branch `prototype/field-kit-hero`. **Nothing is committed to, merged into or pushed to `main`**, and nothing is deployed to production (aadambuilds.dev keeps serving the current site).
- On the branch, the current homepage stays reachable at **`/classic`** (a thin route rendering the old `Hero` + `TickerBand` + `Range` stack), so you can compare old and new side by side on the same dev server.
- You review it on localhost (I'll send desktop + mobile screenshots of both themes too). If you want a shareable link, I'll ask first before pushing the branch for a Vercel **preview** deployment (preview only, never promoted).
- Only after your sign-off: merge to main (or rework, or discard the branch).

## Cloud execution notes (added when moving this build to a cloud session)
- Status at hand-off: step 1 (theme tokens) not started. Done so far: `src/components/fieldkit/events.ts`, `modes/CounterMode.tsx`, `modes/LaundryMode.tsx`, `modes/FinanceMode.tsx` (first drafts; LaundryMode has a stray `layoutId={undefined}` to remove).
- Light-theme approach decided: Tailwind v4 utilities resolve `text-white` / `bg-white text-black` through `var(--color-white)` / `var(--color-black)`. Map those to theme ink/paper per `data-theme` (dozens of `text-white` usages in `src/components/site/*`, `CaseStudy.tsx`, `ProjectCard.tsx`, `MagneticButton.tsx` then flip correctly), and add a `.theme-fixed` class that restores real `#fff`/`#000` on artifacts: `BrowserMockup` root, `PreviewRouter` output, `ProjectCard` image overlays, the `WorkIndex` hover preview, `WalkthroughPlayer`, the `CaseStudy` phone frame, and the Field Kit device screen. Also tokenise `Nav.tsx` backgrounds (`rgba(8,8,12,…)`), `ScrollProgress` gold gradient, `.text-gradient`, and the `body::after` grid line colour.
- Environment: Next 16 needs Node >= 20.9. Install with `PUPPETEER_SKIP_DOWNLOAD=1 HUSKY=0 npm ci` (or allow the download in the cloud and use full `puppeteer` for screenshots). The local-only paths in Verification (nvm path, scratchpad `xscrape/`, system Chrome) don't apply in the cloud: use whatever headless Chrome is available there.
- Never commit to, merge into or push `main`. Work and push only `prototype/field-kit-hero`. A Vercel preview build of the branch is fine; never promote to production.

## Research references (what informed the concept)
- Zara Zhang "Your personal website is the new resume" (x.com/zarazhangrui/status/2113148949842534482) quotes: frvky.online (phone lock-screen OS, 6.4M views), oyin.design (type specimen + theatre "acts", 4.8M), uibeawuchi.com (3D laptop you plug in, PowerShell easter egg, rollout framing, one metric per project), etornamahiator.com (cinematographer viewfinder, Accra), annacheng8.vercel.app (skydive altimeter scroll).
- Benji Taylor "A personal website should feel like you've briefly left the rest of the internet" (x.com/benjitaylor/status/2096656821591413161): jrands.com (full-bleed personal media, glass dock nav, "Currently at" pill, mono location + clock footer), oscardumlao.com (ambient 3D scene, change scene, play music), ped.ro (blurred-text intro with highlighted pill words).
- Shared traits: one ownable concept from your craft, interaction above the fold, work told through the metaphor, one metric per project, restraint elsewhere, live/hidden details.
