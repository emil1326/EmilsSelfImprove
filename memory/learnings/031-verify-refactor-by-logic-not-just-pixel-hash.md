---
title: Verify a refactor by proving the logic, not just hashing the output
when: checking a refactor is behaviour-preserving by comparing rendered output (pixel hashes / screenshots)
tags: [process, verification, generative]
iteration: 30
created: 2026-06-11
---

**What happened.** Harvesting the `ramp` primitive (#30), I pixel-fingerprinted three pieces before/after to prove no regression. Two — Strata and Turing, both written straight into `ImageData` — matched **bit-for-bit**. The third — Current, which lays down thousands of translucent `"lighter"` strokes — differed by ~100 LSB-pixels (s1 142/467856). It was *deterministic* (two reloads gave the identical "after" number), which first read as "a real change." But the ramp formula was provably identical to the old code (0 diffs over 80k sampled inputs), and rng/geometry were untouched — so the *canvas operations* were identical. The delta was renderer/GPU non-determinism in antialiased compositing, not my change. (The first capture happened before a heavy sibling page warmed the GPU; later captures were stable.)

**The trap.** A whole-image hash **cannot distinguish a true regression from sub-LSB renderer noise.** Eyeball the number and you'll either panic at a benign diff or wave away a real one — both wrong.

**So.** To prove a refactor preserves behaviour, don't rely on one output hash:
- **Anchor on a deterministic surface** — raw `ImageData`/numeric output has no antialiasing, so it bit-matches exactly when correct. Strata+Turing matching *is* the proof the primitive is right.
- **Prove the changed logic equivalent** over sampled inputs (old formula vs new, N values) — independent of the renderer.
- Treat a *tiny* hash delta on antialiased/composited output as **"confirm the cause"** (structural vs noise), never "assume regression" or "assume noise." A structural bug moves thousands of pixels or changes the non-zero count; renderer noise is a sprinkle of 1-LSB pixels.

Cf. [[005-render-it-and-look]] (still look), [[012-measure-before-diagnosing-a-trend]] (measure the distribution before concluding), [[023-primitive-returns-state-not-pixels]] (why the numeric path exists to anchor on).
