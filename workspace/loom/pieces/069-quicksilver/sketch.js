// Emil's Loom · piece 069 — "Quicksilver"
//
// A bait ball: thousands of small fish wheeling underwater as one dense, swirling sphere while a predator
// slashes through, and the silver SHIMMER that ripples across the school as a wave of them turns broadside
// to the light all at once. Living MOTION (the lane Murmuration #017 landed a 5 in) — and the SECOND consumer
// of the flock primitive (#12, dormant since #017): the same boids soul, a wholly different world (deep blue
// water, a sleek hunter, the flash). Chosen by PULL ([[075-i-reach-for-impressive-to-make-and-miscall-it-my-strength]]).
//
// The register that wants to default away here is the SHAPE (the advisor; [[079-...]]/[[080-...]] in a fresh
// costume): flock.js is tuned to make a *roaming murmuration* and explicitly AVOIDS a round blob — so a default
// flock would be "Murmuration but blue," not a bait ball. Tuned against its grain (high center, low wander,
// tight bowl) and the ball SHAPE verified at the dots stage BEFORE skinning ([[032-validate-the-soul-before-the-skin]]).
// The silver FLASH is the defining feature ([[035-defining-feature-is-often-the-hard-part]]), not polish —
// coordinated waves as fish wheel broadside. Diffuse light, NO beams (device-watch [[073-...]] — beams in the
// last two pieces). Deterministic time-stepping ([[070-...]]/[[017-animation-seed-setup-once]]). Composes flock + ramp + noise + glow.
Loom.piece({
  id: "069",
  title: "Quicksilver",
  seed: "baitball",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var clamp = function (t, a, b) { return t < a ? a : t > b ? b : t; };

    // ---- the school: flock.js (#12) tuned AGAINST its grain into a tight BAIT BALL ----
    var boxW = S * 0.74, boxH = S * 0.74, boxD = S * 0.58;
    var fl = Loom.flock(rng, {
      n: 2800, w: boxW, h: boxH, d: boxD,
      k: 7, sepDist: S * 0.026, sep: 1.7, coh: 1.2, ali: 1.0,
      wander: 0.06, margin: 0.34, center: 2.2,
      predator: { radius: S * 0.085, force: 0.0014 * boxW * 5 }   // gentle: dimples the ball, doesn't scatter it
    });

    // ---- underwater palette (diffuse surface light up top → deep blue below; no shafts) ----
    var SCHEMES = [
      { water: ["#3a7d8c", "#206072", "#143f56", "#0a2740", "#06182e"], surface: "#8fdbe0" },
      { water: ["#2f6e8e", "#1d5074", "#123a5e", "#0a2444", "#06182e"], surface: "#8ec8ea" },
      { water: ["#2a6f7c", "#185464", "#103a4e", "#0a2336", "#051526"], surface: "#86d6cc" }
    ];
    var sc = rng.pick(SCHEMES);
    var sunX = rng.range(0.38, 0.62) * S;
    var motes = [];
    for (var mi = 0; mi < 80; mi++) motes.push([rng.range(0, 1) * S, rng.range(0, 1) * S, rng.range(0.4, 1.5) * U, rng.range(0.05, 0.22)]);

    function bg() {
      var g = ctx.createLinearGradient(0, 0, 0, S);
      for (var i = 0; i < sc.water.length; i++) g.addColorStop(i / (sc.water.length - 1), sc.water[i]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      var sg = ctx.createRadialGradient(sunX, -0.12 * S, 0, sunX, -0.12 * S, S * 0.78);   // diffuse surface light
      sg.addColorStop(0, Loom.rgba(sc.surface, 0.42)); sg.addColorStop(0.5, Loom.rgba(sc.surface, 0.08)); sg.addColorStop(1, Loom.rgba(sc.surface, 0));
      ctx.fillStyle = sg; ctx.fillRect(0, 0, S, S);
      for (var m = 0; m < motes.length; m++) { ctx.fillStyle = "rgba(200,224,232," + motes[m][3] + ")"; ctx.beginPath(); ctx.arc(motes[m][0], motes[m][1], motes[m][2], 0, TAU); ctx.fill(); }
    }

    // ---- skin: each fish an oriented lozenge whose SILVER FLASH (the defining feature, 035) rides on how
    //      BROADSIDE it is to the viewer — a fish wheeling flank-on flashes bright, one swimming end-on is a
    //      thin dark fleck; because neighbours align, the flash sweeps the school in COORDINATED WAVES.
    //      Binned by depth × flash so the whole school paints in ~20 fills (Murmuration #017's batching). ----
    var ND = 5, NF = 4, body = [28, 54, 74], silver = [240, 248, 250], hz = Loom.hexToRgb(sc.water[1]);
    var binCol = [], binW = [], binL = [], binA = [];
    for (var db = 0; db < ND; db++) {
      var depth0 = ND > 1 ? db / (ND - 1) : 1;                  // 0 far → 1 near
      for (var fb = 0; fb < NF; fb++) {
        var f0 = NF > 1 ? fb / (NF - 1) : 1;                    // 0 end-on → 1 broadside flash
        var r = lerp(body[0], silver[0], f0), g = lerp(body[1], silver[1], f0), b = lerp(body[2], silver[2], f0);
        var haze = (1 - depth0) * 0.72;                         // far fish dissolve into the blue
        r = lerp(r, hz.r, haze); g = lerp(g, hz.g, haze); b = lerp(b, hz.b, haze);
        binCol.push("rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")");
        binW.push((0.55 + 0.45 * f0) * (0.5 + 0.85 * depth0) * U);  // body depth ~ constant, near = bigger
        binL.push((0.7 + 2.4 * f0) * (0.6 + 0.9 * depth0) * U);     // end-on = short fleck, broadside = long dart
        binA.push((0.30 + 0.64 * f0) * (0.45 + 0.55 * depth0));     // dim-but-present → bright: shimmer modulates a ball that stays dense
      }
    }
    var binOf = new Int16Array(fl.n);

    function render() {
      bg();
      // a CAMERA that tracks the school: centre on the live centroid + a gentle zoom, so the ball is always
      // framed and filling regardless of where the flock wanders in its box (the predator darts in from the edge)
      var mx = 0, my = 0; for (var c = 0; c < fl.n; c++) { mx += fl.x[c]; my += fl.y[c]; } mx /= fl.n; my /= fl.n;
      var camX = S * 0.5, camY = S * 0.47, DS = 1.35;
      for (var i = 0; i < fl.n; i++) {
        var depth = clamp(fl.z[i] / boxD, 0, 1);
        var vx = fl.vx[i], vy = fl.vy[i], vz = fl.vz[i], sp = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1e-4;
        var broad = 1 - Math.abs(vz) / sp;                      // 0 end-on → 1 broadside
        var f = clamp(broad * broad * 1.15, 0, 1);
        var db = clamp((depth * ND) | 0, 0, ND - 1), fb = clamp((f * NF) | 0, 0, NF - 1);
        binOf[i] = db * NF + fb;
      }
      for (var bn = 0; bn < ND * NF; bn++) {                    // far→near (depth is the outer index in bn)
        ctx.fillStyle = binCol[bn]; ctx.globalAlpha = binA[bn];
        var L = binL[bn] * DS, W = binW[bn] * DS;
        ctx.beginPath();
        for (var p = 0; p < fl.n; p++) {
          if (binOf[p] !== bn) continue;
          var ux = fl.vx[p], uy = fl.vy[p], m = Math.sqrt(ux * ux + uy * uy) || 1e-4, dx = ux / m, dy = uy / m, ex = -dy, ey = dx;
          var x = camX + (fl.x[p] - mx) * DS, y = camY + (fl.y[p] - my) * DS;
          ctx.moveTo(x + dx * L, y + dy * L); ctx.lineTo(x + ex * W, y + ey * W);
          ctx.lineTo(x - dx * L, y - dy * L); ctx.lineTo(x - ex * W, y - ey * W); ctx.closePath();
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // the predator — a sleek dark fusiform, oriented along its heading (minimal, 061)
      if (fl.pred) {
        var qx = fl.pred.vx, qy = fl.pred.vy, qm = Math.sqrt(qx * qx + qy * qy) || 1e-4, dx = qx / qm, dy = qy / qm, ex = -dy, ey = dx;
        var px = camX + (fl.pred.x - mx) * DS, py = camY + (fl.pred.y - my) * DS, PL = 14 * U * DS, PW = 4.6 * U * DS;
        ctx.fillStyle = "#05121d";
        ctx.beginPath();
        ctx.moveTo(px + dx * PL, py + dy * PL);
        ctx.quadraticCurveTo(px + ex * PW, py + ey * PW, px - dx * PL * 0.95, py - dy * PL * 0.95);
        ctx.quadraticCurveTo(px - ex * PW, py - ey * PW, px + dx * PL, py + dy * PL);
        ctx.fill();
        ctx.beginPath();                                        // tail fin
        ctx.moveTo(px - dx * PL * 0.9, py - dy * PL * 0.9);
        ctx.lineTo(px - dx * PL * 1.6 + ex * PW * 1.4, py - dy * PL * 1.6 + ey * PW * 1.4);
        ctx.lineTo(px - dx * PL * 1.6 - ex * PW * 1.4, py - dy * PL * 1.6 - ey * PW * 1.4);
        ctx.closePath(); ctx.fill();
      }
    }

    // ---- animation: warm pre-roll → a formed ball at t=0; deterministic, frame-rate independent ----
    var WARM = 90;
    for (var w0 = 0; w0 < WARM; w0++) fl.step();
    var STEP_RATE = 38;
    function advanceTo(t) { var target = WARM + Math.floor(t * STEP_RATE), g = 0; while (fl.steps < target && g < 6) { fl.step(); g++; } render(); }

    render();
    if (window.LOOM_GALLERY) { var t0 = performance.now(); (function loop() { advanceTo((performance.now() - t0) / 1000); requestAnimationFrame(loop); })(); return; }
    return function (t) { advanceTo(t); };
  }
});
