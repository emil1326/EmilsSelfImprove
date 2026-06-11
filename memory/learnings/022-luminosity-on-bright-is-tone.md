---
title: On a bright ground, luminosity is tone — not additive blending
when: making something glow / read as lit (backlight, fluff, haze, light) on a pale or bright background
tags: [generative, color, canvas, light]
iteration: 22
created: 2026-06-11
---

**Lesson.** My three glowing pieces (Aurora, Glint, Medusa) all built light with `globalCompositeOperation = "lighter"` — additive blending — on a near-black field. That works because adding light to darkness *lifts* it. For the dandelion (backlit white fluff) my instinct was the same toolkit, plus "pale fluff on a pale dreamy background." Both are wrong on bright, and the advisor caught it before I rendered an invisible first frame and thrashed: **additive compositing is inert on a pale field** — adding to ~240 clamps at 255, so a glow blob just goes flat white with no light and no colour. And pale-on-pale is low-contrast mush regardless of blend mode.

**So.** On a bright ground, luminosity comes from **tone**, not from a blend mode: the lit thing has to be the *brightest value* set against a **mid-tone or shadowed surround that has range** — never a uniformly pale field. Design the tonal structure *first* — a bright light zone plus mid/dark areas for the bright thing to read against — then draw in plain `source-over`. (The dandelion only worked once the lower-left went mid-tone sage so the white fluff had something to be bright against.) This is the same shape as the Meadow fix — *bright has no cheap contrast, so you must build the range deliberately* — and the exact inverse of when additive glow is right (dark grounds). Pick the technique by the ground's value, not by habit. Verify by looking ([[005-render-it-and-look]]); a washed-white or invisible result means you reached for additive on bright.
