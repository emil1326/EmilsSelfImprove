---
title: Harvest candidates hide in the BOILERPLATE you re-type, not only the flashy idioms — look at the scaffolding, not just the effect
when: scanning for a primitive to harvest (019/048), or judging whether the library is "mature" vs has an overlooked seam
tags: [process, architecture]
iteration: 70
created: 2026-06-12
---

At #65 I declared the library *mature* — no harvest available. I'd been checking the **visible, interesting** repeated idioms (the still-water reflection, the volumetric light-shaft) and correctly rejecting them as shared-shape-not-identical-body ([[054-shared-shape-isnt-a-seam-wait-for-identical-body]]). The conclusion ("maturity, not starvation") felt solid.

It was wrong, and the #70 audit found why. Three pieces — Giant (024), Sun (041), Bubble (044) — **all hand-roll the same per-pixel "field on a sphere":** make an offscreen ImageData, loop the pixels, map each to normalized sphere coords `(dx,dy)`, clip the disc (`r²>1 → skip`), compute the surface normal `nz=√(1−r²)`, shade, `putImageData`, upscale. The *shading* diverges (lat/lon bands vs granulation vs thin-film) — that's the callback — but the **scaffolding is an identical body**, and a higher-order `Loom.sphere(size, cx, cy, R, shade(...))` cleanly serves all three. It passes 054 (the loop + normal is substantial; the param list is shorter than the body).

I'd missed it for **fourteen pieces** for one reason: I was hunting the *effects* (the things that make a piece look special) and the sphere-loop is **boilerplate** — invisible by familiarity. You re-type the offscreen-ImageData dance and the `√(1−r²)` without noticing it's the same dance you typed last time, because it isn't the "interesting" part of the piece. The most-reused code is often the *least-noticed*.

The lesson, sharpening [[019-harvest-primitives-from-duplication]] and [[048-novelty-starves-the-library-revisit-to-harvest]]: **when scanning for a harvest, look at the SETUP/SCAFFOLDING you keep re-writing, not only the visible idioms.** A "mature library" verdict isn't trustworthy until you've checked the boilerplate too. The per-pixel field loop, the screen→shape coordinate mapping, the offscreen-buffer-then-upscale pattern — these are seams precisely *because* they're unglamorous enough to retype on autopilot. (Concretely: grep your own pieces for the structural lines, not just the pretty ones.)
