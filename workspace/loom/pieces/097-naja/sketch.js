// Emil's Loom · piece 097 — "Naja"
//
// A cobra reared to strike — hood flared, the whole front third of the body lifted off the ground, and the eyes
// locked dead on YOU. The hook is the menace, the held instant before it commits (a creature-with-an-event, the
// Stoop/Sharpshooter lane): not "a rendered snake" but a confrontation, the way Iris and the tree-frog stare
// back except this one means it. Chosen by the #140 steer — APPLY the gate, don't reach: a creature SILHOUETTE
// carrying THREAT is squarely a strength (the read is the flared-hood shape, 035; the impact-kind is menace,
// which flat-vector does), aimed honestly at a reliable strong-4, and varied off the radial-burst-of-light rut.
// Dusk drama in TONE + a warm rim (022/037-restrained), no figure/majesty/cloud. Self-directed; no advisor (099).
Loom.piece({
  id: "097",
  title: "Naja",
  seed: "hannah",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- seed parameters (wide; pose, skin morph, light side vary; 085/097) ----
    var f = rng.bool() ? 1 : -1;                          // sun + slight head-turn side
    var cxp = rng.range(0.40, 0.58) * S, baseY = rng.range(0.80, 0.90) * S;   // coil position
    var H = rng.range(0.52, 0.62) * S;                    // reared height
    var hoodW = rng.range(0.27, 0.35);                    // hood breadth (fraction of H) — broad + dramatic
    var sway = rng.range(-0.05, 0.05) * S;                // S-curve lean
    var morph = rng.range(0, 1);                          // dark-olive .. golden cobra
    var warmth = rng.range(0, 1);                         // dusk hue

    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function css(c) { return "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")"; }
    var skin = mix([66, 56, 40], [120, 92, 50], morph), skinDark = mix([40, 34, 24], [80, 58, 32], morph);
    var belly = mix([150, 126, 88], [196, 166, 104], morph);
    var rimC = mix([240, 178, 96], [255, 206, 120], warmth);

    // =========================================================================
    //  DUSK SKY + low sun + warm earth
    // =========================================================================
    var sky = ctx.createLinearGradient(0, 0, 0, baseY + 0.04 * S);
    sky.addColorStop(0, css(mix([54, 46, 78], [70, 52, 70], warmth)));
    sky.addColorStop(0.6, css(mix([150, 104, 96], [186, 130, 96], warmth)));
    sky.addColorStop(1, css(mix([232, 168, 102], [248, 190, 110], warmth)));
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, baseY + 0.05 * S);
    var sunX = cxp - f * 0.34 * S, sunY = baseY - 0.18 * S;
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, sunX, sunY, 0.34 * S, css(mix([255, 196, 120], [255, 214, 150], warmth)), 0.4, 0.55);
    ctx.globalCompositeOperation = "source-over";
    // earth
    var earth = ctx.createLinearGradient(0, baseY - 0.02 * S, 0, S);
    earth.addColorStop(0, css(mix([120, 86, 54], [150, 110, 66], warmth))); earth.addColorStop(1, css([46, 32, 20]));
    ctx.fillStyle = earth; ctx.fillRect(0, baseY - 0.02 * S, S, S);

    // =========================================================================
    //  geometry helper
    // =========================================================================
    function smoothClosed(pts) {
      var n = pts.length; ctx.beginPath();
      ctx.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
      for (var i = 0; i < n; i++) { var a = pts[i], b = pts[(i + 1) % n]; ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
      ctx.closePath();
    }
    // the reared body + hood as a centreline (base→head) with a width profile that flares at the hood
    var headX = cxp + sway, headY = baseY - H;
    var spine = [   // [t up 0..1, lateralOffsetFrac, halfWidthFrac] — a smooth bell-flared hood
      [0.00, 0.0, 0.085], [0.16, 0.04, 0.068], [0.34, -0.03, 0.054], [0.50, 0.0, 0.050],
      [0.60, 0.006, 0.066], [0.68, 0.01, 0.13], [0.76, 0.014, 0.25], [0.83, 0.018, hoodW], [0.89, 0.02, 0.23], [0.94, 0.02, 0.12], [0.975, 0.02, 0.06], [1.0, 0.02, 0.048]
    ];
    function sp(i) { var s2 = spine[i]; return [cxp + s2[1] * H + (sway * s2[0]), baseY - s2[0] * H]; }
    function bodyOutline() {
      var L = [], R = [];
      for (var i = 0; i < spine.length; i++) {
        var p = sp(i), w = spine[i][2] * H;
        L.push([p[0] - w, p[1]]); R.push([p[0] + w, p[1]]);
      }
      return L.concat(R.reverse());
    }

    // =========================================================================
    //  THE COIL at the base (drawn behind the reared body)
    // =========================================================================
    ctx.fillStyle = "rgba(20,12,6,0.34)";   // ground shadow
    ctx.beginPath(); ctx.ellipse(cxp + f * 0.05 * S, baseY + 0.03 * S, 0.22 * S, 0.05 * S, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css(skinDark);
    ctx.beginPath(); ctx.ellipse(cxp, baseY, 0.17 * S, 0.07 * S, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css(mix(skinDark, [0, 0, 0], 0.4)); ctx.lineWidth = 3 * U;
    for (var cl = 0; cl < 3; cl++) { ctx.beginPath(); ctx.ellipse(cxp + (cl - 1) * 0.05 * S, baseY + 0.01 * S, (0.13 - cl * 0.03) * S, 0.05 * S, 0, 0, Math.PI); ctx.stroke(); }

    // =========================================================================
    //  THE REARED BODY + HOOD — the silhouette (035)
    // =========================================================================
    var outline = bodyOutline();
    smoothClosed(outline);
    var bodyG = ctx.createLinearGradient(cxp - hoodW * H, 0, cxp + hoodW * H, 0);
    bodyG.addColorStop(0, css(f > 0 ? skinDark : skin)); bodyG.addColorStop(0.5, css(skin)); bodyG.addColorStop(1, css(f > 0 ? skin : skinDark));
    ctx.fillStyle = bodyG; ctx.fill();

    // detail clipped to the body
    ctx.save(); smoothClosed(outline); ctx.clip();
    // the pale throat down the centre-front
    var th = ctx.createLinearGradient(cxp - 0.04 * S, 0, cxp + 0.04 * S, 0);
    th.addColorStop(0, "rgba(0,0,0,0)"); th.addColorStop(0.5, css(belly)); th.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = 0.7; ctx.fillStyle = th; ctx.fillRect(cxp - 0.06 * S, headY, 0.12 * S, H); ctx.globalAlpha = 1;
    // dark throat bands across the lower hood (the cobra's banding)
    ctx.strokeStyle = "rgba(28,18,10,0.6)"; ctx.lineWidth = 0.018 * S; ctx.lineCap = "round";
    for (var tb = 0; tb < 3; tb++) { var by = headY + H * (0.30 + tb * 0.05); ctx.beginPath(); ctx.moveTo(cxp - 0.08 * S, by); ctx.quadraticCurveTo(cxp, by + 0.01 * S, cxp + 0.08 * S, by); ctx.stroke(); }
    // fine scale stipple
    ctx.globalAlpha = 0.12;
    for (var sc = 0; sc < 260; sc++) {
      var sx = cxp + rng.range(-1, 1) * hoodW * H, sy = headY + rng.range(0, 1) * H;
      ctx.fillStyle = nz.fbm(sx * 0.05, sy * 0.05, 2) > 0.5 ? css(mix(skin, [255, 220, 160], 0.4)) : css(skinDark);
      ctx.beginPath(); ctx.arc(sx, sy, 1.1 * U, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // warm rim-light down the sun-facing edge of the hood + body
    ctx.save(); smoothClosed(outline); ctx.clip();
    ctx.strokeStyle = "rgba(" + (rimC[0] | 0) + "," + (rimC[1] | 0) + "," + (rimC[2] | 0) + ",0.55)";
    ctx.lineWidth = 0.011 * S; smoothClosed(outline); ctx.stroke();
    ctx.restore();

    // =========================================================================
    //  THE HEAD — small, flattened, the eyes locked on the viewer (the menace)
    // =========================================================================
    var hx = headX, hy = headY + 0.035 * H;
    // a flat angular head, mouth AGAPE — striking, not a face
    ctx.fillStyle = css(skin);
    smoothClosed([[hx - 0.06 * S, hy - 0.012 * S], [hx - 0.048 * S, hy - 0.038 * S], [hx + 0.048 * S, hy - 0.038 * S], [hx + 0.06 * S, hy - 0.012 * S], [hx + 0.05 * S, hy + 0.03 * S], [hx - 0.05 * S, hy + 0.03 * S]]);
    ctx.fill();
    // the open gape (dark) + the pink throat, agape toward you
    ctx.fillStyle = "#280c08";
    smoothClosed([[hx - 0.05 * S, hy + 0.026 * S], [hx, hy + 0.02 * S], [hx + 0.05 * S, hy + 0.026 * S], [hx + 0.032 * S, hy + 0.094 * S], [hx, hy + 0.112 * S], [hx - 0.032 * S, hy + 0.094 * S]]);
    ctx.fill();
    var mg = ctx.createRadialGradient(hx, hy + 0.062 * S, 0.002 * S, hx, hy + 0.062 * S, 0.04 * S);
    mg.addColorStop(0, "#b04450"); mg.addColorStop(1, "#3a1010");
    ctx.fillStyle = mg; ctx.beginPath(); ctx.ellipse(hx, hy + 0.064 * S, 0.025 * S, 0.036 * S, 0, 0, TAU); ctx.fill();
    // two fangs
    ctx.fillStyle = "#f4ead2";
    ctx.beginPath(); ctx.moveTo(hx - 0.026 * S, hy + 0.028 * S); ctx.lineTo(hx - 0.017 * S, hy + 0.072 * S); ctx.lineTo(hx - 0.01 * S, hy + 0.028 * S); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx + 0.026 * S, hy + 0.028 * S); ctx.lineTo(hx + 0.017 * S, hy + 0.072 * S); ctx.lineTo(hx + 0.01 * S, hy + 0.028 * S); ctx.closePath(); ctx.fill();
    // a heavy brow ridge hooding the eyes
    ctx.fillStyle = css(skinDark);
    smoothClosed([[hx - 0.06 * S, hy - 0.014 * S], [hx - 0.044 * S, hy - 0.04 * S], [hx + 0.044 * S, hy - 0.04 * S], [hx + 0.06 * S, hy - 0.014 * S], [hx + 0.04 * S, hy + 0.003 * S], [hx, hy - 0.008 * S], [hx - 0.04 * S, hy + 0.003 * S]]);
    ctx.fill();
    // the two eyes — small, amber, slit-pupiled, fierce under the brow
    for (var e = -1; e <= 1; e += 2) {
      var ex = hx + e * 0.034 * S, ey = hy - 0.004 * S;
      ctx.fillStyle = "#120c07"; ctx.beginPath(); ctx.ellipse(ex, ey, 0.015 * S, 0.012 * S, e * 0.3, 0, TAU); ctx.fill();
      var eg = ctx.createRadialGradient(ex - 0.003 * S, ey - 0.003 * S, 0, ex, ey, 0.011 * S);
      eg.addColorStop(0, "#ffce5a"); eg.addColorStop(0.6, "#e0840f"); eg.addColorStop(1, "#8a3e08");
      ctx.fillStyle = eg; ctx.beginPath(); ctx.ellipse(ex, ey, 0.0098 * S, 0.0085 * S, e * 0.3, 0, TAU); ctx.fill();
      ctx.fillStyle = "#0c0704"; ctx.beginPath(); ctx.ellipse(ex, ey, 0.0026 * S, 0.0082 * S, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,250,235,0.85)"; ctx.beginPath(); ctx.arc(ex - 0.003 * S, ey - 0.004 * S, 0.0022 * S, 0, TAU); ctx.fill();
    }

    // =========================================================================
    //  atmosphere — vignette
    // =========================================================================
    var vig = ctx.createRadialGradient(cxp, baseY - 0.3 * S, 0.3 * S, cxp, baseY - 0.2 * S, 0.8 * S);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(14,8,4,0.5)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);
  }
});
