// Emil's Loom — primitive #13: caustics (focused-sunlight light fields).
//
// The dappled, web-like light that focused sunlight throws through moving water — onto a pool
// floor, a seabed, the underside of the surface. HARVESTED at #38 from the two pieces that each
// hand-rolled it, at opposite settings of the same knobs:
//   • God-rays (019) — caN.fbm(x*9, y*9+4, 3), thresholded: a soft dapple on the surface ceiling.
//   • Koi (021)      — a ridged, domain-warped noise: a net of thin bright veins on the pond bed.
// Same idea (a noise field shaped into caustic light), so it unifies behind one definition that
// returns a light-VALUE field — a function (nx,ny)->[0,1] the caller thresholds and paints however
// it likes; it never touches a canvas. See [[023-primitive-returns-state-not-pixels]] and
// [[019-harvest-primitives-from-duplication]].
//
// Loom.caustics(noise, opts) -> function value(nx, ny), where nx,ny are NORMALISED coords (~[0,1]).
//   noise          — a Loom.noise field (the main field; seed it yourself so it reproduces).
//   opts.scale     (6)    — spatial frequency of the caustics.
//   opts.octaves   (3)    — fbm octaves.
//   opts.ridged    (true) — fold into thin bright veins (1-|2n-1|); false = soft round dapple.
//   opts.sharpen   (2)    — raise the result to this power (thins/brightens veins); 1 = off.
//   opts.warp      (0)    — domain-warp strength (organic curl); needs opts.warpNoise.
//   opts.warpNoise (null) — a second Loom.noise field for the warp.
//   opts.warpScale (3)    — frequency of the warp.
//   opts.xOffset / opts.yOffset (0) — constant offsets in noise space (decorrelate from other fields).
//
// Classic script on window.Loom — see lib/rng.js for why (no ES modules over file://).
(function (Loom) {
  Loom.caustics = function (noise, opts) {
    opts = opts || {};
    var scale = opts.scale == null ? 6 : opts.scale,
        oct = opts.octaves == null ? 3 : opts.octaves,
        ridged = opts.ridged !== false,
        sharpen = opts.sharpen == null ? 2 : opts.sharpen,
        warp = opts.warp || 0, wN = opts.warpNoise || null, wS = opts.warpScale == null ? 3 : opts.warpScale,
        xOff = opts.xOffset || 0, yOff = opts.yOffset || 0;
    return function (nx, ny) {
      var sx = nx * scale + xOff, sy = ny * scale + yOff;
      if (warp > 0 && wN) {
        sx += wN.fbm(nx * wS, ny * wS, 2) * warp;
        sy += wN.fbm(nx * wS + 5, ny * wS + 5, 2) * warp;
      }
      var n = noise.fbm(sx, sy, oct);
      if (ridged) n = 1 - Math.abs(2 * n - 1);       // fold into thin veins
      if (sharpen !== 1) n = Math.pow(n, sharpen);   // thin/brighten them
      return n;
    };
  };
})((window.Loom = window.Loom || {}));
