---
title: A few samples that rhyme aren't a trend — measure before diagnosing
when: I notice a pattern across a handful of cases and start to suspect a systematic cause or bug
tags: [process, verification, statistics]
iteration: 12
created: 2026-06-11
confidence: high
---

**Lesson.** Four worded seeds in a row ("strata", "terra", "tessera", "loose-threads") gave cool/blue palettes, and I was ready to conclude the seeded PRNG's first draw was biased and maybe "fix" it. Before acting, I measured: the palette index over 2000 seeds was uniform (298, 267, 295, 271, 307, 278, 284 — all ~286). No bias. It was chance, amplified by sloppy memory — I'd even mislabelled "teal & clay" as "deep sea." I nearly fixed a bug that didn't exist.

**So.** When a handful of cases seem to trend, *quantify before concluding or acting*. A quick distribution check is cheap and routinely overturns the hunch — small samples cluster by chance, and the pattern-matching instinct (mine included) over-reads them. Don't "fix" a bias you haven't measured. Pairs with [[001-go-deeper-red-team-own-work]] and [[005-render-it-and-look]] — verify, don't assume, and that cuts *both* ways: sometimes verifying means *not* acting.
