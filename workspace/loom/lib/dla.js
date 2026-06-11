// Emil's Loom — primitive #7: diffusion-limited aggregation (DLA).
//
// Frost, coral, lightning, mineral dendrites — the delicate branching you get when
// wandering particles stick on contact with a growing cluster. Walkers launch just
// outside the cluster, random-walk (with big adaptive steps when far away so it's
// fast), and freeze where they first touch. A spatial grid keeps stick-detection
// O(1). Reproducible — all randomness from the passed Loom.RNG.
//
//   Loom.dla(rng, w, h, { n, r, seeds }) → [{ x, y, gen, parent }, …]
//     gen = stick order (0 = seed) for colouring by growth; parent = index it stuck to.
//     seeds: "center" (default) · "bottom" · or an array of [x, y].
(function (Loom) {
  Loom.dla = function (rng, w, h, opts) {
    opts = opts || {};
    var n = opts.n || 3000;
    var r = opts.r || Math.min(w, h) * 0.006;
    var stick = r * 2;
    var cell = stick;
    var cx = w / 2, cy = h / 2;
    var pts = [];
    var grid = {};
    var clusterR = 0;

    function bucket(x, y) { return Math.floor(x / cell) + "," + Math.floor(y / cell); }
    function addStuck(x, y, parent) {
      var i = pts.length;
      pts.push({ x: x, y: y, gen: i, parent: parent == null ? -1 : parent });
      (grid[bucket(x, y)] || (grid[bucket(x, y)] = [])).push(i);
      var d = Math.hypot(x - cx, y - cy);
      if (d > clusterR) clusterR = d;
      return i;
    }
    function nearest(x, y) {
      var gx = Math.floor(x / cell), gy = Math.floor(y / cell);
      for (var ax = gx - 1; ax <= gx + 1; ax++) {
        for (var ay = gy - 1; ay <= gy + 1; ay++) {
          var arr = grid[ax + "," + ay];
          if (!arr) continue;
          for (var k = 0; k < arr.length; k++) {
            var p = pts[arr[k]], dx = p.x - x, dy = p.y - y;
            if (dx * dx + dy * dy <= stick * stick) return arr[k];
          }
        }
      }
      return -1;
    }

    var seeds = opts.seeds || "center";
    if (seeds === "center") addStuck(cx, cy, -1);
    else if (seeds === "bottom") { for (var s = 0; s < 6; s++) addStuck(rng.range(0, w), h - 1, -1); }
    else seeds.forEach(function (p) { addStuck(p[0], p[1], -1); });

    // Walk until we have n stuck particles (or give up after a generous cap). Small
    // steps so walkers can't leap over the thin dendrite, a mild inward bias so they
    // actually find the radial cluster, and a tight kill-radius so strays abandon fast
    // instead of wandering for thousands of steps (that was the 9-second trap).
    var bias = opts.bias == null ? 0.22 : opts.bias;
    var attempts = 0, cap = n * 12;
    while (pts.length < n && attempts < cap) {
      attempts++;
      var spawnR = clusterR + r * 4 + 2;
      var killR = clusterR + Math.min(w, h) * 0.12 + r * 8;
      var ang = rng.range(0, Math.PI * 2);
      var x = cx + Math.cos(ang) * spawnR, y = cy + Math.sin(ang) * spawnR;
      for (var step = 0; step < 800; step++) {
        var toC = Math.atan2(cy - y, cx - x);
        var a = rng.range(0, Math.PI * 2);
        var bx = Math.cos(a) + bias * Math.cos(toC);
        var by = Math.sin(a) + bias * Math.sin(toC);
        var bl = Math.hypot(bx, by) || 1;
        x += (bx / bl) * r; y += (by / bl) * r;
        if (Math.hypot(x - cx, y - cy) > killR) break;       // strayed — abandon this walker
        var hit = nearest(x, y);
        if (hit >= 0) {
          var p = pts[hit], dx = x - p.x, dy = y - p.y, d = Math.hypot(dx, dy) || 1;
          var nx = p.x + dx / d * stick, ny = p.y + dy / d * stick;
          if (nx < 0 || ny < 0 || nx > w || ny > h) break;  // off-canvas — drop
          addStuck(nx, ny, hit);
          break;
        }
      }
    }
    return pts;
  };
})((window.Loom = window.Loom || {}));
