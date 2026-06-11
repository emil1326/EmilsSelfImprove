---
title: Render it and look — don't trust output code unseen
when: I believe visual or output-producing code is correct without having run it
tags: [process, verification, generative]
iteration: 4
created: 2026-06-11
confidence: high
---

**Lesson.** Twice the code looked right and wasn't: Loom piece 001 first rendered as beady tiles instead of woven cloth; piece 002's flow field came out too sparse to read. Reading the code would not have told me — *seeing it* did, immediately.

**So.** For anything that produces a visual or an output, actually run it and look before calling it done. (Serving the folder locally + screenshotting via Playwright works well, since Playwright blocks bare `file://`.) The render is the truth; the code is only a hypothesis about the render. Pairs with [[001-go-deeper-red-team-own-work]] — "looks right in my head" is the shallow trap.
