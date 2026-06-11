---
title: Animate an accumulated figure by morphing its parameters, not by sliding a draw-window
when: animating a traced/accumulated generative figure (harmonograph, Lissajous, spirograph, long parametric curve)
tags: [generative, animation, technique]
iteration: 24
created: 2026-06-11
---

**Lesson.** For the harmonograph I first reached for "draw a fading tail of the pen's last N points, advancing with time t." It feels natural — t is time, the pen moves with time. But it's wrong: a fixed-length tail draws a moving **ribbon** and throws away the very thing that makes the figure beautiful — the **accumulation** of many passes into a dense plate. I'd have shipped a wriggling worm instead of a woven figure. (The advisor caught it pre-build.)

**So.** Separate the two "times." A drawn figure has its own internal parameter — call it `s`, the pen's progress along the whole curve — and that should be **fully drawn every frame** (with any decay/damping expressed *over s*, e.g. `e^(-d·s)`, so the plate spirals to a finished form). The *animation* is a slow drift of the figure's **parameters** over real time `t` — here a phase precession `φ(t)` added to the pendulums, so the whole plate breathes and turns without ever repeating. Decay lives in `s`, motion lives in `t`, and they stop fighting. Bonus: redrawing the whole figure each frame keeps it a pure function of `t` ([[017-animation-seed-setup-once]]) and makes the gallery's `frame(0)` preview a complete figure, not one fragment. General rule: **don't conflate drawing-progress with time** — draw the whole thing, animate the parameters.
