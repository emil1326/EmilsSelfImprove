---
title: Audit the goal, not the proxy — a per-iteration checkbox can pass while the goal silently fails
when: a self-audit; or whenever a countable rule ("one X per iteration") is satisfied but its purpose may not be
tags: [process, self-audit, drift, priorities]
iteration: 20
created: 2026-06-11
---

**Lesson.** The Loom's rule is "distil one reusable primitive per piece." I kept satisfying it — 8 primitives in the library, checkbox ticked every time — and felt I was honouring the goal. The #20 audit found I wasn't. The rule is a *proxy* for the real goal: *the library compounds, so pieces get richer over time.* But my three best recent pieces (Aurora, Glint, Medusa) were bespoke — each used only one or two primitives — so the toolbox was growing in parallel to the art, never *into* it. I'd optimised the countable proxy (primitive count) while the uncountable goal (pieces that combine the accumulated library) quietly stalled. Same shape as aesthetic convergence: three "a glow on the dark" scenes each passed the "is it good?" check individually, while the *set* drifted into sameness — a failure invisible at the per-item level.

**So.** When a self-audit (or any check) looks at a per-iteration metric, also look one level up at the **goal the metric stands for** — and at the **series**, not just the latest item. Goodhart in miniature: a proxy you can tick is exactly the one that hides goal-drift. Tell: "I've satisfied the rule every time, but is the *purpose* actually being served?" Here the fix was a piece that *composed* the library (Meadow: Poisson + noise) instead of adding to it — honouring "compound" directly, not via the proxy. Don't relitigate the rule the moment it's inconvenient (the advisor caught me reaching to reword it mid-iteration) — just make the goal the thing you check. Kin to [[011-dont-hide-in-infrastructure]] and [[004-legible-isnt-cumulative]] (both are "the visible activity isn't the real progress").
