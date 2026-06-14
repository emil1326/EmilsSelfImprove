// Emil's Loom · piece 095 — "Supernova"
//
// A star at the instant it tears itself apart — the most violent light in the universe. The hook is the EVENT,
// not a pretty cosmic glow (096): a blinding white-hot core, a shockwave shell blasting outward, and ragged
// ejecta filaments — the forged elements (oxygen teal, sulphur crimson, gold) — flung asymmetrically into the
// dark, blossoming into Rayleigh-Taylor fingers. Chosen by the #137 two-gate check: the sing-layer is LIGHT/glow
// (my single best strength, the rated light-5s, 037) AND the concept has a real hook (drama/awe, my Strike/Maw
// lane) — both gates pass. The violence is carried by ASYMMETRY + radial energy + the shell, so it doesn't
// collapse to a symmetric glowy ball; the element colours stay vivid by living on separate filaments, only the
// core stacking to white where it belongs (051). Self-directed; no advisor (no fork, 099). Composes glow + ramp + noise.
Loom.piece({
  id: "095",
  title: "Supernova",
  seed: "betelgeuse",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));
    var elements = Loom.ramp(["#ff2a48", "#ff7a2e", "#ffd23a", "#4af0b0", "#2ac8ff", "#7a6cff", "#e24cff"]);
    var _c = [0, 0, 0];
    function el(t, a) { elements.rgb((t % 1 + 1) % 1, _c); return "rgba(" + (_c[0] | 0) + "," + (_c[1] | 0) + "," + (_c[2] | 0) + "," + a + ")"; }

    // ---- seed parameters (wide; the blast direction, palette span, energy vary, 085/097) ----
    var cx = rng.range(0.40, 0.56) * S, cy = rng.range(0.42, 0.56) * S;   // the star, off-centre
    var blastAng = rng.range(0, TAU);                                      // the asymmetric blast direction
    var hue0 = rng.range(0, 1);                                            // where the element ramp starts
    var hueSpan = rng.range(0.5, 1.0);
    var reach = rng.range(0.42, 0.56) * S;                                 // how far the ejecta throws
    var nFil = rng.int(150, 220);

    // =========================================================================
    //  DEEP SPACE — near-black, a faint scatter of distant stars
    // =========================================================================
    ctx.fillStyle = "#05060d"; ctx.fillRect(0, 0, S, S);
    for (var st = 0; st < 240; st++) {
      var sx = rng.range(0, 1) * S, sy = rng.range(0, 1) * S, sm = rng.range(0, 1);
      ctx.fillStyle = "rgba(200,210,240," + (0.05 + sm * sm * 0.5).toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(sx, sy, (0.25 + sm * 0.7) * U, 0, TAU); ctx.fill();
    }

    ctx.globalCompositeOperation = "lighter";

    // =========================================================================
    //  THE FAINT OUTER SHELL — an older shockwave, cool, far out
    // =========================================================================
    var shellR = reach * 1.08;
    for (var o = 0; o < 200; o++) {
      var oa = rng.range(0, TAU), bf0 = 0.5 + 0.5 * Math.cos(oa - blastAng);
      var orr = shellR * (0.9 + 0.16 * nz.fbm(Math.cos(oa) * 2 + 9, Math.sin(oa) * 2, 2)) * (0.8 + bf0 * 0.3);
      var ox = cx + Math.cos(oa) * orr, oy = cy + Math.sin(oa) * orr * 0.92;
      ctx.fillStyle = el(hue0 + 0.55, 0.05 + bf0 * 0.06);
      ctx.beginPath(); ctx.arc(ox, oy, rng.range(0.6, 2.2) * U, 0, TAU); ctx.fill();
    }

    // =========================================================================
    //  THE EJECTA — ragged radial filaments of forged elements, flung asymmetrically
    // =========================================================================
    for (var f = 0; f < nFil; f++) {
      var ang = rng.range(0, TAU);
      var bf = 0.5 + 0.5 * Math.cos(ang - blastAng);        // 1 toward the blast, 0 away
      if (rng.range(0, 1) > 0.35 + bf * 0.65) continue;     // sparser away from the blast
      var len = reach * (0.34 + bf * 0.95) * rng.range(0.6, 1.15);
      var r0 = 0.04 * S + rng.range(0, 0.03) * S;
      var t = (hue0 + (ang / TAU) * hueSpan * 0.4 + rng.range(0, hueSpan * 0.6));   // intermixed elements, slight regional bias
      var width = (1.2 + bf * 2.2) * U * rng.range(0.6, 1.4);
      // walk outward, wobbling more toward the tip (Rayleigh-Taylor fingers)
      var steps = 14, px = cx + Math.cos(ang) * r0, py = cy + Math.sin(ang) * r0;
      var na = ang;
      ctx.beginPath(); ctx.moveTo(px, py);
      for (var s2 = 1; s2 <= steps; s2++) {
        var u = s2 / steps;
        na = ang + (nz.fbm(Math.cos(ang) * 3 + f * 0.7, Math.sin(ang) * 3 + u * 4, 2) - 0.5) * 1.4 * u;
        var rr = r0 + len * u;
        px = cx + Math.cos(na) * rr; py = cy + Math.sin(na) * rr * 0.96;
        ctx.lineTo(px, py);
      }
      var grad = ctx.createRadialGradient(cx, cy, r0, cx, cy, r0 + len);
      grad.addColorStop(0, el(t, 0.0));
      grad.addColorStop(0.1, el(t, 0.7 * (0.55 + bf * 0.45)));
      grad.addColorStop(0.7, el(t, 0.3 * (0.45 + bf * 0.55)));
      grad.addColorStop(1, el(t, 0.0));
      ctx.strokeStyle = grad; ctx.lineWidth = width; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.stroke();
      // a brighter knot near the tip (the finger head)
      if (bf > 0.35 && rng.range(0, 1) > 0.45) {
        var kr = rng.range(0.025, 0.06) * S;
        var kg = ctx.createRadialGradient(px, py, 0, px, py, kr);
        kg.addColorStop(0, el(t, 0.7 * bf)); kg.addColorStop(0.5, el(t, 0.2 * bf)); kg.addColorStop(1, el(t, 0));
        ctx.fillStyle = kg; ctx.beginPath(); ctx.arc(px, py, kr, 0, TAU); ctx.fill();
      }
    }

    // =========================================================================
    //  THE SHOCKWAVE — the bright blast shell, elongated toward the blast
    // =========================================================================
    for (var w = 0; w < 340; w++) {
      var wa = rng.range(0, TAU), bf2 = 0.5 + 0.5 * Math.cos(wa - blastAng);
      var wr = reach * (0.62 + bf2 * 0.34) * (0.95 + 0.1 * nz.fbm(Math.cos(wa) * 3, Math.sin(wa) * 3 + 5, 2));
      var wx = cx + Math.cos(wa) * wr, wy = cy + Math.sin(wa) * wr * 0.95;
      ctx.fillStyle = "rgba(255," + (200 + bf2 * 40 | 0) + "," + (150 + bf2 * 60 | 0) + "," + (0.08 + bf2 * 0.2).toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(wx, wy, rng.range(0.6, 2.4) * U, 0, TAU); ctx.fill();
    }

    // =========================================================================
    //  THE CORE — the blinding white-hot heart of the explosion
    // =========================================================================
    Loom.glow(ctx, cx, cy, 0.30 * S, "#ff9a3a", 0.5, 0.5);
    Loom.glow(ctx, cx, cy, 0.16 * S, "#ffd07a", 0.7, 0.4);
    Loom.glow(ctx, cx, cy, 0.075 * S, "#fff2d8", 0.95, 0.35);
    ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.beginPath(); ctx.arc(cx, cy, 0.02 * S, 0, TAU); ctx.fill();
    // a couple of bright diffraction spikes off the core
    ctx.strokeStyle = "rgba(255,246,224,0.5)"; ctx.lineWidth = 1.4 * U;
    for (var sp = 0; sp < 2; sp++) {
      var spa = sp * Math.PI / 2 + 0.2;
      ctx.beginPath(); ctx.moveTo(cx - Math.cos(spa) * 0.13 * S, cy - Math.sin(spa) * 0.13 * S);
      ctx.lineTo(cx + Math.cos(spa) * 0.13 * S, cy + Math.sin(spa) * 0.13 * S); ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";

    // =========================================================================
    //  a soft vignette to deepen the dark
    // =========================================================================
    var vig = ctx.createRadialGradient(cx, cy, 0.3 * S, cx, cy, 0.85 * S);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(2,2,8,0.55)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);
  }
});
