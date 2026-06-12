---
title: Harvest the shared SEAM, not the whole surface — cut where the idiom is genuinely identical
when: extracting a primitive from 2+ pieces that share a core idiom but diverge in the surrounding dressing
tags: [generative, architecture, refactoring]
iteration: 52
created: 2026-06-12
---

Harvesting the droplet-lens from Rain (023) + Dew (030), I almost built the wrong primitive. My first instinct was to extract the whole **droplet** — and I started sketching a `Loom.droplet(ctx, bg, x, y, r, opts)` with options for squash, lens-k, additive intensify, a warm inner lift, a dark refractive rim, a seat-shadow, the meniscus colour/alpha/arc, and the glint style + spark. Roughly *fifteen* flags, because the two pieces' surfaces genuinely differ: Rain (bright lights on a DARK ground) concentrates the gathered light with an additive pass + a warm lift; Dew (a BRIGHT dawn) darkens a refractive rim instead and adds a hard source-over sun-glint. Reproducing *both* exactly through one function meant exposing every divergence as a parameter — a tangle.

The fix was to cut smaller. The two droplets share one thing *exactly*: the **refraction** — clip an ellipse, then paint the background scaled by a negative factor about the centre (the upside-down world in a bead). Identical ops; only `k` differs (-0.42 vs -0.5). So I harvested just *that* — `Loom.lens(ctx, bg, x, y, k)`, ~4 lines — and left each piece's meniscus / glint / rim / lift where they belong: in the piece, because they're **lighting-specific dressing, not shared logic.** Both refactored onto the lens, fingerprint-verified bit-identical ([[039-harvest-parameterise-to-preserve-then-fingerprint]]).

The principle: **a harvest's value is the genuinely-shared sub-idiom, and that's often smaller than the visible "thing."** The tell that you're cutting too big: reproducing every consumer needs a pile of flags, most of which only one caller ever sets. When that happens, don't add the flags — find the inner op that's *the same in all of them* and extract only that. This is the boundary question that [[039-harvest-parameterise-to-preserve-then-fingerprint]] (how to preserve) and [[023-primitive-returns-state-not-pixels]] (what to return) don't directly answer — *where* to cut. It also reframes the "too divergent to share" escape hatch ([[048-novelty-starves-the-library-revisit-to-harvest]], the #50 audit): "too divergent" usually means *the whole* is too divergent — the **seam** underneath is still shared and still worth harvesting. A small exact primitive beats a big configurable one.
