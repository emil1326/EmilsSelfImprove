// Emil's Loom · piece 022 — "Iris"
//
// An extreme macro of an eye, looking back at you: the iris a storm of fine radial fibres, a deep
// pupil, a wet catchlight. The intimate, arresting swing — no landscape, no scene, a living thing's
// eye filling the frame. After dark-dramatic (rose window) and bright-serene (koi), something that
// just *looks back*.
//
// The discriminator (advisor, #39) is "wet living sphere lit from one place" vs "flat decorative
// disc," and it lives in the light all agreeing: the catchlight STRADDLES the pupil edge (upper-left,
// half on iris / half over pupil — floating mid-iris reads as a sticker); the iris is a concave BOWL
// shaded for that one light; the pupil is a hole into a sphere with a hair of warmth on the lit side.
// And what separates a real iris from a generic sunburst: the COLLARETTE (a zigzag ring ~⅓ out
// splitting a darker inner zone from the outer), CRYPTS (irregular dark pits — low-frequency 2D, not
// radial), faint contraction FURROWS, and angular colour SECTORS. No lashes — the uncanny-valley risk
// in an eye lives in the sclera and lashes, not the iris ([[035-defining-feature-is-often-the-hard-part]]).
//
// The fibres are FULL-resolution per-pixel — emphatically NOT koi's low-res-upscale ([[038]]), which
// is for *soft* fields; here the high-frequency angular detail IS the soul, so it's rendered crisp
// into an ImageData (early-out past the iris disc to afford it). Luminosity is tone, not glow, except
// the one bright catchlight ([[022-luminosity-on-bright-is-tone]]). Composes ramp + noise + the
// palette helpers. Static — a held gaze. All randomness is in setup → reproduces from the seed.
Loom.piece({
  id: "022",
  title: "Iris",
  seed: "gaze",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853, PI = Math.PI;
    var cx = S * 0.5, cy = S * 0.5, irisR = S * 0.43, pupilR = S * 0.15;
    var lx = -0.64, ly = -0.77;                 // light direction (upper-left), normalised-ish

    var fiberN = Loom.noise(rng.int(0, 1e9));   // the radial fibres
    var fiber2N = Loom.noise(rng.int(0, 1e9));  // a finer fibre layer
    var cryptN = Loom.noise(rng.int(0, 1e9));   // crypts (2D dark pits)
    var sectorN = Loom.noise(rng.int(0, 1e9));  // angular colour sectors + collarette zigzag
    var veinN = Loom.noise(rng.int(0, 1e9));    // sclera veins
    var furrowPhase = rng.range(0, TAU);

    // iris colour, radial from the pupil edge (nr=0) to the limbus (nr=1) — a striking amber...
    var iris = Loom.ramp(["#46280e", "#7d4f16", "#caa02c", "#e8c652", "#a87a24"]);
    // ...with occasional green-gold sectors (heterochromia is real and gorgeous)
    var altH = Loom.ramp(["#33380f", "#5f6e18", "#4f8a3e", "#9bb84a", "#5a7a26"]);
    var Rk = 11, collFrac = 0.30;                // fibre frequency; collarette position
    var out = [0, 0, 0], alt = [0, 0, 0];

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    function paint() {
      // ---- the iris/pupil/sclera, rendered full-res into an offscreen ImageData ----
      var OS = Math.round(S * 0.85), k = S / OS;   // near-full res (advisor: fibres want pixels), upscaled gently
      var oc = document.createElement("canvas"); oc.width = OS; oc.height = OS;
      var o = oc.getContext("2d");
      var img = o.createImageData(OS, OS), data = img.data;
      for (var oy = 0; oy < OS; oy++) {
        for (var ox = 0; ox < OS; ox++) {
          var px = ox * k, py = oy * k, dx = px - cx, dy = py - cy, r = Math.sqrt(dx * dx + dy * dy), idx = (oy * OS + ox) * 4;
          var R, G, B;
          if (r < pupilR) {
            // pupil — a hole into a sphere, near-black, a hair of warmth on the lit (upper-left) side
            var lit = Math.max(0, -(dx / r * lx + dy / r * ly)) * (r / pupilR);
            R = 9 + lit * 26; G = 7 + lit * 14; B = 6 + lit * 7;
          } else if (r < irisR) {
            var cosT = dx / r, sinT = dy / r, nr = (r - pupilR) / (irisR - pupilR);
            var dxN = dx / irisR, dyN = dy / irisR;
            iris.rgb(nr, out);
            // angular colour sectors — blend toward the green-gold ramp in some wedges
            var sec = sectorN.fbm(cosT * 1.6, sinT * 1.6, 2);
            var blend = clamp01((sec - 0.5) * 2) * 0.4;
            if (blend > 0.01) { altH.rgb(nr, alt); out[0] += (alt[0] - out[0]) * blend; out[1] += (alt[1] - out[1]) * blend; out[2] += (alt[2] - out[2]) * blend; }
            // radial fibres — coherent rays (constant angle), faded at pupil & limbus, plus a finer layer
            var env = Math.pow(Math.sin(clamp01(nr) * PI), 0.6);
            // fibres clump — some angular sectors are far more fibrous than others (less sunburst)
            var clump = 0.5 + 0.95 * sectorN.fbm(cosT * 3.5, sinT * 3.5, 2);
            var f = fiberN.fbm(cosT * Rk, sinT * Rk + nr * 1.5, 3);
            var m = 1 + (f - 0.5) * 1.55 * env * clump;
            var f2 = fiber2N.fbm(cosT * Rk * 2.1, sinT * Rk * 2.1 + nr * 2, 2);
            m *= 1 + (f2 - 0.5) * 0.55 * env;
            out[0] *= m; out[1] *= m; out[2] *= m;
            // crypts — irregular 2D dark pits across the iris, denser near the collarette
            var cz = cryptN.fbm(dxN * 3.4 + 4, dyN * 3.4 + 4, 2);
            if (cz < 0.45) { var ce = 0.45 + 0.55 * Math.max(0, 1 - Math.abs(nr - collFrac) / 0.45); var dk = Math.max(0.4, 1 - (0.45 - cz) * 2.0 * ce); out[0] *= dk; out[1] *= dk; out[2] *= dk; }
            // collarette — a lighter zigzag ring; inner (pupillary) zone darker/warmer
            var zig = collFrac + (sectorN.fbm(cosT * 9, sinT * 9, 1) - 0.5) * 0.06;
            if (nr < zig) { out[0] *= 0.82; out[1] *= 0.78; out[2] *= 0.74; }
            var cd = Math.abs(nr - zig);
            if (cd < 0.045) { var ch = (1 - cd / 0.045) * 0.45; out[0] += (240 - out[0]) * ch * 0.5; out[1] += (210 - out[1]) * ch * 0.5; out[2] += (130 - out[2]) * ch * 0.5; }
            // contraction furrows — faint concentric ripples in the outer ciliary zone
            if (nr > zig) { var fm = 1 + (Math.sin(nr * 40 + furrowPhase) * 0.5) * 0.12 * (nr - zig); out[0] *= fm; out[1] *= fm; out[2] *= fm; }
            // limbal ring — darken toward the limbus
            if (nr > 0.85) { var lb = (nr - 0.85) / 0.15; lb *= lb; out[0] += (15 - out[0]) * lb; out[1] += (11 - out[1]) * lb; out[2] += (7 - out[2]) * lb; }
            // form shading — concave bowl lit upper-left: brighter on the far (lower-right) wall
            var grad = (dx * -lx + dy * -ly) / irisR;
            var sh = 1 + grad * 0.2;
            out[0] *= sh; out[1] *= sh; out[2] *= sh;
            R = out[0]; G = out[1]; B = out[2];
          } else {
            // sclera — warm off-white with faint veins, darkening toward the corners
            var dxN2 = dx / irisR, dyN2 = dy / irisR;
            var vig = clamp01((r - irisR) / (S * 0.32));
            R = 198 - vig * 150; G = 189 - vig * 148; B = 176 - vig * 140;   // warm, dimmer off-white
            if (vig < 0.55) {
              var v = veinN.fbm(dxN2 * 5 + 9, dyN2 * 5 + 9, 3);
              if (v > 0.62) { var vv = (v - 0.62) * 1.3 * (1 - vig); R += vv * 34; G -= vv * 16; B -= vv * 14; }
            }
          }
          data[idx] = R; data[idx + 1] = G; data[idx + 2] = B; data[idx + 3] = 255;
        }
      }
      o.putImageData(img, 0, 0);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(oc, 0, 0, S, S);

      // ---- a soft upper-lid shadow arcing across the top (frames it as an eye, no lashes) ----
      var lid = ctx.createLinearGradient(0, 0, 0, S * 0.34);
      lid.addColorStop(0, "rgba(10,7,5,0.62)"); lid.addColorStop(1, "rgba(10,7,5,0)");
      ctx.fillStyle = lid; ctx.fillRect(0, 0, S, S * 0.34);

      // ---- the catchlight: the wet, alive detail. Straddles the pupil edge, upper-left, one light ----
      var clx = cx - pupilR * 0.55, cly = cy - pupilR * 0.55, cs = pupilR * 0.52;
      // soft additive bloom around it (glows on the dark pupil)
      ctx.globalCompositeOperation = "lighter";
      var gl = ctx.createRadialGradient(clx, cly, 0, clx, cly, cs * 2.4);
      gl.addColorStop(0, "rgba(255,253,245,0.7)"); gl.addColorStop(0.5, "rgba(220,235,255,0.22)"); gl.addColorStop(1, "rgba(220,235,255,0)");
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(clx, cly, cs * 2.4, 0, TAU); ctx.fill();
      // the crisp window reflection (a rounded square with a faint mullion cross)
      ctx.globalCompositeOperation = "source-over";
      ctx.save();
      ctx.translate(clx, cly); ctx.rotate(-0.28);
      ctx.fillStyle = "rgba(255,254,248,0.96)";
      roundRect(ctx, -cs * 0.6, -cs * 0.7, cs * 1.2, cs * 1.4, cs * 0.28); ctx.fill();
      ctx.strokeStyle = "rgba(150,170,200,0.5)"; ctx.lineWidth = Math.max(1, cs * 0.08);
      ctx.beginPath(); ctx.moveTo(0, -cs * 0.7); ctx.lineTo(0, cs * 0.7); ctx.moveTo(-cs * 0.6, 0); ctx.lineTo(cs * 0.6, 0); ctx.stroke();
      ctx.restore();
      // ---- a wet rim of light on the lower-right of the limbus (the cornea's far edge) ----
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(255,250,235,0.18)"; ctx.lineWidth = 3 * U;
      ctx.beginPath(); ctx.arc(cx, cy, irisR * 0.99, 0.15, 1.25); ctx.stroke();

      // ---- settle the whole thing in a soft dark surround ----
      ctx.globalCompositeOperation = "source-over";
      var vg = ctx.createRadialGradient(cx, cy, irisR * 0.9, cx, cy, S * 0.72);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(6,4,3,0.6)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
    }

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    }

    paint();   // STATIC — paint once, return nothing.
  }
});
