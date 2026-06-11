// Emil's Loom · piece 002 — "Loose Threads"
//
// If 001 was threads woven tight, this is the threads come loose. A flow field:
// an invisible current runs through the canvas, and a few thousand threads drift
// along it, each a single translucent stroke. Where many threads crowd the same
// current they pool into bright rivers; where they thin out, wisps. No grid
// anywhere — the deliberate opposite of the weave.
//
// The current is a seeded sum of sines (smooth, organic, fully reproducible).
// Colours come from the shared palette primitive (lib/palette.js).
Loom.piece({
  id: "002",
  title: "Loose Threads",
  seed: "loose-threads",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var pal = Loom.palette(rng);

    // Background, with a faint warm lift toward the centre.
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, S, S);

    // The flow field: angle(x, y) as a seeded sum of sines. Modest frequencies
    // keep it flowing rather than chaotic; the four phases shift the whole field.
    var TAU = Math.PI * 2;
    var f1 = rng.range(1.4, 3.0), f2 = rng.range(1.4, 3.0);
    var f3 = rng.range(1.8, 3.6), f4 = rng.range(1.8, 3.6);
    var p1 = rng.range(0, TAU), p2 = rng.range(0, TAU);
    var p3 = rng.range(0, TAU), p4 = rng.range(0, TAU);
    var turn = rng.range(1.5, 2.4);   // how hard the current swirls

    function angleAt(x, y) {
      var nx = x / S, ny = y / S;
      var a = Math.sin(nx * f1 * TAU + p1)
            + Math.cos(ny * f2 * TAU + p2)
            + Math.sin((nx + ny) * f3 * Math.PI + p3)
            + Math.cos((nx - ny) * f4 * Math.PI + p4);
      return a * turn;
    }

    var nThreads = 2800;
    var maxSteps = 130;
    var stepLen = S * 0.006;
    var baseW = S * 0.0016;
    var pad = S * 0.12;               // let threads wander a little off-canvas

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (var i = 0; i < nThreads; i++) {
      var x = rng.range(-pad, S + pad);
      var y = rng.range(-pad, S + pad);
      var color = rng.pick(pal.colors);
      var w = baseW * rng.range(0.5, 2.6);
      var alpha = rng.range(0.035, 0.12);
      var len = rng.int(maxSteps * 0.4, maxSteps);

      ctx.beginPath();
      ctx.moveTo(x, y);
      for (var s = 0; s < len; s++) {
        var ang = angleAt(x, y);
        x += Math.cos(ang) * stepLen;
        y += Math.sin(ang) * stepLen;
        if (x < -pad || x > S + pad || y < -pad || y > S + pad) break;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = Loom.rgba(color, alpha);
      ctx.lineWidth = w;
      ctx.stroke();
    }

    // Settle it into the dark.
    var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.30, S / 2, S / 2, S * 0.76);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.34)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, S, S);
  }
});
