// Emil's Loom · piece 082 — "Toscana"
//
// The Val d'Orcia at the golden hour — rolling Tuscan hills receding into warm haze, a low sun raking the
// crests, cypresses lining a road that winds off to a farmhouse. A SCENE with depth and a leading line, the
// deliberate opposite of the centred-subject portraits the #121 audit flagged me defaulting to (073). It
// lands in my real 5-lane (serene light / awe, [[075-...]]). Ran 083: the SING is the GOLDEN-HOUR LIGHT —
// warm atmospheric depth + lit rims + a glowing horizon — so I validate the LAYERED-HILL GLOW first, stylised
// (the Tuscan-poster look) rather than a per-pixel hillshade ([[080-...]] form-under-light, kept lightweight).
// Atmospheric perspective: far hills pale + warm + low-contrast, near hills dark + saturated. Composes ramp + noise + glow.
Loom.piece({
  id: "082",
  title: "Toscana",
  seed: "valdorcia",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));
    var horizon = rng.range(0.31, 0.385) * S, sunX = rng.range(0.16, 0.5) * S;   // seeded sky/land split + sun (left-biased, so light stays coherent)

    // ---- golden-hour sky: dusty blue up top -> warm peach -> glowing gold at the horizon ----
    var sky = ctx.createLinearGradient(0, 0, 0, horizon + 0.06 * S);
    sky.addColorStop(0, "#9fb0c6"); sky.addColorStop(0.4, "#cdc2b4"); sky.addColorStop(0.72, "#eccf96"); sky.addColorStop(1, "#f8db8e");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, horizon + 0.08 * S);
    Loom.glow(ctx, sunX, horizon - 0.015 * S, 0.36 * S, "#ffe6a4", 0.55, 0.5);   // the low sun (warm, not blown white)
    Loom.glow(ctx, sunX, horizon - 0.01 * S, 0.1 * S, "#fff2d4", 0.78, 0.42);

    // ---- layered rolling hills, far -> near, atmospheric perspective ----
    var N = 7;
    var hill = Loom.ramp(["#e6cf94", "#cdb472", "#ad9a56", "#8a843e", "#62662e", "#454e26"]);  // far pale -> near dark
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1);                                  // 0 far -> 1 near
      var base = horizon + Math.pow(t, 1.35) * (S - horizon - 0.02 * S);
      var amp = (0.018 + 0.07 * t) * S;
      var f1 = rng.range(2.2, 3.6) / S, f2 = rng.range(5, 9) / S, ph1 = rng.range(0, TAU), ph2 = rng.range(0, TAU);
      var col = hill.css(1 - t);                            // far -> pale, near -> dark
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(0, S);
      for (var x = 0; x <= S; x += 3 * U) {
        var y = base - (Math.sin(x * f1 + ph1) + 0.5 * Math.sin(x * f2 + ph2) + 0.6 * (nz.fbm(x * 0.004, t * 10, 2) - 0.5)) * amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(S, S); ctx.closePath(); ctx.fill();

      // warm rim-light along the crest (the sun catching the ridge), brighter on the sun-facing side
      ctx.strokeStyle = "rgba(255,228,158," + (0.28 + 0.34 * (1 - t)) + ")"; ctx.lineWidth = (1.7 - t) * U; ctx.lineCap = "round";
      ctx.beginPath();
      for (var x2 = 0; x2 <= S; x2 += 3 * U) {
        var y2 = base - (Math.sin(x2 * f1 + ph1) + 0.5 * Math.sin(x2 * f2 + ph2) + 0.6 * (nz.fbm(x2 * 0.004, t * 10, 2) - 0.5)) * amp;
        if (x2 === 0) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }

    // ---- a soft warm haze settling into the valleys near the horizon ----
    var haze = ctx.createLinearGradient(0, horizon - 0.04 * S, 0, horizon + 0.16 * S);
    haze.addColorStop(0, "rgba(248,219,142,0.5)"); haze.addColorStop(1, "rgba(248,219,142,0)");
    ctx.fillStyle = haze; ctx.fillRect(0, horizon - 0.04 * S, S, 0.2 * S);

    // ---- the leading line + Tuscan signifiers (off-centre, SEEDED so each weave is a different scene, 085) ----
    function lerp(a, b, u) { return a + (b - a) * u; }
    function cypress(x, y, h, w) {
      var g = ctx.createLinearGradient(x - w, y - h, x + w, y);
      g.addColorStop(0, "#3a4824"); g.addColorStop(1, "#202b13");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(x, y - h);
      ctx.bezierCurveTo(x + w, y - h * 0.55, x + w * 0.6, y, x, y);
      ctx.bezierCurveTo(x - w * 0.6, y, x - w, y - h * 0.55, x, y - h); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(244,214,140,0.5)"; ctx.lineWidth = 1.1 * U;          // warm sun-side (left) rim
      ctx.beginPath(); ctx.moveTo(x, y - h); ctx.bezierCurveTo(x - w * 0.6, y, x - w, y - h * 0.55, x, y - h); ctx.stroke();
    }
    // a winding road from the foreground up to a farmhouse on a hill (positions seeded)
    var fx = rng.range(0.24, 0.72) * S, fy = rng.range(0.45, 0.52) * S, bx = rng.range(0.34, 0.66) * S;   // wide: farmhouse/road clearly shift L<->R per seed
    var wob = (rng.bool() ? 1 : -1) * rng.range(0.05, 0.092) * S;   // always a real bend (never a stiff ramp)
    var wph = rng.range(0.4, TAU - 0.4), RS = 5, road = [], rw = [];
    for (var rs = 0; rs <= RS; rs++) {
      var u = rs / RS;
      road.push([lerp(bx, fx, u) + Math.sin(u * 2.6 + wph) * (1 - u) * wob, lerp(S, fy + 0.006 * S, u)]);
      rw.push(lerp(0.05 * S, 0.005 * S, u));
    }
    var lft = [], rgt = [];
    for (var r = 0; r <= RS; r++) {
      var pn = road[Math.min(r + 1, RS)], pp = road[Math.max(r - 1, 0)];
      var dx = pn[0] - pp[0], dy = pn[1] - pp[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
      lft.push([road[r][0] + nx * rw[r], road[r][1] + ny * rw[r]]); rgt.push([road[r][0] - nx * rw[r], road[r][1] - ny * rw[r]]);
    }
    ctx.fillStyle = "#d3c094"; ctx.beginPath(); ctx.moveTo(lft[0][0], lft[0][1]);
    for (var l = 1; l <= RS; l++) ctx.lineTo(lft[l][0], lft[l][1]);
    for (var q = RS; q >= 0; q--) ctx.lineTo(rgt[q][0], rgt[q][1]);
    ctx.closePath(); ctx.fill();

    // cypresses along the road's verge (near = big), seeded jitter
    for (var ci = 1; ci < RS; ci++) {
      var p = road[ci], pn2 = road[ci + 1], pp2 = road[ci - 1];
      var dx2 = pn2[0] - pp2[0], dy2 = pn2[1] - pp2[1], L2 = Math.hypot(dx2, dy2) || 1, nx2 = -dy2 / L2, ny2 = dx2 / L2;
      var off = rw[ci] + rng.range(0.02, 0.032) * S, ch = lerp(0.13 * S, 0.05 * S, (ci - 1) / (RS - 1)) * rng.range(0.86, 1.08);
      cypress(p[0] - nx2 * off, p[1] - ny2 * off, ch, ch * 0.15);
    }
    // farmhouse (cream walls, terracotta roof) + a cluster of cypresses beside it
    var fw = 0.05 * S, fh = 0.026 * S;
    ctx.fillStyle = "#ddc8a2"; ctx.fillRect(fx - fw * 0.5, fy - fh, fw * 0.7, fh);
    ctx.fillStyle = "#cdb88f"; ctx.fillRect(fx + fw * 0.05, fy - fh * 0.78, fw * 0.45, fh * 0.78);
    ctx.fillStyle = "#9e5236"; ctx.beginPath(); ctx.moveTo(fx - fw * 0.56, fy - fh); ctx.lineTo(fx - fw * 0.08, fy - fh - fh * 0.6); ctx.lineTo(fx + fw * 0.36, fy - fh); ctx.closePath(); ctx.fill();
    cypress(fx - fw * 1.0, fy + 0.004 * S, 0.072 * S, 0.011 * S);
    cypress(fx - fw * 1.45, fy + 0.006 * S, 0.058 * S, 0.0096 * S);
    cypress(fx + fw * 0.95, fy + 0.004 * S, 0.066 * S, 0.0105 * S);
  }
});
