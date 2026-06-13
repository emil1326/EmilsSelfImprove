// Emil's Loom · piece 070 — "Stillwater"
//
// Rain on a dark pond at night: raindrops fall, each sends an expanding ring of ripples, and where the rings
// CROSS they interfere — bright where crest meets crest, flat where crest meets trough — a shifting moiré on
// the black water. The HOOK is that interference (physics made visible, the Strange/Resonance abstract-execution
// lane, [[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]) wedded to a quiet nocturnal mood. A pure
// FUNCTION of (x,y,t) — each ring = f(distance, t−dropTime) — so it's reproducible and the t-strip is clean
// ([[017-animation-seed-setup-once]] / [[042-verify-animation-with-a-t-strip-not-a-live-frame]]).
//
// Built soul-first ([[032-validate-the-soul-before-the-skin]]): the interference PATTERN, lit on its slopes (a
// bare amplitude->brightness field is just a ripple-tank diagram — light has to catch the water), validated in
// GREY before any colour. Kept SPARSE (few rings active at once) so crossings give real fringes, not gray mud.
// Tone curve planned for the near-zero-peaked slope field ([[044-tone-curve-must-match-the-density-distribution]]).
Loom.piece({
  id: "070",
  title: "Stillwater",
  seed: "nightrain",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size;
    var clamp = function (t, a, b) { return t < a ? a : t > b ? b : t; };
    var smooth = function (e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

    // ---- ripple physics (normalized [0,1] surface) ----
    var c = 0.20, life = 3.6, lambda = 0.042, k = 6.2831853 / lambda, width = 0.14, spread = 6, maxActive = 8;
    var Lx = 0.62, Ly = -0.58, lm = Math.hypot(Lx, Ly); Lx /= lm; Ly /= lm;   // skylight in-plane direction

    // ---- a gentle, deterministic rain: a stream of drops, some pre-seeded (negative t0) so t=0 is alive ----
    var drops = [], t0 = -life + 0.4;
    for (var i = 0; i < 110; i++) { drops.push({ x: rng.range(0.04, 0.96), y: rng.range(0.04, 0.96), t0: t0 }); t0 += rng.range(0.42, 0.82); }

    var fres = 200;
    var oc = document.createElement("canvas"); oc.width = fres; oc.height = fres;
    var octx = oc.getContext("2d"), img = octx.createImageData(fres, fres), data = img.data;

    var act = [];                                            // active rings, rebuilt per frame
    function frame(tt) {
      act.length = 0;
      for (var d = 0; d < drops.length; d++) {
        var age = tt - drops[d].t0;
        if (age <= 0 || age >= life) continue;
        var amp = smooth(0, 0.3, age) * (1 - age / life) * (1 - age / life);   // ramp in, fade out
        act.push({ sx: drops[d].x, sy: drops[d].y, front: c * age, amp: amp });
        if (act.length >= maxActive) break;
      }
      var na = act.length, inv = 1 / (fres - 1);
      for (var y = 0; y < fres; y++) {
        var v = y * inv;
        for (var x = 0; x < fres; x++) {
          var u = x * inv, Hx = 0, Hy = 0;
          for (var a = 0; a < na; a++) {
            var rg = act[a], dx = u - rg.sx, dy = v - rg.sy, r = Math.sqrt(dx * dx + dy * dy) + 1e-5;
            var rho = r - rg.front, ae = rho / width;
            if (ae <= -1 || ae >= 1) continue;               // outside the packet → no contribution
            var e = 1 - ae * ae, env = e * e, kk = k * rho;
            var osc = Math.cos(kk), dosc = -k * Math.sin(kk);
            var denv = 2 * e * (-2 * ae / width);
            var amp = rg.amp / Math.sqrt(1 + r * spread);
            var dwdr = amp * (denv * osc + env * dosc);       // radial slope of this ring
            Hx += dwdr * (dx / r); Hy += dwdr * (dy / r);
          }
          var sl = -(Hx * Lx + Hy * Ly) / k * 12;             // normalize the k-scaled slope, then a lighting gain
          var ss = sl / (1 + (sl < 0 ? -sl : sl));            // soft-clamped slope-toward-light, (-1,1)
          var lit = ss > 0 ? ss : 0, shad = ss < 0 ? -ss : 0;
          var sky = 0.04 + 0.055 * (1 - v);                   // faint cool sky-reflection, a touch stronger far/top
          var rr = 8 + sky * 38 - shad * 5, gg = 15 + sky * 52 - shad * 9, bb = 27 + sky * 74 - shad * 13;
          var hi = lit > 0.002 ? Math.pow(lit, 0.8) : 0;      // cool silver moonlight on the lit ripple-slopes
          rr += hi * 182; gg += hi * 202; bb += hi * 212;
          var sp = lit > 0.62 ? (lit - 0.62) * 2.6 : 0; sp *= sp;   // sparkle on the steepest fronts
          rr += sp * 52; gg += sp * 52; bb += sp * 48;
          var idx = (y * fres + x) * 4;
          data[idx] = rr > 255 ? 255 : rr; data[idx + 1] = gg > 255 ? 255 : gg; data[idx + 2] = bb > 255 ? 255 : bb; data[idx + 3] = 255;
        }
      }
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(oc, 0, 0, S, S);
    }

    return frame;
  }
});
