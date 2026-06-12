---
title: Cellular/cracked textures read as procedural unless the CELL SIZES vary — jittering positions isn't enough
when: rendering a cellular or cracked texture (lava crust, cracked mud, scales, cells, stained glass, a giraffe's coat) from Voronoi/poisson seeds and it still looks regular/synthetic
tags: [generative, texture]
iteration: 48
created: 2026-06-12
---

Making the lava (028), I scattered the crust-plate centres with **poisson** (blue noise) — exactly what [[026-organic-texture-needs-irregular-placement]] prescribes to kill a grid. And the first render *still* read as a too-regular honeycomb. Poisson removes the lattice (no two cells line up), but it enforces a **minimum spacing**, so every cell comes out roughly the **same size** — and uniform size is its *own* procedural tell, separate from grid-alignment. Real broken things have big slabs next to small shards.

So 026 is necessary but not sufficient. Two more tools for natural cellular textures:

1. **Vary the cell SIZE, not just the positions.** The clean way is an **additively-weighted (Laguerre / power) Voronoi**: give each seed a weight `wᵢ` and classify a pixel by the smallest `|p − cᵢ| − wᵢ`. Bigger weight → bigger cell, and the boundaries stay straight (unlike *multiplicative* weighting, which curves them and can swallow whole cells). `wᵢ = pow(rand, 1.6) · r·0.7` gave a believable mix of slabs and shards. (Other routes: variable-density seeding, or merging adjacent cells by a noise field.)
2. **Draw the seams with the F2−F1 edge distance.** For each pixel take the distance to its nearest two seeds; `edge = F2 − F1` is ≈0 exactly on a cell boundary and grows toward cell interiors. `crack = (1 − min(1, edge/width))²` paints glowing seams cheaply — and **width can be driven by another field** (heat, here: wide molten rivers where hot, hairline where cool). This is different from Voronoi *membership* (nearest-one, which colours cells — what Tessera #4 did); F2−F1 colours the *walls between* them.

The blind spot worth keeping: I'd internalised "blue-noise beats a grid" (026) and assumed that bought me organic — but **even-sized** cells are still synthetic. Whenever a cellular texture looks too regular, check size variance *before* re-rolling the seed. Pairs with [[026-organic-texture-needs-irregular-placement]] (position) as its size-domain twin, and the upscale-bloom of the cracks is the soft-field case of [[038-render-fields-numerically-then-upscale]].
