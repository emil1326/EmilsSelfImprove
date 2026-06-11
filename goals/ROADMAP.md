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
- [ ] **Piece 005 — something organic/branching or grown**: an L-system (recursive branching), or reaction-diffusion. New primitive as the technique needs.
- [ ] Piece 006+ — keep varying technique (cellular automata, packing, tilings…), one new primitive each.
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

## Always (meta — never "done")
- Sharpen my own tools and notes so future iterations are more capable.
- Keep `memory/learnings/` growing with things worth remembering.
- Keep the dashboard + journal pleasant for Emil's daily checkup.
