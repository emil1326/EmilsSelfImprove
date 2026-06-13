// Emil's Loom · piece 059 — "Glacier"
//
// Inside a glacier ice cave, looking toward the glowing mouth. The whole hook is one piece of physics:
// thick ice is BLUE because it swallows the long (red) wavelengths and only the blue survives the journey
// through it — so the thin ice at the bright opening reads near-white daylight, and the deep walls go
// cerulean, then teal, then a dark navy where the ice is thickest. Nobody paints the colour; it falls
// out of "how much ice did the light cross to reach here." That absorption-by-thickness IS the defining
// feature ([[035-defining-feature-is-often-the-hard-part]]) and the awe hook at once — the serene-LIGHT
// lane my actual 5s live in (Aurora/God-rays), NOT the cataclysm lane I keep mislabelling as my strength
// ([[072-judge-by-the-hook-not-the-category-recheck-patterns-against-the-data]]). A deliberate swing clear
// of three ruts at once: no lone figure ([[073-a-lesson-applied-by-reflex-becomes-a-rut]]), no
// system-grows-itself sim (Ebru/Physarum/Meander ran that three times), no disaster.
//
// Built as a per-pixel FIELD ([[038-render-fields-numerically-then-upscale]] — a SOFT field, so render
// small + upscale): the lowest-variance risk shape ([[062-field-subjects-are-lower-variance-than-silhouettes]])
// — the blue-around-a-bright-mouth read always holds; the fluted ice texture is upside, not the gate.
// thickness(pixel) → an ice ramp; daylight(pixel) multiplies brightness. Composes field #16 + noise #3 +
// ramp #11 + glow #8. Static, reproducible (pure function of the seed).
Loom.piece({
  id: "059",
  title: "Glacier",
  seed: "cerulean",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    function smoothstep(a, b, x) { if (a === b) return x < a ? 0 : 1; var t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

    // ---- the mouth (the daylight opening) — seed-varied, kept upper-centre so the walls enclose it ----
    var ox = 0.5 + rng.range(-0.13, 0.15);
    var oy = 0.40 + rng.range(-0.07, 0.13);
    var rO = rng.range(0.13, 0.19);               // its size
    var aspX = rng.range(0.85, 1.25);             // mouth a touch oval

    // ---- fluting: long scallops carved down the walls (the "this is ice, not blue fog" tell) ----
    var fluteAng = rng.range(0, 3.1416);
    var fluteF = rng.range(2.6, 4.2);
    var ca = Math.cos(fluteAng), sa = Math.sin(fluteAng);

    // ---- the ice gradient: thin daylight → cerulean → teal → navy. The blue-where-thick physics. ----
    var ice = Loom.ramp([
      "#c8e4f0", "#9fd6ea", "#6dc0de", "#3f9fc9",
      "#2580ad", "#13608d", "#0b4063", "#061f33"
    ]);

    var nWarp = Loom.noise(rng.int(1, 999999));   // domain warp (kills the too-regular tell, 047)
    var nIce = Loom.noise(rng.int(1, 999999));    // ice banding / internal structure
    var nCr = Loom.noise(rng.int(1, 999999));     // fractures

    var R = Math.round(S * 0.5);                   // soft field: render small, upscale (038)
    var col = [0, 0, 0];

    var field = Loom.field(R, function (x, y, out) {
      var nx = x / R, ny = y / R;
      // domain warp so the mouth is irregular and the ice never looks procedural
      var wx = nWarp.fbm(nx * 2.2, ny * 2.2, 3, 2, 0.5) - 0.5;
      var wy = nWarp.fbm(nx * 2.2 + 5.3, ny * 2.2 + 5.3, 3, 2, 0.5) - 0.5;
      var dx = (nx - ox) * aspX + wx * 0.10, dy = (ny - oy) + wy * 0.10;
      var openD = Math.sqrt(dx * dx + dy * dy);

      // DAYLIGHT from the mouth — a gentle gradient, NOT a hard multiply: ice is translucent
      // and glows throughout, so the deep stays luminous blue, never black.
      var lf = 1 - smoothstep(rO * 0.6, rO * 1.7, openD);

      // THICKNESS — thin & pale at the mouth → thick & deep blue (pull the blue in early so the
      // frame is richly cerulean, not a washed pale centre)
      var base = smoothstep(rO * 0.45, 0.58, openD);
      var struct = nIce.fbm(nx * 2.2 + wx, ny * 2.2 + wy, 5, 2.1, 0.55);   // ~[0,1] ice mottling
      // flowing ice strata: iso-bands of a smooth warped field (curved layers, like the glacier's
      // own flow lines) — not rings, not corduroy. Troughs read thicker/bluer → 3-D scallops.
      var flow = nIce.fbm(nx * 1.2 + 3.0, ny * 1.2 + 3.0, 4, 2, 0.5);
      var u = nx * ca + ny * sa;
      var flute = 0.5 + 0.5 * Math.sin((u + flow * 1.9 + openD * 0.7) * fluteF * 6.2831853);
      var thick = base * 0.66 + (struct - 0.5) * 0.24 + base * (1 - flute) * 0.2;

      // FRACTURES — ridged noise → fine deep crevasse hairlines (sparse; fade out at the mouth)
      var cr = nCr.fbm(nx * 4.6 + 1.7, ny * 4.6 + 1.7, 4, 2, 0.5);
      var crack = Math.pow(1 - Math.abs(cr * 2 - 1), 13) * (0.3 + 0.7 * base);
      thick += crack * 0.11;
      thick = clamp(thick, 0, 1);

      ice.rgb(thick, col);
      // luminance: a floor so the ice always glows, + the mouth's light, + a gleam on flute
      // crests, − the dark of a crevasse.
      var L = 0.55 + 0.32 * lf + base * Math.pow(flute, 2) * 0.34 - crack * 0.25;
      if (L < 0) L = 0;
      out[0] = col[0] * L; out[1] = col[1] * L; out[2] = col[2] * L;
      out[3] = 255;
    });

    // upscale the soft field to the canvas
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = "#06121c"; ctx.fillRect(0, 0, S, S);
    ctx.drawImage(field, 0, 0, R, R, 0, 0, S, S);

    // the mouth bleeds a little daylight — ONE soft, modest bloom (no blown-out blob)
    Loom.glow(ctx, ox * S, oy * S, rO * S * 1.2, "#d4eefa", 0.08, 0.5);

    // a gentle deep-blue vignette to seat the cave around us (deepen, don't blacken)
    var vg = ctx.createRadialGradient(ox * S, oy * S, rO * S * 0.8, S * 0.5, S * 0.6, S * 0.85);
    vg.addColorStop(0, "rgba(6,22,40,0)");
    vg.addColorStop(1, "rgba(6,20,36,0.42)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
