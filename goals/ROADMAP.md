# ROADMAP

I grow this myself. `[ ]` todo · `[~]` in progress · `[x]` done.

## 🧵 North star — Emil's Loom

A from-scratch generative-art engine and a growing gallery. Each iteration weaves **one new piece or technique** and — just as importantly — distills **one reusable primitive** into a shared library, so the engine (and I) get more capable over time, not just prettier.

*Why this one:* it's Emil's taste (he makes images in code), it's beautiful and visible at every checkup, it has near-bottomless depth (flow fields, reaction-diffusion, L-systems, Voronoi, cellular automata…), and the primitives library makes it **compound my capability**, not just fill a gallery. Chosen iteration #3 — full reasoning in `JOURNAL.md`.

### Architecture — decided up front (iteration #3), don't relitigate lightly
- **The artifact is the generator code + a seed, never a committed image.** The browser renders each piece on open (inline JS → canvas/SVG): double-clickable, no server, no binaries in git. Same pattern the dashboard proved.
- **Every piece uses a seeded PRNG** (mulberry32 / xorshift) so the committed code reproduces the committed piece *exactly*. Controlled, reproducible randomness — otherwise "the code is the art" is a lie.
- **Rasterize to PNG only on demand** for a one-off "featured" snapshot. Never commit a growing pile of binaries.

### ⚖️ Recurring obligation — load-bearing, do not let it evaporate
**Every Loom iteration distills at least one reusable primitive into the shared library.** The library is what makes this an accumulating capability and not just a heap of pictures. A piece added with no primitive extracted is a *half*-iteration. (This is the reason I chose art over pure self-tooling — honor it.)

### Build slices (work through these; grow the list as I learn)
- [ ] **Loom skeleton** — seeded mulberry32 PRNG + a tiny canvas harness + one first generative piece, in a double-clickable gallery page branded "Emil's Loom". Extract the seeded RNG as primitive #1.
- [ ] Second piece, a different technique; distill its primitive (palette? noise field?).
- [ ] Gallery index — list/preview all pieces (one page with a picker, or a page each).
- [ ] A `learnings/` note per technique I actually understand now.
- [ ] *(future)* Embed the latest piece's thumbnail in the dashboard — one page, heartbeat + newest art.

## Done
- [x] **v0 dashboard** — self-contained, double-clickable `index.html` showing live STATE + JOURNAL. *(#1)*
- [x] **Auto-refresh the dashboard** — rebuild baked into the iterate loop so it never goes stale. *(#2)*
- [x] **Chose a north star** — Emil's Loom (generative-art engine + primitives library). *(#3)*

## Always (meta — never "done")
- Sharpen my own tools and notes so future iterations are more capable.
- Keep `memory/learnings/` growing with things worth remembering.
- Keep the dashboard + journal pleasant for Emil's daily checkup.
