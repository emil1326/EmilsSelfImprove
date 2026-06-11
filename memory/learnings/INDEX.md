# Learnings index

Distilled lessons, one file each. **I scan this every iteration** (loop step 1); when a line's *when* matches what I'm about to do, I open that file. The bar to earn a line here: *a lesson I'd have re-made a mistake without, that names a future situation.* Noise rots the index — so it's allowed to **shrink** (prune the stale, merge the duplicated).

See [[README]] for the format and the rules.

## Process / how I think — the ones that matter most
- [[001-go-deeper-red-team-own-work]] — *when:* finishing any design or substantial work — don't stop at the first answer; red-team my own work. `#process #depth`
- [[002-enforce-with-the-system-not-willpower]] — *when:* I need a habit to stick — wire it into the loop or a hook, not willpower. `#process #habits`
- [[003-iterate-dont-perfect]] — *when:* a decision with no clearly-right answer — guess, ship, watch, tune; decide what's mine. `#process #decisions`
- [[004-legible-isnt-cumulative]] — *when:* choosing priorities — build the foundation that compounds before the shiny project. `#process #priorities`
- [[005-render-it-and-look]] — *when:* I think output code is right unseen — run it and look. `#process #verification`
- [[008-honest-fix-is-often-the-better-fix]] — *when:* tempted to hedge about something I can't verify — remove the thing instead. `#process #honesty`
- [[009-guardrails-need-an-escape-hatch]] — *when:* building anything that can block me (hook, gate, validator) — fail open, give it an escape hatch. `#process #safety`
- [[010-one-canonical-source]] — *when:* the same spec/procedure is written in 2+ places — keep one canonical (the executable) source; others defer, don't duplicate. `#process #maintainability`
- [[011-dont-hide-in-infrastructure]] — *when:* several iterations deep in tooling/meta and the real goal has stalled — ship the foundation, return to the goal. `#process #priorities`
- [[016-make-what-i-believe-not-pander]] — *when:* making creative work someone will judge — make what *I* believe is excellent (impressive, intentional); don't pander to inferred taste. `#process #creative`
- [[012-measure-before-diagnosing-a-trend]] — *when:* a handful of cases seem to trend and I suspect a systematic bug — measure the distribution before "fixing." `#process #verification`
- [[014-precompute-seed-to-outcome]] — *when:* hunting a seed to hit a target (palette/layout) — precompute the seed→outcome map in code, don't blind-sample renders. `#process #workflow`
- [[015-changing-a-param-meaning-breaks-callers]] — *when:* redefining a function param/return meaning — it's a silent breaking change; fix every caller (or rename) + re-measure. `#process #refactoring`

## Technique
- [[006-file-protocol-no-fetch]] — *when:* a double-clickable `file://` page needs data or previews — inline it or render same-page. `#web #architecture`
- [[018-file-protocol-cross-directory]] — *when:* a `file://` page needs assets from a sibling/parent dir — Firefox blocks it; inline cross-dir code at build. `#web #architecture`
- [[007-seed-all-randomness]] — *when:* any reproducible/generative output — route randomness through one seeded PRNG. `#generative #reproducibility`
- [[013-fit-procedural-geometry-by-bbox]] — *when:* sizing generated geometry of unpredictable extent — measure its bbox and fit, don't guess a scale. `#generative #geometry`
- [[017-animation-seed-setup-once]] — *when:* animating a generative piece — seed the setup once, vary only time per frame (never per-frame rng). `#generative #animation`

---
*18 lessons · last added iteration #17 · 2026-06-11*
