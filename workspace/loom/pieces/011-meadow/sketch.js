// Emil's Loom · piece 011 — "Meadow"
//
// A deliberate turn away from the last three (Aurora, Glint, Medusa were all a glowing
// thing centred on the dark): this one is BRIGHT, has no central subject and no horizon,
// and is built by *combining* the accumulated library instead of being bespoke. You're
// lying in a sunlit field — grass and wildflowers receding into warm haze — and a gust
// travels through, the whole meadow leaning in a slow wave.
//
// Compounds the library: Poisson-disk scatter (lib/points.js) places the flowers so they
// don't clump; a noise field (lib/noise.js) is the wind, one coherent gust across x and
// time. Bright has no glow-contrast to lean on, so depth comes from *atmospheric
// perspective* — far plants fade toward the haze, near plants stay saturated and tall.
//
// Animated: draw() seeds every plant once and returns frame(t); only the wind (and a
// little pollen) move (lesson 017).
Loom.piece({
  id: "011",
  title: "Meadow",
  seed: "breeze",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var U = S / 700;
    var TAU = 6.2831853;

    // All moods are daytime-bright — the whole point is to leave the dark behind.
    var SCHEMES = [
      { // golden noon (canonical)
        haze: "#f5ead0", mid: "#d6dc9c", deep: "#9eb869", grass: "#789a44", hi: "#cbdc8a",
        flowers: ["#ffffff", "#ffd94a", "#ff7a59", "#e98fb8", "#9bb0e8"], sun: "#fff4d2"
      },
      { // soft dewy morning (cooler)
        haze: "#e9efe1", mid: "#bcd0b0", deep: "#7fa377", grass: "#5d8a59", hi: "#b9d9a9",
        flowers: ["#ffffff", "#fff0a0", "#f4a0c0", "#b0c0f0", "#ffb070"], sun: "#eef6e6"
      },
      { // spring, rosy light
        haze: "#f7e6df", mid: "#dbc8ae", deep: "#a8b069", grass: "#869949", hi: "#e9d7a1",
        flowers: ["#ffffff", "#ff8fb0", "#ffd24a", "#d88fe0", "#ff9a6a"], sun: "#fff0e4"
      }
    ];
    var sc = SCHEMES[rng.int(0, SCHEMES.length - 1)];
    var wind = Loom.noise(rng.int(0, 1e9));
    var centerCol = Loom.mix(sc.sun, "#caa23c", 0.5);     // golden flower centre

    // NOTE colour: Loom.mix returns an "rgb(...)" string, Loom.rgba expects HEX —
    // never wrap a mix() result in rgba() (→ invalid → canvas draws black). For the
    // depth fade we set ctx.globalAlpha and use the mixed colour directly. (lesson 020)

    // map a depth d in [0,1] (0 = far/hazy/small/high, 1 = near/saturated/tall/low)
    function baseY(d) { return S * (0.40 + 0.70 * d); }   // far roots high, near roots below frame
    function height(d) { return S * (0.10 + 0.44 * d); }  // far short (distant), near tall (immersive)

    // Build one plant record. kind: "grass" | "flower".
    function makePlant(x, d, kind) {
      var hazeMix = (1 - d) * 0.82;                       // aerial perspective: far → haze
      var col = Loom.mix(kind === "grass" ? sc.grass : sc.deep, sc.haze, hazeMix);
      return {
        x: x, d: d, kind: kind,
        h: height(d) * rng.range(0.7, 1.18),
        lean: rng.range(-0.10, 0.10),                     // resting tilt
        bend: rng.range(0.5, 1.0),                        // how much it curves under wind
        w: U * (0.5 + 2.4 * d) * (kind === "flower" ? 0.65 : 1),
        col: col,
        hi: Loom.mix(sc.hi, sc.haze, hazeMix),
        a: 0.55 + 0.45 * d,
        amp: S * (0.012 + 0.06 * d),                      // near plants swing more (px)
        ph: rng.range(0, TAU),
        // flower extras
        fcol: kind === "flower" ? Loom.mix(rng.pick(sc.flowers), sc.haze, hazeMix * 0.7) : null,
        petals: rng.int(5, 9),
        fr: U * (2.6 + 15 * d) * rng.range(0.7, 1.45),    // head radius (strong size range)
        spin: rng.range(0, TAU)
      };
    }

    var plants = [];
    // grass — dense, random placement (grass is allowed to clump)
    var nGrass = Math.round(360 * (S / 700));
    for (var i = 0; i < nGrass; i++) {
      plants.push(makePlant(rng.range(-0.05, 1.05) * S, rng.range(0, 1), "grass"));
    }
    // flowers — Poisson scatter so they spread out naturally instead of bunching
    var fpts = Loom.poisson(rng, S, S * 0.72, S * 0.072);
    for (var f = 0; f < fpts.length; f++) {
      var d = fpts[f][1] / (S * 0.72);                    // y in the band → depth
      plants.push(makePlant(fpts[f][0], d, "flower"));
    }
    // a few big blooms up close — focal points and a sense of scale
    for (var hf = 0; hf < 9; hf++) {
      plants.push(makePlant(rng.range(0.05, 0.95) * S, rng.range(0.82, 1.0), "flower"));
    }
    // draw order: far first, near last
    plants.sort(function (a, b) { return a.d - b.d; });

    // pollen motes drifting up through the light (lib/drift.js — primitive #9)
    var motes = Loom.drift(rng, S, S, {
      count: 26, rMin: 0.6 * U, rMax: 1.8 * U, aMin: 0.12, aMax: 0.4,
      dir: -Math.PI / 2, speedMin: 4, speedMax: 11, sway: 10 * U, swayRate: 0.5
    });

    // the wind: one coherent gust travelling left→right, sampled at a plant's x and time.
    // returns roughly [-1, 1].
    function gust(x, t) {
      return (wind.fbm(x * 1.7 / S - t * 0.16, t * 0.22, 3) - 0.5) * 2.4;
    }

    function drawPlant(p, t) {
      var g = gust(p.x, t);
      var leanPx = p.lean * p.h + g * p.amp;              // tip horizontal offset
      var bx = p.x, by = baseY(p.d);
      var tx = bx + leanPx, ty = by - p.h;
      // control point ~55% up, pushed sideways by the bend so it curves rather than tilts
      var cx = bx + leanPx * 0.35 - g * p.amp * p.bend * 0.6;
      var cy = by - p.h * 0.58;

      // the blade/stem as a tapering filled shape
      ctx.beginPath();
      ctx.moveTo(bx - p.w, by);
      ctx.quadraticCurveTo(cx - p.w * 0.3, cy, tx, ty);
      ctx.quadraticCurveTo(cx + p.w * 0.3, cy, bx + p.w, by);
      ctx.closePath();
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.col;
      ctx.fill();

      // a sunlit centreline on nearer blades — catches the light, adds shimmer
      if (p.kind === "grass" && p.d > 0.45) {
        ctx.globalAlpha = (p.d - 0.45) * 0.5;
        ctx.strokeStyle = p.hi;
        ctx.lineWidth = Math.max(0.6, p.w * 0.5);
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(cx, cy, tx, ty);
        ctx.stroke();
      }

      if (p.kind === "flower") {
        // a simple head: petals around a centre, riding the stem tip
        var pr = p.fr;
        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(g * 0.15);
        ctx.globalAlpha = Math.min(1, p.a + 0.3);
        ctx.fillStyle = p.fcol;
        for (var k = 0; k < p.petals; k++) {
          var ang = (k / p.petals) * TAU + p.spin;
          ctx.beginPath();
          ctx.ellipse(Math.cos(ang) * pr * 0.82, Math.sin(ang) * pr * 0.82,
            pr * 0.6, pr * 0.42, ang, 0, TAU);
          ctx.fill();
        }
        // centre
        ctx.beginPath();
        ctx.arc(0, 0, pr * 0.5, 0, TAU);
        ctx.fillStyle = centerCol;
        ctx.fill();
        ctx.restore();
      }
    }

    return function frame(t) {
      ctx.globalAlpha = 1;
      // bright sky-haze → field gradient (the field receding into light, no hard horizon)
      var bg = ctx.createLinearGradient(0, 0, 0, S);
      bg.addColorStop(0, sc.haze);
      bg.addColorStop(0.42, Loom.mix(sc.haze, sc.mid, 0.8));
      bg.addColorStop(0.72, sc.mid);
      bg.addColorStop(1, sc.deep);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, S, S);

      // a soft warm wash of sunlight from the upper area (broad, not a glowing disc)
      var sun = ctx.createRadialGradient(S * 0.66, S * 0.16, 0, S * 0.66, S * 0.16, S * 0.9);
      sun.addColorStop(0, Loom.rgba(sc.sun, 0.5));
      sun.addColorStop(0.5, Loom.rgba(sc.sun, 0.12));
      sun.addColorStop(1, Loom.rgba(sc.sun, 0));
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, S, S);

      // the meadow, far → near
      for (var i = 0; i < plants.length; i++) drawPlant(plants[i], t);
      ctx.globalAlpha = 1;

      // pollen drifting up through the light
      for (var m = 0; m < motes.length; m++) {
        var mo = motes[m];
        var pt = mo.pos(t);
        ctx.fillStyle = Loom.rgba(sc.sun, mo.a * 0.5);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, mo.r, 0, TAU);
        ctx.fill();
      }
    };
  }
});
