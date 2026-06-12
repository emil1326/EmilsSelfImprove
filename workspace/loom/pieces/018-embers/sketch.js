// Emil's Loom · piece 018 — "Embers"
//
// A small fire at the blue hour, throwing embers up into the dark. The sky is deep dusk-blue,
// not black, so the warm sparks read against cool air rather than the additive-glow-on-pure-
// black idiom three earlier pieces already use. The fire is the still focal point; the embers
// are the life — spawning hot, climbing on the heat, swaying as the air turbulises, cooling
// from yellow to red to nothing, then born again. Warm against cool; a quiet, mesmerising thing.
//
// Each ember is a pure function of time: its age comes from a seeded phase plus t (so they're
// spread across their lifecycles, never all at the fire at once), and everything else follows
// from age. No per-frame randomness → it reproduces exactly from the seed, and the gallery's
// frozen frame(0) already shows a full rising stream ([[017-animation-seed-setup-once]]).
Loom.piece({
  id: "018",
  title: "Embers",
  seed: "bluehour",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;

    var SCHEMES = [
      { sky: ["#0a1026", "#141d3e", "#243150", "#3a3a52"], ground: "#06080f", glow: "#ff8a3a", core: "#ffe6a0", ember: ["#fff2cc", "#ffcf6a", "#ff8f3a", "#e05a1e", "#7e2208"] },
      { sky: ["#101a30", "#293b54", "#5a5a64", "#c79e76"], ground: "#0a0c12", glow: "#ff9a48", core: "#fff0c0", ember: ["#fff4d4", "#ffd47a", "#ff9a44", "#e3651f", "#86270a"] }, // pre-dawn warming low
      { sky: ["#060a18", "#0e1430", "#1a2244", "#2a2c46"], ground: "#04060c", glow: "#ff7e30", core: "#ffe09a", ember: ["#ffeec0", "#ffc55e", "#ff8330", "#d44e16", "#701c06"] }, // deep night
      { sky: ["#120a26", "#241844", "#3a2a54", "#4a3a5a"], ground: "#080610", glow: "#ff8848", core: "#ffe0a8", ember: ["#fff0cc", "#ffcf72", "#ff924a", "#df5a26", "#7c220c"] }  // violet dusk
    ];
    var sc = rng.pick(SCHEMES);

    var fireX = rng.range(0.40, 0.60) * S;
    var fireY = rng.range(0.80, 0.85) * S;

    // sky gradient (cached, static)
    var sky = ctx.createLinearGradient(0, 0, 0, S);
    for (var i = 0; i < sc.sky.length; i++) sky.addColorStop(i / (sc.sky.length - 1), sc.sky[i]);

    var ramp = Loom.ramp(sc.ember);              // hot → cool ember colour
    var swn = Loom.noise(rng.int(0, 1e9));       // turbulence for the sway

    // faint stars, high only
    var stars = [];
    for (var st = 0, ns = rng.int(24, 46); st < ns; st++)
      stars.push([rng.range(0, 1) * S, rng.range(0, 0.52) * S, rng.range(0.06, 0.26), rng.range(0.4, 1.1) * U]);

    // a dark ground ridge (subtle), built once
    var gn = Loom.noise(rng.int(0, 1e9));
    var groundY = fireY + 0.02 * S;
    var ridge = [];
    for (var gx = 0; gx <= S; gx += 7 * U) ridge.push([gx, groundY + (gn.fbm(gx / S * 2.2, 3.1, 3) - 0.5) * S * 0.03]);

    // a little stack of logs at the fire (dark silhouettes), built once
    var logs = [];
    for (var lg = 0, nl = rng.int(2, 3); lg < nl; lg++) {
      var ang = -0.5 + lg * (1.0 / nl) + rng.range(-0.12, 0.12), len = rng.range(0.07, 0.11) * S;
      logs.push([fireX - Math.cos(ang) * len * 0.5, groundY - Math.sin(ang) * len * 0.1, ang, len, rng.range(3, 5) * U]);
    }

    // a lone figure seated by the fire (static silhouette, rim-lit by the glow) — the quiet
    // human heart of it: someone alone with a fire under the dusk. Kept simple and dark.
    var figX = fireX - rng.range(0.12, 0.17) * S, figDir = 1;     // fire is to its right
    var figH = rng.range(0.115, 0.15) * S;
    var figBase = groundY + (gn.fbm(figX / S * 2.2, 3.1, 3) - 0.5) * S * 0.03;
    function drawFigure() {
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.fillStyle = "#070510";
      var b = figBase, h = figH, d = figDir;
      ctx.beginPath(); ctx.ellipse(figX, b - h * 0.40, h * 0.30, h * 0.44, d * 0.14, 0, TAU); ctx.fill();           // torso
      ctx.beginPath(); ctx.ellipse(figX + d * h * 0.26, b - h * 0.13, h * 0.30, h * 0.17, 0, 0, TAU); ctx.fill();  // knees/lap
      ctx.beginPath(); ctx.arc(figX + d * h * 0.10, b - h * 0.80, h * 0.17, 0, TAU); ctx.fill();                    // head
      ctx.strokeStyle = Loom.rgba(sc.core, 0.4); ctx.lineWidth = 1.5 * U; ctx.lineCap = "round";   // warm rim light
      ctx.beginPath();
      ctx.moveTo(figX + d * h * 0.22, b - h * 0.66);
      ctx.quadraticCurveTo(figX + d * h * 0.40, b - h * 0.40, figX + d * h * 0.42, b - h * 0.12);
      ctx.stroke();
    }

    // the ember pool — seeded params only; motion derives from age(t)
    var N = Math.round(230 * (S / 760));
    var em = [];
    for (var e = 0; e < N; e++) {
      var hero = rng.bool(0.14);                       // a few big bright high-flyers
      em.push({
        x0: fireX + rng.gaussian() * 0.03 * S,
        y0: fireY - rng.range(0, 0.02) * S,
        life: rng.range(2.4, 5.2) * (hero ? 1.3 : 1),
        phase: rng.range(0, 1),
        rise: (hero ? rng.range(0.60, 0.82) : rng.range(0.26, 0.58)) * S,
        sway: rng.range(0.02, 0.08) * S,
        seed: rng.range(0, 1000),
        sz: (hero ? rng.range(1.8, 2.8) : rng.range(0.55, 1.5)) * U,
        hot: rng.range(0, 0.22),
        flick: rng.range(6, 16),
        spin: rng.range(-1, 1) * (hero ? 5 : 9),       // corkscrew curl as it rises
        spinR: rng.range(0.006, 0.022) * S
      });
    }

    function frame(t) {
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);

      // stars
      for (var s = 0; s < stars.length; s++) {
        var sr = stars[s];
        ctx.globalAlpha = sr[2]; ctx.fillStyle = "#dfe4f2";
        ctx.beginPath(); ctx.arc(sr[0], sr[1], sr[3], 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // the fire's broad warm light on the air/ground, gently flickering
      var fk = 0.86 + 0.14 * Math.sin(t * 6.3) + 0.06 * (swn(t * 0.7, 9.1) - 0.5) * 2;
      Loom.glow(ctx, fireX, fireY, S * 0.46 * fk, sc.glow, 0.34 * fk, 0.55);

      // ground silhouette (drawn over the low glow), then logs
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.fillStyle = sc.ground;
      ctx.beginPath(); ctx.moveTo(0, S);
      for (var r = 0; r < ridge.length; r++) ctx.lineTo(ridge[r][0], ridge[r][1]);
      ctx.lineTo(S, S); ctx.closePath(); ctx.fill();

      // the hot heart of the fire + a couple of flickering flame licks
      Loom.glow(ctx, fireX, fireY - 6 * U, S * 0.12 * fk, sc.glow, 0.6, 0.45);
      for (var fcnt = 0; fcnt < 5; fcnt++) {                 // flame tongues licking upward
        var fph = fcnt * 1.7, ff = 0.5 + 0.5 * Math.sin(t * (4 + fcnt * 0.7) + fph);
        var fx = fireX + (fcnt - 2) * 0.014 * S + Math.sin(t * 2.5 + fph) * 0.01 * S;
        var fy = fireY - (0.015 + 0.06 * ff) * S;            // higher when it flickers up
        Loom.glow(ctx, fx, fy, S * 0.042 * (0.6 + ff), fcnt % 2 ? sc.core : sc.glow, 0.45 * ff, 0.42);
      }

      ctx.strokeStyle = sc.ground; ctx.lineCap = "round";
      for (var l = 0; l < logs.length; l++) {
        var lo = logs[l]; ctx.lineWidth = lo[4];
        ctx.beginPath(); ctx.moveTo(lo[0], lo[1]);
        ctx.lineTo(lo[0] + Math.cos(lo[2]) * lo[3], lo[1] - Math.sin(lo[2]) * lo[3]); ctx.stroke();
      }

      drawFigure();

      // the embers — additive glowing motes climbing and cooling
      ctx.globalCompositeOperation = "lighter";
      var rgbtmp = [0, 0, 0];
      for (var k = 0; k < N; k++) {
        var em2 = em[k];
        var u = (t / em2.life + em2.phase) % 1; if (u < 0) u += 1;
        var climb = Math.pow(u, 0.72);                       // fast early, easing as it cools
        var swr = (swn(em2.seed, u * 3.0) - 0.5) * 2;        // turbulent wander, grows with height
        var spinA = u * em2.spin + em2.seed;                 // corkscrew — embers curl on the heat
        var x = em2.x0 + swr * em2.sway * (0.3 + u) + Math.cos(spinA) * em2.spinR * u;
        var y = em2.y0 - climb * em2.rise + Math.sin(spinA) * em2.spinR * u * 0.5;
        var fade = (1 - u) * (1 - u);                        // dim faster than it climbs
        var flick = 0.72 + 0.28 * Math.sin(t * em2.flick + em2.seed * 11);
        var bright = fade * flick;
        if (bright <= 0.02) continue;
        var col = ramp.css(u * 0.92 + em2.hot);          // hot when young → dark as it cools (ramp clamps)
        var sz = em2.sz * (0.65 + 0.55 * (1 - u));
        // additive halo + mid + core (a cheap poor-man's gradient — a real radial gradient
        // per ember is hundreds of createRadialGradient calls a frame, which tanks the fps)
        ctx.fillStyle = col;
        ctx.globalAlpha = bright * 0.3;
        ctx.beginPath(); ctx.arc(x, y, sz * 3.4, 0, TAU); ctx.fill();
        ctx.globalAlpha = bright * 0.55;
        ctx.beginPath(); ctx.arc(x, y, sz * 1.7, 0, TAU); ctx.fill();
        ctx.globalAlpha = bright;
        ctx.beginPath(); ctx.arc(x, y, sz * 0.82, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    }

    return frame;
  }
});
