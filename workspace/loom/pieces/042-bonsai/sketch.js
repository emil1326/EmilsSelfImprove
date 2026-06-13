// Emil's Loom · piece 042 — "Elder"
//
// A bonsai: a little ancient tree in a shallow pot, the patience of decades held in one gnarled trunk.
// The contemplative / grown register — and a deliberate DEPTH move: it revives lib/lsystem.js (primitive
// #5, dormant since Bloom #005, ~60 iterations) and pushes the grown-forms vein past Bloom's simple
// flowering sprigs into a *sculpted* tree — a strong tapering trunk, sparse sculptural boughs, and foliage
// in distinct CLOUD-PADS (the bonsai silhouette, [[035-defining-feature-is-often-the-hard-part]]; a bonsai
// is read by its pads + negative space, not a solid canopy).
//
// The L-system grows the branching skeleton (turtle → segments + tips); the bonsai character is in the
// render: thick gnarled taper, pads clustered on the tips, an earthen pot, soft alcove light. On a pale
// ground luminosity is tone, not glow ([[022-luminosity-on-bright-is-tone]]). Season (green / autumn /
// blossom) is seed-varied — judged across several seeds for accidental reads ([[058-random-features-form-accidental-faces-check-many-seeds]]).
// Composes lsystem (#5) + noise (#3, bark + foliage mottle) + the palette helpers. Static.
Loom.piece({
  id: "042",
  title: "Elder",
  seed: "juniper",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    // ---- a quiet alcove: soft warm light, a shelf, a gentle wall shadow ----
    var wall = ctx.createLinearGradient(0, 0, 0, S);
    wall.addColorStop(0, "#dcd6c8"); wall.addColorStop(0.6, "#cfc8b8"); wall.addColorStop(1, "#bcb4a2");
    ctx.fillStyle = wall; ctx.fillRect(0, 0, S, S);
    var shelfY = S * 0.82;
    var shelf = ctx.createLinearGradient(0, shelfY - S * 0.02, 0, S);
    shelf.addColorStop(0, "#b6ad98"); shelf.addColorStop(0.12, "#a89e87"); shelf.addColorStop(1, "#8f8670");
    ctx.fillStyle = shelf; ctx.fillRect(0, shelfY, S, S - shelfY);
    // a soft light pooling from the upper-left
    var lite = ctx.createRadialGradient(S * 0.32, S * 0.28, S * 0.1, S * 0.4, S * 0.4, S * 0.8);
    lite.addColorStop(0, "rgba(255,250,232,0.35)"); lite.addColorStop(1, "rgba(255,250,232,0)");
    ctx.fillStyle = lite; ctx.fillRect(0, 0, S, S);

    // ---- season (seed-varied foliage) ----
    var season = rng.pick(["green", "green", "autumn", "blossom"]);
    var foliage = season === "autumn" ? { dark: "#9a3c14", mid: "#cc6a1e", lit: "#e8a83e" }
      : season === "blossom" ? { dark: "#d27a9a", mid: "#eca6c0", lit: "#f7d4e2" }
      : { dark: "#33502a", mid: "#557e36", lit: "#84ab52" };

    // ---- grow the tree (L-system) ----
    // rules tuned for a TREE not a bush: a wandering trunk (turns on the main axis) with substantial boughs
    var rules = {
      X: ["F[+X][-X]+FX", "F[-X][+X]-FX", "FF[+X]F[-X]+X", "F[+X]F[-X]-X", "FF[-X][+X]FX"],
      F: "FF"
    };
    var iters = 4, turn = rng.range(28, 38), lean = rng.range(-8, 8);
    var str = Loom.lsystem("X", rules, iters, rng);
    var segs = [], tips = [], minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    Loom.turtle(str, { x: 0, y: 0, angle: -90 + lean, step: 1, turn: turn, stepScale: 0.86 }, {
      segment: function (x0, y0, x1, y1, d) {
        segs.push([x0, y0, x1, y1, d]);
        minX = Math.min(minX, x0, x1); maxX = Math.max(maxX, x0, x1);
        minY = Math.min(minY, y0, y1); maxY = Math.max(maxY, y0, y1);
      },
      tip: function (x, y, d) { tips.push([x, y, d]); }
    });

    // fit the tree into a target box above the pot, planted slightly off-centre
    var potTopY = shelfY + S * 0.005, potCX = S * (0.5 + rng.range(-0.08, 0.08));
    var targetH = S * rng.range(0.58, 0.7), sc = targetH / Math.max(1e-6, maxY - minY);
    var rootX = potCX + S * rng.range(-0.03, 0.03), baseY = potTopY - S * 0.01;
    var midX = (minX + maxX) / 2;
    var mx = function (x) { return rootX + (x - midX) * sc; };
    var my = function (y) { return baseY + (y - maxY) * sc; };
    var baseW = S * 0.03 * (iters >= 5 ? 0.85 : 1);

    // a soft cast shadow of the canopy on the wall, behind everything
    ctx.save(); ctx.globalAlpha = 0.06;
    for (var q = 0; q < tips.length; q++) { ctx.fillStyle = "#5a5240"; ctx.beginPath(); ctx.arc(mx(tips[q][0]) + S * 0.03, my(tips[q][1]) + S * 0.02, S * 0.05, 0, TAU); ctx.fill(); }
    ctx.restore();

    // ---- the trunk + boughs, tapered; bark = a dark limb with a lit edge ----
    function limb(width, color, off) {
      for (var i = 0; i < segs.length; i++) {
        var s = segs[i], d = s[4], w = Math.max(0.7 * U, width * Math.pow(0.72, d));
        ctx.strokeStyle = color; ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(mx(s[0]) + off, my(s[1])); ctx.lineTo(mx(s[2]) + off, my(s[3])); ctx.stroke();
      }
    }
    limb(baseW, "#3a2c1f", 0);                                   // the dark bark body
    limb(baseW * 0.5, "#6b563c", -baseW * 0.22);                 // a lit edge toward the light (upper-left)
    limb(baseW * 0.16, "#8c7656", -baseW * 0.34);                // a fine highlight

    // ---- foliage: soft cloud-pads clustered on the outer tips (the bonsai silhouette) ----
    // keep only the outer tips, then draw layered green puffs → distinct pads with depth
    var pads = tips.filter(function (t) { return t[2] >= 2; });
    // under-shadow of each pad (darker, set down)
    for (var p = 0; p < pads.length; p++) {
      var px = mx(pads[p][0]), py = my(pads[p][1]), rr = S * (0.026 + (nz.fbm(px * 0.02, py * 0.02, 2, 2, 0.5)) * 0.02);
      var g = ctx.createRadialGradient(px, py + rr * 0.3, rr * 0.2, px, py + rr * 0.3, rr);
      g.addColorStop(0, Loom.rgba(foliage.dark, 0.9)); g.addColorStop(1, Loom.rgba(foliage.dark, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py + rr * 0.3, rr, 0, TAU); ctx.fill();
    }
    // the lit body of each pad (mid + a top-left highlight)
    for (p = 0; p < pads.length; p++) {
      var px2 = mx(pads[p][0]), py2 = my(pads[p][1]);
      var rr2 = S * (0.022 + (nz.fbm(px2 * 0.02 + 9, py2 * 0.02 + 9, 2, 2, 0.5)) * 0.018);
      var gm = ctx.createRadialGradient(px2 - rr2 * 0.3, py2 - rr2 * 0.35, rr2 * 0.15, px2, py2, rr2);
      gm.addColorStop(0, foliage.lit); gm.addColorStop(0.5, foliage.mid); gm.addColorStop(1, Loom.rgba(foliage.mid, 0));
      ctx.fillStyle = gm; ctx.beginPath(); ctx.arc(px2, py2, rr2, 0, TAU); ctx.fill();
      // a few speckles of the lit colour for leaf texture
      for (var k = 0; k < 5; k++) {
        ctx.fillStyle = Loom.rgba(foliage.lit, 0.5);
        ctx.beginPath(); ctx.arc(px2 + rng.range(-1, 1) * rr2 * 0.7, py2 + rng.range(-1, 1) * rr2 * 0.7, rng.range(0.5, 1.4) * U, 0, TAU); ctx.fill();
      }
    }

    // ---- the pot: a shallow earthen vessel ----
    var potW = S * rng.range(0.3, 0.38), potH = S * 0.085, potX = potCX - potW / 2, potY = potTopY;
    var potCol = rng.pick(["#6e4a30", "#5c4636", "#54626a"]);
    // soil
    ctx.fillStyle = "#2e241a"; ctx.beginPath();
    ctx.ellipse(potCX, potY + S * 0.004, potW * 0.46, S * 0.012, 0, 0, TAU); ctx.fill();
    // moss + a stone
    for (var m = 0; m < Math.round(40 * U); m++) {
      ctx.fillStyle = Loom.rgba("#4a6034", rng.range(0.3, 0.7));
      ctx.beginPath(); ctx.arc(potCX + rng.range(-1, 1) * potW * 0.4, potY + rng.range(-0.4, 0.8) * S * 0.012, rng.range(0.6, 1.6) * U, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = "#8c8478"; ctx.beginPath(); ctx.ellipse(potCX + potW * rng.range(-0.3, 0.3), potY, S * 0.018, S * 0.01, 0, 0, TAU); ctx.fill();
    // the pot body (trapezoid, narrower at the foot) + rim + feet
    var pg = ctx.createLinearGradient(potX, potY, potX, potY + potH);
    pg.addColorStop(0, Loom.mix(potCol, "#ffffff", 0.18)); pg.addColorStop(0.5, potCol); pg.addColorStop(1, Loom.mix(potCol, "#000000", 0.4));
    ctx.fillStyle = pg; ctx.beginPath();
    ctx.moveTo(potX, potY); ctx.lineTo(potX + potW, potY);
    ctx.lineTo(potX + potW * 0.9, potY + potH); ctx.lineTo(potX + potW * 0.1, potY + potH); ctx.closePath(); ctx.fill();
    ctx.fillStyle = Loom.mix(potCol, "#ffffff", 0.28); ctx.fillRect(potX, potY - S * 0.006, potW, S * 0.008);   // rim
    ctx.fillStyle = Loom.mix(potCol, "#000000", 0.5);                                                            // feet
    ctx.fillRect(potX + potW * 0.16, potY + potH, potW * 0.1, S * 0.012);
    ctx.fillRect(potX + potW * 0.74, potY + potH, potW * 0.1, S * 0.012);
    // pot cast shadow on the shelf
    var ps = ctx.createRadialGradient(potCX, potY + potH, potW * 0.1, potCX, potY + potH, potW * 0.7);
    ps.addColorStop(0, "rgba(60,52,38,0.3)"); ps.addColorStop(1, "rgba(60,52,38,0)");
    ctx.fillStyle = ps; ctx.beginPath(); ctx.ellipse(potCX + S * 0.03, potY + potH + S * 0.006, potW * 0.6, S * 0.02, 0, 0, TAU); ctx.fill();

    // ---- a soft vignette to settle the quiet ----
    var vg = ctx.createRadialGradient(S * 0.45, S * 0.45, S * 0.35, S * 0.5, S * 0.5, S * 0.82);
    vg.addColorStop(0, "rgba(40,36,28,0)"); vg.addColorStop(1, "rgba(40,36,28,0.34)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
