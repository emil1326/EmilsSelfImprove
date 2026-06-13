// Emil's Loom · piece 071 — "Momiji"
//
// A Japanese maple ablaze in autumn — a full canopy of fire, backlit by a low sun so the leaves glow
// translucent like embers, deep crimson in the shadowed heart, hot gold at the lit rim, a few leaves drifting
// down. Warm, to break a long run of cool nocturnes. The HOOK is the BLAZE ([[065-...]]): colour as the subject,
// and the translucent backlight glow ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]]) is where it sings.
//
// The SOUL is the FOLIAGE MASS lit in 3D, not the branch skeleton (the skeleton is mostly hidden — the advisor's
// catch: I keep mis-locating which layer carries the read, [[083-...]]). So it's built mass-first and validated in
// GREY ([[032-validate-the-soul-before-the-skin]]): does a monochrome dab-mass read as a rounded, lobed, lit 3D
// canopy on a trunk — before any colour? The blaze then sings on DYNAMIC RANGE, not saturation
// ([[044-tone-curve-must-match-the-density-distribution]] / [[051-stacking-additive-glows-desaturates-to-white]]):
// a few genuinely hot leaves against deep crimson + a shadowed interior. Composes noise + glow + palette.
Loom.piece({
  id: "071",
  title: "Momiji",
  seed: "koyo",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var clamp = function (t, a, b) { return t < a ? a : t > b ? b : t; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- canopy envelope + a low backlight (sun behind, upper-left) ----
    var cx = (0.5 + rng.range(-0.04, 0.04)) * S, cyc = 0.40 * S, rx = 0.30 * S, ry = 0.27 * S, baseY = 0.93 * S;
    var sx = -0.5, sy = -0.62, sm = Math.hypot(sx, sy); sx /= sm; sy /= sm;   // direction TOWARD the light

    // ---- trunk + a few limbs reaching into the canopy (dark scaffolding, mostly hidden) ----
    var forkY = cyc + 0.12 * S, limbs = [];
    for (var L = 0, NL = rng.int(4, 6); L < NL; L++) {
      var a = -Math.PI / 2 + rng.range(-1.05, 1.05), len = rng.range(0.13, 0.22) * S;
      limbs.push({ a: a, len: len, w: rng.range(0.008, 0.014) * S });
    }

    // ---- the foliage mass: clumped lobes of dabs (gaps between lobes let the sky through) ----
    var clumps = [], NC = rng.int(13, 18);                        // fewer, bigger lobes → gaps between them
    for (var i = 0; i < NC; i++) {
      var ca = rng.range(0, TAU), cr = Math.pow(rng.range(0, 1), 0.7);
      clumps.push({ x: cx + Math.cos(ca) * cr * rx * 0.95, y: cyc + Math.sin(ca) * cr * ry * 0.95, s: rng.range(0.06, 0.13) * S, z: rng.range(0, 1) });
    }
    var dabs = [];
    for (var ci = 0; ci < clumps.length; ci++) {
      var cl = clumps[ci], nd = rng.int(85, 140);
      for (var d = 0; d < nd; d++) {
        var px = cl.x + rng.gaussian() * cl.s, py = cl.y + rng.gaussian() * cl.s * 0.85;
        var ox = (px - cx) / rx, oy = (py - cyc) / ry, ef = Math.sqrt(ox * ox + oy * oy);
        if (ef > 1.12) continue;                                  // loose clip; the lobing comes from the clumps
        var dirLit = clamp((ox * sx + oy * sy) * 0.62 + 0.5, 0, 1);   // sun-side bright → far-side dark = the VOLUME
        var rim = clamp((ef - 0.80) / 0.20, 0, 1); rim *= rim;        // backlit glow at the thin silhouette edge
        var nv = nz.fbm(px / S * 7, py / S * 7, 3, 2, 0.5);
        var lum = clamp(0.07 + 0.52 * dirLit + 0.20 * rim + 0.12 * cl.z + 0.12 * (nv - 0.5), 0, 1);
        dabs.push({ x: px, y: py, r: rng.range(2.4, 5.6) * U, lum: lum, hj: rng.range(-0.07, 0.09), grn: rng.range(0, 1) < 0.022 });
      }
    }
    dabs.sort(function (a, b) { return a.lum - b.lum; });          // dark interior first → lit leaves on top

    var ramp = Loom.ramp(["#2c0a10", "#561218", "#921f14", "#c2401a", "#e07a1e", "#f4ab2c", "#ffdf88"]);   // deep crimson → hot gold
    var rgbTmp = [0, 0, 0];

    // ---- warm backlit sky: a dusk gradient + a low sun-glow behind the tree (the backlight) ----
    var bg = ctx.createLinearGradient(0, 0, 0, S);
    bg.addColorStop(0, "#221019"); bg.addColorStop(0.45, "#3a1a1c"); bg.addColorStop(0.78, "#6e3a22"); bg.addColorStop(1, "#9c6030");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    Loom.glow(ctx, cx - 0.20 * S, cyc - 0.02 * S, 0.42 * S, "#ffd27a", 0.4, 0.47);   // low sun behind the lit side

    // ---- ground + a scatter of fallen leaves ----
    var gnd = ctx.createLinearGradient(0, baseY - 0.05 * S, 0, S);
    gnd.addColorStop(0, "rgba(28,16,10,0)"); gnd.addColorStop(1, "#1a0f09");
    ctx.fillStyle = gnd; ctx.fillRect(0, baseY - 0.05 * S, S, S - (baseY - 0.05 * S));
    for (var fl = 0; fl < 90; fl++) {
      var lx = rng.range(0.08, 0.92) * S, ly = rng.range(baseY + 0.004 * S, S - 0.015 * S);
      ramp.rgb(rng.range(0.32, 0.82), rgbTmp);
      ctx.fillStyle = "rgb(" + (rgbTmp[0] | 0) + "," + (rgbTmp[1] | 0) + "," + (rgbTmp[2] | 0) + ")"; ctx.globalAlpha = rng.range(0.4, 0.8);
      ctx.beginPath(); ctx.ellipse(lx, ly, rng.range(2, 4) * U, rng.range(1, 2) * U, rng.range(0, TAU), 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ---- trunk + limbs (warm dark, backlit) ----
    ctx.strokeStyle = "#241410"; ctx.lineCap = "round";
    ctx.lineWidth = 0.024 * S; ctx.beginPath(); ctx.moveTo(cx, baseY); ctx.lineTo(cx + 0.008 * S, forkY); ctx.stroke();
    for (var l = 0; l < limbs.length; l++) {
      var lb = limbs[l]; ctx.lineWidth = lb.w;
      ctx.beginPath(); ctx.moveTo(cx, forkY);
      ctx.quadraticCurveTo(cx + Math.cos(lb.a) * lb.len * 0.6, forkY + Math.sin(lb.a) * lb.len * 0.6, cx + Math.cos(lb.a) * lb.len, forkY - 0.07 * S + Math.sin(lb.a) * lb.len);
      ctx.stroke();
    }

    // ---- the blaze: fiery dabs by lum (deep crimson interior → hot gold rim), a few unturned green leaves ----
    for (var p = 0; p < dabs.length; p++) {
      var dp = dabs[p], li = clamp(dp.lum + dp.hj, 0, 1);
      ramp.rgb(li, rgbTmp);
      var r = rgbTmp[0], g = rgbTmp[1], b = rgbTmp[2];
      if (dp.grn) { r = 84; g = 104; b = 52; }
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
      ctx.beginPath(); ctx.arc(dp.x, dp.y, dp.r, 0, TAU); ctx.fill();
    }
    // hot leaves catch the backlight and glow translucent (additive, low alpha, few — 051/037)
    ctx.globalCompositeOperation = "lighter";
    for (var q = 0; q < dabs.length; q++) {
      var dq = dabs[q], li2 = dq.lum + dq.hj;
      if (li2 < 0.72) continue;
      ctx.fillStyle = Loom.rgba("#ffce6a", (li2 - 0.72) * 0.5);
      ctx.beginPath(); ctx.arc(dq.x, dq.y, dq.r * 1.8, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }
});
