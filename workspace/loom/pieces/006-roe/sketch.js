// Emil's Loom · piece 006 — "Roe"
//
// Where Tessera tiled the plane with angular cells, this fills it with round ones:
// hundreds of disks packed tight, a few large and many tiny squeezing into the gaps,
// like roe or froth or a tray of glass beads. Built on lib/pack.js (dart-throw + grow
// packing); each circle takes its colour from a noise field (lib/noise.js) so the
// palette pools into regions, with a soft top-left highlight so they read as round.
Loom.piece({
  id: "006",
  title: "Roe",
  seed: "pearl",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var pal = Loom.palette(rng);
    var noise = Loom.noise(rng.int(0, 1e9));

    ctx.fillStyle = Loom.mix(pal.bg, "#000000", 0.15);
    ctx.fillRect(0, 0, S, S);

    var circles = Loom.pack(rng, S, S, {
      minR: S * rng.range(0.004, 0.008),
      maxR: S * rng.range(0.09, 0.15),
      attempts: rng.int(4000, 6500),
      padding: S * 0.004
    });

    var colorScale = rng.range(1.2, 2.4) / S;
    for (var i = 0; i < circles.length; i++) {
      var c = circles[i];
      var t = noise.fbm(c.x * colorScale, c.y * colorScale, 3);
      var base = Loom.hexToRgb(pal.colors[Math.min(pal.colors.length - 1, (t * pal.colors.length) | 0)]);
      var jit = rng.range(0.84, 1.13);
      ctx.fillStyle = "rgb(" +
        Math.min(255, base.r * jit | 0) + "," +
        Math.min(255, base.g * jit | 0) + "," +
        Math.min(255, base.b * jit | 0) + ")";
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // spherical shading: light from the upper-left, shadow at the lower-right rim
      var hl = ctx.createRadialGradient(
        c.x - c.r * 0.35, c.y - c.r * 0.35, c.r * 0.05,
        c.x, c.y, c.r
      );
      hl.addColorStop(0, "rgba(255,255,255,0.22)");
      hl.addColorStop(0.55, "rgba(255,255,255,0)");
      hl.addColorStop(1, "rgba(0,0,0,0.22)");
      ctx.fillStyle = hl;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    }

    var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.34, S / 2, S / 2, S * 0.78);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.3)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, S, S);
  }
});
