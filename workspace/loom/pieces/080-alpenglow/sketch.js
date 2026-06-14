// Emil's Loom · piece 080 — "Alpenglow"
//
// The first light of dawn on a high snow peak — the few minutes when the sun is still below the horizon for
// everything else but the summit catches it and burns rose-gold against a sky still in twilight. Serene-light
// / awe (my actual 5-lane, [[075-i-reach-for-impressive-to-make-and-miscall-it-my-strength]]). Ran 083: the
// SING is the alpenglow ON SNOW — so the soul is the lit FORM, and the form lives in the CONTRAST between a
// brilliant pink-white sun-face and a deep cool-blue shadow-face ([[080-render-a-3d-space-with-form-under-light-not-a-warped-texture-slab]]:
// lead with form under raking light; and snow, not saturated rock, or it reads as a glowing pyramid). The peak
// rises from a cloud-sea for scale. Ridgelines are midpoint-displaced (procedural -> a different mountain each
// seed = the variation axis, not a palette pick). Composes noise + glow + ramp.
Loom.piece({
  id: "080",
  title: "Alpenglow",
  seed: "rakaposhi",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;

    function ridge(x0, y0, x1, y1, disp, n) {
      var pts = [[x0, y0], [x1, y1]];
      for (var it = 0; it < n; it++) {
        var np = [];
        for (var i = 0; i < pts.length - 1; i++) {
          var a = pts[i], b = pts[i + 1];
          np.push(a);
          var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
          var d = rng.gaussian() * disp * Math.pow(0.52, it);
          np.push([mx - dy / L * d, my + dx / L * d]);
        }
        np.push(pts[pts.length - 1]); pts = np;
      }
      return pts;
    }
    function trace(pts) { ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); }

    // ---- twilight sky: deep blue above, a warm dawn band low + a few fading stars ----
    var sky = ctx.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, "#141d36"); sky.addColorStop(0.42, "#2c3a5c"); sky.addColorStop(0.74, "#6a627a"); sky.addColorStop(0.92, "#bc8c76");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);
    for (var stt = 0; stt < 40; stt++) { var syy = rng.range(0, 0.34) * S; ctx.fillStyle = "#cdd6e8"; ctx.globalAlpha = 0.7 * (1 - syy / (0.34 * S)); ctx.fillRect(rng.range(0, S), syy, 1.2 * U, 1.2 * U); }
    ctx.globalAlpha = 1;

    var Sx = 0.52 * S, Sy = 0.235 * S, baseY = 0.72 * S, BLx = 0.06 * S, BRx = 0.96 * S, BMx = 0.585 * S;
    var LR = ridge(BLx, baseY, Sx, Sy, 0.05 * S, 6);
    var RR = ridge(Sx, Sy, BRx, baseY, 0.05 * S, 6);
    var DR = ridge(Sx, Sy, BMx, baseY, 0.035 * S, 6);

    ctx.save();
    ctx.beginPath(); trace(LR); for (var i2 = 1; i2 < RR.length; i2++) ctx.lineTo(RR[i2][0], RR[i2][1]);
    ctx.lineTo(BRx, baseY); ctx.lineTo(BLx, baseY); ctx.closePath(); ctx.clip();

    // deep cool-blue SHADOW snow across the whole massif (genuinely DARK — alpenglow is warm-bright vs cool-DARK)
    var cool = ctx.createLinearGradient(0, Sy, 0, baseY);
    cool.addColorStop(0, "#46557a"); cool.addColorStop(0.5, "#293656"); cool.addColorStop(1, "#141d36");
    ctx.fillStyle = cool; ctx.fillRect(0, 0, S, S);

    // the SUNLIT (right) face: brilliant pink-white snow taking the alpenglow
    ctx.beginPath(); trace(RR); ctx.lineTo(BRx, baseY); ctx.lineTo(BMx, baseY);
    for (var j = DR.length - 1; j >= 0; j--) ctx.lineTo(DR[j][0], DR[j][1]); ctx.closePath();
    var warm = ctx.createLinearGradient(0, Sy, 0, baseY);
    warm.addColorStop(0, "#fff1e6"); warm.addColorStop(0.32, "#fbceb6"); warm.addColorStop(0.64, "#e69a8c"); warm.addColorStop(1, "#7c5c68");
    ctx.fillStyle = warm; ctx.fill();   // FILL THE FACE POLYGON — not fillRect (which overwrote the whole massif)

    // aretes radiating from the summit -> faceted form (faint shadow creases)
    for (var k = 0; k < 7; k++) {
      var bx = rng.range(0.12, 0.92) * S, cr = ridge(Sx, Sy, bx, baseY, 0.026 * S, 5);
      ctx.strokeStyle = bx < Sx ? "rgba(28,42,70,0.30)" : "rgba(150,92,92,0.16)";
      ctx.lineWidth = rng.range(1.0, 2.1) * U; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.beginPath(); trace(cr); ctx.stroke();
    }
    ctx.restore();

    // ---- the summit blazes, and the catch-light rims the sun-facing edges ----
    Loom.glow(ctx, Sx, Sy + 0.015 * S, 0.15 * S, "#ffdcab", 0.4, 0.45);
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.strokeStyle = "#fff0d8"; ctx.lineWidth = 2.1 * U; ctx.beginPath(); trace(RR); ctx.stroke();
    ctx.strokeStyle = "rgba(255,232,198,0.6)"; ctx.lineWidth = 1.4 * U; ctx.beginPath(); trace(DR); ctx.stroke();

    // ---- the cloud-sea the peak rises from (SOURCE-OVER puffs so they can't stack to white, 051/077) ----
    var nz = Loom.noise(rng.int(1, 99999));
    var band = ctx.createLinearGradient(0, baseY - 0.03 * S, 0, S);
    band.addColorStop(0, "rgba(176,166,186,0)"); band.addColorStop(0.32, "rgba(170,160,180,0.55)"); band.addColorStop(1, "#867e94");
    ctx.fillStyle = band; ctx.fillRect(0, baseY - 0.03 * S, S, S);
    function puff(x, y, r, col, a) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, Loom.rgba(col, a)); g.addColorStop(1, Loom.rgba(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    for (var c = 0; c < 46; c++) {
      var cxp = rng.range(-0.05, 1.05) * S, cyp = baseY + 0.012 * S + rng.range(0, 0.13) * S + nz.fbm(cxp * 0.012, 0, 2) * 0.03 * S;
      var warmTop = cyp < baseY + 0.045 * S;
      puff(cxp, cyp, rng.range(0.05, 0.12) * S, warmTop ? "#f2d6c6" : "#c6bccc", warmTop ? 0.5 : 0.46);
    }
  }
});
