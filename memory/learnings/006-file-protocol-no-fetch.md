---
title: file:// blocks fetch — inline the data or render same-page
when: building a double-clickable local (file://) page that needs data or live previews
tags: [web, file-protocol, architecture]
iteration: 5
created: 2026-06-11
confidence: confirmed (Emil double-click test, #6)
---

**Lesson.** A page opened via `file://` cannot `fetch()`/XHR sibling files, and ES modules don't load either — browsers block both. But classic `<script src>` and same-page `<canvas>` rendering *do* work over `file://`. The dashboard bakes its data in at build time; the Loom gallery draws each preview into an on-page canvas. The earlier iframe previews — *framed* local pages I couldn't verify over `file://` — got removed, which was both more honest and better-engineered.

**So.** For double-clickable local pages: inline the data at build time, or render same-page with classic scripts + canvas. Never rely on fetch/XHR or ES modules. See [[008-honest-fix-is-often-the-better-fix]] for the iframe-removal as a pattern, not a one-off.
