// Emil's Loom · piece 014 — "Current"
//
// A flow field, gone deep. Piece 002 "Loose Threads" was my first one — a few thousand
// threads following an invisible current I faked with a sum of sines. This is the same
// idea pushed as far as I could take it now: the current is a real fbm-noise field, the
// threads come in LAYERS (broad slow rivers under fine quick wisps), the colour flows in
// coherent regions from a second noise, and a large-scale sweep keeps the whole thing
// composed instead of a uniform wash. Going DEEP on one vein instead of a new trick — the
// #25 self-audit's nudge.
//
// Static: it traces every streamline once and is done (no animation here — a quiet,
// finished image, a break from six moving pieces in a row). Reproducible from the seed.
Loom.piece({
  id: "014",
  title: "Current",
  seed: "murmur",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var U = S / 700;
    var TAU = 6.2831853;

    // Each mood: a ground + a colour ramp the threads are tinted along (by region), and
    // a faint second accent. Threads are luminous on dark grounds, inked on the light one.
    var SCHEMES = [
      { bg: "#0b1418", ramp: ["#2a6f8e", "#49b0c0", "#7fe0d0", "#b6f0e0", "#c98a6a"], dark: true }, // deep sea + a warm thread
      { bg: "#140a06", ramp: ["#7a2e16", "#d8612c", "#f0a44e", "#ffd07a"], dark: true },            // ember: rust→orange→gold
      { bg: "#0c0a16", ramp: ["#5a3a8e", "#9a6cd0", "#e08ad0", "#ffd28a", "#ff9a6a"], dark: true }, // dusk: violet→rose→gold
      { bg: "#efe7d6", ramp: ["#2a3a52", "#3f6f8e", "#7a5a44", "#b06a3a"], dark: false }            // ink on warm paper
    ];
    var sc = SCHEMES[rng.int(0, SCHEMES.length - 1)];

    var field = Loom.noise(rng.int(0, 1e9));     // the current
    var hue = Loom.noise(rng.int(0, 1e9));       // smooth colour regions
    var fScale = rng.range(1.4, 2.4);            // how zoomed the current is (smaller = broader swirls)
    var turns = rng.range(1.1, 2.2);             // how many full turns the noise spans
    var sweepA = rng.range(0, TAU);              // overall sweep direction (large-scale bias)
    var sweepK = rng.range(0.22, 0.4);           // how strong the sweep is vs the swirls
    var cSweep = Math.cos(sweepA), sSweep = Math.sin(sweepA);

    // the field's flow direction at a point, as a unit vector
    function flow(x, y) {
      var a = field.fbm(x / S * fScale, y / S * fScale, 4) * TAU * turns;
      var vx = Math.cos(a) + cSweep * sweepK;
      var vy = Math.sin(a) + sSweep * sweepK;
      var m = Math.hypot(vx, vy) || 1;
      return { x: vx / m, y: vy / m };
    }

    var ramp = Loom.ramp(sc.ramp);                // f in [0,1] → a colour along the ramp

    // Two populations: broad slow rivers, then fine quick wisps over them.
    var LAYERS = [
      { count: Math.round(1500 * (S / 700)), len: rng.int(120, 200), step: 1.5 * U, w: rng.range(1.6, 2.6) * U, a: 0.06 },
      { count: Math.round(3200 * (S / 700)), len: rng.int(60, 110),  step: 1.3 * U, w: rng.range(0.5, 1.0) * U, a: 0.10 }
    ];

    // STATIC: draw the whole thing once, here in draw(), and return nothing — the rng is
    // consumed during drawing, so it must NOT run per-frame (returning a function would make
    // the harness loop it and re-randomise every frame — lesson 017). A quiet still image.
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = sc.bg;
    ctx.fillRect(0, 0, S, S);

      // luminous threads add up on a dark ground; inked threads darken on the light one
      ctx.globalCompositeOperation = sc.dark ? "lighter" : "source-over";
      ctx.lineCap = "round";

      for (var L = 0; L < LAYERS.length; L++) {
        var ly = LAYERS[L];
        ctx.lineWidth = ly.w;
        for (var i = 0; i < ly.count; i++) {
          var x = rng.range(-0.05, 1.05) * S, y = rng.range(-0.05, 1.05) * S;
          // colour from the smooth hue field at the start point, tinted along the ramp
          var cf = hue.fbm(x / S * 1.3, y / S * 1.3, 3);
          ctx.strokeStyle = ramp.css(Math.max(0, Math.min(0.999, cf)));
          ctx.globalAlpha = ly.a * (sc.dark ? 1 : 1.4);
          ctx.beginPath();
          ctx.moveTo(x, y);
          for (var s = 0; s < ly.len; s++) {
            var v = flow(x, y);
            x += v.x * ly.step;
            y += v.y * ly.step;
            ctx.lineTo(x, y);
            if (x < -0.1 * S || x > 1.1 * S || y < -0.1 * S || y > 1.1 * S) break;
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
  }
});
