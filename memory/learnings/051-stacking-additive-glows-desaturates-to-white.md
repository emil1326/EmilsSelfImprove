---
title: Stacking additive glows of a saturated colour desaturates it toward white — use one layer
when: layering multiple additive ("lighter") glows / gradients of the same saturated colour to make a light brighter or richer
tags: [generative, light, color]
iteration: 53
created: 2026-06-12
---

Making the fireflies (031), I drew **three** additive glows per fly — a halo, a brighter core, a spark — figuring more layers = a richer, brighter amber. They came out **pale cream**, not amber (measured: the brightest were `(210,204,180)`, R≈G≈B). The instinct was exactly backwards.

The maths: additive blending *adds* channels. Amber is `(255,192,64)`. One layer at full strength → `(255,192,64)` on black = amber, fine. **Two** stacked → `(510,384,128)` → R and G clip at 255 while B is still climbing → `(255,255,128)` = pale yellow. Keep stacking → all channels pin to 255 = **white**. So for a saturated colour, *more additive layers don't enrich the hue — they wash it out*, because the high channels clip first and the ratio that defines the colour collapses toward (1,1,1).

The fix: **one** additive layer per light, at an intensity *below* the clip point, and get brightness/size from the glow's radius and falloff — not from stacking. The hue survives because no channel pins. A near-white hot centre is correct *only* for something genuinely white-hot (a firefly's flash peak, a star) — apply it as a tiny, peak-only touch, never as the body of the glow. Switching fireflies from 3 layers → 1 layer at a capped intensity took them from cream back to amber in a single render.

This is the additive-blend twin of [[044-tone-curve-must-match-the-density-distribution]] (there, accumulation washed a *density* field; here, compositing washes a *colour*) and a sharpening of [[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]]'s step-5 warning ("don't over-white it"): the over-whiting often isn't one too-bright layer, it's *several* honest ones adding up past the clip. When a saturated glow reads pale, count your additive layers before you reach for the colour picker.
