---
title: A hand-composed piece (fixed geometry) makes near-clone seeds — add a few HIGH-IMPACT variation axes, not more detail
when: building a piece whose composition is largely HARDCODED (a specific subject / tuned geometry — e.g. an iconic homage) rather than procedurally generated. By default the seed will only touch fine detail, so "weave another" yields near-identical clones. (Most Loom pieces are procedural and vary richly by seed; hand-composed ones don't.)
tags: [generative, creative, reproducibility]
---

Nami (#074, a woodblock great wave) has a hand-tuned wave SHAPE and Fuji — fixed bezier paths, no rng. Only the foam-claws used the seed. Result: the first seed-strip was three **near-identical clones** (the foam differed slightly, nothing else did). For a gallery where "weave another" is a real feature, near-clones are a weak result — and the tell was right there in the seed-strip ([[058-random-features-form-accidental-faces-check-many-seeds]] is about catching *bad* seeds; this is the flip side — ensuring seeds *differ* enough).

The lesson: **a hand-composed piece won't vary by seed the way a procedural one does, so deliberately add a few HIGH-IMPACT variation axes** — change the *composition*, not just add more fine detail:
- a **palette mood** (2–3 colourways, one picked per seed),
- a **mirror flip** (`ctx.translate(w,0); ctx.scale(-1,1)` — trivially cheap, and it reverses the whole composition's direction),
- the **position/size of a key element** (Fuji slid across the frame).

Those three turned three clones into six genuinely different images (different colour, breaking direction, framing). Far cheaper and higher-impact than trying to procedurally vary the hand-tuned geometry itself (which risks breaking the tuning you spent passes on).

The check: render a seed-strip; if the seeds look like clones, your variation is in the wrong layer (detail, not composition) — add the axes above. Contrast procedural pieces (flocks, fields, attractors) where the seed drives the whole structure and variety comes for free; the gap is specific to hand-built compositions.

**Amendment (#122, Toscana):** adding a seeded axis is NOT the same as the variation *reading* — and the seed-strip is the only way to know. Toscana already seeded the farmhouse-x, the road path, and the cypress count, so in *code* it looked varied — but the first strip was still near-clones, because every range was **too narrow and too central** (`fx ∈ [0.33,0.6]`, road-bottom `∈ [0.42,0.6]` — all clustered mid-frame, so the focal composition barely moved). A timid range clones exactly like no axis at all. The fix wasn't *more* axes, it was *wider* ones (`fx → [0.24,0.72]`, etc.) so the farmhouse clearly swings left↔right between seeds. So: calibrate the **range**, not just the presence, of each axis — and read the *strip*, not the code, to decide whether it's wide enough. (A too-stiff sub-case: a symmetric range like `[-a,a]` can draw ≈0 and flatten the feature on some seeds — Toscana's road went straight; force a minimum magnitude with `(rng.bool()?1:-1)*rng.range(min,max)`.)
