---
title: Translucent atmosphere (steam/fog/smoke/mist) shaped by a smooth mask reads as a SOLID — break it with noise + soft envelopes
when: rendering steam, fog, smoke, mist, haze, cloud, dust — any soft translucent volume. The instinct is to define its density with a smooth shaped mask (a gaussian blob, a cone, a vertical gradient). That reads as a solid translucent OBJECT — a beam, a wedge, a ghost — not as air.
tags: [generative, light, technique]
---

Building Prismatic (#053) the steam went wrong in a way worth remembering. v1: density = a narrow horizontal gaussian × a `pow(height)` vertical ramp, hard-cut at top and bottom. The result was a **triangular white wedge** rising from the pool — it looked like a light-beam or a ghost, plus the hard bottom cutoff drew a visible **line across the pool**. The shape was *too clean to be air*.

**Why:** atmosphere has no smooth silhouette. A smoothly-shaped translucent mask gives the eye a defined edge and a uniform interior, and the brain reads "solid translucent thing," not "haze." Three fixes, all needed:
1. **Break the density with fbm noise into patches/wisps.** The mask sets *where steam can be*; noise decides *where it actually is*, moment to moment. Without the noise multiply it's a blob; with it, it's wisps.
2. **Soft envelopes, never hard cutoffs.** Replace `if (y < top || y > bot) return` with a smooth falloff (a parabola `1−vy²`, a gaussian, env²). A hard spatial cutoff in a soft element draws a hard line every time — the worst tell.
3. **Match noise frequency to billow scale, and stretch it along the flow.** Low frequency = big soft billows; high = thin wisps. Stretching the noise along the rise direction (sample x at higher freq than y) turns blobs into *rising columns*. Then warm/cool and fade it by height so it's lit, not flat.

This is [[047-first-render-of-a-natural-thing-is-too-regular]] specialized to *translucent volumes* — the regularity hides in the MASK SHAPE, not the subject's form — and a cousin of [[038-render-fields-numerically-then-upscale]] (a soft field, low-res + upscale is right here) and [[045-a-luminous-subject-needs-an-environment-to-light]] (give it a light to catch). The one-line tell: **if your steam/fog has a recognizable outline, it's an object, not air — noise-break it and soften the edges until the outline dissolves.**
