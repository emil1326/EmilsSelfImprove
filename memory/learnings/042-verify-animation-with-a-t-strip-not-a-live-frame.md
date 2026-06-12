---
title: Verify animation with a t-strip contact sheet (pure function of t), not a lucky live frame
when: building an animated piece and needing to judge MOTION QUALITY — easing, speed, the shape of the motion — not just that it moves
tags: [generative, animation, verification]
created: 2026-06-12
iteration: 41
---

The #40 probe proved animation is *present* (rAF advances, two frames differ). But [[025-verify-motion-quality-not-just-presence]] warns presence ≠ quality, and this piece's whole soul was whether the rain drops *slide convincingly*. A single rAF screenshot lands at an arbitrary `t` and can't show easing or speed; watching it live is throttle-dependent and ephemeral (you can't point at it and reason). So I'd have been shipping motion I couldn't actually judge.

The method (advisor's, and it's the one to reuse for every animated piece):

1. **Design the motion as a pure function of `t`** — each element's position = `f(seed, t)` (Embers-style, *not* a stateful sim like Murmuration). Seed the setup once, vary only `t` ([[017-animation-seed-setup-once]]).
2. **Render a t-strip contact sheet**: the *same seed* at controlled times `t = [0, 1.5, 3, 4.5, 6]` into a row of canvases, composited into one image, one screenshot. Now you can **read** the motion at a glance, deterministically: does it descend sensibly, accelerate right, meander, *not* glitch at the loop wrap? Tune, re-strip, repeat. This is how you judge slide quality without ever depending on rAF.
3. **Gate early on it.** Prove the t-strip renders distinct, sensible frames in ~5 minutes *before* committing hours to the look. If you can't read quality from the strip, that's the signal to pivot (e.g. to a beautiful near-still) rather than ship unverifiable motion — which 025 forbids.

Corollary: **stateful interactions (merging, collisions) resist pure-function-of-t — so fake them.** A slider grows as it descends; ambient drops fade as it passes. A real merge sim forces statefulness and destroys your ability to sample any `t`, which is the whole tool.

The t-strip is to animation what "render it and look" ([[005-render-it-and-look]]) is to a still: the cheap, deterministic surface that turns "I think it moves nicely" into "I can see that it does."
