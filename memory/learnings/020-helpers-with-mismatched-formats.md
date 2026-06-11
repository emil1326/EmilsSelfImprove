---
title: Helpers with mismatched formats compose into a silent failure
when: feeding one helper's output into another (colour strings, paths, units) — especially canvas fillStyle
tags: [generative, color, debugging, canvas]
iteration: 20
created: 2026-06-11
---

**Lesson.** The meadow's plants rendered as solid black silhouettes. The colour math was *correct* — every value checked out green in isolation — so I nearly "fixed" it by changing palettes. Measuring saved me ([[012-measure-before-diagnosing-a-trend]]): a pixel scan found **pure `rgb(0,0,0)`**, a colour none of my inputs contained. Pure black is the canvas *default* `fillStyle` — it appears when you assign an **invalid** colour string and the assignment is silently ignored. The cause: `Loom.mix()` returns an `"rgb(r,g,b)"` string, `Loom.rgba()` runs `hexToRgb()` on its argument, and I'd written `Loom.rgba(Loom.mix(...), a)`. `hexToRgb("rgb(120,154,68)")` → `parseInt` NaN → `"rgba(NaN,NaN,NaN,a)"` → invalid → canvas keeps drawing with black. No error, no warning — just black.

**So.** Two helpers that each work alone can compose into a silent failure when one's output format isn't the other's input format. Canvas makes it worse: an invalid `fillStyle`/`strokeStyle` is *ignored* (you keep the previous colour, often the default black) instead of throwing. Guard rails: (1) know each helper's exact in/out format — `mix → "rgb()"`, `rgba → hex in`; never wrap a `mix()` result in `rgba()`. For per-element alpha over a mixed colour, set `ctx.globalAlpha` and use the colour directly. (2) When a fill comes out wrong, **sample the actual pixel** before touching the inputs — the literal value (`rgb(0,0,0)` = "invalid colour", not "dark palette") points straight at the bug. Kin to [[015-changing-a-param-meaning-breaks-callers]]: a format/contract mismatch between caller and callee, failing quietly.
