// Emil's Loom · piece 013 — "Cadence"
//
// A harmonograph: the figure drawn by coupled pendulums, two swinging each axis at
// nearly-equal frequencies so the loops slowly open, all of it decaying inward to a
// still point. A deliberate break from everything around it — the gallery had gone all
// soft and organic, so this one is GEOMETRIC, precise, mathematical. And it's INK ON
// PAPER, the tonal inverse of the dark-glow pieces: a dark line on a warm light ground,
// the authentic harmonograph look (and lesson 022 — on a light ground you build with
// tone, not glow).
//
// The whole plate is redrawn every frame over the pendulums' own parameter s (damping
// over s makes it spiral inward to a finished figure); the motion is a slow PRECESSION
// φ(t) added to the phases, so the plate breathes and turns without ever repeating.
// Decay lives in s, motion lives in t — they don't fight. (advisor, #24.) Pure function
// of t, so it animates per [[017-animation-seed-setup-once]]; frame(0) is a full figure.
//
// Wants only rng + palette + math — a harmonograph doesn't need a noise field or a
// particle drift, so I didn't bolt any on ([[021-audit-the-goal-not-the-proxy]]).
Loom.piece({
  id: "013",
  title: "Cadence",
  seed: "resonance",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var U = S / 700;
    var TAU = 6.2831853;

    // Ink-on-paper moods. paper = warm light ground; ink = the line; ink2 = a faint
    // second ink the line drifts toward along its length, for a little life.
    var SCHEMES = [
      { paper: "#f1e7d0", ink: "#41301f", ink2: "#7a4a24" }, // sepia on cream (canonical)
      { paper: "#eceef0", ink: "#1d2a3c", ink2: "#3a5a78" }, // blue-black on cool white
      { paper: "#e7efe9", ink: "#163f37", ink2: "#2f7060" }, // deep teal on pale green
      { paper: "#f1e5dd", ink: "#4a2024", ink2: "#8a3a34" }  // oxblood on warm grey
    ];
    var sc = SCHEMES[rng.int(0, SCHEMES.length - 1)];

    // Simple frequency ratios make a beautiful figure; arbitrary ones tangle. Pick one,
    // then give each axis a second pendulum a hair off it (the beat that opens the loops).
    var RATIOS = [[2, 3], [3, 4], [3, 5], [2, 5], [4, 5], [5, 6], [3, 7], [1, 2]];
    var rat = rng.pick(RATIOS);
    var base = rng.range(1.0, 1.6);                 // overall speed of the pendulums
    var det = rng.range(0.004, 0.016);              // detune → how fast the loops open
    var P = {
      f1: rat[0] * base, f2: rat[0] * base + det * (rng.bool() ? 1 : -1),
      f3: rat[1] * base, f4: rat[1] * base + det * (rng.bool() ? 1 : -1),
      A1: rng.range(0.40, 0.54), A2: rng.range(0.12, 0.28),
      A3: rng.range(0.40, 0.54), A4: rng.range(0.12, 0.28),
      p1: rng.range(0, TAU), p2: rng.range(0, TAU),
      p3: rng.range(0, TAU), p4: rng.range(0, TAU),
      // a slow, mostly-coherent precession of the phases → the plate breathes & turns,
      // gently enough that each figure settles before it shifts (not a restless writhe)
      w1: rng.range(0.004, 0.010) * (rng.bool() ? 1 : -1),
      w2: rng.range(0.004, 0.010) * (rng.bool() ? 1 : -1),
      w3: rng.range(0.004, 0.010) * (rng.bool() ? 1 : -1),
      w4: rng.range(0.004, 0.010) * (rng.bool() ? 1 : -1)
    };
    var Smax = rng.range(155, 230);                 // how long the pendulums swing (→ loop density)
    var damp = rng.range(2.4, 3.4) / Smax;          // decay so e^(-damp*Smax) ≈ 0.03–0.09
    var R = S * 0.45;                               // half-extent of the figure
    var N = 3200;                                   // points along the curve
    var lw = rng.range(0.8, 1.15) * U;

    function point(s, t) {
      var e = Math.exp(-damp * s);
      var x = (P.A1 * Math.sin(P.f1 * s + P.p1 + P.w1 * t) +
               P.A2 * Math.sin(P.f2 * s + P.p2 + P.w2 * t)) * e;
      var y = (P.A3 * Math.sin(P.f3 * s + P.p3 + P.w3 * t) +
               P.A4 * Math.sin(P.f4 * s + P.p4 + P.w4 * t)) * e;
      return { x: S / 2 + x * R, y: S / 2 + y * R };
    }

    return function frame(t) {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = sc.paper;
      ctx.fillRect(0, 0, S, S);

      // Draw the figure in short low-alpha sub-strokes so where the pen passes again the
      // ink builds up (denser = darker), the way real harmonograph ink does. The colour
      // drifts ink→ink2 along the length for a touch of life.
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      var STEP = 24;                                 // points per sub-stroke
      var prev = point(0, t);
      for (var i = STEP; i <= N; i += STEP) {
        var s0 = (i - STEP) / N * Smax;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        var pt = prev;
        for (var j = i - STEP + 1; j <= i; j++) {
          pt = point(j / N * Smax, t);
          ctx.lineTo(pt.x, pt.y);
        }
        var f = i / N;                               // 0..1 along the curve
        ctx.strokeStyle = Loom.mix(sc.ink, sc.ink2, 0.15 + 0.5 * f);
        ctx.globalAlpha = 0.5 - 0.18 * f;            // earlier passes a touch stronger
        ctx.stroke();
        prev = pt;
      }
      ctx.globalAlpha = 1;
    };
  }
});
