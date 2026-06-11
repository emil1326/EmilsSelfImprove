// Emil's Loom · piece 008 — "Aurora"
//
// The Loom's first *moving* piece, and the first that's a composed scene rather than
// a texture: a night sky with stars, a dark ridge along the bottom, and curtains of
// aurora light rising and shifting behind it. Built to be looked at for a while —
// the curtains ripple on layered noise, the stars breathe. (Engine note: draw() does
// the seeded setup once and returns frame(t); the harness runs the animation, and the
// gallery shows a single frozen frame.)
Loom.piece({
  id: "008",
  title: "Aurora",
  seed: "borealis",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var noise = Loom.noise(rng.int(0, 1e9));

    // A few aurora moods — sky tones + curtain colours. Not the shared palette: an
    // aurora has its own light. (Greens dominate; a cooler and a magenta variant.)
    var SCHEMES = [
      { sky: ["#05080f", "#0a1422"], cur: ["#34f0a0", "#2fd0d8", "#8affc6"], glow: "#9a6bff" },
      { sky: ["#04101a", "#08202a"], cur: ["#2fe0c0", "#39b0f0", "#9af0ff"], glow: "#c060ff" },
      { sky: ["#0a0712", "#140b1e"], cur: ["#5cffb0", "#46c8ff", "#ff6ad8"], glow: "#ff8af0" }
    ];
    var sc = SCHEMES[rng.int(0, SCHEMES.length - 1)];
    var horizon = S * rng.range(0.74, 0.84);

    // Stars (computed once; only their twinkle uses time).
    var stars = [];
    var nStars = rng.int(110, 200);
    for (var i = 0; i < nStars; i++) {
      stars.push({
        x: rng.range(0, S),
        y: rng.range(0, horizon * 0.98),
        r: rng.range(0.3, 1.4) * (S / 700),
        b: rng.range(0.25, 0.95),
        ph: rng.range(0, 6.28),
        tw: rng.range(0.5, 2.0)
      });
    }

    // Curtains of light.
    var curtains = [];
    var nCur = rng.int(4, 7);
    for (var c = 0; c < nCur; c++) {
      curtains.push({
        cx: rng.range(-0.1, 1.1) * S,
        w: rng.range(0.18, 0.5) * S,
        h: rng.range(0.42, 0.78) * horizon,
        col: rng.pick(sc.cur),
        ox: rng.range(0, 100),
        hf: rng.range(2.5, 4.5) / S,
        tsp: rng.range(0.16, 0.34),
        drift: rng.range(0.04, 0.09) * (rng.bool() ? 1 : -1),
        rays: rng.int(14, 26)
      });
    }

    // The dark foreground ridge (a jagged silhouette, static).
    var ridge = [];
    var rn = Loom.noise(rng.int(0, 1e9));
    // Ridge sits at-or-above the horizon everywhere, so the curtains' bright bases
    // are always hidden behind it (the aurora glows from beyond the mountains).
    for (var x = 0; x <= S; x += 4) {
      ridge.push(horizon - S * 0.095 * rn.fbm(x * 2.5 / S, 0.5, 4));
    }

    function topAt(cur, x, t) {
      var n = noise.fbm((x) * cur.hf + cur.ox + t * cur.drift, t * cur.tsp + cur.ox, 2);
      var env = Math.max(0, 1 - Math.pow(Math.abs(x - cur.cx) / (cur.w * 0.5), 2)); // soft edges
      return cur.h * (0.25 + 0.75 * n) * env;
    }

    return function frame(t) {
      // sky
      var sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, sc.sky[0]);
      sky.addColorStop(1, sc.sky[1]);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, S, horizon + 2);

      // stars
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var b = s.b * (0.65 + 0.35 * Math.sin(t * s.tw + s.ph));
        ctx.fillStyle = "rgba(255,255,250," + b.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.2832);
        ctx.fill();
      }

      // aurora curtains (additive glow), rising from behind the ridge
      ctx.globalCompositeOperation = "lighter";
      for (var c = 0; c < curtains.length; c++) {
        var cur = curtains[c];
        // the curtain body: a ragged-topped band with a vertical gradient
        ctx.beginPath();
        ctx.moveTo(cur.cx - cur.w * 0.6, horizon);
        var x0 = cur.cx - cur.w * 0.6, x1 = cur.cx + cur.w * 0.6;
        for (var x = x0; x <= x1; x += 6) ctx.lineTo(x, horizon - topAt(cur, x, t));
        ctx.lineTo(x1, horizon);
        ctx.closePath();
        var maxH = cur.h;
        var g = ctx.createLinearGradient(0, horizon, 0, horizon - maxH);
        g.addColorStop(0, Loom.rgba(cur.col, 0.0));
        g.addColorStop(0.22, Loom.rgba(cur.col, 0.13));
        g.addColorStop(0.55, Loom.rgba(cur.col, 0.09));
        g.addColorStop(1, Loom.rgba(cur.col, 0.0));
        ctx.fillStyle = g;
        ctx.fill();
        // bright vertical rays for the striated texture
        for (var k = 0; k < cur.rays; k++) {
          var rx = cur.cx + (noise(k * 1.7 + cur.ox, t * cur.tsp * 0.6) - 0.5) * cur.w;
          var rh = topAt(cur, rx, t);
          if (rh < 4) continue;
          var rg = ctx.createLinearGradient(0, horizon, 0, horizon - rh);
          rg.addColorStop(0, Loom.rgba(cur.col, 0));
          rg.addColorStop(0.18, Loom.rgba(cur.col, 0.13));
          rg.addColorStop(1, Loom.rgba(cur.col, 0));
          ctx.strokeStyle = rg;
          ctx.lineWidth = 1.4 * (S / 700);
          ctx.beginPath();
          ctx.moveTo(rx, horizon);
          ctx.lineTo(rx + (noise(k + cur.ox + 9, t * 0.05) - 0.5) * 12, horizon - rh);
          ctx.stroke();
        }
      }

      // faint horizon glow from the aurora
      ctx.fillStyle = Loom.rgba(sc.glow, 0.03);
      ctx.fillRect(0, horizon - S * 0.06, S, S * 0.1);

      // ridge + ground (dark, on top → aurora rises from behind it)
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.moveTo(0, S);
      ctx.lineTo(0, ridge[0]);
      for (var r = 0; r < ridge.length; r++) ctx.lineTo(r * 4, ridge[r]);
      ctx.lineTo(S, S);
      ctx.closePath();
      ctx.fillStyle = "#05060a";
      ctx.fill();
    };
  }
});
