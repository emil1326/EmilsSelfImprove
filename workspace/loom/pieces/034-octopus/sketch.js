// Emil's Loom · piece 034 — "Mimic"
//
// An octopus in the deep, watchful — bulbous mantle, eight curling arms, one intelligent eye, and the
// HOOK: chromatophore skin, the mottled shifting colour-cells that let it vanish or blush in an instant
// (here, warm red-bronze flushed with cooler blooms). The living register again, but reaching past
// "pretty" for a genuine hook (the #55 audit): an octopus is alien and surprising in a way a swan isn't.
// Aimed at the felt "oh" ([[049-technical-pride-mispredicts-aim-for-the-aesthetic-oh]]) — warm life
// against cold deep water.
//
// The whole read lives in the SILHOUETTE first ([[035-defining-feature-is-often-the-hard-part]]): the
// curling tapered arms (a circle-brush along a curving centreline) + the mantle + the watchful eye with
// its horizontal pupil. Only once that reads do the skin and suckers go on. Warm body on cold water
// needs the tonal range to separate ([[022-luminosity-on-bright-is-tone]]). Composes noise (#3, the skin
// mottle + water) + glow (#8, the light from above) + the palette helpers. Static — a held, watching moment.
Loom.piece({
  id: "034",
  title: "Mimic",
  seed: "cephalopod",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, PI = Math.PI, U = S / 760;
    var cx = S * 0.5, headY = S * 0.40;                      // head/eye level
    var skin = Loom.noise(rng.int(1, 999999));

    // ---- deep water: a cold green-blue gradient, a faint shaft of light from above, motes ----
    var g = ctx.createLinearGradient(0, 0, 0, S);
    g.addColorStop(0, "#123038"); g.addColorStop(0.45, "#0c2630"); g.addColorStop(1, "#061319");
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "lighter";              // a soft shaft of surface light, upper area
    var ls = ctx.createRadialGradient(cx + S * 0.06, -S * 0.1, 0, cx + S * 0.06, -S * 0.1, S * 0.7);
    ls.addColorStop(0, "rgba(150,190,180,0.18)"); ls.addColorStop(1, "rgba(150,190,180,0)");
    ctx.fillStyle = ls; ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "source-over";

    // ---- octopus palette + a chromatophore skin sampler (warm base, flushed with cooler blooms) ----
    var base = Loom.hexToRgb("#b1492c"), litC = Loom.hexToRgb("#e08a48"), shad = Loom.hexToRgb("#5e2410"), cool = Loom.hexToRgb("#6a7e86");
    function skinColor(x, y, lift) {
      // THE HOOK — chromatophore skin: big warm/dark blotches, cool flush "blooms", fine stippled cells
      var m = skin.fbm(x / S * 5.5 + 2, y / S * 5.5, 4, 2.0, 0.55);        // big mottled blotches
      var bloom = skin.fbm(x / S * 2.1 + 20, y / S * 2.1 + 9, 3, 2.0, 0.5); // cool colour-flush regions
      var stip = skin.fbm(x / S * 40 + 5, y / S * 40, 2, 2.0, 0.5);        // fine chromatophore speckle
      var dk = Math.max(0, 0.5 - m) * 2.0, lt = Math.max(0, m - 0.5) * 2.0;
      var r = base.r + (litC.r - base.r) * lt - (base.r - shad.r) * dk;
      var gg = base.g + (litC.g - base.g) * lt - (base.g - shad.g) * dk;
      var b = base.b + (litC.b - base.b) * lt - (base.b - shad.b) * dk;
      if (bloom > 0.5) { var cb = Math.min(1, (bloom - 0.5) * 2.2); r += (cool.r - r) * cb * 0.72; gg += (cool.g - gg) * cb * 0.72; b += (cool.b - b) * cb * 0.72; }
      if (stip > 0.56) { var sp = Math.min(1, (stip - 0.56) * 2.6); r += (shad.r - r) * sp * 0.62; gg += (shad.g - gg) * sp * 0.62; b += (shad.b - b) * sp * 0.62; }
      var L = 1 + (lift || 0);
      return "rgb(" + Math.round(Math.max(0, Math.min(255, r * L))) + "," + Math.round(Math.max(0, Math.min(255, gg * L))) + "," + Math.round(Math.max(0, Math.min(255, b * L))) + ")";
    }

    // ---- an arm: a tapered curling tentacle (circle-brush along a curving centreline), + suckers ----
    function armPts(bx, by, ang, len, curl, baseW) {
      var pts = [], x = bx, y = by, a = ang, N = 30;
      for (var i = 0; i <= N; i++) {
        var t = i / N;
        pts.push({ x: x, y: y, r: baseW * Math.pow(1 - t, 0.8) + 0.6 * U });
        var step = len / N; a += curl / N * (0.6 + t);       // curls more toward the tip
        x += Math.cos(a) * step; y += Math.sin(a) * step;
      }
      return pts;
    }
    function drawArm(pts, front) {
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        ctx.fillStyle = skinColor(p.x, p.y, front ? 0.04 : -0.18);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
      }
      // suckers along the inner edge (every few steps), pale, sized to the arm
      if (front) for (var s = 4; s < pts.length - 2; s += 2) {
        var q = pts[s], dirx = pts[s + 1].x - pts[s - 1].x, diry = pts[s + 1].y - pts[s - 1].y, dl = Math.hypot(dirx, diry) || 1;
        var nx = diry / dl, ny = -dirx / dl;                 // perpendicular (inner side)
        var sr = q.r * 0.42;
        ctx.fillStyle = "rgba(238,196,158,0.85)";
        ctx.beginPath(); ctx.arc(q.x + nx * q.r * 0.45, q.y + ny * q.r * 0.45, sr, 0, TAU); ctx.fill();
      }
    }

    // arm directions (radiating from under the head), varied curl + length — a few behind, most in front
    var armBaseY = headY + S * 0.07;
    var arms = [
      { ang: PI * 0.78, len: 0.40, curl: 1.3, w: 0.052, front: false },
      { ang: PI * 0.62, len: 0.46, curl: 1.7, w: 0.055, front: false },
      { ang: PI * 0.95, len: 0.34, curl: -0.9, w: 0.050, front: false },
      { ang: PI * 0.50, len: 0.50, curl: 2.1, w: 0.060, front: true },
      { ang: PI * 0.40, len: 0.44, curl: -1.4, w: 0.056, front: true },
      { ang: PI * 0.30, len: 0.40, curl: -2.0, w: 0.052, front: true },
      { ang: PI * 0.66, len: 0.42, curl: 0.7, w: 0.058, front: true },
      { ang: PI * 0.18, len: 0.34, curl: -2.4, w: 0.046, front: true }
    ];
    for (var ai = 0; ai < arms.length; ai++) {              // per-seed jitter so 'weave another' re-poses the arms
      arms[ai].curl *= rng.range(0.72, 1.3); arms[ai].len *= rng.range(0.86, 1.14);
      arms[ai].ang += rng.range(-0.14, 0.14); arms[ai].w *= rng.range(0.9, 1.12);
    }
    function drawArms(front) {
      for (var i = 0; i < arms.length; i++) if (arms[i].front === front) {
        var a = arms[i];
        drawArm(armPts(cx + Math.cos(a.ang) * S * 0.05, armBaseY, a.ang, a.len * S, a.curl, a.w * S), front);
      }
    }

    drawArms(false);                                         // (1) the arms behind the body

    // ---- the mantle + head (a bulbous bezier body), filled with the skin ----
    var mantleTop = headY - S * 0.20;
    function bodyPath() {
      var p = new Path2D();
      p.moveTo(cx, mantleTop);                                // mantle tip
      p.bezierCurveTo(cx + S * 0.13, mantleTop + S * 0.02, cx + S * 0.135, headY - S * 0.01, cx + S * 0.12, headY + S * 0.04);
      p.bezierCurveTo(cx + S * 0.11, headY + S * 0.10, cx + S * 0.06, armBaseY + S * 0.02, cx, armBaseY + S * 0.03);
      p.bezierCurveTo(cx - S * 0.06, armBaseY + S * 0.02, cx - S * 0.11, headY + S * 0.10, cx - S * 0.12, headY + S * 0.04);
      p.bezierCurveTo(cx - S * 0.135, headY - S * 0.01, cx - S * 0.13, mantleTop + S * 0.02, cx, mantleTop);
      p.closePath(); return p;
    }
    var body = bodyPath();
    // fill the body by stamping skin colour over its bounding box, clipped to the path
    ctx.save(); ctx.clip(body);
    for (var yy = mantleTop - 2; yy < armBaseY + S * 0.05; yy += 3 * U) {
      for (var xx = cx - S * 0.15; xx < cx + S * 0.15; xx += 3 * U) {
        ctx.fillStyle = skinColor(xx, yy, 0); ctx.fillRect(xx, yy, 3 * U + 0.5, 3 * U + 0.5);
      }
    }
    // form shading: brighter top-left (lit from the surface), shadowed lower
    var fs = ctx.createLinearGradient(cx - S * 0.1, mantleTop, cx + S * 0.05, armBaseY);
    fs.addColorStop(0, "rgba(235,180,130,0.28)"); fs.addColorStop(0.5, "rgba(235,180,130,0)"); fs.addColorStop(1, "rgba(40,16,8,0.4)");
    ctx.fillStyle = fs; ctx.fillRect(cx - S * 0.15, mantleTop - 2, S * 0.3, armBaseY + S * 0.05 - mantleTop);
    ctx.restore();

    drawArms(true);                                          // (2) the arms in front of the body

    // ---- the eye: a domed lid, a golden iris, a horizontal slit pupil, a catchlight (the watching) ----
    var ex = cx - S * 0.052, ey = headY + S * 0.005, eR = S * 0.034;
    ctx.fillStyle = skinColor(ex, ey - eR, 0.12);            // a raised brow/lid mound
    ctx.beginPath(); ctx.ellipse(ex, ey, eR * 1.35, eR * 1.15, -0.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#d9ad52";                               // iris
    ctx.beginPath(); ctx.ellipse(ex, ey, eR, eR * 0.82, 0, 0, TAU); ctx.fill();
    var ig = ctx.createRadialGradient(ex, ey, 0, ex, ey, eR); // iris depth
    ig.addColorStop(0, "rgba(120,80,20,0.5)"); ig.addColorStop(1, "rgba(120,80,20,0)");
    ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(ex, ey, eR, eR * 0.82, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#150f08";                               // the horizontal slit/dumbbell pupil
    ctx.beginPath(); ctx.ellipse(ex, ey, eR * 0.72, eR * 0.22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(245,250,255,0.9)";                 // catchlight
    ctx.beginPath(); ctx.arc(ex - eR * 0.3, ey - eR * 0.28, eR * 0.14, 0, TAU); ctx.fill();
    // a dark crease over the eye for the heavy intelligent brow
    ctx.strokeStyle = "rgba(40,18,10,0.5)"; ctx.lineWidth = 2.2 * U; ctx.lineCap = "round";
    ctx.beginPath(); ctx.ellipse(ex, ey - eR * 0.2, eR * 1.3, eR * 1.0, -0.2, PI * 1.05, PI * 1.95); ctx.stroke();

    // ---- drifting marine motes + a soft vignette ----
    ctx.globalCompositeOperation = "lighter";
    for (var m = 0, nm = Math.round(50 * U); m < nm; m++) {
      var mx = rng.range(0, 1) * S, my = rng.range(0, 1) * S, mr = rng.range(0.4, 1.6) * U;
      ctx.fillStyle = "rgba(180,210,200," + rng.range(0.06, 0.22).toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(cx, headY, S * 0.3, cx, S * 0.5, S * 0.78);
    vg.addColorStop(0, "rgba(4,12,16,0)"); vg.addColorStop(1, "rgba(3,9,13,0.66)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
