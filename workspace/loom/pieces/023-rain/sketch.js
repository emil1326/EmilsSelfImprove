// Emil's Loom · piece 023 — "Rain"
//
// A rainy window at night, seen from inside: looking out through misted glass at defocused warm
// city lights, droplets clinging to the pane — and (once animated) a few sliding down in rivulets,
// each a tiny lens refracting the lights behind it. The cosy, melancholy register I don't have, and
// the first piece to move again after a long static run (the #40 audit reopened animation).
//
// Built the advisor's way: the STATIC wet-window first (this file's first job) — if the still doesn't
// already feel like "inside, looking out at rain," no motion saves it. The discriminator (my 035/037/
// 040 again): droplets must read as wet refractive LENSES, not flat circles — against bright bokeh a
// bead is a magnified+inverted view of the lights, brightened, with a sharp offset highlight, a dark
// rim and a bright bottom meniscus. The clinging drops are static (rendered once); the sliders will be
// a pure function of t (Embers-style) so motion can be judged from a contact-sheet of time samples,
// not an arbitrary rAF frame ([[025-verify-motion-quality-not-just-presence]]).
//
// Composes glow + noise + the palette helpers. Animated (returns frame(t)); seeded so it reproduces.
Loom.piece({
  id: "023",
  title: "Rain",
  seed: "petrichor",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;

    // ---- the bokeh behind the glass, rendered once to an offscreen so droplets can refract it ----
    var bgC = document.createElement("canvas"); bgC.width = S; bgC.height = S;
    var bx = bgC.getContext("2d");
    (function renderBokeh() {
      var g = bx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0, "#0a131c"); g.addColorStop(0.6, "#0e1c27"); g.addColorStop(1, "#13242f");
      bx.fillStyle = g; bx.fillRect(0, 0, S, S);
      bx.globalCompositeOperation = "lighter";
      var warm = ["#f0c878", "#e8a850", "#f4e6c4", "#d8884a", "#e0b060"];
      var cool = ["#a8c0e0", "#d0d0e0", "#7ea8c8"];
      var n = rng.int(46, 60);
      for (var i = 0; i < n; i++) {
        var lxp = rng.range(-0.05, 1.05) * S, lyp = rng.range(-0.05, 1.05) * S;
        var depth = rng.range(0, 1);                       // 0 far/small/dim, 1 near/big/bright
        var lr = (0.018 + depth * 0.085) * S;
        var col = rng.bool(0.16) ? rng.pick(cool) : rng.pick(warm);
        if (rng.bool(0.06)) col = rng.pick(["#e8504a", "#54bf72"]);  // a rare traffic-light accent
        var a = 0.22 + depth * 0.5;
        var rg = bx.createRadialGradient(lxp, lyp, 0, lxp, lyp, lr);
        rg.addColorStop(0, Loom.rgba(col, a));
        rg.addColorStop(0.45, Loom.rgba(col, a * 0.45));
        rg.addColorStop(1, Loom.rgba(col, 0));
        bx.fillStyle = rg; bx.beginPath(); bx.arc(lxp, lyp, lr, 0, TAU); bx.fill();
        if (depth > 0.62) {                                 // a hotter core for the near lights
          var cr = lr * 0.32, cg = bx.createRadialGradient(lxp, lyp, 0, lxp, lyp, cr);
          cg.addColorStop(0, Loom.rgba(col, Math.min(1, a + 0.35))); cg.addColorStop(1, Loom.rgba(col, 0));
          bx.fillStyle = cg; bx.beginPath(); bx.arc(lxp, lyp, cr, 0, TAU); bx.fill();
        }
      }
      bx.globalCompositeOperation = "source-over";
    })();

    // ---- a droplet: a wet refractive lens (magnified + inverted view of the bokeh, brightened) ----
    function drawDroplet(c, dx, dy, r, squash) {
      squash = squash || 1;                                 // >1 = elongated downward (bigger drops sag)
      var rr = r, ry = r * squash, PI = Math.PI;
      c.save();
      c.beginPath(); c.ellipse(dx, dy, rr, ry, 0, 0, TAU); c.clip();
      // the lens: a WIDE-ANGLE inverted view of the scene behind (the classic droplet-full-of-lights),
      // gathered from a region ~2.4× the drop's size so it catches NEARBY lights, not just dead-dark.
      var k = -0.42;
      c.save(); c.translate(dx, dy); c.scale(k, k); c.translate(-dx, -dy); c.drawImage(bgC, 0, 0, S, S); c.restore();
      // intensify the gathered lights (a drop concentrates them) — a second additive pass + a soft lift,
      // so a drop reads as luminous wet glass, never an opaque bead.
      c.globalCompositeOperation = "lighter";
      c.save(); c.globalAlpha = 0.5; c.translate(dx, dy); c.scale(k, k); c.translate(-dx, -dy); c.drawImage(bgC, 0, 0, S, S); c.restore();
      c.globalAlpha = 1;
      var br = c.createRadialGradient(dx, dy - ry * 0.18, 0, dx, dy, rr * 1.15);
      br.addColorStop(0, "rgba(255,248,232,0.2)"); br.addColorStop(1, "rgba(255,248,232,0)");
      c.fillStyle = br; c.fillRect(dx - rr, dy - ry, 2 * rr, 2 * ry);
      c.restore();                                          // un-clip
      // a soft seat-shadow (it sits ON the glass) — subtle, NOT a hard bead rim
      c.globalCompositeOperation = "source-over";
      c.lineWidth = Math.max(0.5, r * 0.08); c.strokeStyle = "rgba(8,14,20,0.22)";
      c.beginPath(); c.ellipse(dx, dy, rr * 0.97, ry * 0.97, 0, 0, TAU); c.stroke();
      // bright bottom meniscus (water hangs; light bends through the underside) — sells "drop"
      c.lineWidth = Math.max(0.6, r * 0.12); c.strokeStyle = "rgba(255,251,242,0.5)";
      c.beginPath(); c.ellipse(dx, dy, rr * 0.84, ry * 0.84, 0, 0.35, PI - 0.35); c.stroke();
      // a small soft specular highlight, upper-left
      c.globalCompositeOperation = "lighter";
      var hx = dx - rr * 0.3, hy = dy - ry * 0.34, hr = r * 0.26;
      var hg = c.createRadialGradient(hx, hy, 0, hx, hy, hr);
      hg.addColorStop(0, "rgba(255,255,255,0.55)"); hg.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = hg; c.beginPath(); c.arc(hx, hy, hr, 0, TAU); c.fill();
      c.globalCompositeOperation = "source-over";
    }

    // ---- the static clinging droplets (scattered, varied; rendered once) ----
    var cling = [];
    var nd = Math.round(140 * (S / 760));
    for (var i = 0; i < nd; i++) {
      var t = rng.next();
      var r = (t < 0.7 ? rng.range(1.6, 4.5) : t < 0.93 ? rng.range(4.5, 9) : rng.range(9, 16)) * U;
      cling.push({ x: rng.range(0.02, 0.98) * S, y: rng.range(0.02, 0.98) * S, r: r, sq: 1 + (r / (16 * U)) * 0.18 });
    }

    // The whole static wet-window (bokeh + mist + clinging drops + vignette) is rendered ONCE into an
    // offscreen, so each animated frame is just: draw that layer + the few sliding drops on top.
    function paintStaticInto(c) {
      c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
      c.drawImage(bgC, 0, 0, S, S);
      c.fillStyle = "rgba(150,168,182,0.16)"; c.fillRect(0, 0, S, S);     // mist veil
      var mistN = Loom.noise(rng.int(0, 1e9));
      for (var y = 0; y < S; y += 6 * U) {
        for (var x = 0; x < S; x += 6 * U) {
          var m = mistN.fbm(x / S * 3.5, y / S * 3.5, 3);
          c.globalAlpha = Math.max(0, (m - 0.5)) * 0.22; c.fillStyle = "#c4d2da";
          c.fillRect(x, y, 6 * U + 0.5, 6 * U + 0.5);
        }
      }
      c.globalAlpha = 1;
      for (var i = 0; i < cling.length; i++) drawDroplet(c, cling[i].x, cling[i].y, cling[i].r, cling[i].sq);
      var vg = c.createRadialGradient(S / 2, S * 0.45, S * 0.3, S / 2, S / 2, S * 0.8);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(4,9,14,0.55)");
      c.fillStyle = vg; c.fillRect(0, 0, S, S);
    }
    var staticC = document.createElement("canvas"); staticC.width = S; staticC.height = S;
    paintStaticInto(staticC.getContext("2d"));

    // ---- the sliding drops: pure functions of t, so any frame is reproducible & a t-strip is judgeable ----
    var wobN = Loom.noise(rng.int(0, 1e9));
    var sliders = [];
    for (var si = 0, nsl = rng.int(5, 7); si < nsl; si++) {
      sliders.push({ x: rng.range(0.06, 0.94), wob: rng.range(0, 40), period: rng.range(6, 12),
        phase: rng.next(), y0: rng.range(-0.06, 0.5), r0: rng.range(6, 10) * U, r1: rng.range(14, 26) * U,
        amp: rng.range(0.014, 0.05) * S });
    }
    var botY = 1.08 * S;
    function pathX(s, lt) { return s.x * S + (wobN.fbm(s.wob, lt * 5, 3) - 0.5) * 2 * s.amp; }
    function pathY(s, lt) { var y0 = s.y0 * S; return y0 + lt * lt * (botY - y0); }   // accelerates from its spawn

    // a thin, slightly meandering cleared rivulet from the drop's spawn down to its head — reveals the
    // sharp (un-misted) bokeh, then re-fogs toward the old (upper) end so it fades before the cycle wraps.
    function drawTrail(s, lt, hr) {
      var steps = 14, w = Math.max(1.2, hr * 0.34);
      ctx.save(); ctx.beginPath();
      for (var i = 0; i <= steps; i++) { var lq = lt * i / steps; ctx.lineTo(pathX(s, lq) - w, pathY(s, lq)); }
      for (var i = steps; i >= 0; i--) { var lq = lt * i / steps; ctx.lineTo(pathX(s, lq) + w, pathY(s, lq)); }
      ctx.closePath(); ctx.clip();
      ctx.drawImage(bgC, 0, 0, S, S);
      var rf = ctx.createLinearGradient(0, pathY(s, 0), 0, pathY(s, lt));
      rf.addColorStop(0, "rgba(150,168,182,0.55)"); rf.addColorStop(0.7, "rgba(150,168,182,0.12)"); rf.addColorStop(1, "rgba(150,168,182,0.05)");
      ctx.fillStyle = rf; ctx.fillRect(0, 0, S, S);
      ctx.restore();
    }

    function frame(t) {
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.drawImage(staticC, 0, 0, S, S);
      for (var i = 0; i < sliders.length; i++) {
        var s = sliders[i], lt = ((t / s.period) + s.phase) % 1;
        var x = pathX(s, lt), y = pathY(s, lt), r = s.r0 + (s.r1 - s.r0) * lt;
        drawTrail(s, lt, r);
        drawDroplet(ctx, x, y, r, 1.45);                                 // the head: a fat elongated lens
      }
    }
    return frame;   // ANIMATED — draw() did the seeded setup; frame(t) paints each moment.
  }
});
