// Emil's Loom · piece 019 — "God-rays"
//
// A lone manta gliding through cathedral shafts of sunlight, deep underwater. The subject is the
// soul (a felt creature in a real moment); the light is the skin — composed AROUND the manta, not
// the other way round, or god-rays are just a screensaver ([[035-defining-feature-is-often-the-hard-part]]).
// The manta reads as a manta first (silhouette), then the light is built around it: a bright caustic
// surface ceiling, broad shafts slanting into the deep, motes catching fire inside the beams.
//
// Static — a caught instant, fully verifiable from a still (and my test window's rAF is throttled,
// so motion would be unverifiable anyway). Composes the library: ramp (water depth), noise (caustics,
// shimmer, mote placement), glow (the surface sun). All randomness is in setup → reproduces from seed.
Loom.piece({
  id: "019",
  title: "God-rays",
  seed: "sound",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;

    // ---- a manta in a unit frame (wingspan 2, nose toward -y), placed/rotated/scaled ----
    function manta(mx, my, size, angle, fill) {
      ctx.save();
      ctx.translate(mx, my); ctx.rotate(angle); ctx.scale(size, size);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(-1.0, 0.06);
      ctx.bezierCurveTo(-0.52, -0.06, -0.20, -0.24, 0, -0.26);
      ctx.bezierCurveTo(0.20, -0.24, 0.52, -0.06, 1.0, 0.06);
      ctx.bezierCurveTo(0.50, 0.30, 0.20, 0.30, 0, 0.30);
      ctx.bezierCurveTo(-0.20, 0.30, -0.50, 0.30, -1.0, 0.06);
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-0.12, -0.24); ctx.quadraticCurveTo(-0.15, -0.34, -0.10, -0.40); ctx.quadraticCurveTo(-0.05, -0.30, -0.02, -0.25); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0.12, -0.24); ctx.quadraticCurveTo(0.15, -0.34, 0.10, -0.40); ctx.quadraticCurveTo(0.05, -0.30, 0.02, -0.25); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-0.022, 0.27); ctx.quadraticCurveTo(0.02, 0.72, 0.07, 1.12); ctx.quadraticCurveTo(0.0, 0.72, 0.018, 0.27); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    var depth = ctx.createLinearGradient(0, 0, 0, S);     // the water column
    depth.addColorStop(0, "#1c7282");
    depth.addColorStop(0.32, "#0e4654");
    depth.addColorStop(0.66, "#072a36");
    depth.addColorStop(1, "#03131c");

    var caN = Loom.noise(rng.int(0, 1e9));                 // the caustic field's noise
    var caustic = Loom.caustics(caN, { scale: 9, yOffset: 4, octaves: 3, ridged: false, sharpen: 1 }); // primitive #13 — soft dapple
    var moN = Loom.noise(rng.int(0, 1e9));                 // shaft shimmer

    var sunX = rng.range(0.54, 0.72) * S;                  // the sun's place at the surface
    var mantaX = rng.range(0.42, 0.54) * S, mantaY = rng.range(0.46, 0.56) * S;
    var mantaSize = rng.range(0.30, 0.36) * S, mantaAng = rng.range(0.30, 0.50);

    // beams fan out from the sun; each slants more the further it starts from it
    var beams = [];
    for (var b = 0, nb = rng.int(16, 22); b < nb; b++) {
      var ox = rng.range(-0.1, 1.1) * S;
      beams.push({
        ox: ox,
        ang: (ox - sunX) / S * rng.range(0.22, 0.34) + rng.range(-0.03, 0.03),  // slant (radial fan)
        w: rng.range(0.012, 0.06) * S,
        bright: rng.range(0.04, 0.15) * (b % 4 === 0 ? 1.45 : 1)
      });
    }

    function paint() {
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.fillStyle = depth; ctx.fillRect(0, 0, S, S);

      // the surface ceiling — a brighter band up top with caustic dapple (we're looking UP at it)
      var ceil = ctx.createLinearGradient(0, 0, 0, 0.2 * S);
      ceil.addColorStop(0, "rgba(150,228,232,0.5)");
      ceil.addColorStop(1, "rgba(150,228,232,0)");
      ctx.fillStyle = ceil; ctx.fillRect(0, 0, S, 0.2 * S);
      ctx.globalCompositeOperation = "lighter";
      for (var cx = 0; cx < S; cx += 3 * U) {
        for (var cy = 0; cy < 0.16 * S; cy += 3 * U) {
          var cv = caustic(cx / S, cy / S);
          if (cv < 0.62) continue;
          ctx.globalAlpha = (cv - 0.62) * 0.9 * (1 - cy / (0.16 * S));
          ctx.fillStyle = "#cdf6f4";
          ctx.fillRect(cx, cy, 3 * U, 3 * U);
        }
      }
      ctx.globalAlpha = 1;

      // ---- the god-ray shafts (additive, slanting into the deep), drawn BEHIND the manta ----
      function drawBeams(alphaScale) {
        ctx.globalCompositeOperation = "lighter";
        for (var i = 0; i < beams.length; i++) {
          var bm = beams[i], len = S * 1.15, dx = Math.sin(bm.ang), dy = Math.cos(bm.ang);
          var ex = bm.ox + dx * len, ey = dy * len;
          var g = ctx.createLinearGradient(bm.ox, 0, ex, ey);
          g.addColorStop(0, "rgba(198,242,238," + (bm.bright * alphaScale).toFixed(3) + ")");
          g.addColorStop(0.5, "rgba(150,224,228," + (bm.bright * 0.4 * alphaScale).toFixed(3) + ")");
          g.addColorStop(1, "rgba(120,200,210,0)");
          ctx.fillStyle = g;
          // a soft wide pass + a brighter narrow core
          for (var pass = 0; pass < 2; pass++) {
            var w = bm.w * (pass === 0 ? 1.9 : 0.7), px = -dy * w * 0.5, py = dx * w * 0.5;
            ctx.globalAlpha = pass === 0 ? 0.5 : 1;
            ctx.beginPath();
            ctx.moveTo(bm.ox - px, -py); ctx.lineTo(bm.ox + px, py);
            ctx.lineTo(ex + px, ey + py); ctx.lineTo(ex - px, ey - py);
            ctx.closePath(); ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }
      drawBeams(1);

      // ---- the manta, silhouetted against the light ----
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      manta(mantaX, mantaY, mantaSize, mantaAng, "#05121a");
      // a thin rim of light catching its sunward (upper) edge — drawn as a clipped bright manta
      // offset up-toward the sun, peeking past the silhouette
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.4;
      manta(mantaX + 2 * U, mantaY - 2.8 * U, mantaSize, mantaAng, "rgba(126,222,224,1)");
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      manta(mantaX, mantaY, mantaSize, mantaAng, "#05121a");   // re-cover, leaving only the rim sliver

      // foreground: faint shafts in front + motes catching the light inside the beams
      drawBeams(0.4);
      ctx.globalCompositeOperation = "lighter";
      var nm = Math.round(520 * (S / 760));
      for (var m = 0; m < nm; m++) {
        var px = rng.range(0, 1) * S, py = rng.range(0.04, 1) * S;
        // is it inside a beam? sample the beam field by nearest-beam horizontal distance at this depth
        var lit = 0;
        for (var k = 0; k < beams.length; k++) {
          var bx = beams[k].ox + Math.sin(beams[k].ang) * py;
          var d = Math.abs(px - bx);
          if (d < beams[k].w * 1.3) lit = Math.max(lit, (1 - d / (beams[k].w * 1.3)) * beams[k].bright * 6);
        }
        var shimmer = 0.5 + 0.5 * moN.fbm(px / S * 7, py / S * 7, 2);
        var a = (0.05 + lit) * shimmer * (1 - py / S * 0.5);
        if (a < 0.02) continue;
        ctx.globalAlpha = Math.min(0.8, a);
        ctx.fillStyle = "#dff6f0";
        var r = rng.range(0.5, 1.7) * U;
        ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // depth haze (darken the deep) + a soft vignette
      ctx.globalCompositeOperation = "source-over";
      var haze = ctx.createLinearGradient(0, 0.5 * S, 0, S);
      haze.addColorStop(0, "rgba(3,16,24,0)"); haze.addColorStop(1, "rgba(2,10,16,0.55)");
      ctx.fillStyle = haze; ctx.fillRect(0, 0.5 * S, S, 0.5 * S);
      var vg = ctx.createRadialGradient(S / 2, S * 0.42, S * 0.32, S / 2, S * 0.42, S * 0.78);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(2,12,18,0.4)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
    }

    // STATIC — paint once, return nothing.
    paint();
  }
});
