# Emil's Loom

A loom that weaves images in pure code. It's the SelfImprove loop's north star — a from-scratch generative-art engine and a gallery that grows one piece at a time.

Open `gallery.html` to see everything woven so far, or double-click any piece's `index.html` to see just that one — the browser does the weaving when you open the page, nothing to install.

Both work straight off the disk (`file://`): everything is classic `<script src>` and relative paths, and the gallery draws each preview into a plain on-page `<canvas>` — no iframes, no fetch, no cross-origin anything. (Verified rendering over a local server, which for this same-page setup behaves identically to a double-click.)

## The one idea that shapes everything

**A piece is its generator code plus a seed — never a saved image.** When you open a piece, the browser runs the code and draws the result live. That's a deliberate choice:

- the repo stays text — diffable, light, no pile of binaries growing over 50 pieces;
- there's no from-scratch image encoder to build, the browser is the renderer;
- and because every piece draws its randomness from a **seeded** generator, the committed code reproduces the committed image *exactly*. Same seed, same cloth, every time.

Want to explore? Every piece has a "weave another" button that re-rolls the seed at view-time. The committed default seed is the one that makes the canonical version.

## How it's laid out

```mermaid
flowchart TD
  L[lib/*.js<br/>shared primitives on window.Loom]
  S[pieces/NNN/sketch.js<br/>registers draw stage, rng — the artifact] --> L
  P[pieces/NNN/index.html<br/>full-screen view] --> S
  G[gallery.html<br/>front door: previews + links] --> S
```

A piece registers a size-agnostic `draw(stage, rng)` with `Loom.piece({...})`. That one rule means the *same* code renders full-screen on the piece's own page and as a small preview in the gallery — no duplication, no iframes, no `file://` framing questions.

- `lib/` — the **primitives library**, the part that makes this compound. Every iteration distills at least one reusable primitive here (a seeded RNG, a palette, a noise field…), so each new piece starts from a richer toolbox than the last. Classic scripts on `window.Loom` (not ES modules — those don't load over `file://`).
- `pieces/NNN-name/` — one piece each. `index.html` is the double-clickable shell; `sketch.js` is the generator, kept separate so the art reads on its own.
- `gallery.html` — lists every piece, each previewed live by drawing the real generator into an on-page `<canvas>`. Add a piece with one `<script src>` line plus a row in its `CATALOGUE`.

## The library so far

- **`lib/rng.js`** — seeded PRNG (`Loom.RNG`): `mulberry32` + string-seed hashing, with `range`/`int`/`pick`/`bool`/`gaussian`/`fork`. *(primitive #1, iteration #4)*
- **`lib/palette.js`** — curated palettes (`Loom.palettes`, `Loom.palette(rng)`) + colour helpers `Loom.rgba(hex,a)`, `Loom.mix(a,b,t)`, `Loom.hexToRgb`. *(primitive #2, iteration #6)*
- **`lib/noise.js`** — seeded value noise: `Loom.noise(seed)` → `n(x,y)` in [0,1) with `n.fbm(x,y,octaves,lacunarity,gain)` for fractal detail. The workhorse for fields, terrains, textures, warping. *(primitive #3, iteration #11)*
- **`lib/loom.js`** — the harness + the piece/preview contract: `Loom.piece({id,title,seed,draw})`, `Loom.preview()` (draw a piece into a gallery canvas), a crisp hi-dpi canvas, seed-from-URL, caption, and the "weave another" control. *(reworked to same-page previews in #5)*

## The pieces so far

- **001 — Warp & Weft** — vertical and horizontal threads crossing over and under, like cloth on a loom. The first thing it wove.
- **002 — Loose Threads** — the threads come loose: a few thousand drifting along an invisible current (a flow field). The deliberate opposite of the weave. Hit "weave another" to find its ember and violet moods.
- **003 — Strata** — a landscape from above: a noise field sliced into elevation bands and traced with contour lines, folded by domain warping like real rock. Built on `lib/noise.js`. The canonical seed is a pale survey-map; "weave another" finds ember-canyon and bathymetric-blue.
