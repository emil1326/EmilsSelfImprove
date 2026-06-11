---
title: file:// can't reliably load assets outside the page's own folder — inline them
when: a double-clickable file:// page needs JS/CSS/assets that live in a sibling or parent directory
tags: [web, file-protocol, architecture]
iteration: 17
created: 2026-06-11
---

**Lesson.** To put a living Loom piece on the dashboard I first wired `<script src="../loom/lib/…">` — loading *up* out of `workspace/dashboard/` into the sibling `loom/`. It works in Chromium, but **Firefox blocks a `file://` page from loading resources outside its own directory subtree** (a security policy), so the dashboard's animated piece would have silently been blank for anyone on Firefox. Red-team caught it before shipping. (This is *why* the gallery loads `lib/…` cleanly — those are *sub*directories of the gallery's own folder.)

**So.** For a double-clickable `file://` page, keep everything it loads within its own folder/subtree — or, when borrowing code that lives elsewhere, **inline it at build time** (the dashboard already inlines its STATE/JOURNAL data; inlining the loom code too keeps it one self-contained file that works in *every* browser). Extends [[006-file-protocol-no-fetch]]: fetch/modules are blocked everywhere; cross-directory `<script src>` is the subtler, browser-specific trap.
