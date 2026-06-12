---
title: A density buffer's tone curve must match its value distribution, or a gorgeous ramp goes to waste
when: colouring an accumulation / density buffer (attractor, DLA, point-cloud, histogram, reaction concentration) through a colour ramp
tags: [generative, light, color]
iteration: 46
created: 2026-06-12
---

Weaving the strange attractor (026): I had an 8-stop ramp running indigo → violet → magenta → gold → white-hot, and the first render came out a flat, near-monochrome **violet** — the magenta and gold barely showed, only a pinprick of gold at the very centre. The ramp was beautiful. It just never got *used*.

The trap: **the data's value distribution decides which part of the ramp you actually see — not the ramp.** A density/accumulation buffer is almost always heavily **peaked**: a huge number of low-count cells (the diffuse veils), a tiny number of very-high-count cells (the bright cusps). Map that linearly, or even through `log`, and the whole bulk of the image lands in a *narrow slice* at the cold end of the ramp. Every warm colour I'd carefully chosen sat unused above a `t` the data almost never reached. "Gorgeous ramp → gorgeous image" is the false assumption.

**Fix: shape a tone curve to the distribution so the visible structure spans the whole ramp.** Here a single `t = pow(log(1+d)/lmax, 0.68)` — gamma < 1 lifts the mid-densities so the diffuse filaments climb into the magenta/rose/gold, while the cool body and white-hot core stay put. I found the value by rendering the *same* density buffer through `[1.0, 0.82, 0.68, 0.55]` side-by-side (compute the buffer once, re-tone it cheaply — don't recompute millions of points per try) and looking: 1.0 flat-violet, 0.55 blown-out-warm and losing the cool depth, **0.68 the balance**. Log, gamma, or histogram-equalisation — the point is to *match the curve to the histogram*, not to trust a default.

Why I'd have re-made it: the flat-violet version was **pretty**. It read as "solid", so without red-teaming I'd have shipped a 4 instead of pushing to the version that sings — exactly the [[028-trust-excitement-distrust-its-solid]] tell, caught by [[001-go-deeper-red-team-own-work]] and by actually [[005-render-it-and-look]]ing at the tone range. Distinct from [[038-render-fields-numerically-then-upscale]] (that's *where* to compute a soft field — small ImageData + upscale; this is *how to map values to colour* once you have them). Applies to any density/accumulation render: attractors, DLA, stippling-by-count, reaction concentration, heatmaps.
