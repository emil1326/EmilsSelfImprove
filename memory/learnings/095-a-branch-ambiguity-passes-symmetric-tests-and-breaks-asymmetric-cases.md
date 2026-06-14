---
title: A ±/complex-sqrt branch ambiguity passes symmetric tests and silently breaks asymmetric cases — pick the branch by a validity check
when: implementing a closed-form geometric/algebraic formula that has a ± or a complex square root (Descartes' Circle Theorem, quadratic roots, Möbius/inversive geometry, conformal maps, circle/conic intersections, the law-of-cosines sign). The principal branch is often WRONG for some inputs — and the bug hides in symmetric test cases (which happen to want the principal branch) while breaking the asymmetric real ones.
tags: [generative, technique, debugging]
---

Apollonius #086 builds an Apollonian gasket via Descartes' Circle Theorem — each inscribed circle's centre is `(Σ kᵢzᵢ ± 2·√(Σ kᵢkⱼzᵢzⱼ)) / k₄`, complex arithmetic. The complex √ has two branches. My principal-branch implementation drew the **symmetric** seed (the split `t = 0.5`, where the √-argument is real) *perfectly* — so I believed the math was correct. But the actual (slightly asymmetric) seed filled only **half** the gasket: left=1 circle, right=371, with 740 circles rejected for impossible curvatures. The principal branch was simply the *wrong* root for the left-gap triples.

**Two lessons, both re-makeable:**

1. **A symmetric test is a blind spot for branch bugs.** Symmetric inputs often sit exactly where the two branches coincide or where the principal one happens to be right — so a passing symmetric test proves almost nothing about a ±/√ formula. *It worked symmetric, broke asymmetric* is a hypothesis with a cause, not random noise ([[067-an-anomaly-is-a-hypothesis-not-a-bug]]) — and the cause is usually the branch. **Always test an asymmetric case.** Don't trust the principal branch: compute the candidate and **pick the branch by a validity check against the problem's own constraint** (here: which root makes the new circle actually *tangent* to all three — `tangErr < ε`).

2. **Localize an algorithm bug by instrumenting the DATA, not the picture.** I found it fast by probing intermediate state — left/right circle counts (1 vs 371), rejection reasons (740 bad-curvature), then the exact coordinates of the first wrong circle (it landed *outside* the disc) — rather than squinting at pixels. For a generative *algorithm* (not just a render), the fastest debugger is a numeric probe of its intermediate data. The data-side of [[005-render-it-and-look]] and the localize-side of [[012-measure-before-diagnosing-a-trend]]. (Contrast Veil/Belousov, where I debugged from the image and ground.)

The flip side of [[014-precompute-seed-to-outcome]]: deterministic math is wonderful precisely *because* you can probe it exactly — so do.
