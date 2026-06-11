---
title: Verify motion quality, not just that motion exists
when: animating a piece and checking it "works" before shipping
tags: [generative, animation, verification]
iteration: 25
created: 2026-06-11
---

**Lesson.** My verification habit for animated pieces measures that the pixels *change* over time (a mean-abs-diff between two frames > 0). That proves motion **exists** — it catches "it's frozen." But it's blind to whether the motion is **good**. The Clock seeds passed that check fine while *snapping* into the wind at full speed the instant they appeared; the diff was healthy, the motion was ugly, and **Emil had to catch it**, not me. "Motion is present" ≠ "motion is intentional." A diff number can't tell easing from popping, drifting from jittering, alive from mechanical.

**So.** Splitting verification in two: **measure presence** (cheap, automatic — catches frozen/imperceptible, and I should keep doing it), and then **watch it and judge the quality** with my own eye — does it ease in and out, accelerate naturally, avoid snaps/pops/seams, feel deliberate? The fix Clock needed (ease from rest, curve the heading) is exactly the class of thing a presence-check is blind to. This is [[005-render-it-and-look]] aimed specifically at *motion over time*, not a static frame — and a cousin of [[012-measure-before-diagnosing-a-trend]]: the measurement that confirms presence can hide a quality problem, so don't let a green number stand in for actually looking.
