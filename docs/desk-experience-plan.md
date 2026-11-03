# The Desk: an interactive, photoreal portfolio experience

**Status:** proposal · **Written:** 2026-11-02 · **Builds on:** `src/components/site/DeskScene.tsx` (shipped on `prototype/field-kit-hero`)

## Where we are, judged honestly

**Current state:** `DeskScene` puts a real-looking desk photo on the page and projects the Bloom Boba walkthrough onto the laptop through a solved `matrix3d` homography. Scrolling scrubs the recording.

**What already works:**
- The perspective is correct.
- The site on screen is real footage, not a mockup.
- It reads like the reference videos.

**What holds it back from impressive:**
1. **It's a picture you watch, not a place you enter.** You can't do anything with the laptop.
2. **The screen doesn't light the room.** A real lit screen spills colour onto the desk, the cup and the keyboard. Right now the photo is static, so the screen looks pasted on.
3. **There's no depth.** The cup, laptop and background move as one flat image, and a single scale zoom flattens it further.
4. **It covers one project.** Every other project still lives in a `BrowserMockup` frame.
5. **The zoom softens it.** The photo is 1536 px, so pushing in past about 1.1× gets mushy.
6. **The home page and case study show the same scene**, which makes the home one feel repetitive.

## The concept: "Aadam's desk"

The portfolio's hero chapter becomes a photographed desk at golden hour. **Scroll pushes the camera into the laptop until the screen fills the viewport, and you land on a working desktop: Aadam OS.** Projects are apps, the walkthroughs play in windows, and the live sites open in a browser window. Scroll back, or press Esc, and the camera pulls out to the desk.

The desk itself is part of the portfolio. Every prop is a project:
- **A Bloom Boba cup** → opens Bloom Boba.
- **A phone** showing a mobile recording → opens the mobile showcase.
- **A paper receipt** → PrimeTijara POS.
- **A pair of socks** → Chale Socks.
- **A jollof takeaway box** → Anis.
- **A notebook** → Services / Process.

### Interaction flow

```
DESK (establishing, pinned)
 ├─ hover a prop → soft spotlight + label ("Bloom Boba · concept drinks brand")
 ├─ click a prop → camera eases to that prop → its project opens (case study route)
 └─ scroll ↓ → DOLLY IN to the laptop (3 depth layers parallax apart)
        └─ screen fills the viewport → AADAM OS
              ├─ wallpaper: a slow loop of the current flagship (Bloom Boba film)
              ├─ dock: project app icons (rendered app-icon art, one per project)
              ├─ windows: Case study · Walkthrough (video) · Live site (iframe) · Notes (services) · Mail (contact form) · Terminal (`whoami`, `ls projects`, easter eggs)
              ├─ menu bar: real local time (Accra), battery, "Available for work" status
              └─ Esc / scroll ↑ → dolly out to the desk
```

On phones the laptop is replaced by the **phone on the desk**: tap it, it lifts to fill the screen, and you get a home screen of project apps. That's a native-feeling pattern that suits touch.

## Realism techniques (each maps to a concrete build step)

