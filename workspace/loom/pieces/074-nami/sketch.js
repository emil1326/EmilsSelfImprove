// Emil's Loom · piece 074 — "Nami"
//
// A great wave in the woodblock manner (nami = "wave"): a towering crest of Prussian blue hooking over, its
// lip breaking into rhythmic claws of white foam, a small Mt Fuji far behind. FLAT, MATTE, hard-edged colour —
// a deliberately fresh medium after a long glow-on-dark run ([[084-...]]), and a STYLISED take on the wave I
// twice failed to render realistically (#33): the woodcut sidesteps the 3D-curl legibility trap by being
// graphic, not real. The HOOK is the bold graphic curl + the foam.
//
// SOUL (ran [[083-...]] myself): the layer carrying the READ (it's *the* wave, [[035-defining-feature-is-often-the-hard-part]])
// AND the SING (the dynamic curl + rhythmic fractal foam) is the WAVE SHAPE + the foam-claws — not the sky or
// Fuji. So it's built shape-first and validated FLAT before sky/details ([[032-validate-the-soul-before-the-skin]]);
// the foam is the defining-hard-part, so it gets recursion not a smear ([[047-...]]). Composes noise + palette.
Loom.piece({
  id: "074",
  title: "Nami",
  seed: "kanagawa",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var MOODS = [
      { blue: "#173757", blueDk: "#0e2740", band: "#356088" },     // prussian
      { blue: "#1b2c52", blueDk: "#101a38", band: "#3a4f8a" },     // indigo
      { blue: "#114a4e", blueDk: "#0a2e30", band: "#2c6e6a" }      // deep teal
    ];
    var M = rng.pick(MOODS), blue = M.blue, blueDk = M.blueDk, foam = "#f5f1e7";
    var flip = rng.bool();                                          // the wave can break either way

    // ---- recursive foam-claw: a tapering white tongue that splits into smaller claws near its tip ----
    function claw(x, y, ang, len, wid, depth) {
      if (depth <= 0 || len < 5 * U) return;
      var ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
      var px = -Math.sin(ang), py = Math.cos(ang);                 // perpendicular
      var bow = wid * 1.3;                                          // curl the tongue toward +perp (foam hooks, not spikes)
      var mx = x + Math.cos(ang) * len * 0.5 + px * bow, my = y + Math.sin(ang) * len * 0.5 + py * bow;
      ctx.beginPath();
      ctx.moveTo(x + px * wid * 0.5, y + py * wid * 0.5);
      ctx.quadraticCurveTo(mx + px * wid * 0.3, my + py * wid * 0.3, ex, ey);
      ctx.quadraticCurveTo(mx - px * wid * 0.3, my - py * wid * 0.3, x - px * wid * 0.5, y - py * wid * 0.5);
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, wid * 0.5, 0, TAU); ctx.fill();   // round the joint so claws read as foam, not bone
      for (var i = 0, nc = rng.int(2, 3); i < nc; i++) claw(ex, ey, ang + 0.32 + rng.range(-0.22, 0.22), len * rng.range(0.56, 0.78), wid * 0.66, depth - 1);
    }

    // pale woodblock sky (a faint warm gradient) + distant Mt Fuji, framed by the wave
    var sky = ctx.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, "#ece6d6"); sky.addColorStop(0.55, "#e6dfcc"); sky.addColorStop(1, "#dbd2bc");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);
    if (flip) { ctx.save(); ctx.translate(S, 0); ctx.scale(-1, 1); }   // mirror the whole wave + Fuji + foam
    var fx = rng.range(0.63, 0.80) * S, fy = 0.565 * S, fw = 0.16 * S, fh = 0.125 * S;
    ctx.fillStyle = "#97a3b2";                                       // pale far mountain
    ctx.beginPath(); ctx.moveTo(fx - fw, fy); ctx.lineTo(fx, fy - fh); ctx.lineTo(fx + fw, fy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#eef0ef";                                       // snow cap with a wavy snowline
    ctx.beginPath(); ctx.moveTo(fx - fw * 0.36, fy - fh * 0.6); ctx.lineTo(fx, fy - fh); ctx.lineTo(fx + fw * 0.36, fy - fh * 0.6);
    ctx.bezierCurveTo(fx + fw * 0.16, fy - fh * 0.46, fx - fw * 0.16, fy - fh * 0.46, fx - fw * 0.36, fy - fh * 0.6); ctx.closePath(); ctx.fill();

    // ---- the great wave body: a flat Prussian-blue hook ----
    ctx.fillStyle = blue;
    ctx.beginPath();
    ctx.moveTo(0, 0.98 * S);
    ctx.lineTo(0, 0.60 * S);
    ctx.bezierCurveTo(0.14 * S, 0.46 * S, 0.26 * S, 0.30 * S, 0.42 * S, 0.20 * S);   // the back rising to the crest
    ctx.bezierCurveTo(0.52 * S, 0.14 * S, 0.62 * S, 0.16 * S, 0.66 * S, 0.26 * S);   // over the top
    ctx.bezierCurveTo(0.70 * S, 0.36 * S, 0.64 * S, 0.46 * S, 0.55 * S, 0.45 * S);   // the lip curls forward + down
    ctx.bezierCurveTo(0.49 * S, 0.44 * S, 0.47 * S, 0.39 * S, 0.47 * S, 0.35 * S);   // the inner barrel curving back up
    ctx.bezierCurveTo(0.44 * S, 0.52 * S, 0.64 * S, 0.62 * S, 0.84 * S, 0.60 * S);   // down into the trough, across
    ctx.lineTo(S, 0.64 * S); ctx.lineTo(S, 0.98 * S); ctx.closePath(); ctx.fill();

    // a lighter-blue highlight band just inside the crest (the woodblock layering of the wave face)
    ctx.strokeStyle = M.band; ctx.lineWidth = 0.026 * S; ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0.20 * S, 0.50 * S);
    ctx.bezierCurveTo(0.28 * S, 0.36 * S, 0.40 * S, 0.26 * S, 0.50 * S, 0.225 * S);
    ctx.bezierCurveTo(0.59 * S, 0.225 * S, 0.645 * S, 0.27 * S, 0.655 * S, 0.34 * S);
    ctx.stroke();

    // a darker shadow inside the barrel (the curl's underside)
    ctx.fillStyle = blueDk;
    ctx.beginPath();
    ctx.moveTo(0.47 * S, 0.35 * S);
    ctx.bezierCurveTo(0.47 * S, 0.40 * S, 0.51 * S, 0.44 * S, 0.56 * S, 0.44 * S);
    ctx.bezierCurveTo(0.61 * S, 0.43 * S, 0.62 * S, 0.39 * S, 0.60 * S, 0.36 * S);
    ctx.bezierCurveTo(0.56 * S, 0.40 * S, 0.51 * S, 0.39 * S, 0.47 * S, 0.35 * S);
    ctx.closePath(); ctx.fill();

    // ---- foam: a dense white crest MASS + curling claws off the lip (the soul, 035) ----
    ctx.fillStyle = foam;
    var crest = [[0.30, 0.305], [0.355, 0.255], [0.41, 0.21], [0.47, 0.172], [0.53, 0.158], [0.59, 0.18], [0.64, 0.245], [0.66, 0.315], [0.635, 0.388], [0.58, 0.435], [0.52, 0.45], [0.475, 0.43]];
    for (var m = 0; m < crest.length; m++) {                        // the foam body: overlapping blobs hugging the crest
      var w = 0.45 + 0.55 * Math.min(1, m / 7);                     // fuller toward the breaking lip
      for (var k = 0; k < 5; k++) {
        var bx = crest[m][0] * S + rng.gaussian() * 0.018 * S, by = crest[m][1] * S + rng.gaussian() * 0.016 * S;
        ctx.beginPath(); ctx.arc(bx, by, rng.range(0.013, 0.028) * w * S + 0.005 * S, 0, TAU); ctx.fill();
      }
    }
    for (var c = 2; c < crest.length; c++) {                        // claws curling round the curl, from the lip points
      var cxp = crest[c][0] * S, cyp = crest[c][1] * S, ang = 0.0 + c * 0.2 + rng.range(-0.12, 0.12);
      claw(cxp, cyp, ang, rng.range(0.08, 0.15) * S, rng.range(0.024, 0.042) * S, 3);
    }
    if (flip) ctx.restore();
  }
});
