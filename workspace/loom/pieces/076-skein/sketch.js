// Emil's Loom · piece 076 — "Skein"
//
// A double pendulum, and the luminous SKEIN its tip paints as it swings — chaos made visible, the way a
// long-exposure photo of an LED on a pendulum tangles into a glowing thread that never crosses itself the
// same way twice. Animated; physics-made-visible (the Strange/Resonance/cymatics lane). Deterministic from
// its seeded start (so it reproduces) yet chaotic (so every seed is a wholly different tangle) — [[070-determinism-is-the-frame-not-the-cage]].
//
// SOUL (ran [[083-soul-check-the-layer-that-carries-the-read-and-sing-not-the-impressive-one]] myself): the
// layer carrying both the READ (chaotic pendulum motion) and the SING (a flowing luminous ribbon, not a
// muddy scribble) is the TRACE — so I validated it FIRST, on its own, before adding the arms ([[032-validate-the-soul-before-the-skin]]).
// Coloured by TIME so the eye can follow the path's evolution; additive, low per-segment alpha so dense
// revisits brighten without blowing out. The framing is a CAMERA that fits the trajectory's bounding box,
// NOT hand-tuned launch angles ([[081-frame-a-wandering-sim-with-a-camera-not-with-sim-params]]) — so every
// seed fills the frame. Semi-implicit (symplectic) Euler conserves energy, so it stays chaotic, never winds
// to a dead stop. The heavy sim+trace runs ONCE in draw(); frame() only blits + moves the arms ([[041-measure-the-render-not-the-raf]]).
Loom.piece({
  id: "076",
  title: "Skein",
  seed: "lyapunov",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var px = 0.5 * S, py = 0.40 * S, La = 0.165 * S, g = 1.0, dt = 0.05;

    // ---- double-pendulum equations of motion (m1=m2=1, normalized lengths) ----
    function accel(t1, t2, w1, w2) {
      var c = Math.cos(t1 - t2), s = Math.sin(t1 - t2), d = 3 - Math.cos(2 * t1 - 2 * t2);
      var a1 = (-g * 3 * Math.sin(t1) - g * Math.sin(t1 - 2 * t2) - 2 * s * (w2 * w2 + w1 * w1 * c)) / d;
      var a2 = (2 * s * (w1 * w1 * 2 + g * 2 * Math.cos(t1) + w2 * w2 * c)) / d;
      return [a1, a2];
    }

    // ---- simulate from a seeded start; store joint + tip, track the bounding box ----
    var th1 = rng.range(1.7, 2.7), th2 = rng.range(1.7, 2.7), om1 = 0, om2 = 0;
    var N = 5200, jx = new Float32Array(N), jy = new Float32Array(N), tx = new Float32Array(N), ty = new Float32Array(N);
    var minX = px, maxX = px, minY = py, maxY = py;
    for (var i = 0; i < N; i++) {
      var a = accel(th1, th2, om1, om2);
      om1 += a[0] * dt; om2 += a[1] * dt; th1 += om1 * dt; th2 += om2 * dt;   // semi-implicit (symplectic)
      var x1 = px + La * Math.sin(th1), y1 = py + La * Math.cos(th1);
      var x2 = x1 + La * Math.sin(th2), y2 = y1 + La * Math.cos(th2);
      jx[i] = x1; jy[i] = y1; tx[i] = x2; ty[i] = y2;
      if (x2 < minX) minX = x2; else if (x2 > maxX) maxX = x2;
      if (y2 < minY) minY = y2; else if (y2 > maxY) maxY = y2;
      if (x1 < minX) minX = x1; else if (x1 > maxX) maxX = x1;
      if (y1 < minY) minY = y1; else if (y1 > maxY) maxY = y1;
    }

    // ---- camera (081): fit the whole motion into the frame, centred ----
    var sc = (S * 0.84) / Math.max(maxX - minX, maxY - minY, 1e-3);
    var ccx = 0.5 * (minX + maxX), ccy = 0.5 * (minY + maxY), hs = 0.5 * S;
    function TX(x) { return hs + (x - ccx) * sc; }
    function TY(y) { return hs + (y - ccy) * sc; }

    // ---- palette axis (the trajectory already varies by seed; this varies its colour too) ----
    var MOODS = [
      ["#6a2a9e", "#2a52c8", "#1f9fcc", "#43d68a", "#d8e060", "#f0884a"],   // spectral
      ["#3a1a5e", "#8a2a6e", "#d8425a", "#f0884a", "#ffd070", "#fff0c0"],   // ember
      ["#10204a", "#1f6fb0", "#2fd0d0", "#a0f0d0", "#e0f8ff", "#ffffff"]    // ice
    ];
    var mood = rng.pick(MOODS), ramp = Loom.ramp(mood), headHex = mood[mood.length - 1], col = [0, 0, 0];

    // ---- render the trace ONCE into an offscreen canvas (device-res, so it stays crisp on hi-dpi) ----
    var tc = document.createElement("canvas"); tc.width = Math.floor(S * dpr); tc.height = Math.floor(S * dpr);
    var tg = tc.getContext("2d"); tg.setTransform(dpr, 0, 0, dpr, 0, 0);
    tg.fillStyle = "#06070e"; tg.fillRect(0, 0, S, S);
    tg.globalCompositeOperation = "lighter"; tg.lineCap = "round"; tg.lineJoin = "round"; tg.lineWidth = 1.4 * U;
    for (var k = 1; k < N; k++) {
      ramp.rgb(k / N, col);
      tg.strokeStyle = "rgba(" + (col[0] + 0.5 | 0) + "," + (col[1] + 0.5 | 0) + "," + (col[2] + 0.5 | 0) + ",0.18)";
      tg.beginPath(); tg.moveTo(TX(tx[k - 1]), TY(ty[k - 1])); tg.lineTo(TX(tx[k]), TY(ty[k])); tg.stroke();
    }
    tg.globalCompositeOperation = "source-over";

    // ---- animate: blit the static skein, then swing the arms along it ----
    var PX = TX(px), PY = TY(py), rate = N / 24;   // sweep the whole path in ~24s
    function dot(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    return function (t) {
      ctx.drawImage(tc, 0, 0, S, S);
      // ping-pong the index (0→N-1→0): a chaotic end-state ≠ the seeded start, so a plain modulo loop would
      // teleport the arms at every wrap. Bouncing keeps the position continuous at the turn — no seam.
      var ph = (t * rate) % (2 * N); if (ph < 0) ph += 2 * N;
      var i = (ph < N ? ph : 2 * N - 1 - ph) | 0; if (i < 0) i = 0; else if (i >= N) i = N - 1;
      var ax = TX(jx[i]), ay = TY(jy[i]), bx = TX(tx[i]), by = TY(ty[i]);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(210,220,250,0.28)"; ctx.lineWidth = 4.4 * U;          // soft halo under the arm
      ctx.beginPath(); ctx.moveTo(PX, PY); ctx.lineTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.strokeStyle = "rgba(236,241,255,0.92)"; ctx.lineWidth = 1.7 * U;          // the arm itself
      ctx.beginPath(); ctx.moveTo(PX, PY); ctx.lineTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.fillStyle = "#7c86ac"; dot(PX, PY, 3.2 * U);                              // pivot
      ctx.fillStyle = "#ced7f3"; dot(ax, ay, 4.0 * U);                              // joint bob
      Loom.glow(ctx, bx, by, 24 * U, headHex, 0.95, 0.32);                          // tip — glowing comet head
      ctx.fillStyle = "#fff8ec"; dot(bx, by, 3.4 * U);
    };
  }
});
