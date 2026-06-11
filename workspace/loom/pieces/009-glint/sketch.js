// Emil's Loom · piece 009 — "Glint"
//
// A low sun over open water, and the thing that makes it: the glitter path — the
// sun's reflection broken into a thousand shifting flecks that run from the horizon
// down to your feet, never still. A composed scene (sky, sun, sea) with the most
// alive thing in it being the light on the water. Warm, to balance a cool gallery.
// Animated: draw() seeds the scene once and returns frame(t); the shimmer is time.
Loom.piece({
  id: "009",
  title: "Glint",
  seed: "gleam",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var noise = Loom.noise(rng.int(0, 1e9));

    // Sunset moods (+ one moonlit, for surprise). Each: sky top/horizon, sun, glow, sea, glint.
    var SCHEMES = [
      { top: "#241a3a", hor: "#f0a850", sun: "#ffe6ad", glow: "#ffae4a", sea: "#0d0f17", gl: "#ffd285" }, // golden hour
      { top: "#2a1230", hor: "#ff6a3a", sun: "#ffd2a6", glow: "#ff5a2e", sea: "#100a0e", gl: "#ff9a5e" }, // fiery
      { top: "#241828", hor: "#f291a6", sun: "#ffe2ea", glow: "#ff7d9c", sea: "#0c0a12", gl: "#ffb6c6" }, // rose dusk
      { top: "#04070e", hor: "#243a56", sun: "#e9f1ff", glow: "#a6c4f2", sea: "#05070e", gl: "#cfe2ff" }  // moonlit
    ];
    var sc = SCHEMES[rng.int(0, SCHEMES.length - 1)];

    var horizon = S * rng.range(0.5, 0.62);
    var sun = {
      x: S * rng.range(0.34, 0.66),
      y: horizon - S * rng.range(-0.01, 0.06),    // can dip just below the horizon (setting)
      r: S * rng.range(0.05, 0.085)
    };

    var clouds = [];
    for (var i = 0, n = rng.int(2, 5); i < n; i++) {
      clouds.push({
        y: rng.range(horizon * 0.3, horizon * 0.92),
        w: rng.range(0.3, 0.8) * S,
        x: rng.range(0, S),
        h: rng.range(0.01, 0.03) * S,
        a: rng.range(0.1, 0.3),
        sp: rng.range(2, 6) * (rng.bool() ? 1 : -1)
      });
    }

    function ramp(y) { // 0 at top of sky, 1 at horizon
      return Math.max(0, Math.min(1, y / horizon));
    }

    return function frame(t) {
      // sky
      var sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, sc.top);
      sky.addColorStop(0.7, Loom.mix(sc.top, sc.hor, 0.55));
      sky.addColorStop(1, sc.hor);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, S, horizon + 1);

      // sun glow (additive haze) + disc
      ctx.globalCompositeOperation = "lighter";
      var glow = ctx.createRadialGradient(sun.x, sun.y, sun.r * 0.4, sun.x, sun.y, sun.r * 6);
      glow.addColorStop(0, Loom.rgba(sc.glow, 0.5));
      glow.addColorStop(0.4, Loom.rgba(sc.glow, 0.14));
      glow.addColorStop(1, Loom.rgba(sc.glow, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, S, horizon + S * 0.1);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = sc.sun;
      ctx.beginPath(); ctx.arc(sun.x, sun.y, sun.r, 0, 6.2832); ctx.fill();

      // clouds drifting across, tinted by the sky
      for (var c = 0; c < clouds.length; c++) {
        var cl = clouds[c];
        var cx = ((cl.x + t * cl.sp) % (S + cl.w)) - cl.w * 0.5;
        var cg = ctx.createLinearGradient(cx, 0, cx + cl.w, 0);
        cg.addColorStop(0, Loom.rgba(sc.top, 0));
        cg.addColorStop(0.5, Loom.rgba(Loom.mix(sc.top, "#000000", 0.2), cl.a));
        cg.addColorStop(1, Loom.rgba(sc.top, 0));
        ctx.fillStyle = cg;
        ctx.fillRect(cx, cl.y - cl.h, cl.w, cl.h * 2);
      }

      // sea (covers the sun's lower half → it "sets") with a faint depth gradient
      var seaG = ctx.createLinearGradient(0, horizon, 0, S);
      seaG.addColorStop(0, Loom.mix(sc.sea, sc.hor, 0.18));
      seaG.addColorStop(1, sc.sea);
      ctx.fillStyle = seaG;
      ctx.fillRect(0, horizon, S, S - horizon + 1);

      // the glitter path — the reason for the piece. fine, dense flecks, squared for
      // sparkle (mostly dim, the odd bright catch), in gentle wave bands rolling in.
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      var seaH = S - horizon;
      for (var y = horizon + 1; y < S; y += 2.5) {
        var f = (y - horizon) / seaH;            // 0 at horizon, 1 at foreground
        var half = sun.r * (0.5 + f * f * 4.5);  // the path fans toward the viewer
        var band = 0.62 + 0.38 * Math.sin(f * 8 - t * 2.0); // soft wave bands, never fully dark
        var rowFade = (1 - 0.45 * f) * band;
        if (rowFade <= 0.04) continue;
        var glints = 4 + ((f * 11) | 0);
        for (var k = 0; k < glints; k++) {
          var gx = sun.x + (noise(k * 2.3 + y * 0.04, t * 1.2 + k * 0.7) - 0.5) * 2 * half;
          var b = noise(k * 1.9 + y * 0.11, t * 1.0 + k * 1.3);
          b = b * b * rowFade;                   // square → sparkle contrast
          if (b < 0.05) continue;
          var len = 2 + noise(k + y * 0.13, t * 0.8) * (3 + half * 0.12);
          ctx.strokeStyle = Loom.rgba(sc.gl, Math.min(0.72, b * 1.3));
          ctx.lineWidth = 1 + f * 1.1;
          ctx.beginPath();
          ctx.moveTo(gx - len / 2, y);
          ctx.lineTo(gx + len / 2, y);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };
  }
});
