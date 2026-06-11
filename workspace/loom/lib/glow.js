// Emil's Loom — glow (primitive #8).
//
// A point of light: a soft additive halo that fades from a bright core to nothing.
// Two pieces already hand-rolled this exact thing — Aurora's horizon/curtain light
// and Glint's sun (createRadialGradient + globalCompositeOperation = "lighter") —
// so it earned its place as a shared primitive. Anything luminous wants it: a sun,
// a bioluminescent dot, a lantern, a firefly, the edge of a glowing creature.
//
// `lighter` compositing means glows *add* where they overlap (two dim lights make a
// brighter one), which is how real light reads — so this saves and restores the
// caller's composite op rather than leaving it changed.
//
// Classic script on window.Loom (see lib/rng.js for why not ES modules).
(function (Loom) {
  // Paint an additive radial glow centred at (x, y), fading to nothing by radius r.
  //   color     — a hex string ("#ffd285"); the light's colour.
  //   intensity — core alpha in [0,1] (default 0.5). Higher = hotter centre.
  //   falloff   — where the glow is half-faded, as a fraction of r (default 0.4);
  //               smaller = tight bright core, larger = broad even haze.
  // Needs Loom.rgba (lib/palette.js) for hex+alpha → rgba().
  Loom.glow = function (ctx, x, y, r, color, intensity, falloff) {
    if (r <= 0) return;
    var a = intensity == null ? 0.5 : intensity;
    var mid = falloff == null ? 0.4 : falloff;
    var prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, Loom.rgba(color, a));
    g.addColorStop(mid, Loom.rgba(color, a * 0.28));
    g.addColorStop(1, Loom.rgba(color, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.2832);
    ctx.fill();
    ctx.globalCompositeOperation = prev;
  };
})((window.Loom = window.Loom || {}));
