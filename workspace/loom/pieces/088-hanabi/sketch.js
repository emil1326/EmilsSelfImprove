// Emil's Loom · piece 088 — "Hanabi"
//
// Fireworks — hanabi, "fire-flowers" — blooming over a dark harbour. A festival piece in the wonder lane
// (Wishes #036); graded honestly as such, no 5-reach. The real trap here isn't the concept, it's the GRIND:
// my two longest grinds ever (Fireflies #031, Plume #065) were both additive-particle-glow, and a firework
// is the purest case — so 051 (stacked additive glows go white) + 077 (lower the per-deposit alpha FIRST)
// are applied up front: each spark is a LOW-alpha glow, brightness comes from ninety-odd sparks not from
// stacking, near-white is reserved for the launch flash. Each burst is a pure function of its age (radial
// launch + gravity droop + fade), so the whole display reproduces from its seed and the gallery preview can
// pre-roll to a sky already mid-bloom (the Belousov preview fix). Composes glow + palette.
Loom.piece({
  id: "088",
  title: "Hanabi",
  seed: "sumida",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    function hash(n) { var x = Math.sin(n * 127.1 + 0.7) * 43758.5453; return x - Math.floor(x); }
    var GRAV = 0.11 * S;

    // ---- one burst, a pure function of its age (051/077: low per-spark alpha, brightness from COUNT + radius) ----
    function burst(cx, cy, age, R, col, life) {
      if (age < 0 || age > life) return;
      var ease = 1 - Math.exp(-age * 2.4);                 // shell expands fast, eases out to R
      var droop = GRAV * age * age;                        // gravity sag (the umbrella shape)
      var fade = Math.max(0, 1 - age / life); fade = fade * fade;
      var sparks = 130, rs = col[0] + "," + col[1] + "," + col[2];
      ctx.globalCompositeOperation = "lighter";
      // ONE soft halo — the glow of the explosion (low alpha, not stacked — 051)
      var hy = cy + droop * 0.5, hR = R * ease * 1.1;
      var hg = ctx.createRadialGradient(cx, hy, 0, cx, hy, hR);
      hg.addColorStop(0, "rgba(" + rs + "," + (fade * 0.17) + ")"); hg.addColorStop(0.5, "rgba(" + rs + "," + (fade * 0.07) + ")"); hg.addColorStop(1, "rgba(" + rs + ",0)");
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(cx, hy, hR, 0, TAU); ctx.fill();
      for (var i = 0; i < sparks; i++) {
        var th = (i / sparks) * TAU, sp = 0.74 + 0.45 * hash(i);
        var rv = R * ease * sp, x = cx + rv * Math.cos(th), y = cy + rv * Math.sin(th) + droop;
        var ap = Math.max(0, age - 0.2), ep = 1 - Math.exp(-ap * 2.4), rp = R * ep * sp, dp = GRAV * ap * ap;
        var xp = cx + rp * Math.cos(th), yp = cy + rp * Math.sin(th) + dp;
        var lg = ctx.createLinearGradient(xp, yp, x, y);
        lg.addColorStop(0, "rgba(" + rs + ",0)"); lg.addColorStop(1, "rgba(" + rs + "," + (fade * 0.5) + ")");
        ctx.strokeStyle = lg; ctx.lineWidth = 1.5 * U; ctx.beginPath(); ctx.moveTo(xp, yp); ctx.lineTo(x, y); ctx.stroke();
        var hr = 5 * U, g = ctx.createRadialGradient(x, y, 0, x, y, hr);
        g.addColorStop(0, "rgba(255,250,238," + (fade * 0.6) + ")"); g.addColorStop(0.35, "rgba(" + rs + "," + (fade * 0.4) + ")"); g.addColorStop(1, "rgba(" + rs + ",0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, hr, 0, TAU); ctx.fill();
      }
      if (age < 0.16) {                                    // the launch flash — the only near-white (051)
        var fa = (1 - age / 0.16) * 0.9, fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.6);
        fg.addColorStop(0, "rgba(255,255,250," + fa + ")"); fg.addColorStop(1, "rgba(255,255,250,0)");
        ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(cx, cy, R * 0.6, 0, TAU); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    // ---- the display: a seeded timeline of bursts looping over a dark harbour ----
    var LOOP = 9, OFFSET = 4.6;                    // the show repeats every LOOP s; OFFSET pre-rolls the preview busy
    var FW = [[255, 96, 96], [255, 186, 84], [126, 224, 150], [112, 182, 255], [232, 134, 240], [255, 244, 210]];
    var NB = rng.int(26, 34), bursts = [];
    for (var b = 0; b < NB; b++) bursts.push({
      t0: rng.range(0, LOOP), x: rng.range(0.12, 0.88) * S, y: rng.range(0.14, 0.52) * S,
      R: rng.range(0.1, 0.22) * S, col: FW[rng.int(0, FW.length - 1)], life: rng.range(1.4, 2.2)
    });
    var stars = [];
    for (var st = 0; st < 150; st++) stars.push([rng.range(0, 1) * S, rng.range(0, 0.76) * S, Math.pow(rng.range(0, 1), 2.5)]);
    var cityBase = 0.82 * S, bld = [], bx0 = -0.02 * S;
    while (bx0 < S) { var bw = rng.range(0.035, 0.09) * S; bld.push({ x: bx0, w: bw, h: rng.range(0.05, 0.18) * S }); bx0 += bw + rng.range(0, 0.012) * S; }

    function drawScene() {
      ctx.fillStyle = "#05070f"; ctx.fillRect(0, 0, S, S);
      for (var s2 = 0; s2 < stars.length; s2++) { ctx.fillStyle = "rgba(210,216,235," + (0.08 + stars[s2][2] * 0.6) + ")"; ctx.beginPath(); ctx.arc(stars[s2][0], stars[s2][1], (0.3 + stars[s2][2]) * U, 0, TAU); ctx.fill(); }
      var wg = ctx.createLinearGradient(0, cityBase, 0, S); wg.addColorStop(0, "#080b16"); wg.addColorStop(1, "#0b0f1c");
      ctx.fillStyle = wg; ctx.fillRect(0, cityBase, S, S - cityBase);                 // the harbour water (no reflection — 073)
      for (var bi = 0; bi < bld.length; bi++) {
        var bb = bld[bi]; ctx.fillStyle = "#02030a"; ctx.fillRect(bb.x, cityBase - bb.h, bb.w, bb.h);
        for (var w2 = 0; w2 < 6; w2++) if (hash(bi * 9.3 + w2) > 0.62) { ctx.fillStyle = "rgba(255,198,120,0.55)"; ctx.fillRect(bb.x + hash(bi + w2 * 2) * bb.w, cityBase - bb.h + hash(bi * 3.1 + w2) * bb.h, 1.7 * U, 1.7 * U); }
      }
    }
    return function frame(t) {
      drawScene();
      var tt = t + OFFSET;
      for (var bk = 0; bk < bursts.length; bk++) {
        var bd = bursts[bk], age = tt - bd.t0; age -= Math.floor(age / LOOP) * LOOP;   // loop the show
        burst(bd.x, bd.y, age, bd.R, bd.col, bd.life);
      }
    };
  }
});
