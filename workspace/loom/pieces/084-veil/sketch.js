// Emil's Loom · piece 084 — "Veil"
//
// A waterfall in the silky long-exposure look — a tall veil of water pouring over a dark wet cliff and
// exploding into a glowing bank of mist, sun catching the spray, a faint rainbow breathing in and out of
// it. Serene light, the lane I do best (075). The READ is the risk (water is hard, the #033 wave failure):
// what says "waterfall" isn't the white veil alone (that reads as fog/cloth) but the CONTEXT — the brink
// it pours over, the cliff framing it, the explosive base, the pool. So the structure is built first and
// the light layered on top (the advisor's correction). The rainbow is a droppable grace note, never load-
// bearing — it must sing on water+light+mist alone. Bright + open + water-hero (not a dark gorge).
// Composes noise + ramp + tone-based mist (additive glow goes inert on a bright ground, 022).
Loom.piece({
  id: "084",
  title: "Veil",
  seed: "bridalveil",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- seeded composition ----
    var sunLeft = rng.bool();
    var skyline = 0.1 * S;                          // the cliff top stands against a bright sky (open, not enclosed)
    var brinkY = rng.range(0.14, 0.28) * S;        // the lip the water pours over (wide: short plunge <-> tall drop)
    var baseY = rng.range(0.63, 0.78) * S;         // where the falls explode into the pool
    var colC = rng.range(0.37, 0.63) * S;          // chute centre — clearly off-centre L<->R per seed (085: vary so it READS)
    var topW = rng.range(0.11, 0.23) * S;          // chute width at the brink (thin veil <-> broad curtain)
    var botW = topW * rng.range(1.25, 1.95);       // it fans wider as it falls
    function edgeX(y, side) {                       // chute edge at height y; side -1 left / +1 right
      var u = (y - brinkY) / (baseY - brinkY); u = u < 0 ? 0 : u > 1 ? 1 : u;
      return colC + side * (topW / 2 + (botW - topW) / 2 * u);
    }

    // ---- sky / bright atmosphere behind everything ----
    var sky = ctx.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, "#cad9de"); sky.addColorStop(0.4, "#d6e1e1"); sky.addColorStop(0.75, "#cdd8d6"); sky.addColorStop(1, "#b9c8c6");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);

    // ---- dark wet rock walls framing the chute (jagged inner edge) ----
    function wall(side) {
      var outer = side < 0 ? 0 : S;
      ctx.save();
      ctx.beginPath(); ctx.moveTo(outer, skyline);
      for (var y = skyline; y <= S + 2 * U; y += 6 * U) {
        var jag = (nz.fbm(y * 0.016, side * 5.7, 3) - 0.5) * 0.05 * S;
        ctx.lineTo(edgeX(y, side) + jag, y);
      }
      ctx.lineTo(outer, S + 2 * U); ctx.closePath();
      ctx.clip();
      var g = ctx.createLinearGradient(outer, 0, colC, 0);     // wet grey rock, lighter (wetter) toward the chute
      g.addColorStop(0, "#5a655e"); g.addColorStop(0.6, "#717d74"); g.addColorStop(1, "#8a978c");
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      // rock texture: mostly-vertical strata streaks — dark fractures + wet highlights (no bokeh)
      for (var t = 0; t < 150; t++) {
        var rx = side < 0 ? rng.range(0, 1) * colC : colC + rng.range(0, 1) * (S - colC);
        var ry = rng.range(-0.05, 1) * S, len = rng.range(0.05, 0.24) * S;
        var v = nz.fbm(rx * 0.014, ry * 0.009, 3);
        ctx.strokeStyle = v > 0.5 ? "rgba(26,32,30," + rng.range(0.12, 0.3) + ")" : "rgba(160,176,168," + rng.range(0.05, 0.17) + ")";
        ctx.lineWidth = rng.range(0.8, 3.2) * U;
        ctx.beginPath(); ctx.moveTo(rx, ry);
        ctx.lineTo(rx + (nz.fbm(rx * 0.03, ry * 0.03, 2) - 0.5) * 0.035 * S, ry + len); ctx.stroke();
      }
      // mossy wet patches, organically placed (where the noise says, not everywhere)
      for (var ms = 0; ms < 26; ms++) {
        var mx = side < 0 ? rng.range(0, 1) * colC : colC + rng.range(0, 1) * (S - colC), my = rng.range(0.15, 1) * S;
        if (nz.fbm(mx * 0.018, my * 0.018, 3) > 0.57) { ctx.fillStyle = "rgba(70,90,56,0.14)"; ctx.beginPath(); ctx.ellipse(mx, my, rng.range(10, 30) * U, rng.range(14, 40) * U, 0, 0, TAU); ctx.fill(); }
      }
      ctx.restore();
    }
    wall(-1); wall(1);

    // ---- the cliff top across the chute, so the water pours from a LIP (not a bright sky-gap) ----
    ctx.beginPath();
    ctx.moveTo(edgeX(skyline, -1) - 4 * U, skyline);
    ctx.lineTo(edgeX(skyline, 1) + 4 * U, skyline);
    ctx.lineTo(edgeX(brinkY, 1) + 4 * U, brinkY);
    for (var lx = edgeX(brinkY, 1) + 4 * U; lx >= edgeX(brinkY, -1) - 4 * U; lx -= 5 * U) {
      ctx.lineTo(lx, brinkY + (nz.fbm(lx * 0.03, 11.1, 2) - 0.5) * 0.016 * S);
    }
    ctx.lineTo(edgeX(brinkY, -1) - 4 * U, brinkY); ctx.closePath();
    var lg = ctx.createLinearGradient(0, skyline, 0, brinkY);
    lg.addColorStop(0, "#3a4541"); lg.addColorStop(1, "#525e58");
    ctx.fillStyle = lg; ctx.fill();

    // ---- the silky water veil ----
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(edgeX(brinkY, -1), brinkY); ctx.lineTo(edgeX(baseY, -1), baseY);
    ctx.lineTo(edgeX(baseY, 1), baseY); ctx.lineTo(edgeX(brinkY, 1), brinkY); ctx.closePath();
    ctx.clip();
    var wg = ctx.createLinearGradient(0, brinkY, 0, baseY);
    wg.addColorStop(0, "rgba(240,247,249,0.92)"); wg.addColorStop(0.55, "rgba(216,231,236,0.82)"); wg.addColorStop(1, "rgba(222,235,238,0.55)");
    ctx.fillStyle = wg; ctx.fillRect(0, brinkY, S, baseY - brinkY);
    // silky striations — thin vertical streaks, light and shadow, noise-wavering (long-exposure look)
    for (var i = 0; i < 70; i++) {
      var fx = rng.range(0, 1);
      var light = rng.bool();
      ctx.strokeStyle = light ? "rgba(248,252,253," + rng.range(0.18, 0.4) + ")" : "rgba(150,176,186," + rng.range(0.10, 0.26) + ")";
      ctx.lineWidth = rng.range(0.8, 2.6) * U;
      ctx.beginPath();
      var first = true;
      for (var y = brinkY; y <= baseY; y += 7 * U) {
        var wob = (nz.fbm(fx * 30 + 4, y * 0.01, 2) - 0.5) * 0.012 * S;
        var x = edgeX(y, -1) + fx * (edgeX(y, 1) - edgeX(y, -1)) + wob;
        if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();

    // ---- tone-based mist puff (white-ish, brighter-than-ground; warm where the sun lights it) ----
    function puff(cx, cy, r, alpha, warm) {
      var col = warm ? "247,219,160" : "234,242,243";
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(" + col + "," + alpha + ")"); g.addColorStop(1, "rgba(" + col + ",0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    }

    // ---- the explosive base: churn where the veil hits, rising mist (069: noise-broken, soft) ----
    var sunX = sunLeft ? colC - 0.22 * S : colC + 0.22 * S;
    for (var p = 0; p < 130; p++) {
      var a = rng.range(0, TAU), d = Math.pow(rng.range(0, 1), 0.55);
      var px = colC + Math.cos(a) * d * botW * 1.3;
      var py = baseY + Math.sin(a) * d * 0.17 * S - 0.05 * S;        // a big billowing cloud, biased upward
      var warm = (sunLeft ? px < colC : px > colC);
      puff(px, py, rng.range(0.06, 0.17) * S, rng.range(0.06, 0.17), warm && nz.fbm(px * 0.02, py * 0.02, 2) > 0.42);
    }
    // the bright billowing heart of the spray cloud
    puff(colC, baseY - 0.03 * S, 0.22 * S, 0.4, false);
    puff(colC + (sunLeft ? -0.08 : 0.08) * S, baseY - 0.04 * S, 0.17 * S, 0.3, true);

    // ---- the plunge pool ----
    var pool = ctx.createLinearGradient(0, baseY, 0, S);
    pool.addColorStop(0, "#9fb6b8"); pool.addColorStop(0.25, "#5d7b7c"); pool.addColorStop(1, "#26403f");
    ctx.fillStyle = pool; ctx.fillRect(0, baseY + 0.02 * S, S, S);
    // foam fanning out from the impact on the pool
    for (var f = 0; f < 40; f++) {
      var fr = rng.range(0.02, 0.22) * S, fa = rng.range(0, TAU);
      var fxp = colC + Math.cos(fa) * fr, fyp = baseY + 0.03 * S + Math.abs(Math.sin(fa)) * fr * 0.5;
      if (fyp < S) puff(fxp, fyp, rng.range(0.02, 0.06) * S, rng.range(0.06, 0.18), false);
    }

    // ---- drifting spray rising up the falls + sun warmth + a haze lift (the serene light, layered last) ----
    for (var dm = 0; dm < 100; dm++) {
      var t2 = Math.pow(rng.range(0, 1), 1.3);        // denser low: most spray hangs near the base, thinning up
      var my2 = baseY - t2 * (baseY - brinkY) * 0.95;
      var sideSel = rng.bool() ? -1 : 1;
      var mx2 = edgeX(my2, sideSel) + sideSel * rng.range(-0.02, 0.11) * S;   // drifts out over the rock, veiling it
      var warm2 = (sunLeft ? mx2 < colC : mx2 > colC);
      puff(mx2, my2, rng.range(0.06, 0.15) * S * (0.55 + t2 * 0.7), (1 - t2 * 0.6) * rng.range(0.06, 0.14), warm2);
    }
    // a low warm sun lighting the spray from one side
    puff(sunX, brinkY + 0.08 * S, 0.34 * S, 0.15, true);
    // a breath of bright haze over the lower scene — atmospheric perspective, lifts it out of the dark
    var hz = ctx.createLinearGradient(0, baseY - 0.28 * S, 0, S);
    hz.addColorStop(0, "rgba(233,239,237,0)"); hz.addColorStop(0.55, "rgba(233,239,237,0.18)"); hz.addColorStop(1, "rgba(221,231,229,0.06)");
    ctx.fillStyle = hz; ctx.fillRect(0, baseY - 0.28 * S, S, S - (baseY - 0.28 * S));
    // a soft pale wash high up where the cliff meets the sky (air, not a hard edge)
    var topHz = ctx.createLinearGradient(0, skyline - 0.02 * S, 0, skyline + 0.16 * S);
    topHz.addColorStop(0, "rgba(232,236,232,0.5)"); topHz.addColorStop(1, "rgba(232,236,232,0)");
    ctx.fillStyle = topHz; ctx.fillRect(0, skyline - 0.02 * S, S, 0.18 * S);

    // ---- golden-hour light key: warm gold pours in from the sun side, cool blue settles in the shadow ----
    var lightG = ctx.createLinearGradient(sunLeft ? 0 : S, 0, sunLeft ? S : 0, 0);
    lightG.addColorStop(0, "rgba(250,206,138,0.22)");
    lightG.addColorStop(0.5, "rgba(250,206,138,0)");
    lightG.addColorStop(1, "rgba(140,176,212,0.14)");
    ctx.fillStyle = lightG; ctx.fillRect(0, 0, S, S);

    // ---- a faint rainbow breathing in the lower mist — a droppable grace note (never load-bearing) ----
    var SHOW_RAINBOW = true;
    if (SHOW_RAINBOW) {
      var bow = Loom.ramp(["#e89b9b", "#eccf94", "#e6e69a", "#9fd6a4", "#9fc2e0", "#b6a6dd"]);
      var rcx = sunLeft ? colC + 0.16 * S : colC - 0.16 * S;       // opposite the sun
      var rcy = baseY + 0.04 * S, rR = 0.26 * S, rgb = [0, 0, 0];
      ctx.save(); ctx.lineWidth = 3.2 * U;
      for (var b = 0; b <= 1.0001; b += 0.16) {
        bow.rgb(b, rgb);
        ctx.strokeStyle = "rgba(" + (rgb[0] | 0) + "," + (rgb[1] | 0) + "," + (rgb[2] | 0) + ",0.16)";
        ctx.beginPath();
        ctx.arc(rcx, rcy, rR - b * 0.06 * S, Math.PI * (sunLeft ? 1.05 : 1.55), Math.PI * (sunLeft ? 1.45 : 1.95));
        ctx.stroke();
      }
      ctx.restore();
    }
  }
});
