// Emil's Loom · piece 048 — "Hart"
//
// A red-deer stag standing in the dawn mist — the monarch of the glen, antlers crowning against a pale
// gold sky, breath steaming in the cold, utterly still. The noble/majestic register the gallery never had
// (no large land mammal), and a deliberate TONE-ON-LIGHT palette break ([[022-luminosity-on-bright-is-tone]])
// after the pitch-black anglerfish — a dark stag reads by being *darker than the mist*, lifted by a thin
// warm dawn rim where the low sun catches its back and antlers.
//
// The HOOK is the antler crown ([[035-defining-feature-is-often-the-hard-part]]). Built SILHOUETTE-first
// and with the whale's lesson applied pre-emptively ([[061-when-attempts-fail-alike-the-bug-is-in-what-they-share]]):
// the read-bearing features (the antlers' upward-sweeping beams + forward tines, the muzzle, the maned
// neck) are built AS the silhouette from the first stroke, not bolted onto a blob. A higher-variance
// creature silhouette taken CONSCIOUSLY ([[062-field-subjects-are-lower-variance-than-silhouettes]]),
// de-risked by letting the GROUND MIST swallow the fiddly lower legs — atmosphere doing double duty.
// Antlers + pose + dawn mood seed-varied, judged across seeds ([[058-random-features-form-accidental-faces-check-many-seeds]]).
// Composes noise (#3, mist + fur) + glow (#8, the low sun) + palette helpers. Static. No new primitive.
Loom.piece({
  id: "048",
  title: "Hart",
  seed: "glen",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- dawn mood (seed-varied) ----
    var moods = {
      cold: { top: "#9fb0c0", mid: "#c4cdd2", low: "#e6ddca", sun: "#fbe6c0", stag: "#2a2a30", stagDk: "#16161c", rim: "#f0d49a", mist: "#d8dde0" },
      warm: { top: "#7a8298", mid: "#bcb6bc", low: "#f0cda0", sun: "#ffe2ac", stag: "#2e2722", stagDk: "#181310", rim: "#ffcf86", mist: "#ded6cc" },
      blue: { top: "#5e6e86", mid: "#8a9aae", low: "#c6c2c0", sun: "#dcd2cc", stag: "#22262e", stagDk: "#121419", rim: "#cdbfc4", mist: "#b8c2cc" }
    };
    var M = moods[rng.pick(["cold", "cold", "warm", "blue"])];
    var flip = rng.bool(0.5);
    if (flip) { ctx.save(); ctx.translate(S, 0); ctx.scale(-1, 1); }

    var horizon = S * rng.range(0.66, 0.72);                     // where the ground mist sits (swallows the legs)
    var sunX = S * rng.range(0.6, 0.78), sunY = horizon - S * rng.range(0.0, 0.08);

    // ---- dawn sky: a soft tonal wash, low warm sun ----
    var sky = ctx.createLinearGradient(0, 0, 0, horizon + S * 0.1);
    sky.addColorStop(0, M.top); sky.addColorStop(0.62, M.mid); sky.addColorStop(1, M.low);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "lighter";
    var sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, S * 0.5);
    sg.addColorStop(0, Loom.rgba(M.sun, 0.6)); sg.addColorStop(0.4, Loom.rgba(M.sun, 0.16)); sg.addColorStop(1, Loom.rgba(M.sun, 0));
    ctx.fillStyle = sg; ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "source-over";
    // faint receding tree-mist layers (atmospheric depth)
    for (var L = 0; L < 3; L++) {
      var ly = horizon - S * (0.12 - L * 0.04), a = 0.1 - L * 0.025;
      ctx.fillStyle = Loom.rgba("#5a6470", a);
      ctx.beginPath(); ctx.moveTo(0, ly + S * 0.1);
      for (var tx = 0; tx <= S; tx += 12 * U) ctx.lineTo(tx, ly + (nz.fbm(tx * 0.004 + L * 5, L, 2, 2, 0.5) - 0.5) * S * 0.05);
      ctx.lineTo(S, S); ctx.lineTo(0, S); ctx.closePath(); ctx.fill();
    }

    // ---- the stag — unit coords: x right, y down; faces LEFT (head upper-left), antlers crown up-back ----
    var u = S * rng.range(0.25, 0.27);
    var ox = S * rng.range(0.48, 0.54), oy = S * 0.55;
    function X(x) { return ox + x * u; }
    function Y(y) { return oy + y * u; }

    // the antler crown (THE hook) — a thick main beam sweeping UP and BACK over the neck, branched with tines
    function antler(px, py, back, wbase, dark) {
      // beam waypoints (relative units): from the poll, up and BACK (+x = back, since facing left); capped height
      var beam = [[0, 0], [0.06, -0.20], [0.16, -0.38], [0.30, -0.50], [0.46, -0.56]];
      ctx.strokeStyle = dark; ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (var i = 0; i < beam.length - 1; i++) {
        ctx.lineWidth = (wbase - i * (wbase - 3) / 4) * U;       // thick base → thin tip
        ctx.beginPath();
        ctx.moveTo(X(px + beam[i][0] * back), Y(py + beam[i][1]));
        ctx.lineTo(X(px + beam[i + 1][0] * back), Y(py + beam[i + 1][1]));
        ctx.stroke();
      }
      // tines [beam-index, forward-dx, up-dy] — brow (forward over the face), bez, trez, + a top crown; all point UP
      var tn = [[1, -0.26, -0.10], [2, -0.20, -0.24], [3, -0.04, -0.34], [3, 0.14, -0.30], [4, 0.02, -0.26], [4, 0.16, -0.18]];
      for (var t = 0; t < tn.length; t++) {
        var bi = tn[t][0], bx0 = px + beam[bi][0] * back, by0 = py + beam[bi][1];
        ctx.lineWidth = (wbase * 0.5 - bi * 0.5) * U;
        ctx.beginPath(); ctx.moveTo(X(bx0), Y(by0));
        ctx.quadraticCurveTo(X(bx0 + tn[t][1] * 0.4), Y(by0 + tn[t][2] * 0.5 - 0.06), X(bx0 + tn[t][1]), Y(by0 + tn[t][2]));
        ctx.stroke();
      }
    }
    // FAR antler first (behind the head, offset + less back-sweep so the rack spreads, dimmer), then body, then NEAR
    antler(-0.60, -0.93, 0.82, 11, M.stagDk);

    // body silhouette (no legs — drawn separately, fading into the mist)
    var body = new Path2D();
    body.moveTo(X(-0.44), Y(0.22));                              // brisket (front-lower chest)
    body.bezierCurveTo(X(-0.56), Y(-0.06), X(-0.66), Y(-0.42), X(-0.74), Y(-0.66));  // up the front of the neck (slimmer)
    body.bezierCurveTo(X(-0.8), Y(-0.74), X(-0.92), Y(-0.74), X(-1.05), Y(-0.72));   // throat → muzzle tip
    body.bezierCurveTo(X(-1.0), Y(-0.79), X(-0.9), Y(-0.84), X(-0.82), Y(-0.88));    // top of the muzzle → forehead
    body.bezierCurveTo(X(-0.78), Y(-0.91), X(-0.76), Y(-0.93), X(-0.72), Y(-0.92));  // up to the poll (antler base)
    body.bezierCurveTo(X(-0.69), Y(-0.86), X(-0.66), Y(-0.78), X(-0.62), Y(-0.7));   // nape (slim back-of-neck)
    body.bezierCurveTo(X(-0.54), Y(-0.5), X(-0.36), Y(-0.3), X(-0.16), Y(-0.18));    // crest down to the withers
    body.bezierCurveTo(X(0.2), Y(-0.2), X(0.55), Y(-0.18), X(0.8), Y(-0.1));         // along the level back to the rump
    body.bezierCurveTo(X(0.91), Y(0.04), X(0.87), Y(0.2), X(0.8), Y(0.28));          // down the haunch
    body.bezierCurveTo(X(0.52), Y(0.32), X(0.12), Y(0.32), X(-0.22), Y(0.3));        // under the belly (leaner)
    body.bezierCurveTo(X(-0.36), Y(0.28), X(-0.42), Y(0.26), X(-0.44), Y(0.22));     // back to the brisket
    body.closePath();

    // legs: slender tapering strokes from the body down past the horizon (the mist swallows the lower half)
    function leg(lx, ty, by2, bend, w, col) {
      ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(X(lx), Y(ty));
      ctx.quadraticCurveTo(X(lx + bend), Y((ty + by2) / 2), X(lx + bend * 0.4), Y(by2)); ctx.stroke();
    }
    leg(-0.30, 0.26, 0.92, 0.02, 6 * U, M.stagDk);   // front far
    leg(0.64, 0.26, 0.92, -0.06, 6 * U, M.stagDk);   // back far
    ctx.fillStyle = M.stag; ctx.fill(body);
    leg(-0.38, 0.3, 0.95, 0.0, 7 * U, M.stag);       // front near
    leg(0.56, 0.3, 0.95, -0.08, 7 * U, M.stag);      // back near (hock bend)

    // body form: a soft vertical shade (darker belly), clipped
    ctx.save(); ctx.clip(body);
    var form = ctx.createLinearGradient(0, Y(-0.95), 0, Y(0.42));
    form.addColorStop(0, Loom.rgba(M.rim, 0.16)); form.addColorStop(0.4, "rgba(0,0,0,0)"); form.addColorStop(1, Loom.rgba(M.stagDk, 0.55));
    ctx.fillStyle = form; ctx.fillRect(0, 0, S, S);
    // a few directional fur strokes + the shaggy neck mane (tonal, not literal hairs)
    ctx.strokeStyle = Loom.rgba(M.stagDk, 0.4); ctx.lineWidth = 1.4 * U;
    for (var f = 0, nf = Math.round(40 * U); f < nf; f++) {
      var fx = X(rng.range(-0.6, 0.8)), fy = Y(rng.range(-0.5, 0.36));
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + rng.range(2, 6) * U, fy + rng.range(3, 7) * U); ctx.stroke();
    }
    ctx.restore();

    // NEAR antler (in front of the head, fuller + thicker), ears, eye, muzzle
    antler(-0.72, -0.93, 1.05, 15, M.stag);
    // the near ear (behind the antler base, pointing back)
    ctx.fillStyle = M.stagDk;
    ctx.beginPath(); ctx.moveTo(X(-0.64), Y(-0.8)); ctx.quadraticCurveTo(X(-0.54), Y(-0.92), X(-0.47), Y(-0.84)); ctx.quadraticCurveTo(X(-0.57), Y(-0.78), X(-0.64), Y(-0.8)); ctx.fill();
    // a dark eye + a tiny dawn catch
    ctx.fillStyle = M.stagDk; ctx.beginPath(); ctx.arc(X(-0.86), Y(-0.82), 3 * U, 0, TAU); ctx.fill();
    ctx.fillStyle = Loom.rgba(M.rim, 0.7); ctx.beginPath(); ctx.arc(X(-0.866), Y(-0.826), 1 * U, 0, TAU); ctx.fill();
    // nostril hint
    ctx.fillStyle = M.stagDk; ctx.beginPath(); ctx.arc(X(-1.0), Y(-0.73), 2 * U, 0, TAU); ctx.fill();

    // ---- the warm dawn rim-light: the low sun catches the back, neck-crest, and antler edges ----
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = Loom.rgba(M.rim, 0.6); ctx.lineCap = "round"; ctx.lineWidth = 2.2 * U;
    ctx.beginPath();                                            // along the back + rump (sun-facing top edge)
    ctx.moveTo(X(-0.16), Y(-0.18));
    ctx.bezierCurveTo(X(0.2), Y(-0.2), X(0.55), Y(-0.18), X(0.8), Y(-0.1));
    ctx.bezierCurveTo(X(0.91), Y(0.04), X(0.87), Y(0.2), X(0.82), Y(0.26));
    ctx.stroke();
    ctx.lineWidth = 1.6 * U;                                    // the crest of the neck
    ctx.beginPath(); ctx.moveTo(X(-0.62), Y(-0.7)); ctx.bezierCurveTo(X(-0.54), Y(-0.5), X(-0.36), Y(-0.3), X(-0.16), Y(-0.18)); ctx.stroke();
    ctx.globalCompositeOperation = "source-over";

    // ---- ground mist: a soft band that swallows the legs and seats the stag ----
    ctx.globalCompositeOperation = "lighter";
    for (var m = 0, nm = Math.round(26 * U); m < nm; m++) {
      var mx = rng.range(-0.1, 1.1) * S, my = horizon + rng.range(-0.06, 0.14) * S, mw = rng.range(0.1, 0.32) * S;
      var mg = ctx.createRadialGradient(mx, my, 0, mx, my, mw);
      mg.addColorStop(0, Loom.rgba(M.mist, rng.range(0.06, 0.16))); mg.addColorStop(1, Loom.rgba(M.mist, 0));
      ctx.save(); ctx.translate(mx, my); ctx.scale(1, 0.34); ctx.translate(-mx, -my);
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mw, 0, TAU); ctx.fill(); ctx.restore();
    }
    // a denser mist floor below
    var gm = ctx.createLinearGradient(0, horizon - S * 0.05, 0, S);
    gm.addColorStop(0, Loom.rgba(M.mist, 0)); gm.addColorStop(0.5, Loom.rgba(M.mist, 0.5)); gm.addColorStop(1, Loom.rgba(M.mist, 0.8));
    ctx.fillStyle = gm; ctx.fillRect(0, horizon - S * 0.05, S, S - horizon + S * 0.05);
    ctx.globalCompositeOperation = "source-over";

    // ---- breath: a soft puff of steam from the muzzle (cold dawn) ----
    ctx.globalCompositeOperation = "lighter";
    for (var b = 0; b < Math.round(10 * U); b++) {
      var bd = b / 10, bx = X(-1.05) - bd * 0.12 * S + rng.range(-0.02, 0.02) * S, by = Y(-0.72) + bd * 0.03 * S + rng.range(-0.02, 0.02) * S;
      Loom.glow(ctx, bx, by, (0.02 + bd * 0.05) * S, M.mist, 0.18 * (1 - bd), 0.5);
    }
    ctx.globalCompositeOperation = "source-over";

    // ---- settle: drifting motes in the sun + a soft vignette ----
    ctx.globalCompositeOperation = "lighter";
    for (var d = 0, nd = Math.round(40 * U); d < nd; d++) {
      var dx = rng.range(0, 1) * S, dy = rng.range(0, 0.7) * S;
      var dl = clamp(1 - Math.hypot(dx - sunX, dy - sunY) / (S * 0.5), 0, 1);
      ctx.fillStyle = Loom.rgba(M.sun, dl * rng.range(0.1, 0.4));
      ctx.beginPath(); ctx.arc(dx, dy, rng.range(0.5, 1.6) * U, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(S * 0.5, S * 0.46, S * 0.3, S * 0.5, S * 0.5, S * 0.82);
    vg.addColorStop(0, "rgba(20,22,28,0)"); vg.addColorStop(1, "rgba(24,24,30,0.4)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);

    if (flip) ctx.restore();
  }
});
