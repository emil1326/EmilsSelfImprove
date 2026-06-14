// Emil's Loom · piece 091 — "Karesansui"
//
// A dry-landscape garden (枯山水, "dry mountain-water"): raked gravel for water, standing stones for mountains.
// The hook is not "a garden" (a minimal scene reads as empty — Emil's oldest note) but the RAKED FIELD itself —
// concentric ripples combed around each stone like a current frozen in gravel, and where ripples from two stone
// groupings meet they fight to a watershed RIDGE that nobody placed. That emergent structure is the sing
// ([[090-an-abstract-sings-by-revealing-its-emergent-structure]]); the rake furrows are a distance field to the
// nearest stone, lit by a low raking sun so each groove casts its own thin shadow (tone, not glow, 022). A bright,
// matte, serene piece — the calm register (my 5-lane per [[075-serene-light-is-my-real-five-lane]]). Self-directed.
// Composes a numeric field (038 full-res for the crisp grooves) + noise + ramp.
Loom.piece({
  id: "091",
  title: "Karesansui",
  seed: "ryoanji",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- seed parameters (wide, so stones / rake / tone vary per seed; 085/097) ----
    var spacing = rng.range(0.030, 0.040) * S;            // furrow spacing
    var lightAng = rng.range(-2.5, -1.9);                 // low raking sun (upper-ish)
    var lx = Math.cos(lightAng), ly = Math.sin(lightAng);
    var sandWarm = rng.range(-0.4, 1.0);                  // cool grey .. warm beige
    var sand = [206 + sandWarm * 12, 198 + sandWarm * 6, 180 - sandWarm * 14];

    // ---- place the stones in 2–3 asymmetric groupings (so ripples interfere into watershed ridges) ----
    var rocks = [];
    var nGroups = rng.int(2, 3);
    for (var gi = 0; gi < nGroups; gi++) {
      var gx = rng.range(0.22, 0.78) * S, gy = rng.range(0.24, 0.76) * S;
      var inGroup = gi === 0 ? rng.int(2, 3) : rng.int(1, 2);   // a main grouping + satellites
      for (var ri = 0; ri < inGroup; ri++) {
        var R = rng.range(0.045, 0.10) * S * (ri === 0 ? 1 : 0.7);
        rocks.push({
          x: gx + rng.range(-0.07, 0.07) * S,
          y: gy + rng.range(-0.05, 0.05) * S,
          R: R, fr: R * 0.92,                              // field radius (ripples hug just outside the stone)
          rot: rng.range(0, TAU), squash: rng.range(0.6, 0.85),
          nseed: rng.range(0, 100)
        });
      }
    }

    // =========================================================================
    //  THE RAKED GRAVEL — a full-res distance field, lit by the raking sun
    // =========================================================================
    var img = ctx.createImageData(S, S), data = img.data;
    var sr = sand[0], sg = sand[1], sb = sand[2];
    function hash(x, y) { var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return n - Math.floor(n); }
    // raking-light phase offset: the lit slope of each furrow faces the sun
    var lightPh = (lx + ly) * 0.0;                         // (kept simple — slope shading below carries the light)
    for (var py = 0; py < S; py++) {
      for (var px = 0; px < S; px++) {
        var d = 1e9;
        for (var k = 0; k < rocks.length; k++) {
          var rk = rocks[k], dx = px - rk.x, dy = py - rk.y;
          var dd = Math.sqrt(dx * dx + dy * dy) - rk.fr;
          if (dd < d) d = dd;
        }
        var idx = (py * S + px) * 4;
        if (d < 0) { data[idx] = 120; data[idx + 1] = 116; data[idx + 2] = 104; data[idx + 3] = 255; continue; }  // under a stone (covered later)
        var warp = Math.sin(px * 0.013 + py * 0.007) + Math.sin(px * 0.006 - py * 0.012);  // cheap low-freq hand-raked wobble
        var ph = (d + warp * spacing * 0.16) / spacing;    // the furrows aren't machine-perfect circles
        var frac = ph - Math.floor(ph);                    // 0..1 within one furrow
        var slope = Math.sin(frac * TAU);                  // the furrow's lit slope / shadowed slope
        var groove = Math.exp(-((frac) * (frac)) / 0.010) + Math.exp(-((frac - 1) * (frac - 1)) / 0.010); // thin shadow at the tine mark
        var br = 1 + 0.085 * slope - 0.20 * groove;
        var gn = (hash(px, py) - 0.5) * 0.05;              // fine gravel grain
        br += gn;
        data[idx] = sr * br; data[idx + 1] = sg * br; data[idx + 2] = sb * br; data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    // =========================================================================
    //  a soft warm light-gradient washed over the gravel (depth, not flatness)
    // =========================================================================
    var wash = ctx.createRadialGradient(S * (0.5 - lx * 0.3), S * (0.5 - ly * 0.3), S * 0.1, S * 0.5, S * 0.5, S * 0.8);
    wash.addColorStop(0, "rgba(255,248,225,0.16)"); wash.addColorStop(1, "rgba(70,60,40,0.16)");
    ctx.fillStyle = wash; ctx.fillRect(0, 0, S, S);

    // =========================================================================
    //  THE STONES — standing forms, lit + mossy, each on its own soft shadow
    // =========================================================================
    function stonePath(rk, scale) {
      ctx.beginPath();
      for (var a = 0; a <= TAU + 0.01; a += 0.18) {
        var wob = 1 + (nz.fbm(Math.cos(a) * 1.5 + rk.nseed, Math.sin(a) * 1.5, 3) - 0.5) * 0.35;
        var rr = rk.R * scale * wob;
        var ex = rk.x + Math.cos(a + rk.rot) * rr, ey = rk.y + Math.sin(a + rk.rot) * rr * rk.squash;
        if (a === 0) ctx.moveTo(ex, ey); else ctx.lineTo(ex, ey);
      }
      ctx.closePath();
    }
    // sort back-to-front by y so nearer stones overlap farther ones
    rocks.sort(function (a, b) { return a.y - b.y; });
    for (var s2 = 0; s2 < rocks.length; s2++) {
      var rk = rocks[s2];
      // contact shadow on the gravel (offset away from the light)
      ctx.save();
      ctx.fillStyle = "rgba(60,52,38,0.28)";
      ctx.beginPath(); ctx.ellipse(rk.x + lx * -0.02 * S, rk.y + 0.04 * S, rk.R * 1.15, rk.R * rk.squash * 0.8, 0, 0, TAU); ctx.fill();
      ctx.restore();
      // the stone body — a one-light gradient (lit shoulder → shadowed base)
      stonePath(rk, 1);
      var sgr = ctx.createLinearGradient(rk.x + lx * rk.R, rk.y + ly * rk.R, rk.x - lx * rk.R, rk.y + rk.R);
      sgr.addColorStop(0, "#8c8576"); sgr.addColorStop(0.5, "#6f6a5d"); sgr.addColorStop(1, "#4c4842");
      ctx.fillStyle = sgr; ctx.fill();
      // texture mottle + a lit rim
      ctx.save(); stonePath(rk, 1); ctx.clip();
      ctx.globalAlpha = 0.12;
      for (var m = 0; m < 30; m++) {
        var mx = rk.x + rng.range(-1, 1) * rk.R, my = rk.y + rng.range(-1, 1) * rk.R * rk.squash;
        ctx.fillStyle = nz.fbm(mx * 0.05, my * 0.05, 2) > 0.5 ? "#a8a08e" : "#3c3833";
        ctx.beginPath(); ctx.arc(mx, my, rk.R * 0.06, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // moss on the shaded north base
      for (var mo = 0; mo < 5; mo++) {
        var ma = TAU * 0.25 + rng.range(-0.7, 0.7) + (ly > 0 ? 0 : Math.PI);
        var mr = rk.R * rng.range(0.55, 0.9);
        ctx.fillStyle = "rgba(96,118,52," + rng.range(0.18, 0.4).toFixed(2) + ")";
        ctx.beginPath(); ctx.arc(rk.x + Math.cos(ma) * mr, rk.y + Math.sin(ma) * mr * rk.squash, rk.R * rng.range(0.12, 0.22), 0, TAU); ctx.fill();
      }
      ctx.restore();
      // a crisp lit rim along the sun side
      ctx.save(); stonePath(rk, 1); ctx.clip();
      ctx.strokeStyle = "rgba(248,242,214,0.55)"; ctx.lineWidth = 2.4 * U; stonePath(rk, 0.99); ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    //  a fallen leaf or two — a breath of colour + life on the raked stillness
    // =========================================================================
    var leaves = rng.int(0, 2);
    for (var lf = 0; lf < leaves; lf++) {
      var lxp = rng.range(0.12, 0.88) * S, lyp = rng.range(0.14, 0.88) * S, lsz = rng.range(0.018, 0.03) * S;
      var lcol = rng.bool() ? "#c46a2e" : "#d8a23a";
      ctx.save(); ctx.translate(lxp, lyp); ctx.rotate(rng.range(0, TAU));
      ctx.fillStyle = "rgba(60,40,20,0.18)"; ctx.beginPath(); ctx.ellipse(0.01 * S, 0.012 * S, lsz, lsz * 0.5, 0, 0, TAU); ctx.fill();  // shadow
      ctx.fillStyle = lcol; ctx.beginPath();
      ctx.moveTo(-lsz, 0); ctx.quadraticCurveTo(0, -lsz * 0.7, lsz, 0); ctx.quadraticCurveTo(0, lsz * 0.7, -lsz, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(90,50,20,0.5)"; ctx.lineWidth = 1 * U; ctx.beginPath(); ctx.moveTo(-lsz, 0); ctx.lineTo(lsz, 0); ctx.stroke();  // midrib
      ctx.restore();
    }

    // =========================================================================
    //  the garden's edge — a dark wooden border framing the gravel sea
    // =========================================================================
    var mB = 0.045 * S;
    var bcol = ctx.createLinearGradient(0, 0, 0, S);
    bcol.addColorStop(0, "#5a4a34"); bcol.addColorStop(1, "#3e3122");
    ctx.fillStyle = bcol;
    ctx.fillRect(0, 0, S, mB); ctx.fillRect(0, S - mB, S, mB);
    ctx.fillRect(0, 0, mB, S); ctx.fillRect(S - mB, 0, mB, S);
    ctx.strokeStyle = "rgba(20,14,8,0.4)"; ctx.lineWidth = 1.5 * U;
    ctx.strokeRect(mB, mB, S - 2 * mB, S - 2 * mB);
  }
});
