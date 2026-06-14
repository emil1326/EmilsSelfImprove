// Emil's Loom · piece 098 — "Venation"
//
// A single autumn leaf held up to the light — and the light goes straight through it, turning the blade into
// stained glass and throwing the whole hidden VEIN-SKELETON into shadow against the glow. The hook is that
// reveal (090 — an abstract/structure sings by being made visible): the branching venation, normally unseen,
// laid bare by backlight; the blade a luminous wash of turning autumn (gold→red), the veins a dark recursive
// tree. A deliberate APPLY-THE-GATE piece (#140) in my serene-light 5-lane (075): the sing-layer is LIGHT +
// branching STRUCTURE, both strengths (022/037), no figure/cloud/majesty; calm, varied off the radial-burst.
// Self-directed; no advisor (no fork, 099). Composes glow + ramp + noise.
Loom.piece({
  id: "098",
  title: "Venation",
  seed: "deciduous",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- seed parameters (wide; leaf angle, shape, turn, vein density vary; 085/097) ----
    var ang = rng.range(-0.7, -0.35);                     // leaf axis (base lower-left → tip upper-right-ish)
    var flip = rng.bool() ? 1 : -1;
    ang *= flip;
    var cx = rng.range(0.46, 0.54) * S, cy = rng.range(0.5, 0.56) * S;   // leaf centre
    var LL = rng.range(0.82, 0.94) * S;                   // leaf length
    var widthF = rng.range(0.26, 0.34);                   // blade breadth (fraction of LL)
    var nSec = rng.int(12, 16);                           // secondary vein nodes
    var turn = rng.range(0, 1);                           // gold .. deep red autumn turn
    var serr = rng.range(0.5, 1.3);                       // margin serration strength

    var leafPal = Loom.ramp(["#ffe070", "#f6b833", "#e8842a", "#d8501f", "#a82a14"]);
    var _c = [0, 0, 0];
    function lp(t, a) { leafPal.rgb(Math.max(0, Math.min(1, t)), _c); return "rgba(" + (_c[0] | 0) + "," + (_c[1] | 0) + "," + (_c[2] | 0) + "," + a + ")"; }

    // local frame: x = base(-0.5)→tip(+0.5) along the midrib, y = across the blade
    function L2W(lx, ly) { var c = Math.cos(ang), s = Math.sin(ang); return [cx + (lx * LL) * c - (ly * LL) * s, cy + (lx * LL) * s + (ly * LL) * c]; }
    function halfWidth(t) {                                // t: 0 base .. 1 tip
      var u = t;
      return widthF * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.82)), 0.7) * (1 - 0.15 * u);
    }
    function margin(t, side) {                             // a leaf-edge point (with gentle serration)
      var w = halfWidth(t);
      var ser = Math.sin(t * 46) * 0.012 * serr * (t > 0.04 && t < 0.97 ? 1 : 0) + (nz.fbm(t * 7, side * 3, 2) - 0.5) * 0.01;
      return L2W(-0.5 + t, side * (w + ser));
    }

    // =========================================================================
    //  THE BACKLIGHT — a warm sun straight behind the leaf
    // =========================================================================
    var bgg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 0.85 * S);
    bgg.addColorStop(0, "#7a4a16"); bgg.addColorStop(0.5, "#3e2208"); bgg.addColorStop(1, "#1c0e03");
    ctx.fillStyle = bgg; ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, cx, cy, 0.6 * S, "#ffdf8c", 0.4, 0.6);
    ctx.globalCompositeOperation = "source-over";

    // ---- the blade outline ----
    function bladePath() {
      ctx.beginPath();
      var p0 = margin(0.001, 1); ctx.moveTo(p0[0], p0[1]);
      for (var t = 0.02; t <= 1.0; t += 0.02) { var p = margin(t, 1); ctx.lineTo(p[0], p[1]); }
      for (var t2 = 1.0; t2 >= 0.0; t2 -= 0.02) { var q = margin(t2, -1); ctx.lineTo(q[0], q[1]); }
      ctx.closePath();
    }

    // =========================================================================
    //  THE BLADE — luminous translucent autumn, the light coming through
    // =========================================================================
    ctx.save(); bladePath(); ctx.clip();
    // base wash: a turning gradient down the leaf (tip more turned/red) + across
    var bg2 = ctx.createLinearGradient(cx - Math.cos(ang) * LL * 0.5, cy - Math.sin(ang) * LL * 0.5, cx + Math.cos(ang) * LL * 0.5, cy + Math.sin(ang) * LL * 0.5);
    bg2.addColorStop(0, lp(0.15 + turn * 0.3, 0.96)); bg2.addColorStop(0.5, lp(0.4 + turn * 0.3, 0.96)); bg2.addColorStop(1, lp(0.7 + turn * 0.3, 0.96));
    ctx.fillStyle = bg2; bladePath(); ctx.fill();
    // the light blazing THROUGH (additive glow inside the blade)
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, cx - Math.cos(ang) * LL * 0.1, cy - Math.sin(ang) * LL * 0.1, 0.46 * S, "#ffe9a0", 0.5, 0.55);
    ctx.globalCompositeOperation = "source-over";
    // autumn mottle — darker decay blotches + bright translucent flecks
    for (var m = 0; m < 320; m++) {
      var mt = rng.range(0.02, 0.98), ms = rng.range(-1, 1);
      var mp = L2W(-0.5 + mt, ms * halfWidth(mt) * 0.92);
      var v = nz.fbm(mt * 8 + 11, ms * 4, 3);
      if (v > 0.62) { ctx.fillStyle = "rgba(120,44,16," + (0.10 + (v - 0.62) * 0.9).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(mp[0], mp[1], rng.range(0.004, 0.02) * S, 0, TAU); ctx.fill(); }
      else if (v < 0.34) { ctx.fillStyle = "rgba(255,230,150,0.12)"; ctx.beginPath(); ctx.arc(mp[0], mp[1], rng.range(0.003, 0.01) * S, 0, TAU); ctx.fill(); }
    }
    ctx.restore();

    // =========================================================================
    //  THE VEINS — the dark branching skeleton the backlight reveals
    // =========================================================================
    function vein(x1, y1, x2, y2, w, a) {
      ctx.strokeStyle = "rgba(78,36,16," + a + ")"; ctx.lineWidth = w; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.save(); bladePath(); ctx.clip();
    // midrib
    ctx.strokeStyle = "rgba(72,32,12,0.92)"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    for (var t = 0; t <= 1; t += 0.03) { var mp2 = L2W(-0.5 + t, 0); if (t === 0) ctx.moveTo(mp2[0], mp2[1]); else ctx.lineTo(mp2[0], mp2[1]); }
    ctx.lineWidth = 0.012 * S; ctx.stroke();
    // secondaries up BOTH sides at each node, each branching into finer tertiaries (the reticulate skeleton)
    for (var k = 0; k < nSec; k++) {
      var bt = 0.08 + (k / nSec) * 0.88;
      for (var sd = 0; sd < 2; sd++) {
        var side = sd === 0 ? 1 : -1;
        var reach = halfWidth(bt) * rng.range(0.86, 1.0);
        ctx.strokeStyle = "rgba(74,32,12,0.82)"; ctx.lineWidth = (0.0072 - bt * 0.0032) * S; ctx.lineCap = "round";
        ctx.beginPath();
        for (var s2 = 0; s2 <= 9; s2++) {
          var u = s2 / 9, ly2 = side * reach * u, lx2 = -0.5 + bt + reach * u * 0.62 + 0.03 * u;
          var pp = L2W(lx2, ly2); if (s2 === 0) ctx.moveTo(pp[0], pp[1]); else ctx.lineTo(pp[0], pp[1]);
        }
        ctx.stroke();
        var nt = 4;
        for (var tt = 0; tt < nt; tt++) {
          var ut = 0.2 + tt * (0.7 / nt);
          var lx0 = -0.5 + bt + reach * ut * 0.62 + 0.03 * ut, ly0 = side * reach * ut;
          var tlen = reach * rng.range(0.28, 0.5);
          var lx1 = lx0 + tlen * 0.6, ly1 = ly0 + side * tlen;
          var c0 = L2W(lx0, ly0), c1 = L2W(lx1, ly1);
          vein(c0[0], c0[1], c1[0], c1[1], 0.0024 * S, 0.4);
          var c2 = L2W(lx1 + tlen * 0.3, ly1 + side * tlen * 0.4);   // a quaternary off the tertiary
          vein(c1[0], c1[1], c2[0], c2[1], 0.0016 * S, 0.3);
        }
      }
    }
    // a fine reticulation haze across the blade (the smallest veinlets between)
    for (var rr = 0; rr < 240; rr++) {
      var rt = rng.range(0.06, 0.96), rs = rng.range(-0.95, 0.95);
      var rlx = -0.5 + rt, rly = rs * halfWidth(rt) * 0.9;
      var rang = rng.range(0, TAU), rlen = rng.range(0.008, 0.026);
      var r0 = L2W(rlx, rly), r1 = L2W(rlx + Math.cos(rang) * rlen, rly + Math.sin(rang) * rlen);
      vein(r0[0], r0[1], r1[0], r1[1], 0.0011 * S, 0.2);
    }
    ctx.restore();

    // =========================================================================
    //  the petiole (stem) + a darker translucent margin
    // =========================================================================
    var base = L2W(-0.5, 0), stemEnd = L2W(-0.62, 0.0);
    ctx.strokeStyle = "#5a3414"; ctx.lineWidth = 0.012 * S; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.lineTo(stemEnd[0], stemEnd[1]); ctx.stroke();
    ctx.strokeStyle = "rgba(120,52,20,0.5)"; ctx.lineWidth = 0.006 * S; bladePath(); ctx.stroke();

    // a final soft vignette
    var vig = ctx.createRadialGradient(cx, cy, 0.45 * S, cx, cy, 0.85 * S);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(12,6,2,0.55)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);
  }
});
