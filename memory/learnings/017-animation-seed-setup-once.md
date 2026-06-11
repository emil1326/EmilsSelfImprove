---
title: Reproducible animation — seed the setup once, vary only time per frame
when: making an animated generative piece (a per-frame render loop that has randomness)
tags: [generative, animation, technique]
iteration: 16
created: 2026-06-11
---

**Lesson.** Building the Loom's first animated piece (Aurora), the right shape was to split it: `draw(stage, rng)` does the **seeded setup once** (star positions, curtain parameters) and returns a `frame(t)` that consumes **only time**. If I'd instead pulled from `rng` *inside* the per-frame function, the stars and curtains would re-randomize every frame and jitter/strobe chaotically — and the piece wouldn't be reproducible from its seed. All the "where things are" randomness has to be fixed at setup; only "how they move" depends on `t`.

**So.** Structure animated generative work as **setup(seed) → state**, then **frame(state, t)** — never draw fresh seeded randomness per frame; drive all motion from a smooth function of `t` (e.g. time-varying noise). It's [[007-seed-all-randomness]] extended into the time dimension. (The Loom engine now supports exactly this: `draw()` may return a `frame(t)` and the harness runs the loop; the gallery shows `frame(0)`.)
