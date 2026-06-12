// Emil's Loom · piece 032 — "Stillness"
//
// A single swan on flat dawn water, with its mirror reflection — misted, muted, breath-quiet. The serene
// living register, and a deliberate CLEAN WIN after the firefly grind: it plays to silhouette-first
// ([[035-defining-feature-is-often-the-hard-part]], like Luna) where the read lives in the graceful neck
// S-curve, and the new technique is a STILL-WATER reflection (flip + ripple + fade). Aimed at the felt
// "oh" — calm + life + atmosphere ([[049-technical-pride-mispredicts-aim-for-the-aesthetic-oh]]).
//
// On near-monochrome misty water a pale swan needs deliberate TONAL RANGE or it vanishes
// ([[022-luminosity-on-bright-is-tone]]): the water is a touch darker than the misty sky, the swan
// brighter than both, with a soft underside shadow and a dark waterline so it sits ON the water.
// Composes noise (#3, mist + water shimmer) + the palette helpers. Static — held stillness.
Loom.piece({
  id: "032",
  title: "Stillness",
  seed: "glass",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var wy = S * 0.52;                                  // the waterline
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- misty dawn: pale sky above, a slightly darker mirror below the waterline ----
    var sky = ctx.createLinearGradient(0, 0, 0, wy);
    sky.addColorStop(0, "#c4cdd2");
    sky.addColorStop(0.7, "#d2d4cf");
    sky.addColorStop(1, "#dcd6c8");                     // warm pale mist at the horizon
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, wy);
    var water = ctx.createLinearGradient(0, wy, 0, S);
    water.addColorStop(0, "#aeb6b4");                   // brightest just under the line (the sky reflected)
    water.addColorStop(0.5, "#8e9896");
    water.addColorStop(1, "#727c7c");                   // darker deep water
    ctx.fillStyle = water; ctx.fillRect(0, wy, S, S - wy);

    // ---- the swan, rendered once into an offscreen (so the reflection can flip + ripple it) ----
    var swW = Math.round(S * rng.range(0.37, 0.44)), swH = swW;   // offscreen; waterline at its BOTTOM edge
    var sc = document.createElement("canvas"); sc.width = swW; sc.height = swH;
    var s = sc.getContext("2d");
    (function drawSwan() {
      // unit swan facing LEFT: x∈[-1,0.6], y=0 at the waterline (bottom), up is negative. Scale to fit swW.
      var u = swW / 1.75, ox = swW * 0.62, oy = swH * 0.99;       // place origin: tail-area near bottom-right
      function X(x) { return ox + x * u; }
      function Y(y) { return oy + y * u; }
      var p = new Path2D();
      p.moveTo(X(0.52), Y(0));                                    // tail base at the waterline
      p.bezierCurveTo(X(0.60), Y(-0.20), X(0.52), Y(-0.34), X(0.36), Y(-0.35)); // raised tail, onto the back
      p.bezierCurveTo(X(0.10), Y(-0.60), X(-0.16), Y(-0.58), X(-0.33), Y(-0.40)); // wing-bump arc over the back → breast
      p.bezierCurveTo(X(-0.43), Y(-0.52), X(-0.52), Y(-0.74), X(-0.47), Y(-0.93)); // neck back-edge, rising + curving forward
      p.bezierCurveTo(X(-0.45), Y(-1.03), X(-0.54), Y(-1.10), X(-0.63), Y(-1.07)); // up to the crown of the head
      p.bezierCurveTo(X(-0.69), Y(-1.05), X(-0.73), Y(-1.00), X(-0.74), Y(-0.96)); // head front
      p.lineTo(X(-0.85), Y(-0.95));                               // beak tip (down-left)
      p.lineTo(X(-0.73), Y(-0.90));                               // beak underside
      p.bezierCurveTo(X(-0.66), Y(-0.90), X(-0.62), Y(-0.87), X(-0.59), Y(-0.82)); // under the head/jaw
      p.bezierCurveTo(X(-0.50), Y(-0.70), X(-0.34), Y(-0.50), X(-0.30), Y(-0.28)); // neck FRONT edge down to the breast (S-curve)
      p.bezierCurveTo(X(-0.28), Y(-0.16), X(-0.34), Y(-0.04), X(-0.40), Y(0));     // breast to the waterline
      p.closePath();                                             // flat along the waterline back to the tail

      // body fill — bright, with a soft vertical form-shadow (lighter top, shadowed underside)
      var bodyG = s.createLinearGradient(0, Y(-1.1), 0, Y(0));
      bodyG.addColorStop(0, "#f6f4ef"); bodyG.addColorStop(0.6, "#eceae3"); bodyG.addColorStop(1, "#cdd0cc");
      s.fillStyle = bodyG; s.fill(p);
      // a soft underside shadow where it meets the water
      s.save(); s.clip(p);
      var sh = s.createLinearGradient(0, Y(-0.22), 0, Y(0));
      sh.addColorStop(0, "rgba(120,128,126,0)"); sh.addColorStop(1, "rgba(96,104,104,0.45)");
      s.fillStyle = sh; s.fillRect(0, 0, swW, swH);
      // the folded-wing crease (a soft shadow line along the flank)
      s.strokeStyle = "rgba(150,154,150,0.4)"; s.lineWidth = 2 * U;
      s.beginPath(); s.moveTo(X(0.34), Y(-0.30)); s.bezierCurveTo(X(0.05), Y(-0.18), X(-0.18), Y(-0.16), X(-0.28), Y(-0.22)); s.stroke();
      s.restore();
      // the orange beak + a dark eye (the tiny warm accent + the spark of life)
      s.fillStyle = "#d98a3c";
      s.beginPath(); s.moveTo(X(-0.74), Y(-0.965)); s.lineTo(X(-0.86), Y(-0.95)); s.lineTo(X(-0.73), Y(-0.90)); s.closePath(); s.fill();
      s.fillStyle = "#241c18";
      s.beginPath(); s.arc(X(-0.70), Y(-0.985), 2.4 * U, 0, TAU); s.fill();           // eye
      s.fillStyle = "#1c1410";
      s.beginPath(); s.moveTo(X(-0.745), Y(-0.95)); s.lineTo(X(-0.80), Y(-0.945)); s.lineTo(X(-0.75), Y(-0.935)); s.closePath(); s.fill(); // beak base knob
    })();

    // optional horizontal flip so the swan faces either way, + a varied position (weave-another variety)
    var src = sc;
    if (rng.bool(0.42)) {
      var scF = document.createElement("canvas"); scF.width = swW; scF.height = swH;
      var fx = scF.getContext("2d"); fx.translate(swW, 0); fx.scale(-1, 1); fx.drawImage(sc, 0, 0); src = scF;
    }
    var swX = Math.round(S * rng.range(0.30, 0.52) - swW * 0.5), swTop = wy - swH;  // its waterline sits ON wy

    // ---- the reflection: flip the swan below the line, ripple it in strips, fade with depth ----
    (function reflection() {
      var strips = 46;
      for (var i = 0; i < strips; i++) {
        var sy = (i / strips) * swH;                     // source row in the swan (from its waterline up)
        var dh = swH / strips + 1;
        var depth = i / strips;                          // 0 at the line, 1 deep
        // horizontal ripple displacement grows with depth; gentle, water-like
        var dx = (nz.fbm(depth * 5 + 0.5, 2.2, 3, 2.0, 0.5) - 0.5) * (4 + depth * 16) * U;
        ctx.globalAlpha = (1 - depth) * 0.5;             // the reflection is dimmer + fades down
        // draw the mirrored strip: source from the bottom of the swan upward, placed below the line going down
        ctx.drawImage(src, 0, swH - sy - dh, swW, dh, swX + dx, wy + sy, swW, dh);
      }
      ctx.globalAlpha = 1;
    })();

    // ---- the real swan, above the water ----
    ctx.drawImage(src, swX, swTop, swW, swH);

    // ---- water surface: a few soft horizontal ripple lines + faint shimmer near the swan ----
    ctx.globalCompositeOperation = "source-over";
    for (var r = 0; r < 7; r++) {
      var ry = wy + (r + 1) / 8 * (S - wy) * 0.7;
      var w = (r < 3 ? 0.2 : 0.12) - r * 0.012;
      ctx.strokeStyle = "rgba(214,220,216," + Math.max(0.04, w).toFixed(3) + ")";
      ctx.lineWidth = 1.2 * U; ctx.beginPath();
      for (var x = 0; x <= S; x += 8) ctx.lineTo(x, ry + Math.sin(x / S * 9 + r) * 2 * U);
      ctx.stroke();
    }
    // a soft waterline mist band (where dawn mist sits on the water)
    var mistG = ctx.createLinearGradient(0, wy - S * 0.06, 0, wy + S * 0.05);
    mistG.addColorStop(0, "rgba(222,222,214,0)"); mistG.addColorStop(0.5, "rgba(224,224,216,0.42)"); mistG.addColorStop(1, "rgba(222,222,214,0)");
    ctx.fillStyle = mistG; ctx.fillRect(0, wy - S * 0.06, S, S * 0.11);

    // ---- a couple of drifting mist wisps + a soft vignette ----
    for (var m = 0; m < 5; m++) {
      var mx = rng.range(0.1, 0.9) * S, mmy = rng.range(0.2, 0.6) * S, mw = rng.range(0.2, 0.4) * S;
      var mg = ctx.createRadialGradient(mx, mmy, 0, mx, mmy, mw);
      mg.addColorStop(0, "rgba(228,228,222," + rng.range(0.06, 0.14).toFixed(3) + ")"); mg.addColorStop(1, "rgba(228,228,222,0)");
      ctx.save(); ctx.translate(mx, mmy); ctx.scale(1, 0.32); ctx.translate(-mx, -mmy);
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, mmy, mw, 0, TAU); ctx.fill(); ctx.restore();
    }
    var vg = ctx.createRadialGradient(S * 0.42, wy, S * 0.3, S * 0.5, S * 0.5, S * 0.8);
    vg.addColorStop(0, "rgba(90,96,96,0)"); vg.addColorStop(1, "rgba(78,84,84,0.28)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
