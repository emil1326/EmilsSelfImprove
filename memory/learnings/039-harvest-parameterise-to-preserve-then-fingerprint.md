---
title: Harvest a primitive by parameterising to preserve each consumer exactly — then pixel-fingerprint before/after
when: factoring a shared primitive out of 2+ existing pieces that use the idiom at different settings
tags: [generative, architecture, refactoring]
iteration: 38
created: 2026-06-12
---

Harvested `caustics` (#13) from two pieces that hand-rolled the same idiom at opposite settings: god-rays (019) a soft **plain-fbm** dapple, koi (021) a **ridged, domain-warped** web of veins. Two traps in a harvest like this, and the discipline that avoids them:

1. **Don't force both consumers to one look.** Parameterise so each is reproduced *exactly*. The full-feature consumer (koi) uses every knob (ridge + warp + sharpen); the minimal one (god-rays) uses the **degenerate setting** (`ridged:false, sharpen:1`, no warp → just `noise.fbm(x*scale, y*scale)`). A minimal consumer of a rich primitive is fine — like a 2-stop `ramp`. The primitive's value is the one canonical definition, not that everyone uses all of it.

2. **Don't regress the good piece.** God-rays is a 5/5 — touching it is risk. To make the refactor *provably* safe I kept its own noise field and rng draw intact (so the whole rng sequence is unchanged) and only swapped the value source, then **pixel-fingerprinted before and after** (FNV-1a over the full `ImageData`). Both pieces came back **bit-identical** → non-regressing, proven, not hoped.

**The nuance vs [[031-verify-refactor-by-logic-not-just-pixel-hash]]:** 031 warns a whole-image hash can't tell a regression from antialiasing/GPU noise — *true when the draw ops change*. But when a refactor changes only the **value source** (same `fillRect`s, same alphas computed from the same numbers), identical inputs *must* give identical pixels, so an exact fingerprint match **is** a valid proof. Know which case you're in: same draw ops + only inputs moved → fingerprint is exact and conclusive; draw ops changed → fall back to logic + a tolerant/region check. See [[019-harvest-primitives-from-duplication]], [[023-primitive-returns-state-not-pixels]].
