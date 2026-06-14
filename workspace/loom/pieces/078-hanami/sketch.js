// Emil's Loom · piece 078 — "Hanami"
//
// A cherry branch in full bloom against a soft spring sky — hanami, the old habit of going to *look* at the
// blossom precisely because it won't last. Leans LIGHT (a bright day, after two dark pieces); the variation
// axis is the BRANCH STRUCTURE itself (recursive, seeded — a different tree each weave), NOT a palette pick
// (the audit at #115 caught palette-MOODS going reflexive). Ran 083 myself: the READ is the branch + pink,
// but the SING is the BLOSSOMS — their soft, abundant, delicate mass — validated FIRST, not the satisfying
// skeleton ([[083-soul-check-the-layer-that-carries-the-read-and-sing-not-the-impressive-one]]; the Momiji
// #107 trap: the foliage-mass is the soul). Drifting petals fall in front (animated, pure fn of t). Composes
// noise + glow + ramp.
Loom.piece({
  id: "078",
  title: "Hanami",
  seed: "someiyoshino",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));
    function dot(g, x, y, r) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }

    // ---- one cherry blossom: five soft petals, a cream eye, gold stamens (the soul) ----
    function blossom(g, x, y, r, rot, tone, soft) {
      for (var i = 0; i < 5; i++) {
        var a = rot + i * 1.2566 + (nz.fbm(x * 0.05 + i, y * 0.05, 2) - 0.5) * 0.5;
        var px = x + Math.cos(a) * r * 0.6, py = y + Math.sin(a) * r * 0.6;
        var grd = g.createRadialGradient(px, py, 0, px, py, r * 0.7);
        grd.addColorStop(0, tone > 0.5 ? "#f0a6c2" : "#f7c6d8");
        grd.addColorStop(0.6, "#fac9da"); grd.addColorStop(1, soft ? "#fbdfe9" : "#fdeaf0");
        g.fillStyle = grd;
        g.save(); g.translate(px, py); g.rotate(a); g.scale(1, 0.66);
        g.beginPath(); g.arc(0, 0, r * 0.52, 0, TAU); g.fill(); g.restore();
      }
      if (soft) return;                                   // distant blossoms skip the fine centre
      g.fillStyle = "#fdf3e2"; dot(g, x, y, r * 0.26);
      g.fillStyle = "#e7a84a";
      for (var s = 0; s < 7; s++) { var sa = rot + s * 0.9; dot(g, x + Math.cos(sa) * r * 0.34, y + Math.sin(sa) * r * 0.34, r * 0.055); }
      g.fillStyle = "#d98aa8"; dot(g, x, y, r * 0.08);
    }
    function bud(g, x, y, r, rot) {
      g.fillStyle = "#f4b6cc";
      g.save(); g.translate(x, y); g.rotate(rot); g.scale(0.6, 1);
      g.beginPath(); g.arc(0, 0, r * 0.6, 0, TAU); g.fill(); g.restore();
    }
    // a tight cluster of blossoms + buds around a twig point
    function cluster(g, x, y, scale, soft) {
      var n = 3 + (rng.range(0, 3) | 0);
      for (var i = 0; i < n; i++) {
        var ox = x + rng.gaussian() * 0.03 * S * scale, oy = y + rng.gaussian() * 0.03 * S * scale;
        var r = rng.range(0.016, 0.03) * S * scale;
        if (rng.bool() && rng.bool()) bud(g, ox, oy, r * 0.7, rng.range(0, TAU));
        else blossom(g, ox, oy, r, rng.range(0, TAU), rng.range(0, 1), soft);
      }
    }

    // ---- recursive gnarled branch; collects twig points to bloom (the variation axis) ----
    var tips = [];
    function grow(g, x, y, ang, len, w, depth) {
      var ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
      var mx = (x + ex) / 2 + Math.cos(ang + 1.57) * len * rng.range(-0.18, 0.18);   // a gnarled bow
      var my = (y + ey) / 2 + Math.sin(ang + 1.57) * len * rng.range(-0.18, 0.18);
      g.strokeStyle = "#5a4636"; g.lineCap = "round"; g.lineWidth = Math.max(1, w);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(mx, my, ex, ey); g.stroke();
      if (depth >= 5 || len < 0.05 * S) { tips.push([ex, ey, depth]); return; }
      if (depth >= 2) tips.push([(x + ex) / 2, (y + ey) / 2, depth + 1]);              // bloom along the limb too
      var n = depth < 2 ? 3 : (rng.bool() ? 2 : 3);
      for (var i = 0; i < n; i++) {
        var spread = rng.range(0.28, 0.72) * (i === 0 ? -1 : (i === 1 ? 1 : rng.range(-0.4, 0.4)));
        grow(g, ex, ey, ang + spread - 0.12, len * rng.range(0.66, 0.8), w * 0.66, depth + 1);
      }
    }

    // ---- render the whole still scene once (so animated petals can blit over it) ----
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var sc = document.createElement("canvas"); sc.width = Math.floor(S * dpr); sc.height = Math.floor(S * dpr);
    var g = sc.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);

    var sky = g.createLinearGradient(0, 0, 0, S);
    sky.addColorStop(0, "#dde9f1"); sky.addColorStop(0.55, "#ece7ec"); sky.addColorStop(1, "#f5e9e2");
    g.fillStyle = sky; g.fillRect(0, 0, S, S);

    // far bloom-haze: soft out-of-focus pink clouds behind the branch (depth)
    for (var h = 0; h < 9; h++) Loom.glow(g, rng.range(0.2, 0.95) * S, rng.range(0.1, 0.6) * S, rng.range(0.08, 0.16) * S, "#f3c2d6", 0.5, 0.5);

    // the branch, entering low-left and arcing up-right, blooming at the twigs
    var rootX = -0.02 * S, rootY = 0.82 * S;
    grow(g, rootX, rootY, -0.42, 0.30 * S, 11 * U, 0);
    var far = [], near = [];
    for (var i = 0; i < tips.length; i++) (tips[i][2] >= 4 ? far : near).push(tips[i]);
    for (var f = 0; f < far.length; f++) cluster(g, far[f][0], far[f][1], 0.9, true);     // back layer (soft)
    for (var n2 = 0; n2 < near.length; n2++) cluster(g, near[n2][0], near[n2][1], 1.08, false); // front layer

    // ---- drifting petals: a gentle, fluttering fall in front (animated, pure fn of t) ----
    var W = S + 0.1 * S, H = S + 0.1 * S, petals = [];
    for (var p = 0; p < 24; p++) petals.push({
      x0: rng.range(0, S), yoff: rng.range(0, 1), fall: rng.range(0.05, 0.09) * S,
      swA: rng.range(0.03, 0.08) * S, swF: rng.range(0.5, 1.1), swP: rng.range(0, TAU),
      r: rng.range(0.009, 0.016) * S, rotF: rng.range(0.6, 1.6) * (rng.bool() ? 1 : -1), tone: rng.range(0, 1)
    });
    function petal(x, y, r, rot, tone) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, 0.5);
      var grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      grd.addColorStop(0, tone > 0.5 ? "#f2b0cb" : "#f9d2e0"); grd.addColorStop(1, "#fce6ee");
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore();
    }

    return function (t) {
      ctx.drawImage(sc, 0, 0, S, S);
      for (var i = 0; i < petals.length; i++) {
        var pp = petals[i];
        var y = ((pp.yoff + t * pp.fall / H) % 1) * H - 0.05 * S;                    // wraps off-screen (no seam)
        var x = (((pp.x0 + pp.swA * Math.sin(t * pp.swF + pp.swP) + t * 0.012 * S) % W) + W) % W - 0.05 * S;
        petal(x, y, pp.r, t * pp.rotF + pp.swP, pp.tone);
      }
    };
  }
});
