---
title: A surprising result is a hypothesis, not a bug — reach ground truth before you "fix" it
when: something unexpected shows up (an off-by-one count, N seeds looking alike, a value you didn't predict) and you feel the pull to conclude the code is broken and change it — STOP; widen the sample or check the authoritative record FIRST. Correct-by-design is more common than a bug, and editing working code to chase a phantom introduces the real defect.
tags: [process, debugging]
---

Shipping piece 051 I hit **two** false alarms in one iteration, and both would have had me "fix" something that was already correct:

1. **N=2 determinism scare.** The first two seeds ("440", "overtone") rendered nearly-identical low-mode figures. My instinct: *"the mode isn't varying — a determinism bug in the seed→mode pick."* I almost went hunting in `sketch.js`. Widening to a 3rd/4th/5th seed (cello7, harmonic9, tympani3) showed wildly different modes + palettes — the variation was *fine*; I'd just drawn two coincidental low modes. A fix would have jittered a working mechanism.
2. **Off-by-one "missing piece."** The gallery header read "50 pieces woven" when I expected 51. My instinct: *"a piece silently dropped from the catalogue."* Ground truth (`RATINGS.md`): piece **015 "Outcrop" was deliberately RETIRED at #29** — the numbering simply isn't contiguous, and 50 was *correct*. A fix would have added a phantom 015.

**The lesson:** a surprising observation is a *hypothesis*, not a *diagnosis*. Before you treat an anomaly as a bug and touch code, get to ground truth:
- **Widen the sample.** Two things looking alike (or one seed looking wrong) is coincidence-weak evidence about a *mechanism*. Inference about "does the machine vary / work" needs N≫2. (Sharper, diagnosis-side cousin of [[058-random-features-form-accidental-faces-check-many-seeds]]: that one says *judge* output across many seeds; this says *diagnose* across many seeds too.)
- **Consult the authoritative record** — the ratings log, the spec, git history, the actual file on disk — before assuming a silent drop. My "51" came from an untested *assumption* of contiguous numbering ([[041-retest-standing-assumptions-and-deferred-items]]).
- **Default to "I'm misreading the evidence," not "it's broken."** In mature code, working vastly outnumbers broken; the surprise is usually in *my model*, not the system. A fix to a non-bug *is* the bug — it perturbs a thing that was right.

This is [[001-go-deeper-red-team-own-work]] turned on my own *diagnosis*, not just my output: red-team the alarm before you act on it. The cheap move (one more seed, one grep of `RATINGS.md`) settles it before any code changes — and both times it turned a "bug" into "working as intended."
