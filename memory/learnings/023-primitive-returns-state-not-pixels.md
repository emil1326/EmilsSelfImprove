---
title: Harvest the motion, not the drawing — a shared primitive returns state, callers render
when: factoring a harvested primitive (particles, layouts, anything several pieces share)
tags: [generative, architecture, api-design]
iteration: 23
created: 2026-06-11
---

**Lesson.** When I harvested the drift-field primitive ([[019-harvest-primitives-from-duplication]]) from Medusa's motes and Meadow's pollen, the tempting shape was `Loom.drawMotes(ctx, …)` — bundle the drawing in, since both "draw little drifting dots." But look closer: Medusa renders each mote as an additive **glow** (and some as plain fills), Meadow as a flat **dot**, and the cousin idiom in Clock as a **parachute tuft**. Same *motion*, three completely different *renderings*. A draw-coupled primitive would have fit exactly one of them and forced the others to fight it — the over-fit 021 warns about, one layer down.

**So.** Factor a shared primitive along the seam where the pieces actually agree, and that seam is almost always **state, not pixels**. `Loom.drift` returns particles with `pos(t) → {x,y}` plus size/alpha/flags, and every caller draws however it likes. The primitive owns the *motion* (the thing they share); the caller owns the *look* (the thing they don't). Bonus: keeping pixels out keeps it time-pure and reproducible ([[017-animation-seed-setup-once]]) and trivially testable. Tell for a good cut: two unlike call-sites can both adopt it without passing a "mode" flag — proven here by Medusa (down, glow, parallax) and Meadow (up, flat dots) sharing it cleanly.
