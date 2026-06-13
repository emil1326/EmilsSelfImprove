// Emil's Loom · piece 050 — "Salar"
//
// A salt flat under a finger of water after the rain — the Salar de Uyuni trick, where the world goes
// perfectly double. A twilight sky above, and the same sky again below, so exact the horizon dissolves and
// a lone figure seems to stand on the clouds themselves, unsure which way is up. The HOOK
// ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]] — chosen for it, not just for prettiness):
// the surreal DOUBLING, the special-idea kind of awe. A deliberate bright/twilight break from a long run of
// glow-on-dark, and a 50th piece worth a real "oh".
//
// The whole thing rests on the SKY being beautiful — it's painted TWICE, so a flat sky is a flat piece
// doubled. So the sky is built rich: a deep-to-warm gradient, a painterly cloud FIELD (lib/field.js #16,
// fbm clouds lit warm by the low sun) and a few first stars — rendered ONCE into an offscreen, then drawn
// straight on top and FLIPPED below the horizon as a near-perfect mirror (dimmed, only faintly rippled —
// the stillness is what makes it a mirror and not a lake; the swan/lantern reflection idiom). The lone
// figure + its reflection are the [[035-defining-feature-is-often-the-hard-part]] punch: they reveal the
// trick and give the infinite a scale. Twilight mood + clouds + figure seed-varied
// ([[058-random-features-form-accidental-faces-check-many-seeds]]). Composes field (#16) + noise + glow +
// palette. Static.
Loom.piece({
  id: "050",
  title: "Salar",
  seed: "uyuni",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));
    var rgb = function (h) { var c = Loom.hexToRgb(h); return [c.r, c.g, c.b]; };

    // ---- twilight mood (seed-varied) ----
    var moods = {
      sunset: { top: "#241e44", mid: "#7a4a72", low: "#e08a5c", hor: "#f8d2a0", sun: "#ffe6b4", cloudLit: "#ffb474", cloudDk: "#3a2a4c", star: "#fff0d8" },
      bluehour: { top: "#0e1a3c", mid: "#2a426e", low: "#5e7a9e", hor: "#bcc6cc", sun: "#e0e6e2", cloudLit: "#a8b6cc", cloudDk: "#19233f", star: "#e8eef8" },
      storm: { top: "#1a1c28", mid: "#3c3a4a", low: "#86684e", hor: "#e0aa66", sun: "#ffd68a", cloudLit: "#e4a45e", cloudDk: "#141420", star: "#e2e6f0" }
    };
    var P = moods[rng.pick(["sunset", "sunset", "bluehour", "storm"])];
    var CD = rgb(P.cloudDk), CL = rgb(P.cloudLit);
    function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

    var horizon = S * rng.range(0.47, 0.52);                     // near centre → the world reads truly doubled
    var sunX = S * rng.range(0.22, 0.78), sunY = horizon - S * rng.range(0.0, 0.05);

    // ---- paint the sky ONCE into an offscreen (so the reflection is an exact mirror) ----
    var skyC = document.createElement("canvas"); skyC.width = S; skyC.height = S;
    var g = skyC.getContext("2d");
    var grad = g.createLinearGradient(0, 0, 0, horizon);
    grad.addColorStop(0, P.top); grad.addColorStop(0.5, P.mid); grad.addColorStop(0.82, P.low); grad.addColorStop(1, P.hor);
    g.fillStyle = grad; g.fillRect(0, 0, S, horizon + 1);
    // first stars, high up
    for (var st = 0, nst = Math.round(45 * U); st < nst; st++) {
      var stx = rng.range(0, 1) * S, sty = rng.range(0, 0.5) * horizon;
      g.fillStyle = Loom.rgba(P.star, rng.range(0.1, 0.6) * (1 - sty / horizon));
      g.beginPath(); g.arc(stx, sty, rng.range(0.4, 1.2) * U, 0, TAU); g.fill();
    }
    // the low sun: a soft warm bloom near the horizon
    g.globalCompositeOperation = "lighter";
    var sg = g.createRadialGradient(sunX, sunY, 0, sunX, sunY, S * 0.42);
    sg.addColorStop(0, Loom.rgba(P.sun, 0.7)); sg.addColorStop(0.3, Loom.rgba(P.sun, 0.2)); sg.addColorStop(1, Loom.rgba(P.sun, 0));
    g.fillStyle = sg; g.fillRect(0, 0, S, horizon + 1);
    g.globalCompositeOperation = "source-over";
    // a painterly cloud field (lib/field.js #16): fbm clouds, stretched flat, lit warm by the low sun
    var CW = Math.round(S * 0.62), csc = S / CW;
    var clouds = Loom.field(CW, function (x, y, out) {
      var X = x * csc, Y = y * csc;
      if (Y > horizon) { out[3] = 0; return; }
      var d = nz.fbm(X * 0.0042 + 8, Y * 0.016 + 3, 5, 2.2, 0.55);
      d = clamp((d - 0.48) * 2.6, 0, 1);                        // cloud density (gaps of clear sky between)
      if (d < 0.02) { out[3] = 0; return; }
      var lit = clamp(1 - Math.hypot(X - sunX, Y - sunY) / (S * 0.6), 0, 1);  // warmer near the sun
      var h = Y / horizon;
      var c = lerp3(CD, CL, clamp(h * 0.5 + lit * 0.8, 0, 1));  // dark up high → lit warm low/near the sun
      out[0] = c[0]; out[1] = c[1]; out[2] = c[2];
      out[3] = 255 * d * (0.45 + lit * 0.5);
    });
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.drawImage(clouds, 0, 0, S, S);

    // ---- the real sky on top ----
    ctx.drawImage(skyC, 0, 0, S, horizon, 0, 0, S, horizon);

    // ---- the mirror: the same sky flipped below the horizon, dimmed + barely rippled (near-still water) ----
    var strips = Math.round(60 * U), refH = S - horizon;
    for (var i = 0; i < strips; i++) {
      var depth = i / strips, sh = refH / strips + 1;
      var srcY = horizon - (i + 1) * (horizon / strips);        // mirror about the horizon
      var dx = (nz.fbm(depth * 4 + 1, 5.5, 3, 2.0, 0.5) - 0.5) * (1 + depth * 5) * U;  // faint shimmer, grows with depth
      ctx.globalAlpha = 0.9 - depth * 0.18;                     // the water absorbs a little, fades down
      ctx.drawImage(skyC, 0, srcY, S, horizon / strips + 1, dx, horizon + i * sh, S, sh + 1);
    }
    ctx.globalAlpha = 1;
    // a thin cool film over the reflection so it reads as water, not a clone
    var film = ctx.createLinearGradient(0, horizon, 0, S);
    film.addColorStop(0, Loom.rgba(P.cloudDk, 0)); film.addColorStop(1, Loom.rgba(P.cloudDk, 0.28));
    ctx.fillStyle = film; ctx.fillRect(0, horizon, S, refH);

    // ---- a faint salt-polygon crust showing through the shallow water in the foreground ----
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = Loom.rgba("#dfe2e6", 0.05); ctx.lineWidth = 1 * U;
    for (var c2 = 0, nc = Math.round(60 * U); c2 < nc; c2++) {
      var cyc = horizon + Math.pow(rng.range(0, 1), 0.6) * refH, cxc = rng.range(0, 1) * S;
      var near = (cyc - horizon) / refH;                        // 0 at horizon → 1 foreground (crust strengthens down)
      ctx.globalAlpha = near * 0.5;
      var rr = rng.range(0.02, 0.06) * S * (0.4 + near);
      ctx.beginPath();
      for (var e = 0; e <= 6; e++) { var ea = e / 6 * TAU + rng.range(-0.2, 0.2); var ex = cxc + Math.cos(ea) * rr, ey = cyc + Math.sin(ea) * rr * 0.5; if (e === 0) ctx.moveTo(ex, ey); else ctx.lineTo(ex, ey); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

    // ---- the lone figure standing on the mirror, + its reflection (the punch + the scale) ----
    var fx = S * rng.range(0.32, 0.68), fh = S * rng.range(0.055, 0.075);
    function figure(baseY, flip, alpha) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = "#090b11"; ctx.strokeStyle = "#090b11"; ctx.lineCap = "round";
      var s = flip ? -1 : 1;
      function Yf(f) { return baseY - s * fh * f; }             // f = fraction of height above the feet
      ctx.lineWidth = fh * 0.05;                                // legs
      ctx.beginPath(); ctx.moveTo(fx - fh * 0.04, Yf(0.44)); ctx.lineTo(fx - fh * 0.05, Yf(0.01));
      ctx.moveTo(fx + fh * 0.04, Yf(0.44)); ctx.lineTo(fx + fh * 0.05, Yf(0.01)); ctx.stroke();
      ctx.beginPath();                                          // tapered torso (shoulders → hips)
      ctx.moveTo(fx - fh * 0.085, Yf(0.74)); ctx.lineTo(fx + fh * 0.085, Yf(0.74));
      ctx.lineTo(fx + fh * 0.05, Yf(0.4)); ctx.lineTo(fx - fh * 0.05, Yf(0.4)); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(fx, Yf(0.88), fh * 0.1, 0, TAU); ctx.fill();    // head
      ctx.restore();
    }
    figure(horizon, false, 1);                                  // the figure, standing
    figure(horizon, true, 0.45);                                // its reflection, dimmer

    // ---- a faint seam where sky meets mirror, and a soft vignette ----
    ctx.globalCompositeOperation = "lighter";
    var seam = ctx.createLinearGradient(0, horizon - S * 0.015, 0, horizon + S * 0.015);
    seam.addColorStop(0, Loom.rgba(P.hor, 0)); seam.addColorStop(0.5, Loom.rgba(P.hor, 0.18)); seam.addColorStop(1, Loom.rgba(P.hor, 0));
    ctx.fillStyle = seam; ctx.fillRect(0, horizon - S * 0.015, S, S * 0.03);
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(S * 0.5, horizon, S * 0.35, S * 0.5, horizon, S * 0.85);
    vg.addColorStop(0, "rgba(8,8,14,0)"); vg.addColorStop(1, "rgba(6,6,12,0.5)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
