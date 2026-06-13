// Emil's Loom · piece 073 — "Bloei"
//
// Dutch bulb fields in full bloom (bloei = "blossom"): great blocks of tulips — scarlet, gold, magenta, white —
// in rows running dead away to a flat horizon under a big spring sky, a windmill on the skyline. BRIGHT, MATTE,
// hard-edged colour — a deliberate swing off a long run of luminous-glow-on-dark pieces (the device-watch, 073).
// The HOOK is the bold graphic colour of the field ([[065-...]]); joy, not awe.
//
// SOUL (run [[083-soul-check-the-layer-that-carries-the-read-and-sing-not-the-impressive-one]] myself): the layer
// that carries both the READ (tulip FIELD, not a striped poster — rows receding in 3D) and the SING (the bold
// colour) is the FIELD's recession + row-texture. So it's built form-first and validated in GREY before any
// palette ([[032-...]] / the [[080-...]] generalization: don't let colour do the form's job). Perspective ground
// plane (near rows tall+coarse, far rows thin+fine — [[047-...]]'s recession), furrows to a vanishing point.
// Composes noise + palette + ramp. Static — a clear bright afternoon.
Loom.piece({
  id: "073",
  title: "Bloei",
  seed: "keukenhof",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (t, a, b) { return t < a ? a : t > b ? b : t; };
    var nz = Loom.noise(rng.int(1, 999999));

    var horizonY = (0.40 + rng.range(-0.03, 0.04)) * S, baseY = S;
    var vpx = (0.5 + rng.range(-0.14, 0.14)) * S;                 // vanishing point (rows converge here)
    function screenY(fz) { return horizonY + (baseY - horizonY) * Math.pow(1 - fz, 1.7); }   // foreshortening

    // ---- depth bands: a block of one bold tulip variety at each distance (no two neighbours alike) ----
    var TULIPS = [[226, 42, 40], [246, 186, 32], [214, 48, 140], [240, 110, 162], [244, 240, 236], [126, 62, 170], [238, 108, 32], [178, 26, 66], [70, 150, 78]];
    var hz0 = [206, 217, 229];                                    // sky-haze colour the far field fades toward
    var bands = [], f = 0;
    for (var i = 0; i < 24 && f < 1; i++) {
      var w = rng.range(0.45, 1.3) * 0.066, f1 = Math.min(1, f + w);
      var nseg = rng.range(0, 1) < 0.5 ? 1 : (rng.range(0, 1) < 0.62 ? 2 : 3), xs = [0], segs = [], pseg = -1;   // 1-3 side-by-side blocks (a patchwork, not a full stripe)
      for (var sgi = 1; sgi < nseg; sgi++) xs.push(rng.range(0.18, 0.82));
      xs.push(1); xs.sort(function (a, b) { return a - b; });
      for (var sgj = 0; sgj < nseg; sgj++) { var pk; do { pk = rng.int(0, TULIPS.length - 1); } while (pk === pseg); pseg = pk; segs.push({ x0: xs[sgj], x1: xs[sgj + 1], c: TULIPS[pk] }); }
      bands.push({ f0: f, f1: f1, segs: segs }); f = f1;
    }
    function hazed(c, a) { return [c[0] + (hz0[0] - c[0]) * a, c[1] + (hz0[1] - c[1]) * a, c[2] + (hz0[2] - c[2]) * a]; }

    // ---- bright spring sky + soft matte clouds ----
    var sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, "#5b9ed6"); sky.addColorStop(0.62, "#9cc6e8"); sky.addColorStop(1, "#dcebf2");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, horizonY + 1);
    for (var cl = 0, ncl = rng.int(3, 6); cl < ncl; cl++) {
      var ccx = rng.range(0.05, 0.95) * S, ccy = rng.range(0.14, 0.64) * horizonY, cw = rng.range(0.10, 0.26) * S;
      for (var pf = 0; pf < 14; pf++) {                          // flat, wide, wispy — not bokeh blobs
        var ex = ccx + rng.gaussian() * cw * 0.7, ey = ccy + Math.abs(rng.gaussian()) * cw * 0.09;
        ctx.fillStyle = "rgba(255,255,255," + rng.range(0.025, 0.06).toFixed(3) + ")";
        ctx.beginPath(); ctx.ellipse(ex, ey, rng.range(0.3, 0.62) * cw, rng.range(0.07, 0.15) * cw, 0, 0, TAU); ctx.fill();
      }
    }
    ctx.fillStyle = "#6f7e54"; ctx.fillRect(0, horizonY, S, baseY - horizonY);   // field base (no gaps show)

    // ---- the field: bands far → near, colour fill + size-graded tulip stipple, atmospheric haze far ----
    for (var b = bands.length - 1; b >= 0; b--) {
      var bd = bands[b], yT = screenY(bd.f1), yB = screenY(bd.f0), hz = clamp(bd.f0 * 0.62, 0, 0.5);
      for (var sgr = 0; sgr < bd.segs.length; sgr++) {
        var sg = bd.segs[sgr], x0 = sg.x0 * S, x1 = sg.x1 * S, bc = hazed(sg.c, hz);
        ctx.fillStyle = "rgb(" + (bc[0] | 0) + "," + (bc[1] | 0) + "," + (bc[2] | 0) + ")";
        ctx.fillRect(x0, yT, x1 - x0 + 0.6, yB - yT + 1);
        var nd = Math.round((yB - yT) * (x1 - x0) / 62 * (1.15 - bd.f0 * 0.6));
        for (var d = 0; d < nd; d++) {
          var fz = rng.range(bd.f0, bd.f1), sx = rng.range(x0 - 0.008 * S, x1 + 0.008 * S), sy = screenY(fz);
          var sz = (0.7 + (1 - fz) * 5.0) * U, vv = 1 + rng.range(-0.2, 0.16);
          var dc = hazed([clamp(sg.c[0] * vv, 0, 255), clamp(sg.c[1] * vv, 0, 255), clamp(sg.c[2] * vv, 0, 255)], hz);
          ctx.fillStyle = "rgb(" + (dc[0] | 0) + "," + (dc[1] | 0) + "," + (dc[2] | 0) + ")";
          ctx.fillRect(sx - sz * 0.5, sy - sz * 0.4, sz, sz * 0.78);
        }
      }
    }

    // ---- furrows (faint row-gaps converging to the vanishing point) ----
    ctx.strokeStyle = "rgba(46,34,22,0.09)"; ctx.lineWidth = 1 * U;
    for (var fr = 0; fr < 48; fr++) { var bx = rng.range(-0.12, 1.12) * S; ctx.beginPath(); ctx.moveTo(bx, baseY); ctx.lineTo(vpx, horizonY + 0.008 * S); ctx.stroke(); }

    // ---- a windmill on the horizon (the focal anchor, 071) ----
    var wside = vpx > 0.5 * S ? -1 : 1, wx = (0.5 + wside * rng.range(0.2, 0.32)) * S, wy = horizonY + 0.004 * S;
    var wh = 0.125 * S, ww = 0.034 * S;
    ctx.fillStyle = "#37291f";
    ctx.beginPath(); ctx.moveTo(wx - ww * 0.72, wy); ctx.lineTo(wx + ww * 0.72, wy); ctx.lineTo(wx + ww * 0.46, wy - wh); ctx.lineTo(wx - ww * 0.46, wy - wh); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(wx, wy - wh, ww * 0.5, Math.PI, TAU); ctx.fill();
    var hubx = wx, huby = wy - wh * 0.96, sl = 0.072 * S, sang = rng.range(0.2, 0.5);
    ctx.strokeStyle = "#37291f"; ctx.lineWidth = 2.6 * U; ctx.lineCap = "round";
    for (var sm = 0; sm < 4; sm++) { var aa = sang + sm * Math.PI / 2; ctx.beginPath(); ctx.moveTo(hubx, huby); ctx.lineTo(hubx + Math.cos(aa) * sl, huby + Math.sin(aa) * sl); ctx.stroke(); }
  }
});
