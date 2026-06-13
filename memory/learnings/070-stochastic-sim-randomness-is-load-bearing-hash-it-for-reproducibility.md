---
title: In a stochastic emergent sim, the randomness is load-bearing — for a reproducible progressive render, HASH it (don't delete it, don't rng it)
when: building an emergent agent/particle sim (flocking, slime mould / Physarum, growth, diffusion-with-jitter) that you render PROGRESSIVELY over animation frames so it never blocks ([[029-heavy-renders-should-be-progressive]]). Two opposite traps lie in wait around the per-step randomness.
tags: [generative, technique, reproducibility]
---

Building Physarum (#054, slime-mould networks) I hit both traps in sequence:

**Trap 1 — deleting the randomness to "make it deterministic."** The classic agent rule turns *randomly* when the trail ahead is weakest. I removed that (just "turn toward the stronger side") so the per-frame step would be rng-free and reproducible. The network **collapsed into a few fat mega-trunks** — no fine branching. The lesson under the lesson: *the randomness was not noise, it was the **exploration** that creates the structure.* In an emergent system, stochastic wandering is usually load-bearing — kill it and every agent piles onto the first strong attractor; the emergence dies. Don't delete it.

**Trap 2 — keeping rng/`Math.random`/time in the per-step loop.** The obvious fix (put the coin-flip back with rng) **breaks reproducibility of a progressive render**: the settled image now depends on *how many steps ran per frame*, which depends on wall-clock timing and the machine. Same seed, different picture. ([[017-animation-seed-setup-once]] says keep rng in `draw()` and frames rng-free — but here the frame genuinely *needs* randomness.)

**The fix — a deterministic hash of (entity, step).** Replace the per-step coin-flip with `hash(agentIndex, stepCount)` — a pure function (e.g. `frac(sin(i*12.9898 + s*78.233)*43758.5453)`). It's *random-looking* (so exploration is preserved and the network branches) yet a *pure function of the simulation state* (so the settled result is identical no matter how the growth is sliced across frames). Best of both: emergent structure AND seed-reproducibility. This is the refinement of 017 for the case where a frame can't be rng-free.

Corollary tuning note from the same build: filament thickness is set by **diffusion strength** — a full box-blur every step smears trails into fat tubes; blending only ~20% toward the blurred field keeps them thin and crisp. And validate the *dynamics* (does a real network form?) before tuning colour — same as proving the flock as bare dots first ([[032-validate-the-soul-before-the-skin]]).
