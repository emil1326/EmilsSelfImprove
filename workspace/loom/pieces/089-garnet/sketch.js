// Emil's Loom · piece 089 — "Garnet"
//
// A pomegranate cut open — a cross-section of the fruit whose seeds are so jewel-like the gemstone garnet is
// named after them (granatum, "grainy"). A DELIBERATELY BRIGHT, matte piece: the #130 audit caught a glow-on-
// dark medium-lean (four of five pieces), so this is daylight and tone, not glow-on-black — luminosity here is
// the wet sheen on a ruby aril against a pale board (022), not additive light. The hook is the cluster: hundreds
// of glistening packed seeds, my circle-packing strength turned to fruit. A familiar subject, so the EVENT is
// the cut-open reveal — the jewel interior exposed (096). Self-directed end to end (the #130 self-sufficiency
// test). Composes pack-by-rejection + tone-shaded arils + noise-mottled rind.
Loom.piece({
  id: "089",
  title: "Garnet",
  seed: "granatum",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));
    var lightAng = rng.range(-2.4, -0.7);                 // light from upper-ish
    var lx = Math.cos(lightAng), ly = Math.sin(lightAng);

    // ---- one aril: a glistening ruby jewel (tone-shaded on a bright ground, 022) ----
    function aril(x, y, r, rot, ripe) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      var hx = lx * r * 0.34, hy = ly * r * 0.34;
      var g = ctx.createRadialGradient(hx, hy, r * 0.05, 0, 0, r * 1.2);
      g.addColorStop(0, ripe ? "#ff8c90" : "#ffa6aa");    // bright translucent core toward the light
      g.addColorStop(0.28, ripe ? "#e02a44" : "#ef5e68"); // ruby
      g.addColorStop(0.72, ripe ? "#9c1026" : "#bc2e3e"); // deep red
      g.addColorStop(1, ripe ? "#4a0712" : "#6a0f1a");    // deep squeezed edge (more 3D jewel)
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.82, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,236,238,0.9)";            // a crisp wet glint
      ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.16, r * 0.1, lightAng, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.95)";           // the bright spec of the catchlight
      ctx.beginPath(); ctx.arc(hx - lx * r * 0.04, hy - ly * r * 0.04, r * 0.055, 0, TAU); ctx.fill();
      ctx.restore();
    }

    // ---- the bright board (warm pale surface, soft daylight) ----
    var bg = ctx.createLinearGradient(0, 0, S * 0.5, S);
    bg.addColorStop(0, "#ece4d6"); bg.addColorStop(0.6, "#e3d8c6"); bg.addColorStop(1, "#d6c9b4");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);

    // ---- the cut fruit: position, size, the soft shadow ----
    var R = rng.range(0.30, 0.37) * S;
    var margin = R + 0.03 * S;                             // keep the cut fruit on the board, but let it sit off-centre
    var cx = rng.range(margin, S - margin), cy = rng.range(margin + 0.02 * S, S - margin - 0.02 * S);
    var sg = ctx.createRadialGradient(cx + 0.05 * S, cy + 0.09 * S, R * 0.2, cx + 0.06 * S, cy + 0.1 * S, R * 1.25);
    sg.addColorStop(0, "rgba(90,40,40,0.3)"); sg.addColorStop(1, "rgba(90,40,40,0)");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(cx + 0.06 * S, cy + 0.1 * S, R * 1.15, R * 0.95, 0, 0, TAU); ctx.fill();

    // ---- the rind: leathery skin (outer) + cream pith (inner), a noisy organic rim ----
    function rimAt(a, base) { return base + (nz.fbm(Math.cos(a) * 2 + 5, Math.sin(a) * 2, 3) - 0.5) * 0.05 * R; }
    function ringPath(scale) { ctx.beginPath(); for (var a = 0; a <= TAU + 0.01; a += 0.04) { var rr = rimAt(a, R * scale); var px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr; if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); }
    ringPath(1.0);                                          // outer skin
    var skin = ctx.createRadialGradient(cx + lx * R * 0.3, cy + ly * R * 0.3, R * 0.5, cx, cy, R * 1.05);
    skin.addColorStop(0, "#a83a30"); skin.addColorStop(0.7, "#7e241f"); skin.addColorStop(1, "#5a1614");
    ctx.fillStyle = skin; ctx.fill();
    ringPath(0.9);                                          // cream pith
    var pith = ctx.createRadialGradient(cx + lx * R * 0.2, cy + ly * R * 0.2, R * 0.2, cx, cy, R * 0.92);
    pith.addColorStop(0, "#f3ead2"); pith.addColorStop(1, "#e2d2ac");
    ctx.fillStyle = pith; ctx.fill();

    // ---- pack the arils (rejection sampling, size-varied 046, denser at centre) ----
    var innerR = R * 0.87, seeds = [], tries = 3400;
    for (var t = 0; t < tries; t++) {
      var aa = rng.range(0, TAU), rad = Math.sqrt(rng.range(0, 1)) * innerR;
      var px = Math.cos(aa) * rad, py = Math.sin(aa) * rad;
      var sr = rng.range(0.046, 0.084) * R * (1 - 0.13 * (rad / innerR));   // big jewels, slightly smaller at the rim
      var ok = true;
      for (var s = 0; s < seeds.length; s++) { if (Math.hypot(px - seeds[s].x, py - seeds[s].y) < (sr + seeds[s].r) * 0.64) { ok = false; break; } }   // tight pack, arils squish together
      if (ok) seeds.push({ x: px, y: py, r: sr, rot: rng.range(0, TAU), ripe: rng.bool() || rng.bool() });
    }

    // clip to the pith interior so arils stay inside the chambers
    ctx.save(); ringPath(0.86); ctx.clip();
    for (var k = 0; k < seeds.length; k++) { var sd = seeds[k]; aril(cx + sd.x, cy + sd.y, sd.r, sd.rot, sd.ripe); }
    // ---- the white membranes: a few radial pith walls dividing the chambers (over the seeds) ----
    var chambers = rng.int(5, 7);
    ctx.strokeStyle = "rgba(243,234,210,0.85)"; ctx.lineWidth = 2.4 * U; ctx.lineCap = "round";
    for (var m = 0; m < chambers; m++) {
      var ma = (m / chambers) * TAU + rng.range(-0.2, 0.2);
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(ma) * R * 0.06, cy + Math.sin(ma) * R * 0.06);
      ctx.lineTo(cx + Math.cos(ma) * R * 0.86, cy + Math.sin(ma) * R * 0.86); ctx.stroke();
    }
    ctx.restore();

    // ---- a scatter of loose arils on the board (composition + showing them whole) ----
    var loose = rng.int(5, 10);
    for (var L = 0; L < loose; L++) {
      var la = rng.range(0, TAU), ld = rng.range(R * 1.15, R * 1.55);
      aril(cx + Math.cos(la) * ld, cy + Math.sin(la) * ld, rng.range(0.052, 0.084) * R, rng.range(0, TAU), true);
    }
  }
});
