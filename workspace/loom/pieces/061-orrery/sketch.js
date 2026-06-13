// Emil's Loom · piece 061 — "Orrery"
//
// A clockwork solar system. Brass arms swing shaded planets around a glowing sun on tilted orbits, gears
// turning at the heart of it — a little universe you could wind up. The hook is the MECHANISM IN MOTION
// ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]): a working machine has a wonder a still
// diagram doesn't. A deliberate reach for the under-used LIVING-MOTION lane (animated — the Murmuration
// register, one of the rated 5s; nothing clearly animated in ~13 iters) and clear of all four current ruts
// ([[073-a-lesson-applied-by-reflex-becomes-a-rut]]): not a lone figure, not a grown sim, not a glowing
// field, not a creature-on-dark-water. The motion is a PURE FUNCTION OF t (each planet θ = θ0 + rate·t),
// so it reproduces ([[017-animation-seed-setup-once]]); the gallery shows a still t=0. Composes glow + palette.
Loom.piece({
  id: "061",
  title: "Orrery",
  seed: "brass",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;
    var cx = 0.5 * S, cy = 0.53 * S, tilt = 0.56;

    var BR = { hi: "#ffe9a8", mid: "#c79a4e", lo: "#5e4420" };           // brass
    var planetDefs = [
      ["#d8cfc4", "#8a8178", "#3a352f"],   // mercury — grey
      ["#f3e6c8", "#cdb38a", "#6b5a3e"],   // venus — cream
      ["#c4e2f2", "#4f86c0", "#1d3a66"],   // earth — blue
      ["#e8a884", "#b3552f", "#5a2414"],   // mars — red
      ["#efd9b0", "#c69a62", "#6e4f2c"],   // jupiter — tan
      ["#f0dca0", "#c9a95f", "#6f5a2e"]    // saturn — gold (ringed)
    ];
    var N = rng.int(5, 6), planets = [];
    for (var i = 0; i < N; i++) {
      var rx = (0.16 + i * 0.052 + rng.range(-0.004, 0.004)) * S;
      planets.push({
        rx: rx, ry: rx * tilt,
        rate: (0.5 / Math.pow(i + 1.4, 1.1)) * rng.range(0.9, 1.1),       // inner planets faster (Keplerian-ish)
        th0: i * 2.3999 + rng.range(-0.5, 0.5),                          // golden-angle spread → balanced still
        size: (i === 4 ? 0.034 : 0.019 + i * 0.0014) * S,                // jupiter biggest
        hi: planetDefs[i][0], mid: planetDefs[i][1], lo: planetDefs[i][2],
        ring: i === 5
      });
    }
    var sunR = 0.044 * S;

    function orb(x, y, r, hi, mid, lo) {
      var g = ctx.createRadialGradient(x - r * 0.34, y - r * 0.34, r * 0.06, x, y, r);
      g.addColorStop(0, hi); g.addColorStop(0.55, mid); g.addColorStop(1, lo);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    function gear(x, y, r, teeth, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = BR.mid;
      for (var i = 0; i < teeth; i++) { ctx.save(); ctx.rotate(i / teeth * TAU); ctx.fillRect(r * 0.9, -r * 0.075, r * 0.2, r * 0.15); ctx.restore(); }
      var g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.08, 0, 0, r);
      g.addColorStop(0, BR.hi); g.addColorStop(0.6, BR.mid); g.addColorStop(1, BR.lo);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
      ctx.fillStyle = BR.lo; ctx.beginPath(); ctx.arc(0, 0, r * 0.26, 0, TAU); ctx.fill();
      ctx.fillStyle = BR.mid; ctx.beginPath(); ctx.arc(0, 0, r * 0.13, 0, TAU); ctx.fill();
      ctx.restore();
    }

    // static background: warm-dark vignette + faint stars + the tilted orbit rings
    var bg = document.createElement("canvas"); bg.width = S; bg.height = S; var b = bg.getContext("2d");
    var bgg = b.createRadialGradient(cx, cy * 0.92, 0, cx, cy, 0.78 * S);
    bgg.addColorStop(0, "#2a2017"); bgg.addColorStop(1, "#0e0a06");
    b.fillStyle = bgg; b.fillRect(0, 0, S, S);
    for (var st = 0; st < 90; st++) { var sx = rng.range(0, 1) * S, sy = rng.range(0, 1) * S; b.fillStyle = "rgba(255,238,200," + (0.05 + rng.range(0, 0.22)).toFixed(3) + ")"; b.beginPath(); b.arc(sx, sy, rng.range(0.3, 1.1), 0, TAU); b.fill(); }
    b.strokeStyle = "rgba(199,154,78,0.26)"; b.lineWidth = Math.max(1, 0.0016 * S);
    for (var i = 0; i < planets.length; i++) { b.beginPath(); b.ellipse(cx, cy, planets[i].rx, planets[i].ry, 0, 0, TAU); b.stroke(); }

    function armPlanet(o) {
      var p = o.p, dim = o.depth < 0 ? 0.66 : 1, sc = 1 + 0.16 * o.depth;
      ctx.strokeStyle = BR.mid; ctx.lineWidth = 0.0045 * S; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(o.x, o.y); ctx.stroke();
      ctx.strokeStyle = "rgba(255,233,168,0.5)"; ctx.lineWidth = 0.0018 * S; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(o.x, o.y); ctx.stroke();
      var pr = p.size * sc;
      if (p.ring) { ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(-0.42); ctx.strokeStyle = "rgba(222,192,124," + (0.55 * dim).toFixed(2) + ")"; ctx.lineWidth = pr * 0.3; ctx.beginPath(); ctx.ellipse(0, 0, pr * 1.75, pr * 0.62, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
      orb(o.x, o.y, pr, p.hi, p.mid, p.lo);
      if (dim < 1) { ctx.fillStyle = "rgba(14,10,6," + ((1 - dim) * 0.42).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(o.x, o.y, pr, 0, TAU); ctx.fill(); }
    }
    function center(t) {
      gear(cx, cy, sunR * 1.32, 18, t * 0.12);                          // hub gear behind the sun
      gear(cx - sunR * 1.5, cy + sunR * 1.32, sunR * 0.72, 11, -t * 0.3 + 1);   // a drive gear, teeth meshing the hub
      Loom.glow(ctx, cx, cy, sunR * 3.6, "#ffcf6a", 0.5, 0.5);
      orb(cx, cy, sunR, "#fff3c4", "#f4c64e", "#b0671e");
    }

    function frame(t) {
      ctx.clearRect(0, 0, S, S); ctx.drawImage(bg, 0, 0);
      var info = planets.map(function (p) { var th = p.th0 + p.rate * t; return { p: p, th: th, x: cx + Math.cos(th) * p.rx, y: cy + Math.sin(th) * p.ry, depth: Math.sin(th) }; });
      info.forEach(function (o) { if (o.depth < 0) armPlanet(o); });   // behind the hub
      center(t);
      info.forEach(function (o) { if (o.depth >= 0) armPlanet(o); });  // in front
    }
    return frame;
  }
});
