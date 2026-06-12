// Emil's Loom · piece 040 — "Hush"
//
// A red fox curled asleep in the snow, nose tucked under its bushy tail. The deliberate WARM answer to the
// cold lonely lighthouse (#039): one small spot of orange life in a vast cold-white quiet. The HOOK is the
// warmth-against-cold ([[022-luminosity-on-bright-is-tone]] — on snow, luminosity is tone, and the fox is
// warm where everything else is cool) and the peaceful CURL — a comma of fur, the whole animal at rest. A
// winter register the gallery hasn't had.
//
// Built silhouette-first ([[035-defining-feature-is-often-the-hard-part]] — the curl + the wrapped tail +
// the one ear are the read), as overlapping warm masses rather than one perfect path. Stylised fur (tonal
// masses + a few directional strokes + a cool snow-light rim), not literal hairs. Composes noise (#3, fur +
// snow texture) + the palette helpers. Static.
Loom.piece({
  id: "040",
  title: "Hush",
  seed: "renard",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- the cold: a soft snow field under a pale dusk sky ----
    var sky = ctx.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, "#c2cadc"); sky.addColorStop(0.45, "#d6dae6"); sky.addColorStop(0.62, "#e6e8ee");
    sky.addColorStop(1, "#cdd6e4");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);
    // a faint cold horizon + a whisper of dusk warmth low, so the cold isn't dead
    var hz = S * 0.46;
    var warmHz = ctx.createLinearGradient(0, hz - S * 0.1, 0, hz + S * 0.14);
    warmHz.addColorStop(0, "rgba(232,200,180,0)"); warmHz.addColorStop(0.5, "rgba(236,206,184,0.22)"); warmHz.addColorStop(1, "rgba(236,206,184,0)");
    ctx.fillStyle = warmHz; ctx.fillRect(0, hz - S * 0.1, S, S * 0.24);
    // distant blurred treeline (cold, low-contrast — depth without stealing focus)
    ctx.fillStyle = "rgba(150,162,182,0.4)";
    ctx.beginPath(); ctx.moveTo(0, hz);
    for (var tx = 0; tx <= 1.0; tx += 0.025) {
      var th = hz - (nz.fbm(tx * 6 + 2, 4, 3, 2, 0.5)) * S * 0.06 - (tx > 0.3 && tx < 0.5 ? S * 0.02 : 0);
      ctx.lineTo(tx * S, th);
    }
    ctx.lineTo(S, hz + S * 0.04); ctx.lineTo(0, hz + S * 0.04); ctx.closePath(); ctx.fill();
    // the snow: a slightly warmer-cool field, with a soft hollow where the fox nestles
    var snow = ctx.createLinearGradient(0, hz, 0, S);
    snow.addColorStop(0, "#dde4ee"); snow.addColorStop(1, "#c0cee0");
    ctx.fillStyle = snow; ctx.fillRect(0, hz, S, S - hz);

    // ---- the fox: sitting in the snow, facing left, the bushy tail curled round the front ----
    var R = S * 0.28;
    var furMid = "#cf6a2c", furDark = "#a8501e", furLit = "#ec9858", furRim = "#f9d6a6";
    var foxWhite = "#f4ece0", foxBlack = "#27190f";
    var P = function (fx, fy) { return [fx * S, fy * S]; };      // proportional point helper
    function grad(x0, y0, x1, y1) { var g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, furLit); g.addColorStop(0.55, furMid); g.addColorStop(1, furDark); return g; }

    // the fox is built facing left; mirror it for variety so "weave another" turns the fox around
    var faceLeft = rng.bool();
    ctx.save();
    if (!faceLeft) { ctx.translate(S, 0); ctx.scale(-1, 1); }

    // soft contact shadow
    var sh = ctx.createRadialGradient(S * 0.54, S * 0.81, R * 0.1, S * 0.54, S * 0.81, R * 1.25);
    sh.addColorStop(0, "rgba(116,130,156,0.5)"); sh.addColorStop(1, "rgba(116,130,156,0)");
    ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(S * 0.52, S * 0.815, R * 1.15, R * 0.24, 0, 0, TAU); ctx.fill();

    // (1) the bushy TAIL first (behind), sweeping from the rump down and round to the front-left, tip up
    ctx.fillStyle = furMid;
    ctx.beginPath();
    ctx.moveTo(S * 0.62, S * 0.54);
    ctx.bezierCurveTo(S * 0.85, S * 0.58, S * 0.85, S * 0.83, S * 0.60, S * 0.86);
    ctx.bezierCurveTo(S * 0.40, S * 0.875, S * 0.27, S * 0.80, S * 0.29, S * 0.65);
    ctx.bezierCurveTo(S * 0.30, S * 0.55, S * 0.42, S * 0.545, S * 0.46, S * 0.63);
    ctx.bezierCurveTo(S * 0.42, S * 0.66, S * 0.49, S * 0.75, S * 0.56, S * 0.70);
    ctx.bezierCurveTo(S * 0.63, S * 0.66, S * 0.61, S * 0.575, S * 0.62, S * 0.54);
    ctx.closePath(); ctx.fill();
    var tg = ctx.createLinearGradient(S * 0.52, S * 0.55, S * 0.4, S * 0.86);
    tg.addColorStop(0, "rgba(236,152,88,0.3)"); tg.addColorStop(1, "rgba(120,56,20,0.42)");
    ctx.fillStyle = tg; ctx.fill();
    ctx.fillStyle = foxWhite;                                    // big white tail tip, curled up at the front
    ctx.beginPath(); ctx.ellipse(S * 0.34, S * 0.62, R * 0.2, R * 0.16, -0.6, 0, TAU); ctx.fill();

    // (2) the haunch / sitting body
    ctx.fillStyle = grad(S * 0.5, S * 0.46, S * 0.62, S * 0.82);
    ctx.beginPath(); ctx.ellipse(S * 0.565, S * 0.64, R * 0.58, R * 0.74, 0.06, 0, TAU); ctx.fill();

    // (3) the chest dropping to the front paws
    ctx.fillStyle = grad(S * 0.45, S * 0.48, S * 0.5, S * 0.8);
    ctx.beginPath();
    ctx.moveTo(S * 0.5, S * 0.5);
    ctx.bezierCurveTo(S * 0.45, S * 0.55, S * 0.45, S * 0.72, S * 0.475, S * 0.8);
    ctx.bezierCurveTo(S * 0.51, S * 0.81, S * 0.55, S * 0.74, S * 0.56, S * 0.6);
    ctx.closePath(); ctx.fill();
    // front legs (two), with dark socks
    ctx.fillStyle = furMid;
    ctx.fillRect(S * 0.468, S * 0.72, R * 0.13, S * 0.085);
    ctx.fillRect(S * 0.515, S * 0.72, R * 0.13, S * 0.085);
    ctx.fillStyle = foxBlack;
    ctx.beginPath(); ctx.ellipse(S * 0.485, S * 0.805, R * 0.085, R * 0.05, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S * 0.532, S * 0.805, R * 0.085, R * 0.05, 0, 0, TAU); ctx.fill();

    // (4) the head, facing left — skull + tapering snout
    ctx.fillStyle = grad(S * 0.52, S * 0.36, S * 0.44, S * 0.5);
    ctx.beginPath();
    ctx.moveTo(S * 0.355, S * 0.445);                            // snout tip (left)
    ctx.bezierCurveTo(S * 0.40, S * 0.40, S * 0.45, S * 0.385, S * 0.50, S * 0.40);
    ctx.bezierCurveTo(S * 0.555, S * 0.415, S * 0.565, S * 0.47, S * 0.535, S * 0.50);
    ctx.bezierCurveTo(S * 0.49, S * 0.525, S * 0.42, S * 0.50, S * 0.39, S * 0.475);
    ctx.closePath(); ctx.fill();
    // ears — two pricked triangles, black-tipped
    function ear(bx2, by2, tipx, tipy, bx3, by3) {
      ctx.fillStyle = furMid; ctx.beginPath(); ctx.moveTo(S * bx2, S * by2); ctx.lineTo(S * tipx, S * tipy); ctx.lineTo(S * bx3, S * by3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = foxBlack; ctx.beginPath();
      ctx.moveTo(S * tipx, S * tipy); ctx.lineTo(S * (tipx + (bx2 - tipx) * 0.42), S * (tipy + (by2 - tipy) * 0.42)); ctx.lineTo(S * (tipx + (bx3 - tipx) * 0.42), S * (tipy + (by3 - tipy) * 0.42)); ctx.closePath(); ctx.fill();
    }
    ear(0.455, 0.405, 0.45, 0.315, 0.50, 0.40);                  // near ear
    ear(0.505, 0.40, 0.535, 0.315, 0.55, 0.405);                 // far ear
    // inner-ear warm
    ctx.fillStyle = "#eaae80";
    ctx.beginPath(); ctx.ellipse(S * 0.472, S * 0.375, R * 0.04, R * 0.075, 0.1, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S * 0.527, S * 0.372, R * 0.04, R * 0.075, -0.1, 0, TAU); ctx.fill();

    // (5) white muzzle/cheek/throat bib + black nose + the soft eye
    ctx.fillStyle = foxWhite;
    ctx.beginPath();                                             // muzzle + throat
    ctx.moveTo(S * 0.36, S * 0.45);
    ctx.bezierCurveTo(S * 0.40, S * 0.47, S * 0.44, S * 0.49, S * 0.47, S * 0.52);
    ctx.bezierCurveTo(S * 0.485, S * 0.6, S * 0.47, S * 0.72, S * 0.5, S * 0.78);
    ctx.bezierCurveTo(S * 0.45, S * 0.74, S * 0.43, S * 0.6, S * 0.41, S * 0.5);
    ctx.bezierCurveTo(S * 0.39, S * 0.475, S * 0.37, S * 0.465, S * 0.36, S * 0.45);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = foxBlack;                                    // nose
    ctx.beginPath(); ctx.ellipse(S * 0.354, S * 0.447, R * 0.045, R * 0.035, 0.3, 0, TAU); ctx.fill();
    // eye — a soft almond, calm
    ctx.fillStyle = "#3a2414";
    ctx.beginPath(); ctx.ellipse(S * 0.452, S * 0.445, R * 0.05, R * 0.032, 0.1, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,240,210,0.85)";
    ctx.beginPath(); ctx.arc(S * 0.447, S * 0.44, R * 0.013, 0, TAU); ctx.fill();

    // ---- fur texture: a few soft directional strokes following the body + tail ----
    ctx.globalAlpha = 0.42; ctx.lineCap = "round";
    for (var i = 0, nf = Math.round(180 * U); i < nf; i++) {
      var px = rng.range(0.36, 0.78), py = rng.range(0.42, 0.82);
      var dxc = px - 0.57, dyc = py - 0.64;
      if (dxc * dxc * 3.2 + dyc * dyc * 2.0 > 0.12) continue;     // roughly within the fox mass
      var x0 = px * S, y0 = py * S, len = R * rng.range(0.04, 0.1);
      var dir = 1.9 + (px - 0.57) * 1.2 + rng.range(-0.25, 0.25);
      var bright = nz.fbm(px * 7 + 5, py * 7 + 5, 2, 2, 0.5);
      ctx.strokeStyle = Loom.rgba(bright > 0.55 ? furRim : furDark, 0.45);
      ctx.lineWidth = rng.range(0.6, 1.3) * U;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(dir) * len, y0 + Math.sin(dir) * len); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ---- the cool snow-light rim along the back + head + tail (the warm-cold meeting) ----
    ctx.strokeStyle = "rgba(228,236,250,0.3)"; ctx.lineWidth = 2.4 * U; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(S * 0.515, S * 0.345);                           // soft, hugging the true back edge
    ctx.bezierCurveTo(S * 0.57, S * 0.42, S * 0.645, S * 0.46, S * 0.69, S * 0.56);
    ctx.bezierCurveTo(S * 0.725, S * 0.63, S * 0.72, S * 0.72, S * 0.69, S * 0.79);
    ctx.stroke();
    ctx.restore();                                                // end the fox mirror

    // ---- falling snow: soft specks, varied size + blur for depth ----
    for (i = 0; i < Math.round(150 * U); i++) {
      var fx2 = rng.range(0, 1) * S, fy2 = rng.range(0, 1) * S;
      var near = rng.range(0, 1), fr = (0.6 + near * 2.2) * U;
      ctx.fillStyle = "rgba(255,255,255," + (0.3 + near * 0.55).toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(fx2, fy2, fr, 0, TAU); ctx.fill();
    }

    // ---- a soft cool vignette to settle the quiet ----
    var vg = ctx.createRadialGradient(S * 0.52, S * 0.6, S * 0.32, S * 0.5, S * 0.56, S * 0.74);
    vg.addColorStop(0, "rgba(160,175,200,0)"); vg.addColorStop(1, "rgba(150,166,196,0.4)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
