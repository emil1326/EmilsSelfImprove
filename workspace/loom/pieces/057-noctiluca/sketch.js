// Emil's Loom · piece 057 — "Noctiluca"
//
// A bioluminescent sea at night. Noctiluca scintillans — "sparkling night-light" — is a plankton that
// flashes cold blue when the water is disturbed, so on the right night the whole shoreline catches fire
// with living light: every breaking wave, every footprint, a line of electric blue in the dark. It looks
// impossible; it's real. The HOOK ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]): the
// "wait, that's a *real place*?" wonder of the blue fire, plus the soul of a lone walker leaving a glowing
// wake behind them. A magic/awe register after the loud volcano (#056) — and the light DEFINES the surf's
// shape, sidestepping the daylight-wave legibility grind that killed #033.
//
// The CRUX ([[035-defining-feature-is-often-the-hard-part]]): the glow reading as a LIVING SEA — breaking
// waves as lacy, scalloped lines of cold light, not glowing blobs — so it's a per-pixel additive glow field
// ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]] / lib/field.js #16) summed from each wave's
// noise-broken foam. Composes field + noise + glow. Static.
Loom.piece({
  id: "057",
  title: "Noctiluca",
  seed: "scintillans",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    var horizon = S * rng.range(0.34, 0.42);
    var beachY = S * rng.range(0.62, 0.70);

    // ---- night sky: deep blue-black, a faint cool airglow at the horizon, stars ----
    var sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, "#05080f"); sky.addColorStop(0.7, "#070d18"); sky.addColorStop(1, "#0b1626");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, horizon + 1);
    for (var st = 0, ns = Math.round(220 * U); st < ns; st++) {
      var sx = rng.range(0, S), sy = rng.range(0, horizon * 0.98), mag = rng.range(0.1, 0.7);
      ctx.fillStyle = "rgba(210,224,245," + mag + ")";
      ctx.fillRect(sx, sy, rng.range(0.6, 1.5) * U, rng.range(0.6, 1.5) * U);
    }

    // ---- the dark sea ----
    var sea = ctx.createLinearGradient(0, horizon, 0, beachY);
    sea.addColorStop(0, "#091622"); sea.addColorStop(1, "#04080e");
    ctx.fillStyle = sea; ctx.fillRect(0, horizon, S, beachY - horizon);

    // ---- the bioluminescent surf: breaking waves as lacy lines of cold blue light (additive glow field) ----
    var nW = rng.int(10, 15), waves = [];
    for (var w = 0; w < nW; w++) {
      var t = w / (nW - 1);                                 // 0 at horizon → 1 near the beach
      waves.push({ y: horizon + (beachY - horizon) * (t * t * 0.62 + t * 0.38), t: t, sd: w * 7.3 + 3 });
    }
    var FW = Math.round(Math.min(S, 900) * 0.82), sc = S / FW;
    var seaGlow = Loom.field(FW, function (x, y, out) {
      var X = x * sc, Y = y * sc;
      out[0] = out[1] = out[2] = 0;                         // black = adds nothing under "lighter"
      if (Y < horizon - 2 || Y > beachY + 4) return;
      var g = 0;
      for (var i = 0; i < waves.length; i++) {
        var wv = waves[i], fall = (2.5 + 9 * wv.t) * U, bdy = Y - wv.y;
        if (bdy < -fall * 3.2 || bdy > fall * 3.2) continue;  // coarse skip (before any noise)
        var scal = (nz.fbm(X * 0.009 + wv.sd, 1.5, 2, 2, 0.5) - 0.5) * (5 + 20 * wv.t) * U;  // gentle wide undulation
        var dy = bdy - scal;
        if (dy < -fall * 2.6 || dy > fall * 2.6) continue;
        var foam = clamp((nz.fbm(X * 0.011 + wv.sd * 2, wv.sd, 3, 2, 0.55) - 0.42) * 3.0, 0, 1);  // lacy gaps ALONG the line
        if (foam < 0.02) continue;
        var prof = dy < 0 ? Math.exp(-dy * dy / (fall * fall * 0.5)) : Math.exp(-dy * dy / (fall * fall * 1.4));  // crisp crest, soft face below
        g += foam * prof * (0.3 + 0.55 * wv.t + 0.75 * wv.t * wv.t);   // near shorebreak much brighter
      }
      var wht = clamp((g - 0.7) * 1.3, 0, 1);               // brightest foam goes white-blue
      out[0] = clamp(45 * g + 180 * wht, 0, 255);
      out[1] = clamp(195 * g + 60 * wht, 0, 255);
      out[2] = clamp(235 * g + 30 * wht, 0, 255);
    });
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.drawImage(seaGlow, 0, 0, S, S); ctx.restore();

    // ---- the wet beach: dark sand, faintly mirroring the glow + a glowing wash at the waterline ----
    var beach = ctx.createLinearGradient(0, beachY, 0, S);
    beach.addColorStop(0, "#070c12"); beach.addColorStop(1, "#03060a");
    ctx.fillStyle = beach; ctx.fillRect(0, beachY, S, S - beachY);
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    var washGlow = ctx.createLinearGradient(0, beachY - S * 0.01, 0, beachY + S * 0.14);  // glow reflected onto wet sand
    washGlow.addColorStop(0, "rgba(40,150,190,0.5)"); washGlow.addColorStop(1, "rgba(20,80,120,0)");
    ctx.fillStyle = washGlow; ctx.fillRect(0, beachY - S * 0.01, S, S * 0.15);
    ctx.restore();

    // ---- the figure: a lone walker in the glowing shallows, trailing a wake of light (soul + [[071]]) ----
    var figSide = rng.bool(0.5) ? 1 : -1;
    var figX = S * 0.5 - figSide * S * rng.range(0.04, 0.18), figY = beachY + S * rng.range(0.05, 0.11);
    var fh = S * rng.range(0.10, 0.135);
    ctx.save(); ctx.globalCompositeOperation = "lighter";              // the glowing wake: footprints receding behind
    for (var fp = 1; fp <= 8; fp++) {
      var px = figX + figSide * fp * S * 0.02 * rng.range(0.85, 1.15) + rng.range(-3, 3) * U;
      var py = figY + fp * S * 0.014 * rng.range(0.85, 1.15);
      if (py > S - 4) break;
      var fa = clamp(1 - fp * 0.11, 0, 1);
      Loom.glow(ctx, px, py, 9 * U * (0.6 + fa), "#5ce0ff", fa * 0.55, 0.5);
    }
    Loom.glow(ctx, figX, figY + fh * 0.02, 26 * U, "#7ce8ff", 0.6, 0.5);  // disturbed water at the feet
    ctx.restore();
    ctx.fillStyle = "#02050a";                                        // the silhouette (facing the sea)
    var legH = fh * 0.46, torsoH = fh * 0.34, headR = fh * 0.07, hipW = fh * 0.048, shW = fh * 0.1;
    ctx.beginPath(); ctx.moveTo(figX - hipW * 1.5, figY); ctx.lineTo(figX - hipW * 0.4, figY - legH); ctx.lineTo(figX - hipW * 0.05, figY - legH); ctx.lineTo(figX - hipW * 0.1, figY); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(figX + hipW * 1.5, figY); ctx.lineTo(figX + hipW * 0.4, figY - legH); ctx.lineTo(figX + hipW * 0.05, figY - legH); ctx.lineTo(figX + hipW * 0.1, figY); ctx.closePath(); ctx.fill();
    var ty = figY - legH;
    ctx.beginPath(); ctx.moveTo(figX - hipW * 1.3, ty + 2); ctx.lineTo(figX - shW, ty - torsoH); ctx.lineTo(figX + shW, ty - torsoH); ctx.lineTo(figX + hipW * 1.3, ty + 2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(figX, ty - torsoH - headR * 0.7, headR, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(130,225,255,0.4)"; ctx.lineWidth = 1 * U;  // a faint cyan rim from the sea
    ctx.beginPath(); ctx.moveTo(figX - shW * 0.9, ty - torsoH * 0.55); ctx.lineTo(figX - hipW * 1.15, ty); ctx.stroke();

    // ---- a soft vignette ----
    var vg = ctx.createRadialGradient(S * 0.5, beachY, S * 0.32, S * 0.5, beachY, S * 0.8);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(1,3,6,0.5)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
