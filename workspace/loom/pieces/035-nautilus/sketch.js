// Emil's Loom · piece 035 — "Chambered"
//
// A nautilus shell, cut to show its chambered logarithmic spiral — the most elegant form in nature,
// lined with iridescent mother-of-pearl. A fresh register for the gallery: a still-life OBJECT, not a
// creature or a scene. Two hooks (the #55 "needs a hook"): the maths (a true log spiral, each whorl the
// golden ratio bigger than the last) and the NACRE — the pearlescent shimmer that drifts pink→blue→green
// across the surface, a sheen the Loom has never made.
//
// The whole read is tightly-nested whorls + the chamber septa ([[035-defining-feature-is-often-the-hard-part]]).
// First attempt brushed the tube as overlapping circles (Mimic's arm idiom) and got a corrugated, gappy
// hose — wrong tool. The right one is a NUMERIC per-pixel inverse log-spiral: for each pixel find which
// whorl it's in (r = Rmax·growth^(−φ/2π) ⇒ φ = −2π·ln(r/Rmax)/ln growth), shade the rounded cross-whorl
// bulge, darken the sutures + the septa, drift the nacre hue along the spiral. Tight whorls, smooth pearl.
// Pale nacre on a dark ground needs the tonal range to glow ([[022-luminosity-on-bright-is-tone]]).
// Composes noise (#3, faint nacre mottle) + glow (#8, the spotlight) + the palette helpers. Static.
Loom.piece({
  id: "035",
  title: "Chambered",
  seed: "nacre",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, PI = Math.PI, U = S / 760;
    var cx = S * 0.5, cy = S * 0.5;
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- a dark still-life backdrop with a soft spotlight where the shell sits ----
    var g = ctx.createLinearGradient(0, 0, 0, S);
    g.addColorStop(0, "#151926"); g.addColorStop(1, "#090b11");
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, cx - S * 0.05, cy - S * 0.07, S * 0.52, "#3c4660", 0.5, 0.6);
    ctx.globalCompositeOperation = "source-over";

    // ---- nacre: a drifting pearl tint ----
    var hues = [Loom.hexToRgb("#f2d6da"), Loom.hexToRgb("#cfe0ef"), Loom.hexToRgb("#d2ecdc"), Loom.hexToRgb("#f4eccc"), Loom.hexToRgb("#e6d2ee")];
    function nacre(u) {
      var f = (u % 1 + 1) % 1 * (hues.length);
      var i = Math.floor(f) % hues.length, t = f - Math.floor(f), a = hues[i], b = hues[(i + 1) % hues.length];
      return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
    }

    // ---- the shell: a NUMERIC inverse log-spiral, rendered to a buffer then upscaled ----
    var turns = rng.range(3.1, 3.9), growth = rng.range(1.55, 1.64), Rmax = S * rng.range(0.34, 0.38);
    var phase = rng.range(0, TAU), hueShift = rng.range(0, 1);             // per-seed orientation + nacre tint
    var thetaEnd = turns * TAU, lnG = Math.log(growth), dphi = TAU / (5.5 + rng.range(0, 3));   // chambers/whorl
    var W = Math.round(S * 0.82), H = W, sc = W / S;
    var oc = document.createElement("canvas"); oc.width = W; oc.height = H;
    var octx = oc.getContext("2d"), img = octx.createImageData(W, H), data = img.data;
    var bcx = cx * sc, bcy = cy * sc, bR = Rmax * sc;
    var rmin = bR * Math.pow(growth, -thetaEnd / TAU);       // the tiny innermost chambers
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var dx = x - bcx, dy = y - bcy, r = Math.sqrt(dx * dx + dy * dy);
        if (r > bR || r < rmin * 0.7) continue;
        var th = Math.atan2(dy, dx) - phase; th = ((th % TAU) + TAU) % TAU;     // [0,2π)
        var phir = -TAU * Math.log(r / bR) / lnG;            // continuous total-angle at this radius
        if (phir < 0) continue;
        var k = Math.floor((phir - th) / TAU);
        if (k < -1) continue;                                // allow the outer lip (k=-1) so the aperture seam fills, not a notch
        var phiSut = th + k * TAU;                           // outer suture's total-angle for this whorl
        if (phiSut > thetaEnd) continue;
        var s = Math.max(0, Math.min(1, (phir - phiSut) / TAU));   // 0 at the outer suture … 1 at the inner one
        // rounded cross-whorl bulge + a light from the upper-left + suture shadow
        var bulge = Math.sin(s * PI);
        var lightUL = 0.5 + 0.5 * (-(dx + dy) / (r + 1));    // upper-left brighter
        var shade = (0.34 + 0.6 * bulge) * (0.72 + 0.4 * lightUL);
        var sut = Math.min(s, 1 - s); shade *= 0.5 + 0.5 * Math.min(1, sut * 7);   // darken the seams between whorls
        // septum (chamber wall): a smooth darker band every dphi along the spiral
        var ph = phir % dphi, sepd = Math.min(ph, dphi - ph) / dphi, sw = 0.08;
        if (sepd < sw) { var sf = sepd / sw; shade *= 0.42 + sf * sf * 0.58; }
        var mott = 1 + 0.12 * (nz.fbm(x / W * 9, y / W * 9, 2, 2.0, 0.5) - 0.5);    // faint nacre mottle
        var nc = nacre(Math.sin(phir * 0.85) * 0.5 + 0.5 + s * 0.1 + hueShift);
        shade = Math.max(0, Math.min(1.3, shade * mott));
        var idx = (y * W + x) * 4;
        data[idx] = Math.min(255, nc.r * shade); data[idx + 1] = Math.min(255, nc.g * shade); data[idx + 2] = Math.min(255, nc.b * shade); data[idx + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(oc, 0, 0, S, S);

    // ---- a faint iridescent wash over the shell + a soft contact glow under it ----
    ctx.globalCompositeOperation = "lighter";
    var ir = ctx.createLinearGradient(cx - Rmax, cy - Rmax, cx + Rmax, cy + Rmax);
    ir.addColorStop(0, "rgba(120,150,205,0.06)"); ir.addColorStop(0.5, "rgba(190,150,205,0.05)"); ir.addColorStop(1, "rgba(150,205,175,0.06)");
    ctx.fillStyle = ir; ctx.beginPath(); ctx.arc(cx, cy, Rmax, 0, TAU); ctx.fill();

    // ---- vignette ----
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(cx, cy, S * 0.3, S * 0.5, S * 0.52, S * 0.78);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(4,5,9,0.62)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
