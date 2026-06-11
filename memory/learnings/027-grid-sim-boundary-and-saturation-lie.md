---
title: A grid simulation lies at its boundary and when saturated — seed sparse, crop the interior
when: rendering a grid simulation (reaction-diffusion, cellular automata, fluid) to an image
tags: [generative, simulation]
iteration: 27
created: 2026-06-11
---

**Lesson.** Building the reaction-diffusion piece, two boundary/init mistakes ate the iteration. (1) I held a fixed 1-cell **border** (so the interior loop needs no wrapping) — but the cells *near* it develop differently, producing a bright **frame** several cells deep. Drawing the whole grid framed the image like a picture mount. (2) To fill the field I initialised the **whole grid** with high catalyst — and the centre **collapsed** back to blank (too much reactant dies off), leaving pattern only in a thin band hugging the stabilising edge. The exact opposite of "fill everywhere."

**So.** A grid sim's **boundary** and its **initial saturation** both lie about the steady state. Two rules: **seed sparse** — many small spread-out nucleation spots that *grow* to fill, never a saturated field; and **crop to the interior** — render the inner ~90%, discarding the edge band where the boundary condition distorts things. (For RD: ~70–100 small seed patches, then `drawImage` cropped ~5% in on each side — fixed both in one render.) Generalises to any cellular sim I'll do next (CA, fluid, smoothlife). Both were invisible in the code and obvious on screen — [[005-render-it-and-look]].
