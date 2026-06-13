// Emil's Loom · piece 046 — "Geode"
//
// A geode cracked open: a rough stone rind, then concentric AGATE bands rippling inward in their banded
// colour, and at the heart the payoff — a cluster of sparkling crystal druse. The mineral/crystalline
// register the gallery never had (closest is Strata's rock, but that's landscape; this is the jewel
// hidden in a dull stone). A deliberate CLEAN-WIN swing after the six-pass Leviathan grind: a FIELD piece,
// no silhouette legibility gate ([[061-when-attempts-fail-alike-the-bug-is-in-what-they-share]] — play to
// field-rendering strength, not the representational trap), in the lane where Strata/lava/caustics all
// came together fast.
//
// The bands are a numeric field ([[038-render-fields-numerically-then-upscale]]): each pixel's distance to
// the IRREGULAR cavity rim (t = r / Rcav(θ), so the bands stay concentric to the organic rim, not a
// circle), warped by noise for the wavy agate look, mapped through an alternating-stop ramp (the bands).
// The HOOK is the crystal centre ([[035-defining-feature-is-often-the-hard-part]]): bands alone are a
// target; the sparkling druse is what makes it a GEODE — built full-res ON TOP so its glints stay crisp
// (the 038 caveat — soft field upscaled, sharp sparkle drawn sharp). Agate TYPE is seed-varied (amethyst /
// blue-lace / carnelian / verde) → a different stone each weave, judged across seeds
// ([[058-random-features-form-accidental-faces-check-many-seeds]]). Composes noise (#3) + ramp (#11) +
// glow (#8) + palette helpers. Static. No new primitive (just harvested sphere #15 at #71 — compose, 054/060).
Loom.piece({
  id: "046",
  title: "Geode",
  seed: "vesper",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- agate type (seed-varied): bands run t=0 CENTRE → t=1 RIM ----
    var types = {
      amethyst: { bands: ["#efe6f7", "#8a6aae", "#d8c4ec", "#6a4a8e", "#c0a0e0", "#543a78", "#a07cc8", "#3e2a5c", "#7a5aa0", "#2a1c40"], crystal: "#c8a8e8", crystalHi: "#f4e8fc", rock0: "#5a5660", rock1: "#332f38", glow: "#b890e0" },
      bluelace: { bands: ["#eef4fa", "#7a9ac0", "#cfe0f0", "#5a7aa8", "#a8c4e0", "#46608c", "#86a8d0", "#324868", "#6a8cb8", "#22344c"], crystal: "#bcd6f2", crystalHi: "#f0f8ff", rock0: "#54585f", rock1: "#2e3036", glow: "#9cc0ec" },
      carnelian: { bands: ["#fbeede", "#d09a5a", "#f0d2a8", "#b8763a", "#e8b884", "#9a5a2c", "#d8a070", "#7a4422", "#c08858", "#54301a"], crystal: "#f0d8b0", crystalHi: "#fff6e6", rock0: "#5e4d40", rock1: "#352a22", glow: "#e0a868" },
      verde: { bands: ["#eef4ec", "#7aa88a", "#cfe4d2", "#5a8a6c", "#a8d0b2", "#467a58", "#86b894", "#325a40", "#6a9a78", "#1e3a28"], crystal: "#cfead8", crystalHi: "#f0faf2", rock0: "#4e5650", rock1: "#2a302c", glow: "#86c49a" }
    };
    var T = types[rng.pick(["amethyst", "amethyst", "bluelace", "carnelian", "verde"])];
    var agate = Loom.ramp(T.bands);

    var cx = S * (0.5 + rng.range(-0.03, 0.03)), cy = S * (0.5 + rng.range(-0.03, 0.03));
    var Rout0 = S * rng.range(0.40, 0.44);                       // outer rock edge
    var Rcav0 = Rout0 * rng.range(0.84, 0.9);                    // the agate cavity rim
    var bandPhase = rng.range(0, TAU), wob = rng.range(0.07, 0.12);

    // irregular-rim helpers (periodic in angle via fbm on cos/sin → no seam), cached in LUTs
    var LUT = 1440, rcav = new Float32Array(LUT + 1), rout = new Float32Array(LUT + 1);
    for (var i = 0; i <= LUT; i++) {
      var a = i / LUT * TAU, ca = Math.cos(a), sa = Math.sin(a);
      rcav[i] = Rcav0 * (1 + 0.13 * (nz.fbm(ca * 1.7 + 10, sa * 1.7 + 10, 3, 2, 0.5) - 0.5) * 2);
      rout[i] = Rout0 * (1 + 0.09 * (nz.fbm(ca * 1.5 + 30, sa * 1.5 + 30, 3, 2, 0.5) - 0.5) * 2);
    }
    function lut(arr, ang) { var f = (ang < 0 ? ang + TAU : ang) / TAU * LUT; var k = f | 0; return arr[k] + (arr[k + 1] - arr[k]) * (f - k); }
    function blob(arr, scale) {
      var p = new Path2D();
      for (var j = 0; j <= LUT; j += 4) { var a = j / LUT * TAU, rr = arr[j] * scale, px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr; if (j === 0) p.moveTo(px, py); else p.lineTo(px, py); }
      p.closePath(); return p;
    }

    // ---- background: a dark surface the geode sits on ----
    var bg = ctx.createRadialGradient(cx, cy, Rout0 * 0.5, cx, cy, S * 0.85);
    bg.addColorStop(0, "#161922"); bg.addColorStop(1, "#0a0c11");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    // a soft contact shadow under the stone
    var sh = ctx.createRadialGradient(cx, cy + Rout0 * 0.1, Rout0 * 0.6, cx, cy + Rout0 * 0.16, Rout0 * 1.25);
    sh.addColorStop(0, "rgba(0,0,0,0.5)"); sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh; ctx.fillRect(0, 0, S, S);

    // ---- the rough rock rind (the host stone) ----
    var rockPath = blob(rout, 1);
    ctx.save(); ctx.clip(rockPath);
    var rg = ctx.createLinearGradient(cx - Rout0, cy - Rout0, cx + Rout0, cy + Rout0);
    rg.addColorStop(0, T.rock0); rg.addColorStop(1, T.rock1);
    ctx.fillStyle = rg; ctx.fillRect(0, 0, S, S);
    // rocky speckle
    for (var k = 0, nk = Math.round(900 * U); k < nk; k++) {
      var rx = cx + rng.range(-1, 1) * Rout0, ry = cy + rng.range(-1, 1) * Rout0;
      ctx.fillStyle = Loom.rgba(rng.bool(0.5) ? T.rock0 : "#000000", rng.range(0.04, 0.14));
      ctx.fillRect(rx, ry, rng.range(1, 2.4) * U, rng.range(1, 2.4) * U);
    }
    ctx.restore();
    // a thin light catch on the upper-left rim edge
    ctx.save(); ctx.clip(rockPath); ctx.globalCompositeOperation = "lighter";
    var rl = ctx.createRadialGradient(cx - Rout0 * 0.4, cy - Rout0 * 0.4, Rout0 * 0.6, cx, cy, Rout0);
    rl.addColorStop(0, "rgba(255,255,255,0)"); rl.addColorStop(0.86, "rgba(255,255,255,0)"); rl.addColorStop(1, "rgba(220,225,235,0.16)");
    ctx.fillStyle = rl; ctx.fillRect(0, 0, S, S); ctx.restore();

    // ---- the AGATE bands: a numeric field over the cavity, upscaled ----
    var FW = Math.round(S * 0.66), sc = S / FW, oc = document.createElement("canvas");
    oc.width = FW; oc.height = FW;
    var octx = oc.getContext("2d"), img = octx.createImageData(FW, FW), data = img.data, col = [0, 0, 0];
    var Rcr = Rcav0 * rng.range(0.24, 0.32);                     // crystal-centre radius (bands fade into it)
    for (var by = 0; by < FW; by++) {
      for (var bx = 0; bx < FW; bx++) {
        var X = bx * sc, Y = by * sc, ddx = X - cx, ddy = Y - cy, r = Math.sqrt(ddx * ddx + ddy * ddy);
        var ang = Math.atan2(ddy, ddx), Rc = lut(rcav, ang);
        if (r > Rc) continue;                                    // outside the cavity → rock shows through
        var t = r / Rc;                                          // 0 centre → 1 rim
        var warp = nz.fbm(X * 0.009 + 5, Y * 0.009 + 5, 4, 2.1, 0.55) - 0.5;
        var tw = clamp(t + warp * wob, 0, 1);
        // a fine stripe modulation on top of the banded ramp (crisper agate layering, finer toward the rim)
        var stripe = Math.sin(tw * TAU * 9 * (0.5 + tw) + bandPhase + warp * 2);
        var tc = clamp(tw + stripe * 0.018, 0, 1);
        agate.rgb(tc, col);
        var lite = 1 + stripe * 0.07;                            // subtle band relief
        var i2 = (by * FW + bx) * 4;
        data[i2] = clamp(col[0] * lite, 0, 255); data[i2 + 1] = clamp(col[1] * lite, 0, 255); data[i2 + 2] = clamp(col[2] * lite, 0, 255);
        // fade the innermost bands toward the crystal centre so the druse reads as the core
        data[i2 + 3] = 255 * clamp((r - Rcr * 0.7) / (Rcr * 0.5), 0, 1);
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.save(); ctx.clip(blob(rcav, 1));
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(oc, 0, 0, S, S);
    ctx.restore();

    // a soft luminous lift from the centre (agate reads as translucent, lit from within)
    ctx.save(); ctx.clip(blob(rcav, 1)); ctx.globalCompositeOperation = "lighter";
    var inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rcav0 * 0.9);
    inner.addColorStop(0, Loom.rgba(T.glow, 0.16)); inner.addColorStop(1, Loom.rgba(T.glow, 0));
    ctx.fillStyle = inner; ctx.fillRect(0, 0, S, S); ctx.restore();

    // ---- the CRYSTAL DRUSE at the heart (the hook) — a luminous bed of sparkling facets, full-res ----
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, Rcr, 0, TAU); ctx.clip();
    var cb = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rcr);   // a dim crystalline bed (mid-tone so bright facets pop)
    cb.addColorStop(0, Loom.mix(T.crystal, T.rock1, 0.45)); cb.addColorStop(1, Loom.mix(T.rock1, T.crystal, 0.25));
    ctx.fillStyle = cb; ctx.beginPath(); ctx.arc(cx, cy, Rcr, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = "lighter";                    // a soft inner luminosity (crystals glow)
    var cgl = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rcr);
    cgl.addColorStop(0, Loom.rgba(T.glow, 0.3)); cgl.addColorStop(1, Loom.rgba(T.glow, 0));
    ctx.fillStyle = cgl; ctx.beginPath(); ctx.arc(cx, cy, Rcr, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    // packed faceted crystals — denser toward the centre, smaller toward the edge; all light + glassy
    var nCr = Math.round(120 * U);
    for (var c = 0; c < nCr; c++) {
      var cd = Math.pow(rng.range(0, 1), 0.6) * Rcr * 0.97, ca = rng.range(0, TAU);
      var px = cx + Math.cos(ca) * cd, py = cy + Math.sin(ca) * cd;
      var sz = (1 - cd / Rcr * 0.5) * rng.range(8, 19) * U;
      drawCrystal(px, py, sz, rng.range(0, TAU), rng.range(0, 1));
    }
    // sparkle glints — bright stars on the most-catching facets
    ctx.globalCompositeOperation = "lighter";
    for (var g = 0, ng = Math.round(20 * U); g < ng; g++) {
      var gd = Math.pow(rng.range(0, 1), 0.8) * Rcr * 0.85, ga = rng.range(0, TAU);
      var gx = cx + Math.cos(ga) * gd, gy = cy + Math.sin(ga) * gd, gs = rng.range(3, 9) * U;
      Loom.glow(ctx, gx, gy, gs * 2.4, T.crystalHi, 0.55, 0.5);
      ctx.strokeStyle = Loom.rgba(T.crystalHi, rng.range(0.55, 0.95)); ctx.lineWidth = 1 * U;
      ctx.beginPath(); ctx.moveTo(gx - gs, gy); ctx.lineTo(gx + gs, gy); ctx.moveTo(gx, gy - gs); ctx.lineTo(gx, gy + gs); ctx.stroke();
    }
    ctx.restore();

    function drawCrystal(px, py, sz, rot, lv) {
      // a small glassy gem: two facets — a bright lit triangle + a dimmer shaded one — + a corner glint
      var p = [];
      for (var q = 0; q < 4; q++) { var aa = rot + q / 4 * TAU + (q % 2 ? 0.45 : -0.25), rr = sz * (q % 2 ? 0.62 : 1); p.push([px + Math.cos(aa) * rr, py + Math.sin(aa) * rr]); }
      ctx.fillStyle = Loom.rgba(Loom.mix(T.crystalHi, T.crystal, 0.2 + lv * 0.3), 0.92);   // lit facet
      ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); ctx.lineTo(p[1][0], p[1][1]); ctx.lineTo(p[2][0], p[2][1]); ctx.closePath(); ctx.fill();
      ctx.fillStyle = Loom.rgba(Loom.mix(T.crystal, T.glow, 0.45), 0.82);                  // shaded facet
      ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); ctx.lineTo(p[2][0], p[2][1]); ctx.lineTo(p[3][0], p[3][1]); ctx.closePath(); ctx.fill();
      ctx.fillStyle = Loom.rgba(T.crystalHi, 0.6 + lv * 0.35);                             // bright corner glint
      ctx.beginPath(); ctx.arc(p[1][0], p[1][1], sz * 0.2, 0, TAU); ctx.fill();
    }

    // ---- polish: a faint outer glow grounding it + a vignette ----
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, cx, cy, Rout0 * 1.15, T.glow, 0.07, 0.6);
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(cx, cy, Rout0 * 0.7, cx, cy, S * 0.78);
    vg.addColorStop(0, "rgba(6,7,11,0)"); vg.addColorStop(1, "rgba(5,6,10,0.66)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
