// Emil's Loom · piece 038 — "Argus"
//
// A peacock in full display: the great fan of the train thrown up behind the small iridescent body, every
// feather tipped with an ocellus — the eye-spot. In the myth Hera set the hundred eyes of Argus Panoptes,
// the all-seeing giant, onto the peacock's tail; hence the name. The HOOK is ornamental splendour — a
// register the gallery hasn't had (vivid, regal, decorative) — and after a run of cosmic glow-on-dark
// pieces this one is deliberately the opposite: saturated jewel TONE, not additive glow, lit pigment on a
// jewel-box ground ([[022-luminosity-on-bright-is-tone]] in its native direction).
//
// The whole read lives in the EYE-SPOT ([[035-defining-feature-is-often-the-hard-part]]): a sunburst of
// barbs alone is just a fan, but the concentric ocelli — navy heart, a cyan crescent, gold and green rings —
// make it unmistakably a peacock. So the eye-spot is built first and well, then arrayed. Iridescence is
// per-feather hue drift so the fan shimmers instead of reading as one flat colour. Composes noise (#3, the
// barb shimmer + tip jitter) + the palette helpers. Static, vector.
Loom.piece({
  id: "038",
  title: "Argus",
  seed: "pavo",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var nz = Loom.noise(rng.int(1, 999999));
    var lerp = function (a, b, t) { return a + (b - a) * t; };

    // ---- jewel-box ground: a deep teal forest shade, soft radial so the iridescence pops ----
    var bx = S * 0.5, by = S * 0.72;                          // the bird's base (fan radiates from here)
    var bg = ctx.createRadialGradient(bx, by - S * 0.18, S * 0.05, bx, by - S * 0.1, S * 0.85);
    bg.addColorStop(0, "#123036"); bg.addColorStop(0.55, "#0c2228"); bg.addColorStop(1, "#050f14");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);

    // overall fan geometry
    var Lmax = S * 0.62;                                      // feather length
    var spread = rng.range(1.74, 1.96);                       // half-arc of the fan (radians from vertical)
    var hueBias = rng.range(-0.5, 0.5);                       // some birds bluer, some greener
    function fanAngle(u) { return -Math.PI / 2 + lerp(-spread, spread, u); }   // u in [0,1] across the fan; up = -PI/2
    function fanLen(u) {                                        // feather length at u: ragged tips + tucked-in lower sides
      var jit = nz.fbm(u * 7 + 2, 1.3, 3, 2.0, 0.5) - 0.5;
      var edge = 1 - 0.2 * Math.pow(Math.abs(u - 0.5) * 2, 2.4);// round the fan in at the bottom corners
      return Lmax * (0.92 + jit * 0.15) * edge;
    }

    // ---- THE EYE-SPOT (ocellus) — built local, +x pointing outward along the feather ----
    function eyeSpot(x, y, R, ang, hue) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      function oval(rx, ry, ox, oy, fill) {
        ctx.beginPath(); ctx.ellipse(ox, oy, rx, ry, 0, 0, TAU); ctx.fillStyle = fill; ctx.fill();
      }
      var g = lerp(0.5, 1.5, hue);                            // hue knob: <1 bluer, >1 greener/bronzier
      // soft outer halo
      oval(R * 1.18, R * 1.0, 0, 0, "rgba(60,80,70,0.35)");
      // green outer ring
      oval(R * 0.98, R * 0.84, 0, 0, "rgb(" + (40 * g | 0) + "," + (120 + 24 * g | 0) + "," + (90 - 10 * g | 0) + ")");
      // bronze / gold ring
      oval(R * 0.74, R * 0.62, R * 0.02, 0, "rgb(" + (150 + 40 * g | 0) + "," + (120 + 10 * g | 0) + "," + (60) + ")");
      // deep blue surround
      oval(R * 0.54, R * 0.46, R * 0.04, 0, "rgb(" + (24) + "," + (54) + "," + (120 - 30 * (g - 1) | 0) + ")");
      // the cyan crescent: a bright turquoise oval, then the navy heart shifted outward leaves a crescent
      oval(R * 0.44, R * 0.4, R * 0.0, 0, "rgb(34,210,196)");
      oval(R * 0.4, R * 0.36, R * 0.12, R * 0.02, "rgb(10,18,44)");   // navy heart (kidney-ish, shifted out)
      // a small iridescent glint near the top of the heart
      oval(R * 0.1, R * 0.08, R * 0.16, -R * 0.12, "rgba(150,240,255,0.9)");
      ctx.restore();
    }

    // ---- a soft feathery underlay so the fan reads as a lush MASS, not a sparse sunburst ----
    (function fanWash() {
      ctx.save();
      ctx.beginPath(); ctx.moveTo(bx, by);
      for (var s = 0; s <= 64; s++) { var au = fanAngle(s / 64), Lw = fanLen(s / 64) * 1.04; ctx.lineTo(bx + Math.cos(au) * Lw, by + Math.sin(au) * Lw); }
      ctx.closePath(); ctx.clip();
      var wash = ctx.createRadialGradient(bx, by, S * 0.03, bx, by, Lmax);
      wash.addColorStop(0, "rgba(16,118,116,0.92)");
      wash.addColorStop(0.45, "rgba(20,112,92,0.8)");
      wash.addColorStop(0.78, "rgba(64,116,64,0.66)");
      wash.addColorStop(1, "rgba(122,108,56,0.38)");
      ctx.fillStyle = wash; ctx.fillRect(0, 0, S, S);
      // a faint mottle so the wash isn't a flat dome
      for (var w = 0, nw = Math.round(90 * U); w < nw; w++) {
        var wa = fanAngle(rng.next()), wr = Math.sqrt(rng.next()) * Lmax;
        var wv = nz.fbm(wr * 0.02 + 3, wa * 2 + 9, 2, 2.0, 0.5);
        ctx.fillStyle = "rgba(" + (40 + 60 * wv | 0) + "," + (140 + 40 * wv | 0) + "," + (110) + "," + (0.08).toFixed(2) + ")";
        ctx.beginPath(); ctx.arc(bx + Math.cos(wa) * wr, by + Math.sin(wa) * wr, S * 0.04, 0, TAU); ctx.fill();
      }
      ctx.restore();
    })();

    // ---- the barbs / fronds: many fine feather shafts from the base, blue-green -> gold, slight curve ----
    var nF = Math.round(400 * U);
    for (var i = 0; i < nF; i++) {
      var u = i / (nF - 1);
      var a = fanAngle(u);
      var L = fanLen(u);
      var curve = (u - 0.5) * 0.22;                            // gentle S so the fan looks grown, not a sunburst
      var hx = bx + Math.cos(a + curve * 0.5) * L * 0.5, hy = by + Math.sin(a + curve * 0.5) * L * 0.5;
      var tx = bx + Math.cos(a) * L, ty = by + Math.sin(a) * L;
      var grad = ctx.createLinearGradient(bx, by, tx, ty);
      var sh = nz.fbm(u * 9 + 5, 4.0, 3, 2.0, 0.5);            // per-barb iridescent shimmer
      grad.addColorStop(0, "rgba(14,70,86," + (0.55).toFixed(2) + ")");
      grad.addColorStop(0.5, "rgb(" + (24 + 30 * sh | 0) + "," + (120 + 40 * sh | 0) + "," + (110 + 20 * sh | 0) + ")");
      grad.addColorStop(1, "rgba(" + (150 + 40 * sh | 0) + "," + (130 + 20 * sh | 0) + ",70,0.85)");
      ctx.strokeStyle = grad; ctx.lineWidth = lerp(2.6, 1.2, u > 0.5 ? (u - 0.5) * 2 : (0.5 - u) * 2) * U;
      ctx.beginPath(); ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(hx, hy, tx, ty); ctx.stroke();
    }

    // ---- the eye-spots, arranged in concentric arcs near the feather tips (the hook) ----
    var rings = [{ r: 0.62, n: 22, R: 15 }, { r: 0.8, n: 26, R: 17 }, { r: 0.95, n: 30, R: 20 }];
    for (var ri = 0; ri < rings.length; ri++) {
      var rg = rings[ri], cnt = Math.round(rg.n * (0.7 + 0.3 * U));
      for (var k = 0; k < cnt; k++) {
        var uu = (k + 0.5) / cnt;
        var aa = fanAngle(uu) + rng.range(-0.012, 0.012);
        var rr = fanLen(uu) * rg.r * (1 + (nz.fbm(uu * 8 + ri * 3, 2.0, 2, 2.0, 0.5) - 0.5) * 0.05);
        var ex = bx + Math.cos(aa) * rr, ey = by + Math.sin(aa) * rr;
        var hue = 0.5 + (nz.fbm(uu * 6 + ri * 5, 7.0, 2, 2.0, 0.5) - 0.5) * 1.3 + hueBias * 0.5;
        eyeSpot(ex, ey, rg.R * U * rng.range(0.92, 1.08), aa, hue < 0 ? 0 : hue > 1 ? 1 : hue);
      }
    }

    // ---- the body: small iridescent blue neck + breast + crested head at the base ----
    var neckY = by - S * 0.04, headY = neckY - S * 0.1;
    // neck FIRST (flaring wide at the base), so the body ellipse drawn over it gives a smooth junction
    var neckGrad = ctx.createLinearGradient(bx, by + S * 0.04, bx, headY);
    neckGrad.addColorStop(0, "#0c3590"); neckGrad.addColorStop(0.7, "#1170b8"); neckGrad.addColorStop(1, "#16a6cc");
    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(bx - S * 0.05, by + S * 0.06);
    ctx.quadraticCurveTo(bx - S * 0.028, neckY - S * 0.04, bx - S * 0.02, headY + S * 0.012);
    ctx.quadraticCurveTo(bx, headY - S * 0.012, bx + S * 0.02, headY + S * 0.012);
    ctx.quadraticCurveTo(bx + S * 0.028, neckY - S * 0.04, bx + S * 0.05, by + S * 0.06);
    ctx.closePath(); ctx.fill();
    // breast / body OVER the neck base → smooth junction
    var bodyGrad = ctx.createRadialGradient(bx - S * 0.02, by + S * 0.04, 2, bx, by + S * 0.06, S * 0.13);
    bodyGrad.addColorStop(0, "#1f74da"); bodyGrad.addColorStop(0.55, "#0e3aa0"); bodyGrad.addColorStop(1, "#071d54");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath(); ctx.ellipse(bx, by + S * 0.06, S * 0.072, S * 0.1, 0, 0, TAU); ctx.fill();
    // head
    ctx.fillStyle = "#1455c0";
    ctx.beginPath(); ctx.ellipse(bx, headY, S * 0.026, S * 0.03, 0, 0, TAU); ctx.fill();
    // a small face patch + eye + beak
    ctx.fillStyle = "rgba(245,245,235,0.9)";
    ctx.beginPath(); ctx.ellipse(bx + S * 0.006, headY, S * 0.012, S * 0.006, -0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = "#06122e";
    ctx.beginPath(); ctx.arc(bx + S * 0.004, headY, S * 0.006, 0, TAU); ctx.fill();
    ctx.fillStyle = "#d9b24a";
    ctx.beginPath(); ctx.moveTo(bx + S * 0.022, headY); ctx.lineTo(bx + S * 0.04, headY + S * 0.004); ctx.lineTo(bx + S * 0.022, headY + S * 0.008); ctx.closePath(); ctx.fill();
    // the crest: a little fan of stalked dots atop the head
    for (var cc = 0; cc < 6; cc++) {
      var ca = -Math.PI / 2 + lerp(-0.5, 0.5, cc / 5);
      var clx = bx + Math.cos(ca) * S * 0.05, cly = headY + Math.sin(ca) * S * 0.05;
      ctx.strokeStyle = "rgba(20,110,170,0.8)"; ctx.lineWidth = 1.2 * U;
      ctx.beginPath(); ctx.moveTo(bx, headY - S * 0.02); ctx.lineTo(clx, cly); ctx.stroke();
      ctx.fillStyle = "#15a8d0"; ctx.beginPath(); ctx.arc(clx, cly, 2.6 * U, 0, TAU); ctx.fill();
    }

    // ---- a soft directional sheen across the fan + a seating vignette ----
    var sheen = ctx.createLinearGradient(0, 0, S, S);
    sheen.addColorStop(0, "rgba(180,230,220,0.06)"); sheen.addColorStop(0.5, "rgba(0,0,0,0)"); sheen.addColorStop(1, "rgba(0,0,0,0.05)");
    ctx.fillStyle = sheen; ctx.fillRect(0, 0, S, S);
    var vg = ctx.createRadialGradient(bx, by - S * 0.12, S * 0.36, bx, by - S * 0.1, S * 0.82);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(2,8,10,0.55)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
