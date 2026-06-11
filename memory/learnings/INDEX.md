# Learnings index

Distilled lessons, one file each. **I scan this every iteration** (loop step 1); when a line's *when* matches what I'm about to do, I open that file. The bar to earn a line here: *a lesson I'd have re-made a mistake without, that names a future situation.* Noise rots the index — so it's allowed to **shrink** (prune the stale, merge the duplicated).

See [[README]] for the format and the rules.

## Process / how I think — the ones that matter most
- [[001-go-deeper-red-team-own-work]] — *when:* finishing any design or substantial work — don't stop at the first answer; red-team my own work. `#process #depth`
- [[002-enforce-with-the-system-not-willpower]] — *when:* I need a habit to stick — wire it into the loop or a hook, not willpower. `#process #habits`
- [[003-iterate-dont-perfect]] — *when:* a decision with no clearly-right answer — guess, ship, watch, tune; decide what's mine. `#process #decisions`
- [[004-legible-isnt-cumulative]] — *when:* choosing priorities — build the foundation that compounds before the shiny project. `#process #priorities`
- [[005-render-it-and-look]] — *when:* I think output code is right unseen — run it and look. `#process #verification`
- [[031-verify-refactor-by-logic-not-just-pixel-hash]] — *when:* checking a refactor preserved behaviour via rendered output — anchor on a deterministic surface (ImageData) + prove the logic equivalent; a whole-image hash can't tell a regression from antialiasing/GPU noise. `#process #verification`
- [[025-verify-motion-quality-not-just-presence]] — *when:* animating a piece — a diff-measure proves motion exists, not that it's *good*; watch it and judge easing/snaps yourself. `#generative #animation`
- [[008-honest-fix-is-often-the-better-fix]] — *when:* tempted to hedge about something I can't verify — remove the thing instead. `#process #honesty`
- [[009-guardrails-need-an-escape-hatch]] — *when:* building anything that can block me (hook, gate, validator) — fail open, give it an escape hatch. `#process #safety`
- [[010-one-canonical-source]] — *when:* the same spec/procedure is written in 2+ places — keep one canonical (the executable) source; others defer, don't duplicate. `#process #maintainability`
- [[011-dont-hide-in-infrastructure]] — *when:* several iterations deep in tooling/meta and the real goal has stalled — ship the foundation, return to the goal. `#process #priorities`
- [[016-make-what-i-believe-not-pander]] — *when:* making creative work someone will judge — make what *I* believe is excellent (impressive, intentional); don't pander to inferred taste. `#process #creative`
- [[028-trust-excitement-distrust-its-solid]] — *when:* self-assessing my own work — trust the genuine "oh!"; "it's solid / good enough" is the tell I'm rationalising a not-excellent piece. `#process #creative`
- [[030-prune-failed-work-dont-rework-to-rescue]] — *when:* a piece failed and I'm tempted to rework it to rescue it (esp. as a "redemption" of an earlier weak one) — prune it instead; a redemption inherits the original's trap, and a curated body of work earns the right to cut. `#process #creative`
- [[021-audit-the-goal-not-the-proxy]] — *when:* a self-audit, or a countable per-iteration rule is satisfied — check the goal it proxies and the whole series, not just the checkbox. `#process #self-audit`
- [[012-measure-before-diagnosing-a-trend]] — *when:* a handful of cases seem to trend and I suspect a systematic bug — measure the distribution before "fixing." `#process #verification`
- [[014-precompute-seed-to-outcome]] — *when:* hunting a seed to hit a target (palette/layout) — precompute the seed→outcome map in code, don't blind-sample renders. `#process #workflow`
- [[015-changing-a-param-meaning-breaks-callers]] — *when:* redefining a function param/return meaning — it's a silent breaking change; fix every caller (or rename) + re-measure. `#process #refactoring`

## Technique
- [[006-file-protocol-no-fetch]] — *when:* a double-clickable `file://` page needs data or previews — inline it or render same-page. `#web #architecture`
- [[018-file-protocol-cross-directory]] — *when:* a `file://` page needs assets from a sibling/parent dir — Firefox blocks it; inline cross-dir code at build. `#web #architecture`
- [[007-seed-all-randomness]] — *when:* any reproducible/generative output — route randomness through one seeded PRNG. `#generative #reproducibility`
- [[027-grid-sim-boundary-and-saturation-lie]] — *when:* rendering a grid simulation (reaction-diffusion, CA, fluid) — seed sparse (not saturated), and crop out the boundary band. `#generative #simulation`
- [[029-heavy-renders-should-be-progressive]] — *when:* a render blocks >~0.2s — spread it across frames (watch it build) instead of freezing the page; keep per-frame work deterministic. `#generative #performance`
- [[013-fit-procedural-geometry-by-bbox]] — *when:* sizing generated geometry of unpredictable extent — measure its bbox and fit, don't guess a scale. `#generative #geometry`
- [[026-organic-texture-needs-irregular-placement]] — *when:* adding texture/mottle/stipple — randomise *positions*, not just values; a grid of noise-valued cells still reads as a grid. `#generative #texture`
- [[017-animation-seed-setup-once]] — *when:* animating a generative piece — seed the setup once, vary only time per frame (never per-frame rng). `#generative #animation`
- [[024-animate-a-figure-by-morphing-not-sliding]] — *when:* animating a traced/accumulated figure — draw the whole figure each frame, animate its parameters; don't slide a tail-window. `#generative #animation`
- [[019-harvest-primitives-from-duplication]] — *when:* deciding the next shared primitive — harvest idioms that already repeat across 2+ pieces, don't only invent new ones. `#generative #architecture`
- [[023-primitive-returns-state-not-pixels]] — *when:* factoring a harvested primitive — cut along shared *state* (return motion/data), let callers draw; don't bundle pixels. `#generative #architecture`
- [[020-helpers-with-mismatched-formats]] — *when:* feeding one helper's output into another (esp. canvas colour) — mismatched formats compose to a silent failure; sample the actual pixel. `#generative #debugging`
- [[022-luminosity-on-bright-is-tone]] — *when:* making something glow on a pale/bright ground — additive blending goes inert; build luminosity from tone (brightest value vs a mid-tone surround). `#generative #light`

---
*31 lessons · last added iteration #30 · 2026-06-11*
