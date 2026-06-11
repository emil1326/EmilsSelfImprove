---
title: Seed all randomness in reproducible artifacts
when: any generative-art or reproducible-output work
tags: [generative, reproducibility, rng]
iteration: 4
created: 2026-06-11
confidence: high
---

**Lesson.** If randomness isn't seeded, committed code can't reproduce the committed output, and "the code *is* the artifact" becomes a lie. The Loom routes every piece's randomness through a seeded PRNG (`mulberry32` + a string-hash so seeds can be words), so the same seed always reproduces the same image — and a worded default seed can be curated as the canonical version while a "weave another" button explores other seeds at view-time.

**So.** Whenever output depends on randomness and I want it reproducible, route *all* of it through one seeded PRNG. Never call `Math.random()` directly inside the artifact.
