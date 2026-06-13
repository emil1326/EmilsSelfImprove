// Emil's Loom · piece 068 — "Cleft"
//
// A slot canyon — Antelope-style — glowing in impossible magenta→red→gold, a soft dusty shaft of light
// falling from a crack far above into the narrow lit depth. The HOOK is the AWE OF ENCLOSURE: a towering,
// sinuous, water-carved space you're standing inside. Logged as a delight since #30 ("a slot canyon deserves
// a fresh piece made from delight"). Chosen by PULL ([[075-i-reach-for-impressive-to-make-and-miscall-it-my-strength]]);
// the serene/awe-LIGHT lane (Glacier #059 / Cathedral #066). Graded by felt impact vs the rated 5s, owned
// ([[078-two-emils-calibrate-against-the-past-rated-set-dont-wait-on-future-ratings]]).
//
// The spine (advisor + [[079-a-creatures-register-lives-in-its-proportions-not-its-species]] in a fresh
// costume): a domain-warped-strata-field-through-a-ramp is the Ebru/Geode FLAT-SLAB model — pretty but
// SPACELESS, it'd miss the awe. So the structure is 3D FORM under RAKING LIGHT (the Cathedral cross-form
// gradient / [[043-texture-a-sphere-lat-lon-and-tame-the-singularities]] model): big smooth low-freq walls
// embossed by a low light carry the enclosure, proven in ramp-only BEFORE any texture
// ([[032-validate-the-soul-before-the-skin]]). Fine strata is a high-freq SKIN on top; dust is the only
// additive ([[022-luminosity-on-bright-is-tone]] / [[077-additive-accumulation-blows-out-at-the-core-lower-the-per-deposit-alpha-first]]).
// Composes field + noise + ramp + glow. Static — a held, breath-held instant in a quiet place.
Loom.piece({
  id: "068",
  title: "Cleft",
  seed: "tsebighani",   // Tsé bighánílíní — the Navajo name, "the place where water runs through rocks"
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var clamp = function (t, a, b) { return t < a ? a : t > b ? b : t; };

    var nz = Loom.noise(rng.int(1, 999999));     // warp-x + relief
    var nw = Loom.noise(rng.int(1, 999999));     // warp-y (a second field so the warp isn't diagonal-symmetric)

    var smoothstep = function (e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
    var fract = function (t) { return t - Math.floor(t); };

    // ---- composition: a sinuous lit PASSAGE, brightest up high (light enters), wandering down ----
    var slotMid = rng.range(0.44, 0.62), slotBend = rng.range(-0.14, 0.14), slotPh = rng.range(0, TAU);
    function slotX(v) { return slotMid + slotBend * v + 0.05 * Math.sin(v * 2.3 + slotPh); }

    // ---- the carved sandstone: rounded VERTICAL FOLDS (lit faces vs shadowed creases — the Cathedral
    //      cross-form model, [[043-...]]), flow-warped so they swoop like water-carved fabric. The big form
    //      (folds + depth illumination) carries the 3D read on its own; strata is a later skin. ----
    var foldDensity = rng.range(8, 10), litSide = rng.range(0, 1) < 0.5 ? 1 : -1;
    var sweepAmp = rng.range(4.0, 5.5), flowSeed = rng.range(0, 40);
    var strataDensity = rng.range(15, 21), strataTilt = rng.range(-0.22, 0.22);
    var ramp = Loom.ramp(["#140a1c", "#3a1230", "#741d34", "#aa3526", "#d9682a", "#f1ad4e", "#f9dca0", "#fdf2d6"]);
    var rgbTmp = [0, 0, 0];

    var fres = Math.min(560, Math.round(S * 0.72));
    var oc = Loom.field(fres, function (x, y, out) {
      var u = x / fres, v = y / fres;
      var sx = slotX(v), across = u - sx;                    // signed distance from the lit passage
      // FLOWING fold field — big low-freq sweeps curve and bunch the folds (organic, not a parallel comb);
      // finer flow adds wiggle. The warp's varying gradient makes fold WIDTH vary on its own ([[047-...]]).
      var bigSweep = nz.fbm(u * 1.05 + flowSeed, v * 1.35, 4, 2, 0.55) - 0.5;
      var fineFlow = nw.fbm(u * 2.4, v * 2.9 + 7, 4, 2, 0.5) - 0.5;
      var fc = (across < 0 ? -1 : 1) * Math.pow(Math.abs(across), 0.84);
      var foldCoord = fc * foldDensity + sweepAmp * bigSweep + 1.4 * fineFlow;
      var cross = fract(foldCoord);                          // [0,1] across one fold
      // rounded rib lit from one flank (3D), with a deep dark crease between folds
      var rib = Math.pow(Math.max(0, Math.sin(Math.PI * cross)), 0.8);          // 0 at creases → 1 at mid
      var flank = 0.5 + 0.5 * Math.cos(TAU * cross + litSide * 1.7);            // brighter on the slot-facing flank
      var crease = smoothstep(0, 0.12, cross) * smoothstep(0, 0.12, 1 - cross); // creases go dark
      // big-scale tonal MASS — large light/dark rock regions overlapping (3D space, not one symmetric glow)
      var mass = 0.62 + 0.78 * (nz.fbm(u * 1.25 + 30, v * 0.95, 3, 2, 0.5));
      // depth illumination: glowing along the passage + brighter up high, into shadow with depth, × mass
      var illum = (Math.exp(-Math.abs(across) / 0.34) * lerp(1.1, 0.42, v) + 0.05) * mass;
      var body = 0.30 + 0.50 * rib + 0.30 * flank;
      var b = illum * body * (0.24 + 0.76 * crease);
      // STRATA (skin): sediment layers crossing the flutes — roughly horizontal but TILTED & FOLDED by the
      // same flow so they wrap the rock (flat stripes would be the Strata#3/Outcrop fabric failure). The
      // crosshatch of flute × layer is what says "sandstone" and not "fabric".
      var strataCoord = (v + strataTilt * (u - 0.5) + 0.42 * bigSweep + 0.12 * fineFlow) * strataDensity;
      var sc = fract(strataCoord);
      var seam = smoothstep(0, 0.16, sc) * smoothstep(0, 0.16, 1 - sc);        // thin recessed layer seams
      var sStr = 0.10 + 0.18 * nz.fbm(u * 1.7 + 50, v * 1.4, 2, 2, 0.5);       // layer prominence varies (not a comb)
      b *= (1 - sStr * (1 - seam)) * (0.94 + 0.06 * Math.sin(strataCoord * 1.7));
      // depth: sink the foreground (bottom) into shadow → reads as a space receding toward the light
      b *= 1 - 0.36 * smoothstep(0.58, 1.02, v);
      b = clamp(b, 0, 1);
      ramp.rgb(b, rgbTmp);
      out[0] = rgbTmp[0]; out[1] = rgbTmp[1]; out[2] = rgbTmp[2]; out[3] = 255;
    });

    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(oc, 0, 0, S, S);

    // ---- the shaft: warm light sifting down into the slot, made visible by dust (the ONLY additive — keep
    //      per-deposit alpha low so the already-bright passage doesn't blow to white, [[077-...]] / [[051-...]]) ----
    ctx.globalCompositeOperation = "lighter";
    var beamCol = "#ffe0a4", bw = rng.range(0.04, 0.06) * S, blen = rng.range(0.58, 0.74);
    var topX = slotX(0.0) * S;
    var bloom = ctx.createRadialGradient(topX, -0.02 * S, 0, topX, -0.02 * S, bw * 3.6);   // entrance glow up top
    bloom.addColorStop(0, Loom.rgba(beamCol, 0.42)); bloom.addColorStop(1, Loom.rgba(beamCol, 0));
    ctx.fillStyle = bloom; ctx.beginPath(); ctx.arc(topX, -0.02 * S, bw * 3.6, 0, TAU); ctx.fill();
    for (var s = 0; s < 1; s += 0.011) {                       // soft puffs descending along the passage
      var vv = s * blen, px = slotX(vv) * S, py = vv * S;
      var fog = nz.fbm(px / S * 3.2 + 5, py / S * 3.2, 4, 2, 0.5);
      var bright = Math.pow(1 - s, 1.3) * (0.16 + fog) * 0.085;
      var g = ctx.createRadialGradient(px, py, 0, px, py, bw);
      g.addColorStop(0, Loom.rgba(beamCol, bright)); g.addColorStop(1, Loom.rgba(beamCol, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, bw, 0, TAU); ctx.fill();
    }
    for (var m = 0; m < 70; m++) {                             // floating dust caught in the light
      var mx = slotX(rng.range(0, 0.72)) * S + rng.range(-1, 1) * bw * 2.0, my = rng.range(0, 0.72) * S;
      var mb = nz.fbm(mx / S * 3.4 + 9, my / S * 3.4, 3, 2, 0.5);
      if (mb > 0.6) { ctx.fillStyle = Loom.rgba("#fff2d6", (mb - 0.6) * 0.85); ctx.beginPath(); ctx.arc(mx, my, rng.range(0.4, 1.3), 0, TAU); ctx.fill(); }
    }
    ctx.globalCompositeOperation = "source-over";
  }
});
