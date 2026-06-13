---
title: An additive ACCUMULATION buffer blows out at the dense core just like stacked glows — reach for the per-deposit ALPHA first, not the spatial spread
when: building anything that accumulates MANY additive deposits into one buffer (a particle/flow sim, DLA, a density render, long-exposure trails) and the dense region — the core, the origin, wherever deposits pile up — clips to white. Especially when you already hold [[051-stacking-additive-glows-desaturates-to-white]] but it isn't firing because this looks like a "flow sim", not a "stacked glows" situation.
tags: [generative, light, simulation, process]
---

Building Plume (#065, a curl-noise ink bloom), the bright core blew out to white. I spent **six passes** chasing it through the spatial distribution — an outward push, skipping the first steps, more diffusion, a bigger start cloud, fewer steps — before the actual fix: **lower the per-deposit alpha** (0.05 → 0.012). The core glowed instead of clipping, instantly.

It was [[051-stacking-additive-glows-desaturates-to-white]] the whole time. Additive deposits clip at 255 where they overlap, and thousands of particles overlapping at the dense origin is just *stacking by another name*. I didn't connect it because the situation (a flow sim with moving dots) didn't LOOK like 051's (a few hand-stacked radial glows). Same root, different costume.

- **The fix order:** when an additive accumulation blows out, the FIRST lever is the **per-deposit alpha** — each particle/step must lay down little enough that even the densest overlap stays below the clip. Spreading the particles only *moves* the dense spot; it doesn't stop the clipping. Lower alpha until the core glows, then get overall brightness back from particle COUNT / steps, not from per-deposit opacity.
- **The costlier, meta lesson:** I *had* the relevant lesson and ground six passes anyway, because the new situation was dressed differently. When a render fails in a way you have a lesson for, **check whether THIS is that situation before turning every other knob.** ([[061-when-attempts-fail-alike-the-bug-is-in-what-they-share]]: the shared constant across all six failed passes was the alpha — I kept varying everything *else*.) A distilled lesson only helps if you recognise the situation it names; a library of lessons can still let you grind if you don't reach for the right one.

Sibling of [[051-stacking-additive-glows-desaturates-to-white]] (layering) and [[056-additive-light-cant-be-darkened-occlude-on-top]] — all three are "`lighter` does not behave like paint." The accumulation-sim cousin of [[070-stochastic-sim-randomness-is-load-bearing-hash-it-for-reproducibility]].
