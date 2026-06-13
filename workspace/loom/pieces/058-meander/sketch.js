// Emil's Loom · piece 058 — "Meander"
//
// Differential growth — a single closed loop of points that can't stop growing. Each point is pulled toward
// its two neighbours (to keep the line whole) and pushed away from every nearby point (so the line refuses
// to cross itself); and as it lengthens (new points spliced into stretched edges) it has nowhere to go but
// to BUCKLE, folding back on itself again and again into the dense, brain-coral, fingerprint convolutions
// that nature uses for a cortex, a gut wall, a reef. Nobody draws the folds; they emerge from one rule.
// The HOOK ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]): emergent wonder, the
// Strange(#026)/Physarum(#054) lane where a simple system out-invents me — and a deliberate ABSTRACT swing
// to break a run of atmospheric scenes-with-a-figure (the #90 audit's reflex-watch, [[073-a-lesson-applied-by-reflex-becomes-a-rut]]).
//
// DETERMINISTIC (forces are pure functions of position; the only rng is the seeded SETUP) so the settled
// figure reproduces ([[070-stochastic-sim-randomness-is-load-bearing-hash-it-for-reproducibility]]). Grown
// progressively (lib/grow.js #17, 3rd consumer) so it never blocks ([[029-heavy-renders-should-be-progressive]]).
// Self-repulsion is O(N) via a spatial hash. Static once settled.
Loom.piece({
  id: "058",
  title: "Meander",
  seed: "cortex",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- parameters (seed-varied; differential growth is sensitive to the attract/repel balance) ----
    var sep = rng.range(3.4, 4.6) * U;                      // rest spacing between adjacent points
    var repR = sep * rng.range(2.4, 3.1);                   // self-repulsion radius
    var repF = rng.range(0.62, 0.85);                       // repulsion strength (strong enough to stretch edges)
    var attrF = rng.range(0.42, 0.55);                      // neighbour-spring strength
    var smoothF = 0.08;                                     // a little Laplacian smoothing → organic curves (low, so it doesn't fight growth)
    var maxEdge = sep * 1.4;                                // splice a point into any edge longer than this (reliable across seeds)
    var m = S * 0.05;                                       // keep inside the frame
    var capN = rng.int(2500, 3100);                         // a full coral that settles fast (the gallery self-drives several sims at once)

    // ---- palette: the convolution as a fleshy relief — dark groove, lit ridge ----
    var pals = [
      { gr: "#241710", rg: "#c89a6a", hi: "#eccb92", sh: "#774a29" },   // coral
      { gr: "#33212a", rg: "#d49ea4", hi: "#f0c6cc", sh: "#874f55" },   // brain (pink)
      { gr: "#0e2018", rg: "#5a9c7c", hi: "#aadaba", sh: "#2c5a44" },   // jade
      { gr: "#1a1714", rg: "#d6cbb6", hi: "#f4ecd8", sh: "#867c64" }    // bone
    ];
    var P = pals[rng.int(0, pals.length - 1)];

    // ---- the loop: a gently wobbled circle (the wobble seeds the buckling) ----
    var px = [], py = [], N0 = 130, R0 = S * 0.045, cx = S * 0.5, cy = S * 0.5;  // a crowded start → growth pressure from step 1
    for (var i = 0; i < N0; i++) {
      var a = i / N0 * TAU, rr = R0 * (1 + 0.25 * (nz.fbm(Math.cos(a) * 1.5 + 9, Math.sin(a) * 1.5 + 9, 2, 2, 0.5) - 0.5));
      px.push(cx + Math.cos(a) * rr); py.push(cy + Math.sin(a) * rr);
    }
    var N = N0;

    var cell = repR, gw = Math.ceil(S / cell), gh = Math.ceil(S / cell), grid = [];
    for (var c = 0; c < gw * gh; c++) grid.push([]);

    function step() {
      for (var c = 0; c < grid.length; c++) grid[c].length = 0;             // rebin
      for (var i = 0; i < N; i++) { var gx = clamp(px[i] / cell | 0, 0, gw - 1), gy = clamp(py[i] / cell | 0, 0, gh - 1); grid[gy * gw + gx].push(i); }
      var fx = [], fy = [];
      for (var i = 0; i < N; i++) {
        var x = px[i], y = py[i], ip = (i - 1 + N) % N, inx = (i + 1) % N, ax = 0, ay = 0;
        var dx1 = px[ip] - x, dy1 = py[ip] - y, d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);  // spring to prev
        if (d1 > 0.001) { var s1 = (d1 - sep) * attrF / d1; ax += dx1 * s1; ay += dy1 * s1; }
        var dx2 = px[inx] - x, dy2 = py[inx] - y, d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);  // spring to next
        if (d2 > 0.001) { var s2 = (d2 - sep) * attrF / d2; ax += dx2 * s2; ay += dy2 * s2; }
        ax += ((px[ip] + px[inx]) * 0.5 - x) * smoothF; ay += ((py[ip] + py[inx]) * 0.5 - y) * smoothF;  // smooth
        var gx = clamp(x / cell | 0, 0, gw - 1), gy = clamp(y / cell | 0, 0, gh - 1);    // self-repulsion
        for (var oy = (gy > 0 ? gy - 1 : 0); oy <= (gy < gh - 1 ? gy + 1 : gh - 1); oy++)
          for (var ox = (gx > 0 ? gx - 1 : 0); ox <= (gx < gw - 1 ? gx + 1 : gw - 1); ox++) {
            var bk = grid[oy * gw + ox];
            for (var b = 0; b < bk.length; b++) {
              var j = bk[b]; if (j === i || j === ip || j === inx) continue;
              var rdx = x - px[j], rdy = y - py[j], rd2 = rdx * rdx + rdy * rdy;
              if (rd2 < repR * repR && rd2 > 0.001) { var rd = Math.sqrt(rd2), rf = (repR - rd) / repR * repF; ax += rdx / rd * rf; ay += rdy / rd * rf; }
            }
          }
        fx[i] = ax; fy[i] = ay;
      }
      for (var i = 0; i < N; i++) { px[i] = clamp(px[i] + fx[i], m, S - m); py[i] = clamp(py[i] + fy[i], m, S - m); }
      if (N < capN) {                                                        // grow: splice into stretched edges
        var ins = [];
        for (var i = 0; i < N; i++) { var inx = (i + 1) % N, dx = px[inx] - px[i], dy = py[inx] - py[i]; if (dx * dx + dy * dy > maxEdge * maxEdge) ins.push(i); }
        for (var k = ins.length - 1; k >= 0; k--) { var i = ins[k], inx = (i + 1) % N; px.splice(i + 1, 0, (px[i] + px[inx]) * 0.5); py.splice(i + 1, 0, (py[i] + py[inx]) * 0.5); N++; }
      }
    }

    function strokePath(ox, oy) {
      ctx.beginPath(); ctx.moveTo(px[0] + ox, py[0] + oy);
      for (var i = 1; i < N; i++) ctx.lineTo(px[i] + ox, py[i] + oy);
      ctx.closePath(); ctx.stroke();
    }
    var ridgeW = sep * 1.25;                                // ridge a bit narrower than the fold spacing → grooves show
    function render() {
      ctx.fillStyle = P.gr; ctx.fillRect(0, 0, S, S);       // the dark groove between the folds
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.strokeStyle = P.sh; ctx.lineWidth = ridgeW; strokePath(1.7 * U, 1.9 * U);     // shadow side (down-right)
      ctx.strokeStyle = P.rg; ctx.lineWidth = ridgeW; strokePath(0, 0);                 // the ridge body
      ctx.strokeStyle = P.hi; ctx.lineWidth = ridgeW * 0.42; strokePath(-1.3 * U, -1.5 * U);  // lit edge (up-left)
    }

    var warm = 10; for (var w = 0; w < warm; w++) step(); render();
    var settle = 0;
    function growChunk() {
      if (N >= capN && settle >= 14) return true;
      for (var c = 0; c < 3; c++) step();
      if (N >= capN) settle += 3;
      render();
      return N >= capN && settle >= 14;
    }
    return Loom.grow(growChunk);
  }
});
