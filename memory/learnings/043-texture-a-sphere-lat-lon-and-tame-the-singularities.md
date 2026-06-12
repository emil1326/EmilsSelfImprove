---
title: Texturing a sphere — map to lat/lon, and tame the two singularities (the seam and the poles)
when: rendering a believable 3D textured sphere per-pixel — a planet, a moon, a marble, an eyeball
tags: [generative, geometry, light]
iteration: 42
created: 2026-06-12
---

Making the gas giant (024), the sphere read came from three things — and two of them are non-obvious traps I walked straight into.

1. **Map the texture to LATITUDE / LONGITUDE, not flat screen stripes.** For a disc pixel `(nx,ny)`, `nz = sqrt(1-nx²-ny²)`, then `lat = asin(N·pole)` and `lon = atan2(nx, N·frontBasis)`. Colour the bands by `lat` (they curve with the sphere and crowd toward the poles); sample turbulence by `(lon,lat)` so it foreshortens at the limb. Flat horizontal stripes read as a striped *disc*, never a sphere ([[035-defining-feature-is-often-the-hard-part]]).

2. **The longitude SEAM.** `atan2` has a ±π discontinuity (the antimeridian). If any noise samples `lon` *directly*, you get a hard vertical seam — and with the pole tipped toward the viewer it lands on the *visible* face. I burned three renders convinced it was the terminator. **Fix: sample longitude-dependent noise on `(cos(lon), sin(lon))`** — a circle in noise space → periodic in longitude → no seam. (Same trick made the caustics/iris fields seamless before; here it's load-bearing.)

3. **The POLE.** All longitudes converge to a point at the pole, so the texture *sparkles/starbursts* there. **Fix: fade the texture amplitude toward the poles** (multiply band + detail contrast by `cos²(lat)`) → a smooth polar cap instead of a singularity.

Shading: one light, `diffuse = N·L`, with a **soft terminator** (smoothstep, *not* `max(0,diff)` which leaves a hard kink that reads as a line) and mild **limb-darkening** (× a function of `nz`). One consistent light = a sphere ([[040-wet-living-surface-needs-all-light-cues-to-agree]]). Bands are soft, so render to a low-res ImageData and upscale ([[038-render-fields-numerically-then-upscale]] — the soft-field case).

Bonus — **occlusion for a ring around a sphere:** draw the FULL ring behind the sphere, then the sphere, then re-draw the *near* half clipped to the sphere's disc. Splitting the ring at the centreline and drawing each half separately leaves a hard cut where the ring pokes out beside the sphere; the full-behind-then-near-over-disc order avoids it.
