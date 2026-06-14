// Emil's Loom · piece 087 — "Nursery"
//
// A stellar nursery — a star-forming nebula, where towers of cold dark dust stand light-years tall against
// a backlight of glowing gas, and inside them new stars are igniting. A nebula is the most-painted thing in
// space, so the trap is "a rendered gas cloud" (the Giant trap — pretty, no event). The fix: the DUST is the
// sculptural hero, rim-lit against the gas (the gas is only backlight), and the EVENT is a brilliant newborn
// star with diffraction spikes punching out through the dust — "a cloud" becomes "something happening". The
// crisp dark silhouettes are also the anti-mud insurance: structure carries the read + the awe, the soft glow
// only laminates it (the advisor's sequencing, [[083]]). Off-centre, with depth — you're inside it. Composes
// noise + glow + ramp.
Loom.piece({
  id: "087",
  title: "Nursery",
  seed: "eagle",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));
    var flip = rng.bool() ? 1 : 0;
    function mx(f) { return (flip ? 1 - f : f) * S; }

    // ---- seeded composition: a cluster of dust pillars off to one side, a newborn star at their crown ----
    var clusterX = mx(rng.range(0.34, 0.5));
    var baseY = S * 1.02;
    var nPillars = rng.int(2, 3);
    var starX = mx(rng.range(0.42, 0.6)), starY = rng.range(0.24, 0.36) * S;
    var rimWarm = "rgba(245,206,150,";       // gas/star light catching the dust edges (warm star-light, any gas)
    var gasPal = rng.pick([
      ["#0a1820", "#123c48", "#1f7a76", "#56b49e", "#cfe0b0", "#ffe6b4"],   // teal -> warm (Eagle)
      ["#140a1a", "#3a1636", "#7a2a58", "#c05a80", "#e8a0ae", "#ffe2c2"],   // rose / magenta
      ["#170e0a", "#3e2410", "#8a4820", "#d08440", "#ecc270", "#fff0c4"],   // amber / gold (Carina)
      ["#0a1020", "#163050", "#2a5e9a", "#5a9ad0", "#a6d2ea", "#e4f0ff"]    // cool blue
    ]);

    // ---- deep space + a faint starfield ----
    ctx.fillStyle = "#07060c"; ctx.fillRect(0, 0, S, S);
    for (var i = 0; i < 260; i++) {
      var b = Math.pow(rng.range(0, 1), 2.2);
      ctx.fillStyle = "rgba(220,224,240," + (0.06 + b * 0.7) + ")";
      var sr = (0.3 + b * 1.1) * U;
      ctx.beginPath(); ctx.arc(rng.range(0, 1) * S, rng.range(0, 1) * S, sr, 0, TAU); ctx.fill();
    }

    // ---- the glowing gas: a FILAMENTARY field (not uniform fog), brightest+warmest where the star lights it ----
    var GW = 300, goff = document.createElement("canvas"); goff.width = GW; goff.height = GW;
    var goc = goff.getContext("2d"), gimg = goc.createImageData(GW, GW), gd = gimg.data;
    var gasRamp = Loom.ramp(gasPal);               // dim -> nebula hue -> warm, in the seed's palette
    var grgb = [0, 0, 0], sfx = starX / S, sfy = starY / S, ncx = clusterX / S;
    for (var gyi = 0; gyi < GW; gyi++) {
      for (var gxi = 0; gxi < GW; gxi++) {
        var fxu = gxi / GW, fyu = gyi / GW;
        var dstar = Math.hypot(fxu - sfx, (fyu - sfy) * 1.1);
        var body = Math.max(0, 1 - Math.hypot(fxu - ncx, fyu - 0.46) * 1.5);   // broad nebula body
        var dens = Math.pow(Math.max(0, nz.fbm(fxu * 3.2 + 11, fyu * 3.2, 5)), 1.6);   // filaments + dark dust gaps
        var warm = Math.max(0, 1 - dstar * 2.2);                                // the star's warm halo
        var v = Math.min(1, dens * body * (0.5 + warm * 1.5));
        gasRamp.rgb(v, grgb);
        var pp = (gyi * GW + gxi) * 4;
        gd[pp] = grgb[0] | 0; gd[pp + 1] = grgb[1] | 0; gd[pp + 2] = grgb[2] | 0; gd[pp + 3] = 255;
      }
    }
    goc.putImageData(gimg, 0, 0);
    ctx.globalCompositeOperation = "lighter"; ctx.imageSmoothingEnabled = true;
    ctx.drawImage(goff, 0, 0, GW, GW, 0, 0, S, S);
    ctx.globalCompositeOperation = "source-over";

    // ---- the dust pillars: dark sculptural towers, rim-lit on the star-facing side (the HERO) ----
    function pillar(bx, h, w, idx, depth, lean) {
      var N = 32, left = [], right = [];
      for (var i = 0; i <= N; i++) {
        var u = i / N, y = baseY - u * h;
        var cxv = bx + lean * Math.sin(u * 1.4) * h * 0.13;                   // a gentle organic lean
        var bulge = 1 + 0.55 * (nz.fbm(idx * 4.1 + 3, u * 2.6, 3) - 0.5);     // big width variation: knots & necks
        var taper = 1 - 0.5 * u * u;
        var wv = w * taper * Math.max(0.3, bulge);
        var wl = (nz.fbm(idx * 7.7 + u * 4, y * 0.01, 4) - 0.5) * 0.5;        // fine wispy edge
        var wr = (nz.fbm(idx * 7.7 + 60 + u * 4, y * 0.01, 4) - 0.5) * 0.5;
        left.push([cxv - wv + wl * wv, y]); right.push([cxv + wv + wr * wv, y]);
      }
      var capR = Math.max(2, (right[N][0] - left[N][0]) / 2), topY = left[N][1], midX = (left[N][0] + right[N][0]) / 2;
      ctx.beginPath(); ctx.moveTo(left[0][0], left[0][1]);
      for (var a = 1; a <= N; a++) ctx.lineTo(left[a][0], left[a][1]);
      ctx.quadraticCurveTo(left[N][0] + capR * 0.1, topY - capR * 1.25, midX, topY - capR * 0.95);   // rounded lumpy crown
      ctx.quadraticCurveTo(right[N][0] - capR * 0.1, topY - capR * 1.25, right[N][0], right[N][1]);
      for (var b2 = N - 1; b2 >= 0; b2--) ctx.lineTo(right[b2][0], right[b2][1]);
      ctx.closePath();
      var dk = depth, g = ctx.createLinearGradient(0, baseY - h, 0, baseY);
      g.addColorStop(0, "rgba(" + (38 * dk | 0) + "," + (22 * dk | 0) + "," + (24 * dk | 0) + ",1)");
      g.addColorStop(1, "rgba(" + (10 * dk | 0) + "," + (7 * dk | 0) + "," + (8 * dk | 0) + ",1)");
      ctx.fillStyle = g; ctx.fill();
      // rim on the star-facing edge, carried over the crown
      var lit = (starX < midX), edge = lit ? left : right;
      ctx.strokeStyle = rimWarm + (0.62 * dk) + ")"; ctx.lineWidth = 1.6 * U * dk; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(edge[0][0], edge[0][1]);
      for (var c = 1; c <= N; c++) ctx.lineTo(edge[c][0], edge[c][1]);
      ctx.quadraticCurveTo(edge[N][0] + (lit ? capR * 0.1 : -capR * 0.1), topY - capR * 1.25, midX, topY - capR * 0.95);
      ctx.stroke();
    }
    for (var pj = nPillars - 1; pj >= 0; pj--) {
      var off = (pj - (nPillars - 1) / 2) * 0.15 * S;
      var depth = 0.68 + 0.32 * (pj / Math.max(1, nPillars - 1));     // front pillar brightest/sharpest
      pillar(clusterX + off + rng.range(-0.02, 0.02) * S, rng.range(0.56, 0.78) * S, rng.range(0.07, 0.11) * S, pj + 1, depth, rng.range(-0.6, 0.6));
    }

    // ---- the newborn star: a brilliant point with diffraction spikes (the EVENT) + a few embedded ones ----
    function starBurst(sx, sy, size, spikes) {
      Loom.glow(ctx, sx, sy, size * 7, "#bfe0ff", 0.5, 0.55);
      Loom.glow(ctx, sx, sy, size * 2.6, "#ffffff", 0.95, 0.5);
      ctx.globalCompositeOperation = "lighter";
      for (var s = 0; s < spikes; s++) {
        var ang = s * Math.PI / (spikes / 2) + 0.0, len = size * (spikes === 4 ? 11 : 7);
        var ex = sx + Math.cos(ang) * len, ey = sy + Math.sin(ang) * len;
        var lg = ctx.createLinearGradient(sx, sy, ex, ey);
        lg.addColorStop(0, "rgba(220,238,255,0.9)"); lg.addColorStop(0.5, "rgba(180,214,255,0.25)"); lg.addColorStop(1, "rgba(180,214,255,0)");
        ctx.strokeStyle = lg; ctx.lineWidth = 1.4 * U; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      }
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(sx, sy, size * 0.7, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    // a few smaller embedded stars in the gas
    for (var e = 0; e < 7; e++) starBurst(mx(rng.range(0.2, 0.8)), rng.range(0.15, 0.55) * S, rng.range(0.6, 1.3) * U, 4);
    starBurst(starX, starY, 3.6 * U, 4);     // the hero newborn star, drawn last (on top)
  }
});
