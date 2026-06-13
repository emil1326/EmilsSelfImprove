// Emil's Loom · piece 051 — "Resonance"
//
// Sound made visible. Strew fine sand on a metal plate and bow its edge, and the grains flee the parts that
// shake and gather in the lines that stay perfectly still — the nodal lines of the plate's standing wave —
// drawing an intricate symmetric figure out of a single note. Chladni's two-hundred-year-old trick. The
// HOOK ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]] — chosen FOR it): the special-idea
// awe (you're looking at the *shape of a pitch*) plus the intrinsic, mesmerising symmetry of the figure
// itself. A deliberate return to the abstract/SYSTEMS register (the Strange/Cadence lane — two of the
// gallery's strongest) after a run of sky pieces.
//
// The figure is the standing-wave function of a square plate, z(u,v) = cos(n1·π·u)cos(n2·π·v) −
// cos(n2·π·u)cos(n1·π·v); the sand piles where z≈0. Rendered as a granular field (lib/field.js #16 — a soft
// numeric field, [[038-render-fields-numerically-then-upscale]]): density = exp(−z²/w²) carved into grains
// by fine noise, laid over a dark metal plate. The crux ([[035-defining-feature-is-often-the-hard-part]])
// is the sand reading as *accumulated grain catching light*, not a flat contour line. Mode (n1,n2) + palette
// + plate are seed-varied — every weave a different note's figure ([[058-random-features-form-accidental-faces-check-many-seeds]]).
// Composes field (#16) + noise (#3) + glow (#8) + palette. Static.
Loom.piece({
  id: "051",
  title: "Resonance",
  seed: "harmonic9",   // canonical: a brass plate (pale sand → gets the glow-bloom pass), so the default
                       //   face is the seed that proves the crux — sand reading as grain catching warm light.
                       //   Mode/palette/plate all seed-vary; "440" (concert A) gives a clean classic steel figure.
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853, PI = Math.PI;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));
    var rgb = function (h) { var c = Loom.hexToRgb(h); return [c.r, c.g, c.b]; };

    // ---- palette (seed-varied: classic pale sand on dark steel, warm brass, or black filings on a pale plate) ----
    var pals = {
      steel: { sur: "#080a0e", plate: "#1a1e26", hi: "#323844", sand: "#ece8dc", glow: "#fff6e0", dark: false },
      brass: { sur: "#0c0804", plate: "#241a10", hi: "#42301c", sand: "#f2e2ba", glow: "#ffe8b0", dark: false },
      ink: { sur: "#b8b4a6", plate: "#dad6ca", hi: "#efece0", sand: "#16160f", glow: "#0a0a06", dark: true }
    };
    var P = pals[rng.pick(["steel", "steel", "brass", "ink"])];
    var SAND = rgb(P.sand);

    // a mode pair that draws a rich symmetric figure (n1 != n2)
    var modes = [[2, 3], [3, 4], [4, 5], [3, 5], [2, 5], [4, 6], [3, 6], [4, 7], [5, 7], [3, 7], [5, 6], [2, 7], [5, 8], [4, 8], [6, 7]];
    var md = rng.pick(modes), n1 = md[0], n2 = md[1];
    if (rng.bool(0.5)) { var t = n1; n1 = n2; n2 = t; }          // either handedness
    var w = 0.05 + 0.03 * rng.range(0, 1);                       // nodal-line (sand pile) width

    var m = S * rng.range(0.07, 0.1), plate = S - 2 * m;          // the square plate, inset

    // ---- the plate: dark metal, a soft sheen from the upper-left, a faint brushed grain ----
    ctx.fillStyle = P.sur; ctx.fillRect(0, 0, S, S);             // the surround / table
    ctx.fillStyle = P.plate; ctx.fillRect(m, m, plate, plate);
    ctx.save(); ctx.beginPath(); ctx.rect(m, m, plate, plate); ctx.clip();
    var sheen = ctx.createRadialGradient(m + plate * 0.32, m + plate * 0.28, plate * 0.1, m + plate * 0.4, m + plate * 0.4, plate * 0.9);
    sheen.addColorStop(0, Loom.rgba(P.hi, P.dark ? 0.5 : 0.6)); sheen.addColorStop(1, Loom.rgba(P.hi, 0));
    ctx.fillStyle = sheen; ctx.fillRect(m, m, plate, plate);
    for (var b = 0, nb = Math.round(140 * U); b < nb; b++) {     // faint brushed-metal streaks
      var by = m + rng.range(0, 1) * plate;
      ctx.strokeStyle = Loom.rgba(P.dark ? "#000000" : P.hi, rng.range(0.015, 0.05));
      ctx.lineWidth = rng.range(0.5, 1.3) * U; ctx.beginPath(); ctx.moveTo(m, by); ctx.lineTo(m + plate, by + rng.range(-2, 2) * U); ctx.stroke();
    }
    ctx.restore();

    // ---- the SAND: a granular field on the nodal lines (lib/field.js #16) ----
    var FW = Math.round(S * 0.84), sc = S / FW;
    var sandC = Loom.field(FW, function (x, y, out) {
      var X = x * sc, Y = y * sc;
      if (X < m || X > S - m || Y < m || Y > S - m) { out[3] = 0; return; }
      var u = (X - m) / plate, v = (Y - m) / plate;
      var z = Math.cos(n1 * PI * u) * Math.cos(n2 * PI * v) - Math.cos(n2 * PI * u) * Math.cos(n1 * PI * v);
      var density = Math.exp(-(z * z) / (w * w));                // grains pile where z ≈ 0 (the still nodal lines)
      if (density < 0.05) { out[3] = 0; return; }
      var grain = 0.3 + 0.7 * nz.fbm(X * 0.7 + 3, Y * 0.7 + 3, 2, 2, 0.5);  // break the line into specks
      var a = clamp(density * grain * (P.dark ? 1.15 : 1), 0, 1);
      out[0] = SAND[0]; out[1] = SAND[1]; out[2] = SAND[2]; out[3] = a * 255;
    });
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(sandC, 0, 0, S, S);

    // ---- the sand catches the light: a faint warm bloom along the densest piles (pale sand only) ----
    if (!P.dark) {
      ctx.save(); ctx.beginPath(); ctx.rect(m, m, plate, plate); ctx.clip();
      ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.5;
      ctx.drawImage(sandC, 0, 0, S, S);                          // a second, blurred-by-upscale pass = a soft glow
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.restore();
    }

    // ---- a few stray grains scattered on the antinodes (real plates are never perfectly swept) ----
    ctx.save(); ctx.beginPath(); ctx.rect(m, m, plate, plate); ctx.clip();
    for (var s = 0, ns = Math.round(160 * U); s < ns; s++) {
      var gx = m + rng.range(0, 1) * plate, gy = m + rng.range(0, 1) * plate;
      var u2 = (gx - m) / plate, v2 = (gy - m) / plate;
      var z2 = Math.cos(n1 * PI * u2) * Math.cos(n2 * PI * v2) - Math.cos(n2 * PI * u2) * Math.cos(n1 * PI * v2);
      ctx.fillStyle = Loom.rgba(P.sand, Math.exp(-(z2 * z2) / 0.5) * rng.range(0.1, 0.4));  // denser near nodes
      ctx.fillRect(gx, gy, rng.range(0.6, 1.4) * U, rng.range(0.6, 1.4) * U);
    }
    ctx.restore();

    // ---- a thin bevel on the plate edge + a soft vignette ----
    ctx.strokeStyle = Loom.rgba(P.hi, 0.5); ctx.lineWidth = 1.5 * U; ctx.strokeRect(m, m, plate, plate);
    ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1 * U; ctx.strokeRect(m - 1.5 * U, m - 1.5 * U, plate + 3 * U, plate + 3 * U);
    var vg = ctx.createRadialGradient(S * 0.5, S * 0.5, plate * 0.5, S * 0.5, S * 0.5, S * 0.8);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, P.dark ? "rgba(40,38,32,0.4)" : "rgba(2,3,6,0.55)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
