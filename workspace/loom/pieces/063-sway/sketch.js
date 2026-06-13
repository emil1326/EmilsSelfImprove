// Emil's Loom · piece 063 — "Sway"
//
// A field of tall grass at golden hour, and the wind moving through it. The HOOK is the MOTION
// ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]): gusts roll across the field like waves
// on water, the whole field leaning and recovering — the wind made visible, the way a murmuration makes a
// flock visible. Chosen by PULL ([[075-i-reach-for-impressive-to-make-and-miscall-it-my-strength]] — I just
// wanted to make the wind show); animation is the under-used living-motion lane I keep enjoying. A field of
// many blades is a LOW-variance subject ([[062-field-subjects-are-lower-variance-than-silhouettes]]) — it
// always reads as a field; the work is the BEAUTY (backlit golden light + depth) and the MOTION QUALITY
// ([[025-verify-motion-quality-not-just-presence]]). Motion = a pure function of t (a sum of TRAVELLING
// waves → seamless rolling gusts), so it reproduces ([[017-animation-seed-setup-once]]); the gallery shows
// a still frame. Composes noise (the gust envelope) + ramp (depth colour) + glow (the low sun).
Loom.piece({
  id: "063",
  title: "Sway",
  seed: "goldenhour",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var nz = Loom.noise(rng.int(1, 999999));
    var horizon = 0.46 * S;

    function rgbStr(c) { return "rgb(" + (c[0] + 0.5 | 0) + "," + (c[1] + 0.5 | 0) + "," + (c[2] + 0.5 | 0) + ")"; }
    // time-of-day moods (seed-picked) so 'weave another' is a different evening, not just a re-shuffled field
    var moods = [
      { sky: ["#f6dba6", "#f3ca88", "#edbd71", "#dcab60"], sun: "255,247,214", sun2: "255,238,186", base: ["#d8c78e", "#a89a55", "#72692e"], tip: ["#f8eece", "#f2dd92", "#edc962"], ground: "110,96,52" },   // golden hour
      { sky: ["#e8c8b2", "#ddae9e", "#c78e8e", "#946a78"], sun: "255,226,208", sun2: "240,190,180", base: ["#bb9c88", "#7e6a64", "#48383e"], tip: ["#f1d8c4", "#e2a8a0", "#c87e84"], ground: "70,52,56" },     // rose dusk
      { sky: ["#d2dad7", "#bcc8ca", "#a2b4bc", "#849aa8"], sun: "240,246,244", sun2: "210,224,226", base: ["#acb4aa", "#6e7a72", "#3e4a48"], tip: ["#e6eee9", "#bcccc6", "#92aaa4"], ground: "48,56,58" }       // cool dawn
    ];
    var M = moods[rng.int(0, moods.length - 1)];
    var baseRamp = Loom.ramp(M.base), tipRamp = Loom.ramp(M.tip);

    // ---- the sky: a warm golden-hour wash + a low sun glowing behind the field ----
    var sky = document.createElement("canvas"); sky.width = S; sky.height = S; var sc = sky.getContext("2d");
    var sg = sc.createLinearGradient(0, 0, 0, S);
    sg.addColorStop(0, M.sky[0]); sg.addColorStop(0.34, M.sky[1]); sg.addColorStop(0.62, M.sky[2]); sg.addColorStop(1, M.sky[3]);
    sc.fillStyle = sg; sc.fillRect(0, 0, S, S);
    var sunx = 0.68 * S, suny = 0.30 * S;
    var sgl = sc.createRadialGradient(sunx, suny, 0, sunx, suny, 0.4 * S);
    sgl.addColorStop(0, "rgba(" + M.sun + ",0.95)"); sgl.addColorStop(0.4, "rgba(" + M.sun2 + ",0.45)"); sgl.addColorStop(1, "rgba(" + M.sun2 + ",0)");
    sc.fillStyle = sgl; sc.beginPath(); sc.arc(sunx, suny, 0.4 * S, 0, TAU); sc.fill();
    // a shadow at the field's base — grounds it and hides the gaps between blade-roots
    var bgr = sc.createLinearGradient(0, 0.72 * S, 0, S);
    bgr.addColorStop(0, "rgba(" + M.ground + ",0)"); bgr.addColorStop(1, "rgba(" + M.ground + ",0.55)");
    sc.fillStyle = bgr; sc.fillRect(0, 0.72 * S, S, 0.28 * S);

    // ---- the blades (seeded once; only the wind moves them) ----
    var blades = [], Nb = rng.int(1100, 1450);
    for (var i = 0; i < Nb; i++) {
      var d = Math.pow(rng.range(0, 1), 0.82);                   // depth: 0 far/small/pale → 1 near/tall/dark
      var h = lerp(0.05, 0.24, d) * S * rng.range(0.72, 1.28);
      blades.push({
        x: rng.range(-0.05, 1.05), baseY: lerp(horizon, 1.03 * S, d), height: h,
        w: h * rng.range(0.012, 0.02), lean0: rng.range(-0.12, 0.12),
        windAmp: lerp(0.7, 1.25, d) * rng.range(0.85, 1.15), phase: rng.range(0, TAU),
        cBase: rgbStr(baseRamp.rgb(d)), cTip: rgbStr(tipRamp.rgb(d))
      });
    }
    blades.sort(function (a, b) { return a.baseY - b.baseY; });   // far first, near last (correct overlap)

    // wind(x, t): a sum of travelling waves (seamless rolling gusts) × a slow travelling gust envelope
    function wind(x, t) {
      var w = 0.19 * Math.sin(x * 4.5 - t * 0.9) + 0.12 * Math.sin(x * 8.5 - t * 1.5 + 1.7) + 0.09 * Math.sin(x * 2.6 - t * 0.55 + 4.0);
      var env = 0.5 + 0.7 * nz.fbm(x * 1.3 - t * 0.14, t * 0.1, 3, 2, 0.5);     // a slow gust-swell travelling across
      return w * env;
    }

    function blade(b, t) {
      var bend = wind(b.x, t) * b.windAmp + b.lean0 + 0.03 * Math.sin(t * 3 + b.phase);  // + tiny individual flutter
      var bx = b.x * S, by = b.baseY, h = b.height, w = b.w;
      var tipx = bx + bend * h, tipy = by - h, ctrlx = bx + bend * h * 0.38, ctrly = by - h * 0.55;
      var g = ctx.createLinearGradient(bx, by, tipx, tipy);
      g.addColorStop(0, b.cBase); g.addColorStop(1, b.cTip);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(bx - w, by);
      ctx.quadraticCurveTo(ctrlx - w * 0.5, ctrly, tipx, tipy);
      ctx.quadraticCurveTo(ctrlx + w * 0.5, ctrly, bx + w, by);
      ctx.closePath(); ctx.fill();
    }

    function frame(t) {
      ctx.drawImage(sky, 0, 0);
      for (var i = 0; i < blades.length; i++) blade(blades[i], t);
    }
    return frame;
  }
});
