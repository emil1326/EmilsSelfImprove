// Emil's Loom · piece 092 — "Forge"
//
// A blacksmith at the anvil, lit only by his own fire: the forge glowing in the dark behind him, a bar of
// metal heated white-to-orange on the anvil, the hammer raised for the strike. The gallery has creatures,
// places and cosmos but no PERSON at work — so this is the first human as the subject, doing a craft. The hook
// is the chiaroscuro (a firelit figure carved out of a black workshop, the way the old painters did a forge —
// the light IS the subject), and the held breath before the hammer falls. Glow-on-dark done in TONE+glow (037):
// two warm light sources (the forge, the hot metal) model the smith; the dark structure (figure, anvil) is laid
// LAST over the light (056). Sparks kept dim + count-driven (051/077 — additive glow is my worst grind, so the
// restraint is preemptive). Self-directed. Composes glow + noise + ramp.
Loom.piece({
  id: "092",
  title: "Forge",
  seed: "hephaestus",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- seed parameters (wide; the figure pose is fixed-iconic, the FIRE + setting vary, 085/097) ----
    var forgeX = rng.range(0.66, 0.80) * S, forgeY = rng.range(0.42, 0.54) * S;   // the hearth, background
    var heat = rng.range(0.85, 1.12);                                              // how hot / bright the metal runs
    var emberCount = rng.int(10, 20);
    var wallHue = rng.range(0, 1);                                                 // cool-stone vs warm-brick dark

    // the figure + anvil are hand-composed (fixed), so a flip is the cheap high-impact variation axis (085)
    if (rng.bool()) { ctx.translate(S, 0); ctx.scale(-1, 1); }

    // =========================================================================
    //  THE DARK WORKSHOP — warm-black, a hint of back wall, a heavy vignette
    // =========================================================================
    var bg = ctx.createLinearGradient(0, 0, 0, S);
    bg.addColorStop(0, "#140f0a"); bg.addColorStop(0.6, "#1a130d"); bg.addColorStop(1, "#0d0907");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    // faint masonry behind, only where the forge light will reach
    ctx.globalAlpha = 0.5;
    for (var w = 0; w < 60; w++) {
      var bx = rng.range(0.3, 1) * S, by = rng.range(0, 0.8) * S;
      var br = 18 + wallHue * 8;
      ctx.fillStyle = "rgba(" + (40 + wallHue * 14) + "," + (30 + wallHue * 6) + "," + (24) + ",0.10)";
      ctx.fillRect(bx, by, br * U * 2.2, br * U);
    }
    ctx.globalAlpha = 1;

    // =========================================================================
    //  THE FORGE — the hearth glowing in the dark behind the smith
    // =========================================================================
    Loom.glow(ctx, forgeX, forgeY, 0.42 * S, "#ff7a26", 0.5 * heat, 0.55);         // broad warm wash
    Loom.glow(ctx, forgeX, forgeY, 0.20 * S, "#ffb24e", 0.7 * heat, 0.42);
    // the coal bed (hot core) inside the hearth mouth
    var coal = ctx.createRadialGradient(forgeX, forgeY, 0, forgeX, forgeY, 0.12 * S);
    coal.addColorStop(0, "#ffe6a0"); coal.addColorStop(0.4, "#ff8c2e"); coal.addColorStop(1, "rgba(150,40,8,0)");
    ctx.fillStyle = coal; ctx.beginPath(); ctx.arc(forgeX, forgeY, 0.12 * S, 0, TAU); ctx.fill();

    // =========================================================================
    //  helpers
    // =========================================================================
    function limb(x1, y1, x2, y2, x3, y3, wA, wB, col) {  // a 2-segment tapered limb (round caps)
      ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.lineWidth = wA; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.lineWidth = wB; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x3, y3); ctx.stroke();
    }
    var DARK = "#181009";                                  // the figure's near-black, warm

    // ---- joints (canvas coords; the iconic bent-over, hammer-raised stance, facing right) ----
    var hip = [0.37 * S, 0.585 * S], sh = [0.47 * S, 0.405 * S], head = [0.535 * S, 0.35 * S];
    var hHand = [0.345 * S, 0.165 * S], hElbow = [0.40 * S, 0.275 * S];            // hammer arm, raised back
    var tHand = [0.585 * S, 0.575 * S], tElbow = [0.55 * S, 0.50 * S];            // tongs arm, down to the anvil
    var anvilX = 0.60 * S, anvilTop = 0.585 * S;
    var metalX = 0.60 * S, metalY = 0.566 * S;

    // =========================================================================
    //  THE SMITH — dark firelit form (built of thick limbs), laid over the glow (056)
    // =========================================================================
    // back leg + front leg (planted stance)
    limb(hip[0], hip[1], 0.34 * S, 0.71 * S, 0.31 * S, 0.85 * S, 0.085 * S, 0.06 * S, DARK);
    limb(hip[0] + 0.02 * S, hip[1], 0.45 * S, 0.70 * S, 0.50 * S, 0.84 * S, 0.085 * S, 0.06 * S, DARK);
    // torso (hip → shoulder), thick
    ctx.strokeStyle = DARK; ctx.lineCap = "round"; ctx.lineWidth = 0.15 * S;
    ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(sh[0], sh[1]); ctx.stroke();
    // leather apron over the front of the torso + thighs
    ctx.fillStyle = "#241710";
    ctx.beginPath();
    ctx.moveTo(0.40 * S, 0.44 * S); ctx.lineTo(0.50 * S, 0.46 * S);
    ctx.lineTo(0.49 * S, 0.66 * S); ctx.lineTo(0.37 * S, 0.66 * S); ctx.closePath(); ctx.fill();
    // arms
    limb(sh[0], sh[1], tElbow[0], tElbow[1], tHand[0], tHand[1], 0.062 * S, 0.05 * S, DARK);  // tongs arm
    limb(sh[0], sh[1], hElbow[0], hElbow[1], hHand[0], hHand[1], 0.07 * S, 0.052 * S, DARK);  // hammer arm
    // head + a cap
    ctx.fillStyle = DARK; ctx.beginPath(); ctx.arc(head[0], head[1], 0.052 * S, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(head[0], head[1] - 0.035 * S, 0.056 * S, 0.03 * S, 0.1, 0, TAU); ctx.fill();
    // the hammer (handle + head), raised
    ctx.strokeStyle = "#3a2615"; ctx.lineWidth = 0.022 * S; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(hHand[0], hHand[1]); ctx.lineTo(0.30 * S, 0.085 * S); ctx.stroke();
    ctx.fillStyle = "#2c2622"; ctx.save(); ctx.translate(0.30 * S, 0.082 * S); ctx.rotate(-0.5);
    ctx.fillRect(-0.055 * S, -0.022 * S, 0.11 * S, 0.044 * S); ctx.restore();

    // ---- firelight on the smith: warm rim from the forge side + underlight from the hot metal ----
    // a strong up-light from the hot metal onto the smith's near side — "lit by his own work"
    Loom.glow(ctx, metalX - 0.04 * S, metalY - 0.04 * S, 0.24 * S, "#ff8c34", 0.5, 0.5);
    function rim(pts, wd, a) {
      ctx.strokeStyle = "rgba(255,172,84," + a + ")"; ctx.lineWidth = wd; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); for (var i = 0; i < pts.length; i += 2) { if (i) ctx.lineTo(pts[i], pts[i + 1]); else ctx.moveTo(pts[i], pts[i + 1]); } ctx.stroke();
    }
    rim([hip[0] + 0.035 * S, hip[1], sh[0] + 0.045 * S, sh[1]], 0.02 * S, 0.6);                                       // lit torso edge
    rim([sh[0] + 0.02 * S, sh[1], hElbow[0] + 0.02 * S, hElbow[1], hHand[0] + 0.012 * S, hHand[1]], 0.013 * S, 0.55); // lit hammer arm (connects it)
    rim([sh[0] + 0.02 * S, sh[1] + 0.02 * S, tElbow[0] + 0.01 * S, tElbow[1], tHand[0], tHand[1]], 0.014 * S, 0.6);   // lit tongs arm to the metal
    ctx.fillStyle = "rgba(255,184,98,0.6)"; ctx.beginPath(); ctx.arc(head[0] + 0.022 * S, head[1] + 0.008 * S, 0.023 * S, 0, TAU); ctx.fill();  // lit jaw

    // =========================================================================
    //  THE ANVIL — dark steel, in front of the smith's legs
    // =========================================================================
    ctx.fillStyle = "#241c18";
    ctx.beginPath();
    ctx.moveTo(0.50 * S, anvilTop); ctx.lineTo(0.70 * S, anvilTop);                // the face (top)
    ctx.lineTo(0.74 * S, anvilTop + 0.012 * S); ctx.lineTo(0.66 * S, anvilTop + 0.03 * S);  // the horn
    ctx.lineTo(0.64 * S, anvilTop + 0.10 * S); ctx.lineTo(0.61 * S, anvilTop + 0.135 * S);  // waist
    ctx.lineTo(0.66 * S, anvilTop + 0.16 * S); ctx.lineTo(0.66 * S, anvilTop + 0.18 * S);   // base
    ctx.lineTo(0.52 * S, anvilTop + 0.18 * S); ctx.lineTo(0.52 * S, anvilTop + 0.16 * S);
    ctx.lineTo(0.56 * S, anvilTop + 0.135 * S); ctx.lineTo(0.545 * S, anvilTop + 0.03 * S);
    ctx.lineTo(0.50 * S, anvilTop + 0.012 * S); ctx.closePath(); ctx.fill();
    // a faint lit top edge (catching the metal's glow)
    ctx.strokeStyle = "rgba(255,140,60,0.35)"; ctx.lineWidth = 2.2 * U;
    ctx.beginPath(); ctx.moveTo(0.50 * S, anvilTop); ctx.lineTo(0.70 * S, anvilTop); ctx.stroke();

    // =========================================================================
    //  THE HOT METAL — white-hot, the brightest thing, the eye's destination
    // =========================================================================
    Loom.glow(ctx, metalX, metalY, 0.13 * S * heat, "#ff7a1e", 0.8 * heat, 0.42);
    Loom.glow(ctx, metalX, metalY, 0.06 * S * heat, "#ffd070", 0.82 * heat, 0.32);
    var bar = ctx.createLinearGradient(metalX - 0.07 * S, metalY, metalX + 0.05 * S, metalY);
    bar.addColorStop(0, "#fff2d2"); bar.addColorStop(0.4, "#ffb648"); bar.addColorStop(0.8, "#ff6a1a"); bar.addColorStop(1, "#9c2606");
    ctx.fillStyle = bar; ctx.save(); ctx.translate(metalX, metalY); ctx.rotate(-0.05);
    ctx.fillRect(-0.085 * S, -0.014 * S, 0.13 * S, 0.026 * S); ctx.restore();
    ctx.fillStyle = "#fffaf0"; ctx.beginPath(); ctx.ellipse(metalX - 0.02 * S, metalY, 0.03 * S, 0.012 * S, 0, 0, TAU); ctx.fill();  // hottest spot

    // =========================================================================
    //  SPARKS — dim, count-driven embers off the hot metal (051/077, preemptive)
    // =========================================================================
    for (var s = 0; s < emberCount; s++) {
      var ang = -TAU * 0.25 + rng.range(-0.9, 0.9);
      var dist = rng.range(0.02, 0.20) * S;
      var sx = metalX + Math.cos(ang) * dist, sy = metalY + Math.sin(ang) * dist * 1.1;
      var life = 1 - dist / (0.20 * S);                    // nearer = brighter/hotter
      ctx.globalAlpha = 0.35 + 0.45 * life;
      // a short faint trail then the ember dot
      ctx.strokeStyle = "rgba(255,180,90,0.30)"; ctx.lineWidth = 1.1 * U;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - Math.cos(ang) * 0.02 * S, sy - Math.sin(ang) * 0.02 * S); ctx.stroke();
      ctx.fillStyle = life > 0.5 ? "#fff0c0" : "#ff9c40";
      ctx.beginPath(); ctx.arc(sx, sy, (0.4 + 1.2 * life) * U, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // =========================================================================
    //  final chiaroscuro — a heavy vignette pulling the corners into black
    // =========================================================================
    var vig = ctx.createRadialGradient(0.55 * S, 0.5 * S, 0.25 * S, 0.55 * S, 0.5 * S, 0.75 * S);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(5,3,2,0.7)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);
  }
});
