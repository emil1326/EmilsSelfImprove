// Emil's Loom · piece 012 — "Clock"
//
// A dandelion clock (the seed-head) coming apart on the wind. A deliberate break from
// every habit I'd fallen into: it's a MACRO close-up, not a vista; the subject sits
// OFF-CENTRE in the lower-left with the frame's upper-right left empty for the seeds to
// stream into; and it's delicate, not grand. The seeds lift off in a legible diagonal
// current and disperse toward the light.
//
// The light is the trick. On a bright field you can't fake glow with additive blending
// (adding to a pale background just clamps to white) — so luminosity here is pure TONE:
// the white fluff is the brightest thing, set against a mid-tone surround that darkens
// away from the light. Everything is plain source-over. (advisor, #22)
//
// Composes the library where the image genuinely wants it: a noise field (lib/noise.js)
// is the wind — the sway of the head and the drift of the loosed seeds. Animated; all
// structure is seeded once, only the wind moves (lesson 017).
Loom.piece({
  id: "012",
  title: "Clock",
  seed: "blow",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var U = S / 700;
    var TAU = 6.2831853;

    // Soft daylight moods — each has a LIGHT tone (bright zone) and a MID tone (the
    // shadowed surround the fluff reads against), plus fluff/seed/stem.
    var SCHEMES = [
      { light: "#f6eccf", mid: "#94a07a", deep: "#6f7a58", fluff: "#fcf9f0", seed: "#473726", stem: "#5b5436" }, // golden meadow (canonical)
      { light: "#eef4f6", mid: "#8f9ca6", deep: "#5f6b78", fluff: "#fdfeff", seed: "#36404a", stem: "#48535a" }, // cool morning
      { light: "#f5dcab", mid: "#8a7470", deep: "#5f4d50", fluff: "#fdf6ec", seed: "#3e2c28", stem: "#574338" }, // dusk gold
      { light: "#eef0d8", mid: "#7f9668", deep: "#566a44", fluff: "#fbfdf0", seed: "#34421f", stem: "#4a5630" }  // green field
    ];
    var sc = SCHEMES[rng.int(0, SCHEMES.length - 1)];
    var wind = Loom.noise(rng.int(0, 1e9));

    // composition: the head sits off-centre, lower-left; seeds stream to the upper-right.
    var hx = S * rng.range(0.30, 0.39);
    var hy = S * rng.range(0.56, 0.64);
    var R = S * rng.range(0.14, 0.175);
    var lx = S * 0.82, ly = S * 0.18;                  // light source (upper-right)
    var windA = Math.atan2(ly - hy, lx - hx) + rng.range(-0.1, 0.1); // head → light
    var cosW = Math.cos(windA), sinW = Math.sin(windA);

    // the stem, curving down out of frame
    var stemSway = rng.range(0.04, 0.09) * S;
    var stemCtrl = rng.range(-0.10, 0.10) * S;

    // seeds still on the head: attachment points spread across the disc, each a little
    // parachute (a fan of filaments) pointing outward from the centre.
    var seeds = [];
    var nSeeds = rng.int(64, 88);
    for (var i = 0; i < nSeeds; i++) {
      var a = rng.range(0, TAU);
      var rad = R * Math.sqrt(rng.next()) * 0.42;       // attachment radius (sqrt → even fill)
      seeds.push({
        a: a, rad: rad,
        len: R * rng.range(0.66, 1.0),
        nFil: rng.int(7, 11),
        spread: rng.range(0.55, 0.95),
        sway: rng.range(0, TAU)
      });
    }

    // loosed seeds: a coherent stream drifting toward the light. Their progress u is
    // spread out so at any moment they form a continuous, thinning diagonal current.
    var drifters = [];
    var nD = rng.int(30, 40);
    for (var d = 0; d < nD; d++) {
      drifters.push({
        u0: d / nD + rng.range(-0.02, 0.02),            // staggered along the path
        period: rng.range(11, 17),
        from: windA + rng.range(-1.3, 1.3),             // lifts off the windward side of the head
        dist: S * rng.range(0.62, 0.92),                // how far it travels
        wobAmp: S * rng.range(0.02, 0.05),
        wobFreq: rng.range(0.7, 1.4),
        len: R * rng.range(0.5, 0.85),
        nFil: rng.int(7, 10),
        spin: rng.range(-0.5, 0.5)
      });
    }

    // soft out-of-focus light pools (bokeh), biased toward the bright corner
    var bokeh = [];
    for (var b = 0; b < 13; b++) {
      bokeh.push({
        x: rng.range(0.2, 1.05) * S,
        y: rng.range(-0.05, 0.7) * S,
        r: rng.range(0.04, 0.13) * S,
        a: rng.range(0.05, 0.16)
      });
    }

    // draw one parachute: a fan of fine filaments from (cx,cy) about dirA, brighter on the
    // side facing the light. Plain source-over; brightness is tone + alpha, not additive.
    function tuft(cx, cy, dirA, len, nFil, spread, baseA, fluffCol) {
      for (var k = 0; k < nFil; k++) {
        var f = nFil === 1 ? 0.5 : k / (nFil - 1);
        var fa = dirA + (f - 0.5) * spread;
        var lit = 0.55 + 0.45 * Math.cos(fa - windA);   // filaments facing the light glow more
        var ex = cx + Math.cos(fa) * len;
        var ey = cy + Math.sin(fa) * len;
        var mx = cx + Math.cos(fa) * len * 0.5 - Math.sin(fa) * len * 0.06;
        var my = cy + Math.sin(fa) * len * 0.5 + Math.cos(fa) * len * 0.06;
        ctx.globalAlpha = baseA * (0.4 + 0.6 * lit);
        ctx.strokeStyle = fluffCol;
        ctx.lineWidth = (0.5 + 0.4 * lit) * U;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(mx, my, ex, ey);
        ctx.stroke();
      }
      // a faint soft tip-haze so the parachute reads as fluff, not a wire fan
      ctx.globalAlpha = baseA * 0.16;
      ctx.fillStyle = fluffCol;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(dirA) * len * 0.7, cy + Math.sin(dirA) * len * 0.7, len * 0.34, 0, TAU);
      ctx.fill();
    }

    return function frame(t) {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // background: a directional tone — bright at the light source, mid-tone away from it,
      // darkest in the lower-left where the head needs contrast behind it.
      var bg = ctx.createRadialGradient(lx, ly, S * 0.05, lx, ly, S * 1.15);
      bg.addColorStop(0, sc.light);
      bg.addColorStop(0.45, Loom.mix(sc.light, sc.mid, 0.7));
      bg.addColorStop(0.8, sc.mid);
      bg.addColorStop(1, sc.deep);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, S, S);

      // bokeh pools (soft, lighter than the surround)
      for (var b = 0; b < bokeh.length; b++) {
        var bo = bokeh[b];
        var bx = bo.x + Math.sin(t * 0.15 + b) * 4 * U;
        var bg2 = ctx.createRadialGradient(bx, bo.y, 0, bx, bo.y, bo.r);
        bg2.addColorStop(0, Loom.rgba(sc.light, bo.a));
        bg2.addColorStop(1, Loom.rgba(sc.light, 0));
        ctx.fillStyle = bg2;
        ctx.fillRect(bx - bo.r, bo.y - bo.r, bo.r * 2, bo.r * 2);
      }

      // the gust: a slow value that sways the whole head + stem
      var gust = (wind.fbm(t * 0.18, 0.3, 3) - 0.5) * 2;     // ~[-1,1]
      var sway = gust * stemSway;
      var cx = hx + sway, cy = hy - Math.abs(gust) * R * 0.08;

      // stem (drawn first, behind the fluff)
      ctx.globalAlpha = 1;
      ctx.strokeStyle = sc.stem;
      ctx.lineWidth = 3.2 * U;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(hx + stemCtrl * 0.2, S + 4);
      ctx.quadraticCurveTo(hx + stemCtrl - sway * 0.3, (cy + S) * 0.5, cx, cy);
      ctx.stroke();

      // the head: achenes (faint dark structure) then the fluff over them
      for (var s = 0; s < seeds.length; s++) {
        var se = seeds[s];
        var ax = cx + Math.cos(se.a) * se.rad;
        var ay = cy + Math.sin(se.a) * se.rad;
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = sc.seed;
        ctx.lineWidth = 0.8 * U;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ax, ay);
        ctx.stroke();
      }
      // tiny dark receptacle at the centre
      ctx.globalAlpha = 1;
      ctx.fillStyle = sc.seed;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.07, 0, TAU);
      ctx.fill();

      for (var s2 = 0; s2 < seeds.length; s2++) {
        var sd = seeds[s2];
        var sx = cx + Math.cos(sd.a) * sd.rad;
        var sy = cy + Math.sin(sd.a) * sd.rad;
        var fa = sd.a + gust * 0.08 * Math.sin(sd.sway);   // a little shimmer in the gust
        tuft(sx, sy, fa, sd.len, sd.nFil, sd.spread, 0.5, sc.fluff);
      }

      // the loosed seeds — a thinning diagonal current toward the light
      for (var di = 0; di < drifters.length; di++) {
        var dr = drifters[di];
        var u = (t / dr.period + dr.u0) % 1;
        if (u < 0) u += 1;
        var ox = cx + Math.cos(dr.from) * R * 0.7;      // lift-off point on the windward rim
        var oy = cy + Math.sin(dr.from) * R * 0.7;
        // ease the distance (smoothstep) so a seed starts from REST, accelerates, then drifts
        // to a near-stop as it disperses — no popping into motion at full speed.
        var ease = u * u * (3 - 2 * u);
        var dist = dr.dist * ease;
        // and turn its heading from the radial lift-off direction INTO the wind over the first
        // third of flight, so it doesn't snap downwind the instant it detaches.
        var turn = Math.min(1, u / 0.35); turn = turn * turn * (3 - 2 * turn);
        var hX = Math.cos(dr.from) * (1 - turn) + cosW * turn;
        var hY = Math.sin(dr.from) * (1 - turn) + sinW * turn;
        var hl = Math.hypot(hX, hY) || 1; hX /= hl; hY /= hl;
        var wob = (wind.fbm(dist * 0.01 + di, t * 0.3 + dr.from, 2) - 0.5) * 2 * dr.wobAmp * turn;
        var px = ox + hX * dist - sinW * wob;
        var py = oy + hY * dist + cosW * wob;
        // hold presence across the mid-tone band, then disperse into the light; shrink as it goes
        var fadeIn = Math.min(1, u * 6);
        var fadeOut = u < 0.72 ? 1 : Math.max(0, (1 - u) / 0.28);
        var alpha = fadeIn * fadeOut;
        var size = dr.len * (1 - 0.4 * u);
        var dirA = Math.atan2(hY, hX) + dr.spin * 0.4 + Math.sin(t * 0.5 + di) * 0.2; // parachute trails its path
        tuft(px, py, dirA, size, dr.nFil, 1.0, 0.64 * alpha, sc.fluff);
      }

      ctx.globalAlpha = 1;
    };
  }
});
