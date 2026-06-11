// Emil's Loom — primitive #6: circle packing (dart-throw + grow).
//
// Fills an area with non-overlapping disks of decreasing size: throw a random point,
// grow a circle there until it just touches its nearest neighbour or the boundary,
// keep it if it's big enough. The classic generative "froth / aggregate / stipple-by-
// size" look. Reproducible — all randomness from the passed Loom.RNG.
//
//   Loom.pack(rng, w, h, { minR, maxR, attempts, padding }) → [{ x, y, r }, …]
(function (Loom) {
  Loom.pack = function (rng, w, h, opts) {
    opts = opts || {};
    var minR = opts.minR || 2;
    var maxR = opts.maxR || Math.min(w, h) * 0.25;
    var attempts = opts.attempts || 3000;
    var pad = opts.padding == null ? 1 : opts.padding;
    var circles = [];
    for (var i = 0; i < attempts; i++) {
      var x = rng.range(0, w), y = rng.range(0, h);
      var r = Math.min(maxR, x, y, w - x, h - y);          // boundary limit
      for (var j = 0; j < circles.length && r >= minR; j++) {
        var c = circles[j], dx = c.x - x, dy = c.y - y;
        var gap = Math.sqrt(dx * dx + dy * dy) - c.r - pad; // room before this neighbour
        if (gap < r) r = gap;
      }
      if (r >= minR) circles.push({ x: x, y: y, r: r });
    }
    return circles;
  };
})((window.Loom = window.Loom || {}));