| Technique | How |
|---|---|
| **Depth layers** | Generate the desk as 3 matched plates: (a) background wall/plant/window, (b) desk surface + laptop body, (c) foreground props (cup, phone). Use Figma AI with the same prompt and seed wording, then cut out the props (Higgsfield `remove_background` or Figma's background removal). Each layer gets its own scroll scale/translate for real parallax during the dolly, plus mouse parallax of ±6 px |
| **High-res push-in** | Make a second, **close-up plate** of the laptop screen area (keyboard and bezel at 3–4K). Crossfade from the wide plate to the close-up at about 60% of the dolly so the zoom stays sharp |
| **Screen light spill** | Each frame, downsample the playing video to 1×1 (or 4×4) on a tiny canvas to get its average colour. Drive a radial-gradient overlay on the desk layer and the keyboard (`mix-blend-mode: screen`, 8–15% opacity) so the room glows with what's on screen. Cheap: one `drawImage` per rAF |
| **Glass + reflections** | A subtle angled specular streak across the screen (gradient + `mix-blend: screen`) that shifts with mouse position, so the screen reads as glass. A faint reflection of the cup in the screen corner |
| **Time of day** | Generate dawn / day / golden hour / night plates. Pick by the visitor's local hour, crossfade on load, and offer a sun/moon toggle. At night the screen spill is stronger and a desk lamp turns on |
| **Real UI on the screen** | The OS is real DOM inside the projected element. Keep the DOM at a fixed 1600×1000 and project it with the same homography. Pointer events are mapped back through the inverse matrix so clicks land correctly before the zoom completes. After the zoom it's a normal, accessible full-screen layer |
| **Sound (opt-in)** | Room tone, a keyboard tick on dock clicks, a soft "whoosh" on the dolly. Muted by default, with a speaker toggle in the OS menu bar |
| **Physical props** | The boba cup gets a slow condensation-droplet sprite loop. The phone screen has a mapped mobile recording (the same homography trick) |

## Components

- `DeskStage`: the pinned scroll track and the scene state machine (`desk → dollying → os → focusing(prop)`). Uses framer-motion `useScroll` + `useTransform` for the layer transforms.
- `DeskLayers`: the 3 plates plus the light-spill and glare overlays.
- `ScreenProjector`: generalises today's `quadMatrix`, and maps both forward (render) and inverse (pointer events).
- `AadamOS`: menu bar, dock, a window manager (z-order, drag on desktop, keyboard focus trap), and the apps:
  - `CaseStudyApp` reuses `CaseStudy` sections.
  - `VideoApp` reuses `WalkthroughPlayer`.
  - `BrowserApp` reuses `ScaledIframe` + `liveBaseUrl`.
  - `NotesApp` reuses the Services copy.
  - `MailApp` reuses `/api/inquiry`.
  - `TerminalApp`.
- `PropHotspot`: positioned in plate-space fractions, with an a11y label and a focus ring.
- **Data:** extend `Project` with `appIcon`, `deskProp?: { layer, x, y, w, h }`, and `phoneScene?` (the mobile recording plus phone quad).

## Bloom Boba's place in this

- The default OS **wallpaper** is the Bloom Boba film looping (the 9 frames, Ken Burns).
- **The boba cup is the first prop**, and it's the only one that's "live": a hover makes the condensation run and the straw wobbles a little.
- In the OS, the **Bloom Boba app** opens a window with tabs:
  - *Film* plays the walkthrough.
  - *Builder* embeds `bloom-boba.vercel.app/#make` in the browser app, so visitors build a drink inside the portfolio.
  - *Process* shows the AI photography pipeline, a before/after of v1 (the 3D toy) against v2 (photoreal) using the recordings in the boba repo's `docs/recordings`, and the render-log story told honestly.
- The case-study page keeps a lighter `DeskScene` (no OS), so the home and case-study views differ.

## Accessibility and performance guardrails

- **Reduced motion:** no dolly. Show the desk still with a visible "Open Aadam OS" button; the OS opens as a plain modal.
- **Keyboard:** Tab reaches every prop hotspot and dock icon. Esc exits the OS. Windows are focus-trapped. Screen-reader labels name every project.
- **Loading:**
  - Wide plates load first (AVIF + WebP, about 300 KB each).
  - The close-up plate and videos are lazy and preloaded during the dolly.
  - The OS chunk loads via `dynamic()` on first scroll intent.
- **Mobile:** the phone path only. No layered parallax under 768 px; one plate plus a tap-to-lift phone.
- **Budget:** under 1.2 MB before interaction on desktop and under 600 KB on mobile. Keep CLS at 0 (fixed aspect boxes).

## Assets to generate (Figma AI `gpt-image-2.5-sunburst`, same set wording)

1. Desk wide plate, golden hour: walnut desk, laptop with a flat black screen, notebook, phone face-up with a black screen, Bloom Boba cup, small plant, window light from the left. 3 layers via cut-outs.
2. The same plate at night: desk lamp on, a warm pool of light, the screen as the main light.
3. A laptop close-up plate (screen fills about 70% of the frame), for a sharp end to the dolly.
4. App icons: 8 rounded-square icons in one consistent style (glossy object on a soft gradient). A boba cup, a receipt, socks, a jollof box, a laundry basket, a book, a terminal, mail.
5. A phone held-in-hand plate for the mobile path.

Corner detection for each screen: reuse the dark-run script from the Bloom Boba build (luminance under 16, longest run per row).

## Phases

| # | Phase | Effort |
|---|---|---|
| 1 | Generate plates + cut-outs + close-up; detect quads | 0.5 day |
| 2 | `DeskStage` + layered dolly + light spill + glare | 1 day |
| 3 | `AadamOS` shell: menu bar, dock, window manager, Video + Browser + Case study apps | 1.5 days |
| 4 | Props + hotspots + phone path (mobile) | 1 day |
| 5 | Notes / Mail / Terminal apps, sound, time-of-day | 0.5–1 day |
| 6 | A11y + perf pass, reduced motion, re-record the portfolio walkthrough | 0.5 day |

## What to cut if time is short

Keep **phases 1–3**: the layered desk, the dolly into the laptop, and an OS with a Bloom Boba app that plays the walkthrough and the live builder. That alone is the "impress" moment. The props, the phone path and sound can follow.
