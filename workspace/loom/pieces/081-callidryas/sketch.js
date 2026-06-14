// Emil's Loom · piece 081 — "Callidryas"
//
// A red-eyed tree frog (Agalychnis callidryas) clinging to a stem — vivid leaf-green, huge crimson eyes,
// tangerine toes, a flash of blue-and-gold down the flank. A CHARM piece, a fresh register after awe (#080)
// and abstraction (#079). Ran 083: the read AND the sing both live in the EYES + the vivid colour, so I
// validated the eyes FIRST (soul) — big round eyes = baby-schema cute, the TARGET here, not the
// [[079-a-creatures-register-lives-in-its-proportions-not-its-species]] trap. The eye is a wet living
// surface, all light cues agreeing ([[040-wet-living-surface-needs-all-light-cues-to-agree]]). Composes noise + glow + ramp.
Loom.piece({
  id: "081",
  title: "Callidryas",
  seed: "agalychnis",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    function ell(x, y, rx, ry, rot) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU); ctx.fill(); }

    var nz = Loom.noise(rng.int(1, 99999));
    var look = [rng.range(-0.13, 0.13), rng.range(-0.1, 0.05)];   // seeded gaze (both eyes) — a variation axis (085)
    // ---- soft rainforest-green ground ----
    var bg = ctx.createRadialGradient(0.5 * S, 0.42 * S, 0.1 * S, 0.5 * S, 0.55 * S, 0.85 * S);
    bg.addColorStop(0, "#274a2c"); bg.addColorStop(0.6, "#193020"); bg.addColorStop(1, "#0c1c12");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    for (var lf = 0; lf < 7; lf++) Loom.glow(ctx, rng.range(0.1, 0.9) * S, rng.range(0.1, 0.9) * S, rng.range(0.1, 0.2) * S, "#3a6a3a", 0.1, 0.5);

    var mx = 0.5 * S;
    // ---- the stem it clings to ----
    ctx.strokeStyle = "#356b38"; ctx.lineWidth = 0.075 * S; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(mx + 0.02 * S, S); ctx.quadraticCurveTo(mx - 0.04 * S, 0.5 * S, mx + 0.04 * S, 0.05 * S); ctx.stroke();
    ctx.strokeStyle = "rgba(150,210,140,0.25)"; ctx.lineWidth = 0.012 * S;       // stem highlight
    ctx.beginPath(); ctx.moveTo(mx - 0.005 * S, S); ctx.quadraticCurveTo(mx - 0.065 * S, 0.5 * S, mx + 0.015 * S, 0.05 * S); ctx.stroke();

    // ---- a webbed, orange-toed foot ----
    function foot(cx, cy, ang, sc, n) {
      for (var i = 0; i < n; i++) {
        var a = ang + (i - (n - 1) / 2) * 0.42, tx = cx + Math.cos(a) * sc, ty = cy + Math.sin(a) * sc;
        ctx.strokeStyle = "#ef861f"; ctx.lineWidth = sc * 0.24; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.fillStyle = "#f7ad5e"; circle(tx, ty, sc * 0.17);                    // adhesive toe-pad
      }
    }

    // ---- body: a rounded leaf-green back, blue-barred flanks, the hind legs folded up ----
    function legGreen(x, y, rx, ry, rot) { ctx.fillStyle = "#3f9a3f"; ell(x, y, rx, ry, rot); }
    // hind thighs folded up the flanks
    legGreen(mx - 0.19 * S, 0.66 * S, 0.085 * S, 0.13 * S, 0.5);
    legGreen(mx + 0.19 * S, 0.66 * S, 0.085 * S, 0.13 * S, -0.5);
    foot(mx - 0.215 * S, 0.78 * S, 1.9, 0.06 * S, 4);
    foot(mx + 0.215 * S, 0.78 * S, 1.24, 0.06 * S, 4);

    var body = ctx.createRadialGradient(mx, 0.6 * S, 0.04 * S, mx, 0.7 * S, 0.3 * S);
    body.addColorStop(0, "#5cbb4e"); body.addColorStop(0.6, "#469f43"); body.addColorStop(1, "#2c7634");
    ctx.fillStyle = body; ell(mx, 0.68 * S, 0.2 * S, 0.22 * S);

    // blue flanks with cream vertical bars (clipped to the body's lower sides)
    ctx.save(); ctx.beginPath(); ctx.ellipse(mx, 0.68 * S, 0.2 * S, 0.22 * S, 0, 0, TAU); ctx.clip();
    ctx.fillStyle = "#2e54b8";
    ell(mx - 0.17 * S, 0.7 * S, 0.06 * S, 0.18 * S); ell(mx + 0.17 * S, 0.7 * S, 0.06 * S, 0.18 * S);
    ctx.fillStyle = "#f2df86"; ctx.globalAlpha = 0.9;
    for (var b = -2; b <= 2; b++) { ell(mx - 0.17 * S, 0.6 * S + b * 0.05 * S, 0.07 * S, 0.016 * S, 0.2); ell(mx + 0.17 * S, 0.6 * S + b * 0.05 * S, 0.07 * S, 0.016 * S, -0.2); }
    ctx.globalAlpha = 1; ctx.restore();

    // ---- the big red eye (the soul, validated first) ----
    function eye(cx, cy, r) {
      ctx.fillStyle = "#1f5a28"; circle(cx, cy, r * 1.16);
      ctx.fillStyle = "#3f933f"; circle(cx, cy - r * 0.06, r * 1.08);
      var ir = ctx.createRadialGradient(cx, cy, r * 0.12, cx, cy, r);
      ir.addColorStop(0, "#ff9a44"); ir.addColorStop(0.35, "#ec3f28"); ir.addColorStop(0.78, "#c01f22"); ir.addColorStop(1, "#7e1418");
      ctx.fillStyle = ir; circle(cx, cy, r);
      for (var k = 0; k < 60; k++) {
        var a = k / 60 * TAU + rng.range(-0.03, 0.03), r0 = r * rng.range(0.2, 0.32), r1 = r * rng.range(0.86, 0.99);
        ctx.strokeStyle = (k % 3 === 0) ? "rgba(255,210,110,0.30)" : "rgba(120,12,18,0.45)";
        ctx.lineWidth = 0.9 * U; ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke();
      }
      ctx.fillStyle = "#080604"; ctx.save(); ctx.translate(cx + look[0] * r, cy + look[1] * r); ctx.scale(0.17, 1); circle(0, 0, r * 0.6); ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.95)"; circle(cx - r * 0.32, cy - r * 0.36, r * 0.15);
      ctx.fillStyle = "rgba(255,255,255,0.55)"; circle(cx + r * 0.18, cy + r * 0.22, r * 0.07);
      ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 2 * U;
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.97, -2.5, -0.7); ctx.stroke();
    }

    // ---- head + front hands gripping below the chin ----
    var hy = 0.5 * S;
    var head = ctx.createRadialGradient(mx, hy - 0.1 * S, 0.05 * S, mx, hy, 0.32 * S);
    head.addColorStop(0, "#62c254"); head.addColorStop(0.6, "#48a745"); head.addColorStop(1, "#2f7d37");
    ctx.fillStyle = head; ell(mx, hy, 0.25 * S, 0.205 * S);
    ctx.fillStyle = head; ell(mx, hy + 0.13 * S, 0.155 * S, 0.12 * S);            // snout/chin
    ctx.strokeStyle = "rgba(18,56,26,0.55)"; ctx.lineWidth = 2 * U;
    ctx.beginPath(); ctx.moveTo(mx - 0.13 * S, hy + 0.17 * S); ctx.quadraticCurveTo(mx, hy + 0.215 * S, mx + 0.13 * S, hy + 0.17 * S); ctx.stroke();
    ctx.fillStyle = "#2f7d37"; circle(mx - 0.028 * S, hy + 0.085 * S, 0.006 * S); circle(mx + 0.028 * S, hy + 0.085 * S, 0.006 * S);
    // wet sheen on the rounded forms + faint cream skin speckles (seeded texture + variation)
    function sheen(x, y, r) { var g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, "rgba(192,242,172,0.26)"); g.addColorStop(1, "rgba(192,242,172,0)"); ctx.fillStyle = g; circle(x, y, r); }
    sheen(mx - 0.05 * S, hy - 0.07 * S, 0.13 * S); sheen(mx - 0.04 * S, 0.6 * S, 0.12 * S);
    ctx.fillStyle = "rgba(228,246,204,0.5)";
    for (var sp = 0; sp < 15; sp++) circle(mx + rng.range(-0.15, 0.15) * S, rng.range(0.52, 0.76) * S, rng.range(0.0032, 0.0072) * S);
    foot(mx - 0.06 * S, hy + 0.2 * S, 1.9, 0.052 * S, 4);                          // front hands gripping
    foot(mx + 0.06 * S, hy + 0.2 * S, 1.24, 0.052 * S, 4);

    eye(mx - 0.14 * S, 0.38 * S, 0.135 * S);
    eye(mx + 0.14 * S, 0.38 * S, 0.135 * S);
  }
});
