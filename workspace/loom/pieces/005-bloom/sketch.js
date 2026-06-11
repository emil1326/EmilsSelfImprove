// Emil's Loom · piece 005 — "Bloom"
//
// The first grown thing. 001–004 were placed — woven, flowed, layered, shattered;
// this one *branches*. A few stochastic L-system plants rise from the ground, their
// boughs tapering to twigs, and where the smallest branches end they blossom. Built
// on lib/lsystem.js (string rewriting + a turtle).
//
// L-systems are impossible to size by guessing a step, so each plant is grown in
// abstract turtle units, its bounding box measured, then scaled to fill a target
// height and planted at the base — robust to whatever the rules produce.
Loom.piece({
  id: "005",
  title: "Bloom",
  seed: "7",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var pal = Loom.palette(rng);

    var bg = ctx.createLinearGradient(0, 0, 0, S);
    bg.addColorStop(0, Loom.mix(pal.bg, "#ffffff", 0.06));
    bg.addColorStop(1, Loom.mix(pal.bg, "#000000", 0.45));
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, S, S);

    var branchCol = Loom.mix(pal.colors[0], "#000000", 0.6);
    var rules = {
      X: ["F+[[X]-X]-F[-FX]+X", "F-[[X]+X]+F[+FX]-X", "FF[+X][-X]FX", "F[+X]F[-X]+X"],
      F: "FF"
    };

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // One plant: grow → measure → fit → draw. Nested (not global) so pieces sharing
    // the gallery can't collide; its own call scope keeps per-plant state isolated.
    function drawPlant(p, nPlants) {
      var iters = rng.int(4, 6);
      var str = Loom.lsystem("X", rules, iters, rng);
      var turn = rng.range(17, 27);
      var lean = rng.range(-7, 7);

      var segs = [], tips = [];
      var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      Loom.turtle(str, { x: 0, y: 0, angle: -90 + lean, step: 1, turn: turn, stepScale: 0.86 }, {
        segment: function (x0, y0, x1, y1, depth) {
          segs.push([x0, y0, x1, y1, depth]);
          if (x0 < minX) minX = x0; if (x0 > maxX) maxX = x0;
          if (x1 < minX) minX = x1; if (x1 > maxX) maxX = x1;
          if (y0 < minY) minY = y0; if (y0 > maxY) maxY = y0;
          if (y1 < minY) minY = y1; if (y1 > maxY) maxY = y1;
        },
        tip: function (x, y, depth) { tips.push([x, y, depth]); }
      });
      if (!segs.length || maxY <= minY) return;

      var targetH = S * rng.range(0.52, 0.84);
      var sc = targetH / (maxY - minY);
      var rootX = S * ((p + 0.5) / nPlants + rng.range(-0.05, 0.05));
      var baseY = S * rng.range(0.97, 1.0);
      var baseW = S * rng.range(0.006, 0.012);
      var mx = function (x) { return rootX + x * sc; };
      var my = function (y) { return baseY + (y - maxY) * sc; };

      for (var i = 0; i < segs.length; i++) {
        var s = segs[i], d = s[4];
        ctx.strokeStyle = branchCol;
        ctx.lineWidth = Math.max(0.5, baseW * Math.pow(0.72, d));
        ctx.beginPath();
        ctx.moveTo(mx(s[0]), my(s[1]));
        ctx.lineTo(mx(s[2]), my(s[3]));
        ctx.stroke();
      }
      for (var t = 0; t < tips.length; t++) {
        var tp = tips[t];
        if (tp[2] >= 3 && rng.bool(0.7)) {
          ctx.fillStyle = rng.pick(pal.colors);
          ctx.beginPath();
          ctx.arc(mx(tp[0]), my(tp[1]), S * rng.range(0.004, 0.011), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    var nPlants = rng.int(2, 3);
    for (var pl = 0; pl < nPlants; pl++) drawPlant(pl, nPlants);

    var vg = ctx.createRadialGradient(S / 2, S * 0.55, S * 0.3, S / 2, S * 0.55, S * 0.82);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.36)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, S, S);
  }
});
