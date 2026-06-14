// Emil's Loom · piece 077 — "Morpho"
//
// A blue morpho, wings spread — the butterfly whose colour isn't a pigment but STRUCTURE: microscopic ridges
// on the wing scales interfere with light, so the blue is a trick of physics, shifting cyan->violet with the
// angle and flashing metallic. That iridescence is the SING; the wing shape is only the READ. So (ran 083
// myself) the soul is the WING COLOUR, validated FIRST — a body-centred radial field: a blue ramp by distance,
// a cyan<->violet hue-shift by angle, a tight diagonal metallic sheen, faint scale mottle. On a lit ground the
// blue reads luminous by TONE/saturation, not additive glow ([[022-luminosity-on-bright-is-tone]]); the dark
// dappled jungle carries WARM golden light — the complement that makes the blue pop. Hand-composed, so it gets
// real variation AXES ([[085-hand-composed-pieces-make-near-clone-seeds-add-variation-axes]]): 3 species
// palettes (blue/teal/violet morpho) + a seeded sheen direction + seeded bokeh. Composes ramp + noise + glow.
Loom.piece({
  id: "077",
  title: "Morpho",
  seed: "menelaus",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var Bx = 0.5 * S, By = 0.545 * S;

    // ---- variation axes (085): species palette + sheen direction ----
    var MOODS = [
      { cyan: ["#0a1038", "#123a9e", "#1d6ee0", "#34a2ff", "#62c4ff"], violet: ["#100a44", "#2a18a4", "#4634d6", "#7a5cf0", "#a585ff"] }, // classic blue
      { cyan: ["#04201c", "#0a5a4c", "#11a07a", "#2ee0ac", "#86f8d6"], violet: ["#06283a", "#0e62a4", "#2a9ad8", "#74d8f0", "#c2f2ff"] }, // teal/green
      { cyan: ["#1a0a3e", "#461aa0", "#7a2ad8", "#b060f0", "#dca8ff"], violet: ["#2a0838", "#741a92", "#b83ac4", "#ec80e4", "#ffccf8"] }  // violet/magenta
    ];
    var M = rng.pick(MOODS);
    var rampCyan = Loom.ramp(M.cyan), rampViolet = Loom.ramp(M.violet);
    var sa = rng.range(-0.92, -0.5), scx = Math.cos(sa), scy = Math.sin(sa);   // sheen direction
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- wing outlines (right side; [ox,oy] offsets in S-units around the body), bezier, closed ----
    var FORE = [0.03, -0.05, 0.15, -0.20, 0.31, -0.21, 0.43, -0.13, 0.47, -0.03, 0.43, 0.045, 0.34, 0.07, 0.22, 0.075, 0.10, 0.05, 0.04, 0.03];
    var HIND = [0.035, 0.035, 0.17, 0.055, 0.27, 0.105, 0.305, 0.19, 0.305, 0.29, 0.205, 0.35, 0.115, 0.345, 0.065, 0.305, 0.038, 0.185, 0.03, 0.075];
    function addWing(side, p) {
      ctx.moveTo(Bx + side * p[0] * S, By + p[1] * S);
      for (var i = 2; i < p.length; i += 6)
        ctx.bezierCurveTo(Bx + side * p[i] * S, By + p[i + 1] * S, Bx + side * p[i + 2] * S, By + p[i + 3] * S, Bx + side * p[i + 4] * S, By + p[i + 5] * S);
      ctx.closePath();
    }
    function pathWings() { ctx.beginPath(); addWing(1, FORE); addWing(-1, FORE); addWing(1, HIND); addWing(-1, HIND); }
    function bez(p, u) {
      var segs = (p.length - 2) / 6, q = u * segs, si = Math.min(segs - 1, q | 0), lt = q - si, b = 2 + si * 6;
      var x0 = si === 0 ? p[0] : p[b - 2], y0 = si === 0 ? p[1] : p[b - 1], mt = 1 - lt;
      return [mt * mt * mt * x0 + 3 * mt * mt * lt * p[b] + 3 * mt * lt * lt * p[b + 2] + lt * lt * lt * p[b + 4],
              mt * mt * mt * y0 + 3 * mt * mt * lt * p[b + 1] + 3 * mt * lt * lt * p[b + 3] + lt * lt * lt * p[b + 5]];
    }

    // ---- background: dark dappled jungle understory with warm golden light (the blue's complement) ----
    var g = ctx.createRadialGradient(0.42 * S, 0.36 * S, 0.05 * S, 0.5 * S, 0.5 * S, 0.78 * S);
    g.addColorStop(0, "#1a2414"); g.addColorStop(0.55, "#121a0f"); g.addColorStop(1, "#080c08");
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    for (var b = 0; b < 30; b++) {                                   // out-of-focus foliage + light bokeh
      var bx = rng.range(0, S), by = rng.range(0, S) * 0.9, br = rng.range(0.05, 0.17) * S;
      var warm = rng.bool() && by < 0.55 * S;                        // golden dapples lean to the canopy
      Loom.glow(ctx, bx, by, br, warm ? "#d8aa54" : "#356a3c", warm ? 0.18 : 0.12, 0.55);
    }
    Loom.glow(ctx, 0.30 * S, 0.20 * S, 0.5 * S, "#e0b860", 0.10, 0.6);   // a soft shaft of canopy light

    // ---- the iridescent field, rendered offscreen then clipped to the wings ----
    var off = document.createElement("canvas"); off.width = S; off.height = S;
    var octx = off.getContext("2d"), img = octx.createImageData(S, S), data = img.data, cyc = [0, 0, 0], vio = [0, 0, 0];
    for (var y = 0; y < S; y++) {
      for (var x = 0; x < S; x++) {
        var dx = (x - Bx) / S, dy = (y - By) / S, r = Math.sqrt(dx * dx + dy * dy), ang = Math.atan2(dy, dx);
        var t = r / 0.345; if (t > 1) t = 1; var tb = Math.pow(t, 0.9);
        rampCyan.rgb(tb, cyc); rampViolet.rgb(tb, vio);
        var violet = 0.5 * (0.5 + 0.5 * Math.sin(ang * 2 + 0.5)) + 0.26 * t; if (violet > 1) violet = 1;
        var tex = nz.fbm(x * 0.02, y * 0.02, 4, 2, 0.5), bri = 1 + (tex - 0.5) * 0.12;
        var proj = dx * scx + dy * scy, sheen = Math.exp(-Math.pow((proj - 0.05) / 0.075, 2)) * 0.32;
        var i = (y * S + x) * 4;
        data[i]     = Math.max(0, Math.min(255, (cyc[0] + (vio[0] - cyc[0]) * violet) * bri + 120 * sheen));
        data[i + 1] = Math.max(0, Math.min(255, (cyc[1] + (vio[1] - cyc[1]) * violet) * bri + 155 * sheen));
        data[i + 2] = Math.max(0, Math.min(255, (cyc[2] + (vio[2] - cyc[2]) * violet) * bri + 210 * sheen));
        data[i + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.save(); pathWings(); ctx.clip(); ctx.drawImage(off, 0, 0, S, S);

    // veins: a few darker lines radiating from the body toward each wing margin (clip still active)
    ctx.strokeStyle = "rgba(8,14,38,0.30)"; ctx.lineWidth = 1.2 * U; ctx.lineCap = "round";
    for (var s = -1; s <= 1; s += 2) {
      var aim = [[0.40, -0.12], [0.30, 0.02], [0.20, 0.06], [0.24, 0.20], [0.12, 0.30]];
      for (var v = 0; v < aim.length; v++) {
        ctx.beginPath(); ctx.moveTo(Bx + s * 0.03 * S, By + 0.02 * S);
        ctx.lineTo(Bx + s * aim[v][0] * S, By + aim[v][1] * S); ctx.stroke();
      }
    }
    ctx.restore();

    // ---- dark margin border + pale submarginal dots (the morpho's signature edge) ----
    ctx.save(); pathWings(); ctx.clip();
    ctx.strokeStyle = "#15110a"; ctx.lineWidth = 13 * U; pathWings(); ctx.stroke();   // inner half = a border band
    ctx.fillStyle = "rgba(236,240,248,0.85)";
    for (var sd = -1; sd <= 1; sd += 2) {
      for (var u = 0.30; u <= 0.66; u += 0.06) { var pf = bez(FORE, u); dot(Bx + sd * pf[0] * S, By + pf[1] * S, 2.4 * U); }
      for (var u2 = 0.30; u2 <= 0.70; u2 += 0.07) { var ph = bez(HIND, u2); dot(Bx + sd * ph[0] * S, By + ph[1] * S, 2.3 * U); }
    }
    ctx.restore();
    function dot(x, y, rr) { ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill(); }

    // ---- body: furred thorax, segmented abdomen, head + eyes, clubbed antennae ----
    var bgr = ctx.createLinearGradient(0, By - 0.10 * S, 0, By + 0.30 * S);
    bgr.addColorStop(0, "#3c3422"); bgr.addColorStop(0.32, "#241d12"); bgr.addColorStop(1, "#120e08");
    ctx.fillStyle = bgr;
    ctx.beginPath(); ctx.ellipse(Bx, By + 0.105 * S, 0.020 * S, 0.155 * S, 0, 0, TAU); ctx.fill();   // abdomen
    ctx.strokeStyle = "rgba(8,6,3,0.5)"; ctx.lineWidth = 1.2 * U;                                     // abdomen segments
    for (var ab = 1; ab <= 6; ab++) { var ay = By + (0.02 + ab * 0.038) * S; ctx.beginPath(); ctx.moveTo(Bx - 0.018 * S, ay); ctx.lineTo(Bx + 0.018 * S, ay); ctx.stroke(); }
    ctx.fillStyle = bgr;
    ctx.beginPath(); ctx.ellipse(Bx, By - 0.035 * S, 0.030 * S, 0.062 * S, 0, 0, TAU); ctx.fill();    // thorax
    ctx.strokeStyle = "rgba(74,58,34,0.5)"; ctx.lineWidth = 1.1 * U; ctx.lineCap = "round";           // thorax fur
    for (var h = 0; h < 46; h++) {
      var ha = rng.range(0, TAU), hl = rng.range(0.02, 0.05) * S, hx = Bx + Math.cos(ha) * 0.012 * S, hy = By - 0.035 * S + Math.sin(ha) * 0.03 * S;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + Math.cos(ha) * hl, hy + Math.sin(ha) * hl * 0.7); ctx.stroke();
    }
    ctx.fillStyle = "#241c10"; ctx.beginPath(); ctx.arc(Bx, By - 0.088 * S, 0.020 * S, 0, TAU); ctx.fill();   // head
    ctx.fillStyle = "#0c0a06";
    dot(Bx - 0.015 * S, By - 0.090 * S, 0.011 * S); dot(Bx + 0.015 * S, By - 0.090 * S, 0.011 * S);          // eyes
    ctx.strokeStyle = "#1c150c"; ctx.lineWidth = 1.8 * U; ctx.lineCap = "round";                              // antennae
    for (var an = -1; an <= 1; an += 2) {
      var hx2 = Bx + an * 0.012 * S, hy2 = By - 0.10 * S, tx = Bx + an * 0.14 * S, ty = By - 0.20 * S;
      ctx.beginPath(); ctx.moveTo(hx2, hy2); ctx.quadraticCurveTo(Bx + an * 0.05 * S, By - 0.20 * S, tx, ty); ctx.stroke();
      ctx.fillStyle = "#1c150c"; ctx.beginPath(); ctx.ellipse(tx, ty, 0.012 * S, 0.006 * S, -0.6 * an, 0, TAU); ctx.fill();   // clubbed tip
    }
  }
});
