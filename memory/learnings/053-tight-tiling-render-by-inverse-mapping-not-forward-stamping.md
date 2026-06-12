---
title: For tightly nested/tiled forms, render by inverse-mapping (pixel → which cell), not forward-stamping
when: rendering a form whose cells must abut seamlessly — a spiral's whorls, fish scales, a honeycomb, basket-weave, brick, woven bands
tags: [generative, technique, geometry]
iteration: 58
created: 2026-06-12
---

Making the nautilus (035), my first instinct was the circle-brush from Mimic's arms — stamp overlapping circles along the spiral centreline, widening as it grows. It had just worked beautifully for an octopus *arm*. On the nautilus it failed twice: **gaps** between the whorls (the dark ground showing through, so it read as a loose coiled hose, not a tight shell) and a **corrugated** surface (each stamp's dark edge showing as a rib). No amount of widening fixed both — overlap enough to close the gaps and the ribbing got worse.

The lesson: **a brush/stamp is the right tool for an ISOLATED stroke (one arm, one tentacle, one bolt), and the wrong tool for TIGHT TILING.** Tiles drawn by forward-stamping don't abut cleanly (you're approximating a tessellation with blobs), and their overlaps corrugate. When cells must pack seamlessly, **invert the problem: render per-pixel, and for each pixel compute which cell it belongs to.** For the nautilus that's the inverse log-spiral — `r = Rmax·growth^(−φ/2π)` ⇒ `φ = −2π·ln(r/Rmax)/ln growth`, then the whorl index from the angle, then the cross-whorl coordinate to shade the bulge. Tight, seamless, smooth, and the sutures/septa fall out for free as iso-lines of the cell coordinate. Switching approaches (not tweaking the broken one) fixed it in one render.

This is the sibling of [[038-render-fields-numerically-then-upscale]], but the point is different: 038 is *numeric-not-canvas-ops* (speed + no grid for soft fields); this is about the **mapping direction** — for a packed/tiled structure, go pixel→cell (inverse), never cell→pixels (forward). The tell you've reached for the wrong tool: you're fighting gaps and seams between stamped pieces, widening/overlapping to hide them and making it worse. That's the cue to flip to inverse-mapping. And it's [[035-defining-feature-is-often-the-hard-part]] in action — the *tight nesting* was the whole read of "nautilus, not coiled tube," and it was exactly the part the easy tool couldn't do.
