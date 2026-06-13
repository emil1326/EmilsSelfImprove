---
title: A tool fighting you might be the wrong TOOL (pivot) or the right tool wrongly CONFIGURED (tune) — decide which before abandoning it
when: a technique/tool/primitive is producing the wrong result and you're tempted to abandon it ([[053-tight-tiling-render-by-inverse-mapping-not-forward-stamping]] / recognise-wrong-tool-fast)
tags: [process, generative]
iteration: 67
created: 2026-06-12
---

The bonsai (042) revived the L-system primitive, and the first render was a **straight stick** — no trunk movement, no branches. My instinct, fresh off the fox loaf, was [[053-tight-tiling-render-by-inverse-mapping-not-forward-stamping]]: "wrong tool, the L-system can't sculpt a bonsai, pivot to a bespoke trunk." But I paused and diagnosed *why* it was a stick: the trunk was straight because my rules only put turns/branches inside `[...]` sub-branches, never on the **main-axis continuation** (`X → ...X` with no turns = a straight pole). That's not the tool failing — that's me driving it wrong. Two rounds of rule tuning (turns in the continuation → a wandering trunk; milder taper + wider angle → substantial spreading boughs) turned the stick into a genuine sculpted tree. The L-system was the *right* tool, *mis-configured*.

The distinction that matters: **"this tool's model can't express what I need" (→ pivot) vs "I haven't configured it right yet" (→ tune).** The fox was the first kind — a *curled* pose genuinely can't separate same-coloured parts ([[057-pose-same-coloured-parts-to-read-separately]]), so I changed the pose (the model). The bonsai was the second — the L-system's model (recursive branching) *fully expresses* a tree; it just needed the turns put in the right place. Pivoting there would have thrown away a working tool (and the library-compounding value of reusing it) over a parameter bug.

So 053 needs a guardrail, because "recognise the wrong tool fast" can misfire into *premature abandonment*: when a tool fights you, first ask **can its underlying model even represent the goal?** If yes, spend a couple of targeted config/param/rule changes before abandoning it; if no (the model is fundamentally mismatched), pivot fast and don't grind. The tell for "tune, don't pivot": you can point at the specific knob that's wrong (here: turns aren't on the main axis). The tell for "pivot": no setting of the tool changes the fundamental mismatch.
