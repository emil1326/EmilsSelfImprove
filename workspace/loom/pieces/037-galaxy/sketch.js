// Emil's Loom · piece 037 — "Island Universe"
//
// A grand-design spiral galaxy, seen face-on and tilted: a luminous swirl of a few hundred billion stars,
// a golden core, two great arms threaded with dark dust lanes and lit by pink star-forming nebulae. The
// HOOK is cosmic awe — and, deliberately, a DIFFERENT awe from the black hole (#033): that was a void with
// a hot disk; this is the opposite, pure light, resolved into stars. The read lives in the SPIRAL made of
// STARS ([[035-defining-feature-is-often-the-hard-part]]) — without arm-clustered resolved points + dust
// lanes it's just a glowing smudge; with them it's unmistakably a galaxy.
//
// Glow-on-dark, so light is additive ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]]); stars
// are CRISP tight points, not soft haze, and the pink nebulae are ONE saturated layer so they stay pink
// instead of clipping to cream ([[051-stacking-additive-glows-desaturates-to-white]]). Real galaxies are
// FLOCCULENT, not clean — the arms get broken up by noise + scatter so the first render isn't too regular
// ([[047-first-render-of-a-natural-thing-is-too-regular]]). The smooth disk-glow is a half-res numeric field
// ([[038-render-fields-numerically-then-upscale]]); the stars are full-res on top. Composes ramp (#11, the
// gold->blue disk) + noise (#3, flocculent arms + dust) + glow (#8, core + nebulae). Static.
Loom.piece({
  id: "037",
  title: "Island Universe",
  seed: "whirlpool",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var nz = Loom.noise(rng.int(1, 999999));
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

    // ---- the galaxy's shape: a tilted disk with N logarithmic-spiral arms ----
    var cx = S * (0.5 + rng.range(-0.03, 0.03)), cy = S * (0.5 + rng.range(-0.03, 0.03));
    var rMax = S * 0.40, rCore = rMax * 0.058;                 // disk radius / bulge radius (disk-space units)
    var numArms = rng.pick([2, 2, 2, 3]);                      // favour grand-design 2-arm
    var windDir = rng.pick([-1, 1]);                           // handedness
    var swirl = rng.range(2.3, 3.0);                           // radians of winding per e-fold of radius (~1.1 turns)
    var squash = rng.range(0.60, 0.84), PA = rng.range(0, TAU);// inclination (minor-axis squash) + position angle
    var cosPA = Math.cos(PA), sinPA = Math.sin(PA);

    // disk-space (dx,dy centred at origin) -> screen
    function toScreen(dx, dy) {
      var sx = dx, sy = dy * squash;
      return [cx + sx * cosPA - sy * sinPA, cy + sx * sinPA + sy * cosPA];
    }
    // the angle of arm m's centreline at radius r (the log spiral)
    function armTheta(r, m) {
      return m * TAU / numArms + windDir * swirl * Math.log(Math.max(r, rCore * 0.3) / rCore);
    }

    var space = "#05050e";
    ctx.fillStyle = space; ctx.fillRect(0, 0, S, S);

    // ---- distant background stars (behind the galaxy) ----
    for (var i = 0, nbg = Math.round(280 * U); i < nbg; i++) {
      var bx = rng.range(0, 1) * S, by = rng.range(0, 1) * S, bb = rng.range(0, 1);
      ctx.fillStyle = "rgba(" + (200 + bb * 55 | 0) + "," + (210 + bb * 45 | 0) + ",255," + (0.12 + bb * 0.4).toFixed(2) + ")";
      ctx.fillRect(bx, by, (bb > 0.92 ? 1.6 : 1) * U, (bb > 0.92 ? 1.6 : 1) * U);
    }

    ctx.globalCompositeOperation = "lighter";

    // ---- a broad faint galactic halo so the disk has no hard edge ----
    Loom.glow(ctx, cx, cy, rMax * 1.5, "#4a4a86", 0.10, 0.6);

    // ---- the smooth disk glow: a half-res numeric field (core + arm haze + dust lanes + gold->blue colour) ----
    var galRamp = Loom.ramp(["#fff4d6", "#ffe1ac", "#ffce9e", "#e6d2c6", "#bcccff", "#93b0ff"]);
    var FW = Math.round(S * 0.5), oc = document.createElement("canvas"); oc.width = FW; oc.height = FW;
    var octx = oc.getContext("2d"), img = octx.createImageData(FW, FW), data = img.data, col = [0, 0, 0];
    var sc = S / FW;                                           // buffer px -> screen px
    var armSharp = 1.8, dustShift = -0.55, dustSharp = 2.6, dustStr = 0.66;
    for (var by2 = 0; by2 < FW; by2++) {
      for (var bx2 = 0; bx2 < FW; bx2++) {
        // buffer px -> screen -> inverse tilt -> disk polar
        var X = bx2 * sc, Y = by2 * sc, rx = X - cx, ry = Y - cy;
        var ux = rx * cosPA + ry * sinPA, uy = (-rx * sinPA + ry * cosPA) / squash;
        var r = Math.hypot(ux, uy);
        if (r > rMax * 1.18) continue;
        var th = Math.atan2(uy, ux);
        var diskFall = Math.exp(-r / (rMax * 0.34));            // exponential disk
        var bulge = Math.exp(-Math.pow(r / (rCore * 2.0), 1.15));
        var phase = numArms * (th - windDir * swirl * Math.log(Math.max(r, rCore * 0.3) / rCore));
        var arm = Math.pow(0.5 + 0.5 * Math.cos(phase), armSharp);
        var nf = nz.fbm(ux * 0.012 + 5, uy * 0.012 + 5, 4, 2.0, 0.55);   // flocculent break-up
        arm *= clamp(0.30 + 1.25 * nf, 0, 1.6);
        var dust = Math.pow(0.5 + 0.5 * Math.cos(phase - dustShift), dustSharp);
        dust *= clamp(0.4 + 1.1 * nz.fbm(ux * 0.02 + 20, uy * 0.02 + 20, 3, 2.0, 0.5), 0, 1.4);
        var v = bulge * 1.15 + diskFall * (0.12 + arm * 1.05);
        v *= (1 - clamp(dust * dustStr * clamp(diskFall * 2.2, 0, 1), 0, 0.85));
        if (v < 0.015) continue;
        var radialT = clamp(r / rMax, 0, 1);
        galRamp.rgb(radialT, col);
        var bb2 = arm * 0.32 * (0.3 + 0.7 * radialT);            // young-blue boost along the arms
        col[0] = col[0] * (1 - bb2) + 180 * bb2;
        col[1] = col[1] * (1 - bb2) + 205 * bb2;
        col[2] = col[2] * (1 - bb2) + 255 * bb2;
        var a = clamp(v * 235, 0, 255) | 0;
        var idx = (by2 * FW + bx2) * 4;
        data[idx] = col[0]; data[idx + 1] = col[1]; data[idx + 2] = col[2]; data[idx + 3] = a;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(oc, 0, 0, S, S);

    // ---- the golden core bulge ----
    Loom.glow(ctx, cx, cy, rCore * 7.5, "#ffe2a6", 0.42, 0.5);
    Loom.glow(ctx, cx, cy, rCore * 3.2, "#fff4d8", 0.7, 0.42);

    // ---- resolved stars: arm-clustered + smooth disk + dense core (crisp additive points) ----
    function star(X, Y, sz, cr, cg, cb, a) {
      ctx.fillStyle = "rgba(" + cr + "," + cg + "," + cb + "," + a.toFixed(3) + ")";
      ctx.fillRect(X - sz * 0.5, Y - sz * 0.5, sz, sz);
    }
    // arm stars — clustered on the spirals, scattered by a gaussian that widens outward
    for (i = 0; i < Math.round(5400 * U); i++) {
      var m = rng.int(0, numArms - 1), t = Math.pow(rng.next(), 0.5);
      var r2 = rCore * 0.5 + (rMax - rCore * 0.5) * t;
      var th2 = armTheta(r2, m) + rng.gaussian(0, 0.26 * (0.55 + 0.9 * t));
      r2 += rng.gaussian(0, rMax * 0.013);
      var p = toScreen(r2 * Math.cos(th2), r2 * Math.sin(th2));
      var fall = Math.exp(-r2 / (rMax * 0.46));
      var b = clamp(rng.gaussian(0.52, 0.2), 0.05, 1) * (0.5 + 0.7 * fall);
      if (b < 0.06) continue;
      var warm = rng.bool(0.22);                               // a few older/warm stars in the arms
      star(p[0], p[1], (b > 0.8 ? 1.7 : 1.1) * U,
           warm ? 255 : 198, warm ? 224 : 214, warm ? 190 : 255, b * 0.9);
      if (b > 0.9 && rng.bool(0.5)) Loom.glow(ctx, p[0], p[1], rng.range(2.5, 5) * U, warm ? "#ffd9a8" : "#bcd0ff", 0.5, 0.4);
    }
    // smooth disk stars — fill the inter-arm space so it's a disk, not bare arms
    for (i = 0; i < Math.round(2600 * U); i++) {
      var rd = -rMax * 0.32 * Math.log(1 - 0.96 * rng.next());
      if (rd > rMax * 1.12) continue;
      var td = rng.range(0, TAU);
      var pd = toScreen(rd * Math.cos(td), rd * Math.sin(td));
      var bd = clamp(rng.gaussian(0.34, 0.16), 0.04, 0.8) * Math.exp(-rd / (rMax * 0.5));
      if (bd < 0.04) continue;
      star(pd[0], pd[1], 1 * U, 206, 214, 250, bd);
    }
    // dense warm bulge stars
    for (i = 0; i < Math.round(1500 * U); i++) {
      var rb = Math.abs(rng.gaussian(0, rCore * 1.5));
      var tb = rng.range(0, TAU);
      var pb = toScreen(rb * Math.cos(tb), rb * Math.sin(tb));
      var bbr = clamp(rng.gaussian(0.6, 0.2), 0.1, 1) * Math.exp(-rb / (rCore * 1.8));
      star(pb[0], pb[1], 1.1 * U, 255, 233, 196, bbr * 0.9);
    }

    // ---- dark dust lanes carving the inner edge of each arm (source-over = they OCCLUDE, the depth cue
    //      that turns a pretty swirl into a real galaxy, [[035-defining-feature-is-often-the-hard-part]]) ----
    ctx.globalCompositeOperation = "source-over";
    for (var dm = 0; dm < numArms; dm++) {
      for (var dr = rCore * 1.3; dr < rMax * 0.96; dr += rMax * 0.009) {
        var dth = armTheta(dr, dm) + windDir * 0.24;            // hug the inner (leading) edge of the arm
        var dux = dr * Math.cos(dth), duy = dr * Math.sin(dth);
        var brk = nz.fbm(dux * 0.022 + 40, duy * 0.022 + 40, 3, 2.0, 0.5);   // break the lane up (flocculent)
        var rfade = clamp((dr - rCore * 1.15) / (rMax * 0.22), 0, 1) * clamp((rMax * 0.96 - dr) / (rMax * 0.32), 0, 1);
        var da = clamp((brk - 0.28) * 1.7, 0, 1) * 0.6 * rfade;
        if (da < 0.02) continue;
        var dp = toScreen(dux, duy), dw = (7 + 15 * (dr / rMax)) * U;
        var dg = ctx.createRadialGradient(dp[0], dp[1], 0, dp[0], dp[1], dw);
        dg.addColorStop(0, "rgba(7,4,10," + da.toFixed(3) + ")");
        dg.addColorStop(1, "rgba(7,4,10,0)");
        ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(dp[0], dp[1], dw, 0, TAU); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "lighter";

    // ---- pink star-forming nebulae strung along the arms (the colour pop; ONE saturated layer each) ----
    for (i = 0; i < Math.round(30 * U); i++) {
      var mn = rng.int(0, numArms - 1), tn = rng.range(0.22, 0.96);
      var rn = rCore * 0.5 + (rMax - rCore * 0.5) * tn;
      var thn = armTheta(rn, mn) + rng.gaussian(0, 0.16);
      var pn = toScreen(rn * Math.cos(thn), rn * Math.sin(thn));
      var blue = rng.bool(0.22);                               // mostly pink HII, a few blue reflection
      var rad = rng.range(7, 17) * U * (0.7 + 0.6 * (1 - tn));
      Loom.glow(ctx, pn[0], pn[1], rad, blue ? "#5a9bff" : "#ff4f86", blue ? 0.3 : 0.4, 0.5);
      Loom.glow(ctx, pn[0], pn[1], rad * 0.4, blue ? "#bcd6ff" : "#ffc2da", 0.55, 0.42);
    }

    // ---- a few bright foreground stars with diffraction spikes (depth + sparkle) ----
    for (i = 0; i < Math.round(7 * U); i++) {
      var fx = rng.range(0.04, 0.96) * S, fy = rng.range(0.04, 0.96) * S, fr = rng.range(2.4, 4.2) * U;
      var tint = rng.bool(0.5) ? "#cfe0ff" : "#fff2e0";
      Loom.glow(ctx, fx, fy, fr * 4, tint, 0.5, 0.4);
      ctx.strokeStyle = Loom.rgba(tint, 0.5); ctx.lineWidth = 0.8 * U;
      var sp = fr * 4.2;
      ctx.beginPath(); ctx.moveTo(fx - sp, fy); ctx.lineTo(fx + sp, fy); ctx.moveTo(fx, fy - sp); ctx.lineTo(fx, fy + sp); ctx.stroke();
      star(fx, fy, fr, 255, 255, 255, 0.95);
    }

    // ---- seat it in the void ----
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(cx, cy, S * 0.33, cx, cy, S * 0.8);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(2,2,9,0.62)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
