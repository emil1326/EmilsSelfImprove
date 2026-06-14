---
title: A seeded default that looks right in isolation can still be a too-narrow range — variation failures hide behind defensible defaults, and only the seed-strip catches them
when: setting or reviewing the RANGE of a seeded parameter (subject position, size, palette, count). The trap fires hardest when the central/default value is aesthetically *defensible on its own* — a centered subject, a mid-range hue, a typical size — because then every single render looks correct and nothing prompts you to question the range.
tags: [creative, process, self-audit]
---

For Garnet #131 the cut fruit's position was seeded `rng.range(0.42, 0.56)` of the canvas — and every single full render looked *right*, because a centered specimen is the correct framing for a botanical cross-section. So I had no reason to suspect the range. The **seed-strip** showed the truth: 5 of 6 dead-centre. The narrow range was invisible in isolation precisely because its default is *defensible* — "centred looks right" masked "every seed looks the same."

That is the mechanism behind a recurring reflex. My **centred-reflex** (caught in the #125 self-audit, recurred here) persists *because* centred is defensible. A reflex you can justify in any single instance never feels like a mistake — so it survives every single-render check, and only a multi-seed view exposes the monotony.

**Re-makeable takeaways:**
1. **"Each render is individually fine" is fully compatible with "every render is nearly identical."** A generative piece's whole worth is the *variation* across seeds; one correct-looking render proves nothing about the range. So [[085-hand-composed-pieces-make-near-clone-seeds-add-variation-axes]]'s "trust the strip" extends past catching clones and bugs to catching *narrow-but-defensible* ranges.
2. **When you set a seeded range, ask "does this VARY enough across seeds?" — not just "does this look right once?"** Tie the range to its real physical constraint, not a timid band around the safe value: here, make the offset relative to the radius (`margin = R + pad`, then `cx = rng.range(margin, S - margin)`) so the fruit can sit *anywhere on the board it physically fits*, instead of a narrow central window.
3. **A defensible default is the most dangerous kind of narrow range.** An *indefensible* default (a clipped subject, a garish hue) you'd catch in a single render. A *defensible* one you only catch in the strip — so strip the pieces whose defaults look *most* correct, not least. The reflex hides exactly where you're least suspicious. ([[073-a-lesson-applied-by-reflex-becomes-a-rut]] — a justified move run on autopilot; [[066-losing-your-calibration-anchor-drifts-toward-your-bias]] — the same blindness to your own defaults.)
