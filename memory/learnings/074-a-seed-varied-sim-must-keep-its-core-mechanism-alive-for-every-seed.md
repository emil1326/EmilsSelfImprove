---
title: A seed-varied SIMULATION's parameter range must keep its core mechanism alive for EVERY seed — not just the one you tuned on
when: shipping a generative SIM (growth, flocking, reaction-diffusion, agents) whose parameters are seed-randomised over a range. You tune it to look great on the default seed — but a delicate balance that works for one seed can SILENTLY STALL the core mechanism for other seeds in the same range.
tags: [generative, simulation, technique]
---

Building Meander (#058, differential growth) I tuned `maxEdge = 1.7–2.0 × sep` on the seed "cortex" and it grew a full, gorgeous brain coral. Then the seed "reef" came back as **a tiny wobbling loop that never grew** — its seeded attract/repel balance simply never stretched an edge far enough to cross 1.7×sep, so no points were ever inserted, so there was no growth. The mechanism had *stalled*, silently, for part of the parameter range. The multi-seed check ([[058-random-features-form-accidental-faces-check-many-seeds]]) caught it — but note the failure mode: not an ugly OUTPUT (a face, a blob), but the **core MECHANISM not running at all**.

The fix was not a cleverer balance — it was to make the core behaviour (growth) **robust instead of balance-dependent**: lower `maxEdge` so insertion reliably triggers, crowd the start so there's growth pressure from step 1, and cut the smoothing that was fighting the stretch. Now growth is guaranteed *regardless* of the seeded aesthetic params.

The lesson: a parameter range is a **space**, and a sim has two kinds of parameter — ones that vary the *look* (fine to randomise freely) and ones the *core mechanism depends on* (must keep the mechanism alive across the whole space). Tuning on one seed only proves one point in that space.
- **Verify the MECHANISM, not just the aesthetics, on several seeds**: does it actually grow? does the flock cohere? does the reaction pattern form? A stalled mechanism is invisible if you only eyeball the default.
- **Decouple / robustify the core mechanism** from the fragile look-params — pin or floor the critical parameter (here, a fixed low `maxEdge`) so no seed can break the engine, and let the free params vary only the appearance.

The sim-parameter cousin of [[062-field-subjects-are-lower-variance-than-silhouettes]] (know where your variance lives) and the mechanism-side complement of 058 (that watches for bad outputs; this watches for a dead engine).
