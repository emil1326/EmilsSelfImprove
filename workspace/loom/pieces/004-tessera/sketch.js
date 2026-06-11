// Emil's Loom · piece 004 — "Tessera"
//
// The first piece with hard edges. 001/002/003 were all continuous fields; this one
// shatters the plane into cells — a Voronoi mosaic, like stained glass or a cracked
// ceramic glaze. Seeds are blue-noise points (lib/points.js) so the cells are evenly
// irregular; each cell takes its colour from a noise field (lib/noise.js) so the
// palette pools into coherent regions instead of confetti. Dark "leading" traces the
// borders where the nearest seed changes.
//
// Per-pixel nearest-seed (brute force over a moderate number of cells). imageData is
// in DEVICE pixels and ignores the transform, so we read the backing-store size and
// map back to CSS coords — identical at any dpr.
Loom.piece({
  id: "004",
  title: "Tessera",
  seed: "42",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var pal = Loom.palette(rng);
    var noise = Loom.noise(rng.int(0, 1e9));

    var r = S * rng.range(0.072, 0.11);          // cell spacing → ~40–80 cells
    var seeds = Loom.poisson(rng, S, S, r);
    var n = seeds.length;

    // Each cell's colour: a palette colour chosen by a smooth noise value at the seed
    // (so neighbours share hues → regions), with a little per-cell lightness jitter.
    var colorScale = rng.range(1.4, 2.6) / S;
    var sx = new Float32Array(n), sy = new Float32Array(n);
    var cr = new Float32Array(n), cg = new Float32Array(n), cb = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      sx[i] = seeds[i][0]; sy[i] = seeds[i][1];
      var t = noise.fbm(seeds[i][0] * colorScale, seeds[i][1] * colorScale, 3);
      var c = Loom.hexToRgb(pal.colors[Math.min(pal.colors.length - 1, (t * pal.colors.length) | 0)]);
      var jit = rng.range(0.84, 1.12);           // subtle lightness variation per tile
      cr[i] = Math.min(255, c.r * jit);
      cg[i] = Math.min(255, c.g * jit);
      cb[i] = Math.min(255, c.b * jit);
    }

    var W = ctx.canvas.width, H = ctx.canvas.height;
    var dpr = W / S;
    var img = ctx.createImageData(W, H);
    var data = img.data;
    var prevRow = new Int32Array(W);
    var curRow = new Int32Array(W);

    for (var py = 0; py < H; py++) {
      var y = py / dpr;
      for (var px = 0; px < W; px++) {
        var x = px / dpr;
        // nearest seed
        var best = 0, bd = Infinity;
        for (var s = 0; s < n; s++) {
          var dx = sx[s] - x, dy = sy[s] - y;
          var d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = s; }
        }
        curRow[px] = best;

        var R = cr[best], G = cg[best], B = cb[best];
        // leading: darken where the nearest cell changes from the left/upper neighbour
        if ((px > 0 && curRow[px - 1] !== best) || (py > 0 && prevRow[px] !== best)) {
          R *= 0.28; G *= 0.28; B *= 0.28;
        }
        var idx = (py * W + px) * 4;
        data[idx] = R; data[idx + 1] = G; data[idx + 2] = B; data[idx + 3] = 255;
      }
      var tmp = prevRow; prevRow = curRow; curRow = tmp;
    }
    ctx.putImageData(img, 0, 0);

    // Vignette in CSS space on top.
    var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.32, S / 2, S / 2, S * 0.78);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.32)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, S, S);
  }
});
