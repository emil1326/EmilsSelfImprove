// Emil's Loom · piece 003 — "Strata"
//
// A landscape seen from straight above: a seeded noise field, sliced into elevation
// bands and traced with contour lines, the way a topographic map reads height. 001
// was a tidy grid, 002 was flowing line; this is areal and geological — the field
// itself made visible. Built on the new noise primitive (lib/noise.js), with a touch
// of domain warping so the strata fold like real rock instead of pooling like blobs.
//
// Per-pixel work: imageData lives in DEVICE pixels and ignores the canvas transform,
// so we read the real backing-store size and map back to CSS coords — correct and
// identical at any devicePixelRatio (full page or gallery thumbnail).
Loom.piece({
  id: "003",
  title: "Strata",
  seed: "canyon",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var pal = Loom.palette(rng);
    var noise = Loom.noise(rng.int(0, 1e9));

    var W = ctx.canvas.width, H = ctx.canvas.height;  // device pixels
    var dpr = W / S;                                   // device px per CSS px

    var freq = rng.range(2.2, 3.8);     // how many noise-units span the canvas
    var scale = freq / S;
    var octaves = 4;
    var bands = rng.int(8, 13);         // number of elevation strata
    var warpAmt = rng.range(0.25, 1.1); // domain-warp strength (geological folding)

    // Precompute a colour per band: a ramp from the dark background up through the
    // first few palette colours (which tend to share a family → a coherent elevation
    // gradient rather than a muddy rainbow).
    var ramp = Loom.ramp([pal.bg].concat(pal.colors.slice(0, 4)));
    var bandColors = [];
    for (var k = 0; k < bands; k++) bandColors.push(ramp.rgb(k / (bands - 1)));

    var elevation = function (x, y) {
      var nx = x * scale, ny = y * scale;
      // domain warp: push the sample point around using more noise
      var wx = nx + warpAmt * (noise(nx * 0.6 + 11.3, ny * 0.6 + 4.7) - 0.5);
      var wy = ny + warpAmt * (noise(nx * 0.6 + 31.1, ny * 0.6 + 23.9) - 0.5);
      return noise.fbm(wx, wy, octaves);
    };

    var img = ctx.createImageData(W, H);
    var data = img.data;
    var prevRow = new Int16Array(W);
    var curRow = new Int16Array(W);

    for (var py = 0; py < H; py++) {
      var y = py / dpr;
      for (var px = 0; px < W; px++) {
        var x = px / dpr;
        var v = elevation(x, y);
        var band = (v * bands) | 0;
        if (band >= bands) band = bands - 1;
        curRow[px] = band;

        var c = bandColors[band];
        var r = c[0], g = c[1], b = c[2];

        // contour line where the band changes from the left or upper neighbour
        var edge = (px > 0 && curRow[px - 1] !== band) || (py > 0 && prevRow[px] !== band);
        if (edge) { r *= 0.5; g *= 0.5; b *= 0.5; }

        var idx = (py * W + px) * 4;
        data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
      }
      var tmp = prevRow; prevRow = curRow; curRow = tmp;
    }
    ctx.putImageData(img, 0, 0);

    // Vignette, drawn in CSS space on top (transform applies to normal draw ops).
    var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.32, S / 2, S / 2, S * 0.78);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.34)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, S, S);
  }
});
