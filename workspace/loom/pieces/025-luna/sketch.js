// Emil's Loom · piece 025 — "Luna"
//
// A luna moth glowing against the dark: pale green wings with the long sweeping tails, a furry white
// body, feathery antennae, the soft eyespots. The delicate, living swing after the heavy machinery of
// the gas giant — a held, breath-quiet moment, and a creature for the gallery's "Living things".
//
// The discriminator (035): it must read as a LUNA MOTH, not an abstract green shape — and that lives
// in the SILHOUETTE, above all the long curving tails of the hindwings (the moth's signature), plus
// the eyespots, the dark leading edge (costa), the feathery antennae, and the fuzzy body. Bilaterally
// symmetric (a moth is), but softly lit and faintly irregular so it reads as alive, not a decal.
// Composes noise (wing scale-mottle) + glow (the moonlight it's lit by) + the palette helpers.
// Static — a moth at rest. All randomness is in setup → reproduces from the seed.
Loom.piece({
  id: "025",
  title: "Luna",
  seed: "selene",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853, PI = Math.PI;
    var cx = S * 0.5, cy = S * 0.47, s = S * 0.34;            // moth centre + scale (half-wingspan ≈ s)

    var wingN = Loom.noise(rng.int(0, 1e9));                  // scale-texture mottle
    var green = "#b6dd97", greenDk = "#7fae66", greenLt = "#d4ecc0";
    var costa = "#6b3a52";                                     // the dark maroon leading edge
    var bodyCol = "#efe9da";

    // one wing-set (LEFT side; x ∈ [-1,0], y: head −, abdomen +), drawn in unit coords then mirrored.
    function forewingPath() {
      var p = new Path2D();
      p.moveTo(-0.04, -0.30);
      p.bezierCurveTo(-0.50, -0.64, -0.86, -0.60, -0.97, -0.40);   // costa → apex
      p.bezierCurveTo(-1.00, -0.18, -0.82, 0.00, -0.60, 0.06);     // outer edge → outer-lower
      p.bezierCurveTo(-0.38, 0.02, -0.14, -0.06, -0.04, -0.12);    // inner edge → back to shoulder
      p.closePath();
      return p;
    }
    function hindwingPath() {
      var p = new Path2D();
      p.moveTo(-0.04, -0.04);
      p.bezierCurveTo(-0.44, 0.02, -0.70, 0.20, -0.72, 0.46);      // out to the lobe
      p.bezierCurveTo(-0.73, 0.80, -0.50, 1.02, -0.34, 1.24);      // lobe down the outer tail
      p.bezierCurveTo(-0.30, 1.46, -0.235, 1.56, -0.19, 1.50);     // sweep to the long thin tip
      p.bezierCurveTo(-0.165, 1.34, -0.185, 1.06, -0.12, 0.62);    // inner tail edge back up (thin)
      p.bezierCurveTo(-0.10, 0.38, -0.06, 0.12, -0.04, -0.02);     // back to body
      p.closePath();
      return p;
    }

    function fillWing(c, path, eyeX, eyeY) {
      // base green with a soft radial sheen from the wing base
      c.save(); c.clip(path);
      c.fillStyle = green; c.fill(path);
      var g = c.createRadialGradient(-0.1, 0.1, 0, -0.1, 0.1, 1.2);
      g.addColorStop(0, "rgba(212,236,192,0.55)"); g.addColorStop(0.5, "rgba(182,221,151,0)"); g.addColorStop(1, "rgba(120,160,100,0.3)");
      c.fillStyle = g; c.fillRect(-1.1, -0.8, 1.2, 2.2);
      // scale-texture mottle (subtle)
      for (var yy = -0.7; yy < 1.35; yy += 0.045) {
        for (var xx = -1.0; xx < 0.05; xx += 0.045) {
          var nv = wingN.fbm((xx + 2) * 7, (yy + 2) * 7, 3);
          if (nv < 0.52) continue;
          c.globalAlpha = (nv - 0.52) * 0.4;
          c.fillStyle = greenLt; c.fillRect(xx, yy, 0.05, 0.05);
        }
      }
      c.globalAlpha = 1;
      // veins — a few delicate branches from the base
      c.strokeStyle = "rgba(108,148,90,0.62)"; c.lineWidth = 0.013; c.lineCap = "round";
      for (var v = 0; v < 7; v++) {
        var a = -0.2 - v * 0.16, len = 0.9 + v * 0.06;
        c.beginPath(); c.moveTo(-0.06, 0.0);
        c.quadraticCurveTo(Math.cos(a) * len * 0.5 - 0.1, Math.sin(a) * len * 0.5, Math.cos(a) * len - 0.06, Math.sin(a) * len);
        c.stroke();
      }
      c.restore();
      // the eyespot — a soft pale-yellow halo, a translucent centre, and a thin dark crescent (luna-like)
      c.save();
      c.fillStyle = "rgba(230,224,150,0.5)"; c.beginPath(); c.ellipse(eyeX, eyeY, 0.066, 0.046, -0.3, 0, TAU); c.fill();
      c.fillStyle = "rgba(150,180,118,0.45)"; c.beginPath(); c.ellipse(eyeX, eyeY, 0.04, 0.026, -0.3, 0, TAU); c.fill();
      c.strokeStyle = "rgba(118,58,48,0.7)"; c.lineWidth = 0.009; c.beginPath(); c.ellipse(eyeX, eyeY, 0.058, 0.04, -0.3, 0.5, 3.5); c.stroke();
      c.restore();
      // a faint luminous rim along the wing edge — makes the wing feel like a wing, not a flat shape
      c.strokeStyle = "rgba(214,238,196,0.42)"; c.lineWidth = 0.013; c.stroke(path);
    }

    function drawMoth() {
      ctx.save(); ctx.translate(cx, cy);
      // wings: hindwings first (behind), then forewings; left set then mirrored right
      for (var side = -1; side <= 1; side += 2) {
        ctx.save(); ctx.scale(side * s, s);
        var hw = hindwingPath();
        fillWing(ctx, hw, -0.45, 0.5);
        // costa is only on the forewing; draw forewing
        var fw = forewingPath();
        fillWing(ctx, fw, -0.5, -0.28);
        // dark maroon leading edge along the forewing costa
        ctx.save(); ctx.clip(fw);
        ctx.strokeStyle = costa; ctx.lineWidth = 0.07; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-0.04, -0.30);
        ctx.bezierCurveTo(-0.50, -0.64, -0.86, -0.60, -0.97, -0.40);
        ctx.stroke(); ctx.restore();
        ctx.restore();
      }
      // body: a furry pale spindle (thorax + abdomen), drawn once over the wing roots
      ctx.scale(s, s);
      var bg = ctx.createLinearGradient(-0.06, 0, 0.06, 0);
      bg.addColorStop(0, "#cfc9ba"); bg.addColorStop(0.5, bodyCol); bg.addColorStop(1, "#cfc9ba");
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.ellipse(0, 0.16, 0.062, 0.5, 0, 0, TAU); ctx.fill();         // abdomen
      ctx.beginPath(); ctx.ellipse(0, -0.16, 0.085, 0.14, 0, 0, TAU); ctx.fill();        // thorax (furry)
      ctx.beginPath(); ctx.ellipse(0, -0.32, 0.055, 0.06, 0, 0, TAU); ctx.fill();        // head
      // a little fuzz texture on the thorax
      ctx.strokeStyle = "rgba(150,144,130,0.5)"; ctx.lineWidth = 0.006;
      for (var f = 0; f < 26; f++) { var fa = rng.range(0, TAU), fr = rng.range(0.02, 0.13); ctx.beginPath(); ctx.moveTo(0, -0.16); ctx.lineTo(Math.cos(fa) * fr, -0.16 + Math.sin(fa) * fr * 1.1); ctx.stroke(); }
      // feathery (plumose) antennae from the head, curving up-and-out
      ctx.strokeStyle = "rgba(210,200,180,0.85)"; ctx.lineCap = "round";
      for (var ant = -1; ant <= 1; ant += 2) {
        ctx.lineWidth = 0.014;
        ctx.beginPath(); ctx.moveTo(ant * 0.03, -0.36);
        ctx.quadraticCurveTo(ant * 0.22, -0.5, ant * 0.26, -0.66); ctx.stroke();
        // barbs
        ctx.lineWidth = 0.006;
        for (var b = 0; b < 11; b++) {
          var tb = b / 10, bx = ant * 0.03 + (ant * 0.23) * tb, by = -0.36 - 0.3 * tb;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - ant * 0.05, by - 0.015); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + ant * 0.02, by - 0.03); ctx.stroke();
        }
      }
      ctx.restore();
    }

    function paint() {
      // 1. the dark night ground + a soft moonlight glow behind the moth
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      var bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.75);
      bg.addColorStop(0, "#16241a"); bg.addColorStop(0.5, "#0d1712"); bg.addColorStop(1, "#070b09");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
      Loom.glow(ctx, cx, cy - s * 0.1, s * 1.9, "#9fd4a0", 0.15, 0.55);
      // 2. the moth
      drawMoth();
      // 2b. faint dust / spores drifting in the moonlight (denser near the moth)
      ctx.globalCompositeOperation = "lighter";
      for (var m = 0; m < 95; m++) {
        var mx = rng.range(0.07, 0.93) * S, my = rng.range(0.07, 0.94) * S;
        var dd = Math.hypot(mx - cx, my - cy) / S;
        ctx.globalAlpha = rng.range(0.05, 0.3) * Math.max(0, 1 - dd * 1.3);
        ctx.fillStyle = "#cfeebb";
        ctx.beginPath(); ctx.arc(mx, my, rng.range(0.4, 1.7) * U, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      // 3. a soft vignette
      var vg = ctx.createRadialGradient(cx, cy, S * 0.35, cx, cy, S * 0.8);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(3,6,4,0.6)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
    }

    paint();   // STAGE 1 — silhouette + basics, to verify it reads as a luna moth.
  }
});
