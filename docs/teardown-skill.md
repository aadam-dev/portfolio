# Teardown

Agents follow this file when building an interactive 3D machine for one of our projects. The skill text in [Upstream skill](#upstream-skill) is the MIT original from [elvarofficial/teardown](https://github.com/elvarofficial/teardown), copied so a job can run without re-fetching it. [House rules](#house-rules) say where we use it and which numbers are allowed to drive a gauge.

Source article: [How I Turn Any Machine Into a 3D Simulator You Can Take Apart](https://x.com/elvar_official/status/2116174609355571402). Licence of the skill: MIT. The kit, capture, and sound engine come from [whaleyxbt/claude-motion](https://github.com/whaleyxbt/claude-motion) (MIT).

## Install

```bash
npx skills add elvarofficial/teardown -g -a claude-code
cd ~/.claude/skills/teardown && npm install && npx playwright install chromium
```

Needs Node 20+, `ffmpeg` on PATH for video, and Python 3 for the score. Claude Code installs both if asked. Set `FFMPEG`, `PYTHON`, or `CHROMIUM` when the binaries are not on PATH.

Open Claude Code in the project that will own the simulator and type `/teardown`. Then run the prompts below in order. Swap every `[bracket]`. Do not skip the reference, the hand check, or the stills.

`SKILL_DIR` is the installed folder. Builds land in `./teardown-out` of the folder you run from.

## House rules

Use the skill when the subject is a physical mechanism with one moving input, real units, and a picture or drawing of the real thing. The page is one offline HTML file. Every gauge reads the same function that poses the parts.

Approved work:

- **Pronaj.** Follow `../pronaj/docs/teardown-plan.md` (container shell, then the cocopeat press). The greenhouse stays blocked until a section drawing is in that repo.
- **Rockmotion export, when that job is started.** The machine is the shipment, not the car's engine. One input is progress along the job. RoRo is the default (driven onto the deck and secured). A 20 ft or 40 ft container is the cutaway, with the extra five days of loading from `rockmotion/src/app/shipping/page.tsx`. Destination changes the length of the same function. Transit ranges on that page are the only day counts. Gauges: phase, day, port pair, marine cover on or off. Reference before building: a RoRo deck or a container-stuffing drawing, plus that shipping page. The full page is its own route. A chapter elsewhere may show the live day, port, and cover, and must not keep the WebGL scene mounted while the rest of a long page scrolls.

Do not build a simulator for software: tills, ERPs, courses, ledgers, pharmacies, gym desks, fashion shops, rentals, hajj, susu. There is no single mechanism.

Do not build a Madina solar plant. The January 2026 lighting install was removed; evening play is on the grid; the next spec is not public. The playable court is a 2D shot model in `madinabasketball/components/play/`, not this skill.

Do not rebuild Ironveil or Zamani with this skill. They are already their own WebGL worlds.

Do not invent a machine from a sentence. A missing reference stops the job. Say which number is measured and which is a label. Brochure prices, "sustainability %", and crop-yield claims stay off the gauges.

A simulator is not the first paint of a marketing site. Ship it as its own route or as a file under 1 MB next to the page. Warm shaders before the first frame. Keep the integrated-GPU quality tiers. `prefers-reduced-motion`: show frame 0 and do not run the auto tour.

## Upstream skill

The rest of this section is the upstream `SKILL.md`, unchanged in substance.

---

name: teardown
description: Build an interactive 3D simulator of a real machine or mechanism (an engine, a landing gear, a walking linkage, a pump, a gearbox) as one offline HTML page people can take apart, with live panels driven by the same model that moves the parts, a button for every subsystem, cutaways, camera views and an auto tour that hands control to the visitor; then record it frame by frame to a 60 fps video with a synced procedural score. Use when someone asks how a machine works, wants a "visual explainer", a "simulator", a "cutaway", an "exploded view" or an "interactive 3D lesson", or wants a 3D object shown working rather than described.

# Teardown

One machine, one page. The visitor sees the thing run, presses a button, and the part doing the work opens up while the gauges around it read the real numbers. Left alone, the page tours itself with a cursor. The same code records a film of the tour, frame by frame, with a score built on the same timeline.

`SKILL_DIR` below is the folder this file lives in. Builds and renders go to `./teardown-out` of the folder you run from.

### First run

```bash
cd "$SKILL_DIR" && npm install && npx playwright install chromium
```

The pages need nothing else. The video needs `ffmpeg` on PATH and the score needs Python 3 (standard library only). Set `FFMPEG`, `PYTHON` or `CHROMIUM` to point at other binaries.

### The 3 examples

Build one, open the HTML, press buttons. Copy the closest one when you start a new machine.

| | The machine | What drives it | Worth stealing |
|---|---|---|---|
| `v8-*` | A cross-plane V8 with glass liners: the charge burns inside the cylinder you track, valves lift on their cams, 8 pistons move from the exact slider-crank. | Crank angle. Firing order 1-8-4-3-6-5-7-2, a chamber pressure model for the indicator diagram. | Cutaway modes (glass, section, solid), the firing order as a cylinder picker, live charts synced to the crank. |
| `cessna-*` | The Cessna 337 main landing gear folding into the airframe on takeoff and dropping on landing. | Stroke 0..1: a 201 mm rack turns a 32-tooth pinion (module 4 mm) through exactly 180°. | One degree of freedom posing a whole mechanism, flight phases as functions of time, a runway that rolls under the model. |
| `strandbeest-*` | Theo Jansen's Strandbeest, 20 legs on one crankshaft, walking broadside over sand. | Wind. The crank speed is integrated from it; every joint follows by circle intersection from Jansen's 11 link lengths. | An exact linkage solver in 67 lines, instanced tubes, foot traces, a contact chart of all 20 feet. |

Each comes in 3 folders: `*-shared/` holds the machine, `*-film/` the recorded tour, `*-live/` the page you drive.

```bash
node "$SKILL_DIR/sims/build.mjs" v8-live          # → teardown-out/dist/v8-live.html, offline, ~800 KB
node "$SKILL_DIR/sims/build.mjs"                  # all 6
```

### How a machine is built

One folder per machine, split by job. The examples follow this exactly:

| File | Job |
|---|---|
| `kin.js` / `gear.js` / `jansen.js` | The math. Real dimensions in real units, one input (crank angle, stroke, wind) and every pose and readout as a function of it. No three.js in here. |
| `engine.js` / `gear.js` / `beast.js` | The geometry, built from code: lathed parts, tubes, instanced links. `update(input)` poses it. |
| `stage.js` | Studio, lights, shadows, post (GTAO, bloom). `frame(state, cam)` draws one frame. |
| `console.js` | The overlay: fixed 1600×900 CSS layout of panels, charts, toggles, callouts with leaders. `update(state)` redraws it from the frame's state. |
| `film.js` | A `SCRIPT` of operator moves (views, isolate, cutaway, throttle) and `render(t)` as a pure function of time. |
| `live.js` | The same machine in real time: buttons, sliders, orbit, zoom, keys. With no input it plays `film.js`'s script as an auto tour with a cursor; any click, drag, wheel or key hands control over, 25 s of quiet hands it back. |
| `score.py` | The sound on the film's timeline. |

For a machine outside `SKILL_DIR`, make a folder with a `main.js` and import the kit by name: `import {runSim} from 'teardown-kit/runtime.js'`. Build it with `node "$SKILL_DIR/sims/build.mjs" ./my-machine`.

### Rules that decide whether it works

1. **Start from a reference, never from imagination.** A photo, a cutaway drawing from a manual, a clip of the real thing. Build against it and compare frame by frame. Machines invented from a sentence come out generic every time; the same model rebuilds a real one closely when it has something to match.
2. **Real numbers, one source.** Get the real dimensions first (bore, stroke, tooth count, link lengths). Every gauge, chart and label reads from the same function that poses the parts, so nothing on screen can disagree with the motion. Check one by hand: in the Cessna, 32 teeth × 4 mm module is a 128 mm pitch diameter, and half its circumference is the 201 mm stroke.
3. **One input drives everything.** Pose from the crank angle, the stroke or the wind. Nothing is keyframed by hand, so the film, the live page and the score never drift.
4. **The part doing the work opens up.** Isolate it, cut it, x-ray it. A camera that goes inside is worth more than ten orbits.
5. **Light studio, one accent.** Pale backgrounds read in a feed; dark ones lose the first second. The accent marks the thing that is changing. Watch near-white parts on a pale backdrop: give them an ink outline or a darker ground.
6. **Pick the camera for the mechanism.** A planar linkage seen face-on collapses into a lattice; a 3/4 view along the spine keeps every leg readable.
7. **Fix collisions with a number.** When a part pokes through another, scale or move it in the parameter block. Never hide it with the camera.

### Live page rules

- **Test on an integrated GPU.** A page that runs at 60 fps on a desktop card can drop to 15 fps on a laptop's built-in one. The examples carry quality tiers (`TIERS` in `live.js`): no AO, lower pixel ratio, smaller shadow maps, panels redrawn every other frame. Find the expensive shader first: a displacement computed 5 times per vertex costs more than every tier together.
- **Warm the shaders.** `kit/warm.js` compiles every program in parallel before the first frame, so the page never freezes on first draw.
- **Keep the page under 1 MB.** Link crawlers (X, Slack) read the share card from the HTML and give up on a 15 MB page. Big models go out as files next to the page: `build.json` → `{"external": {"heavy.glb": "light.glb"}}`.

### render(t) contract

```js
import {runSim} from '../kit/runtime.js';

const DEFAULTS = {duration: 20, fps: 60, hud: {enabled: false}, director: {enabled: false}};

runSim(DEFAULTS, async ({cfg, canvas, capture}) => {
  // build the scene, precompute anything stateful
  return {render(t) { /* draw frame t from scratch */ return {}; }, resize() {}};
});
```

- `render(t)` is pure: no `Math.random` (use `rng(seed)` from `kit/util.js` at setup), no `Date`, no state carried between frames. Capture calls it at arbitrary times.
- Anything that moves by its own rules (agents, particles) is simulated once at load into typed arrays; `render` only reads them. A quantity integrated over time (the Strandbeest's crank under a changing wind) is integrated in closed form or tabulated at load.
- Every beat goes into `*-film/timeline.json` in seconds. The score reads the same file.
- Frame 0 is the thumbnail. It must already show the machine.

### Commands

```bash
node "$SKILL_DIR/sims/build.mjs" v8-film
node "$SKILL_DIR/sims/capture.mjs" v8-film --size 1600x900 --dpr 1.2 --stills beats --cols 4 --out teardown-out/v8-beats.png
node "$SKILL_DIR/sims/capture.mjs" v8-film --size 1600x900 --dpr 1.2 --still 12.5 --out teardown-out/v8-12.5.png
node "$SKILL_DIR/sims/capture.mjs" v8-film --size 1600x900 --dpr 1.2 --out teardown-out/v8-silent.mp4
python "$SKILL_DIR/run_sfx.py" "$SKILL_DIR/sims/v8-shared/score.py"
ffmpeg -y -i teardown-out/v8-silent.mp4 -i teardown-out/v8-score.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart teardown-out/v8.mp4
node "$SKILL_DIR/wave.mjs" teardown-out/v8.mp4 --timeline "$SKILL_DIR/sims/v8-film/timeline.json"
```

`--size` is the CSS layout and `--dpr` multiplies it: 1600×900 at 1.2 gives 1920×1080. Capture prints the GPU it got; a software renderer means the GPU flags in `paths.mjs` did not take.

### Review loop

You cannot watch the video; you can look at frames. Never report a machine as done without reading sheets of the current render.

1. `--stills beats`: one tile per timeline beat, 0.3 s after it, each labelled `t=`.
2. Read every tile against the checklist below.
3. Zoom in: `--stills every:0.2 --from A --to B` for a transition, `--still T` for one full frame.
4. Fix, rebuild, go back to 1. Stop when a full pass finds nothing.
5. Final: `node "$SKILL_DIR/sheet.mjs" --video <final.mp4> --timeline <timeline.json>` and read that too: it shows what the encoder wrote.

Checklist:

- **The mechanism.** Every part that should touch touches; nothing passes through anything; the numbers on the panels match the pose.
- **Composition.** One focal point per frame. Nothing important within 60 px of an edge. Labels never cover the part they name.
- **Type.** Nothing clipped. The key readout reads at phone width.
- **3D.** Bloom eats detail: keep emissive layers under 1.0. Near-white surfaces blow out. Glossy metal under a low light streaks: roughness ≥ 0.45 and envMapIntensity ≈ 0.5 on big surfaces.
- **Timing.** Each state holds long enough to read: 1 s for a short phrase plus 0.25 s per word beyond three.

### three.js traps the examples already hit

- `smoothstep(a, b, x)` with `a > b` returns 0 on Windows (ANGLE/D3D). Write `1.0 - smoothstep(b, a, x)`.
- A `ShadowMaterial` or a decal a fraction of a millimetre above the floor loses the depth test inside a post-processing render target. Give it `polygonOffset`.
- A quad laid into the ground with a mirrored mapping gets culled as a back face. Use `DoubleSide`.
- One NaN pixel blacks out the whole frame through bloom. Clamp every `pow()` base in a shader.
- GTAO on a clipped (cutaway) model needs the same clipping planes on `gtao.normalMaterial`, or the cut half returns as a pale ghost.

### Sound

`sfx/` synthesises every sound in pure Python (48 kHz, reproducible) and reads the film's timeline, so sound cannot drift out of sync. `python "$SKILL_DIR/run_sfx.py" --list` shows the generators. `sample()` adds the recorded CC0 sounds in `sfx/samples/`. `sfx/score_kit.py` has the beds and accents the 3 scores use: a chord bed, a soft thud per power stroke, a motor, air under a drag.

- Every time comes from the timeline, never a typed number.
- Mastering is automatic: −14 LUFS, true peak ≤ −2 dBFS.
- Accent, never narrate: continuous motion stays silent. One key for every tonal sound.

### Taste, with numbers

- Easing: entrances `cubic-bezier(0.16, 1, 0.3, 1)`, exits `cubic-bezier(0.6, 0, 0.9, 0.35)` at half the entrance's length, state to state `cubic-bezier(0.65, 0, 0.35, 1)`. Linear only for continuous motion.
- The machine fills 60–70% of its viewport. Labels never under 34 px on a 1080 canvas.
- One accent, and it means something: the part that is working right now.
- Nothing dead-still: one element always alive.

### Credits

The kit, frame capture, sfx engine and review rules come from [whaleyxbt/claude-motion](https://github.com/whaleyxbt/claude-motion) (MIT). The recorded samples are CC0 from Freesound, trimmed by [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics) (MIT); sources in `sfx/samples/SOURCES.md`.

## Prompts

Paste these in order after `/teardown`. They are the article's prompts. Keep the brackets until you have replaced them with this machine's parts and numbers.

### 1. Build the machine

```
/teardown Build [the Cessna 337 main landing gear] as an interactive 3D simulator. Reference attached: [a cutaway drawing of the gear].

Build it from code in real units: [the main plate, the hydraulic actuator, the rack, the pinion on its output shaft, the universal joints, the side tubes, the spring legs and the wheels].

Before you draw anything, write the model as pure functions of one input: [stroke from 0 to 1]. Use the real numbers: [the rack travels 201 mm, the pinion has 32 teeth at module 4 mm, so the legs turn exactly 180°]. Check them by hand and show me the check. If you are not sure a number is real, say so and tell me where it comes from.

Every part, every panel and every label reads from that one model. Nothing is animated by hand.
```

Why this holds: the model comes first, so the gear, the gauges, and the timeline cannot drift. One input posing the whole mechanism is a mechanism. Parts animated one by one are separate animations.

Worked check from the article, for the gear prompt: 32 teeth at a 4 mm module is a 128 mm pitch diameter. Half the circumference is π × 128 / 2 = 201 mm, which is the rack travel, which is 180° of the pinion.

### 2. Build the console

```
Lay out a console around the machine at 1600×900:
- the title and the main live number top left, big: [engine speed in rpm]
- live charts that move with the machine: [valve lift over 720° of crank, the pressure-volume loop of the tracked cylinder]
- a schematic panel that redraws the mechanism in 2D from the same model
- one button per subsystem: isolate it, cut it, show it alone
- camera views as buttons: [hero, front, side, top, inside the valley]
- callouts with thin leader lines into the parts they name
Every panel redraws from the frame's state. No number on screen is typed in.
```

### 3. Give it the look

```
Style: a clean study model on a pale studio.
- light background, soft shadows on an invisible floor, one accent colour for the part that is working right now
- the machine fills 60 to 70% of its view
- dark parts glossy, liners glass, metal roughness at least 0.45 so it never streaks white
- if a part is near-white, give it a thin ink outline or a darker ground
- pick the camera for the mechanism: if it collapses into a lattice face-on, use a 3/4 view
```

### 4. Check it like a critic

```
Before you show me anything:
1. Render a still at every beat of the tour and read each one: a part passing through another, a part floating off its mount, a label covering what it names, a number that disagrees with the pose.
2. Scrub every transition at 0.2 s steps and look for a jump.
3. Fix collisions with a number in the parameter block. Never hide them with the camera.
Tell me what you checked and what you fixed. Show me the stills.
```

### 5. Make it a page you drive

```
Make the simulator a page people drive:
- the tour from the film plays by itself, with a cursor that walks to each button and presses it
- any click, drag, scroll or key hands control to the visitor; 25 seconds of quiet hands it back
- drag to orbit, scroll to zoom, a key to hide the panels
- warm every shader before the first frame so the page never freezes
- test it on an integrated GPU and add quality steps: no ambient occlusion, a lower pixel ratio, smaller shadows, panels redrawn every other frame
```

### 6. Turn it into a video

Record:

```
Record the tour: render(t) has to be a pure function of time, so draw every frame at 60 fps at 1920×1080 in headless Chrome and pipe it into ffmpeg as H.264, yuv420p, faststart. Then show me a contact sheet of every beat.
```

Score:

```
Score it in code on the same timeline: [Am9 chords at 92 bpm, a soft thump on every power stroke so the beat tightens when the throttle opens, a quiet click on every button press, rising air under the throttle drag]. Master to -14 LUFS with the true peak under -1 dB and mux it into the video.
```

A screen recording drops frames when the GPU works. A tour that seeks to each frame does not. Sound times come from `timeline.json`.

### 7. Put it online

```
Publish the simulator as a page:
- keep the HTML under 1 MB; move any large model out as a file next to the page
- a 1200×630 preview card from the best frame, with absolute image URLs
- deploy it to Vercel
```

### 8. Let them break it

```
Add one slider for [the wind, 0 to 15 m/s] and run the model live when it moves: [a light breeze barely turns the crank, a gale makes the legs blur]. Show it on the same panels.
```

Whoever can push the machine past its limit learns what every number does. The slider is still the one input, or a parameter of that input. It does not add a second hand-animated motion.

## Done when

- The hand check is written next to the model, with units.
- A still exists for every beat, and a full pass found no part through another part, no floating mount, no label on the part it names, and no gauge that disagrees with the pose.
- The live page hands control over on first input and takes the tour back after 25 s of quiet.
- The HTML is under 1 MB, shaders are warmed, and a laptop GPU has a quality tier that holds frame rate.
- Frame 0 shows the machine, and it is the share image.
- Reduced motion shows that frame and does not autoplay the tour.
