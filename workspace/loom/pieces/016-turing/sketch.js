// Emil's Loom · piece 016 — "Turing"
//
// Reaction-diffusion: the patterns Alan Turing predicted in 1952 for how a uniform blob of
// cells could spontaneously grow spots and stripes — the maths behind a leopard's coat,
// coral, fingerprints, the folds of a brain. Two chemicals diffuse and react on a grid and
// freeze into an organic labyrinth. Genuinely new for the Loom: not a thing I draw, but a
// thing I *grow* and then colour. Built on the new lib/reaction.js (primitive #10).
//
// Grown over animation frames (async) so the window opens instantly and you watch the
// pattern form, instead of a multi-second freeze while it develops up front (Emil's #27
// note). Reproducible from the seed; the (f,k) feed/kill pair chooses which world it grows
// (coral, maze, spots, mitosis), so I pick from known-good pairs rather than gambling — RD
// is famously sensitive to them.
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
    // colour ramp, kept numeric (straight into ImageData — no per-pixel string parsing)
    var ramp = Loom.ramp(sc.ramp);

    // one offscreen GxG image, reused every frame; upscaled softly to the canvas
    var off = document.createElement("canvas");
    off.width = G; off.height = G;
    var octx = off.getContext("2d");
    var img = octx.createImageData(G, G);
    var data = img.data, rgb = [0, 0, 0];
    var m = 8;                                            // crop in past the border's edge effects
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    function render() {
      var V = rd.V;
      for (var i = 0; i < G * G; i++) {
        var v = V[i] / 0.4;                              // V tops out ~0.4
        v = v * v * (3 - 2 * v);                         // smoothstep for contrast
        ramp.rgb(v, rgb);
        var p = i * 4;
        data[p] = rgb[0]; data[p + 1] = rgb[1]; data[p + 2] = rgb[2]; data[p + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.drawImage(off, m, m, G - 2 * m, G - 2 * m, 0, 0, S, S);
    }

    // ASYNC EVERYWHERE — never block on the sim (running a few thousand steps at once freezes
    // the page, and the gallery, for seconds; Emil flagged both). Pre-warm just a touch so the
    // first paint isn't bare, then grow the pattern over animation FRAMES. On a piece page the
    // harness loops frame() for us; in the GALLERY (a static preview the gallery never loops)
    // we self-drive a tiny rAF loop so the gallery's load never waits for the diffusion.
    // (Stateful but deterministic + rng-free per frame → still reproduces from the seed; the
    // only randomness was the seeding in draw(). Cf. [[017-animation-seed-setup-once]].)
    rd.step(120);
    render();
    var grown = 120;
    function growChunk() {
      if (grown >= pre.steps) return true;                // developed → settle into the still image
      rd.step(26); grown += 26;                           // grow in over ~2s, then stop
      render();
      return false;
    }
    return Loom.grow(growChunk);                          // gallery self-drives to settled; page loops it (lib/grow.js #17)
  }
});
