// Emil's Loom · piece 017 — "Murmuration"
//
// A flock of starlings at dusk, a falcon working it from the inside. Thousands of birds, each
// steering only by its ~7 NEAREST neighbours (topological flocking, lib/flock.js #12) — which
// is what lets the mass ripple, breathe and morph like one organism instead of a uniform swarm.
// A predator hunts the centre of mass; the birds flee in waves and the whole cloud shears and
// re-gathers, never quite breaking. Drawn as a 3D volume over a real dusk sky: nearer birds
// bigger and inkier, far ones small and hazed toward the light.
//
// Stateful, deterministic sim (the only randomness is the seeded setup) — stepped on a
// wall-clock schedule so it runs the same speed at any frame rate and reproduces from the seed
// ([[017-animation-seed-setup-once]], [[029-heavy-renders-should-be-progressive]]). On a piece
// page the harness loops it; in the gallery it self-drives, non-blocking.
Loom.piece({
  id: "017",
  title: "Murmuration",
  seed: "dusk",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760;

    // dusk moods: sky stops (top→horizon), the warm afterglow, the land, the bird ink, the haze
    var SCHEMES = [
      { sky: ["#191a3a", "#3a3060", "#7b4f6e", "#c87a5a", "#f0bf78"], sun: "#ffd690", land: "#120c16", ink: "#0c0912", haze: "#7d7290" },
      { sky: ["#241130", "#5a2748", "#9a3f48", "#d8743a", "#f6c452"], sun: "#ffd06a", land: "#160a10", ink: "#110a0e", haze: "#8c6168" },
      { sky: ["#10203e", "#27406a", "#496a8e", "#8aa2b0", "#dad2ba"], sun: "#eae0c0", land: "#0b0f13", ink: "#0a0e15", haze: "#6f7f93" },
      { sky: ["#201640", "#46336c", "#84507e", "#d07a86", "#f4c6a0"], sun: "#ffd6b0", land: "#130c17", ink: "#0d0913", haze: "#88718f" }
    ];
    var sc = rng.pick(SCHEMES);
    var horizonY = S * (0.80 + rng.range(-0.02, 0.05));

    var fl = Loom.flock(rng, {
      n: 2500, w: S, h: S * 0.74, d: S * 0.55,
      k: 7, sepDist: S * 0.03, sep: 1.8, coh: 0.95, ali: 1.0,
      wander: 0.35, margin: 0.24, center: 0.55,
      predator: { radius: S * 0.13 }
    });

    // sky — a spatial gradient, so a native canvas gradient is the right tool (cached, static)
    var sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    for (var i = 0; i < sc.sky.length; i++) sky.addColorStop(i / (sc.sky.length - 1), sc.sky[i]);
    // the sun's afterglow low on the horizon
    var sunX = rng.range(0.28, 0.72) * S, sunY = horizonY - rng.range(0, 0.05) * S;
    var glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, S * 0.5);
    glow.addColorStop(0, Loom.rgba(sc.sun, 0.6));
    glow.addColorStop(0.35, Loom.rgba(sc.sun, 0.16));
    glow.addColorStop(1, Loom.rgba(sc.sun, 0));

    // depth shading: bird colour far-haze → near-ink, via the ramp primitive (#11). Banding the
    // depth lets us batch the styling (6 strokes/frame instead of 1500 strokeStyle changes).
    var NB = 6, birdRamp = Loom.ramp([sc.haze, sc.ink]);
    var bandCol = [], bandW = [], bandLen = [], bandA = [];
    for (var b = 0; b < NB; b++) {
      var f = b / (NB - 1);                        // 0 far → 1 near
      bandCol.push(birdRamp.css(f));
      bandW.push((0.7 + 1.7 * f) * U);
      bandLen.push((1.0 + 2.0 * f) * U);
      bandA.push(0.5 + 0.44 * f);
    }
    var band = new Int8Array(fl.n);

    // land ridge (irregular dark horizon) + a couple of bare roost trees — built once, static.
    var ln = Loom.noise(rng.int(0, 1e9));
    function landTopAt(x) { return horizonY + (ln.fbm(x / S * 2.4, 7.3, 3) - 0.5) * S * 0.05; }
    var ridge = [];
    for (var rx = 0; rx <= S; rx += 6 * U) ridge.push([rx, landTopAt(rx)]);
    ridge.push([S, landTopAt(S)]);

    var treeSegs = [];
    function buildTree(x, y, ang, len, depth, w) {
      if (depth <= 0 || len < 2 * U) return;
      var x2 = x + Math.cos(ang) * len, y2 = y - Math.sin(ang) * len;
      treeSegs.push([x, y, x2, y2, w]);
      for (var c = 0, nc = rng.int(2, 3); c < nc; c++)
        buildTree(x2, y2, ang + rng.range(-0.62, 0.62), len * rng.range(0.62, 0.78), depth - 1, w * 0.68);
    }
    for (var t = 0, nt = rng.int(1, 2); t < nt; t++) {
      var tx = rng.range(0.12, 0.88) * S;
      buildTree(tx, landTopAt(tx) + 3 * U, Math.PI / 2 + rng.range(-0.14, 0.14), rng.range(0.075, 0.12) * S, 6, 2.1 * U);
    }

    function render() {
      // sky + afterglow
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = sky; ctx.fillRect(0, 0, S, horizonY + 2);
      ctx.fillStyle = glow; ctx.fillRect(0, 0, S, horizonY + 2);

      // birds, far bands first (painter's depth order)
      ctx.lineCap = "round";
      for (var i = 0; i < fl.n; i++) {
        var bb = (fl.z[i] / fl.d * NB) | 0; band[i] = bb < 0 ? 0 : bb >= NB ? NB - 1 : bb;
      }
      for (var bd = 0; bd < NB; bd++) {
        ctx.strokeStyle = bandCol[bd]; ctx.lineWidth = bandW[bd]; ctx.globalAlpha = bandA[bd];
        var hl = bandLen[bd];
        ctx.beginPath();
        for (var p = 0; p < fl.n; p++) {
          if (band[p] !== bd) continue;
          var vx = fl.vx[p], vy = fl.vy[p], m = Math.sqrt(vx * vx + vy * vy) || 1e-4, cx = vx / m * hl, cy = vy / m * hl;
          var x = fl.x[p], y = fl.y[p];
          ctx.moveTo(x - cx, y - cy); ctx.lineTo(x + cx, y + cy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // the falcon — a small swept-wing silhouette, oriented along its heading
      if (fl.pred) {
        var px = fl.pred.x, py = fl.pred.y, pvx = fl.pred.vx, pvy = fl.pred.vy;
        var pm = Math.sqrt(pvx * pvx + pvy * pvy) || 1e-4, dx = pvx / pm, dy = pvy / pm, ex = -dy, ey = dx, L = 4.6 * U;
        var hx = px + dx * L, hy = py + dy * L, wbx = px - dx * L * 0.2, wby = py - dy * L * 0.2;
        ctx.strokeStyle = sc.ink; ctx.lineWidth = 2.3 * U; ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(hx, hy); ctx.lineTo(wbx + ex * L * 1.5, wby + ey * L * 1.5);   // wing
        ctx.moveTo(hx, hy); ctx.lineTo(wbx - ex * L * 1.5, wby - ey * L * 1.5);   // wing
        ctx.moveTo(hx, hy); ctx.lineTo(px - dx * L * 1.3, py - dy * L * 1.3);     // body/tail
        ctx.stroke();
      }

      // land ridge (drawn over the sky and any birds that dip below the crest), then roost trees
      ctx.fillStyle = sc.land;
      ctx.beginPath(); ctx.moveTo(0, S + 2);
      for (var k = 0; k < ridge.length; k++) ctx.lineTo(ridge[k][0], ridge[k][1]);
      ctx.lineTo(S, S + 2); ctx.closePath(); ctx.fill();

      ctx.strokeStyle = sc.land; ctx.lineCap = "round";
      for (var s = 0; s < treeSegs.length; s++) {
        var sg = treeSegs[s]; ctx.lineWidth = sg[4];
        ctx.beginPath(); ctx.moveTo(sg[0], sg[1]); ctx.lineTo(sg[2], sg[3]); ctx.stroke();
      }

      // a soft vignette for mood
      var vg = ctx.createRadialGradient(S / 2, S * 0.46, S * 0.34, S / 2, S * 0.46, S * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(8,4,12,0.34)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
    }

    // step the sim on a wall-clock schedule (frame-rate independent + deterministic at time t)
    var WARM = 60;
    for (var w0 = 0; w0 < WARM; w0++) fl.step();
    var STEP_RATE = 42;
    function advanceTo(t) {
      var target = WARM + Math.floor(t * STEP_RATE), g = 0;
      while (fl.steps < target && g < 6) { fl.step(); g++; }
      render();
    }

    render();
    if (window.LOOM_GALLERY) {
      var t0 = performance.now();
      (function loop() { advanceTo((performance.now() - t0) / 1000); requestAnimationFrame(loop); })();
      return;                                      // gallery: self-driven, non-blocking
    }
    return function (t) { advanceTo(t); };          // page: harness loops it
  }
});
