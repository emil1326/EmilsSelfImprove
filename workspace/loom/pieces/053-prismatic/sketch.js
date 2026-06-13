// Emil's Loom · piece 053 — "Prismatic"
//
// The Grand Prismatic Spring — Yellowstone's great hot pool, seen from a rise. A near-boiling sterile
// centre of the deepest blue, ringed outward by living mats of heat-loving bacteria that band the water
// green → gold → orange → rust as it cools toward the rim, all of it under a slow roll of steam. It looks
// painted, but it's real. The HOOK ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]): the
// "wait, that's a *place*?" surreal wonder of the colour — and a deliberate BRIGHT, warm scene to break a
// long lean on glow-on-dark drama (the comfort lane the #50/#55 audits flagged).
//
// Built as a ground-plane field (lib/field.js #16): the pool is an ellipse (a circle in perspective);
// each pixel's radius from the centre, warped by fbm so the bands are living and mottled not bullseye-clean
// ([[047-first-render-of-a-natural-thing-is-too-regular]]), maps along a ramp (#11) from blue heart to rust
// rim; outside it is pale mineral crust streaked with warm bacterial runoff. Then steam, then two tiny
// figures for scale and wonder. Composes field + ramp + noise. Static.
Loom.piece({
  id: "053",
  title: "Prismatic",
  seed: "grand",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    var horizon = S * rng.range(0.31, 0.37);
    // the pool: an ellipse on the ground (a circle seen at a low angle → squashed vertically)
    var cx = S * rng.range(0.46, 0.54), cy = S * rng.range(0.60, 0.67);
    var A = S * rng.range(0.40, 0.46), B = A * rng.range(0.50, 0.58);

    // ---- sky: a soft late-day gradient, warm at the horizon ----
    var sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, "#46577a"); sky.addColorStop(0.55, "#8a8a90"); sky.addColorStop(1, "#e0c096");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, horizon + 2);

    // a hazy distant ridge sitting on the horizon
    ctx.save(); ctx.beginPath(); ctx.moveTo(0, horizon);
    for (var hx = 0; hx <= S; hx += S / 40) {
      ctx.lineTo(hx, horizon - (8 + 26 * nz.fbm(hx * 0.004 + 11, 5, 2, 2, 0.5)) * (S / 760));
    }
    ctx.lineTo(S, horizon); ctx.closePath();
    ctx.fillStyle = "rgba(120,118,120,0.55)"; ctx.fill(); ctx.restore();

    // a low sun warming the haze behind where the steam will rise
    var sun = ctx.createRadialGradient(cx, horizon - S * 0.01, S * 0.02, cx, horizon - S * 0.01, S * 0.42);
    sun.addColorStop(0, "rgba(255,226,172,0.6)"); sun.addColorStop(1, "rgba(255,226,172,0)");
    ctx.fillStyle = sun; ctx.fillRect(0, 0, S, horizon + S * 0.12);

    // ---- the ground plane: the pool + the mineral crust (one field pass) ----
    var poolRamp = Loom.ramp(["#08294f", "#125286", "#2090a0", "#52a566", "#b0a644", "#dca23c", "#d07b2c", "#b15324", "#8c3a1c"]);
    var crust = [0, 0, 0], cwarm = [0, 0, 0], tmp = [0, 0, 0];
    var FW = Math.round(Math.min(S, 760) * 0.85), sc = S / FW;
    var ground = Loom.field(FW, function (x, y, out) {
      var X = x * sc, Y = y * sc;
      if (Y < horizon) { out[3] = 0; return; }
      var depth = (Y - horizon) / (S - horizon);             // 0 at horizon → 1 at the bottom edge
      var u = (X - cx) / A, v = (Y - cy) / B;
      var r = Math.sqrt(u * u + v * v);
      var warp = (nz.fbm(X * 0.006, Y * 0.010, 4, 2, 0.5) - 0.5) * 0.22;  // living, mottled band edges
      var rr = r + warp;

      if (rr < 1.0) {                                          // ---- inside the pool ----
        poolRamp.rgb(clamp(rr, 0, 1), tmp);
        var mott = 0.88 + 0.20 * nz.fbm(X * 0.03, Y * 0.05, 3, 2, 0.5);   // mat texture
        var rh = clamp(1 - rr * 1.4, 0, 1);                   // the hot blue heart
        var sheen = rh * 0.20 * (0.6 + 0.8 * nz.fbm(X * 0.02 + 7, Y * 0.04 + 7, 2, 2, 0.5));
        var wet = 1 - 0.42 * clamp((rr - 0.9) / 0.1, 0, 1);   // a darker wet waterline at the rim
        out[0] = clamp((tmp[0] * mott + sheen * 110) * wet, 0, 255);
        out[1] = clamp((tmp[1] * mott + sheen * 140) * wet, 0, 255);
        out[2] = clamp((tmp[2] * mott + sheen * 170) * wet, 0, 255);
      } else {                                                // ---- the mineral crust around it ----
        var ang = Math.atan2(v, u);
        var streak = nz.fbm(Math.cos(ang) * 1.7 + 20, Math.sin(ang) * 1.7 + 20, 2, 2, 0.5);  // radial runoff
        var runoff = clamp((streak - 0.38) * 2.6, 0, 1) * clamp(1.7 - (rr - 1) * 1.7, 0, 1);  // strong near rim, reaching out
        // pale sinter, warmed by runoff, darker/cooler in the near foreground
        var baseL = 0.80 - 0.16 * depth;
        crust[0] = 224 * baseL; crust[1] = 214 * baseL; crust[2] = 196 * baseL;
        cwarm[0] = 210; cwarm[1] = 130; cwarm[2] = 64;
        var k = runoff * 0.7;
        var cr = crust[0] + (cwarm[0] - crust[0]) * k * 1.2, cg = crust[1] + (cwarm[1] - crust[1]) * k * 1.2, cb = crust[2] + (cwarm[2] - crust[2]) * k * 1.2;
        var grit = 0.93 + 0.14 * nz.fbm(X * 0.05, Y * 0.05, 2, 2, 0.5);
        // atmospheric haze toward the horizon (far crust pales out warm)
        var haze = clamp(1 - depth * 2.4, 0, 1) * 0.7;
        out[0] = clamp(cr * grit + (216 - cr) * haze, 0, 255);
        out[1] = clamp(cg * grit + (192 - cg) * haze, 0, 255);
        out[2] = clamp(cb * grit + (150 - cb) * haze, 0, 255);
      }
      out[3] = 255;
    });
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(ground, 0, 0, S, S);

    // ---- two tiny figures on a boardwalk at the far rim — scale, and a little wonder (drawn before the
    //      steam so it veils them slightly = depth). Proper proportions, not pins ([[035]] / Salar #050). ----
    var bwY = cy - B * 0.94, bwX = cx + A * 0.34;
    ctx.save();
    ctx.strokeStyle = "rgba(74,60,48,0.32)"; ctx.lineWidth = Math.max(1, S * 0.006);  // a short boardwalk plank by the figures
    ctx.beginPath(); ctx.moveTo(bwX - A * 0.16, bwY + S * 0.006); ctx.lineTo(bwX + A * 0.2, bwY - S * 0.004); ctx.stroke();
    var figure = function (fx, fy, h, col) {
      ctx.fillStyle = col; var w = h * 0.3;
      ctx.fillRect(fx - w * 0.46, fy - h * 0.42, w * 0.4, h * 0.42);           // legs
      ctx.fillRect(fx + w * 0.06, fy - h * 0.42, w * 0.4, h * 0.42);
      ctx.beginPath(); ctx.moveTo(fx - w * 0.5, fy - h * 0.4);                 // tapered torso
      ctx.lineTo(fx + w * 0.5, fy - h * 0.4); ctx.lineTo(fx + w * 0.34, fy - h * 0.82);
      ctx.lineTo(fx - w * 0.34, fy - h * 0.82); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(fx, fy - h * 0.9, w * 0.34, 0, TAU); ctx.fill();  // head
    };
    var fh = S * 0.034;
    figure(bwX, bwY + S * 0.004, fh, "rgba(38,32,30,0.92)");
    figure(bwX + fh * 0.62, bwY + S * 0.007, fh * 0.9, "rgba(54,40,44,0.9)");
    ctx.restore();

    // ---- steam: warm wisps rising off the hot water, veiling the far rim and drifting into the sky ----
    var driftx = rng.range(0, 80);
    var SFW = Math.round(Math.min(S, 760) * 0.5), ssc = S / SFW;
    var yPeak = cy - B * 0.55;                               // densest just above the far rim
    var spreadUp = yPeak - (horizon - S * 0.04), spreadDn = (cy + B * 0.1) - yPeak;
    var steam = Loom.field(SFW, function (x, y, out) {
      var X = x * ssc, Y = y * ssc;
      var vy = (Y < yPeak) ? (Y - yPeak) / spreadUp : (Y - yPeak) / spreadDn;
      var env = 1 - vy * vy;                                 // parabolic: peaks above the rim, 0 at both fades
      if (env <= 0) { out[3] = 0; return; }
      var d = nz.fbm(X * 0.007 + driftx, Y * 0.0028 + 30, 5, 2.15, 0.55);  // bigger billows, stretched to rise
      d = clamp((d - 0.36) * 2.5, 0, 1);
      var hx = (X - cx) / (A * 1.08), hmask = Math.exp(-hx * hx * 0.7);
      var a = d * env * env * hmask;                         // env² → softer shoulders, no hard band
      if (a < 0.015) { out[3] = 0; return; }
      var hi = clamp((yPeak - Y) / spreadUp, 0, 1);          // higher wisps cool & grey; low steam warm & lit
      out[0] = 246 - 30 * hi; out[1] = 230 - 18 * hi; out[2] = 200 + 28 * hi;
      out[3] = clamp(a, 0, 1) * (235 - 70 * hi);             // denser/warmer low, thinning up high
    });
    ctx.drawImage(steam, 0, 0, S, S);

    // ---- a soft vignette ----
    var vg = ctx.createRadialGradient(S * 0.5, S * 0.54, S * 0.34, S * 0.5, S * 0.55, S * 0.78);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(10,8,14,0.42)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
