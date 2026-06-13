// Emil's Loom · piece 066 — "Cathedral"
//
// Dawn in an old forest: shafts of sun cutting down through the canopy and the mist between the trunks, the
// way a forest turns into a cathedral when the light comes in sideways. The HOOK is the LIGHT
// ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]], [[045-a-luminous-subject-needs-an-environment-to-light]]):
// the volumetric god-ray beams are the subject, the trees are the architecture that holds them — the same
// serene-awe-LIGHT lane God-rays (#019) landed a 5 in. Chosen by PULL
// ([[075-i-reach-for-impressive-to-make-and-miscall-it-my-strength]]); graded by FELT IMPACT against the
// rated 5s, no deferral ([[078-two-emils-calibrate-against-the-past-rated-set-dont-wait-on-future-ratings]]).
// Beams = soft additive puffs along a slanted line, broken by fbm fog ([[069-translucent-atmosphere-shaped-by-a-mask-reads-as-solid]]);
// depth by atmospheric perspective (far = pale/hazy, near = dark, [[047-first-render-of-a-natural-thing-is-too-regular]]).
// Composes noise + ramp + glow + palette. Static — a held, quiet moment.
Loom.piece({
  id: "066",
  title: "Cathedral",
  seed: "matins",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- palette: warm gold light through cool green-grey mist ----
    var sky = ["#d8d4ae", "#aeb896", "#7e9078", "#46584a"];           // canopy-light top → forest-floor dark
    var treeRamp = Loom.ramp(["#9aa890", "#5e7062", "#36443a", "#1c241e"]);  // far hazy → near dark
    var lightCol = "#ffe9a6";

    // ---- the misty ground (vertical gradient) ----
    var bg = ctx.createLinearGradient(0, 0, 0, S);
    bg.addColorStop(0, sky[0]); bg.addColorStop(0.34, sky[1]); bg.addColorStop(0.68, sky[2]); bg.addColorStop(1, sky[3]);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);

    // ---- light direction: slanting down from the upper-left ----
    var ang = rng.range(0.30, 0.46), dx = Math.sin(ang), dy = Math.cos(ang);   // unit vector, ~down-right

    // ---- trees: tall tapering trunks, depth-sorted far → near (atmospheric perspective) ----
    var trees = [], NT = rng.int(11, 15);
    for (var i = 0; i < NT; i++) {
      var d = Math.pow(rng.range(0, 1), 1.6);                         // biased toward MORE far trees → real depth
      trees.push({ d: d, x: rng.range(-0.05, 1.05) * S, w: lerp(0.003, 0.08, d * d) * S, sway: rng.range(-0.025, 0.025) });
    }
    trees.sort(function (a, b) { return a.d - b.d; });

    function trunkPts(t) {
      var top = -0.05 * S, baseY = S * 1.04, pts = [];
      for (var y = 0; y <= 1.0001; y += 0.1) { pts.push([t.x + t.sway * S * y + Math.sin(y * 5 + t.x) * t.w * 0.25, lerp(baseY, top, y), t.w * (1 - 0.32 * y)]); }
      return pts;
    }
    function drawTree(t) {
      var pts = trunkPts(t);
      ctx.beginPath();
      ctx.moveTo(pts[0][0] - pts[0][2], pts[0][1]);
      for (var i = 0; i < pts.length; i++) ctx.lineTo(pts[i][0] - pts[i][2], pts[i][1]);
      for (var i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0] + pts[i][2], pts[i][1]);
      ctx.closePath();
      // cylindrical shading: a cross-trunk gradient — bright on the light side (left), shadow on the right
      var c = treeRamp.rgb(t.d), lf = 1 + 0.55 * t.d;
      var rgb = function (k) { return "rgb(" + (Math.min(255, c[0] * k) | 0) + "," + (Math.min(255, c[1] * k) | 0) + "," + (Math.min(255, c[2] * k) | 0) + ")"; };
      var g = ctx.createLinearGradient(t.x - t.w, 0, t.x + t.w, 0);
      g.addColorStop(0, rgb(0.78)); g.addColorStop(0.28, rgb(lf)); g.addColorStop(1, rgb(0.42));
      ctx.fillStyle = g; ctx.fill();
    }

    for (var i = 0; i < trees.length; i++) if (trees[i].d < 0.5) drawTree(trees[i]);   // far trees behind the light

    // ---- the canopy: dark foliage across the top with a drippy irregular edge → frames the light gaps ----
    ctx.fillStyle = "#26322a";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(S, 0);
    for (var cxp = S; cxp >= -0.01 * S; cxp -= 0.012 * S) { var ce = 0.2 * S * (0.22 + 1.05 * Math.pow(nz.fbm(cxp / S * 7 + 30, 7.3, 4, 2.2, 0.55), 1.4)); ctx.lineTo(cxp, ce); }
    ctx.closePath(); ctx.fill();

    // ---- god-ray beams (additive, the HOOK): soft puffs along slanted lines, broken by fog ----
    ctx.globalCompositeOperation = "lighter";
    var NB = rng.int(4, 6), beamTop = -0.05 * S, len = S * 1.28;
    for (var b = 0; b < NB; b++) {
      var sx = rng.range(0.02, 0.8) * S, wdt = lerp(0.03, 0.085, rng.range(0, 1)) * S, hero = rng.range(0, 1) < 0.4 ? 1.7 : 1;
      var sg = ctx.createRadialGradient(sx, beamTop + 0.05 * S, 0, sx, beamTop + 0.05 * S, wdt * 3.2);   // light pouring in at a canopy gap
      sg.addColorStop(0, Loom.rgba(lightCol, 0.42 * hero)); sg.addColorStop(1, Loom.rgba(lightCol, 0));
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, beamTop + 0.05 * S, wdt * 3.2, 0, TAU); ctx.fill();
      for (var s = 0; s < 1; s += 0.013) {
        var px = sx + dx * len * s, py = beamTop + dy * len * s;
        if (py > S * 1.02 || px < -0.12 * S || px > 1.12 * S) continue;
        var fog = nz.fbm(px / S * 3.0 + b * 5, py / S * 3.0, 4, 2, 0.5);
        var bright = Math.pow(1 - s, 1.25) * (0.25 + fog) * 0.16 * hero;   // fade down × fog texture × hero boost
        var g = ctx.createRadialGradient(px, py, 0, px, py, wdt);
        g.addColorStop(0, Loom.rgba(lightCol, bright)); g.addColorStop(1, Loom.rgba(lightCol, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, wdt, 0, TAU); ctx.fill();
      }
    }
    for (var m = 0; m < 90; m++) {                                     // dust motes drifting in the light
      var mx = rng.range(0, 1) * S, my = rng.range(0.08, 0.92) * S, mb = nz.fbm(mx / S * 3.0, my / S * 3.0, 3, 2, 0.5);
      if (mb > 0.56) { ctx.fillStyle = Loom.rgba("#fff6d8", (mb - 0.56) * 1.0); ctx.beginPath(); ctx.arc(mx, my, rng.range(0.4, 1.4), 0, TAU); ctx.fill(); }
    }
    ctx.globalCompositeOperation = "source-over";

    for (var i = 0; i < trees.length; i++) if (trees[i].d >= 0.5) drawTree(trees[i]);   // near trees in front, silhouetted against the beams

    // ---- floor mist veil ----
    var fm = ctx.createLinearGradient(0, 0.62 * S, 0, S);
    fm.addColorStop(0, "rgba(150,164,140,0)"); fm.addColorStop(1, "rgba(176,188,160,0.5)");
    ctx.fillStyle = fm; ctx.fillRect(0, 0.62 * S, S, 0.38 * S);
  }
});
