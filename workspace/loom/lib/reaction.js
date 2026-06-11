// Emil's Loom — reaction-diffusion (primitive #10): the Gray-Scott model.
//
// Two virtual chemicals on a grid: U (the substrate) and V (the catalyst). V eats U to
// make more V, U is fed in, V decays — and because the two diffuse at different rates, the
// balance never settles into a flat soup but freezes into *patterns*: spots, stripes,
// mazes, coral, fingerprints. It's the maths behind a leopard's coat and a brain's folds,
// and it's been on the roadmap since the start. A genuinely reusable field generator — the
// caller seeds it, steps it, and reads V to colour it however it likes.
//
// Fast on purpose: flat Float32Array grids, an inlined 9-point Laplacian, no modulo (a
// fixed 1-cell border instead of wrapping). Reproducible — seeding takes a Loom.RNG.
//
//   var rd = Loom.reaction(w, h, { f, k, du, dv, dt });
//   rd.seed(rng, patches, radius);   // nucleate V in a few spots
//   rd.step(2500);                   // let the pattern develop
//   … read rd.V (and rd.w/rd.h) to colour it …
(function (Loom) {
  Loom.reaction = function (w, h, opts) {
    opts = opts || {};
    var f = opts.f == null ? 0.037 : opts.f;       // feed
    var k = opts.k == null ? 0.06 : opts.k;        // kill
    var du = opts.du == null ? 0.16 : opts.du;     // U diffusion
    var dv = opts.dv == null ? 0.08 : opts.dv;     // V diffusion
    var dt = opts.dt == null ? 1.0 : opts.dt;
    var N = w * h;

    // two buffers each; borders stay (U=1, V=0) forever so the interior loop needs no wrap
    var U = new Float32Array(N), V = new Float32Array(N);
    var U2 = new Float32Array(N), V2 = new Float32Array(N);
    U.fill(1); U2.fill(1);                          // V/V2 already 0

    function seed(rng, patches, r) {
      for (var s = 0; s < patches; s++) {
        var cx = rng.int(r + 1, w - r - 2), cy = rng.int(r + 1, h - r - 2);
        for (var dy = -r; dy <= r; dy++) {
          for (var dx = -r; dx <= r; dx++) {
            if (dx * dx + dy * dy <= r * r) {
              var i = (cy + dy) * w + (cx + dx);
              V[i] = 1; U[i] = 0; V2[i] = 1; U2[i] = 0;
            }
          }
        }
      }
    }

    // perturb V across the WHOLE field, so a pattern develops everywhere (no empty ground)
    function seedNoise(rng, density) {
      density = density == null ? 0.5 : density;
      for (var i = w + 1; i < N - w - 1; i++) {
        if (rng.next() < density) {
          var v = rng.range(0.28, 0.55);
          V[i] = v; V2[i] = v; U[i] = 0.5; U2[i] = 0.5;
        }
      }
    }

    function step(times) {
      for (var t = 0; t < times; t++) {
        for (var y = 1; y < h - 1; y++) {
          var row = y * w;
          for (var x = 1; x < w - 1; x++) {
            var i = row + x;
            var lapU = -U[i]
              + 0.2 * (U[i - 1] + U[i + 1] + U[i - w] + U[i + w])
              + 0.05 * (U[i - w - 1] + U[i - w + 1] + U[i + w - 1] + U[i + w + 1]);
            var lapV = -V[i]
              + 0.2 * (V[i - 1] + V[i + 1] + V[i - w] + V[i + w])
              + 0.05 * (V[i - w - 1] + V[i - w + 1] + V[i + w - 1] + V[i + w + 1]);
            var uvv = U[i] * V[i] * V[i];
            U2[i] = U[i] + (du * lapU - uvv + f * (1 - U[i])) * dt;
            V2[i] = V[i] + (dv * lapV + uvv - (f + k) * V[i]) * dt;
          }
        }
        var a = U; U = U2; U2 = a;
        var b = V; V = V2; V2 = b;
      }
    }

    return {
      w: w, h: h,
      get U() { return U; },
      get V() { return V; },
      seed: seed,
      seedNoise: seedNoise,
      step: step
    };
  };
})((window.Loom = window.Loom || {}));
