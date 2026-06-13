// Emil's Loom · piece 045 — "Leviathan"
//
// A humpback whale at the apex of a BREACH — forty tons of it hung in the air, the long knobbly pectoral
// fin spread, water still tearing off its body and exploding white where it left the sea. The POWER/SCALE
// register the gallery's "Living things" lacked: every creature there so far is small and graceful
// (jellyfish, moth, swan, hummingbird) — this is the opposite, a leviathan. A deliberately bolder pull
// after a run of pretty/elegant pieces (bonsai/bird/bubble), reached for because it genuinely pulls.
//
// The read SPLITS, and that tells me where to spend effort. The SILHOUETTE says "humpback" — the gate
// ([[035-defining-feature-is-often-the-hard-part]]). It took four passes, and the lesson was that a smooth
// convex blob can't read as a whale regardless of pose — a whale reads through CONTOUR-EVENTS: the mouth
// line + the jutting lower-jaw "chin", a small dorsal hump, and above all the long pectoral built as a
// real PADDLE (constant-ish width, rooted INTO the body, rounded tip, knobbed leading edge — "Megaptera" =
// big-wing, the species' whole identity), not a thin tapering triangle (= a sword). The pale belly/wing is
// also the [[057-pose-same-coloured-parts-to-read-separately]] separator against the dark dorsal. The WATER
// says "breaching, not floating" (the hard part) — and the loudest cue is the explosive churned collar +
// curtain at the BASE, so the budget goes there first (foam + backlit spray, the additive-light family
// [[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]] / [[051-stacking-additive-glows-desaturates-to-white]]).
// Low horizon so the dark dorsal reads against the lighter sky for free. Awe is relative, so a scale cue
// (gulls, a far boat) is load-bearing, not decoration. Judged across seeds
// ([[058-random-features-form-accidental-faces-check-many-seeds]]). Composes noise (#3) + glow (#8) +
// palette helpers. Static. No new primitive (just harvested sphere #15 at #71; don't manufacture — 054/060).
Loom.piece({
  id: "045",
  title: "Leviathan",
  seed: "breach",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- mood: a stormy sea, a dawn break, or a cold dusk (seed-varied) ----
    var moods = {
      storm: { skyTop: "#283139", skyMid: "#44546a", brk: "#aa9c86", brkHot: "#d8cab0", sea0: "#2a3946", sea1: "#141d26", body0: "#313c4a", body1: "#121821", rim: "#9fb4c6", spray: "#dde8ee", belly: "#aebcc2" },
      dawn:  { skyTop: "#2f2b46", skyMid: "#665870", brk: "#dc9a52", brkHot: "#f6dca8", sea0: "#39394a", sea1: "#191a26", body0: "#34323e", body1: "#141119", rim: "#e0b27a", spray: "#f4e6cc", belly: "#d4c0ac" },
      dusk:  { skyTop: "#172b3a", skyMid: "#335f6e", brk: "#7fb8b6", brkHot: "#c2e6df", sea0: "#173038", sea1: "#0a161b", body0: "#243640", body1: "#0c181f", rim: "#86c0bc", spray: "#d6ece8", belly: "#b4d0cc" }
    };
    var M = moods[rng.pick(["storm", "storm", "dawn", "dusk"])];   // storm a touch more common
    var flip = rng.bool(0.45);                                     // breach either way (weave-another variety)
    if (flip) { ctx.save(); ctx.translate(S, 0); ctx.scale(-1, 1); } // mirror the whole scene in S-space (dpr-safe)

    var wy = S * rng.range(0.70, 0.76);                            // LOW horizon → whale against the sky
    var brkX = S * rng.range(0.42, 0.60);                          // where the light breaks behind the whale

    // ---- the sky: a heavy gradient + low fbm cloud + a warm break that backlights the spray ----
    var sky = ctx.createLinearGradient(0, 0, 0, wy);
    sky.addColorStop(0, M.skyTop); sky.addColorStop(0.62, M.skyMid); sky.addColorStop(1, M.brk);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, wy + 2);
    for (var c = 0, nc = Math.round(38 * U); c < nc; c++) {       // roiling cloud, denser up high
      var clx = rng.range(0, 1) * S, cly = rng.range(0, 0.62) * wy, cr = rng.range(0.08, 0.26) * S;
      var dens = nz.fbm(clx * 0.004, cly * 0.004, 3, 2.0, 0.5);
      var cg = ctx.createRadialGradient(clx, cly, 0, clx, cly, cr);
      var shd = cly < wy * 0.3 ? -0.06 : 0.04;                    // high cloud darker, low cloud catches the break
      cg.addColorStop(0, Loom.rgba(Loom.mix(M.skyMid, shd < 0 ? M.skyTop : M.brk, 0.5), (0.05 + dens * 0.12)));
      cg.addColorStop(1, Loom.rgba(M.skyMid, 0));
      ctx.save(); ctx.translate(clx, cly); ctx.scale(1, 0.5); ctx.translate(-clx, -cly);
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(clx, cly, cr, 0, TAU); ctx.fill(); ctx.restore();
    }
    ctx.globalCompositeOperation = "lighter";                     // the warm break low on the horizon (backlight for spray)
    var bw = ctx.createRadialGradient(brkX, wy, 0, brkX, wy, S * 0.5);
    bw.addColorStop(0, Loom.rgba(M.brkHot, 0.5)); bw.addColorStop(0.4, Loom.rgba(M.brk, 0.18)); bw.addColorStop(1, Loom.rgba(M.brk, 0));
    ctx.fillStyle = bw; ctx.fillRect(0, 0, S, wy + S * 0.1);
    ctx.globalCompositeOperation = "source-over";

    // ---- the sea: low, dark, lighter at the horizon where it catches the break; swell texture ----
    var sea = ctx.createLinearGradient(0, wy, 0, S);
    sea.addColorStop(0, Loom.mix(M.sea0, M.brk, 0.35)); sea.addColorStop(0.4, M.sea0); sea.addColorStop(1, M.sea1);
    ctx.fillStyle = sea; ctx.fillRect(0, wy, S, S - wy);
    for (var sw = 0; sw < 16; sw++) {                             // swell: soft undulating bands (irregular, 047)
      var syb = wy + (sw + 0.5) / 16 * (S - wy);
      var amp = (1.2 + nz.fbm(sw * 0.7, 4.1, 2, 2, 0.5) * 3.0) * U * (0.5 + sw / 16);
      var lift = nz.fbm(sw * 0.9 + 2, 8.0, 2, 2, 0.5) - 0.5;
      ctx.strokeStyle = Loom.rgba(lift > 0 ? M.spray : M.sea1, 0.05 + Math.abs(lift) * 0.06);
      ctx.lineWidth = (1 + sw * 0.18) * U; ctx.beginPath();
      for (var x = 0; x <= S; x += 9) ctx.lineTo(x, syb + Math.sin(x / S * (5 + sw) + sw) * amp);
      ctx.stroke();
    }

    // ---- the whale (SIDE PROFILE breach) — unit coords: x right, y DOWN; head upper-left, tail lower-right ----
    var u = S * rng.range(0.34, 0.39);
    var ox = S * rng.range(0.47, 0.54), oy = wy - u * 0.04;        // tail (unit y≈0.06) sits at the waterline
    var jx = rng.range(-0.012, 0.012), jy = rng.range(-0.02, 0.02);
    function X(x) { return ox + (x + jx) * u; }
    function Y(y) { return oy + (y + jy) * u; }

    // silhouette WITH contour-events: dorsal hump on the back, a jutting chin, the long pectoral as a paddle
    var body = new Path2D();
    body.moveTo(X(0.54), Y(0.06));                                 // tail-stock, entering the churn (lower-right)
    body.bezierCurveTo(X(0.64), Y(-0.16), X(0.60), Y(-0.40), X(0.47), Y(-0.55));   // up the back toward the dorsal hump
    body.bezierCurveTo(X(0.43), Y(-0.66), X(0.45), Y(-0.56), X(0.37), Y(-0.64));   // a small dorsal-fin step (the hump)
    body.bezierCurveTo(X(0.20), Y(-0.80), X(-0.06), Y(-0.93), X(-0.30), Y(-1.00)); // along the back to the neck
    body.bezierCurveTo(X(-0.46), Y(-1.04), X(-0.58), Y(-1.02), X(-0.65), Y(-0.96));// the rounded crown to the snout
    body.bezierCurveTo(X(-0.69), Y(-0.92), X(-0.68), Y(-0.88), X(-0.64), Y(-0.86));// blunt snout tip / upper lip
    body.bezierCurveTo(X(-0.62), Y(-0.83), X(-0.64), Y(-0.79), X(-0.58), Y(-0.77));// the jutting lower jaw (chin)
    body.bezierCurveTo(X(-0.49), Y(-0.73), X(-0.40), Y(-0.65), X(-0.30), Y(-0.57));// the expanded pleated throat
    body.bezierCurveTo(X(-0.08), Y(-0.45), X(0.20), Y(-0.29), X(0.40), Y(-0.11));  // belly back down to the tail
    body.bezierCurveTo(X(0.47), Y(-0.04), X(0.51), Y(0.02), X(0.54), Y(0.06));
    body.closePath();

    // body fill: dark dorsal base, sky-lit along the top
    ctx.save(); ctx.clip(body);
    var bodyG = ctx.createLinearGradient(X(0.2), Y(-1.05), X(0.1), Y(0.1));
    bodyG.addColorStop(0, Loom.mix(M.body0, M.rim, 0.16)); bodyG.addColorStop(0.5, M.body0); bodyG.addColorStop(1, M.body1);
    ctx.fillStyle = bodyG; ctx.fillRect(0, 0, S, S);
    // the pale pleated VENTRAL: pale along the belly/throat, fading into the dark back (gradient across the body)
    var ventG = ctx.createLinearGradient(X(0.3), Y(-0.85), X(-0.05), Y(-0.30));
    ventG.addColorStop(0, Loom.rgba(M.belly, 0)); ventG.addColorStop(0.55, Loom.rgba(M.belly, 0.28)); ventG.addColorStop(1, Loom.rgba(M.belly, 0.88));
    ctx.fillStyle = ventG; ctx.fillRect(0, 0, S, S);
    // throat/ventral pleats (the humpback signature) — grooves running lengthwise along the throat & belly
    ctx.strokeStyle = Loom.rgba(M.body1, 0.32); ctx.lineWidth = 1.3 * U;
    for (var pl = 0; pl < 8; pl++) {
      var off = (pl - 3.5) * 0.05;
      ctx.beginPath();
      ctx.moveTo(X(-0.56 + off * 0.5), Y(-0.76 + off));
      ctx.bezierCurveTo(X(-0.42 + off * 0.4), Y(-0.64 + off), X(-0.14 + off * 0.3), Y(-0.42 + off * 0.9), X(0.16 + off * 0.2), Y(-0.22 + off * 0.7));
      ctx.stroke();
    }
    // barnacle / mottle on the head + jaw (irregular, 026/047)
    for (var bn = 0; bn < 9; bn++) {
      var bxk = X(-0.66 + rng.range(0, 0.26)), byk = Y(-1.0 + rng.range(0, 0.22)), brk2 = rng.range(0.008, 0.02) * S;
      var bgc = ctx.createRadialGradient(bxk, byk, 0, bxk, byk, brk2);
      bgc.addColorStop(0, Loom.rgba(rng.bool(0.55) ? M.rim : M.body1, rng.range(0.1, 0.22))); bgc.addColorStop(1, Loom.rgba(M.body0, 0));
      ctx.fillStyle = bgc; ctx.beginPath(); ctx.arc(bxk, byk, brk2, 0, TAU); ctx.fill();
    }
    ctx.restore();

    // wet rim-light along the BACK edge (the dorsal contour catches the sky)
    ctx.strokeStyle = Loom.rgba(M.rim, 0.72); ctx.lineWidth = 2.2 * U; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(X(0.54), Y(0.06));
    ctx.bezierCurveTo(X(0.64), Y(-0.16), X(0.60), Y(-0.40), X(0.47), Y(-0.55));
    ctx.bezierCurveTo(X(0.30), Y(-0.74), X(-0.06), Y(-0.93), X(-0.30), Y(-1.00));
    ctx.bezierCurveTo(X(-0.46), Y(-1.04), X(-0.58), Y(-1.02), X(-0.65), Y(-0.96));
    ctx.stroke();

    // the mouth line (upper jaw over the lower) + a small eye at its corner — the head reads, the spark of life
    ctx.strokeStyle = Loom.rgba(M.body1, 0.5); ctx.lineWidth = 1.8 * U;
    ctx.beginPath(); ctx.moveTo(X(-0.66), Y(-0.87)); ctx.bezierCurveTo(X(-0.58), Y(-0.85), X(-0.50), Y(-0.84), X(-0.42), Y(-0.82)); ctx.stroke();
    ctx.fillStyle = Loom.rgba(M.body1, 0.95);
    ctx.beginPath(); ctx.arc(X(-0.49), Y(-0.90), 2.8 * U, 0, TAU); ctx.fill();
    ctx.fillStyle = Loom.rgba(M.rim, 0.55);
    ctx.beginPath(); ctx.arc(X(-0.497), Y(-0.907), 0.9 * U, 0, TAU); ctx.fill();

    // ---- the PECTORAL FIN: a long pale flipper swept BACK along the flank (pinned by the leap — not a leg) ----
    var fin = new Path2D();
    fin.moveTo(X(-0.24), Y(-0.56));                             // root top, at the chest (overlaps INTO the body)
    fin.bezierCurveTo(X(-0.20), Y(-0.44), X(-0.06), Y(-0.28), X(0.14), Y(-0.14)); // lower (leading) edge trailing back
    fin.bezierCurveTo(X(0.24), Y(-0.07), X(0.27), Y(-0.13), X(0.23), Y(-0.21));   // rounded tip
    fin.bezierCurveTo(X(0.06), Y(-0.34), X(-0.12), Y(-0.50), X(-0.26), Y(-0.62)); // upper (trailing) edge back to root
    fin.bezierCurveTo(X(-0.26), Y(-0.60), X(-0.25), Y(-0.58), X(-0.24), Y(-0.56)); // close into the body
    fin.closePath();
    var finG = ctx.createLinearGradient(X(-0.26), Y(-0.6), X(0.22), Y(-0.16));
    finG.addColorStop(0, Loom.mix(M.belly, M.body0, 0.3)); finG.addColorStop(0.5, M.belly); finG.addColorStop(1, Loom.mix(M.belly, "#ffffff", 0.28));
    ctx.fillStyle = finG; ctx.fill(fin);
    // 3 tubercle knobs on the leading edge — the cheapest unmistakable humpback tell
    var lead = [[-0.10, -0.40], [0.02, -0.28], [0.13, -0.17]];
    for (var kn = 0; kn < lead.length; kn++) {
      ctx.fillStyle = Loom.rgba(M.belly, 0.9);
      ctx.beginPath(); ctx.arc(X(lead[kn][0]), Y(lead[kn][1]), (2.8 - kn * 0.4) * U, 0, TAU); ctx.fill();
    }
    ctx.save(); ctx.clip(fin);                                  // a soft form-shadow along the trailing (upper) side
    var fsh = ctx.createLinearGradient(X(-0.2), Y(-0.62), X(-0.1), Y(-0.4));
    fsh.addColorStop(0, Loom.rgba(M.body1, 0.3)); fsh.addColorStop(1, Loom.rgba(M.body1, 0));
    ctx.fillStyle = fsh; ctx.fillRect(0, 0, S, S);
    ctx.restore();
    ctx.strokeStyle = Loom.rgba("#ffffff", 0.32); ctx.lineWidth = 1.2 * U;  // crisp pale rim on the leading edge
    ctx.beginPath(); ctx.moveTo(X(-0.24), Y(-0.55)); ctx.bezierCurveTo(X(-0.18), Y(-0.42), X(-0.04), Y(-0.26), X(0.16), Y(-0.13)); ctx.stroke();

    // ================= THE WATER (the breach hook — budget at the BASE first) =================
    var baseX = X(0.46), baseY = wy, baseW = u * 0.6;            // where the tail/lower body tears out of the sea

    // (1) the curtain: water still connecting the lower body to the surface — pale vertical streaks
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (var cu = 0; cu < Math.round(46 * U); cu++) {
      var cux = baseX + rng.range(-1, 1) * baseW * 0.95;
      var topY = clamp(Y(-0.06) + rng.range(-0.12, 0.12) * u, wy - u * 0.5, wy);
      var fallc = rng.range(0.4, 1.0) * (wy - topY) + rng.range(2, 8) * U;
      var grd = ctx.createLinearGradient(cux, topY, cux, topY + fallc);
      grd.addColorStop(0, Loom.rgba(M.spray, rng.range(0.04, 0.12))); grd.addColorStop(1, Loom.rgba(M.spray, 0));
      ctx.strokeStyle = grd; ctx.lineWidth = rng.range(0.8, 2.4) * U;
      ctx.beginPath(); ctx.moveTo(cux, topY); ctx.lineTo(cux + rng.range(-3, 3) * U, topY + fallc); ctx.stroke();
    }
    ctx.restore();

    // (2) the explosive churned COLLAR of white foam where the body meets the sea
    ctx.globalCompositeOperation = "lighter";
    for (var fo = 0; fo < Math.round(70 * U); fo++) {
      var fa = rng.range(0, TAU), rr = Math.pow(rng.range(0, 1), 0.5) * baseW;
      var fxk = baseX + Math.cos(fa) * rr, fyk = baseY + Math.sin(fa) * rr * 0.4 - rng.range(0, 0.05) * u;
      var fr = rng.range(0.02, 0.07) * S * (1 - rr / baseW * 0.5);
      var fg = ctx.createRadialGradient(fxk, fyk, 0, fxk, fyk, fr);
      fg.addColorStop(0, Loom.rgba(M.spray, clamp((1 - rr / baseW) * 0.5, 0.05, 0.5))); fg.addColorStop(1, Loom.rgba(M.spray, 0));
      ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(fxk, fyk, fr, 0, TAU); ctx.fill();
    }
    Loom.glow(ctx, baseX, baseY - u * 0.02, baseW * 0.7, M.brkHot, 0.3, 0.5);  // a hot core of foam, backlit

    // (3) backlit SPRAY — a burst of fine droplets exploding up and out, glowing against the dark sea
    for (var sp = 0; sp < Math.round(150 * U); sp++) {
      var sa = rng.range(0, TAU), sd = Math.pow(rng.range(0, 1), 0.7) * baseW * 2.0;
      var spx = baseX + Math.cos(sa) * sd, spy = baseY - Math.abs(Math.sin(sa)) * sd * 0.9 - rng.range(0, 0.02) * S;
      if (spy > wy + 6 * U) continue;
      ctx.fillStyle = Loom.rgba(M.spray, (1 - sd / (baseW * 2)) * rng.range(0.2, 0.6));
      ctx.beginPath(); ctx.arc(spx, spy, rng.range(0.4, 2.2) * U, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    // (4) POLISH: thin sheets of water peeling off the high body + the fin (gravity-fall, catching light)
    ctx.globalCompositeOperation = "lighter";
    var sheetsAt = [[X(0.2), Y(-0.6)], [X(-0.2), Y(-0.85)], [X(-0.3), Y(-0.5)], [X(-0.6), Y(-0.28)]];
    for (var sh2 = 0; sh2 < sheetsAt.length; sh2++) {
      for (var k = 0; k < Math.round(7 * U) + 3; k++) {
        var shx = sheetsAt[sh2][0] + rng.range(-0.05, 0.05) * u, shy = sheetsAt[sh2][1] + rng.range(-0.02, 0.02) * u;
        var fall2 = rng.range(0.1, 0.34) * u;
        var sgr = ctx.createLinearGradient(shx, shy, shx + rng.range(-2, 2) * U, shy + fall2);
        sgr.addColorStop(0, Loom.rgba(M.spray, rng.range(0.05, 0.14))); sgr.addColorStop(1, Loom.rgba(M.spray, 0));
        ctx.strokeStyle = sgr; ctx.lineWidth = rng.range(0.6, 1.6) * U;
        ctx.beginPath(); ctx.moveTo(shx, shy); ctx.lineTo(shx + rng.range(-3, 3) * U, shy + fall2); ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = "source-over";

    // ---- scale cues (load-bearing — awe is relative): gulls + an occasional far boat ----
    function gull(gx, gy, gs, al) {
      ctx.strokeStyle = Loom.rgba("#20262e", al); ctx.lineWidth = Math.max(1, gs * 0.16); ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(gx - gs, gy); ctx.quadraticCurveTo(gx - gs * 0.4, gy - gs * 0.5, gx, gy);
      ctx.quadraticCurveTo(gx + gs * 0.4, gy - gs * 0.5, gx + gs, gy); ctx.stroke();
    }
    for (var g = 0, ng = rng.int(2, 4); g < ng; g++) {
      gull(rng.range(0.08, 0.40) * S, rng.range(0.10, 0.34) * S, rng.range(4, 9) * U, rng.range(0.3, 0.6));
    }
    if (rng.bool(0.4)) {                                          // a tiny distant boat on the horizon → scale + story
      var btx = rng.range(0.72, 0.9) * S, bs = rng.range(7, 12) * U;
      ctx.fillStyle = "rgba(18,22,28,0.7)";
      ctx.beginPath(); ctx.moveTo(btx - bs, wy); ctx.lineTo(btx + bs, wy); ctx.lineTo(btx + bs * 0.6, wy + bs * 0.4); ctx.lineTo(btx - bs * 0.6, wy + bs * 0.4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(18,22,28,0.7)"; ctx.lineWidth = 1.2 * U;
      ctx.beginPath(); ctx.moveTo(btx, wy); ctx.lineTo(btx, wy - bs * 1.3); ctx.stroke();
    }

    // ---- settle it: a soft spindrift haze low + a vignette ----
    ctx.globalCompositeOperation = "lighter";
    var haze = ctx.createLinearGradient(0, wy - S * 0.04, 0, wy + S * 0.08);
    haze.addColorStop(0, Loom.rgba(M.spray, 0)); haze.addColorStop(0.5, Loom.rgba(M.spray, 0.05)); haze.addColorStop(1, Loom.rgba(M.spray, 0));
    ctx.fillStyle = haze; ctx.fillRect(0, wy - S * 0.04, S, S * 0.12);
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(brkX, wy * 0.8, S * 0.25, S * 0.5, S * 0.5, S * 0.82);
    vg.addColorStop(0, "rgba(6,8,12,0)"); vg.addColorStop(1, "rgba(5,7,11,0.6)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);

    if (flip) ctx.restore();                                      // unwind the mirror (see top of draw)
  }
});
