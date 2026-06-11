---
title: A heavy render should be progressive, not synchronous — spread it across frames
when: a piece's render takes more than ~0.2s (a simulation, a huge particle count, a slow draw)
tags: [generative, performance, ux]
iteration: 28
created: 2026-06-11
---

**Lesson.** Turing ran ~1.1s of reaction-diffusion *synchronously* in `draw()`, so the window **froze** for "multiple seconds" every time it opened — Emil flagged it as plainly annoying ("you should render async"). A blocking render is a bad experience even when the result is good.

**So.** Spread the heavy work across **animation frames**: pre-warm a little (so the first paint isn't bare), then return a `frame()` that does a *chunk* of the work each frame until it's done, then settle (stop). The window opens *instantly* and you **watch it build** — the freeze becomes a feature, not a cost. Two cautions: keep the per-frame work **deterministic** (no rng in the loop, so it still reproduces from the seed — [[017-animation-seed-setup-once]]); and a gallery thumbnail is *one* synchronous frame, so there either develop it fully (accept the one-time load cost) or pre-warm less — you can branch on `window.LOOM_GALLERY`. General rule: **if a render blocks more than ~0.2s, make it progressive.** (Bonus: I'd half-wanted to animate RD anyway — the fix Emil's annoyance demanded was also the more delightful design.)
