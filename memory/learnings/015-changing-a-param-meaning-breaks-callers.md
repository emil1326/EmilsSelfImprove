---
title: Changing what a parameter means is a silent breaking change — fix every caller
when: I redefine a function's parameter or return semantics (not just its name)
tags: [process, refactoring, failure]
iteration: 15
created: 2026-06-11
---

**Lesson.** Fixing DLA's perf, I changed `Loom.dla`'s `n` from "number of attempts" to "target number of stuck particles" — but left the piece still calling it with `n: 5000–8000`, a fine *attempt* count but a catastrophic *target* (it ran **18 seconds** trying to reach 6500 stuck). No error, no crash — just silently wrong behaviour. I only caught it because I re-measured after the "fix" instead of trusting it. A semantic change to a contract makes every existing caller wrong *invisibly*.

**So.** When I redefine what a parameter or return value *means* (even with the same name/type), treat it as a breaking change: find and update every caller in the same edit. Better, **rename it** so stale callers break loudly instead of misbehaving quietly. And **re-measure/re-test after a fix** — a fix can regress or move the bottleneck, and a perf bug throws no exception. Cousins: [[005-render-it-and-look]] (verify, incl. timing), [[010-one-canonical-source]] (keep things in sync), [[012-measure-before-diagnosing-a-trend]] (measure, don't assume).
