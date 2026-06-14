// Emil's Loom · piece 086 — "Apollonius"
//
// An Apollonian gasket: start with circles that kiss, and into every curved gap between three of them
// inscribe the one circle that kisses all three — then do it again in the smaller gaps it makes, forever.
// The packing nests down to infinity, every triangular sliver swallowing a smaller circle than the last.
// Apollonius of Perga studied tangent circles 2,200 years ago; Descartes' Circle Theorem gives the exact
// curvature of each new circle from its three neighbours (1/r4 = 1/r1+1/r2+1/r3 ± 2·sqrt(...)), and for the
// right starting circles every curvature comes out a whole NUMBER — so the gasket is a piece of number
// theory you can see. Pure crisp geometry (flat-vector's home turf); the hook is the reveal — colouring by
// curvature so the recursion blooms big-to-infinitesimal, the integers labelled on the largest circles.
// A full-frame field (no centred subject, no diagonal). Composes ramp + glow.
Loom.piece({
  id: "086",
  title: "Apollonius",
  seed: "soddy",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;

    // ---- complex helpers (centres are complex numbers in Descartes' theorem) ----
    function cadd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
    function cmul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
    function cscale(a, s) { return [a[0] * s, a[1] * s]; }
    function csqrt(a) { var r = Math.hypot(a[0], a[1]); var re = Math.sqrt(Math.max(0, (r + a[0]) / 2)); var im = Math.sqrt(Math.max(0, (r - a[0]) / 2)) * (a[1] < 0 ? -1 : 1); return [re, im]; }

    // tangency error of a circle (curvature k, centre z) to circle p — handles internal (bounding) & external
    function tangErr(k, z, p) {
      var d = Math.hypot(z[0] - p.z[0], z[1] - p.z[1]), r = 1 / Math.abs(k), rp = 1 / Math.abs(p.k);
      return Math.min(Math.abs(d - (r + rp)), Math.abs(d - Math.abs(r - rp)));
    }
    // BOTH circles tangent to three mutually-tangent circles (Descartes ±), with the correct sqrt branch
    function soddyBoth(a, b, c) {
      var s = 2 * Math.sqrt(Math.max(0, a.k * b.k + b.k * c.k + c.k * a.k));
      var kp = a.k + b.k + c.k + s, km = a.k + b.k + c.k - s;
      var t1 = cscale(a.z, a.k), t2 = cscale(b.z, b.k), t3 = cscale(c.z, c.k);
      var sum = cadd(cadd(t1, t2), t3);
      var root = cscale(csqrt(cadd(cadd(cmul(t1, t2), cmul(t2, t3)), cmul(t3, t1))), 2);
      var zp = cscale(cadd(sum, root), 1 / kp);
      // the complex sqrt has two branches; keep the one that makes kp actually tangent, km takes the other
      if (tangErr(kp, zp, a) + tangErr(kp, zp, b) + tangErr(kp, zp, c) > 1e-6) { root = cscale(root, -1); zp = cscale(cadd(sum, root), 1 / kp); }
      var zm = cscale(cadd(sum, cscale(root, -1)), 1 / km);
      return [{ k: kp, z: zp }, { k: km, z: zm }];
    }
    function cdist(a, b) { return Math.hypot(a.z[0] - b.z[0], a.z[1] - b.z[1]); }

    // ---- seed: a bounding circle (curvature -1) + two inner circles, all mutually tangent ----
    var t = rng.range(0.32, 0.62);                 // how the diameter splits -> a different gasket per seed
    var PALETTES = [
      ["#163a5a", "#1f7fa0", "#2fc0a6", "#a6e36a", "#ffd86a", "#ff8f4a"],   // ocean -> gold
      ["#2a1022", "#6e2236", "#bb3a3e", "#ee7a3e", "#f6c45e", "#fff0b4"],   // magma
      ["#1b1940", "#3e2a72", "#7c3aa0", "#bd5ec4", "#e79fd2", "#ffd6ec"],   // amethyst
      ["#0e2a26", "#1a5a4a", "#2e9a6a", "#7ac86a", "#cfe06a", "#f2ecaa"]    // jade
    ];
    var pal = rng.pick(PALETTES);
    var rot = rng.range(0, TAU), cosR = Math.cos(rot), sinR = Math.sin(rot);   // a seeded turn, so the big circles land differently
    var B = { k: -1, z: [0, 0] };
    var A = { k: 1 / t, z: [t - 1, 0] };
    var C = { k: 1 / (1 - t), z: [t, 0] };

    var circles = [{ k: A.k, z: A.z, depth: 0 }, { k: C.k, z: C.z, depth: 0 }];
    var seen = {};
    var MAXD = 11, MINK = 1, MAXK = 1 / 0.0028;    // recursion depth + smallest circle to bother drawing
    function add(c, depth) {
      var r = 1 / c.k;
      if (c.k < MINK || c.k > MAXK || depth > MAXD) return false;
      if (Math.hypot(c.z[0], c.z[1]) + r > 1.0005) return false;        // must sit inside the bounding circle
      var key = (c.z[0] * 1e4 | 0) + "," + (c.z[1] * 1e4 | 0) + "," + (c.k * 1e3 | 0);
      if (seen[key]) return false; seen[key] = 1;
      circles.push({ k: c.k, z: c.z, depth: depth });
      return true;
    }
    // fill the gap bounded by (a,b,c); `ex` is the circle already filling the OTHER side of this triple
    function recurse(a, b, c, ex, depth) {
      var both = soddyBoth(a, b, c);
      var d = cdist(both[0], ex) > cdist(both[1], ex) ? both[0] : both[1];   // the Soddy circle that ISN'T ex
      if (!add(d, depth)) return;
      recurse(a, b, d, c, depth + 1); recurse(a, c, d, b, depth + 1); recurse(b, c, d, a, depth + 1);
    }
    var seed = soddyBoth(B, A, C);                 // the two gaps (top + bottom) of the starting triple
    add(seed[0], 1); add(seed[1], 1);
    recurse(B, A, seed[0], C, 2); recurse(B, C, seed[0], A, 2); recurse(A, C, seed[0], B, 2);
    recurse(B, A, seed[1], C, 2); recurse(B, C, seed[1], A, 2); recurse(A, C, seed[1], B, 2);

    // ---- map unit disc -> canvas ----
    var cx = S / 2, cy = S / 2, R = 0.46 * S;
    function px(z) { var x = z[0] * cosR - z[1] * sinR, y = z[0] * sinR + z[1] * cosR; return [cx + x * R, cy + y * R]; }

    // ---- render: background, the bounding rim, then every circle coloured by curvature (the reveal) ----
    ctx.fillStyle = "#0a0c10"; ctx.fillRect(0, 0, S, S);
    var ramp = Loom.ramp(pal);                     // large->small circle: the size-cascade in the seed's palette
    var rgb = [0, 0, 0];
    circles.sort(function (p, q) { return p.k - q.k; });   // big circles first; tiny ones draw on top
    for (var i = 0; i < circles.length; i++) {
      var c = circles[i], p = px(c.z), rr = R / Math.abs(c.k);
      var tcol = Math.min(1, Math.log(c.k + 1) / Math.log(MAXK + 1));   // curvature (log) -> colour: the size-cascade
      ramp.rgb(tcol, rgb);
      var rs = (rgb[0] | 0) + "," + (rgb[1] | 0) + "," + (rgb[2] | 0);
      // each disc a little lit bead (radial fill, light from the upper-left) so the recursion glows
      var g = ctx.createRadialGradient(p[0] - rr * 0.32, p[1] - rr * 0.32, rr * 0.08, p[0], p[1], rr);
      g.addColorStop(0, "rgba(" + rs + ",0.97)"); g.addColorStop(1, "rgba(" + rs + ",0.5)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p[0], p[1], rr, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(8,10,14,0.75)"; ctx.lineWidth = 0.9 * U;   // thin dark seam separates the beads
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(120,170,190,0.4)"; ctx.lineWidth = 1.5 * U;   // the bounding rim
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
  }
});
