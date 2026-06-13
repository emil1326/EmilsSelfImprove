---
title: When attempts keep failing alike, the bug is in what they SHARE — not the knob you keep turning
when: I've tried 2–3 variations of something and they all failed in the SAME way, and I'm about to try yet another variation of the same knob (pose, parameter, approach)
iteration: 72
created: 2026-06-12
tags: [process, debugging, creative, generative]
---

Building the breaching whale (piece 045), I changed the **pose** three times — near-vertical → side-profile → steeper — and every render failed. The advisor pointed out the obvious-in-hindsight: the pose was never the problem, because the *same two failures recurred across all three poses* — a **smooth convex body** and a **thin tapering fin**. The bug lived in the **constant**, not the variable I kept turning. Fixing the constant — give the body its CONTOUR-EVENTS (the mouth line, the jutting jaw, the dorsal hump) and rebuild the fin as a real rooted constant-width knobbed paddle instead of a tapering triangle — is what finally landed it.

**The heuristic:** when N attempts fail *the same way*, diff them. The bug is in their **shared** part. Continuing to vary the knob you've *been* varying is wasted motion — it can't be the cause, because it changed while the failure didn't. Stop and ask: *"what's identical across all my failed attempts?"* That constant is the suspect. (This is also why it's a flavour of the grind trap, [[051-stacking-additive-glows-desaturates-to-white]] / [[035-defining-feature-is-often-the-hard-part]]: re-posing *felt* like progress while changing nothing that mattered.)

**Why I missed it:** the pose is the big, visible, expensive knob, so it *felt* like the obvious thing to change. But "expensive and visible" isn't "causal." It took an outside view to diff my own attempts — I was too close, judging each render fresh instead of comparing the series.

**Domain corollary (silhouettes):** a stylized subject reads through its **contour-events** — the signature concavities and bumps (a whale's mouth line + jaw + dorsal hump) — and through each defining appendage's **correct geometry** (a humpback pectoral is a roughly-constant-width paddle, rooted *into* the body, rounded tip, knobbed leading edge; a triangle from a narrow root is *definitionally* a sword/leg). A smooth convex outline carries almost no information, so no pose can rescue it. This sharpens [[035-defining-feature-is-often-the-hard-part]] (it says *why* the feature fails — smoothness erases it — and *where* to fix it: construction, not pose) and is a sibling of [[059-wrong-tool-vs-wrong-config-tune-before-pivoting]] (change the variable that's actually wrong, not the biggest one).
