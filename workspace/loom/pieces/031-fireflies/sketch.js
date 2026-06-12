// Emil's Loom · piece 031 — "Fireflies"
//
// A summer dusk: fireflies drifting and softly pulsing over a darkening meadow, the last warm afterglow
// low on the treeline. Aimed at the FELT "oh!" — alive, atmospheric, nostalgic (the qualities Emil's 5s
// share: motion/life + emotion), not a technical render ([[049-technical-pride-mispredicts-aim-for-the-aesthetic-oh]]).
// And the first ANIMATED piece since Rain (#41) — the soul here IS the motion: the slow meander and the
// out-of-sync soft blink of a field of little lights. A frozen frame reads as fireflies in the dusk; the
// motion is judged from a t-strip, not a lucky frame ([[042-verify-animation-with-a-t-strip-not-a-live-frame]]).
//
// Each firefly is a warm-gold glow ([[037]] additive-on-dark) whose position is a pure function of t
// (drift #9 — a 3rd consumer) and whose brightness is a per-firefly blink phase (mostly a soft baseline,
// with periodic bright pulses, all out of sync — that desync is the magic). The meadow is the environment
// the lights need to glow IN ([[045-a-luminous-subject-needs-an-environment-to-light]]). Composes drift
// (#9) + glow (#8) + noise (#3, the treeline). Animated (returns frame(t)).
Loom.piece({
  id: "031",
  title: "Fireflies",
  seed: "midsummer",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;

    // ---- the dusk meadow, rendered once into an offscreen (static; each frame just blits it) ----
    var bgC = document.createElement("canvas"); bgC.width = S; bgC.height = S;
    var bx = bgC.getContext("2d");
    (function duskMeadow() {
      var g = bx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0.00, "#0b1620");      // deep blue-teal night sky
      g.addColorStop(0.46, "#142430");
      g.addColorStop(0.66, "#2b3030");      // dusk transition
      g.addColorStop(0.76, "#46402a");      // warm afterglow low on the horizon
      g.addColorStop(0.83, "#191812");      // into the dark treeline
      g.addColorStop(1.00, "#080a08");      // dark foreground grass
      bx.fillStyle = g; bx.fillRect(0, 0, S, S);
      // a soft warm afterglow bloom centred low (the last of the sunset through the trees)
      var ag = bx.createRadialGradient(S * 0.5, S * 0.83, S * 0.04, S * 0.5, S * 0.83, S * 0.55);
      ag.addColorStop(0, "rgba(228, 146, 66, 0.18)");      // softer, so it doesn't wash out the fireflies
      ag.addColorStop(1, "rgba(228, 146, 66, 0)");
      bx.fillStyle = ag; bx.fillRect(0, 0, S, S);
      // a dark, soft treeline silhouette (noise-profiled humps) sitting on the afterglow
      var nz = Loom.noise(rng.int(1, 999999));
      bx.fillStyle = "#0a0d0b";
      bx.beginPath(); bx.moveTo(0, S);
      var ty = S * 0.79;
      for (var x = 0; x <= S; x += 5) {
        var h = nz.fbm(x / S * 2.4 + 3, 0.5, 4, 2.0, 0.5);
        bx.lineTo(x, ty - h * S * 0.10);
      }
      bx.lineTo(S, S); bx.closePath(); bx.fill();
      // a few silhouetted grass blades rising from the bottom edge
      bx.strokeStyle = "#070907"; bx.lineCap = "round";
      for (var b = 0, nb = Math.round(70 * U); b < nb; b++) {
        var gx = rng.range(0, 1) * S, gh = rng.range(0.05, 0.16) * S, lean = rng.range(-0.04, 0.04) * S;
        bx.lineWidth = rng.range(1, 2.6) * U;
        bx.beginPath(); bx.moveTo(gx, S); bx.quadraticCurveTo(gx + lean * 0.5, S - gh * 0.6, gx + lean, S - gh); bx.stroke();
      }
    })();

    // ---- the fireflies: drift for the meander, a per-firefly blink for the pulse ----
    var flies = Loom.drift(rng, S, S, {
      count: Math.round(130 * U),
      rMin: 0.32, rMax: 1.0,             // r doubles as a DEPTH fraction (near = big/bright)
      dir: -0.12,                        // drift nearly HORIZONTAL so they hover low + wrap sideways
      speedMin: 4, speedMax: 11, speedBySize: true,   // (not rise up into the bright sky and wash out)
      sway: 20, swayRate: 0.45           // sway gives the gentle vertical bob
    });
    // keep them low over the meadow (not up in the sky) + give each its blink phase
    for (var i = 0; i < flies.length; i++) {
      var f = flies[i];
      f.y0 = rng.range(0.55, 0.99) * S;   // low over the meadow/treeline, where the warm glow pops on dark
      f.period = rng.range(2.2, 4.6);   // seconds per blink cycle
      f.lit = rng.range(0.16, 0.30);    // fraction of the cycle it's pulsing bright
      f.bphase = rng.next();
      f.dim = rng.range(0.46, 0.74);    // a steady soft baseline so the whole field glows, with gentle pulsing over it
      f.warm = rng.range(0, 1);         // 0 = yellow-green, 1 = warmer amber-gold
    }
    var GREEN = Loom.hexToRgb("#c8e860"), GOLD = Loom.hexToRgb("#ffc040");
    function flyColor(w) {
      var r = Math.round(GREEN.r + (GOLD.r - GREEN.r) * w);
      var g = Math.round(GREEN.g + (GOLD.g - GREEN.g) * w);
      var b = Math.round(GREEN.b + (GOLD.b - GREEN.b) * w);
      return "rgb(" + r + "," + g + "," + b + ")";
    }
    function brightness(f, t) {
      var c = ((t / f.period + f.bphase) % 1 + 1) % 1;
      var pulse = c < f.lit ? Math.sin(c / f.lit * Math.PI) : 0;   // smooth up-and-down bump
      return f.dim + (1 - f.dim) * pulse;
    }

    function frame(t) {
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.drawImage(bgC, 0, 0, S, S);
      for (var i = 0; i < flies.length; i++) {
        var f = flies[i], p = f.pos(t), b = brightness(f, t);
        var depth = f.r;                                 // 0.32 (far) … 1 (near)
        var hero = depth > 0.82;                         // a few big soft foreground "hero" flies for depth
        var col = flyColor(f.warm);
        // CRISP tight bright POINTS, not big soft haze — fireflies read as distinct sparks, and a single
        // high-intensity layer keeps each amber (stacking additive amber clips to pale cream, [[051-stacking-additive-glows-desaturates-to-white]]).
        var glowR = S * (hero ? (0.013 + 0.020 * depth) : (0.005 + 0.0095 * depth));
        var inten = Math.min(0.95, b * (0.92 + 0.28 * depth));
        Loom.glow(ctx, p.x, p.y, glowR, col, inten, hero ? 0.42 : 0.2);
        if (b > 0.8) {                                   // a tiny warm sparkle only at a pulse's peak (kept warm, not white)
          Loom.glow(ctx, p.x, p.y, glowR * 0.5, "#ffe8a8", (b - 0.8) * 1.8 * depth, 0.3);
        }
      }
    }
    return frame;   // ANIMATED — draw() seeded the meadow + the flies; frame(t) paints each moment.
  }
});
