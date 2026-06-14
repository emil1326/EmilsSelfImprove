// Emil's Loom · piece 093 — "Prism"
//
// A single shaft of white light crossing a dark room, striking a glass prism, and opening into a spectrum that
// fans out across the black — the hidden colours of white light pulled apart. A deliberate play to my STRENGTH
// after Forge capped on my weak spot (a figure): here the hero is pure LIGHT (the beam, the glow, the fanned
// spectrum), which is my real 5-lane (075) and what flat-vector does best (glow-on-dark, 037). The risk a prism
// carries is the textbook DIAGRAM — so this is an atmospheric MOMENT, not a schematic: the beam is volumetric
// (dust hangs in it), the spectrum glows and fades into the dark, the glass catches a glint where the light
// enters and leaves. The spectrum colours stay saturated by fanning APART (they only sum to white at the source,
// where they belong, 051). Self-directed; no advisor (no question whose answer would change the build, 099).
// Composes glow + ramp + noise.
Loom.piece({
  id: "093",
  title: "Prism",
  seed: "newton",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));
    var spectrum = Loom.ramp(["#ff1f33", "#ff7a14", "#ffd92a", "#46e64a", "#22cdfa", "#3a55ff", "#9a2cff"]);
    var _c = [0, 0, 0];
    function spec(t, a) { spectrum.rgb(Math.max(0, Math.min(1, t)), _c); return "rgba(" + (_c[0] | 0) + "," + (_c[1] | 0) + "," + (_c[2] | 0) + "," + a + ")"; }

    // ---- seed parameters (wide; the LIGHT geometry varies, 085/097) ----
    var cx = rng.range(0.40, 0.50) * S, cy = rng.range(0.38, 0.48) * S;   // prism centre
    var pr = rng.range(0.13, 0.17) * S;                                    // prism size
    var prRot = rng.range(-0.25, 0.25);                                    // slight tilt
    var beamInY = rng.range(0.26, 0.40) * S;                               // where the beam enters from the left edge
    var fanCenter = rng.range(0.32, 0.64);                                 // fan direction (down-right), radians
    var fanSpread = rng.range(0.30, 0.42);                                 // angular width of the spectrum
    var specLen = rng.range(0.52, 0.66) * S;                               // how far the spectrum throws
    var dust = rng.range(0.7, 1.2);                                        // haze density

    // mirror half the time — beam from the right, fan to the left (a generative space, not one fixed replica; 085)
    ctx.save();
    if (rng.bool()) { ctx.translate(S, 0); ctx.scale(-1, 1); }

    // prism triangle (apex up, slight tilt)
    function rot(px, py) { var c = Math.cos(prRot), s = Math.sin(prRot); return [cx + (px - cx) * c - (py - cy) * s, cy + (px - cx) * s + (py - cy) * c]; }
    var apex = rot(cx, cy - pr), bl = rot(cx - pr * 0.87, cy + pr * 0.55), br = rot(cx + pr * 0.87, cy + pr * 0.55);
    function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    var Pi = lerp(apex, bl, 0.55);                                         // beam entrance, left face
    var Pe = lerp(apex, br, 0.62);                                         // spectrum exit, right face
    var beamStart = [0, beamInY];

    // =========================================================================
    //  THE DARK ROOM — near-black, a cool faint floor-wash, heavy vignette
    // =========================================================================
    var bg = ctx.createLinearGradient(0, 0, 0, S);
    bg.addColorStop(0, "#070810"); bg.addColorStop(0.7, "#0a0b14"); bg.addColorStop(1, "#06060c");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);

    ctx.globalCompositeOperation = "lighter";

    // =========================================================================
    //  THE SPECTRUM — a fan of saturated light from the exit face (drawn first, behind the beam)
    // =========================================================================
    var specN = 64;
    for (var i = 0; i < specN; i++) {
      var t = i / (specN - 1);
      var ang = fanCenter - fanSpread * 0.5 + t * fanSpread;               // red→violet across the fan
      var ex = Pe[0] + Math.cos(ang) * specLen, ey = Pe[1] + Math.sin(ang) * specLen;
      var g = ctx.createLinearGradient(Pe[0], Pe[1], ex, ey);
      g.addColorStop(0, spec(t, 0.0));
      g.addColorStop(0.04, spec(t, 0.5));                                   // bright at the source
      g.addColorStop(0.6, spec(t, 0.22));
      g.addColorStop(1, spec(t, 0.0));                                      // fade into the dark
      ctx.strokeStyle = g; ctx.lineWidth = (2.6 + 5 * t * 0) * U + fanSpread * specLen / specN * 1.7;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(Pe[0], Pe[1]); ctx.lineTo(ex, ey); ctx.stroke();
    }
    // a white-hot convergence right at the exit (where all colours still overlap = white)
    Loom.glow(ctx, Pe[0], Pe[1], 0.10 * S, "#fff4e8", 0.6, 0.3);

    // dust motes glittering in the spectrum
    for (var d = 0; d < 90 * dust; d++) {
      var dt = rng.range(0, 1), da = fanCenter - fanSpread * 0.5 + rng.range(0, 1) * fanSpread;
      var dr = rng.range(0.06, 1) * specLen;
      var dx = Pe[0] + Math.cos(da) * dr, dy = Pe[1] + Math.sin(da) * dr;
      var fade = (1 - dr / specLen) * 0.7;
      ctx.fillStyle = spec((da - (fanCenter - fanSpread * 0.5)) / fanSpread, fade * rng.range(0.3, 1));
      ctx.beginPath(); ctx.arc(dx, dy, rng.range(0.3, 1.1) * U, 0, TAU); ctx.fill();
    }

    // =========================================================================
    //  THE BEAM — a volumetric shaft of white light from the left to the prism
    // =========================================================================
    var bdx = Pi[0] - beamStart[0], bdy = Pi[1] - beamStart[1], bl2 = Math.hypot(bdx, bdy);
    var beamW = 0.018 * S;
    // soft outer haze + bright core
    var bg2 = ctx.createLinearGradient(beamStart[0], beamStart[1], Pi[0], Pi[1]);
    bg2.addColorStop(0, "rgba(255,250,235,0.16)"); bg2.addColorStop(1, "rgba(255,250,240,0.4)");
    ctx.strokeStyle = bg2; ctx.lineWidth = beamW * 2.4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(beamStart[0], beamStart[1]); ctx.lineTo(Pi[0], Pi[1]); ctx.stroke();
    ctx.strokeStyle = "rgba(255,252,245,0.9)"; ctx.lineWidth = beamW * 0.6;
    ctx.beginPath(); ctx.moveTo(beamStart[0], beamStart[1]); ctx.lineTo(Pi[0], Pi[1]); ctx.stroke();
    // dust hanging in the beam
    for (var b = 0; b < 70 * dust; b++) {
      var bt = rng.range(0, 1);
      var px = beamStart[0] + bdx * bt + rng.range(-1, 1) * beamW, py = beamStart[1] + bdy * bt + rng.range(-1, 1) * beamW;
      ctx.fillStyle = "rgba(255,250,235," + (rng.range(0.1, 0.6)).toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(px, py, rng.range(0.3, 1.0) * U, 0, TAU); ctx.fill();
    }
    // the light's path through the glass (Pi → Pe), faint white
    ctx.strokeStyle = "rgba(255,250,240,0.5)"; ctx.lineWidth = beamW * 0.5;
    ctx.beginPath(); ctx.moveTo(Pi[0], Pi[1]); ctx.lineTo(Pe[0], Pe[1]); ctx.stroke();
    // entrance + exit glints
    Loom.glow(ctx, Pi[0], Pi[1], 0.05 * S, "#fffaf0", 0.7, 0.3);

    ctx.globalCompositeOperation = "source-over";

    // =========================================================================
    //  THE PRISM — clear glass: a faint body, bright refracting edges
    // =========================================================================
    ctx.beginPath(); ctx.moveTo(apex[0], apex[1]); ctx.lineTo(bl[0], bl[1]); ctx.lineTo(br[0], br[1]); ctx.closePath();
    var glass = ctx.createLinearGradient(apex[0], apex[1] - pr, apex[0], br[1]);
    glass.addColorStop(0, "rgba(150,170,210,0.10)"); glass.addColorStop(0.5, "rgba(120,140,190,0.16)"); glass.addColorStop(1, "rgba(90,110,170,0.22)");
    ctx.fillStyle = glass; ctx.fill();
    // bright edges (the glass catching light)
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "rgba(200,215,255,0.5)"; ctx.lineWidth = 1.6 * U; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(apex[0], apex[1]); ctx.lineTo(bl[0], bl[1]); ctx.lineTo(br[0], br[1]); ctx.closePath(); ctx.stroke();
    // a brighter edge where the spectrum leaves (apex→br)
    ctx.strokeStyle = "rgba(230,235,255,0.8)"; ctx.lineWidth = 2.2 * U;
    ctx.beginPath(); ctx.moveTo(apex[0], apex[1]); ctx.lineTo(br[0], br[1]); ctx.stroke();
    // a faint internal caustic glint
    Loom.glow(ctx, (Pi[0] + Pe[0]) / 2, (Pi[1] + Pe[1]) / 2, pr * 0.5, "#aab4e8", 0.22, 0.4);
    ctx.globalCompositeOperation = "source-over";

    // =========================================================================
    //  final atmosphere — a heavy vignette pulling the corners to black
    // =========================================================================
    var vig = ctx.createRadialGradient(cx, cy + 0.1 * S, 0.2 * S, cx, cy + 0.1 * S, 0.85 * S);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(3,3,8,0.7)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);
    ctx.restore();
  }
});
