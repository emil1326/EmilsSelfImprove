// Emil's Loom · piece 075 — "Lucanus"
//
// A stag beetle (Lucanus) in the manner of an old engraved entomological plate: dark ink line-work on aged
// paper, the domed carapace modelled in crosshatch, the great antler-jaws the star. A fresh MEDIUM — line
// engraving, after a long glow-on-dark then flat-matte run ([[084-...]]); the mark is the line, not a fill.
//
// SOUL (ran [[083-...]] myself, twice): an etching lives on its LINE-SHADING — crosshatch that follows the form
// and reads as lit 3D, validated FIRST on the carapace dome before the beetle was built ([[032-...]]). And within
// the beetle the defining feature is the ANTLER-MANDIBLES ([[035-...]] — they make it a *stag* beetle), so they
// get the care. Tone from a one-light dome (N·L); hatch THICKNESS = shadow; cross-hatch only in the darks; a
// little hand-jitter so it's engraved, not printed ([[047-...]]). Composes noise.
Loom.piece({
  id: "075",
  title: "Lucanus",
  seed: "cervus",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760, mx = 0.5 * S;
    var nz = Loom.noise(rng.int(1, 999999));
    var MOODS = [{ ink: "#2a2016", paper: "#e9e1cd" }, { ink: "#1d1c20", paper: "#e6e3da" }, { ink: "#352611", paper: "#ede2c6" }];
    var M = rng.pick(MOODS), ink = M.ink;                            // variation AXES for a hand-composed piece (085):
    var Lx = rng.range(-0.62, -0.30), Ly = rng.range(-0.62, -0.36), Lz = 0.72, lm = Math.hypot(Lx, Ly, Lz); Lx /= lm; Ly /= lm; Lz /= lm;   // ...the light moves (re-shades it)

    // ---- engrave a domed ellipse in crosshatch (the proven form-shading) ----
    function engrave(cx, cy, rx, ry) {
      function tone(x, y) {
        var u = (x - cx) / rx, v = (y - cy) / ry, r2 = u * u + v * v;
        if (r2 > 1) return -1;
        var z = Math.sqrt(1 - r2), b = u * Lx + v * Ly + z * Lz;
        return b < 0 ? 0 : b > 1 ? 1 : b;
      }
      var sp = 5 * U, maxW = 2.6 * U, step = 2 * U;
      ctx.strokeStyle = ink; ctx.lineCap = "round";
      for (var y = cy - ry; y <= cy + ry; y += sp) {                  // horizontal hatch, thickness = shadow
        var prev = false, px = 0, py = 0;
        for (var x = cx - rx; x <= cx + rx; x += step) {
          var t = tone(x, y); if (t < 0) { prev = false; continue; }
          var w = (1 - t) * maxW; if (w < 0.4 * U) { prev = false; continue; }
          var jy = y + (nz.fbm(x / S * 9, y / S * 9, 2, 2, 0.5) - 0.5) * 1.6 * U;
          if (prev) { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, jy); ctx.stroke(); }
          px = x; py = jy; prev = true;
        }
      }
      for (var x2 = cx - rx; x2 <= cx + rx; x2 += sp) {                // cross-hatch only in the darks
        var pv = false, qx = 0, qy = 0;
        for (var y2 = cy - ry; y2 <= cy + ry; y2 += step) {
          var t2 = tone(x2, y2); if (t2 < 0 || t2 > 0.44) { pv = false; continue; }
          var w2 = (0.44 - t2) * maxW * 1.7; if (w2 < 0.4 * U) { pv = false; continue; }
          var jx = x2 + (nz.fbm(x2 / S * 9 + 5, y2 / S * 9, 2, 2, 0.5) - 0.5) * 1.6 * U;
          if (pv) { ctx.lineWidth = w2; ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(jx, y2); ctx.stroke(); }
          qx = jx; qy = y2; pv = true;
        }
      }
      ctx.lineWidth = 1.7 * U; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.stroke();
    }

    // ---- a tapering ink limb segment ----
    function bone(x1, y1, w1, x2, y2, w2) {
      var dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1, px = -dy / d, py = dx / d;
      ctx.fillStyle = ink; ctx.beginPath();
      ctx.moveTo(x1 + px * w1, y1 + py * w1); ctx.lineTo(x2 + px * w2, y2 + py * w2);
      ctx.lineTo(x2 - px * w2, y2 - py * w2); ctx.lineTo(x1 - px * w1, y1 - py * w1);
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(x2, y2, w2, 0, TAU); ctx.fill();
    }
    function leg(rx0, ry0, a1, l1, a2, l2, w) {
      var kx = rx0 + Math.cos(a1) * l1, ky = ry0 + Math.sin(a1) * l1;
      var fx = kx + Math.cos(a2) * l2, fy = ky + Math.sin(a2) * l2;
      bone(rx0, ry0, w * 1.2, kx, ky, w * 0.8); bone(kx, ky, w * 0.8, fx, fy, w * 0.35);
    }
    // a tapering curved horn along a centreline (reliable — segments of decreasing width, not a closed blob)
    function horn(pts, w0, w1) {
      ctx.strokeStyle = ink; ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (var i = 0; i < pts.length - 1; i++) {
        ctx.lineWidth = w0 + (w1 - w0) * (i / (pts.length - 2));
        ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke();
      }
    }

    // aged paper
    ctx.fillStyle = M.paper; ctx.fillRect(0, 0, S, S);

    // ---- legs (behind the body), 3 pairs, rooted at the EDGE and splaying out (mir() mirrors the angle) ----
    var mir = function (a, s) { return s > 0 ? a : Math.PI - a; };
    for (var s = -1; s <= 1; s += 2) {
      leg(mx + s * 0.135 * S, 0.40 * S, mir(-0.35, s), 0.10 * S, mir(-0.05, s), 0.10 * S, 3.4 * U);  // front, out + forward
      leg(mx + s * 0.155 * S, 0.55 * S, mir(0.30, s), 0.12 * S, mir(0.60, s), 0.12 * S, 3.6 * U);    // mid, out + down
      leg(mx + s * 0.125 * S, 0.685 * S, mir(0.78, s), 0.12 * S, mir(1.05, s), 0.11 * S, 3.4 * U);   // hind, out + down-back
    }

    // ---- body: a dominant engraved elytra, a wide flat pronotum shield, a small tucked head ----
    engrave(mx, 0.605 * S, 0.16 * S, 0.205 * S);                                    // elytra (the dominant mass)
    ctx.strokeStyle = ink; ctx.lineCap = "round"; ctx.lineWidth = 1.7 * U;          // elytra centre seam
    ctx.beginPath(); ctx.moveTo(mx, 0.41 * S); ctx.lineTo(mx, 0.80 * S); ctx.stroke();
    engrave(mx, 0.395 * S, 0.155 * S, 0.058 * S);                                   // thorax: wide + FLAT (a pronotum shield, not an egg)
    engrave(mx, 0.335 * S, 0.046 * S, 0.034 * S);                                   // head: small, tucked under the thorax front

    // ---- the antler-mandibles (the HOOK, 035): forward-curving toothed jaws, symmetric ----
    for (var sd = -1; sd <= 1; sd += 2) {
      horn([
        [mx + sd * 0.028 * S, 0.305 * S], [mx + sd * 0.072 * S, 0.235 * S], [mx + sd * 0.118 * S, 0.172 * S],
        [mx + sd * 0.148 * S, 0.115 * S], [mx + sd * 0.140 * S, 0.075 * S], [mx + sd * 0.100 * S, 0.060 * S], [mx + sd * 0.070 * S, 0.082 * S]
      ], 10.5 * U, 1.8 * U);
      horn([[mx + sd * 0.110 * S, 0.150 * S], [mx + sd * 0.066 * S, 0.138 * S]], 5 * U, 1.2 * U);   // a pronounced inner branch-tooth
    }
    // antennae: short, elbowed, clubbed (from the head sides)
    ctx.strokeStyle = ink; ctx.lineWidth = 2 * U; ctx.lineCap = "round";
    for (var an = -1; an <= 1; an += 2) {
      var ax = mx + an * 0.05 * S, ay = 0.315 * S;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + an * 0.045 * S, 0.33 * S); ctx.lineTo(ax + an * 0.08 * S, 0.318 * S); ctx.stroke();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(ax + an * 0.083 * S, 0.318 * S, 2.6 * U, 0, TAU); ctx.fill();
    }
  }
});
