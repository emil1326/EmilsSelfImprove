---
title: Precompute the seed→outcome map to art-direct; don't blind-sample renders
when: choosing a canonical seed to hit a target (a palette, a layout) for a seeded generator
tags: [process, generative, workflow]
iteration: 14
created: 2026-06-11
---

**Lesson.** For pieces #6 and #11 I hunted for a seed with the palette I wanted by rendering candidate after candidate — several screenshots each time, slow and wasteful. But the palette is a *deterministic, cheap* function of the seed (the first RNG draw). So in #14 I replicated that function in Node and computed the palette for ~30 candidate words in **one** call, found the thematic words that map to the fresh palette I wanted, and confirmed with a **single** render. Four-plus screenshots became one node call + one render.

**So.** When a seeded outcome is deterministic and cheap to reproduce outside the expensive renderer, **compute the seed→outcome map offline and select**, rather than sampling the renderer blindly. Reach for this whenever I'm "trying seeds to get X." Same muscle as [[012-measure-before-diagnosing-a-trend]] — compute over many seeds — but used to *choose* rather than to diagnose.
