// Emil's Loom · piece 049 — "Totality"
//
// The two minutes the world goes quiet: a total solar eclipse at totality. The moon a perfect black disc,
// and around it the SUN'S CORONA blazing into the dark — that pearly, wispy crown of plasma you can only
// ever see when the disk is covered. Pink prominences flare at the limb, a 360° sunset glows all round the
// horizon (you're standing in a hundred-mile shadow, seeing daylight beyond it), the bright stars come out
// at midday. The HOOK ([[035-defining-feature-is-often-the-hard-part]] / [[055...]]'s "every 5 has a hook"):
// the corona itself — get its wispy, radial, asymmetric STRUCTURE right and it's an eclipse; a smooth ring
// and it's just a black dot. Reached for the awe a "solid" stag (#048) didn't have.
//
// Cosmic register (the galaxy/sun/black-hole family) but DELIBERATELY not the black hole: that's a flat
// accretion disk in empty space; this is a wispy radial corona in a TWILIGHT SKY OVER EARTH, with
// prominences, a diamond ring, a horizon and a land. The corona is a per-pixel radial field — angular
// noise carved into streamers, fading outward — rendered through lib/field.js (#16, dogfooding the new
// primitive), drawn ADDITIVELY ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]] /
// [[051-stacking-additive-glows-desaturates-to-white]]); the black moon is laid SOURCE-OVER on top to
// occlude it cleanly ([[056-additive-light-cant-be-darkened-occlude-on-top]]). Diamond-ring + corona
// character + sky seed-varied, judged across seeds ([[058-random-features-form-accidental-faces-check-many-seeds]]).
// Composes field (#16) + glow (#8) + noise (#3) + palette. Static — a held instant.
Loom.piece({
  id: "049",
  title: "Totality",
  seed: "syzygy",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- sky mood (seed-varied twilight) ----
    var moods = {
      blue: { top: "#070a14", mid: "#162038", set: "#caa07a", setHi: "#e6c49a", star: "#dfe6f4" },
      violet: { top: "#0a0816", mid: "#241a3a", set: "#c890a4", setHi: "#e8b6c0", star: "#e8e0f4" },
      steel: { top: "#080c12", mid: "#1c2a38", set: "#b0a890", setHi: "#dcd2b6", star: "#e0eaf0" }
    };
    var M = moods[rng.pick(["blue", "blue", "violet", "steel"])];
    var coronaCol = [232, 236, 246];                            // pearly silver-white
    var promCol = "#ff7a6e", chromo = "#ff9a86";                 // chromosphere + prominences (pink-red)

    var cx = S * (0.5 + rng.range(-0.05, 0.05)), cy = S * (0.4 + rng.range(-0.03, 0.03));
    var moonR = S * rng.range(0.115, 0.135);
    var horizon = S * rng.range(0.76, 0.82);
    var diamond = rng.bool(0.55), diaAng = rng.range(0, TAU);    // the diamond-ring moment, or full totality

    // ---- the twilight sky + a 360° horizon sunset + stars ----
    var sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, M.top); sky.addColorStop(0.6, M.top); sky.addColorStop(1, M.mid);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);
    // the eerie ring of daylight all round the horizon
    var set = ctx.createLinearGradient(0, horizon - S * 0.16, 0, horizon + S * 0.02);
    set.addColorStop(0, Loom.rgba(M.set, 0)); set.addColorStop(0.7, Loom.rgba(M.set, 0.5)); set.addColorStop(1, Loom.rgba(M.setHi, 0.85));
    ctx.fillStyle = set; ctx.fillRect(0, horizon - S * 0.16, S, S * 0.18);
    // bright stars + a planet, come out at midday
    for (var s = 0, ns = Math.round(50 * U); s < ns; s++) {
      var sx = rng.range(0, 1) * S, sy = rng.range(0, 1) * horizon;
      if (Math.hypot(sx - cx, sy - cy) < moonR * 2.4) continue;  // none lost in the corona
      var br = rng.range(0.1, 0.7), sr = rng.range(0.4, 1.3) * U * (1 + br);
      ctx.fillStyle = Loom.rgba(M.star, br * (1 - sy / S * 0.4));
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
    }

    // ---- the CORONA: a radial streamer field, rendered numerically then drawn additively (lib/field.js #16) ----
    var FW = Math.round(S * 0.7), sc = S / FW;
    var corona = Loom.field(FW, function (x, y, out) {
      var X = x * sc, Y = y * sc, dx = X - cx, dy = Y - cy, r = Math.sqrt(dx * dx + dy * dy), rn = r / moonR;
      if (rn < 1.0) { out[3] = 0; return; }                     // inside the moon → transparent (the disc occludes)
      var ang = Math.atan2(dy, dx), ca = Math.cos(ang), sa = Math.sin(ang);
      var streak = nz.fbm(ca * 4.2 + 10, sa * 4.2 + 10 + rn * 0.12, 4, 2.1, 0.6);
      streak = clamp((streak - 0.34) * 1.9, 0, 1);              // ridge → bright streamers + dark lanes between
      var big = 0.45 + 0.55 * nz.fbm(ca * 1.5 + 3, sa * 1.5 + 3, 2, 2, 0.5);  // a few broad petals
      var fall = Math.pow(clamp(1 / rn, 0, 1), 1.55);           // fades with radius
      var inner = Math.exp(-(rn - 1) * 5.5) * 1.35;            // the blazing inner ring at the limb
      var b = clamp(fall * (0.22 + streak * big * 1.55) + inner, 0, 1.7);
      var v = b * 168;
      out[0] = clamp(v * (coronaCol[0] / 255), 0, 255); out[1] = clamp(v * (coronaCol[1] / 255), 0, 255); out[2] = clamp(v * (coronaCol[2] / 255), 0, 255);
      out[3] = 255;
    });
    ctx.globalCompositeOperation = "lighter";
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(corona, 0, 0, S, S);
    ctx.globalCompositeOperation = "source-over";

    // ---- the black moon disc (occludes the corona's inner edge cleanly) ----
    ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.arc(cx, cy, moonR, 0, TAU); ctx.fill();

    // ---- the chromosphere: a thin pink-red ring just past the limb + a few prominences flaring off it ----
    ctx.globalCompositeOperation = "lighter";
    var chr = ctx.createRadialGradient(cx, cy, moonR * 0.96, cx, cy, moonR * 1.06);
    chr.addColorStop(0, "rgba(0,0,0,0)"); chr.addColorStop(0.7, "rgba(0,0,0,0)"); chr.addColorStop(0.86, Loom.rgba(chromo, 0.5)); chr.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = chr; ctx.beginPath(); ctx.arc(cx, cy, moonR * 1.06, 0, TAU); ctx.fill();
    for (var p = 0, np = rng.int(2, 4); p < np; p++) {           // prominences (loops of pink plasma at the edge)
      var pa = rng.range(0, TAU), pex = cx + Math.cos(pa) * moonR, pey = cy + Math.sin(pa) * moonR;
      Loom.glow(ctx, pex, pey, moonR * rng.range(0.12, 0.22), promCol, 0.5, 0.5);
      Loom.glow(ctx, pex, pey, moonR * 0.06, "#ffd0c0", 0.7, 0.5);
    }

    // ---- the diamond ring: a single brilliant bead of sun at the limb (the moment around totality) ----
    if (diamond) {
      var dx2 = cx + Math.cos(diaAng) * moonR, dy2 = cy + Math.sin(diaAng) * moonR;
      Loom.glow(ctx, dx2, dy2, moonR * 1.1, "#fff6e6", 0.5, 0.55);
      Loom.glow(ctx, dx2, dy2, moonR * 0.34, "#ffffff", 0.95, 0.5);
      ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 1.4 * U; ctx.lineCap = "round";  // a 4-point star flare
      for (var k = 0; k < 4; k++) {
        var fa = k / 4 * TAU + 0.2, fl = moonR * (k % 2 ? 0.9 : 1.5);
        ctx.beginPath(); ctx.moveTo(dx2, dy2); ctx.lineTo(dx2 + Math.cos(fa) * fl, dy2 + Math.sin(fa) * fl); ctx.stroke();
      }
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(dx2, dy2, 3.5 * U, 0, TAU); ctx.fill();
    }
    // a soft overall corona bloom so the whole sun-region glows
    Loom.glow(ctx, cx, cy, moonR * 2.6, "#cdd6ea", 0.1, 0.6);
    ctx.globalCompositeOperation = "source-over";

    // ---- the dark land below: a silhouetted horizon + a couple of tiny watchers (scale + soul) ----
    ctx.fillStyle = "#05070b";
    ctx.beginPath(); ctx.moveTo(0, S);
    ctx.lineTo(0, horizon);
    for (var hx = 0; hx <= S; hx += 10 * U) ctx.lineTo(hx, horizon + (nz.fbm(hx * 0.003 + 40, 7, 3, 2, 0.5) - 0.5) * S * 0.04 - S * 0.01);
    ctx.lineTo(S, S); ctx.closePath(); ctx.fill();
    // two tiny figures watching from a rise (against the horizon glow)
    if (rng.bool(0.7)) {
      var fx = rng.range(0.2, 0.8) * S;
      for (var w = 0; w < 2; w++) {
        var wx = fx + w * 9 * U, wh = rng.range(11, 15) * U;
        ctx.fillStyle = "#04060a";
        ctx.fillRect(wx, horizon - wh, 3 * U, wh);
        ctx.beginPath(); ctx.arc(wx + 1.5 * U, horizon - wh, 2.4 * U, 0, TAU); ctx.fill();
      }
    }

    // ---- settle: a deep vignette pulling to night ----
    var vg = ctx.createRadialGradient(cx, cy, moonR * 1.5, cx, cy, S * 0.78);
    vg.addColorStop(0, "rgba(2,3,7,0)"); vg.addColorStop(1, "rgba(1,2,5,0.7)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
