// Emil's Loom — primitive #3: seeded value noise (+ fractal fbm).
//
// Smooth, reproducible 2D noise — the workhorse behind terrains, textures, contour
// fields, and organic flow. 002's flow field faked it with a sum of sines; this is
// the real thing, and every field-based piece from here can draw on it.
//
// Loom.noise(seed) → a function n(x, y) in [0, 1), with n.fbm(x, y, octaves, lacunarity, gain)
// for fractal Brownian motion (layered octaves → natural detail). Classic script on
// window.Loom; depends on Loom.hashSeed from rng.js for reproducibility.
(function (Loom) {
  function makeNoise(seed) {
    var seedN = (typeof seed === "number") ? (seed >>> 0) : Loom.hashSeed(String(seed));

    // Integer hash of a lattice point → a stable pseudo-random value in [0, 1).
    function hash(ix, iy) {
      var h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seedN, 0x9e3779b1)) | 0;
      h = Math.imul(h ^ (h >>> 13), 1274126177) | 0;
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    }
    function smoother(t) { return t * t * t * (t * (t * 6 - 15) + 10); } // smootherstep
    function lerp(a, b, t) { return a + (b - a) * t; }

    // 2D value noise: bilinearly interpolate the four surrounding lattice values.
    function n(x, y) {
      var x0 = Math.floor(x), y0 = Math.floor(y);
      var fx = smoother(x - x0), fy = smoother(y - y0);
      var v00 = hash(x0, y0), v10 = hash(x0 + 1, y0);
      var v01 = hash(x0, y0 + 1), v11 = hash(x0 + 1, y0 + 1);
      return lerp(lerp(v00, v10, fx), lerp(v01, v11, fx), fy);
    }

    // Fractal Brownian motion: sum octaves of decreasing amplitude / increasing freq.
    n.fbm = function (x, y, octaves, lacunarity, gain) {
      octaves = octaves || 4;
      lacunarity = lacunarity || 2;
      gain = gain === undefined ? 0.5 : gain;
      var amp = 0.5, freq = 1, sum = 0, norm = 0;
      for (var i = 0; i < octaves; i++) {
        sum += amp * n(x * freq, y * freq);
        norm += amp;
        amp *= gain;
        freq *= lacunarity;
      }
      return sum / norm; // ~[0, 1)
    };

    return n;
  }

  Loom.noise = makeNoise;
})((window.Loom = window.Loom || {}));
