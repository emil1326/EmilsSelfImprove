// Emil's Loom · piece 060 — "Hippocampus"
//
// A seahorse — Hippocampus, the little armoured horse of the sea (and the seahorse-shaped fold of the
// brain that borrows its name). A genuine creature with a SUBJECT-hook ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]):
// the unmistakable silhouette — coronet, horse-head bent to a tubular snout, the round ringed belly, and the
// prehensile tail curled into a spiral around a blade of seagrass. A deliberate swing clear of my most-worn
// form, the soft glowing FIELD (Koi/Geode/Glacier), and back to a drawn living thing
// ([[073-a-lesson-applied-by-reflex-becomes-a-rut]]). The read lives in the contour (035/061), built the way
// the medium likes — a tapering tube stroked along a parametric centreline (the octopus-arm trick, Mimic #57,
// [[053-tight-tiling-render-by-inverse-mapping-not-forward-stamping]] cousin). Composes noise + palette + ramp + glow.
Loom.piece({
  id: "060",
  title: "Hippocampus",
  seed: "amber",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---------- centreline: the spine, then the tail coiling into a spiral ----------
    var cps = [
      [0.515, 0.225], [0.470, 0.310], [0.452, 0.420], [0.495, 0.520], [0.560, 0.602]
    ];
    function catmull(p0, p1, p2, p3, t) {
      var t2 = t * t, t3 = t2 * t;
      return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
    }
    var pts = [];
    for (var i = 0; i < cps.length - 1; i++) {
      var p0 = cps[i > 0 ? i - 1 : 0], p1 = cps[i], p2 = cps[i + 1], p3 = cps[i + 2 < cps.length ? i + 2 : cps.length - 1];
      for (var j = 0; j < 12; j++) {
        var t = j / 12;
        pts.push([catmull(p0[0], p1[0], p2[0], p3[0], t), catmull(p0[1], p1[1], p2[1], p3[1], t)]);
      }
    }
    var tcx = 0.520, tcy = 0.668, a0 = -0.85, turns = 1.5, r0 = 0.074, r1 = 0.009, M = 46;
    for (var k = 0; k <= M; k++) {
      var tt = k / M, ang = a0 + turns * TAU * tt, r = lerp(r0, r1, tt);
      pts.push([tcx + Math.cos(ang) * r, tcy + Math.sin(ang) * r]);
    }
    for (var i = 0; i < pts.length; i++) { pts[i][0] *= S; pts[i][1] *= S; }

    // arc-length s ∈ [0,1] along the centreline
    var s = [0], total = 0;
    for (var i = 1; i < pts.length; i++) { var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1]; total += Math.sqrt(dx * dx + dy * dy); s.push(total); }
    for (var i = 0; i < s.length; i++) s[i] /= total;

    // width (radius, px) along s: thin neck → round belly → taper to the tail tip
    var wk = [[0, 0.028], [0.16, 0.05], [0.32, 0.060], [0.5, 0.046], [0.66, 0.031], [0.83, 0.017], [1, 0.005]];
    function widthAt(ss) {
      for (var i = 1; i < wk.length; i++) { if (ss <= wk[i][0]) { var f = (ss - wk[i - 1][0]) / (wk[i][0] - wk[i - 1][0]); return lerp(wk[i - 1][1], wk[i][1], f) * S; } }
      return wk[wk.length - 1][1] * S;
    }
    function idxAt(ss) { for (var i = 0; i < s.length; i++) if (s[i] >= ss) return i; return s.length - 1; }
    function tangentAt(i) { var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; var dx = b[0] - a[0], dy = b[1] - a[1]; var L = Math.sqrt(dx * dx + dy * dy) || 1; return [dx / L, dy / L]; }
    function normalBack(i) { var t = tangentAt(i); var n1 = [-t[1], t[0]], n2 = [t[1], -t[0]]; return n1[0] >= n2[0] ? n1 : n2; }  // +x side = the back

    // ---------- jewel palette (seed-varied; all stay believably seahorse) ----------
    var pals = [
      { b: "#cba24a", lo: "#6c4c1a", hi: "#f3d684", ac: "#a4641b", fin: "#ecc978" },  // amber/gold
      { b: "#c1543f", lo: "#591c17", hi: "#ee9b79", ac: "#8a2820", fin: "#e7a98c" },  // coral/ruby
      { b: "#8b6ab2", lo: "#382659", hi: "#caabe2", ac: "#56398a", fin: "#cbb2e4" },  // violet
      { b: "#4ea07e", lo: "#1b4736", hi: "#9bd8b8", ac: "#2c6a4f", fin: "#a8ddc4" }   // jade
    ];
    var P = pals[rng.int(0, pals.length - 1)];

    // ---------- the seahorse, drawn opaque on its own layer, then shaded ----------
    var sc = document.createElement("canvas"); sc.width = S; sc.height = S;
    var o = sc.getContext("2d");
    o.lineCap = "round"; o.lineJoin = "round";
    var hx = pts[0][0], hy = pts[0][1], hcx = hx - 0.004 * S, hcy = hy - 0.036 * S, hr = 0.05 * S;

    // (1) opaque silhouette in the base colour: body, dorsal spines, coronet, head, snout
    o.strokeStyle = P.b; o.fillStyle = P.b;
    for (var i = 1; i < pts.length; i++) { o.beginPath(); o.lineWidth = 2 * widthAt(s[i]); o.moveTo(pts[i - 1][0], pts[i - 1][1]); o.lineTo(pts[i][0], pts[i][1]); o.stroke(); }
    function spineAt(i, nx, ny) {                                      // a small dorsal spine on the (nx,ny) side
      var t = tangentAt(i), w = widthAt(s[i]); var bx = pts[i][0] + nx * w * 0.95, by = pts[i][1] + ny * w * 0.95, sp = 0.013 * S;
      o.beginPath();
      o.moveTo(bx - t[0] * 0.010 * S, by - t[1] * 0.010 * S);
      o.lineTo(bx + nx * sp - t[0] * 0.001 * S, by + ny * sp - t[1] * 0.001 * S);
      o.lineTo(bx + t[0] * 0.010 * S, by + t[1] * 0.010 * S);
      o.closePath(); o.fill();
    }
    for (var ss = 0.07; ss < 0.45; ss += 0.05) { var i = idxAt(ss), n = normalBack(i); spineAt(i, n[0], n[1]); }            // upper back ridge (right side)
    for (var ss = 0.62; ss < 0.92; ss += 0.048) { var i = idxAt(ss), dx = pts[i][0] - tcx * S, dy = pts[i][1] - tcy * S, L = Math.sqrt(dx * dx + dy * dy) || 1; spineAt(i, dx / L, dy / L); }   // outer edge of the tail coil
    o.lineWidth = 0.012 * S;                                            // coronet spikes
    for (var c = 0; c < 4; c++) { var ang = -2.15 + c * 0.34; o.beginPath(); o.moveTo(hcx + Math.cos(ang) * hr * 0.85, hcy + Math.sin(ang) * hr * 0.85); o.lineTo(hcx + Math.cos(ang) * hr * 1.55, hcy + Math.sin(ang) * hr * 1.55); o.stroke(); }
    o.beginPath(); o.arc(hcx, hcy, hr, 0, TAU); o.fill();               // head
    var sn0 = [hcx - 0.026 * S, hcy + 0.012 * S], sn1 = [hcx - 0.104 * S, hcy + 0.05 * S], snN = 10;   // snout
    for (var i = 1; i <= snN; i++) { var t0 = (i - 1) / snN, t1 = i / snN; o.beginPath(); o.lineWidth = lerp(0.046 * S, 0.015 * S, t1); o.moveTo(lerp(sn0[0], sn1[0], t0), lerp(sn0[1], sn1[1], t0)); o.lineTo(lerp(sn0[0], sn1[0], t1), lerp(sn0[1], sn1[1], t1)); o.stroke(); }

    // (2) form shading — light from upper-left, shadow to lower-right (clipped to the body)
    o.globalCompositeOperation = "source-atop";
    var fg = o.createLinearGradient(0.30 * S, 0.10 * S, 0.74 * S, 0.78 * S);
    fg.addColorStop(0, Loom.rgba(P.hi, 0.55)); fg.addColorStop(0.5, Loom.rgba(P.b, 0)); fg.addColorStop(1, Loom.rgba(P.lo, 0.62));
    o.fillStyle = fg; o.fillRect(0, 0, S, S);
    // (3) iridescent mottle
    for (var m = 0; m < 8; m++) { var mi = idxAt(rng.range(0.05, 0.86)), mw = widthAt(s[mi]); var mx = pts[mi][0] + rng.range(-0.5, 0.5) * mw, my = pts[mi][1] + rng.range(-0.5, 0.5) * mw; var col = rng.range(0, 1) < 0.5 ? P.hi : P.lo; var g = o.createRadialGradient(mx, my, 0, mx, my, 0.055 * S); g.addColorStop(0, Loom.rgba(col, 0.2)); g.addColorStop(1, Loom.rgba(col, 0)); o.fillStyle = g; o.beginPath(); o.arc(mx, my, 0.055 * S, 0, TAU); o.fill(); }
    // (4) bony segment rings (grooves across the body)
    o.strokeStyle = Loom.rgba(P.lo, 0.4); o.lineWidth = Math.max(1.3, 0.005 * S);
    for (var ss = 0.045; ss < 0.93; ss += 0.05) { var i = idxAt(ss), nb = normalBack(i), w = widthAt(s[i]); o.beginPath(); o.moveTo(pts[i][0] - nb[0] * w, pts[i][1] - nb[1] * w); o.lineTo(pts[i][0] + nb[0] * w, pts[i][1] + nb[1] * w); o.stroke(); }
    // a soft polished highlight on the lit belly (the form gradient does the rest — no hard edge)
    var hg = o.createRadialGradient(0.45 * S, 0.33 * S, 0, 0.45 * S, 0.33 * S, 0.17 * S);
    hg.addColorStop(0, Loom.rgba(P.hi, 0.5)); hg.addColorStop(1, Loom.rgba(P.hi, 0));
    o.fillStyle = hg; o.fillRect(0, 0, S, S);
    o.globalCompositeOperation = "source-over";

    // (5) translucent dorsal fin on the back, mid-body
    var f0 = idxAt(0.15), f1 = idxAt(0.4);
    o.beginPath();
    for (var i = f0; i <= f1; i++) { var nb = normalBack(i), w = widthAt(s[i]); var x = pts[i][0] + nb[0] * w * 0.92, y = pts[i][1] + nb[1] * w * 0.92; if (i === f0) o.moveTo(x, y); else o.lineTo(x, y); }
    for (var i = f1; i >= f0; i--) { var nb = normalBack(i), w = widthAt(s[i]); var u = (i - f0) / (f1 - f0); var fh = Math.sin(u * Math.PI) * 0.06 * S * (1 + 0.14 * Math.sin(u * 14)); o.lineTo(pts[i][0] + nb[0] * (w * 0.92 + fh), pts[i][1] + nb[1] * (w * 0.92 + fh)); }
    o.closePath(); o.fillStyle = Loom.rgba(P.fin, 0.34); o.fill();
    o.strokeStyle = Loom.rgba(P.hi, 0.42); o.lineWidth = 1; for (var i = f0 + 2; i < f1; i += 3) { var nb = normalBack(i), w = widthAt(s[i]), u = (i - f0) / (f1 - f0); var fh = Math.sin(u * Math.PI) * 0.06 * S; o.beginPath(); o.moveTo(pts[i][0] + nb[0] * w * 0.92, pts[i][1] + nb[1] * w * 0.92); o.lineTo(pts[i][0] + nb[0] * (w * 0.92 + fh), pts[i][1] + nb[1] * (w * 0.92 + fh)); o.stroke(); }

    // (6) eye — dark bead + a wet catchlight (make it look back at you, 040)
    var ex = hcx - 0.012 * S, ey = hcy + 0.004 * S;
    o.fillStyle = "#1a0f06"; o.beginPath(); o.arc(ex, ey, 0.0135 * S, 0, TAU); o.fill();
    o.fillStyle = Loom.rgba(P.ac, 0.8); o.beginPath(); o.arc(ex, ey, 0.0135 * S, 0.6, 2.6); o.fill();
    o.fillStyle = "rgba(255,250,236,0.92)"; o.beginPath(); o.arc(ex - 0.004 * S, ey - 0.004 * S, 0.0042 * S, 0, TAU); o.fill();

    // ---------- water, seagrass, composite ----------
    var wg = ctx.createLinearGradient(0, 0, 0, S);
    wg.addColorStop(0, "#13565b"); wg.addColorStop(0.5, "#0c3a44"); wg.addColorStop(1, "#06222e");
    ctx.fillStyle = wg; ctx.fillRect(0, 0, S, S);
    // faint light from above + drifting marine snow — subtle underwater life
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    var topg = ctx.createRadialGradient(0.5 * S, -0.12 * S, 0, 0.5 * S, -0.12 * S, 0.85 * S);
    topg.addColorStop(0, "rgba(120,200,198,0.11)"); topg.addColorStop(1, "rgba(120,200,198,0)");
    ctx.fillStyle = topg; ctx.fillRect(0, 0, S, S);
    ctx.restore();
    for (var p = 0; p < 34; p++) { var psx = rng.range(0.05, 0.95) * S, psy = rng.range(0.04, 0.98) * S; ctx.fillStyle = "rgba(212,230,226," + (0.05 + rng.range(0, 0.12)).toFixed(3) + ")"; ctx.beginPath(); ctx.arc(psx, psy, rng.range(0.4, 1.6), 0, TAU); ctx.fill(); }
    // thin wispy seagrass blades behind, one near where the tail curls
    ctx.lineCap = "round";
    for (var bld = 0; bld < 3; bld++) {
      var bx0 = (0.46 + bld * 0.052) * S, amp = (0.6 + 0.25 * bld) * 0.045 * S, ph = bld * 1.7, hgt = lerp(0.38, 0.55, bld % 2);
      ctx.strokeStyle = Loom.rgba(bld === 1 ? "#2c8568" : "#1d6b50", 0.4); ctx.lineWidth = (0.005 + 0.004 * (bld % 2)) * S;
      ctx.beginPath(); ctx.moveTo(bx0, S * 1.02);
      for (var q = 0; q <= 1; q += 0.05) { var yy = lerp(1.02, hgt, q) * S; ctx.lineTo(bx0 + Math.sin(q * 6 + ph) * amp * q, yy); }
      ctx.stroke();
    }
    ctx.drawImage(sc, 0, 0);
  }
});
