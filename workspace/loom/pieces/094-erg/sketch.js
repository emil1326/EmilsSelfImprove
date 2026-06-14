// Emil's Loom · piece 094 — "Erg"
//
// An erg — a sea of sand — at the low sun. Rank on rank of dunes recede to a hazy horizon, each a smooth
// sculptural form: a warm-lit crest combed with wind ripples, falling into a cool blue shadow in the trough
// before the next one rises. A deliberate play to a STRENGTH after the #135 capability lesson — the hero here
// is LIGHT on FORM and atmosphere, my real 5-lane (075, Alpenglow/Salar), and smooth dune forms are exactly
// what tone + gradient do well (022/038), no fine detail to muddy (062), no figure (098). The risk a desert
// carries is the postcard — so the hook is the sculpture: flowing S-curve crests, the warm/cool drama of raking
// light, atmospheric recession, vast quiet. A faint line of tracks gives the scale a whisper without a figure.
// Self-directed; no advisor (no question whose answer would change the build, 099). Composes noise + ramp.
Loom.piece({
  id: "094",
  title: "Erg",
  seed: "rubalkhali",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- seed parameters (wide; the dune field + light vary, 085/097) ----
    var horizonY = rng.range(0.24, 0.34) * S;
    var sunSide = rng.bool() ? 1 : -1;                    // sun low on the left or right
    var sunX = sunSide > 0 ? rng.range(0.70, 0.92) * S : rng.range(0.08, 0.30) * S;
    var sunY = horizonY - rng.range(0.0, 0.04) * S;
    var nDunes = rng.int(6, 8);
    var warmth = rng.range(-0.5, 0.6);                    // cooler dusk .. hotter gold
    var skyHue = rng.range(0, 1);

    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function css(c) { return "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")"; }
    // palette (golden-hour desert)
    var litCrest = [255, 224, 150 + warmth * 12];          // bright warm sunlit crest
    var litFace = [236, 166, 92];                           // saturated gold sand
    var shadow = [64, 52, 94 - skyHue * 12];                // deep cool blue-violet slip-face shadow
    var hazeC = [232, 192, 162];                            // distant haze (warm pale)

    // =========================================================================
    //  THE SKY — warm at the horizon up to a cool dusk above, a low sun
    // =========================================================================
    var sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, css(mix([86, 88, 138], [150, 110, 140], skyHue)));   // cool/mauve top
    sky.addColorStop(0.55, css([216, 150, 130]));
    sky.addColorStop(1, css([248, 206, 150]));                                // warm horizon
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, horizonY + 2);
    // the sun — a soft low glow
    var sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 0.26 * S);
    sg.addColorStop(0, "rgba(255,244,214,0.95)"); sg.addColorStop(0.25, "rgba(255,222,160,0.6)"); sg.addColorStop(1, "rgba(255,210,150,0)");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sunX, sunY, 0.26 * S, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,250,230,0.95)"; ctx.beginPath(); ctx.arc(sunX, sunY, 0.022 * S, 0, TAU); ctx.fill();

    // =========================================================================
    //  THE DUNES — receding ridgelines, lit crest → cool trough, raking ripples
    // =========================================================================
    // baseline y of each ridge (nearer dunes lower + spaced wider)
    var baseY = [];
    for (var i = 0; i < nDunes; i++) baseY.push(horizonY + (S * 1.02 - horizonY) * Math.pow((i + 0.6) / nDunes, 1.5));
    function ridgeY(x, i) {
      var f = 1.5 + i * 0.45, amp = (0.016 + 0.03 * (i / nDunes)) * S;
      var w = nz.fbm(x / S * f + i * 7.3, i * 2.1, 3) - 0.5;
      var w2 = Math.sin(x / S * (2 + i) * 1.3 + i) * 0.3;
      return baseY[i] + (w + w2) * amp * (0.6 + i * 0.5);
    }

    for (var d = 0; d < nDunes; d++) {
      var depth = d / (nDunes - 1);                        // 0 far .. 1 near
      var hz = Math.pow(1 - depth, 2.2) * 0.92;            // only the far dunes haze; near ones stay saturated
      // dune body
      ctx.beginPath();
      ctx.moveTo(0, S);
      for (var x = 0; x <= S; x += 3) ctx.lineTo(x, ridgeY(x, d));
      ctx.lineTo(S, S); ctx.closePath();
      var top = ridgeY(0, d);
      var g = ctx.createLinearGradient(0, top - 0.02 * S, 0, (d < nDunes - 1 ? baseY[d + 1] : S));
      var crest = mix(litCrest, hazeC, hz);
      var face = mix(litFace, hazeC, hz);
      var shad = mix(shadow, hazeC, hz * 0.9);
      g.addColorStop(0, css(crest));
      g.addColorStop(0.07, css(face));
      g.addColorStop(0.42, css(shad));                     // a fast drop into the shadowed slip face
      g.addColorStop(1, css(mix(shad, [38, 30, 60], 0.5)));
      ctx.fillStyle = g; ctx.fill();

      // a crisp warm rim along the lit crest (sun catching the edge)
      ctx.save(); ctx.beginPath();
      for (var x2 = 0; x2 <= S; x2 += 3) { var ry = ridgeY(x2, d); if (x2 === 0) ctx.moveTo(x2, ry); else ctx.lineTo(x2, ry); }
      ctx.strokeStyle = "rgba(255,236,196," + (0.5 * (1 - hz)).toFixed(2) + ")"; ctx.lineWidth = (1.6 - depth * 0.6) * U; ctx.stroke();
      ctx.restore();

      // wind ripples on the nearer dunes (raking-light micro-texture), clipped to the dune
      if (depth > 0.45) {
        ctx.save();
        ctx.beginPath(); ctx.moveTo(0, S);
        for (var xc = 0; xc <= S; xc += 4) ctx.lineTo(xc, ridgeY(xc, d));
        ctx.lineTo(S, S); ctx.closePath(); ctx.clip();
        var nr = Math.floor(14 + depth * 22);
        for (var k = 1; k <= nr; k++) {
          var off = k * (0.007 + 0.003 * depth) * S;
          ctx.beginPath();
          for (var xr = 0; xr <= S; xr += 6) {
            var yr = ridgeY(xr, d) + off + Math.sin(xr / S * 26 + k * 2.1 + d) * 1.1 * U + (nz.fbm(xr / S * 6 + k, k * 0.5, 2) - 0.5) * 2.4 * U;
            if (xr === 0) ctx.moveTo(xr, yr); else ctx.lineTo(xr, yr);
          }
          var ra = (0.05 + 0.06 * depth) * (1 - k / nr);
          ctx.strokeStyle = (k % 2 ? "rgba(255,230,186," : "rgba(108,88,116,") + ra.toFixed(2) + ")";
          ctx.lineWidth = 1 * U; ctx.stroke();
        }
        ctx.restore();
      }
    }

    // =========================================================================
    //  a faint line of tracks over the foreground dune — scale, no figure
    // =========================================================================
    if (rng.bool()) {
      var tx0 = rng.range(0.2, 0.5) * S, ty0 = S * 0.99, drift = rng.range(-0.18, 0.18) * S;
      ctx.strokeStyle = "rgba(90,72,96,0.5)"; ctx.lineWidth = 2 * U; ctx.lineCap = "round";
      for (var s2 = 0; s2 < 2; s2++) {
        ctx.beginPath();
        for (var ty = 0; ty <= 1; ty += 0.04) {
          var px = tx0 + drift * ty + Math.sin(ty * 8) * 0.01 * S + s2 * 0.012 * S;
          var py = ty0 - ty * (S - ridgeY(tx0 + drift * ty, nDunes - 1) - 0.02 * S);
          if (ty === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }

    // =========================================================================
    //  atmosphere — a warm haze band hugging the horizon, soft vignette
    // =========================================================================
    var hb = ctx.createLinearGradient(0, horizonY - 0.05 * S, 0, horizonY + 0.14 * S);
    hb.addColorStop(0, "rgba(248,206,164,0.5)"); hb.addColorStop(1, "rgba(248,206,164,0)");
    ctx.fillStyle = hb; ctx.fillRect(0, horizonY - 0.05 * S, S, 0.2 * S);
    var vig = ctx.createRadialGradient(0.5 * S, 0.5 * S, 0.4 * S, 0.5 * S, 0.5 * S, 0.78 * S);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(30,16,28,0.34)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);
  }
});
