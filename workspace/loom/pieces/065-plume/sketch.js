// Emil's Loom · piece 065 — "Plume"
//
// A drop of dye let into still water, blooming. A tight cloud of ink particles is carried by a static
// CURL-NOISE flow (a divergence-free swirl field — the velocity is the perpendicular gradient of a noise
// field, so it only stirs, never sources or sinks). Chaotic advection stretches and folds the little blob
// into the long curling FILAMENTS real ink makes when it mixes — nobody draws the tendrils, the flow
// does. The HOOK is that emergence ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]), the
// "a system out-invents me" lane (coral #058, phyllotaxis #064). Chosen by PULL
// ([[075-i-reach-for-impressive-to-make-and-miscall-it-my-strength]]). Grown progressively (Loom.grow #17)
// so you watch it bloom; DETERMINISTIC (the flow is a pure function of position; the only randomness is the
// seeded start cloud + a hashed diffusion jitter) so the settled bloom reproduces
// ([[070-stochastic-sim-randomness-is-load-bearing-hash-it-for-reproducibility]]). Composes noise + palette.
Loom.piece({
  id: "065",
  title: "Plume",
  seed: "indigo",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- palette: 2–3 vivid inks (additive, on dark water) ----
    var inks = [
      ["#e8489c", "#3ac6da", "#f3c24e"],   // magenta · cyan · gold
      ["#7a52e0", "#e0568a", "#46c0a0"],   // violet · rose · jade
      ["#2f7ee0", "#46d0c8", "#d8e070"],   // blue · aqua · chartreuse
      ["#e85a3a", "#f0a23e", "#e8d86a"]    // vermilion · amber · gold (a warm bloom)
    ];
    var ink = inks[rng.int(0, inks.length - 1)];

    // ---- the static curl-noise flow ----
    var scale = rng.range(2.4, 3.4) / S, e = 0.07, speed = S * 0.013;
    function curl(x, y, out) {                          // turbulent: curl summed over 3 octaves → folds the blob
      out[0] = 0; out[1] = 0;
      var s = scale, amp = 1, ox = 0;
      for (var oc = 0; oc < 3; oc++) {
        var a = x * s + ox, b = y * s + ox;
        out[0] += (nz(a, b + e) - nz(a, b - e)) * amp;
        out[1] += -(nz(a + e, b) - nz(a - e, b)) * amp;
        s *= 2.4; amp *= 0.55; ox += 13.7;
      }
    }
    function hash(i, s) { var h = (Math.imul(i, 374761393) + Math.imul(s, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177) | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

    // ---- the drop: a few tight clusters, one per ink ----
    var dropx = S * (0.5 + rng.range(-0.06, 0.06)), dropy = S * (0.46 + rng.range(-0.05, 0.05));
    var NP = rng.int(3200, 4200), P = [];
    for (var i = 0; i < NP; i++) {
      var g = i % ink.length, ca = rng.range(0, TAU), cr = Math.sqrt(rng.range(0, 1)) * 0.045 * S;
      var gx = dropx + Math.cos(g / ink.length * TAU) * 0.018 * S, gy = dropy + Math.sin(g / ink.length * TAU) * 0.018 * S;
      P.push({ x: gx + Math.cos(ca) * cr, y: gy + Math.sin(ca) * cr, c: ink[g], i: i });
    }

    // ---- background: deep still water ----
    var bg = ctx.createRadialGradient(dropx, dropy, 0, dropx, dropy, 0.8 * S);
    bg.addColorStop(0, "#0a1426"); bg.addColorStop(1, "#04060f");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);

    // ---- bloom: advect + accumulate additively (no clear) ----
    ctx.globalCompositeOperation = "lighter";
    var o = [0, 0], step = 0, maxSteps = 135, dot = Math.max(1.2, 0.0026 * S);
    function growChunk() {
      for (var s2 = 0; s2 < 3; s2++) {
        var decay = 1 - step / maxSteps;
        for (var k = 0; k < P.length; k++) {
          var p = P[k];
          curl(p.x, p.y, o);
          var dx = p.x - dropx, dy = p.y - dropy, dl = Math.sqrt(dx * dx + dy * dy) || 1;
          var push = decay * decay * S * 0.0012;                  // a faint outward hint (the diffusion clears the core, isotropically — no radial starburst)
          var j = 0.0027 * S * (0.45 + 0.55 * decay);
          p.x += o[0] * speed + dx / dl * push + (hash(p.i, step) - 0.5) * j;
          p.y += o[1] * speed + dy / dl * push + (hash(p.i, step + 9133) - 0.5) * j;
          if (step > 12 && p.x > 0 && p.x < S && p.y > 0 && p.y < S) {   // skip the first steps (the cloud spreads first → no blown origin) + in-frame only
            ctx.fillStyle = Loom.rgba(p.c, 0.012);
            ctx.fillRect(p.x - dot * 0.5, p.y - dot * 0.5, dot, dot);
          }
        }
        step++;
      }
      return step >= maxSteps;
    }
    return Loom.grow(growChunk);
  }
});
