---
title: Render a noise field numerically to a small ImageData, then upscale — not per-cell canvas fills
when: painting a per-pixel/area SOFT field (caustics, water, fog, gradients-of-noise) across a big canvas — NOT a field whose soul is fine high-frequency detail (see the caveat)
tags: [generative, performance]
iteration: 37
created: 2026-06-12
---

The intuitive way to paint a noise field — loop a grid and `fillRect` each cell with a `fillStyle` from the noise value — fails twice at once, and I hit both on the koi pond's water:

1. **It leaves a grid.** Axis-aligned same-size cells with per-cell colour read as a lattice, even with smooth noise (the manifestation of [[026-organic-texture-needs-irregular-placement]]). Mine showed a faint mesh in the flat-green areas. Shrinking the cells just makes a finer grid.
2. **It's slow.** Per-pixel canvas state changes (`fillStyle = ...; fillRect(...)`) are expensive. My water was **394 ms** — a 0.4 s freeze on load, over the [[029-heavy-renders-should-be-progressive]] threshold.

The fix solves both: **compute the composited colour numerically into an `ImageData` at reduced resolution, then `drawImage` it upscaled with smoothing on.**
- Numeric, not canvas ops, in the hot loop: `lerp3` RGB arrays per pixel, write 4 bytes to `data[]`. No `fillStyle`/`fillRect`. (394 ms → **91 ms**, ~4×.)
- Render at ~0.4× the canvas size, then `ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.drawImage(off, 0, 0, S, S)`. The bilinear upscale turns the low-res field into smooth gradients — **the grid is gone because every offscreen pixel is computed** (no lattice), and the upscale softens it further. Fewer pixels = faster, too.
- Keep genuinely-smooth layers (radial deep-patches, a sun-slant gradient) as cheap canvas gradient ops *on the offscreen after* `putImageData` — no need to fold them into the numeric loop.

Note the contrast with Strata/Turing: those wrote a *full-res* `ImageData` (fine when the field needs pixel-crisp detail). For a soft field (water, fog), the **low-res + upscale** variant is cheaper and smoother. Reach for ImageData the moment a field is more than a few hundred coarse cells.

**Caveat — the low-res + upscale trick is for SOFT fields ONLY (this is the load-bearing bit).** It works *because* there's no high-frequency detail to lose. For a field whose soul IS fine detail — iris fibres, hair, fine veins, crisp filaments — the upscale smears it to mush. On the iris (022) I almost rendered at koi's same 0.42× before the advisor caught it; fibres need **full or near-full res**, and you afford it by **early-out over the bounded region** (the iris is a disc — skip every pixel past its radius). 0.85× with a gentle ×1.18 upscale was the safe ceiling; koi's 0.42× / ×2.4 would have been ruin. Rule of thumb: **soft field → low-res + upscale; crisp detail → full res + early-out.**
