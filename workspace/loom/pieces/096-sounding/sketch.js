// Emil's Loom · piece 096 — "Sounding"
//
// A great whale sounding — but through a sea of CLOUD instead of water: a humpback the size of a ship gliding
// down a vast bright sky, impossibly aloft, serene. The hook is the surreal awe (a creature of the deepest
// ocean in the air, the surprise + the majesty — my Salar lane), so the whole job is to render it SUBLIME, not
// twee: backlit and luminous against a luminous sky, immense, a tiny skein of birds beside it for scale. Chosen
// by the #137 two-gate check — the hero is a creature SILHOUETTE + bright-sky atmosphere (both strengths, 035/022),
// the clouds kept SOFT and supporting so my cloud weak-spot (069) never carries the piece (the #135 reframe); AND
// the concept has a real hook (surreal awe), not just pretty. Self-directed; no advisor (no fork, 099). Composes
// glow + noise + ramp.
Loom.piece({
  id: "096",
  title: "Sounding",
  seed: "cetacea",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- seed parameters (wide; the sky mood, whale placement/heading, birds vary; 085/097) ----
    var faceX = rng.bool() ? 1 : -1;                       // the whale heads left or right
    var wx = rng.range(0.42, 0.58) * S, wy = rng.range(0.38, 0.50) * S;
    var L = rng.range(0.64, 0.74) * S;                     // whale length — immense, but mostly in-frame
    var glide = rng.range(0.08, 0.22) * faceX;             // gentle downward sounding tilt
    var warmth = rng.range(0, 1);                          // cool-blue day .. warm golden hour
    var sunX = wx + faceX * 0.05 * S, sunY = wy - 0.12 * S;   // the sun behind the whale → a backlit, eclipsing glow

    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function css(c) { return "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")"; }
    var skyTop = mix([96, 138, 196], [120, 130, 180], warmth);
    var skyMid = mix([176, 206, 226], [224, 206, 198], warmth);
    var skyLow = mix([224, 232, 232], [248, 222, 176], warmth);

    // =========================================================================
    //  THE SKY — a luminous wash, brighter toward the sun and the cloud-sea
    // =========================================================================
    var sky = ctx.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, css(skyTop)); sky.addColorStop(0.52, css(skyMid)); sky.addColorStop(1, css(skyLow));
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);
    // the sun, a soft high glow
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, sunX, sunY, 0.62 * S, css(mix([255, 240, 210], [255, 224, 166], warmth)), 0.28, 0.6);
    Loom.glow(ctx, sunX, sunY, 0.2 * S, "#fff6e2", 0.6, 0.4);
    // a sunburst of god-rays behind the whale — the whale eclipses the sun, light bursting round it
    for (var gr = 0; gr < 16; gr++) {
      var ga2 = (gr / 16) * TAU + rng.range(-0.12, 0.12), gl = rng.range(0.34, 0.66) * S;
      var rg = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(ga2) * gl, sunY + Math.sin(ga2) * gl);
      rg.addColorStop(0, "rgba(255,246,216,0.11)"); rg.addColorStop(1, "rgba(255,246,216,0)");
      ctx.strokeStyle = rg; ctx.lineWidth = rng.range(7, 20) * U; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(sunX, sunY); ctx.lineTo(sunX + Math.cos(ga2) * gl, sunY + Math.sin(ga2) * gl); ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";

    // =========================================================================
    //  THE CLOUD-SEA — a soft luminous bank below, simple + supporting (the whale is the hero)
    // =========================================================================
    function cloudBank(baseY, amp, col, alpha) {
      ctx.fillStyle = col; ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.moveTo(0, S);
      for (var x = 0; x <= S; x += 6) {
        var y = baseY + (nz.fbm(x / S * 2.4 + baseY, baseY * 0.01, 3) - 0.5) * amp
              + Math.sin(x / S * 5 + baseY) * amp * 0.2;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(S, S); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    }
    cloudBank(0.80 * S, 0.05 * S, css(mix([214, 224, 230], [240, 224, 198], warmth)), 0.5);
    cloudBank(0.86 * S, 0.045 * S, css(mix([232, 238, 240], [252, 236, 212], warmth)), 0.7);
    cloudBank(0.93 * S, 0.04 * S, "#fbfdfd", 0.85);
    // a few soft drifting puffs up in the sky
    for (var p = 0; p < 7; p++) {
      var px = rng.range(0.05, 0.95) * S, py = rng.range(0.12, 0.62) * S, pr = rng.range(0.04, 0.11) * S;
      var cg = ctx.createRadialGradient(px, py, 0, px, py, pr);
      cg.addColorStop(0, "rgba(255,255,255," + rng.range(0.10, 0.26).toFixed(2) + ")"); cg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(px, py, pr, pr * 0.55, 0, 0, TAU); ctx.fill();
    }

    // =========================================================================
    //  THE WHALE — backlit, luminous, immense; the hero (silhouette-first, 035)
    // =========================================================================
    function smoothClosed(pts) {
      var n = pts.length;
      ctx.beginPath();
      ctx.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
      for (var i = 0; i < n; i++) { var a = pts[i], b = pts[(i + 1) % n]; ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
      ctx.closePath();
    }
    ctx.save();
    ctx.translate(wx, wy); ctx.rotate(glide); ctx.scale(faceX, 1); ctx.scale(L, L);   // local frame: head +x, belly +y, unit ~ L

    // body outline — a humpback: blunt head + big lower jaw, robust body, narrow tail stock
    var body = [
      [0.50, 0.0], [0.42, -0.07], [0.28, -0.11], [0.02, -0.115], [-0.16, -0.10], [-0.36, -0.035],   // head + back
      [-0.36, 0.035], [-0.10, 0.12], [0.12, 0.155], [0.40, 0.10], [0.49, 0.04]                        // belly + jaw
    ];
    // the body — soft luminous blue-grey, faintly translucent (ethereal, backlit)
    smoothClosed(body);
    var bg = ctx.createLinearGradient(0, -0.14, 0, 0.16);
    bg.addColorStop(0, "rgba(112,140,172,0.9)");        // back, catching the sky
    bg.addColorStop(0.5, "rgba(62,84,116,0.95)");       // flank, soft shadow
    bg.addColorStop(1, "rgba(86,110,140,0.9)");         // belly, a faint glow
    ctx.fillStyle = bg; ctx.fill();

    // surface detail, clipped to the body
    ctx.save(); smoothClosed(body); ctx.clip();
    ctx.strokeStyle = "rgba(38,54,80,0.42)"; ctx.lineWidth = 0.006; ctx.lineCap = "round";
    for (var tp = 0; tp < 7; tp++) { var ty = 0.0 + tp * 0.024; ctx.beginPath(); ctx.moveTo(0.46, ty); ctx.quadraticCurveTo(0.2, ty + 0.055, -0.06, ty + 0.04); ctx.stroke(); }   // ventral pleats
    ctx.fillStyle = "rgba(40,56,82,0.5)";
    for (var tb = 0; tb < 6; tb++) { ctx.beginPath(); ctx.arc(0.48 - tb * 0.04, -0.03 - tb * 0.012, 0.008, 0, TAU); ctx.fill(); }   // head tubercles
    ctx.restore();

    // flukes — broad, notched, raised
    ctx.fillStyle = "rgba(56,78,110,0.95)";
    smoothClosed([[-0.34, 0.0], [-0.50, -0.14], [-0.62, -0.16], [-0.54, -0.04], [-0.64, -0.005], [-0.54, 0.03], [-0.60, 0.13], [-0.48, 0.05], [-0.34, 0.04]]); ctx.fill();

    // dorsal fin — a small hump ~two-thirds back
    ctx.fillStyle = "rgba(60,82,114,0.95)";
    smoothClosed([[-0.14, -0.10], [-0.185, -0.165], [-0.24, -0.105], [-0.18, -0.085]]); ctx.fill();

    // the mouthline + eye
    ctx.strokeStyle = "rgba(34,48,72,0.6)"; ctx.lineWidth = 0.007; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0.49, 0.045); ctx.quadraticCurveTo(0.40, 0.085, 0.26, 0.10); ctx.stroke();
    ctx.fillStyle = "#1c2a3a"; ctx.beginPath(); ctx.arc(0.345, 0.02, 0.014, 0, TAU); ctx.fill();

    // near pectoral — the long, pale, wing-like fin (the humpback signature)
    ctx.fillStyle = "rgba(170,196,216,0.95)";
    smoothClosed([[0.22, 0.06], [0.32, 0.30], [0.32, 0.50], [0.25, 0.52], [0.15, 0.30], [0.10, 0.10]]); ctx.fill();
    ctx.strokeStyle = "rgba(150,178,200,0.5)"; ctx.lineWidth = 0.005; ctx.lineJoin = "round";
    smoothClosed([[0.22, 0.06], [0.32, 0.30], [0.32, 0.50], [0.25, 0.52], [0.15, 0.30], [0.10, 0.10]]); ctx.stroke();

    // a subtle warm backlit rim along the edges (the sun behind)
    ctx.lineJoin = "round";
    smoothClosed(body); ctx.strokeStyle = "rgba(255,240,206,0.55)"; ctx.lineWidth = 0.006; ctx.stroke();
    ctx.restore();

    // =========================================================================
    //  a small skein of birds beside the whale — the scale that makes it immense
    // =========================================================================
    var nb = rng.int(6, 11), bgx = wx - faceX * 0.40 * L, bgy = wy - 0.20 * L;
    ctx.strokeStyle = "rgba(56,70,92,0.65)"; ctx.lineWidth = 1.2 * U; ctx.lineCap = "round";
    for (var b = 0; b < nb; b++) {
      var bxx = bgx + rng.range(-0.10, 0.10) * S, byy = bgy + rng.range(-0.07, 0.07) * S, bw = rng.range(2.4, 5) * U;
      ctx.beginPath();
      ctx.moveTo(bxx - bw, byy + bw * 0.4); ctx.quadraticCurveTo(bxx, byy - bw * 0.3, bxx, byy);
      ctx.quadraticCurveTo(bxx, byy - bw * 0.3, bxx + bw, byy + bw * 0.4); ctx.stroke();
    }

    // =========================================================================
    //  atmosphere — a gentle vignette, a touch of haze
    // =========================================================================
    var vig = ctx.createRadialGradient(0.5 * S, 0.46 * S, 0.42 * S, 0.5 * S, 0.5 * S, 0.82 * S);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(60,70,96,0.26)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);
  }
});
