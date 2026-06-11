// Emil's Loom · piece 015 — "Outcrop"
//
// A redemption of piece 003 "Strata" — my lowest-rated one (Emil: "boring, grey, seen a
// thousand maps"). 003 read the name as a flat top-down contour map, the exact cliché. So
// this reclaims the LITERAL meaning: an exposed rock face seen in cross-section, the
// sedimentary layers folded and faulted and weathered, in warm earth colour — not a map,
// not grey. Going DEEP on the terrain vein the way 014 did the flow field (the #25 audit).
//
// The layers are a stack of beds (varied thickness + a geological colour sequence) all
// draped by one shared fold profile fold(x) — a broad anticline plus finer warps, a tilt,
// and a couple of faults that step the whole sequence. Then laminations and grain make it
// read as rock, and a raking light gives the fold form. Static; built on lib/noise.js.
Loom.piece({
  id: "015",
  title: "Outcrop",
  seed: "fold",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var U = S / 700;

    // Geological palettes — ordered sequences of bed colours (the band cycle reads as a
    // real stratigraphy: pale sandstones, iron reds, ochres, the odd dark shale marker).
    var SCHEMES = [
      { name: "painted desert", beds: ["#e8d6b0", "#c98a4e", "#9c4a2e", "#d8a868", "#7a3a2a", "#e0c088", "#b86a3a", "#6e4636", "#ecdcc0"], sky: "#f3ead6" },
      { name: "red canyon",     beds: ["#b85a32", "#8a3320", "#d88048", "#6e2a1e", "#c46a3a", "#e0a060", "#7a3526", "#a84e2c"], sky: "#e8c9a4" },
      { name: "coastal cliff",  beds: ["#d8d2c0", "#a8a890", "#cabf9e", "#7e8472", "#e0dcc8", "#9a8f72", "#bcae8a", "#6e7464"], sky: "#e7ecec" },
      { name: "blue agate",     beds: ["#cfd8de", "#7e9aa8", "#aebcc6", "#4e6a7c", "#dde4e8", "#90a6b2", "#637e8e", "#bcc8d0"], sky: "#e2e8ea" }
    ];
    var sc = SCHEMES[rng.int(0, SCHEMES.length - 1)];

    var warp = Loom.noise(rng.int(0, 1e9));   // the folding
    var grain = Loom.noise(rng.int(0, 1e9));  // rock texture

    // --- the fold profile: how far the whole sequence is lifted/dropped at column x ---
    var archX = rng.range(0.3, 0.7) * S;      // centre of the big anticline
    var archW = rng.range(0.3, 0.5) * S;      // its width
    var archA = rng.range(0.10, 0.20) * (rng.bool() ? 1 : -1); // up (anticline) or down (syncline)
    var tilt = rng.range(-0.12, 0.12);        // overall dip across the frame
    var warpA = rng.range(0.03, 0.07);        // finer undulations
    var warpS = rng.range(1.3, 2.4);
    // a couple of faults: x position + throw (vertical step)
    var faults = [];
    for (var k = 0, nf = rng.int(1, 2); k < nf; k++) {
      faults.push({ x: rng.range(0.2, 0.8) * S, throw: rng.range(0.04, 0.12) * (rng.bool() ? 1 : -1) });
    }
    function fold(x) {
      var d = (x - archX) / archW;
      var arch = archA * Math.exp(-d * d);                 // a gaussian anticline
      var w = (warp.fbm(x / S * warpS, 0.7, 4) - 0.5) * 2 * warpA;
      var t = tilt * (x / S - 0.5);
      var f = arch + w + t;
      for (var i = 0; i < faults.length; i++) if (x > faults[i].x) f += faults[i].throw;
      return f;
    }

    // --- the bed stack: thickness + colour, covering well beyond the frame so folding
    // never reveals empty space ---
    var beds = [];
    var h = -0.45;
    var ci = rng.int(0, sc.beds.length - 1);
    while (h < 1.5) {
      var thick = rng.range(0.02, 0.085);
      var marker = rng.bool(0.18);                          // thin dark shale marker bed
      if (marker) thick = rng.range(0.006, 0.014);
      var col = marker ? Loom.mix(sc.beds[ci % sc.beds.length], "#000000", 0.45)
                       : sc.beds[ci % sc.beds.length];
      beds.push({ h0: h, h1: h + thick, col: col, lam: rng.int(2, 5) });
      h += thick;
      ci += rng.int(1, 3);                                  // skip around the sequence
    }

    var STEP = 5;                                           // px per fold sample (smooth enough)

    // draw a folded strip between stratigraphic heights a and b (in screen space)
    function strip(a, b) {
      ctx.beginPath();
      ctx.moveTo(0, (a + fold(0)) * S);
      for (var x = STEP; x <= S; x += STEP) ctx.lineTo(x, (a + fold(x)) * S);
      for (var x2 = S; x2 >= 0; x2 -= STEP) ctx.lineTo(x2, (b + fold(x2)) * S);
      ctx.closePath();
    }

    // STATIC: paint once, return nothing (no rng in a per-frame path — lesson 017).
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = sc.sky;
    ctx.fillRect(0, 0, S, S);

    // beds
    for (var i = 0; i < beds.length; i++) {
      var bd = beds[i];
      strip(bd.h0, bd.h1);
      ctx.fillStyle = bd.col;
      ctx.fill();
      // laminations: faint darker lines following the fold inside the bed
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = Loom.mix(bd.col, "#000000", 0.3);
      ctx.lineWidth = 0.7 * U;
      for (var l = 1; l < bd.lam; l++) {
        var hl = bd.h0 + (bd.h1 - bd.h0) * (l / bd.lam);
        ctx.beginPath();
        ctx.moveTo(0, (hl + fold(0)) * S);
        for (var x = STEP; x <= S; x += STEP) ctx.lineTo(x, (hl + fold(x)) * S);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // mottle: soft cloudy patches of weathering (dark and light) — organic, NOT a grid, so
    // it reads as rock rather than fabric. The single biggest thing that breaks the flatness.
    var nM = Math.round(240 * (S / 700));
    for (var mi = 0; mi < nM; mi++) {
      var bx = rng.range(0, S), by = rng.range(0, S);
      var br = rng.range(0.04, 0.17) * S;
      var mn = grain.fbm(bx / S * 4, by / S * 4, 3);
      var col = mn < 0.5 ? "26,12,5" : "255,240,214";
      var ma = (0.05 + 0.12 * Math.abs(mn - 0.5)).toFixed(3);
      var bgr = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bgr.addColorStop(0, "rgba(" + col + "," + ma + ")");
      bgr.addColorStop(1, "rgba(" + col + ",0)");
      ctx.fillStyle = bgr;
      ctx.fillRect(bx - br, by - br, br * 2, br * 2);
    }
    ctx.globalAlpha = 1;

    // fine grain: short strokes for grit
    ctx.lineCap = "round";
    var nG = Math.round(7000 * (S / 700));
    for (var g = 0; g < nG; g++) {
      var gx = rng.range(0, S), gy = rng.range(0, S);
      var n = grain.fbm(gx / S * 5, gy / S * 5, 2);
      ctx.globalAlpha = 0.05 + 0.07 * Math.abs(n - 0.5);
      ctx.strokeStyle = n < 0.5 ? "#180c03" : "#fff0d0";
      ctx.lineWidth = 0.8 * U;
      var len = rng.range(1.5, 5) * U;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + len, gy + rng.range(-0.5, 0.5) * U);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // weathering streaks: faint dark runs down the face (desert varnish), an outcrop tell
    for (var w2 = 0, nw = rng.int(6, 12); w2 < nw; w2++) {
      var sx = rng.range(0, S), sw = rng.range(8, 30) * U;
      var sa = rng.range(0.05, 0.13);
      var sg = ctx.createLinearGradient(0, 0, 0, S);
      sg.addColorStop(0, "rgba(22,11,4,0)");
      sg.addColorStop(rng.range(0.25, 0.5), "rgba(22,11,4," + sa.toFixed(3) + ")");
      sg.addColorStop(1, "rgba(22,11,4,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(sx, 0, sw, S);
    }
    ctx.globalAlpha = 1;

    // raking light from the upper-left → gives the fold its form (subtle)
    var lg = ctx.createLinearGradient(0, 0, S, S);
    lg.addColorStop(0, "rgba(255,245,225,0.10)");
    lg.addColorStop(0.5, "rgba(0,0,0,0)");
    lg.addColorStop(1, "rgba(20,10,5,0.16)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, S, S);
    ctx.globalAlpha = 1;
  }
});
