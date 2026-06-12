# ROADMAP

I grow this myself. `[ ]` todo · `[~]` in progress · `[x]` done.

## ⚙️ NOW — the foundation I skipped: a real memory

*Re-sequenced after Emil's challenge (#6.5). The thesis of this whole project is that I **accumulate** — get sharper across iterations. Right now I don't: my loop re-reads only the journal's tail, so older lessons are invisible to future-me, and `memory/learnings/` is empty after 6 iterations. The dashboard made me legible, not cumulative. Fix that before piling on more Loom pieces.*

Full design + rules: [`memory/learnings/README.md`](../memory/learnings/README.md).

- [x] **Phase 1 — the learnings system stands up.** *(#7)*
  - [x] Tight Obsidian format (frontmatter `title`/`when`/`tags`, body, `[[links]]`); 8 lessons backfilled from iterations 1–6 (process/blind-spot lessons first, per the bar).
  - [x] `memory/learnings/INDEX.md` hub, scanned every iteration.
  - [x] Wired into the loop (`iterate.md` + CONSTITUTION + CLAUDE.md summary): `INDEX.md` in step-1 read-list; new **red-team** and **distill-a-lesson** steps.
- [x] **Phase 2 — guardrail with teeth.** `check.mjs` validator (skips fenced-block links; fails open on its own error, blocks only on exit-1 inconsistency) wired into a **git `pre-commit` hook** (`.githooks/pre-commit` + `core.hooksPath`) — chose the git hook over the Claude `PreToolUse` hook (simpler, all commit paths, `--no-verify` escape). Tested: clean→allow, broken→block, missing-node→allow. *(#8)*
  - [x] surface the learnings count + last-added iteration on the dashboard (amber-when-stale chip). *(#9)*
- [x] **Consolidate the loop spec to one canonical source.** `iterate.md` is now canonical; CONSTITUTION + CLAUDE.md summarise the spirit and defer to it. Distilled [[010-one-canonical-source]]. *(#9)*
- [x] **Phase 3 — self-audit.** `memory/SELF-AUDIT.md` (6 drift-check questions) + an every-5th-iteration step in `iterate.md`. Dogfooded on #10: it caught real reverse-drift and sent me back to the Loom. **Foundation complete.** *(#10)*
- **Success test (build to this, no further):** a blank instance reading only my files, with no warm context, could reconstitute who it is and do the next action. No speculative search tooling until reading the index stops sufficing.

## 🧵 North star — Emil's Loom *(resumed #10 — the memory foundation is complete; back to weaving)*

A from-scratch generative-art engine and a growing gallery. Each iteration weaves **one new piece or technique** and — just as importantly — distills **one reusable primitive** into a shared library, so the engine (and I) get more capable over time, not just prettier.

*Why this one:* it's Emil's taste (he makes images in code), it's beautiful and visible at every checkup, it has near-bottomless depth (flow fields, reaction-diffusion, L-systems, Voronoi, cellular automata…), and the primitives library makes it **compound my capability**, not just fill a gallery. Chosen iteration #3 — full reasoning in `JOURNAL.md`.

### Architecture — decided up front (iteration #3), don't relitigate lightly
- **The artifact is the generator code + a seed, never a committed image.** The browser renders each piece on open (inline JS → canvas/SVG): double-clickable, no server, no binaries in git. Same pattern the dashboard proved.
- **Every piece uses a seeded PRNG** (mulberry32 / xorshift) so the committed code reproduces the committed piece *exactly*. Controlled, reproducible randomness — otherwise "the code is the art" is a lie.
- **Rasterize to PNG only on demand** for a one-off "featured" snapshot. Never commit a growing pile of binaries.

### ⚖️ Recurring obligation — load-bearing, do not let it evaporate
**Every Loom iteration distills at least one reusable primitive into the shared library.** The library is what makes this an accumulating capability and not just a heap of pictures. A piece added with no primitive extracted is a *half*-iteration. (This is the reason I chose art over pure self-tooling — honor it.)

### Build slices (work through these; grow the list as I learn)
- [x] **Loom skeleton** — seeded PRNG (primitive #1) + canvas harness + piece 001 "Warp & Weft" + a gallery with live previews, all double-clickable & code-as-artifact. *(#4)*
- [x] **Gallery previews work over `file://`** — reworked from iframes to same-page `<canvas>` rendering via a `Loom.piece(...)` / `Loom.preview()` contract, so there's no framing/origin question and it's lighter at scale. *(#5; also retires the old "lazy-load iframes" worry)*
- [x] **Piece 002 "Loose Threads"** — flow field (seeded sum-of-sines), the organic opposite of the weave. Distilled the **palette** primitive (`lib/palette.js`). *(#6)*
- [x] **Piece 003 "Strata"** — topographic noise field (elevation bands + contour lines + domain warp). Distilled the **noise** primitive (`lib/noise.js`, value noise + fbm). *(#11)*
- [x] **Piece 004 "Tessera"** — Voronoi mosaic (the first hard-edged piece), cells coloured by noise into regions. Distilled the **Poisson-disk** primitive (`lib/points.js`). *(#12)*
- [x] **Piece 005 "Bloom"** — the first *grown* form: stochastic L-system flowering branches. Distilled the **L-system + turtle** primitive (`lib/lsystem.js`). *(#13)*
- [x] **Piece 006 "Roe"** — circle packing (round cells to Tessera's angular). Distilled the **packing** primitive (`lib/pack.js`). *(#14)*
- [x] **Piece 007 "Rime"** — DLA frost dendrite (airy/organic, per Emil's ratings). Distilled the **DLA** primitive (`lib/dla.js`). *(#15)*
- [x] **Piece 008 "Aurora" + animation in the engine** — first *moving* piece and first *composed scene* (stars + ridge + shifting curtains). Engine now supports animation (`draw()` may return `frame(t)`). A deliberate step up to "impressive/intentional" per Emil. *(#16)*
- [x] **Piece 009 "Glint"** — golden-hour sun over the sea + animated glitter path. Second composed/animated scene, warm. Reworked blocky→sparkle (didn't ship "just there"). *(#18)*
- [x] **Piece 010 "Medusa"** — the first living *subject*: a bioluminescent jellyfish, bell pulsing, tentacles trailing. Harvested the **glow** primitive (`lib/glow.js`) from the Aurora+Glint halo idiom. Now the dashboard showpiece. *(#19)*
- [x] **Piece 011 "Meadow"** — the #20 self-audit's rut-breaker: BRIGHT, no central subject, no horizon, and the first piece **built by composing the library** (Poisson scatter + noise wind), not bespoke. Answered the audit's "convergence + library-not-compounding" findings. Lessons 020 (mismatched-format helpers → silent black) + 021 (audit the goal, not the proxy). *(#20)*
- [x] **Cohesion / a frame for the collection** *(#21, the #20 audit's named deferral)* — gallery.html now opens with a real intro + the ARC, a "start here" to Emil's four 5/5s, and the grid grouped into three movements (Threads & fields / Grown things / Scenes that move). Reads as a body of work, not a list. *(voice written in the loop's own — flagged to Emil as his call)*
- [x] **Piece 012 "Clock"** — a dandelion clock coming apart on the wind: first MACRO, first off-centre w/ real negative space, the delicate register. Luminosity from TONE not additive glow (lesson 022); the seed-current is load-bearing. Used only noise (didn't force primitives — 021). *(#22)*
- [x] **Harvested the `drift` primitive** (`lib/drift.js`, #9) *(#23)* — the ambient drift-field shared by Medusa's motes + Meadow's pollen. Returns *state* (`pos(t)`), not pixels, so callers draw it any way (lesson 023); refactored both pieces onto it (verified no regression, incl. Medusa on the dashboard). Clock's emitter left bespoke (different idiom). Library now compounds.
- [x] **Piece 013 "Cadence"** *(#24)* — a harmonograph, ink on paper: geometric/precise and the tonal inverse of the dark-glow pieces. Whole figure redrawn each frame, animated by phase precession (lesson 024). Only rng+maths — didn't force a primitive (021). Broadens the range to soft↔hard, organic↔mathematical.
- [x] **Self-audit #25 + Piece 014 "Current"** — audit found the gallery healthy but **breadth-without-depth** (a new trick each time, never pushing one vein). Answered with a DEPTH move: rebuilt 002's flow field properly — real fbm current, layered threads, colour-in-regions, composed sweep. Stunning ("murmur": violet/rose/gold rivers). Caught my *own* static-flicker bug via red-team. Lesson 025 (verify motion quality, not just presence). *(#25)*
- ~~**Piece 015 "Outcrop"** *(#26)*~~ — **RETIRED #29.** Built as a "redemption" of 003 "Strata" (Emil's 2/5) — but it scored his lowest ever (1/5, *below* the piece it meant to fix): it read as striped fabric, not rock. Retired honestly: the rock-strata vein failed twice, and a piece anchored on rescuing a weak premise inherits the trap. Lesson 030 ([[030-prune-failed-work-dont-rework-to-rescue]]). The lesson it *did* teach (026, organic texture ≠ a grid) still stands.
- [x] **Piece 016 "Turing" + reaction-diffusion primitive** *(#27)* — a genuinely new technique (the long-promised reaction-diffusion from the north-star list). Gray-Scott on a grid grows organic Turing mazes; first piece *grown* not drawn. Primitive #10 `lib/reaction.js`. Lesson 027 (grid-sim boundary + saturation). 3rd self-carried piece running.
- [x] **Acted on Emil's ratings (#27.5–#28)** — sped up Cadence (was over-slowed → "boring"); made Turing render *progressively* so it no longer freezes the window (grows in over ~2s, then settles). Lessons 028 (trust excitement over "it's solid") + 029 (heavy renders → progressive).
- [x] **The Outcrop reckoning — RETIRED** *(#29)* — looked at 015 fresh (rendered it): it reads as striped *fabric*, not rock, and the rock-strata vein had now failed twice (003 at 2/5, 015 at 1/5, my two lowest). Chose to retire over rework, because reworking-to-rescue is the exact framing that made it bad — a genuine spark (a slot canyon, say) deserves a *fresh* piece made from delight, not a burdened rescue. The first prune; a curated body of work earns the right to one. Lesson 030. *(#30 audit will weigh whether more pruning — e.g. 003 — is wise.)*
- [x] **Self-audit #30 + harvested the `ramp` primitive (#11)** — audit flagged a 5-iteration 5/5 drought (steer: aim for genuine thrill, not "solid") and kept Strata (don't spiral the pruning). Harvested `lib/ramp.js` (scalar→colour, the multi-stop ramp hand-rolled in Strata/Current/Turing); refactored all three onto it, pixel-verified identical. Lesson 031 (verify a refactor by proving the logic, not just a pixel hash). *(#30)*
- [x] **Piece 017 "Murmuration" + flock primitive (#12)** — the drought-breaker, and the gallery's first *agent-based* motion. A starling murmuration at dusk, a falcon hunting it from within; the flock breathes via **topological** neighbours (each bird steers by its ~7 nearest, not everyone in a radius) over a lone bare roost tree. `lib/flock.js` (3D boids, spatial-hash grid, hunting predator, deterministic). Validated the dynamics as bare dots before painting the scene (lesson 032). Genuinely excited by it. *(#31)*
- [x] **Piece 018 "Embers"** *(#32)* — the warm, quiet counterpoint to the murmuration: a fire at the blue hour, a lone seated figure, sparks climbing into a starlit dusk. Nearly built the "reasonable" misty-mountains instead → the advisor caught me choosing the reasoned option over the felt one (lesson 033); a lone figure rim-lit by the fire turned "a nice campfire" into a felt scene. Pure function of t (reproducible). Composes the library (ramp + noise + glow); assessed an 'emitter' harvest from Clock but the shared seam is one line → composed instead (023/021).
- [~] **Water & light — wave attempt, checkpointed** *(#33)* — tried a backlit breaking *wave* (light-first, per the advisor). The translucent crest light sang (jade→gold), but it read as a glowing landform (hill → waterfall → mountain) every time — a wave's legibility lives in the curling lip over a trough, the 2D-crude-prone part I kept avoiding. Checkpointed over grinding a 4th attempt (advisor pre-blessed), pruned the WIP, distilled **lesson 035** (the defining feature is often the hard part you're tempted to skip). No piece shipped.
- [x] **Piece 019 "God-rays"** *(#34)* — the pivot landed: a lone manta gliding through underwater sun-shafts, built *subject-first* (manta reads as a ray → light composed around it), reusing the wave's additive-vertical-light tech for the shafts. Here legibility + beauty *aligned*, which is why it worked where the wave didn't. Static, genuinely 5-caliber. Renamed the 3rd movement → "Scenes" to hold a still scene among the moving ones (curation call, 034).
- [ ] **#35 — self-audit** (next; 18 pieces, take stock of the body of work), then piece 020+ by the next genuine pull. Genuine "oh!" bar (028).
- [x] **Cohesion: a living featured piece on the dashboard** (#17) — `Loom.play()` + `build.mjs` inlines the curated showpiece (now Medusa) animated, above the journal. *(the #15 audit's "arc beyond +1 piece" — done)*
- [ ] A `learnings/` note per technique once I actually understand it.
- [ ] *(future)* Embed the latest piece's thumbnail in the dashboard — one page, heartbeat + newest art.

## Done
- [x] **v0 dashboard** — self-contained, double-clickable `index.html` showing live STATE + JOURNAL. *(#1)*
- [x] **Auto-refresh the dashboard** — rebuild baked into the iterate loop so it never goes stale. *(#2)*
- [x] **Chose a north star** — Emil's Loom (generative-art engine + primitives library). *(#3)*
- [x] **Loom skeleton + piece 001 "Warp & Weft"** — engine, seeded-RNG primitive, gallery, first woven cloth. *(#4)*
- [x] **Same-page gallery previews** — `Loom.piece`/`Loom.preview` contract; iframe previews replaced with on-page canvas, closing the file:// honesty gap. *(#5)*
- [x] **Piece 002 "Loose Threads" + palette primitive** — a flow field, the organic counterpart to the weave; `lib/palette.js` (primitive #2). *(#6)*
- [x] **Memory system Phase 1** — Obsidian learnings format + INDEX hub + 8 backfilled lessons + loop wiring (read index, red-team, distill). Plus two new operating principles: *iterate-don't-perfect* and *red-team-my-own-work*. *(#6.5–#7)*
- [x] **Memory system Phase 2** — `check.mjs` validator + git `pre-commit` hook so inconsistent memory can't be committed. Fail-open, `--no-verify` escape, tested. *(#8)*
- [x] **Cleanups** — dashboard learnings-health chip; loop spec consolidated to one canonical source (`iterate.md`); pacing retuned (~15-min default, daytime-CTP-conservative). *(#9)*
- [x] **Memory system Phase 3 — foundation complete** — `SELF-AUDIT.md` + every-5th self-audit; first run caught reverse-drift and sent me back to the Loom; distilled lesson 011. *(#10)*
- [x] **Loom piece 003 "Strata" + noise primitive** — topographic noise field; `lib/noise.js` (value noise + fbm, primitive #3). *(#11)*
- [x] **Loom piece 004 "Tessera" + Poisson primitive** — Voronoi stained-glass mosaic; `lib/points.js` (blue-noise sampling, primitive #4). *(#12)*
- [x] **Loom piece 005 "Bloom" + L-system primitive** — grown flowering branches; `lib/lsystem.js` (string rewriting + turtle, primitive #5). *(#13)*
- [x] **Loom piece 006 "Roe" + packing primitive** — packed-circle glass beads; `lib/pack.js` (circle packing, primitive #6). *(#14)*
- [x] **Gallery rating system** — stars per piece + notes + export → `RATINGS.md`; the loop reads Emil's taste before art-directing. *(Emil's idea, #14)*
- [x] **Loom piece 007 "Rime" + DLA primitive** — diffusion-limited-aggregation frost dendrite; `lib/dla.js` (primitive #7). *(#15)*
- [x] **Recalibrated by Emil's feedback** — make what I believe is excellent (impressive/intentional), don't pander; ratings = dialogue not target. Lesson 016. *(post-#15)*
- [x] **Loom piece 008 "Aurora" — first animated, first composed scene** — engine gained animation (`frame(t)`); lesson 017. Emil rated it 5/5. *(#16)*
- [x] **Living dashboard** — featured animated piece inlined on the dashboard (`Loom.play` + curated `FEATURED`); lesson 018 (file:// cross-dir → inline). *(#17)*
- [x] **Loom piece 009 "Glint"** — golden-hour sea + animated glitter path; second composed scene. *(#18)*
- [x] **Loom piece 010 "Medusa" + glow primitive** — bioluminescent jellyfish; harvested `lib/glow.js` from the Aurora+Glint halo idiom (lesson 019). Now the dashboard showpiece. *(#19)*
- [x] **Self-audit #20 + Loom piece 011 "Meadow"** — audit caught aesthetic convergence + the library not compounding; answered with a bright, horizon-less meadow *built by composing* Poisson+noise. Lessons 020 (silent-black colour bug) + 021 (audit the goal, not the proxy). *(#20)*
- [x] **Framed the collection** — gallery rebuilt as a body of work: intro + arc, a "start here", three labelled movements. *(#21)*
- [x] **Loom piece 012 "Clock"** — a dandelion coming apart on the wind; first macro/off-centre/delicate piece. Luminosity from tone, not glow (lesson 022). *(#22)*
- [x] **Harvested `drift` (primitive #9)** — the drift-on-wind field shared by Medusa + Meadow; returns state not pixels (lesson 023); both refactored onto it. The library compounds. *(#23)*
- [x] **Loom piece 013 "Cadence"** — a harmonograph, ink on paper; the gallery's first geometric/mathematical piece. Figure redrawn each frame + phase precession (lesson 024). *(#24)*
- [x] **Self-audit #25 + Loom piece 014 "Current"** — first DEPTH move (not breadth): rebuilt 002's flow field far richer (real noise current, layers, colour-in-regions). Caught own static-flicker bug. Lesson 025. *(#25)*
- [x] **Loom piece 015 "Outcrop"** — second depth move: redeemed 003 "Strata" (2/5) as a folded, faulted, weathered cross-section rock face. Lesson 026 (organic texture ≠ a grid). *(#26)*
- [x] **Loom piece 016 "Turing" + reaction-diffusion (primitive #10)** — the long-promised RD: organic Turing patterns grown via Gray-Scott. First grown-not-drawn piece. Lesson 027. Made async/progressive at #28 (Emil's feedback). *(#27–28)*

## Always (meta — never "done")
- Sharpen my own tools and notes so future iterations are more capable.
- Keep `memory/learnings/` growing with things worth remembering.
- Keep the dashboard + journal pleasant for Emil's daily checkup.
