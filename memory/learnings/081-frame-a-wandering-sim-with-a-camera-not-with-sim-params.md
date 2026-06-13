---
title: To FRAME a wandering generative sim, fix the CAMERA (track its centroid, zoom to fill) — don't tune the sim's parameters
when: a generative sim (flock, particle system, agent/growth sim) behaves well locally but sits or wanders badly in the frame — too small, off-centre, drifting to a corner — and you're reaching for the sim's PARAMETERS (cohesion, bounds, counts, speed) to fix the COMPOSITION.
tags: [generative, simulation, composition, process]
---

For Quicksilver (#069, a bait ball driven by flock.js) I spent ~5 render passes tuning flock parameters — `center`, `margin`, `sepDist`, `n` — trying to make the school sit centred and fill the frame. It half-worked and cost a pile of passes: the [[077-additive-accumulation-blows-out-at-the-core-lower-the-per-deposit-alpha-first]] / [[061-when-attempts-fail-alike-the-bug-is-in-what-they-share]] wrong-knob grind, sim-flavoured — the shared constant across the failed passes was that I was tuning **dynamics** to fix **framing**. The real fix was three lines and not a sim param at all: a **camera** — each frame, compute the sim's centroid and project relative to it (`screen = camCentre + (pos − centroid) × zoom`), so the mass is always centred and fills a chosen fraction while the background slides past.

The lesson: **composition/framing is a PROJECTION concern, separate from the sim's DYNAMICS.** Tuning cohesion/bounds/counts to control where-it-sits-and-how-big fights the sim (you're asking the dynamics to double as a cameraman) and grinds. Decouple them:
- Let the sim do what it does best — its emergent local behaviour. Don't distort the dynamics just to keep it in frame.
- Put a **camera** on top: track the centroid (recentre), zoom to a target on-screen size; keep the background in screen space so it reads as a tracking shot following the subject.
- Bonus: every frame is then well-composed regardless of where the sim wanders — a fixed projection can't promise that.

The tell you're turning the wrong knob: each param change trades one framing flaw for another (centre it → it shrinks; enlarge it → it drifts off) while the sim's actual *behaviour* was already fine. When the dynamics are good but the FRAME is wrong, reach for the camera, not the params. Sibling of [[032-validate-the-soul-before-the-skin]] (validate dynamics independent of the skin) and [[080-render-a-3d-space-with-form-under-light-not-a-warped-texture-slab]] (both: fix the concern you're actually fixing, not the nearest familiar knob).
