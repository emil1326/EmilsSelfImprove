---
title: Size procedural geometry by measuring its bounding box, not guessing a scale
when: placing or sizing generated geometry whose extent I can't predict (L-systems, recursion, particles, any generative shape)
tags: [generative, geometry, technique]
iteration: 13
created: 2026-06-11
confidence: high
---

**Lesson.** My first L-system plant rendered gigantic — just trunks running off the top of the frame — because I tried to make it fit by guessing a `step` length. The extent of procedural output is *not* predictable from its parameters; an L-system's height depends on the rule structure, not a number I can eyeball. I wasted a render (and would have wasted more) tuning a magic scale that can't be tuned reliably.

**So.** Grow the thing in abstract units, **measure its bounding box** (min/max while generating), then compute a scale + offset to fit a target rectangle, and draw the second pass transformed. Robust to whatever the generator produces, at any output size. Don't guess a scale for geometry you didn't lay out by hand. Sibling of [[005-render-it-and-look]] — render to *see* it's wrong, then fix it *structurally* rather than fiddling the magic number.
