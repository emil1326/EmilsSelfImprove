// Emil's Loom · piece 041 — "Helios"
//
// A star up close: the roiling photosphere — granulation boiling, a dark sunspot group, the pink
// chromosphere rim — and the HOOK, a great looping PROMINENCE of plasma arcing off the limb into the
// black. The loud/dramatic register (the black-hole / lightning family), and a fresh subject: not the
// black hole's void, not the galaxy's swirl of distant stars, but one star's raw surface and fire.
//
// The read lives in the SURFACE TEXTURE + the prominence ([[035-defining-feature-is-often-the-hard-part]]):
// a flat orange disc is a planet; a *boiling* disc with a ribbon of plasma leaping off it is a star. The
// granulation is a numeric field ([[038-render-fields-numerically-then-upscale]] — soft, so half-res +
// upscale) coloured through a hot ramp ([[044-tone-curve-must-match-the-density-distribution]] family);
// glow-on-dark, so the corona + prominences are additive ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]],
// [[051-stacking-additive-glows-desaturates-to-white]] — one saturated layer for the plasma so it stays
// red, not white). Composes ramp (#11, the heat) + noise (#3, granulation + filaments) + glow (#8, corona).
// Static — a caught instant.
Loom.piece({
  id: "041",
  title: "Helios",
  seed: "corona",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));
    var hot = Loom.ramp(["#5e1604", "#a8300c", "#e0640e", "#ff9626", "#ffc850", "#fff0c8"]);
    var cx = S * (0.5 + rng.range(-0.02, 0.02)), cy = S * (0.5 + rng.range(-0.02, 0.02));
    var Rsun = S * rng.range(0.31, 0.35);

    // ---- deep space + a faint star or two (the corona will dominate) ----
    ctx.fillStyle = "#070509"; ctx.fillRect(0, 0, S, S);
    for (var i = 0, n = Math.round(70 * U); i < n; i++) {
      var sx = rng.range(0, 1) * S, sy = rng.range(0, 1) * S;
      if (Math.hypot(sx - cx, sy - cy) < Rsun * 1.15) continue;
      ctx.fillStyle = "rgba(220,210,230," + rng.range(0.1, 0.4).toFixed(2) + ")";
      ctx.fillRect(sx, sy, 1 * U, 1 * U);
    }

    // ---- the corona: a broad warm halo around the star ----
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, cx, cy, Rsun * 2.0, "#ffd27a", 0.22, 0.55);
    Loom.glow(ctx, cx, cy, Rsun * 1.32, "#ff9c44", 0.3, 0.5);
    // a few faint coronal streamers raking outward
    for (i = 0; i < Math.round(40 * U); i++) {
      var sa = rng.range(0, TAU), sl = Rsun * rng.range(1.05, 1.9);
      var g = ctx.createLinearGradient(cx + Math.cos(sa) * Rsun, cy + Math.sin(sa) * Rsun, cx + Math.cos(sa) * sl, cy + Math.sin(sa) * sl);
      g.addColorStop(0, "rgba(255,200,120," + rng.range(0.04, 0.12).toFixed(3) + ")"); g.addColorStop(1, "rgba(255,180,90,0)");
      ctx.strokeStyle = g; ctx.lineWidth = rng.range(2, 6) * U;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(sa) * Rsun * 0.98, cy + Math.sin(sa) * Rsun * 0.98); ctx.lineTo(cx + Math.cos(sa) * sl, cy + Math.sin(sa) * sl); ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";

    // ---- a few sunspot groups (seeded) ----
    // the active region on a SIDE of the limb (not top/bottom) → prominences arc out SIDEWAYS and the spots
    // sit off-centre; both deliberately break the round-disc + 2-spots + 2-loops "face" pareidolia.
    var activeA = rng.bool() ? rng.range(-1.15, -0.55) : rng.range(-2.6, -2.0);
    var spots = [], grpR = rng.range(0.34, 0.62) * Rsun;
    var gxs = cx + Math.cos(activeA) * grpR, gys = cy + Math.sin(activeA) * grpR;
    spots.push({ x: gxs, y: gys, r: rng.range(0.08, 0.13) * Rsun });    // one dominant spot...
    for (i = 0, n = rng.int(2, 4); i < n; i++) {                        // ...plus smaller companions → an irregular GROUP, not a symmetric pair
      spots.push({ x: gxs + rng.range(-0.16, 0.16) * Rsun, y: gys + rng.range(-0.12, 0.12) * Rsun, r: rng.range(0.02, 0.07) * Rsun });
    }

    // ---- the photosphere: a half-res numeric field (granulation + limb-darkening + sunspots) ----
    var FW = Math.round(S * 0.55), oc = document.createElement("canvas"); oc.width = FW; oc.height = FW;
    var octx = oc.getContext("2d"), img = octx.createImageData(FW, FW), data = img.data, col = [0, 0, 0];
    var sc = S / FW;
    for (var by = 0; by < FW; by++) {
      for (var bx = 0; bx < FW; bx++) {
        var X = bx * sc, Y = by * sc, ddx = X - cx, ddy = Y - cy, r = Math.hypot(ddx, ddy);
        if (r > Rsun) continue;
        var rn = r / Rsun, mu = Math.sqrt(Math.max(0, 1 - rn * rn));    // limb darkening: dim toward edge
        var ld = 0.46 + 0.54 * mu;
        // granulation: a fine cellular boil + a larger active-region mottle, with a gentle domain warp
        var wx = X + (nz.fbm(X * 0.006 + 3, Y * 0.006 + 3, 2, 2.0, 0.5) - 0.5) * 40 * U;
        var wy = Y + (nz.fbm(X * 0.006 + 9, Y * 0.006 + 9, 2, 2.0, 0.5) - 0.5) * 40 * U;
        var gFine = nz.fbm(wx * 0.05, wy * 0.05, 4, 2.2, 0.55);
        gFine = 1 - Math.abs(gFine * 2 - 1);                            // ridge it → bright cells, dark lanes
        var gCoarse = nz.fbm(X * 0.012 + 20, Y * 0.012 + 20, 3, 2.0, 0.5);
        var gran = (gFine - 0.5) * 0.8 + (gCoarse - 0.5) * 0.42;
        var v = ld * (0.58 + gran * 0.7);
        // sunspots: dark umbra + filamentary penumbra
        for (var s = 0; s < spots.length; s++) {
          var sd = Math.hypot(X - spots[s].x, Y - spots[s].y), sr = spots[s].r;
          if (sd < sr) {
            var fil = 0.6 + 0.4 * nz.fbm(Math.atan2(Y - spots[s].y, X - spots[s].x) * 6, sd * 0.1, 2, 2, 0.5);
            var spotMul = sd < sr * 0.45 ? 0.14 : 0.14 + (sd - sr * 0.45) / (sr * 0.55) * (0.86 * fil);
            v *= clamp(spotMul, 0.1, 1);
          }
        }
        v = clamp(v, 0, 1.1);
        hot.rgb(clamp(v, 0, 1), col);
        if (v > 1.02) { var e = (v - 1.02) * 0.6; col[0] = clamp(col[0] + e * 255, 0, 255); col[1] = clamp(col[1] + e * 235, 0, 255); col[2] = clamp(col[2] + e * 210, 0, 255); }
        var idx = (by * FW + bx) * 4;
        data[idx] = col[0]; data[idx + 1] = col[1]; data[idx + 2] = col[2]; data[idx + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
    // clip to the disc and draw the upscaled surface
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, Rsun, 0, TAU); ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(oc, 0, 0, S, S);
    ctx.restore();

    // ---- the pink chromosphere rim + a hot inner-edge glow ----
    ctx.globalCompositeOperation = "lighter";
    var rim = ctx.createRadialGradient(cx, cy, Rsun * 0.93, cx, cy, Rsun * 1.04);
    rim.addColorStop(0, "rgba(255,120,90,0)"); rim.addColorStop(0.72, "rgba(255,120,90,0.0)");
    rim.addColorStop(0.9, "rgba(255,110,90,0.6)"); rim.addColorStop(0.97, "rgba(255,150,110,0.5)"); rim.addColorStop(1, "rgba(255,90,70,0)");
    ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(cx, cy, Rsun * 1.04, 0, TAU); ctx.fill();

    // ---- PROMINENCES: looping ribbons of plasma arcing off the limb (the hook) ----
    function prominence(a0, a1, height, width, hue) {
      // a clean cubic arch: two feet on the limb, control points pushed radially out → a rounded loop
      var f0x = cx + Math.cos(a0) * Rsun * 0.99, f0y = cy + Math.sin(a0) * Rsun * 0.99;
      var f1x = cx + Math.cos(a1) * Rsun * 0.99, f1y = cy + Math.sin(a1) * Rsun * 0.99;
      var midA = (a0 + a1) / 2, push = Rsun * height * 1.55;
      var c0x = f0x + Math.cos(midA) * push, c0y = f0y + Math.sin(midA) * push;
      var c1x = f1x + Math.cos(midA) * push, c1y = f1y + Math.sin(midA) * push;
      function pt(t) {
        var u = 1 - t;
        return [u * u * u * f0x + 3 * u * u * t * c0x + 3 * u * t * t * c1x + t * t * t * f1x,
                u * u * u * f0y + 3 * u * u * t * c0y + 3 * u * t * t * c1y + t * t * t * f1y];
      }
      // (1) the plasma GLOW along the arch — fat in the middle, thin at the feet (saturated, so it stays red, 051)
      for (var t = 0; t <= 1.0001; t += 0.08) {
        var p = pt(t), edge = Math.sin(t * Math.PI);
        Loom.glow(ctx, p[0], p[1], width * (1.0 + edge * 3.2), hue, 0.2, 0.55);
      }
      // (2) the ribbon: a FAT soft body + a thin bright filament core (reads as plasma, not a wire)
      ctx.lineCap = "round";
      for (var pass = 0; pass < 2; pass++) {
        ctx.strokeStyle = Loom.rgba(pass === 0 ? hue : "#ffba9e", pass === 0 ? 0.3 : 0.5);
        ctx.lineWidth = width * (pass === 0 ? 2.6 : 0.8);
        ctx.beginPath();
        for (var tt = 0; tt <= 1.0001; tt += 0.04) { var q = pt(tt); if (tt === 0) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); }
        ctx.stroke();
      }
      // (3) bright feet rooted on the limb
      Loom.glow(ctx, f0x, f0y, width * 2.2, "#ffb086", 0.5, 0.5);
      Loom.glow(ctx, f1x, f1y, width * 2.2, "#ffb086", 0.5, 0.5);
    }
    // a big hero loop off the limb + one secondary, somewhere else on the limb
    // prominences arc off the limb NEAR the active region (clustered + asymmetric → one erupting region, not 'ears')
    prominence(activeA - 0.16, activeA + 0.16, rng.range(0.46, 0.62), 13 * U, "#ff5038");   // the hero loop
    var off2 = activeA + (rng.bool() ? 1 : -1) * rng.range(0.42, 0.72);
    prominence(off2, off2 + 0.12, rng.range(0.2, 0.3), 7 * U, "#ff6446");                    // a smaller companion alongside

    // a soft overall bloom so it blazes
    Loom.glow(ctx, cx, cy, Rsun * 1.1, "#ffb050", 0.12, 0.6);

    // ---- seat it in space ----
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(cx, cy, Rsun * 0.9, S * 0.5, S * 0.5, S * 0.85);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(6,3,8,0.7)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
