// Emil's Loom · piece 016 — "Turing"
//
// Reaction-diffusion: the patterns Alan Turing predicted in 1952 for how a uniform blob of
// cells could spontaneously grow spots and stripes — the maths behind a leopard's coat,
// coral, fingerprints, the folds of a brain. Two chemicals diffuse and react on a grid and
// freeze into an organic labyrinth. Genuinely new for the Loom: not a thing I draw, but a
// thing I *grow* and then colour. Built on the new lib/reaction.js (primitive #10).
//
// Static: the field is developed in draw() (a few thousand simulation steps) and painted
// once — the pattern is the artifact. Reproducible from the seed; the (f,k) feed/kill pair
// chooses which world it grows (coral, maze, spots, mitosis), so I pick from known-good
// pairs rather than gambling — RD is famously sensitive to them.
Loom.piece({
  id: "016",
  title: "Turing",
  seed: "coral",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;

    // V (the catalyst) maps along a colour ramp: low = ground, high = the pattern picking
    // out of it. Each scheme is a little world.
    var SCHEMES = [
      { ramp: ["#06222a", "#0e3a44", "#1f7a78", "#7fd0b0", "#ffd58a", "#ff8a4a"] }, // reef: teal ground → coral
      { ramp: ["#f2e9d6", "#d8c6a4", "#9c8a64", "#5a4a36", "#241a12"] },            // ink/parchment, monochrome earth
      { ramp: ["#0c0820", "#2a1a52", "#7a3a9a", "#e06ab0", "#ffd0e0"] },            // amethyst → rose
      { ramp: ["#0a1006", "#223a12", "#6a9a2e", "#cfe06a", "#f4f0c0"] }             // lichen: dark moss → lime
    ];
    var sc = SCHEMES[rng.int(0, SCHEMES.length - 1)];

    // feed/kill worlds — each a different Turing regime.
    var PRESETS = [
      { f: 0.0545, k: 0.0620, steps: 3800 }, // coral / fingerprint
      { f: 0.0290, k: 0.0570, steps: 3400 }, // maze / labyrinth
      { f: 0.0300, k: 0.0620, steps: 3000 }, // spots
      { f: 0.0367, k: 0.0649, steps: 3400 }, // mitosis (dividing cells)
      { f: 0.0390, k: 0.0580, steps: 3000 }  // holes / negative spots
    ];
    var pre = rng.pick(PRESETS);

    var G = 150;                                       // simulation grid (upscaled to S)
    var rd = Loom.reaction(G, G, { f: pre.f, k: pre.k, du: 0.16, dv: 0.08, dt: 1.0 });
    rd.seed(rng, rng.int(70, 100), 2);                 // many spread nucleation sites → even fill
    rd.step(pre.steps);                                // grow the pattern

    // colour ramp, kept numeric (straight into ImageData — no per-pixel string parsing)
    var ramp = sc.ramp.map(Loom.hexToRgb);
    function rampRGB(t, out) {
      if (t < 0) t = 0; else if (t > 1) t = 1;
      var n = ramp.length - 1, seg = Math.min(n - 1, Math.floor(t * n)), tt = t * n - seg;
      var a = ramp[seg], b = ramp[seg + 1];
      out[0] = a.r + (b.r - a.r) * tt;
      out[1] = a.g + (b.g - a.g) * tt;
      out[2] = a.b + (b.b - a.b) * tt;
    }

    // render the field to an offscreen GxG image, then upscale softly to the canvas
    var off = document.createElement("canvas");
    off.width = G; off.height = G;
    var octx = off.getContext("2d");
    var img = octx.createImageData(G, G);
    var data = img.data, V = rd.V, rgb = [0, 0, 0];
    for (var i = 0; i < G * G; i++) {
      // V tops out around ~0.4; stretch + a little contrast so the pattern reads crisply
      var v = V[i] / 0.4;
      v = v * v * (3 - 2 * v);                          // smoothstep for contrast
      rampRGB(v, rgb);
      var p = i * 4;
      data[p] = rgb[0]; data[p + 1] = rgb[1]; data[p + 2] = rgb[2]; data[p + 3] = 255;
    }
    octx.putImageData(img, 0, 0);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    var m = 8;                                            // crop in past the border's edge effects
    ctx.drawImage(off, m, m, G - 2 * m, G - 2 * m, 0, 0, S, S);
    // STATIC — return nothing (lesson 017: no rng/sim in a per-frame path).
  }
});
