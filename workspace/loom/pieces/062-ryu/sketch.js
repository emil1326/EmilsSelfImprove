// Emil's Loom · piece 062 — "Ryu"
//
// A long Eastern dragon coiling up through the clouds, chasing the flaming pearl. Chosen by genuine PULL
// ([[075-i-reach-for-impressive-to-make-and-miscall-it-my-strength]]) — I love the sinuous cloud-dragon —
// not as a "reach for a 5" ([[076-too-safe-be-bolder-is-my-audits-false-positive-ambition-mandate-fights-pull]]:
// ambition is a question, not a quota; this just pulls). On a PALE misty ink-wash ground, which by pull also
// breaks my dark-ground default (the #95 composition watch). The serpentine body is the tapering-tube-along-a-
// centreline form (the Hippocampus/Mimic idiom — a 3rd use; still NOT harvesting, the bodies diverge, 054).
// De-risked the hard head the way the genre wants: much of the dragon wreathed in cloud, emerging and
// submerging, so the read rides the sinuous body + dorsal spine + horns + whiskers, not a fussy face
// ([[035-defining-feature-is-often-the-hard-part]]). Cloud = soft fbm-broken mist ([[069-translucent-atmosphere-shaped-by-a-mask-reads-as-solid]]).
// Composes noise (cloud) + glow (the pearl) + palette.
Loom.piece({
  id: "062",
  title: "Ryu",
  seed: "long",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- the serpentine centreline (tail at lower-left → neck at upper-right) ----
    var cps = [
      [0.09, 0.80], [0.23, 0.69], [0.39, 0.77], [0.53, 0.61],
      [0.63, 0.67], [0.73, 0.51], [0.82, 0.41], [0.87, 0.31]
    ];
    function catmull(p0, p1, p2, p3, t) { var t2 = t * t, t3 = t2 * t; return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3); }
    var pts = [];
    for (var i = 0; i < cps.length - 1; i++) {
      var p0 = cps[i > 0 ? i - 1 : 0], p1 = cps[i], p2 = cps[i + 1], p3 = cps[i + 2 < cps.length ? i + 2 : cps.length - 1];
      for (var j = 0; j < 16; j++) { var t = j / 16; pts.push([catmull(p0[0], p1[0], p2[0], p3[0], t) * S, catmull(p0[1], p1[1], p2[1], p3[1], t) * S]); }
    }
    var s = [0], total = 0;
    for (var i = 1; i < pts.length; i++) { var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1]; total += Math.sqrt(dx * dx + dy * dy); s.push(total); }
    for (var i = 0; i < s.length; i++) s[i] /= total;
    var wk = [[0, 0.004], [0.1, 0.018], [0.32, 0.030], [0.62, 0.032], [0.82, 0.026], [1, 0.021]];
    function widthAt(ss) { for (var i = 1; i < wk.length; i++) if (ss <= wk[i][0]) { var f = (ss - wk[i - 1][0]) / (wk[i][0] - wk[i - 1][0]); return lerp(wk[i - 1][1], wk[i][1], f) * S; } return wk[wk.length - 1][1] * S; }
    function idxAt(ss) { for (var i = 0; i < s.length; i++) if (s[i] >= ss) return i; return s.length - 1; }
    function tangentAt(i) { var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1; return [dx / L, dy / L]; }
    function backNormal(i) { var t = tangentAt(i), n1 = [-t[1], t[0]], n2 = [t[1], -t[0]]; return n1[1] <= n2[1] ? n1 : n2; }   // smaller y = up = the back

    var pals = [
      { body: "#4a8468", lo: "#23493a", hi: "#8fc8a6", gold: "#d8b24a", horn: "#c8a458", whisk: "#23493a" },   // jade
      { body: "#4a7596", lo: "#233f55", hi: "#9cc4e0", gold: "#cdd6e0", horn: "#bcc6d0", whisk: "#233f55" },   // azure / silver
      { body: "#b04a30", lo: "#5c2113", hi: "#e89a72", gold: "#e2c265", horn: "#d8b24a", whisk: "#5c2113" },   // vermilion / gold
      { body: "#3c4a44", lo: "#1a221f", hi: "#7e8e85", gold: "#c8a458", horn: "#c8a458", whisk: "#1a221f" }    // ink / gold
    ];
    var P = pals[rng.int(0, pals.length - 1)];
    var hx = pts[pts.length - 1][0], hy = pts[pts.length - 1][1];
    var pearl = [0.93 * S, 0.16 * S];
    var hd = Math.atan2(pearl[1] - hy, pearl[0] - hx), cos = Math.cos(hd), sin = Math.sin(hd), px = -sin, py = cos;

    // ---- misty ground ----
    var bg = ctx.createLinearGradient(0, 0, 0, S);
    bg.addColorStop(0, "#ece6d9"); bg.addColorStop(0.5, "#deded4"); bg.addColorStop(1, "#ccd1cc");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);

    // ---- soft mist clouds (fbm-broken, no hard edges) ----
    function cloud(c, cxp, cyp, rw, rh, n, alpha, warm) {
      for (var k = 0; k < n; k++) {
        var a = rng.range(0, TAU), rr = Math.sqrt(rng.range(0, 1));
        var bx = cxp + Math.cos(a) * rr * rw, by = cyp + Math.sin(a) * rr * rh;
        var br = rng.range(0.04, 0.1) * S * (1 - 0.4 * rr);
        var gg = c.createRadialGradient(bx, by, 0, bx, by, br);
        gg.addColorStop(0, "rgba(" + warm + "," + (alpha * (1 - rr * 0.5)).toFixed(3) + ")"); gg.addColorStop(1, "rgba(" + warm + ",0)");
        c.fillStyle = gg; c.beginPath(); c.arc(bx, by, br, 0, TAU); c.fill();
      }
    }
    // back clouds (behind the dragon)
    cloud(ctx, 0.28 * S, 0.6 * S, 0.22 * S, 0.1 * S, 26, 0.5, "248,246,238");
    cloud(ctx, 0.7 * S, 0.34 * S, 0.16 * S, 0.09 * S, 18, 0.45, "248,246,238");

    // ---- the dragon, drawn on its own layer then shaded ----
    var dc = document.createElement("canvas"); dc.width = S; dc.height = S; var o = dc.getContext("2d");
    o.lineCap = "round"; o.lineJoin = "round";
    // dorsal spine (a serrated fin/mane along the back) — under the body so it reads as a ridge
    o.fillStyle = P.lo;
    for (var ss = 0.08; ss < 0.95; ss += 0.026) {
      var i = idxAt(ss), t = tangentAt(i), n = backNormal(i), w = widthAt(s[i]), sp = w * 0.7 + 0.004 * S;
      var bx = pts[i][0] + n[0] * w * 0.5, by = pts[i][1] + n[1] * w * 0.5;
      o.beginPath();
      o.moveTo(bx - t[0] * sp * 0.6, by - t[1] * sp * 0.6);
      o.lineTo(bx + n[0] * sp - t[0] * sp * 0.3, by + n[1] * sp - t[1] * sp * 0.3);
      o.lineTo(bx + t[0] * sp * 0.6, by + t[1] * sp * 0.6);
      o.closePath(); o.fill();
    }
    // body tube
    o.strokeStyle = P.body;
    for (var i = 1; i < pts.length; i++) { o.beginPath(); o.lineWidth = 2 * widthAt(s[i]); o.moveTo(pts[i - 1][0], pts[i - 1][1]); o.lineTo(pts[i][0], pts[i][1]); o.stroke(); }
    // belly: a pale underside stripe
    o.strokeStyle = P.gold; o.globalAlpha = 0.35;
    for (var i = 1; i < pts.length; i++) { var bn = backNormal(i), w = widthAt(s[i]); o.beginPath(); o.lineWidth = w * 0.7; o.moveTo(pts[i - 1][0] - bn[0] * w * 0.4, pts[i - 1][1] - bn[1] * w * 0.4); o.lineTo(pts[i][0] - bn[0] * w * 0.4, pts[i][1] - bn[1] * w * 0.4); o.stroke(); }
    o.globalAlpha = 1;

    // scales — overlapping scallops along the body (offset rows)
    o.strokeStyle = Loom.rgba(P.lo, 0.4); o.lineWidth = Math.max(1, 0.0015 * S);
    var pxPerIdx = total / pts.length, row = 0;
    for (var ii = 6; ii < pts.length - 4;) {
      var w = widthAt(s[ii]);
      if (w > 0.007 * S) {
        var t = tangentAt(ii), n = [-t[1], t[0]], fang = Math.atan2(t[1], t[0]), off = (row % 2) * 0.5;
        for (var c = -1; c <= 1; c++) { var cc = c + off; if (Math.abs(cc) > 1.25) continue; var sx = pts[ii][0] + n[0] * cc * w * 0.55, sy = pts[ii][1] + n[1] * cc * w * 0.55; o.beginPath(); o.arc(sx, sy, w * 0.36, fang - 1.25, fang + 1.25); o.stroke(); }
        row++;
      }
      ii += Math.max(2, Math.round((w * 0.5) / pxPerIdx));
    }

    // head (on the same layer so it shades with the body): jaw + skull + snout
    function headShape() {
      o.fillStyle = P.body;
      // skull bulge
      o.beginPath(); o.ellipse(hx + cos * 0.012 * S, hy + sin * 0.012 * S, 0.04 * S, 0.032 * S, hd, 0, TAU); o.fill();
      // snout (tapering forward to the nose)
      var sn0 = [hx + cos * 0.02 * S, hy + sin * 0.02 * S], sn1 = [hx + cos * 0.085 * S, hy + sin * 0.085 * S];
      for (var i = 1; i <= 9; i++) { var t0 = (i - 1) / 9, t1 = i / 9; o.beginPath(); o.lineWidth = lerp(0.05 * S, 0.018 * S, t1); o.lineCap = "round"; o.moveTo(lerp(sn0[0], sn1[0], t0), lerp(sn0[1], sn1[1], t0)); o.lineTo(lerp(sn0[0], sn1[0], t1), lerp(sn0[1], sn1[1], t1)); o.stroke(); }
      o.strokeStyle = P.body;
      // lower jaw (a shorter under-tube)
      var jw0 = [hx + cos * 0.022 * S + px * 0.02 * S, hy + sin * 0.022 * S + py * 0.02 * S], jw1 = [hx + cos * 0.062 * S + px * 0.016 * S, hy + sin * 0.062 * S + py * 0.016 * S];
      for (var i = 1; i <= 6; i++) { var t0 = (i - 1) / 6, t1 = i / 6; o.beginPath(); o.lineWidth = lerp(0.026 * S, 0.012 * S, t1); o.moveTo(lerp(jw0[0], jw1[0], t0), lerp(jw0[1], jw1[1], t0)); o.lineTo(lerp(jw0[0], jw1[0], t1), lerp(jw0[1], jw1[1], t1)); o.stroke(); }
    }
    headShape();

    // form shading — light from the upper-left, shadow lower-right (clipped to the dragon)
    o.globalCompositeOperation = "source-atop";
    var fg = o.createLinearGradient(0, 0.2 * S, 0.7 * S, S);
    fg.addColorStop(0, Loom.rgba(P.hi, 0.5)); fg.addColorStop(0.5, Loom.rgba(P.body, 0)); fg.addColorStop(1, Loom.rgba(P.lo, 0.6));
    o.fillStyle = fg; o.fillRect(0, 0, S, S);
    o.globalCompositeOperation = "source-over";

    ctx.drawImage(dc, 0, 0);

    // ---- horns (branching back from the skull) + whiskers (flowing) + eye, over the body ----
    ctx.lineCap = "round";
    function horn(h) {                                        // a solid, backswept, tapering horn
      var base = [hx - cos * 0.02 * S + px * h * 0.02 * S, hy - sin * 0.02 * S + py * h * 0.02 * S];
      var dx = -cos * 0.72 + px * h * 0.46, dy = -sin * 0.72 + py * h * 0.46, dl = Math.hypot(dx, dy); dx /= dl; dy /= dl;
      var ppx = -dy, ppy = dx, len = 0.096 * S, bw = 0.015 * S;
      var mid = [base[0] + dx * len * 0.5, base[1] + dy * len * 0.5], tip = [base[0] + dx * len - cos * 0.016 * S, base[1] + dy * len - sin * 0.016 * S];
      ctx.fillStyle = P.horn; ctx.beginPath();
      ctx.moveTo(base[0] + ppx * bw, base[1] + ppy * bw);
      ctx.quadraticCurveTo(mid[0] + ppx * bw * 0.55, mid[1] + ppy * bw * 0.55, tip[0], tip[1]);
      ctx.quadraticCurveTo(mid[0] - ppx * bw * 0.55, mid[1] - ppy * bw * 0.55, base[0] - ppx * bw, base[1] - ppy * bw);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = P.horn; ctx.lineWidth = 0.006 * S; ctx.lineCap = "round";   // a small antler tine
      ctx.beginPath(); ctx.moveTo(mid[0], mid[1]); ctx.lineTo(mid[0] + dx * 0.03 * S - cos * 0.018 * S, mid[1] + dy * 0.03 * S - sin * 0.018 * S); ctx.stroke();
      ctx.strokeStyle = Loom.rgba("#6f5a2a", 0.4); ctx.lineWidth = 0.0015 * S; ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.quadraticCurveTo(mid[0], mid[1], tip[0], tip[1]); ctx.stroke();
    }
    horn(-1); horn(1);
    ctx.strokeStyle = P.whisk; ctx.lineWidth = 0.004 * S;
    for (var w = -1; w <= 1; w += 2) {                       // long barbels trailing back from the nose, drooping
      var wx = hx + cos * 0.085 * S + px * w * 0.008 * S, wy = hy + sin * 0.085 * S + py * w * 0.008 * S;
      ctx.beginPath(); ctx.moveTo(wx, wy);
      ctx.bezierCurveTo(
        wx + cos * 0.035 * S + px * w * 0.055 * S, wy + sin * 0.035 * S + py * w * 0.055 * S,
        wx - cos * 0.04 * S + px * w * 0.1 * S, wy - sin * 0.04 * S + py * w * 0.1 * S + 0.05 * S,
        wx - cos * 0.12 * S + px * w * 0.06 * S, wy - sin * 0.12 * S + py * w * 0.06 * S + 0.13 * S);
      ctx.stroke();
    }
    var ex = hx + cos * 0.012 * S - px * 0.016 * S, ey = hy + sin * 0.012 * S - py * 0.016 * S;
    ctx.fillStyle = P.gold; ctx.beginPath(); ctx.arc(ex, ey, 0.012 * S, 0, TAU); ctx.fill();
    ctx.fillStyle = "#160f06"; ctx.beginPath(); ctx.arc(ex, ey, 0.0055 * S, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,250,235,0.9)"; ctx.beginPath(); ctx.arc(ex - 0.003 * S, ey - 0.003 * S, 0.002 * S, 0, TAU); ctx.fill();

    // ---- front clouds: wreathe and partly occlude the body (emerge/submerge) ----
    cloud(ctx, 0.34 * S, 0.71 * S, 0.16 * S, 0.07 * S, 20, 0.6, "246,244,236");
    cloud(ctx, 0.6 * S, 0.56 * S, 0.13 * S, 0.06 * S, 16, 0.55, "246,244,236");
    cloud(ctx, 0.8 * S, 0.42 * S, 0.1 * S, 0.05 * S, 12, 0.5, "246,244,236");

    // ---- the flaming pearl ----
    Loom.glow(ctx, pearl[0], pearl[1], 0.12 * S, "#ffe9a8", 0.5, 0.5);
    var pgr = ctx.createRadialGradient(pearl[0] - 0.01 * S, pearl[1] - 0.01 * S, 0.002 * S, pearl[0], pearl[1], 0.03 * S);
    pgr.addColorStop(0, "#fffdf4"); pgr.addColorStop(0.6, "#ffe7a2"); pgr.addColorStop(1, "#e6b455");
    ctx.fillStyle = pgr; ctx.beginPath(); ctx.arc(pearl[0], pearl[1], 0.03 * S, 0, TAU); ctx.fill();
  }
});
