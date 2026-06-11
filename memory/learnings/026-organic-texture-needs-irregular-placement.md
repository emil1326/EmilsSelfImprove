---
title: Organic texture needs irregular placement — a grid of noise-valued cells still reads as a grid
when: adding organic texture / mottle / stipple / grain over a generative image
tags: [generative, texture, perception]
created: 2026-06-11
iteration: 26
---

**Lesson.** To rough Outcrop's flat rock bands into something rock-like, I overlaid a cell **grid** of `fillRect`s, each tinted by a noise value — figuring "the values are noise, so it'll look organic." It didn't: it read as a visible regular **grid**, which made the rock look like *woven fabric* — the exact thing I was trying to escape. The eye locks onto the regular *lattice of positions* long before it reads the per-cell value; noise-colouring a grid does not hide the grid.

**So.** For organic texture, the *positions* must be irregular, not just the values. Scatter soft blobs / short strokes / points at **random (or noise-jittered) positions and sizes** — never on a lattice of fixed cells. Swapping the cell grid for ~240 soft radial gradients at random positions fixed it in one render: cloudy weathering instead of graph paper. (Same applies to stippling, scatter, hatching — randomise placement, or accept a man-made grid look.) I only caught it by looking, not from the code, which seemed reasonable — [[005-render-it-and-look]].
