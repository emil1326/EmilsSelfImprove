// Emil's Loom · piece 039 — "Keeper"
//
// A lighthouse at night, its beams sweeping through the sea-fog. The HOOK is motion no other piece has: a
// rotating VOLUMETRIC beam — a cone of light raking through fog, flaring as it crosses the dark — not the
// static halos I've leaned on. And the register is lonely/steadfast: one small light keeping watch over a
// black sea. Animated (returns frame(t)); the sweep is a pure function of t, judged from a t-strip
// ([[042-verify-animation-with-a-t-strip-not-a-live-frame]] / [[017-animation-seed-setup-once]]).
//
// Glow-on-dark, so the light is additive ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]]); the
// beam needs FOG to catch it or it's an invisible ray ([[045-a-luminous-subject-needs-an-environment-to-light]]).
// The read lives in the volumetric sweep ([[035-defining-feature-is-often-the-hard-part]]): a flat triangle
// is a wedge, but a bright-core + soft-edge cone fading into drifting fog is a BEAM. Static scene (sky, sea,
// tower silhouette, stars) is pre-rendered once; only fog + beams + glints move. Composes noise (#3, fog +
// glint shimmer) + glow (#8, the lamp). Animated.
Loom.piece({
  id: "039",
  title: "Keeper",
  seed: "pharos",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));
    var horizon = S * (0.6 + rng.range(-0.02, 0.02));
    var sideR = rng.bool(0.5);                                 // lighthouse on the right (or mirrored left)
    var baseX = S * (sideR ? 0.72 : 0.28), sgn = sideR ? 1 : -1;
    var towerW = S * 0.05, towerTop = S * 0.27, towerBot = horizon + S * 0.02;
    var lampX = baseX, lampY = towerTop;
    var warm = "#ffe9c0";
    var nBeams = rng.pick([2, 2, 3]), omega = rng.range(0.42, 0.6) * (rng.bool() ? 1 : -1);
    var beam0 = rng.range(0, TAU);

    // ---- pre-render the static night: sky, sea, stars, the cliff + tower silhouette ----
    var bgC = document.createElement("canvas"); bgC.width = S; bgC.height = S;
    var b = bgC.getContext("2d");
    (function night() {
      var sky = b.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, "#05080f"); sky.addColorStop(0.7, "#0a1422"); sky.addColorStop(1, "#16243a");
      b.fillStyle = sky; b.fillRect(0, 0, S, horizon);
      var sea = b.createLinearGradient(0, horizon, 0, S);
      sea.addColorStop(0, "#0c1726"); sea.addColorStop(1, "#04080f");
      b.fillStyle = sea; b.fillRect(0, horizon, S, S - horizon);
      // a soft static sea-fog haze hugging the horizon (the body the beams light up)
      var fogB = b.createLinearGradient(0, horizon - S * 0.07, 0, horizon + S * 0.11);
      fogB.addColorStop(0, "rgba(120,150,185,0)"); fogB.addColorStop(0.42, "rgba(120,150,185,0.17)"); fogB.addColorStop(1, "rgba(120,150,185,0)");
      b.fillStyle = fogB; b.fillRect(0, horizon - S * 0.07, S, S * 0.18);
      // stars in the upper sky (sparse, dim — fog eats the low ones)
      for (var i = 0, n = Math.round(140 * U); i < n; i++) {
        var sx = rng.range(0, 1) * S, sy = rng.range(0, 0.55) * horizon, sr = rng.range(0.3, 1.1) * U;
        b.fillStyle = "rgba(200,214,240," + rng.range(0.1, 0.5).toFixed(2) + ")";
        b.beginPath(); b.arc(sx, sy, sr, 0, TAU); b.fill();
      }
      // the rocky point the tower stands on: a dark headland, irregular top, sloping face into the sea
      b.fillStyle = "#04070c"; b.beginPath();
      var edgeX = sideR ? S : 0, toeX = sideR ? S * 0.38 : S * 0.62, peak = sideR ? 0.72 : 0.28;
      b.moveTo(edgeX, S); b.lineTo(edgeX, horizon + S * 0.006);
      for (var hx = (sideR ? 1.0 : 0.0); sideR ? hx >= 0.42 : hx <= 0.58; hx += (sideR ? -0.028 : 0.028)) {
        var hump = Math.exp(-Math.pow((hx - peak) / 0.2, 2)) * S * 0.055;
        var ridge = horizon + S * 0.045 - hump + (nz.fbm(hx * 7 + 3, 9, 3, 2, 0.5) - 0.5) * S * 0.022;
        b.lineTo(hx * S, ridge);
      }
      b.lineTo(toeX, S); b.closePath(); b.fill();
      // the tower — a tapered silhouette with a lamp room + gallery up top
      b.fillStyle = "#070a11";
      b.beginPath();
      b.moveTo(baseX - towerW, towerBot);
      b.lineTo(baseX - towerW * 0.5, towerTop + S * 0.02);
      b.lineTo(baseX + towerW * 0.5, towerTop + S * 0.02);
      b.lineTo(baseX + towerW, towerBot);
      b.closePath(); b.fill();
      b.fillRect(baseX - towerW * 0.62, towerTop - S * 0.004, towerW * 1.24, S * 0.026);  // gallery deck
      // lamp room housing (dark frame; the light itself is drawn live)
      b.fillStyle = "#0c1018";
      b.fillRect(baseX - towerW * 0.42, towerTop - S * 0.03, towerW * 0.84, S * 0.03);
      b.fillStyle = "#0a0d14";                                  // a little roof
      b.beginPath(); b.moveTo(baseX - towerW * 0.5, towerTop - S * 0.03);
      b.lineTo(baseX, towerTop - S * 0.05); b.lineTo(baseX + towerW * 0.5, towerTop - S * 0.03); b.closePath(); b.fill();
      // two faint warm windows down the tower
      b.fillStyle = "rgba(255,200,120,0.5)";
      b.fillRect(baseX - towerW * 0.12, towerTop + S * 0.06, towerW * 0.24, S * 0.018);
      b.fillRect(baseX - towerW * 0.14, towerTop + S * 0.13, towerW * 0.28, S * 0.02);
    })();

    function beamCone(ang, R, halfA, color, inten) {
      ctx.save(); ctx.translate(lampX, lampY); ctx.rotate(ang);
      var Rw = R * Math.tan(halfA);
      var g = ctx.createLinearGradient(0, 0, R, 0);
      g.addColorStop(0, Loom.rgba(color, inten));
      g.addColorStop(0.45, Loom.rgba(color, inten * 0.32));
      g.addColorStop(1, Loom.rgba(color, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, -Rw); ctx.lineTo(R, Rw); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function frame(t) {
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.drawImage(bgC, 0, 0, S, S);

      // ---- a few big soft fog lumps drifting along the horizon (movement; the static haze is in the bg) ----
      ctx.globalCompositeOperation = "lighter";
      for (var fi = 0; fi < 7; fi++) {
        var fx = ((fi / 7 + t * 0.012) % 1.2 - 0.1) * S;
        var fy = horizon - S * 0.005 + Math.sin(fi * 2.1 + t * 0.12) * S * 0.014;
        var fa = 0.045 + 0.035 * (0.5 + 0.5 * Math.sin(fi * 1.7 + t * 0.22));
        Loom.glow(ctx, fx, fy, S * 0.17, "#90b2cf", fa, 0.6);
      }

      // ---- the sweeping beams: broad volumetric cones, bright where they rake the fog, faint into clear sky ----
      var R = S * 1.15;
      for (var k = 0; k < nBeams; k++) {
        var ang = beam0 + omega * t + k * TAU / nBeams;
        var dir = Math.sin(ang);                                // +1 straight down, -1 straight up
        var fog = clamp(0.5 * dir + 0.55, 0.09, 1);             // visible low/horizontal, faint into clear sky ([[045]])
        var wM = 0.8 + 0.5 * fog;
        beamCone(ang, R, 0.14 * wM, warm, 0.13 * fog);          // wide soft body
        beamCone(ang, R, 0.07 * wM, warm, 0.2 * fog);           // mid
        beamCone(ang, R * 0.99, 0.026 * wM, "#fff6e6", 0.32 * fog); // bright core
        // glitter where a downward beam strikes the sea
        if (dir > 0.12) {
          var hitX = lampX + Math.cos(ang) * (horizon - lampY) / Math.max(0.2, dir);
          var gv = clamp(dir, 0, 1);
          for (var gI = 0; gI < Math.round(70 * U); gI++) {
            var gy = horizon + Math.pow(rng.next(), 1.5) * (S - horizon) * 0.75;
            var spread = (gy - horizon) * 0.55 + S * 0.02;
            var gx = hitX + rng.range(-1, 1) * spread + (nz.fbm(gy * 0.05, t * 0.5 + gI, 2, 2, 0.5) - 0.5) * S * 0.05;
            var ga = gv * clamp(1 - (gy - horizon) / (S - horizon), 0, 1) * rng.range(0.12, 0.55);
            ctx.fillStyle = "rgba(255,240,210," + ga.toFixed(3) + ")";
            ctx.fillRect(gx, gy, rng.range(1, 2.6) * U, 1.2 * U);
          }
        }
      }

      // ---- the lamp itself: a bright warm source + bloom ----
      Loom.glow(ctx, lampX, lampY, S * 0.14, warm, 0.5, 0.5);
      Loom.glow(ctx, lampX, lampY, S * 0.04, "#fffaf0", 0.95, 0.4);
      ctx.fillStyle = "#fffaf0"; ctx.beginPath(); ctx.arc(lampX, lampY, S * 0.012, 0, TAU); ctx.fill();

      // ---- seat it: a soft night vignette ----
      ctx.globalCompositeOperation = "source-over";
      var vg = ctx.createRadialGradient(lampX, lampY, S * 0.3, S * 0.5, S * 0.55, S * 0.8);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(2,4,9,0.66)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
    }
    return frame;
  }
});
