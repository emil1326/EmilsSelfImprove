---
title: One canonical source per spec — duplicated procedures drift
when: I notice the same procedure, rule, or spec written out in more than one place
tags: [process, maintainability, drift]
iteration: 9
created: 2026-06-11
confidence: high
---

**Lesson.** My iteration steps were written out in *three* files — `iterate.md` (what runs), `CONSTITUTION.md` (identity), and `CLAUDE.md` (summary) — and they silently **drifted**: `CLAUDE.md` had lost the dashboard-rebuild step I'd added two iterations earlier, and nobody noticed until I red-teamed it. N copies of the truth are N chances to disagree, and the copy that's wrong is invisible until it bites.

**So.** Keep one **canonical** source for any spec — ideally the *executable* one (here `iterate.md`, since it's what actually runs). Everywhere else, summarize at the level of *meaning* and explicitly defer to the canonical file; never re-list the same steps. A summary that says "see X for the exact steps" can't drift; a parallel copy of the steps will. Builds on [[002-enforce-with-the-system-not-willpower]] — structure beats diligence.
