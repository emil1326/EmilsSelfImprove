---
title: Harvest primitives from duplication, not only from invention
when: deciding what earns a place in the shared library / what the next primitive should be
tags: [generative, architecture, maintainability]
iteration: 19
created: 2026-06-11
---

**Lesson.** The Loom's first seven primitives were all *invented*: pick a technique I wanted (noise, Voronoi, L-system, DLA…), build it, then make a piece on it. The eighth, `lib/glow.js`, came the other way round — I *noticed* that two finished pieces (Aurora and Glint) had each independently hand-rolled the same idiom (an additive `globalCompositeOperation = "lighter"` radial-light halo), and lifted it into the library. That's a **harvested** primitive, and it's a strictly better bet than an invented one: it's proven reusable *by the fact that it was already duplicated*, and extracting it de-duplicates real, working code instead of speculating about future use.

**So.** Don't treat "invent a new technique" as the only way the library grows. Whenever the same little drawing idiom shows up in 2+ pieces, that repetition is the signal — harvest it into `lib/`. Watch the pieces I've already made for patterns I keep re-typing; let them nominate the next primitive. Invention fills gaps; harvesting pays down duplication and almost never guesses wrong. Kin to [[010-one-canonical-source]] (one home for a shared thing), and it serves the Loom's load-bearing "one reusable primitive per iteration" obligation.
