// Emil's Loom · piece 036 — "Wishes"
//
// A sky-lantern festival at night: hundreds of warm paper lanterns released over still water and rising
// into the deep dark, each one doubled in the mirror below. The HOOK here is EMOTIONAL — wonder, the
// collective hush of a thousand small lights lifting together ([[049-technical-pride-mispredicts-aim-for-the-aesthetic-oh]]:
// felt beats rendered; the 5s are the ones that make you FEEL something). And the first ANIMATED piece
// since Fireflies (#53) — the lanterns drift slowly up, a pure function of t, judged from a t-strip (042).
//
// Glow-on-dark, so light is additive — but ONE warm layer per lantern so a dense cluster doesn't clip to
// white ([[051-stacking-additive-glows-desaturates-to-white]]); the read is DEPTH (near big/bright/warm,
// far tiny/dim) so the crowd recedes into wonder, not a flat scatter ([[045-a-luminous-subject-needs-an-environment-to-light]]).
// REUSES the still-water reflection from Stillness (#032) — a 2nd consumer (a harvest candidate). Composes
// noise (#3, water shimmer) + glow (#8, the lanterns) + the palette helpers. Animated (returns frame(t)).
Loom.piece({
  id: "036",
  title: "Wishes",
  seed: "loykrathong",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var wy = S * 0.70;                                       // the waterline
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- the static night + water + stars, painted once into an offscreen ----
    var bgC = document.createElement("canvas"); bgC.width = S; bgC.height = S;
    var bx = bgC.getContext("2d");
    (function night() {
      var sky = bx.createLinearGradient(0, 0, 0, wy);
      sky.addColorStop(0, "#070d1a"); sky.addColorStop(0.6, "#0e1830"); sky.addColorStop(1, "#241f2a"); // warm haze low
      bx.fillStyle = sky; bx.fillRect(0, 0, S, wy);
      var wat = bx.createLinearGradient(0, wy, 0, S);
      wat.addColorStop(0, "#16151f"); wat.addColorStop(1, "#060810");
      bx.fillStyle = wat; bx.fillRect(0, wy, S, S - wy);
      // a soft warm glow on the horizon (the mass of lanterns just released)
      bx.globalCompositeOperation = "lighter";
      var hg = bx.createRadialGradient(S * 0.5, wy, 0, S * 0.5, wy, S * 0.5);
      hg.addColorStop(0, "rgba(200,130,60,0.22)"); hg.addColorStop(1, "rgba(200,130,60,0)");
      bx.fillStyle = hg; bx.fillRect(0, 0, S, S);
      // stars in the upper sky
      for (var i = 0, n = Math.round(120 * U); i < n; i++) {
        var sx = rng.range(0, 1) * S, sy = rng.range(0, 0.6) * wy, sr = rng.range(0.3, 1.1) * U;
        bx.fillStyle = "rgba(220,228,255," + rng.range(0.15, 0.6).toFixed(2) + ")";
        bx.beginPath(); bx.arc(sx, sy, sr, 0, TAU); bx.fill();
      }
      bx.globalCompositeOperation = "source-over";
    })();

    // ---- the lantern crowd: seeded base positions, depth (size), rise + sway ----
    var lanterns = [];
    var N = Math.round(150 * U);
    for (var i = 0; i < N; i++) {
      var depth = Math.pow(rng.range(0, 1), 1.5);            // skew toward far (small) — a deep crowd
      lanterns.push({
        x0: rng.range(-0.05, 1.05) * S,
        baseY: rng.range(0.12, 0.99) * wy,                  // spread up the sky, denser low (see draw)
        depth: depth,
        rise: rng.range(0.004, 0.014) * S,                  // px/sec upward drift
        swayAmp: rng.range(3, 12) * U, swayRate: rng.range(0.2, 0.5), phase: rng.range(0, TAU),
        flick: rng.range(0, TAU), warm: rng.range(0, 1)
      });
    }
    // bias the crowd lower (released from the water) — re-roll baseY with a low skew
    for (i = 0; i < N; i++) lanterns[i].baseY = wy * (0.08 + Math.pow(rng.range(0, 1), 1.7) * 0.9);
    lanterns.sort(function (a, b) { return a.depth - b.depth; });   // far first, near last (painter's order)

    var gold = "#ec9a3c";
    function lantern(c, x, y, sz, b) {
      Loom.glow(c, x, y, sz * 2.7, gold, Math.min(0.92, b * 0.5), 0.5);          // the warm halo (one layer)
      var bh = sz * 1.3, by = y + bh * 0.12;
      var bg = c.createRadialGradient(x, by, 0, x, by, bh);
      bg.addColorStop(0, "rgba(255,236,184," + Math.min(1, b) + ")");
      bg.addColorStop(0.5, "rgba(244,176,86," + Math.min(1, b * 0.85) + ")");
      bg.addColorStop(1, "rgba(220,120,50,0)");
      c.fillStyle = bg; c.beginPath();                                            // the teardrop paper body
      c.moveTo(x, y - bh * 0.72);
      c.bezierCurveTo(x + sz, y - bh * 0.6, x + sz * 0.86, y + bh * 0.42, x, y + bh * 0.78);
      c.bezierCurveTo(x - sz * 0.86, y + bh * 0.42, x - sz, y - bh * 0.6, x, y - bh * 0.72);
      c.closePath(); c.fill();
      if (sz > 3.5 * U) Loom.glow(c, x, y + bh * 0.42, sz * 0.5, "#fff0c8", Math.min(1, b), 0.3);  // the flame
    }

    function frame(t) {
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.drawImage(bgC, 0, 0, S, S);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < lanterns.length; i++) {
        var L = lanterns[i];
        var span = wy * 1.05;
        var y = wy - (((wy - L.baseY) + L.rise * t * 12) % span);                 // rise, wrap from the water up
        var x = L.x0 + Math.sin(t * L.swayRate + L.phase) * L.swayAmp;
        var sz = (2.2 + L.depth * 11) * U;                                         // near = big
        var b = (0.45 + L.depth * 0.55) * (0.85 + 0.15 * Math.sin(t * 2.3 + L.flick)); // depth bright + flicker
        b *= Math.max(0.25, 1 - Math.max(0, (wy - y) / wy) * 0.6);                 // fade as they rise high/far
        // the reflection in the water: a dimmer, rippled, mirrored copy
        if (y < wy) {
          var ry = 2 * wy - y, dep = (ry - wy) / (S - wy);
          var rx = x + (nz.fbm(dep * 6 + 1, t * 0.4 + L.phase, 2, 2.0, 0.5) - 0.5) * (6 + dep * 26) * U;
          lantern(ctx, rx, ry, sz * 0.95, b * 0.42 * Math.max(0, 1 - dep * 1.3));
        }
        lantern(ctx, x, y, sz, b);
      }
      ctx.globalCompositeOperation = "source-over";
    }
    return frame;
  }
});
