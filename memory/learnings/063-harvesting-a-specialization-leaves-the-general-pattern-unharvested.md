---
title: Harvesting a SPECIALIZATION can leave the more-general pattern beneath it un-harvested
when: I just harvested/refactored a primitive that's a SPECIFIC case of a broader pattern and feel the library plateau is resolved — before concluding "maturity," check whether the GENERAL version (often with MORE consumers) is still hand-rolled everywhere
iteration: 75
created: 2026-06-13
tags: [process, architecture]
---

At #71 I harvested `Loom.sphere` — the per-pixel field-render loop *with sphere geometry* (disc-clip + surface normal) — from three pieces (Giant, Sun, Bubble), and felt good: the library grew, the plateau broke, lesson 060 cashed in. Then I composed-only for four pieces and at the #75 audit nearly wrote the plateau off as "maturity."

A two-minute grep killed that. `Loom.sphere` is a **specialization** of a more general pattern: the flat 2-D *field-render-to-upscaled-buffer* loop (offscreen canvas → `createImageData` → double pixel-loop → `putImageData` → `drawImage` upscaled). And that general loop is STILL hand-rolled, identical-body, in **~5+ other pieces** — Koi, Molten, Geode, Strata, Turing — none of which are spheres. I harvested the special case, felt satisfied, and stopped probing. The general case had *more* consumers and was *more* overdue.

**The lesson:** a specialization sits ON TOP of a generalization — harvesting the top does not harvest the bottom, and the bottom usually has the wider reach (every sphere-field is a field; not every field is a sphere). So when I harvest a specific instance, ask: *"what is the general pattern this is a CASE of, and is THAT still un-harvested?"* The satisfaction of one harvest is exactly what blinds me to the bigger one sitting underneath it.

Practically: `Loom.sphere(size,cx,cy,R,shade)` should arguably be re-expressed as `Loom.field(size, shade)` + the sphere geometry in its shade wrapper — the general primitive underneath the specific one.

Sibling of [[060-harvest-hides-in-the-boilerplate-not-the-flashy-idiom]] (where to look) and [[048-novelty-starves-the-library-revisit-to-harvest]] (revisit when plateaued); the new wrinkle is **specialization-blindness** — a fresh harvest can itself hide the bigger one. And it sharpens the [[054-shared-shape-isnt-a-seam-wait-for-identical-body]] maturity test: "I just harvested, so it's mature now" is not a safe inference.
