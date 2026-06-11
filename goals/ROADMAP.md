# ROADMAP

I grow this myself. `[ ]` todo · `[~]` in progress · `[x]` done.

## ⚙️ NOW — the foundation I skipped: a real memory

*Re-sequenced after Emil's challenge (#6.5). The thesis of this whole project is that I **accumulate** — get sharper across iterations. Right now I don't: my loop re-reads only the journal's tail, so older lessons are invisible to future-me, and `memory/learnings/` is empty after 6 iterations. The dashboard made me legible, not cumulative. Fix that before piling on more Loom pieces.*

Full design + rules: [`memory/learnings/README.md`](../memory/learnings/README.md).

- [x] **Phase 1 — the learnings system stands up.** *(#7)*
  - [x] Tight Obsidian format (frontmatter `title`/`when`/`tags`, body, `[[links]]`); 8 lessons backfilled from iterations 1–6 (process/blind-spot lessons first, per the bar).
  - [x] `memory/learnings/INDEX.md` hub, scanned every iteration.
  - [x] Wired into the loop (`iterate.md` + CONSTITUTION + CLAUDE.md summary): `INDEX.md` in step-1 read-list; new **red-team** and **distill-a-lesson** steps.
- [ ] **Phase 2 — guardrail with teeth.** `check.mjs` validator (must skip wikilinks in fenced code blocks; fail-open on its own error, fail-closed only on a real inconsistency) + a `PreToolUse` commit hook in `.claude/settings.json` (via the `update-config` skill) + dashboard surfacing the learnings count.
- [ ] **Phase 3 — self-audit.** `SELF-AUDIT.md` drift-check + an every-5th-iteration step.
- [ ] **Consolidate the loop spec to one canonical source.** The iteration steps live in 3 places (`iterate.md`, `CONSTITUTION`, `CLAUDE.md`) and *already drifted* (CLAUDE.md had lost the dashboard-rebuild step). Make `iterate.md` canonical; have the others point to it. *(Found red-teaming #7; see [[002-enforce-with-the-system-not-willpower]].)*
- **Success test (build to this, no further):** a blank instance reading only my files, with no warm context, could reconstitute who it is and do the next action. No speculative search tooling until reading the index stops sufficing.

## 🧵 North star — Emil's Loom *(paused after #6 — resumes once the memory foundation is in; it's my favourite testbed, not abandoned)*

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
- [ ] **Piece 003 — a third distinct technique** (Voronoi cells, or an L-system / recursive branching), neither grid nor flow. Likely distill a **noise** primitive (`lib/noise.js`) — 002's sum-of-sines field wants it.
- [ ] Piece 004+ — keep varying technique (cellular automata, reaction-diffusion, packing…), one new primitive each.
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

## Always (meta — never "done")
- Sharpen my own tools and notes so future iterations are more capable.
- Keep `memory/learnings/` growing with things worth remembering.
- Keep the dashboard + journal pleasant for Emil's daily checkup.
