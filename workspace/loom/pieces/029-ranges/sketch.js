// Emil's Loom · piece 029 — "Ranges"
//
// Layered mountain ridges receding into morning mist — a shan-shui / ink-wash landscape: pale, serene,
// almost all negative space. The deliberate tonal OPPOSITE of the recent run (the cool attractor, the
// lightning, the lava were all luminous-on-dark); this is dark-on-pale, quiet where they were loud. A
// register the gallery didn't have: atmospheric perspective — depth built purely from how much haze sits
// between you and each ridge.
//
// The whole illusion is ONE idea, done with care: each ridge farther away is PALER and HAZIER (more air
// in between), and the valleys between them fill with white mist, so every ridge rises out of the fog and
// its base dissolves back into it. On a pale ground luminosity is TONE, not additive light
// ([[022-luminosity-on-bright-is-tone]]) — so the dawn glow is a plain source-over gradient and the depth
// is a deliberate pale→dark tonal ramp, never a blend mode. Ridgelines are fbm profiles (#3); a few far
// birds give scale and a breath of life ([[035-defining-feature-is-often-the-hard-part]] — the soul).
// Composes noise (#3) + ramp (#11) + the palette helpers. Static.
Loom.piece({
  id: "029",
  title: "Ranges",
  seed: "dawn",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size;
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- sky: pale and cool up high, a faint warm dawn down at the mist line ----
    var sky = ctx.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0.00, "#dde6ec");
    sky.addColorStop(0.50, "#eaeeec");
    sky.addColorStop(0.78, "#f6ecdd");      // faint dawn warmth
    sky.addColorStop(1.00, "#f4e6d2");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);

    // a soft dawn glow low behind the ranges — a TONE gradient, not additive (022: glow is inert on pale)
    var dawn = ctx.createRadialGradient(S * 0.52, S * 0.86, S * 0.04, S * 0.52, S * 0.86, S * 0.6);
    dawn.addColorStop(0, "rgba(255, 219, 166, 0.7)");
    dawn.addColorStop(1, "rgba(255, 219, 166, 0)");
    ctx.fillStyle = dawn; ctx.fillRect(0, 0, S, S);

    // ---- ridges, far → near: paler/hazier far, darker/taller near (atmospheric perspective) ----
    var N = 6;
    var ridges = [];
    for (var i = 0; i < N; i++) {
      var f = i / (N - 1);                                  // 0 far … 1 near
      ridges.push({
        meanY: (0.36 + 0.60 * f) * S,
        amp: (0.022 + 0.080 * f) * S,
        freq: 1.3 + 2.4 * f,
        off: rng.range(0, 100),
        peaky: rng.range(0.7, 1.5),                        // some ranges dramatic, some gentle
        f: f
      });
    }
    // pale blue-grey (far) → dark slate (near)
    var tone = Loom.ramp(["#c2cfd8", "#a3b4bf", "#7d8e99", "#566671", "#3a4750", "#26323a"]);
    var mist = "#edefec";

    for (var ri = 0; ri < N; ri++) {
      var R = ridges[ri];
      ctx.beginPath();
      ctx.moveTo(0, S);
      for (var x = 0; x <= S; x += 3) {
        // a low-freq term gives each ridge its big dramatic peaks (scaled by its peakiness),
        // a higher-freq term the fine crags — so the ranges have individual character, not 6 same waves
        var big = nz.fbm(x / S * (0.7 + R.freq * 0.45) + R.off + 40, R.off, 3, 2.0, 0.6);
        var det = nz.fbm(x / S * (R.freq * 2.0) + R.off, R.off * 0.3 + 5, 4, 2.0, 0.5);
        var prof = (big - 0.5) * R.amp * 2.2 * R.peaky + (det - 0.5) * R.amp * 0.9;
        ctx.lineTo(x, R.meanY - prof);
      }
      ctx.lineTo(S, S);
      ctx.closePath();

      // fill: ridge tone at the crest, dissolving to white mist down in the valley before the next ridge
      var gtop = R.meanY - R.amp;
      var gbot = (ri < N - 1 ? ridges[ri + 1].meanY : S);
      var grad = ctx.createLinearGradient(0, gtop, 0, gbot);
      grad.addColorStop(0, tone.css(R.f));
      // the nearest ridge stays grounded (doesn't melt into mist); far ones dissolve fully
      grad.addColorStop(1, ri < N - 1 ? mist : tone.css(0.78));
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // ---- drifting mist wisps in the valleys, so the haze curls instead of sitting as a clean gradient ----
    ctx.globalCompositeOperation = "source-over";
    var wisps = 7;
    for (var mw = 0; mw < wisps; mw++) {
      var mxc = S * rng.range(0.15, 0.85), my = S * rng.range(0.34, 0.80);
      var mwid = S * rng.range(0.22, 0.46);
      var ma = rng.range(0.10, 0.20);
      var mg = ctx.createRadialGradient(mxc, my, 0, mxc, my, mwid);
      mg.addColorStop(0, "rgba(255,255,255," + ma.toFixed(3) + ")");
      mg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.save();
      ctx.translate(mxc, my); ctx.scale(1, rng.range(0.08, 0.16)); ctx.translate(-mxc, -my);  // flatten → a horizontal wisp
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mxc, my, mwid, 0, 6.2832); ctx.fill();
      ctx.restore();
    }

    // ---- a few far birds, high in the mist, for scale and a breath of life ----
    var bx = S * rng.range(0.18, 0.42), by = S * rng.range(0.24, 0.36);
    var flock = 5 + rng.int(0, 3);
    ctx.strokeStyle = "rgba(70, 84, 92, 0.55)";
    ctx.lineWidth = Math.max(1, S * 0.0016);
    ctx.lineCap = "round";
    for (var b = 0; b < flock; b++) {
      var wx = bx + b * S * 0.022 + rng.range(-S * 0.006, S * 0.006);
      var wy = by + (b - flock / 2) * S * 0.012 + rng.range(-S * 0.006, S * 0.006);
      var w = S * (0.011 + rng.range(0, 0.004));
      ctx.beginPath();
      ctx.moveTo(wx - w, wy + w * 0.5);
      ctx.quadraticCurveTo(wx, wy - w * 0.35, wx + w * 0.05, wy);     // a soft V — two wing strokes
      ctx.quadraticCurveTo(wx, wy - w * 0.35, wx + w, wy + w * 0.5);
      ctx.stroke();
    }
  }
});
