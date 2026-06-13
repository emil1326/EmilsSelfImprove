// Emil's Loom · piece 072 — "Apparition"
//
// A great comet at perihelion, blazing across the dark: a green glowing coma around a hot nucleus, a straight
// blue ION tail of fine rays streaming dead anti-sunward, and a broad, curved, golden DUST tail fanning out
// behind. The HOOK is the luminous structured sweep of the tails ([[065-...]]) — cosmic awe, the God-rays/galaxy
// lane. Static — a held instant of a thing that moves on a scale of years.
//
// SOUL (run [[083-soul-check-the-layer-that-carries-the-read-and-sing-not-the-impressive-one]] myself this time):
// the layer that carries both the READ (a comet, not a star — its TAILS, [[035-...]]) and the SING (their
// glowing STRUCTURE — fine ion rays, a curved dust fan, not a flat spray-paint cone) is the coma+tails. So it's
// built tails-first and validated on a BARE dark sky before any stars ([[032-validate-the-soul-before-the-skin]]).
// Additive glow on dark, kept to DYNAMIC RANGE not a white blowout ([[037-...]] / [[051-...]]); structure from
// many low-alpha streaks ([[047-first-render-of-a-natural-thing-is-too-regular]]). Composes glow + palette + noise.
Loom.piece({
  id: "072",
  title: "Apparition",
  seed: "perihelion",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var rot = function (vx, vy, a) { var c = Math.cos(a), s = Math.sin(a); return [vx * c - vy * s, vx * s + vy * c]; };

    // ---- the comet head + the anti-sunward direction the tails stream along ----
    var hx = (0.64 + rng.range(-0.05, 0.05)) * S, hy = (0.33 + rng.range(-0.04, 0.04)) * S;
    var dd = rot(-0.80, 0.60, rng.range(-0.18, 0.18)); var dm = Math.hypot(dd[0], dd[1]); var dx = dd[0] / dm, dy = dd[1] / dm;
    var px = -dy, py = dx;                                    // perpendicular (for the dust curve + lateral spread)
    var ionCol = "#9fc2ff", dustCol = "#ffe0ac";
    var ionLen = 0.72 * S, dustLen = 0.60 * S;

    // ---- deep-space sky + starfield (behind the comet) ----
    var sky = ctx.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, "#05060d"); sky.addColorStop(0.75, "#070a16"); sky.addColorStop(1, "#0a1020");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, S);
    var sn = Loom.noise(rng.int(1, 999999));
    for (var st = 0; st < 440; st++) {
      var stx = rng.range(0, 1) * S, sty = rng.range(0, 0.85) * S, br = rng.range(0, 1); br *= br;
      var scol = rng.range(0, 1) < 0.16 ? (rng.range(0, 1) < 0.5 ? "#cadcff" : "#ffe6c4") : "#eef2ff";
      ctx.fillStyle = Loom.rgba(scol, 0.22 + br * 0.72);
      ctx.beginPath(); ctx.arc(stx, sty, (0.3 + br * 1.7) * U, 0, TAU); ctx.fill();
    }
    for (var bs = 0; bs < 9; bs++) { var bxp = rng.range(0.04, 0.96) * S, byp = rng.range(0.04, 0.62) * S; Loom.glow(ctx, bxp, byp, 0.013 * S, "#dbe8ff", 0.45, 0.38); ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(bxp, byp, 1.0 * U, 0, TAU); ctx.fill(); }

    // ---- the comet (additive glow over the stars) ----
    ctx.globalCompositeOperation = "lighter";

    // ---- dust tail (broad, curved, golden): a soft luminous HAZE underlay + fine striations on top ----
    var dustDir = rot(dx, dy, 0.14);                          // the dust lags → its axis rotated off the ion line
    for (var hz = 0; hz < 14; hz++) {                         // haze: the tail reads as a glowing volume, not bare lines
      var th = hz / 13, ah = (th - 0.5) * 0.5, rh = rot(dustDir[0], dustDir[1], ah);
      var lh = dustLen * rng.range(0.6, 1.0), cuh = (0.05 + 0.2 * th) * S;
      var exh = hx + rh[0] * lh, eyh = hy + rh[1] * lh, cxh = hx + rh[0] * lh * 0.5 + px * cuh, cyh = hy + rh[1] * lh * 0.5 + py * cuh;
      var gh = ctx.createLinearGradient(hx, hy, exh, eyh);
      gh.addColorStop(0, Loom.rgba(dustCol, 0.05)); gh.addColorStop(1, Loom.rgba(dustCol, 0));
      ctx.strokeStyle = gh; ctx.lineWidth = rng.range(8, 18) * U; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(cxh, cyh, exh, eyh); ctx.stroke();
    }
    for (var i = 0; i < 95; i++) {
      var t = i / 94, a = (t - 0.5) * 0.54, rd = rot(dustDir[0], dustDir[1], a);
      var len = dustLen * rng.range(0.5, 1.0) * (1 - 0.26 * Math.abs(t - 0.42));
      var curve = (0.05 + 0.2 * t) * S;                      // outer streaks curve more (the fan sweeps)
      var ex = hx + rd[0] * len, ey = hy + rd[1] * len;
      var cxp = hx + rd[0] * len * 0.5 + px * curve, cyp = hy + rd[1] * len * 0.5 + py * curve;
      var g = ctx.createLinearGradient(hx, hy, ex, ey), b = rng.range(0.04, 0.15);
      g.addColorStop(0, Loom.rgba(dustCol, b)); g.addColorStop(0.7, Loom.rgba(dustCol, b * 0.4)); g.addColorStop(1, Loom.rgba(dustCol, 0));
      ctx.strokeStyle = g; ctx.lineWidth = rng.range(1.2, 3.2) * U; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(cxp, cyp, ex, ey); ctx.stroke();
    }

    // ---- ion tail (straight, narrow, blue): soft cone haze + fine rays dead anti-sunward ----
    for (var hh = 0; hh < 9; hh++) {
      var oh = rng.gaussian() * 0.5, sah = oh * 0.05, rih = rot(dx, dy, sah), lih = ionLen * rng.range(0.6, 1.0);
      var oxh = hx + px * oh * 0.02 * S, oyh = hy + py * oh * 0.02 * S, exi = oxh + rih[0] * lih, eyi = oyh + rih[1] * lih;
      var gih = ctx.createLinearGradient(oxh, oyh, exi, eyi);
      gih.addColorStop(0, Loom.rgba(ionCol, 0.06)); gih.addColorStop(1, Loom.rgba(ionCol, 0));
      ctx.strokeStyle = gih; ctx.lineWidth = rng.range(5, 11) * U; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(oxh, oyh); ctx.lineTo(exi, eyi); ctx.stroke();
    }
    for (var j = 0; j < 70; j++) {
      var off = rng.gaussian() * 0.5, sa = off * 0.05, rj = rot(dx, dy, sa), len2 = ionLen * rng.range(0.4, 1.0);
      var ox = hx + px * off * 0.018 * S, oy = hy + py * off * 0.018 * S, ex2 = ox + rj[0] * len2, ey2 = oy + rj[1] * len2;
      var g2 = ctx.createLinearGradient(ox, oy, ex2, ey2), b2 = rng.range(0.06, 0.22);
      g2.addColorStop(0, Loom.rgba(ionCol, b2)); g2.addColorStop(1, Loom.rgba(ionCol, 0));
      ctx.strokeStyle = g2; ctx.lineWidth = rng.range(0.6, 1.5) * U; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex2, ey2); ctx.stroke();
    }

    // ---- coma + nucleus ----
    Loom.glow(ctx, hx, hy, 0.10 * S, "#a4f0c0", 0.5, 0.42);   // green coma
    Loom.glow(ctx, hx, hy, 0.045 * S, "#eafff6", 0.6, 0.4);   // hot inner
    var cg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 0.018 * S);
    cg.addColorStop(0, "#ffffff"); cg.addColorStop(0.45, "#dafff0"); cg.addColorStop(1, "rgba(164,240,192,0)");
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(hx, hy, 0.018 * S, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // ---- a dark land horizon, low, to ground the comet (a great comet over the night land) ----
    var hb = ctx.createLinearGradient(0, 0.80 * S, 0, 0.90 * S);
    hb.addColorStop(0, "rgba(22,30,52,0)"); hb.addColorStop(1, "rgba(28,38,64,0.42)");
    ctx.fillStyle = hb; ctx.fillRect(0, 0.80 * S, S, 0.12 * S);
    ctx.fillStyle = "#02030a";
    ctx.beginPath(); ctx.moveTo(0, S);
    for (var lxp = 0; lxp <= S; lxp += 0.016 * S) { ctx.lineTo(lxp, 0.87 * S - sn.fbm(lxp / S * 2.6 + 9, 4.2, 3) * 0.055 * S); }
    ctx.lineTo(S, S); ctx.closePath(); ctx.fill();
  }
});
