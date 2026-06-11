// Emil's Loom · piece 007 — "Rime"
//
// Frost on a black window. Diffusion-limited aggregation (lib/dla.js): wandering
// particles freeze the instant they touch a growing cluster, and from a single seed
// that builds a delicate radial dendrite — all spindle and negative space, the
// airy/organic register Emil rates highest (002, 005). Each new tendril is drawn as
// a fine line back to whatever it stuck to, coloured from the warm core out to the
// cold tips by the order it grew.
Loom.piece({
  id: "007",
  title: "Rime",
  seed: "shard",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var pal = Loom.palette(rng);

    ctx.fillStyle = Loom.mix(pal.bg, "#000000", 0.22);
    ctx.fillRect(0, 0, S, S);

    var pts = Loom.dla(rng, S, S, {
      n: rng.int(1900, 2700),               // target STUCK particles (not attempts)
      r: S * rng.range(0.0045, 0.0062),
      seeds: "center"
    });
    var maxGen = (pts.length - 1) || 1;

    // colour ramp core → tip across the first few palette colours
    var stops = pal.colors.slice(0, 5).map(Loom.hexToRgb);
    function ramp(f) {
      f = f < 0 ? 0 : f > 1 ? 1 : f;
      var p = f * (stops.length - 1), i = Math.floor(p), t = p - i;
      var a = stops[i], b = stops[Math.min(i + 1, stops.length - 1)];
      return "rgb(" +
        Math.round(a.r + (b.r - a.r) * t) + "," +
        Math.round(a.g + (b.g - a.g) * t) + "," +
        Math.round(a.b + (b.b - a.b) * t) + ")";
    }

    ctx.lineCap = "round";
    var baseW = S * rng.range(0.0045, 0.0065);
    for (var i = 1; i < pts.length; i++) {
      var pt = pts[i];
      if (pt.parent < 0) continue;
      var par = pts[pt.parent];
      var f = pt.gen / maxGen;
      ctx.strokeStyle = ramp(f);
      ctx.lineWidth = Math.max(0.4, baseW * (1.25 - f * 0.8)); // thicker at the core
      ctx.beginPath();
      ctx.moveTo(par.x, par.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }

    var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S * 0.82);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.3)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, S, S);
  }
});
