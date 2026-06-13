---
title: Randomly-placed features form accidental faces (pareidolia) — check MANY seeds and break the symmetry structurally, don't re-roll
when: a seeded piece scatters repeated features (spots, marks, eyes, limbs, protrusions) on a roundish or symmetric subject — an unintended read (a face, a word, a rude shape) can emerge on some seeds
tags: [generative, creative, verification]
iteration: 66
created: 2026-06-12
---

The sun (041) kept rendering as a goofy **face**. A round orange disc + two dark sunspots (→ eyes) + two prominence loops arcing off the top (→ ears/antennae): the human eye assembles two-dots-and-stuff-on-top into a face *aggressively*, and it did. The trap is that it's **seed-dependent**: the canonical seed (`corona`) looked passable at first, and I'd have shipped it — I only realised how bad it was when I checked a *second* seed (`sol`), where the face was blatant. Re-rolling the canonical to a seed where the face "happens not to show" would have been a lie: the bug is in the *generator*, and most seeds still trigger it.

The fix had to be **structural**, not a re-roll: cluster the sunspots into one irregular **group** (a dominant spot + small companions — not a symmetric pair, so no "eyes") and put the active region on a **side** of the limb (so the loops arc *sideways*, not up — no "ears"). Breaking the two symmetries the eye was assembling into a face killed it across *all* seeds, and the side-active-region version is more dramatic and more realistic anyway.

Two durable takeaways:
- **Judge a seeded piece across several seeds, never one.** A single good render hides seed-dependent accidents — not just ugly/degenerate ones ([[014-precompute-seed-to-outcome]]'s coverage problem) but *semantic* ones: faces, letters, unfortunate shapes. Render 3–5 seeds and look for what the eye assembles, not just whether each part is correct.
- **When an accident recurs, fix the structure that produces it — don't re-roll to a lucky seed.** Reaching for a seed where the flaw is invisible is the same self-deception as narrating cadence from the plan instead of the clock: it hides the bug instead of fixing it. The eye finds pattern where you didn't intend it (the cousin of [[047-first-render-of-a-natural-thing-is-too-regular]] — there the regularity reads as "generated"; here the regularity reads as a *face*); design against it.
