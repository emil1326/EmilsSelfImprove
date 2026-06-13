// Emil's Loom · piece 067 — "Tyto"
//
// A barn owl (Tyto alba) gliding out of the night straight at you — wings spread, the pale heart-shaped
// face lit by the moon, two black eyes locked on yours. The HOOK is primal ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]):
// a face coming at you out of the dark, the felt "oh" carried by the SUBJECT (the way God-rays' manta
// carried its light, [[078-two-emils-calibrate-against-the-past-rated-set-dont-wait-on-future-ratings]] —
// grading this by felt impact vs the rated 5s, owned). Chosen by PULL (075). The read lives in the
// SILHOUETTE first ([[032-validate-the-soul-before-the-skin]] / [[035-defining-feature-is-often-the-hard-part]]):
// broad rounded wings + the heart facial disc + the dark eyes; only once that reads do the moonlight and
// feathers go on. A wet, watching face needs its light cues to agree ([[040-wet-living-surface-needs-all-light-cues-to-agree]]).
// Composes noise (mottle/sky) + glow (the moon) + palette. Static — a held, breath-stopped instant.
Loom.piece({
  id: "067",
  title: "Tyto",
  seed: "moonlit",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var nz = Loom.noise(rng.int(1, 999999));
    var cx = 0.5 * S;

    // ---- night sky ----
    var sky = ctx.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, "#0a1228"); sky.addColorStop(0.5, "#121d36"); sky.addColorStop(1, "#1a2740");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);
    for (var st = 0; st < 70; st++) { var sx = rng.range(0, 1) * S, sy = rng.range(0, 0.6) * S; ctx.fillStyle = "rgba(220,228,240," + (0.1 + rng.range(0, 0.4)).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(sx, sy, rng.range(0.3, 1.0) * U, 0, TAU); ctx.fill(); }
    // the moon, behind the owl, giving a cool backlight
    var mx = (0.5 + rng.range(-0.18, 0.18)) * S, my = (0.26 + rng.range(-0.05, 0.05)) * S;
    Loom.glow(ctx, mx, my, 0.34 * S, "#cdd8e8", 0.4, 0.5);
    var mg = ctx.createRadialGradient(mx - 0.012 * S, my - 0.012 * S, 0.004 * S, mx, my, 0.066 * S);
    mg.addColorStop(0, "#f4f6fb"); mg.addColorStop(0.7, "#dde4ee"); mg.addColorStop(1, "#b6c2d4");
    ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, 0.066 * S, 0, TAU); ctx.fill();

    // ---- the owl, head-on, wings spread (moonlit from above-behind: rim on top, shadow below) ----
    var lit = "#d6d2c2", mid = "#b4b09e", shadow = "#8c8876", rim = "#e8eef6", mark = "#6e6354", paleHi = "#f4f0e2";
    function wing(side) {                                             // side = +1 right, -1 left — a BROAD, rounded owl wing
      ctx.beginPath();
      ctx.moveTo(cx + side * 0.05 * S, 0.42 * S);                     // upper shoulder
      ctx.bezierCurveTo(cx + side * 0.18 * S, 0.355 * S, cx + side * 0.34 * S, 0.36 * S, cx + side * 0.42 * S, 0.41 * S);  // broad, near-level leading edge → wingtip
      ctx.bezierCurveTo(cx + side * 0.465 * S, 0.435 * S, cx + side * 0.455 * S, 0.495 * S, cx + side * 0.39 * S, 0.505 * S);  // ROUNDED, fanned wingtip
      ctx.bezierCurveTo(cx + side * 0.28 * S, 0.535 * S, cx + side * 0.13 * S, 0.555 * S, cx + side * 0.06 * S, 0.55 * S);  // deep trailing edge → body
      ctx.closePath();
      var g = ctx.createLinearGradient(0, 0.36 * S, 0, 0.56 * S);     // moonlit top → shadow bottom
      g.addColorStop(0, lit); g.addColorStop(0.5, mid); g.addColorStop(1, shadow);
      ctx.fillStyle = g; ctx.fill();
      // flight-feather lines fanning from the shoulder to the trailing edge
      ctx.strokeStyle = Loom.rgba(mark, 0.5); ctx.lineWidth = 1.7 * U; ctx.lineCap = "round";
      for (var f = 0; f < 6; f++) { var tt = f / 5; ctx.beginPath(); ctx.moveTo(cx + side * 0.085 * S, 0.46 * S); ctx.quadraticCurveTo(cx + side * (0.22 + 0.14 * tt) * S, (0.44 + 0.055 * tt) * S, cx + side * (0.32 + 0.11 * tt) * S, (0.52 - 0.085 * tt) * S); ctx.stroke(); }
      // a soft shadow where the wing tucks under the body (depth)
      var ws = ctx.createLinearGradient(cx + side * 0.05 * S, 0, cx + side * 0.16 * S, 0);
      ws.addColorStop(0, Loom.rgba("#5a5446", 0.4)); ws.addColorStop(1, Loom.rgba("#5a5446", 0));
      ctx.fillStyle = ws; ctx.beginPath(); ctx.moveTo(cx + side * 0.05 * S, 0.43 * S); ctx.lineTo(cx + side * 0.17 * S, 0.45 * S); ctx.lineTo(cx + side * 0.15 * S, 0.53 * S); ctx.lineTo(cx + side * 0.055 * S, 0.55 * S); ctx.closePath(); ctx.fill();
      // barn-owl speckle
      for (var k = 0; k < 26; k++) { var rx = cx + side * rng.range(0.08, 0.42) * S, ry = rng.range(0.4, 0.53) * S; if (nz.fbm(rx / S * 9, ry / S * 9, 2, 2, 0.5) > 0.58) { ctx.fillStyle = Loom.rgba(mark, 0.5); ctx.beginPath(); ctx.arc(rx, ry, rng.range(0.6, 1.5) * U, 0, TAU); ctx.fill(); } }
      // rim light on the leading (top) edge — the moon catching the wing
      ctx.strokeStyle = Loom.rgba(rim, 0.7); ctx.lineWidth = 1.8 * U;
      ctx.beginPath(); ctx.moveTo(cx + side * 0.05 * S, 0.42 * S); ctx.bezierCurveTo(cx + side * 0.18 * S, 0.355 * S, cx + side * 0.34 * S, 0.36 * S, cx + side * 0.42 * S, 0.41 * S); ctx.stroke();
    }
    wing(1); wing(-1);
    // body (plump, moonlit gradient)
    var bgr = ctx.createLinearGradient(0, 0.42 * S, 0, 0.64 * S);
    bgr.addColorStop(0, lit); bgr.addColorStop(0.5, mid); bgr.addColorStop(1, shadow);
    ctx.fillStyle = bgr; ctx.beginPath(); ctx.ellipse(cx, 0.52 * S, 0.062 * S, 0.12 * S, 0, 0, TAU); ctx.fill();
    for (var k = 0; k < 30; k++) { var rx = cx + rng.range(-0.05, 0.05) * S, ry = rng.range(0.44, 0.62) * S; if (nz.fbm(rx / S * 9 + 4, ry / S * 9, 2, 2, 0.5) > 0.56) { ctx.fillStyle = Loom.rgba(mark, 0.42); ctx.beginPath(); ctx.arc(rx, ry, rng.range(0.6, 1.4) * U, 0, TAU); ctx.fill(); } }
    ctx.fillStyle = shadow; ctx.beginPath(); ctx.ellipse(cx, 0.63 * S, 0.028 * S, 0.045 * S, 0, 0, TAU); ctx.fill();   // tucked tail

    // ---- the head + heart-shaped facial disc ----
    var fy = 0.365 * S, fw = 0.072 * S;
    ctx.fillStyle = mid;                                              // crown/head behind the disc
    ctx.beginPath(); ctx.ellipse(cx, fy - fw * 0.2, fw * 1.02, fw * 0.95, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = Loom.rgba(rim, 0.55); ctx.lineWidth = 1.8 * U;  // moon rim on the crown
    ctx.beginPath(); ctx.ellipse(cx, fy - fw * 0.2, fw * 1.02, fw * 0.95, 0, Math.PI * 1.12, Math.PI * 1.96); ctx.stroke();
    // the heart disc (two lobes + a chin point), brighter (it catches the moon)
    ctx.fillStyle = paleHi;
    ctx.beginPath();
    ctx.arc(cx - fw * 0.46, fy - fw * 0.12, fw * 0.6, 0, TAU);
    ctx.arc(cx + fw * 0.46, fy - fw * 0.12, fw * 0.6, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - fw * 0.92, fy - fw * 0.05); ctx.lineTo(cx + fw * 0.92, fy - fw * 0.05);
    ctx.quadraticCurveTo(cx + fw * 0.5, fy + fw * 0.95, cx, fy + fw * 1.15);
    ctx.quadraticCurveTo(cx - fw * 0.5, fy + fw * 0.95, cx - fw * 0.92, fy - fw * 0.05);
    ctx.closePath(); ctx.fill();
    // the dark ruff outline of the heart (the barn-owl's face-frame)
    ctx.strokeStyle = mark; ctx.lineWidth = 2.2 * U; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.arc(cx - fw * 0.46, fy - fw * 0.12, fw * 0.6, Math.PI * 0.75, Math.PI * 2.1);
    ctx.moveTo(cx + fw * 0.92, fy - fw * 0.05); ctx.quadraticCurveTo(cx + fw * 0.5, fy + fw * 0.95, cx, fy + fw * 1.15);
    ctx.quadraticCurveTo(cx - fw * 0.5, fy + fw * 0.95, cx - fw * 0.92, fy - fw * 0.05);
    ctx.stroke();
    // eyes — two black drops, forward, the gaze
    ctx.fillStyle = "#100c0a";
    ctx.beginPath(); ctx.ellipse(cx - fw * 0.44, fy - fw * 0.08, fw * 0.27, fw * 0.32, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + fw * 0.44, fy - fw * 0.08, fw * 0.27, fw * 0.32, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(220,230,245,0.8)";                          // catchlights (moon in the eyes)
    ctx.beginPath(); ctx.arc(cx - fw * 0.5, fy - fw * 0.16, fw * 0.07, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + fw * 0.38, fy - fw * 0.16, fw * 0.07, 0, TAU); ctx.fill();
    // beak — a small pale dagger pointing down between the eyes
    ctx.fillStyle = "#d8cdb4"; ctx.beginPath();
    ctx.moveTo(cx - fw * 0.1, fy + fw * 0.05); ctx.lineTo(cx + fw * 0.1, fy + fw * 0.05); ctx.lineTo(cx, fy + fw * 0.42); ctx.closePath(); ctx.fill();

    // ---- a dark land/tree-line at the bottom for scale ----
    ctx.fillStyle = "#0a1220";
    ctx.beginPath(); ctx.moveTo(0, S); ctx.lineTo(0, 0.9 * S);
    for (var x = 0; x <= S; x += 0.02 * S) { ctx.lineTo(x, 0.9 * S - nz.fbm(x / S * 5 + 3, 2, 3, 2, 0.5) * 0.06 * S); }
    ctx.lineTo(S, S); ctx.closePath(); ctx.fill();
  }
});
