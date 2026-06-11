// Emil's Loom — primitive #11: colour ramps (a scalar in [0,1] → a colour along a
// multi-stop gradient).
//
// HARVESTED at #30 from three pieces that each hand-rolled the exact same multi-stop
// ramp, just with different output shapes:
//   • Strata (003) rampAt(f)    → numeric [r,g,b], to precompute a few band colours
//   • Current (014) rampColor(f)→ a "rgb(...)" string, for strokeStyle per thread
//   • Turing (016) rampRGB(t,o) → numeric written into a reused array, per ImageData pixel
// Same idea, two shapes. This unifies them behind one definition. It returns colour DATA
// (numeric rgb, or a css string the caller assigns) and never touches a canvas itself —
// the caller decides what to paint with it. See [[023-primitive-returns-state-not-pixels]]
// and [[019-harvest-primitives-from-duplication]].
//
// Classic script on window.Loom — see lib/rng.js for why (no ES modules over file://).
(function (Loom) {
  // stops: an array of hex strings ("#rgb" or "#rrggbb"). t in [0,1] is mapped linearly
  // across them: 0 → first stop, 1 → last stop, evenly spaced between.
  Loom.ramp = function (stops) {
    var cs = stops.map(Loom.hexToRgb);   // parse the hex stops once, up front
    var n = cs.length - 1;               // number of segments

    // Core: clamp t, find its segment, write the interpolated channels (UNROUNDED floats —
    // ImageData/Uint8ClampedArray truncates, and the harvested code left them unrounded so
    // this stays pixel-identical) into `out` [r,g,b]. Pass `out` to avoid allocating in a
    // per-pixel loop; omit it and a fresh array is returned (handy for precomputing).
    function at(t, out) {
      out = out || [0, 0, 0];
      if (t < 0) t = 0; else if (t > 1) t = 1;
      if (n <= 0) { out[0] = cs[0].r; out[1] = cs[0].g; out[2] = cs[0].b; return out; }
      var p = t * n, seg = p | 0;        // p >= 0 here, so |0 == Math.floor
      if (seg > n - 1) seg = n - 1;      // t == 1 lands in the last segment with f == 1
      var f = p - seg, a = cs[seg], b = cs[seg + 1];
      out[0] = a.r + (b.r - a.r) * f;
      out[1] = a.g + (b.g - a.g) * f;
      out[2] = a.b + (b.b - a.b) * f;
      return out;
    }

    var TMP = [0, 0, 0];                 // scratch for css(), read synchronously

    return {
      stops: cs,
      rgb: at,                           // (t, out?) → [r,g,b] floats
      // (t) → "rgb(r,g,b)" string for fillStyle/strokeStyle (rounded, matching Loom.mix).
      css: function (t) {
        var o = at(t, TMP);
        return "rgb(" + (o[0] + 0.5 | 0) + "," + (o[1] + 0.5 | 0) + "," + (o[2] + 0.5 | 0) + ")";
      }
    };
  };
})((window.Loom = window.Loom || {}));
