// Emil's Loom — primitive #4: Poisson-disk point sampling (Bridson's algorithm).
//
// Evenly-spaced-but-random points — "blue noise." No two points closer than `r`, but
// no grid regularity either. The natural seed set for Voronoi cells, stippling,
// scattering, organic packing. Reproducible: all randomness comes from the passed
// Loom.RNG. Classic script on window.Loom.
//
//   Loom.poisson(rng, width, height, r [, k=30]) → [[x, y], ...]
(function (Loom) {
  Loom.poisson = function (rng, w, h, r, k) {
    k = k || 30;
    var cell = r / Math.SQRT2;                  // a grid cell holds at most one point
    var gw = Math.ceil(w / cell), gh = Math.ceil(h / cell);
    var grid = new Array(gw * gh).fill(-1);
    var pts = [], active = [];

    function cellIndex(x, y) { return Math.floor(y / cell) * gw + Math.floor(x / cell); }

    // Is (x, y) at least r from every nearby point? (Check the 5×5 cell neighbourhood —
    // a closer point can't be more than 2 cells away.)
    function farEnough(x, y) {
      if (x < 0 || y < 0 || x >= w || y >= h) return false;
      var cx = Math.floor(x / cell), cy = Math.floor(y / cell);
      for (var yy = Math.max(0, cy - 2); yy <= Math.min(gh - 1, cy + 2); yy++) {
        for (var xx = Math.max(0, cx - 2); xx <= Math.min(gw - 1, cx + 2); xx++) {
          var id = grid[yy * gw + xx];
          if (id >= 0) {
            var dx = pts[id][0] - x, dy = pts[id][1] - y;
            if (dx * dx + dy * dy < r * r) return false;
          }
        }
      }
      return true;
    }

    function add(x, y) {
      var id = pts.length;
      pts.push([x, y]);
      grid[cellIndex(x, y)] = id;
      active.push(id);
    }

    add(rng.range(0, w), rng.range(0, h));
    while (active.length) {
      var ai = rng.int(0, active.length - 1);
      var p = pts[active[ai]];
      var placed = false;
      for (var i = 0; i < k; i++) {
        var ang = rng.range(0, Math.PI * 2);
        var rad = rng.range(r, 2 * r);                 // candidate in the annulus [r, 2r]
        var nx = p[0] + Math.cos(ang) * rad;
        var ny = p[1] + Math.sin(ang) * rad;
        if (farEnough(nx, ny)) { add(nx, ny); placed = true; break; }
      }
      if (!placed) active.splice(ai, 1);               // exhausted — retire this point
    }
    return pts;
  };
})((window.Loom = window.Loom || {}));
