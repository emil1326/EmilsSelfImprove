// Emil's Loom · piece 079 — "Labyrinth"
//
// A multi-scale Truchet tiling: fill a grid with one of two tiles — a pair of quarter-arcs joining the
// midpoints of adjacent edges — rotate each at random, and the arcs join up across the grid into long
// emergent curves no one placed. Tiles recursively SUBDIVIDE, so the labyrinth lives at four scales at once.
// An abstract, for register-variety; procedural, so it varies by seed (the tiling itself is the variation
// axis, not a palette pick — the #115 audit's note). Ran 083: no legibility gate, so the soul is whether it
// SINGS vs reads as flat wallpaper — and the lift is to TRACE the emergent curves (union-find over shared
// edge-midpoints) and give each connected loop its OWN colour, so the hidden structure the tiles secretly
// form pops out. That structure-made-visible is the "oh"; the execution lifts an abstract past demo (the
// Strange #46 move). Line-weight scales with the tile, so big curves read bold and fine ones recede. Composes ramp-free.
Loom.piece({
  id: "079",
  title: "Labyrinth",
  seed: "sebastien",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, PI = Math.PI, TAU = 6.2831853;
    ctx.fillStyle = "#ece6db"; ctx.fillRect(0, 0, S, S);

    // ---- collect arcs + a union-find over their shared edge-midpoint endpoints ----
    var arcs = [], nodes = {}, parent = [], q = (S / 5) / 64;
    function nodeId(x, y) {
      var k = Math.round(x / q) + "_" + Math.round(y / q);
      if (nodes[k] == null) { nodes[k] = parent.length; parent.push(parent.length); }
      return nodes[k];
    }
    function find(a) { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; }
    function arc(cx, cy, r, a0, a1, x0, y0, x1, y1, size) {
      var n0 = nodeId(x0, y0), n1 = nodeId(x1, y1), ra = find(n0), rb = find(n1);
      if (ra !== rb) parent[ra] = rb;
      arcs.push({ cx: cx, cy: cy, r: r, a0: a0, a1: a1, n: n0, size: size });
    }
    function place(x, y, s) {
      var r = s / 2;
      if (rng.bool()) {                                              // T–L  and  B–R
        arc(x, y, r, 0, PI / 2, x + r, y, x, y + r, s);
        arc(x + s, y + s, r, PI, 3 * PI / 2, x + r, y + s, x + s, y + r, s);
      } else {                                                       // R–T  and  L–B
        arc(x + s, y, r, PI / 2, PI, x + s, y + r, x + r, y, s);
        arc(x, y + s, r, 3 * PI / 2, TAU, x, y + r, x + r, y + s, s);
      }
    }
    var subP = [0.62, 0.44, 0.28];
    function tile(x, y, s, depth) {
      if (depth < 3 && rng.range(0, 1) < subP[depth]) {
        var h = s / 2;
        tile(x, y, h, depth + 1); tile(x + h, y, h, depth + 1);
        tile(x, y + h, h, depth + 1); tile(x + h, y + h, h, depth + 1);
      } else place(x, y, s);
    }
    var base = 5, bs = S / base;
    for (var gy = 0; gy < base; gy++) for (var gx = 0; gx < base; gx++) tile(gx * bs, gy * bs, bs, 0);

    // ---- render: each connected loop ONE colour, drawn from a diagonal gradient at the loop's centroid
    //      (so colour flows across the canvas = coherent) + a small per-loop jitter (so neighbours still read
    //      distinct). Structure made visible AND elegant. Line-weight scales with the tile (depth). ----
    var cenX = {}, cenY = {}, cnt = {};
    for (var i = 0; i < arcs.length; i++) {
      var r0 = find(arcs[i].n);
      cenX[r0] = (cenX[r0] || 0) + arcs[i].cx; cenY[r0] = (cenY[r0] || 0) + arcs[i].cy; cnt[r0] = (cnt[r0] || 0) + 1;
    }
    var ramp = Loom.ramp(["#1f8a86", "#2f5aa8", "#6a3f90", "#a83f68", "#c4694e"]);
    ctx.lineCap = "round";
    for (var j = 0; j < arcs.length; j++) {
      var a = arcs[j], r = find(a.n);
      var jit = (((r * 2654435761) >>> 0) / 4294967296 - 0.5) * 0.16;
      var t = (cenX[r] / cnt[r] + cenY[r] / cnt[r]) / (2 * S) + jit;
      if (t < 0) t = 0; else if (t > 1) t = 1;
      ctx.strokeStyle = ramp.css(t);
      ctx.lineWidth = Math.max(0.9 * U, a.size * 0.15);
      ctx.beginPath(); ctx.arc(a.cx, a.cy, a.r, a.a0, a.a1); ctx.stroke();
    }
  }
});
