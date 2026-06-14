// Emil's Loom · piece 090 — "Sharpshooter"
//
// A panther chameleon at the instant of the strike: the tongue exploded out across a charged gap toward a
// doomed cricket, the turret eye swivelled and LOCKED on it, the body coiled tense on a branch. A chameleon
// is a familiar creature, so the ceiling is set by the EVENT, not the rendering (096): this is not a portrait
// of a lizard, it's a *shot being taken*. The hook is the strike; the bug is the CARRIER that gives the
// reaching tongue a direction and stakes and charges the negative space between them (094, the same move as
// Stoop's falcon-and-prey). Deliberately BRIGHT and matte — daylight tone on a vivid teal-and-orange body
// against a soft green foliage bokeh (022, tone not glow; the #130 audit's medium steer held one more piece).
// Self-directed end to end. Composes a spine-tube silhouette (060) + noise mottle + ramp bands.
Loom.piece({
  id: "090",
  title: "Sharpshooter",
  seed: "furcifer",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- seed parameters (calibrated WIDE so the strike, pose and colour vary per seed; 085/097) ----
    var f = rng.bool() ? 1 : -1;                          // facing: +1 right, -1 left
    var L = rng.range(0.48, 0.56) * S;                    // body length scale (leaves room for the strike)
    var ax = (f === 1 ? rng.range(0.36, 0.42) : rng.range(0.58, 0.64)) * S;  // anchor — snout-side room, tail in-frame (097)
    var ay = rng.range(0.55, 0.63) * S;
    var lightAng = rng.range(-2.5, -1.7);                 // daylight from upper-front
    var lx = Math.cos(lightAng), ly = Math.sin(lightAng);
    // the doomed cricket — up-and-FORWARD in the negative space, the CARRIER that aims the strike (094); in-frame
    var bugX = ax + f * rng.range(0.40, 0.50) * S;
    var bugY = ay - rng.range(0.30, 0.40) * S;

    // panther-chameleon palette (vivid subject, muted ground for separation; 057/045)
    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function css(c) { return "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")"; }
    // panther chameleons come in dramatic colour morphs — pick one (each kept distinct from the sage ground, 057)
    var morphs = [
      { b: [34, 150, 138], l: [70, 200, 178], d: [18, 86, 82], bn: [232, 112, 54], bd: [176, 60, 34] },   // teal + orange (classic)
      { b: [44, 112, 186], l: [96, 164, 228], d: [26, 66, 112], bn: [232, 96, 72], bd: [176, 56, 46] },   // blue + coral
      { b: [206, 92, 48], l: [244, 150, 84], d: [134, 52, 28], bn: [244, 206, 96], bd: [186, 134, 44] },  // red-orange + gold
      { b: [150, 178, 40], l: [200, 224, 96], d: [96, 118, 28], bn: [232, 128, 52], bd: [180, 80, 34] }   // lime + orange
    ];
    var M = rng.pick(morphs);
    var teal = M.b, tealLit = M.l, tealDark = M.d, band = M.bn, bandDk = M.bd;
    var bellyC = [206, 214, 132];                          // pale belly (light pools low)
    var stripeC = [236, 206, 88];                          // yellow lateral stripe

    // =========================================================================
    //  BACKGROUND — a soft daylit foliage bokeh, low-contrast so the subject pops
    // =========================================================================
    var bg = ctx.createLinearGradient(0, 0, S * 0.4, S);
    bg.addColorStop(0, "#9aac74"); bg.addColorStop(0.55, "#86996a"); bg.addColorStop(1, "#6c7f55");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    for (var b = 0; b < 26; b++) {                          // out-of-focus light blobs (dappled sun)
      var bx = rng.range(0, 1) * S, by = rng.range(0, 1) * S, br = rng.range(0.04, 0.16) * S;
      var warm = rng.bool();
      var bgl = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      var col = warm ? "rgba(200,214,150," : "rgba(120,150,96,";
      bgl.addColorStop(0, col + (warm ? 0.22 : 0.20) + ")"); bgl.addColorStop(1, col + "0)");
      ctx.fillStyle = bgl; ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill();
    }

    // =========================================================================
    //  geometry helpers — a smooth closed outline through a list of points
    // =========================================================================
    function smoothClosed(pts) {
      var n = pts.length;
      ctx.beginPath();
      ctx.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
      for (var i = 0; i < n; i++) { var p = pts[i], q = pts[(i + 1) % n]; ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
      ctx.closePath();
    }
    // a chameleon is laterally compressed — a tall leaf body; spine = centreline, offset asymmetrically
    // (deeper belly than back). spine entries: [localX, localY, halfDepthFraction]
    function worldX(s) { return ax + f * s[0] * L; }
    function worldY(s) { return ay + s[1] * L; }
    function bodyOutline(spine) {
      var n = spine.length, top = [], bot = [];
      for (var i = 0; i < n; i++) {
        var px = worldX(spine[i]), py = worldY(spine[i]);
        var a = spine[Math.max(i - 1, 0)], c = spine[Math.min(i + 1, n - 1)];
        var tx = worldX(c) - worldX(a), ty = worldY(c) - worldY(a), tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        var nx = -ty, ny = tx; if (ny > 0) { nx = -nx; ny = -ny; }   // normal points "up" (dorsal)
        var d = spine[i][2] * L;
        top.push([px + nx * d * 0.82, py + ny * d * 0.82]);
        bot.push([px - nx * d * 1.18, py - ny * d * 1.18]);
      }
      return top.concat(bot.reverse());
    }

    // ---- the chameleon spine: snout (front, +x) back over the arched back to the tail base ----
    var spine = [
      [0.60, 0.075, 0.020],   // snout tip
      [0.51, 0.055, 0.060],   // jaw / mouth
      [0.42, 0.005, 0.105],   // head
      [0.32, -0.050, 0.130],  // nape (casque rises here)
      [0.20, -0.092, 0.150],  // shoulder
      [0.02, -0.128, 0.158],  // back peak (the high arched crest)
      [-0.17, -0.100, 0.140], // mid back
      [-0.33, -0.045, 0.100], // hip
      [-0.45, 0.020, 0.055]   // tail base
    ];
    // ---- append the iconic curled tail as a tightening inward spiral ----
    var tb = spine[spine.length - 1];
    var spCx = tb[0] - 0.02, spCy = tb[1] + 0.125;          // spiral centre, below the tail base
    var r0 = 0.120, ang0 = 1.15, turns = 1.55, steps = 24;
    for (var k = 1; k <= steps; k++) {
      var tt = k / steps, ang = ang0 + turns * TAU * tt, r = r0 * Math.pow(0.905, k);
      spine.push([spCx + Math.cos(ang) * r, spCy - Math.sin(ang) * r, 0.050 * (1 - tt) + 0.006]);
    }

    // =========================================================================
    //  BRANCH — a diagonal perch under the feet (drawn behind the body)
    // =========================================================================
    var brAng = rng.range(0.12, 0.30) * f, bw = rng.range(0.05, 0.07) * S;
    var brY = ay + 0.165 * L;                               // branch passes just under the belly
    ctx.save();
    ctx.translate(ax, brY); ctx.rotate(brAng);
    var brg = ctx.createLinearGradient(0, -bw, 0, bw);
    brg.addColorStop(0, "#7a5c40"); brg.addColorStop(0.5, "#5e4530"); brg.addColorStop(1, "#3f2e20");
    ctx.fillStyle = brg; ctx.beginPath();
    ctx.moveTo(-S, -bw); ctx.lineTo(S, -bw * 0.8); ctx.lineTo(S, bw * 0.8); ctx.lineTo(-S, bw); ctx.closePath(); ctx.fill();
    // a little bark texture
    ctx.strokeStyle = "rgba(40,28,18,0.30)"; ctx.lineWidth = 1.2 * U;
    for (var bk = 0; bk < 7; bk++) { var yy = -bw + (bk / 6) * 2 * bw; ctx.beginPath(); ctx.moveTo(-S, yy + Math.sin(bk) * 2); ctx.lineTo(S, yy + Math.cos(bk) * 3); ctx.stroke(); }
    ctx.restore();

    // =========================================================================
    //  a gripping foot: a zygodactyl clamp on the branch (two opposed bundles)
    // =========================================================================
    function foot(hipX, hipY, shade) {
      var gx = hipX + f * 0.01 * L, gy = brY - bw * 0.22;    // grip point on top of the branch
      ctx.strokeStyle = shade; ctx.lineCap = "round";
      ctx.lineWidth = 0.038 * L;                              // the limb (slim)
      ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.quadraticCurveTo(hipX + f * 0.01 * L, hipY + 0.07 * L, gx, gy); ctx.stroke();
      ctx.lineWidth = 0.024 * L;                              // two opposed toe-bundles wrapping over the branch top
      ctx.beginPath(); ctx.moveTo(gx, gy - 0.01 * L); ctx.quadraticCurveTo(gx + f * 0.04 * L, gy, gx + f * 0.046 * L, gy + 0.04 * L); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx, gy - 0.01 * L); ctx.quadraticCurveTo(gx - f * 0.03 * L, gy, gx - f * 0.032 * L, gy + 0.035 * L); ctx.stroke();
    }
    // back foot (at the hip, slightly darker — drawn behind the body)
    foot(worldX(spine[7]), worldY(spine[7]), css(tealDark));

    // =========================================================================
    //  THE BODY — fill, skin bands, shading, rim light
    // =========================================================================
    var outline = bodyOutline(spine);
    // base fill
    smoothClosed(outline); ctx.fillStyle = css(teal); ctx.fill();
    // clip to the body for all skin detail
    ctx.save(); smoothClosed(outline); ctx.clip();
    // belly is paler (light pools low), back is darker
    var bodyTop = ay - 0.16 * L, bodyBot = ay + 0.17 * L;
    var vg = ctx.createLinearGradient(0, bodyTop, 0, bodyBot);
    vg.addColorStop(0, css(tealDark)); vg.addColorStop(0.5, css(teal)); vg.addColorStop(1, css(bellyC));
    ctx.globalAlpha = 0.55; ctx.fillStyle = vg; ctx.fillRect(ax - L, bodyTop, 2 * L, bodyBot - bodyTop); ctx.globalAlpha = 1;
    // vertical orange bands (panther-chameleon pattern), noise-jittered so they aren't mechanical (047)
    var nb = rng.int(7, 10);
    for (var bd = 0; bd < nb; bd++) {
      var t = bd / (nb - 1);
      var sx = worldX([0.46 - t * 0.92, 0, 0]);
      var jit = (nz.fbm(bd * 1.7, 3, 2) - 0.5) * 0.05 * L;
      var ww = (0.018 + 0.012 * nz.fbm(bd * 0.9, 7, 2)) * L;
      ctx.fillStyle = bd % 2 ? css(bandDk) : css(band);
      ctx.globalAlpha = 0.5 + 0.18 * nz.fbm(bd, 1, 2);
      ctx.beginPath(); ctx.ellipse(sx + jit, ay - 0.03 * L, ww, 0.22 * L, f * 0.12, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // a yellow lateral stripe along the flank
    ctx.strokeStyle = css(stripeC); ctx.lineWidth = 0.022 * L; ctx.lineCap = "round"; ctx.globalAlpha = 0.7;
    ctx.beginPath();
    for (var sp = 1; sp <= 7; sp++) { var s2 = spine[sp]; var X = worldX(s2), Y = worldY(s2) + 0.04 * L; if (sp === 1) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
    ctx.stroke(); ctx.globalAlpha = 1;
    // fine skin mottle
    ctx.globalAlpha = 0.10;
    for (var m = 0; m < 220; m++) {
      var mxp = ax + rng.range(-1, 0.6) * L, myp = ay + rng.range(-0.18, 0.18) * L;
      var v = nz.fbm(mxp * 0.04, myp * 0.04, 3);
      ctx.fillStyle = v > 0.5 ? css(tealLit) : css(tealDark);
      ctx.beginPath(); ctx.arc(mxp, myp, 0.01 * L, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // form shading: lit along the light direction, shadow opposite
    var shx = ax + lx * 0.3 * L, shy = ay + ly * 0.3 * L;
    var sg = ctx.createRadialGradient(shx, shy, 0.1 * L, ax, ay, 0.7 * L);
    sg.addColorStop(0, "rgba(255,250,220,0.28)"); sg.addColorStop(0.5, "rgba(255,250,220,0)"); sg.addColorStop(1, "rgba(10,40,40,0.32)");
    ctx.fillStyle = sg; ctx.fillRect(ax - L, ay - L, 2 * L, 2 * L);
    ctx.restore();
    // rim light on the lit dorsal edge
    ctx.save(); smoothClosed(outline); ctx.clip();
    ctx.strokeStyle = "rgba(240,255,210,0.5)"; ctx.lineWidth = 0.02 * L;
    smoothClosed(outline); ctx.stroke();
    ctx.restore();

    // =========================================================================
    //  CASQUE — the helmet crest at the back of the head
    // =========================================================================
    var hd = spine[2], np = spine[3];
    var casque = [
      [worldX(hd) - f * 0.02 * L, worldY(hd) - 0.10 * L],
      [worldX(np) + f * 0.01 * L, worldY(np) - 0.20 * L],   // the crest peak
      [worldX(np) - f * 0.06 * L, worldY(np) - 0.13 * L],
      [worldX(spine[4]) - f * 0.0 * L, worldY(spine[4]) - 0.05 * L]
    ];
    smoothClosed(casque); ctx.fillStyle = css(mix(teal, tealDark, 0.35)); ctx.fill();

    // =========================================================================
    //  THE TURRET EYE — swivelled and LOCKED on the target (the strike's intent)
    // =========================================================================
    var ex = worldX([0.40, -0.03, 0]), ey = worldY([0.40, -0.03, 0]);
    var er = 0.085 * L;
    // the conical turret mound
    var eg = ctx.createRadialGradient(ex - lx * er * 0.4, ey - ly * er * 0.4, er * 0.1, ex, ey, er);
    eg.addColorStop(0, css(tealLit)); eg.addColorStop(0.7, css(teal)); eg.addColorStop(1, css(tealDark));
    ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(ex, ey, er, 0, TAU); ctx.fill();
    // concentric skin lids converging on a small aperture
    ctx.strokeStyle = "rgba(20,70,66,0.5)"; ctx.lineWidth = 1.4 * U;
    for (var rr = 0.85; rr > 0.3; rr -= 0.22) { ctx.beginPath(); ctx.arc(ex, ey, er * rr, 0, TAU); ctx.stroke(); }
    // pupil offset toward the target (the bug) = the lock that telegraphs the strike's intent
    var edx = bugX - ex, edy = bugY - ey, edl = Math.hypot(edx, edy) || 1;
    var pux = ex + (edx / edl) * er * 0.42, puy = ey + (edy / edl) * er * 0.42;
    ctx.fillStyle = "#11100c"; ctx.beginPath(); ctx.arc(pux, puy, er * 0.26, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,240,180,0.9)"; ctx.beginPath(); ctx.arc(pux - lx * er * 0.1, puy - ly * er * 0.1, er * 0.08, 0, TAU); ctx.fill();

    // =========================================================================
    //  THE STRIKE — open mouth, the projectile tongue, the doomed cricket
    // =========================================================================
    // the gape — a small rounded dark open mouth at the snout, the tongue's origin (tucked, reads as a mouth not a block)
    var snout = [worldX(spine[0]), worldY(spine[0])];
    var jaw = [worldX(spine[1]), worldY(spine[1])];
    ctx.fillStyle = "#3a1210";
    ctx.save(); ctx.translate(snout[0] - f * 0.01 * L, snout[1] + 0.014 * L); ctx.rotate(f * 0.32);
    ctx.beginPath(); ctx.ellipse(0, 0, 0.055 * L, 0.026 * L, 0, 0, TAU); ctx.fill();
    ctx.restore();

    // the tongue: a tapering projectile from the mouth, arcing to the bug, with a bulbous sticky pad
    var mouthX = snout[0] + f * 0.03 * L, mouthY = snout[1] + 0.008 * L;
    var reach = Math.hypot(bugX - mouthX, bugY - mouthY);
    var midX = (mouthX + bugX) / 2 + f * 0.04 * L, midY = (mouthY + bugY) / 2 - 0.12 * reach;  // slight ballistic arc
    // build the tongue as a filled tapering ribbon along the quadratic path
    var tp = [], bp = [], TN = 18;
    for (var s = 0; s <= TN; s++) {
      var u = s / TN, iu = 1 - u;
      var qx = iu * iu * mouthX + 2 * iu * u * midX + u * u * bugX;
      var qy = iu * iu * mouthY + 2 * iu * u * midY + u * u * bugY;
      var dqx = 2 * iu * (midX - mouthX) + 2 * u * (bugX - midX);
      var dqy = 2 * iu * (midY - mouthY) + 2 * u * (bugY - midY);
      var dl = Math.hypot(dqx, dqy) || 1; var nxx = -dqy / dl, nyy = dqx / dl;
      var wdt = (0.040 * (1 - u) + 0.012) * L;               // thick at mouth, thin toward the tip
      tp.push([qx + nxx * wdt, qy + nyy * wdt]); bp.push([qx - nxx * wdt, qy - nyy * wdt]);
    }
    smoothClosed(tp.concat(bp.reverse()));
    var tg = ctx.createLinearGradient(mouthX, mouthY, bugX, bugY);
    tg.addColorStop(0, "#c44a5a"); tg.addColorStop(1, "#e87f86");
    ctx.fillStyle = tg; ctx.fill();
    // a wet highlight down the tongue
    ctx.strokeStyle = "rgba(255,210,210,0.5)"; ctx.lineWidth = 0.012 * L; ctx.lineCap = "round";
    ctx.beginPath();
    for (var s2b = 0; s2b <= TN; s2b += 2) { var u2 = s2b / TN, iu2 = 1 - u2; var hx = iu2 * iu2 * mouthX + 2 * iu2 * u2 * midX + u2 * u2 * bugX, hy = iu2 * iu2 * mouthY + 2 * iu2 * u2 * midY + u2 * u2 * bugY; if (s2b === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy); }
    ctx.stroke();
    // the sticky pad at the tip (the suction cup reaching the bug)
    var pad = ctx.createRadialGradient(bugX, bugY, 0, bugX, bugY, 0.07 * L);
    pad.addColorStop(0, "#f3a3a8"); pad.addColorStop(0.7, "#d65f6b"); pad.addColorStop(1, "rgba(190,70,84,0)");
    ctx.fillStyle = pad; ctx.beginPath(); ctx.arc(bugX, bugY, 0.07 * L, 0, TAU); ctx.fill();

    // the cricket — small, doomed, in the charged gap (094)
    ctx.save(); ctx.translate(bugX, bugY); ctx.rotate(f * -0.5);
    ctx.fillStyle = "#2e2a1e";
    ctx.beginPath(); ctx.ellipse(0, 0, 0.05 * L, 0.022 * L, 0, 0, TAU); ctx.fill();      // body
    ctx.beginPath(); ctx.arc(0.05 * L, -0.004 * L, 0.018 * L, 0, TAU); ctx.fill();         // head
    ctx.strokeStyle = "rgba(40,36,26,0.85)"; ctx.lineWidth = 1.1 * U; ctx.lineCap = "round";
    for (var lg = 0; lg < 3; lg++) { var bxl = -0.03 * L + lg * 0.03 * L; ctx.beginPath(); ctx.moveTo(bxl, 0.01 * L); ctx.lineTo(bxl - 0.012 * L, 0.05 * L); ctx.lineTo(bxl + 0.02 * L, 0.075 * L); ctx.stroke(); }   // jumping legs
    ctx.beginPath(); ctx.moveTo(0.06 * L, -0.01 * L); ctx.lineTo(0.12 * L, -0.06 * L); ctx.stroke();  // antenna
    ctx.beginPath(); ctx.moveTo(0.06 * L, -0.01 * L); ctx.lineTo(0.12 * L, -0.02 * L); ctx.stroke();
    ctx.restore();

    // front foot (over the branch, in front of the body)
    foot(worldX(spine[4]), worldY(spine[4]) + 0.02 * L, css(mix(teal, tealDark, 0.2)));
  }
});
