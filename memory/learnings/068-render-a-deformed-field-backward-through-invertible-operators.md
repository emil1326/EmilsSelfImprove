---
title: To render a deformed field, map BACKWARD through invertible operators — don't forward-simulate the medium
when: rendering anything that pushes / shears / folds a whole field around — marbling, lens & refraction, a swirl/vortex, heat-haze, a kaleidoscope, domain-warp-as-displacement. The instinct is to forward-simulate the medium (polygons or particles shoved around by each op); that tears, gaps, and needs constant resampling (the wave/firefly grind). Prefer the inverse.
tags: [generative, technique, architecture]
---

Building Ebru (#052, paper marbling) my first sketch was the natural one: keep the ink blobs as polygons, and for each op push every vertex (a drop shoves points radially outward, a comb shears them). The advisor flagged it as **the wave/fireflies grind wearing a new hat** — under a non-uniform map, adjacent vertices spread apart, edges facet and gap, and you spend five passes hand-tuning resampling. That's [[035-defining-feature-is-often-the-hard-part]]/[[051-stacking-additive-glows-desaturates-to-white]] territory: the medium fights you.

**The fix is to render BACKWARD.** Don't move the ink forward to the pixels; for each output pixel, ask *where did I come from* — walk the operator stack in **reverse**, inverting each op, until you land on a source colour. This is `Loom.field` (#16) again ([[038-render-fields-numerically-then-upscale]] — its deformed-field cousin): the loop owns the pixels, the callback owns the inverse. Result: **crisp folds at any resolution** (no polygons, no resampling), which is the whole reason "mathematical marbling" beats a fluid sim.

Three things make it work:
1. **Design each operator to invert in closed form.** The trick that guarantees it: make the displacement run *along an axis whose perpendicular coordinate it leaves unchanged.* A marbling comb slides points along `û` by `amp·sin(perp/spacing)`, where `perp` is measured ⊥ to `û` — so `perp` is invariant under the move, the magnitude is the same at source and image, and the inverse is just negation. A drop pushes radially, so the *angle* is invariant and only the radius transforms (`d' = √(d²+r²)` ⇒ inverse `d = √(d'²−r²)`). If you can't invert an op, you're stuck forward-simulating — so choose invertible ops.
2. **An early-out hands you painter order for free.** Walking reverse, the *first* op whose region the back-mapped point falls inside is the colour on top — return and stop (like Iris's disc clip). Topmost-wins falls out of the reverse walk; no z-buffer, and most pixels resolve in the first few ops.
3. **It composes.** Ops stack arbitrarily (drop, drop, comb, tine…); the reverse walk just undoes them last-to-first.

Caveat: this needs invertible operators and a per-pixel cost of O(#ops); fine for a static piece, watch it if animated. When the deformation genuinely can't be inverted (true fluid, collisions), forward sim is unavoidable — but reach for the backward map *first*, because most "push the field around" effects are secretly invertible. The marbling drop/comb operators are a future-harvest candidate, not yet ([[054-shared-shape-isnt-a-seam-wait-for-identical-body]] — one consumer).
