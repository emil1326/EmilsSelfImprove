// Emil's Loom — drift (primitive #9): an ambient field of drifting particles.
//
// Marine snow, pollen, dust, embers, snow — a field of little things wandering across the
// frame on a slow current. Medusa's motes and Meadow's pollen had grown the exact same
// idiom independently (seeded particles, a linear drift wrapped at the edges, a sine sway
// across it, parallax by size), so it earned a place in the library (lesson 019). Clock's
// seeds are deliberately NOT this — they're a directional emitter with a lifecycle, a
// different animal; forcing them in here would be the over-fit 021 warns about.
//
// It returns STATE, never pixels: each particle gives its position at a time t plus its
// size/alpha/flags, and the caller draws it however it likes (a glow, a dot, a tuft) —
// because the three pieces render the same motion completely differently.
//
// Reproducible (all randomness from the passed Loom.RNG) and time-pure: pos(t) is a
// function of t only, so it animates per [[017-animation-seed-setup-once]]. Classic script
// on window.Loom.
(function (Loom) {
  var TAU = Math.PI * 2;

  // Loom.drift(rng, w, h, opts) → [ { r, a, bright, pos(t) → {x,y} }, … ]
  //   count                 how many particles                       (default 40)
  //   rMin, rMax            size range                               (default 1 … 3)
  //   aMin, aMax            alpha range (the caller may ignore it)   (default 0.1 … 0.3)
  //   dir                   drift direction, radians (PI/2 = down)   (default down)
  //   speedMin, speedMax    px/sec along dir                         (default 4 … 10)
  //   speedBySize           bigger drifts faster (parallax)          (default false)
  //   sway                  max sway amplitude ACROSS the drift, px  (default 8)
  //   swayRate              radians/sec of the sway                  (default 0.4)
  //   brightFrac            fraction flagged `bright` for the caller (default 0)
  Loom.drift = function (rng, w, h, opts) {
    opts = opts || {};
    var count = opts.count == null ? 40 : opts.count;
    var rMin = opts.rMin == null ? 1 : opts.rMin;
    var rMax = opts.rMax == null ? 3 : opts.rMax;
    var aMin = opts.aMin == null ? 0.1 : opts.aMin;
    var aMax = opts.aMax == null ? 0.3 : opts.aMax;
    var dir = opts.dir == null ? Math.PI / 2 : opts.dir;
    var spMin = opts.speedMin == null ? 4 : opts.speedMin;
    var spMax = opts.speedMax == null ? 10 : opts.speedMax;
    var bySize = !!opts.speedBySize;
    var swayMax = opts.sway == null ? 8 : opts.sway;
    var swayRate = opts.swayRate == null ? 0.4 : opts.swayRate;
    var brightFrac = opts.brightFrac == null ? 0 : opts.brightFrac;

    var cos = Math.cos(dir), sin = Math.sin(dir);
    var perpX = -sin, perpY = cos;                 // unit vector across the drift, for the sway

    function makePos(p) {
      return function (t) {
        // linear drift along dir, wrapped into the box (handles negative dir cleanly)
        var x = (((p.x0 + cos * p.spd * t) % w) + w) % w;
        var y = (((p.y0 + sin * p.spd * t) % h) + h) % h;
        var s = Math.sin(t * swayRate + p.phase) * p.sway;
        return { x: x + perpX * s, y: y + perpY * s };
      };
    }

    var out = [];
    for (var i = 0; i < count; i++) {
      var r = rng.range(rMin, rMax);
      var p = {
        r: r,
        a: rng.range(aMin, aMax),
        bright: rng.bool(brightFrac),
        x0: rng.range(0, w),
        y0: rng.range(0, h),
        spd: rng.range(spMin, spMax) * (bySize ? r / rMax : 1),
        sway: rng.range(0.3, 1) * swayMax,
        phase: rng.range(0, TAU)
      };
      p.pos = makePos(p);
      out.push(p);
    }
    return out;
  };
})((window.Loom = window.Loom || {}));
