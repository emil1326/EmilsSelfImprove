// Emil's Loom · piece 030 — "Dew"
//
// Dewdrops strung along a spider's orb-web at first light: each bead a tiny lens holding the morning
// upside-down, the silk a delicate necklace of light against a soft, defocused dawn meadow. The intimate,
// jewelled register — aimed squarely at the FELT "oh!" (atmosphere + delicacy + the quiet wonder of a
// dew-lit web), NOT a technical flex ([[049-technical-pride-mispredicts-aim-for-the-aesthetic-oh]] — the
// ratings just taught me my refraction-heavy Iris/Giant landed at 3 because they were impressive to BUILD
// and ordinary to FEEL; so here the lens serves the mood, not the other way round).
//
// It also REVISITS the droplet-lens idiom from Rain (023) on a totally different subject — a 2nd consumer,
// so the lens can finally be harvested into a primitive next iteration (the library's been frozen 11
// iterations; [[048-novelty-starves-the-library-revisit-to-harvest]]). The adaptation: on a BRIGHT dawn
// ground additive light is inert ([[022-luminosity-on-bright-is-tone]]), so a dewdrop is the inverted+
// minified meadow + a slight refractive darkening + a hard source-over sun-glint — luminosity as tone.
//
// The web has to read as a web first ([[035-defining-feature-is-often-the-hard-part]]): straight radial
// spokes + a scalloped capture spiral that sags between them. Composes the palette helpers + the reused
// droplet-lens idiom (from Rain 023). Static — a held, breath-quiet dawn.
Loom.piece({
  id: "030",
  title: "Dew",
  seed: "first-light",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760, PI = Math.PI;

    // ---- background: a soft, defocused dawn meadow, rendered offscreen so the dewdrops can refract it ----
    var bgC = document.createElement("canvas"); bgC.width = S; bgC.height = S;
    var bx = bgC.getContext("2d");
    var sunx = S * 0.5, suny = S * 0.46;                     // the rising sun, behind the web
    (function dawnMeadow() {
      var g = bx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0.00, "#566a72");        // cool misty sky
      g.addColorStop(0.40, "#7e8268");
      g.addColorStop(0.60, "#c6a468");        // warm sunrise haze
      g.addColorStop(0.82, "#787450");
      g.addColorStop(1.00, "#414a36");        // shadowed grass
      bx.fillStyle = g; bx.fillRect(0, 0, S, S);
      // THE light: a strong warm bloom where the sun rises through the mist behind the web
      var sun = bx.createRadialGradient(sunx, suny, 0, sunx, suny, S * 0.52);
      sun.addColorStop(0, "rgba(255, 240, 202, 0.92)");
      sun.addColorStop(0.4, "rgba(248, 216, 152, 0.42)");
      sun.addColorStop(1, "rgba(248, 216, 152, 0)");
      bx.fillStyle = sun; bx.fillRect(0, 0, S, S);
      // out-of-focus foliage — warm bokeh near the sun, dark shadowed greens at the edges (range!)
      var dark = ["#3a4632", "#46523a", "#2e3a2c", "#525a3e"];
      var warm = ["#e8cc88", "#d8b870", "#f0e0b0"];
      var blobs = Math.round(72 * (S / 760));
      for (var i = 0; i < blobs; i++) {
        var bxp = rng.range(-0.05, 1.05) * S, byp = rng.range(-0.05, 1.05) * S;
        var dsun = Math.hypot(bxp - sunx, byp - suny) / S;    // near the sun → warm/bright, far → dark
        var col = dsun < 0.30 ? rng.pick(warm) : rng.pick(dark);
        var br = (0.05 + rng.range(0, 0.14)) * S;
        var a = dsun < 0.30 ? 0.10 + rng.range(0, 0.16) : 0.16 + rng.range(0, 0.26);
        var rg = bx.createRadialGradient(bxp, byp, 0, bxp, byp, br);
        rg.addColorStop(0, Loom.rgba(col, a));
        rg.addColorStop(1, Loom.rgba(col, 0));
        bx.fillStyle = rg; bx.beginPath(); bx.arc(bxp, byp, br, 0, TAU); bx.fill();
      }
    })();
    ctx.drawImage(bgC, 0, 0, S, S);

    // ---- a dewdrop: the inverted, minified meadow behind it + a refractive rim + a hard sun-glint ----
    function drawDewdrop(c, dx, dy, r) {
      var ry = r * 1.06;
      c.save();
      c.beginPath(); c.ellipse(dx, dy, r, ry, 0, 0, TAU); c.clip();
      var k = -0.5;                                          // wide-angle inverted lens (upside-down world)
      c.save(); c.translate(dx, dy); c.scale(k, k); c.translate(-dx, -dy); c.drawImage(bgC, 0, 0, S, S); c.restore();
      // a drop refracts darker/saturated toward its rim (edge bending) — tone, not additive (022)
      var rim = c.createRadialGradient(dx, dy, r * 0.25, dx, dy, r);
      rim.addColorStop(0, "rgba(40,52,40,0)");
      rim.addColorStop(0.80, "rgba(34,46,38,0.06)");
      rim.addColorStop(1, "rgba(26,38,32,0.34)");
      c.fillStyle = rim; c.fillRect(dx - r, dy - ry, 2 * r, 2 * ry);
      c.restore();                                           // un-clip
      // a bright bottom meniscus (water pools at the base)
      c.globalCompositeOperation = "source-over";
      c.lineWidth = Math.max(0.5, r * 0.16); c.strokeStyle = "rgba(255,255,255,0.45)";
      c.beginPath(); c.ellipse(dx, dy, r * 0.82, ry * 0.82, 0, 0.42, PI - 0.42); c.stroke();
      // the sun-glint, upper-left: a soft white pool + a tiny additive spark core, so the bead SPARKLES
      var hx = dx - r * 0.32, hy = dy - ry * 0.4, hr = r * 0.55;
      var hg = c.createRadialGradient(hx, hy, 0, hx, hy, hr);
      hg.addColorStop(0, "rgba(255,255,255,1)");
      hg.addColorStop(0.45, "rgba(255,255,255,0.4)");
      hg.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = hg; c.beginPath(); c.arc(hx, hy, hr, 0, TAU); c.fill();
      c.globalCompositeOperation = "lighter";
      var sg = c.createRadialGradient(hx, hy, 0, hx, hy, hr * 0.45);
      sg.addColorStop(0, "rgba(255,252,240,0.9)"); sg.addColorStop(1, "rgba(255,252,240,0)");
      c.fillStyle = sg; c.beginPath(); c.arc(hx, hy, hr * 0.45, 0, TAU); c.fill();
      c.globalCompositeOperation = "source-over";
    }

    // ---- the web: radial spokes + a scalloped capture spiral that sags between them ----
    var cx = S * (0.44 + rng.range(-0.03, 0.03)), cy = S * (0.40 + rng.range(-0.03, 0.03));
    var spokeN = 13 + rng.int(0, 4);
    var baseR = S * 0.56;
    var spokes = [];
    for (var i = 0; i < spokeN; i++) {
      var ang = i / spokeN * TAU + rng.range(-0.05, 0.05);
      var rad = baseR * rng.range(0.78, 1.2);
      spokes.push({ ang: ang, rad: rad });
    }

    // silk: faint, pale, luminous lines
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255,255,255,0.42)";
    ctx.lineWidth = Math.max(0.5, 0.7 * U);
    for (var sp = 0; sp < spokeN; sp++) {                    // spokes
      var a = spokes[sp].ang, rd = spokes[sp].rad;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * rd, cy + Math.sin(a) * rd);
      ctx.stroke();
    }
    // scalloped rings (the capture spiral, approximated as concentric sagging rings)
    var rings = 13 + rng.int(0, 4);
    var r0 = baseR * 0.10;
    var ringRs = [];
    for (var jr = 0; jr < rings; jr++) ringRs.push(r0 + (baseR * 0.92 - r0) * Math.pow((jr + 1) / rings, 1.18));
    var ringSegs = [];                                       // collect segments to bead with dew
    for (var j = 0; j < rings; j++) {
      var rr = ringRs[j];
      ctx.beginPath();
      for (var k2 = 0; k2 <= spokeN; k2++) {
        var s0 = spokes[k2 % spokeN], s1 = spokes[(k2 + 1) % spokeN];
        var r_a = Math.min(rr, s0.rad * 0.97), r_b = Math.min(rr, s1.rad * 0.97);
        var ax = cx + Math.cos(s0.ang) * r_a, ay = cy + Math.sin(s0.ang) * r_a;
        var a1 = s1.ang + (k2 + 1 >= spokeN ? TAU : 0);      // unwrap so the last segment closes forward
        var bxp = cx + Math.cos(a1) * r_b, byp = cy + Math.sin(a1) * r_b;
        if (k2 === 0) ctx.moveTo(ax, ay);
        var mx = (ax + bxp) / 2, my = (ay + byp) / 2;          // sag the midpoint inward (catenary)
        var sagx = cx + (mx - cx) * 0.9, sagy = cy + (my - cy) * 0.9;
        ctx.quadraticCurveTo(sagx, sagy, bxp, byp);
        if (k2 < spokeN) ringSegs.push({ ax: ax, ay: ay, bx: bxp, by: byp, sagx: sagx, sagy: sagy });
      }
      ctx.stroke();
    }

    // ---- the dew: beads strung along the spiral (the sticky capture silk catches the droplets) ----
    function qpoint(seg, t) {                                // point on the quadratic sag-curve at t
      var u = 1 - t;
      return { x: u * u * seg.ax + 2 * u * t * seg.sagx + t * t * seg.bx,
               y: u * u * seg.ay + 2 * u * t * seg.sagy + t * t * seg.by };
    }
    for (var d = 0; d < ringSegs.length; d++) {
      var seg = ringSegs[d];
      var count = rng.int(0, 4);                             // some segments bare, some beaded
      for (var b = 0; b < count; b++) {
        var tt = rng.range(0.12, 0.88);
        var p = qpoint(seg, tt);
        var t2 = rng.next();
        var dr = (t2 < 0.74 ? rng.range(1.2, 3.0) : t2 < 0.94 ? rng.range(3.0, 5.5) : rng.range(5.5, 8.5)) * U;
        drawDewdrop(ctx, p.x, p.y, dr);
      }
    }
    // a few fat feature drops hanging at spoke/ring crossings, where water gathers
    for (var fd = 0, nf = 6 + rng.int(0, 5); fd < nf; fd++) {
      var fs = spokes[rng.int(0, spokeN - 1)], fr = ringRs[rng.int(2, rings - 1)];
      fr = Math.min(fr, fs.rad * 0.95);
      drawDewdrop(ctx, cx + Math.cos(fs.ang) * fr, cy + Math.sin(fs.ang) * fr, rng.range(6, 11) * U);
    }

    // ---- dawn light + a cool shadowed vignette (tone, framing the lit jewelled web) ----
    var glowOv = ctx.createRadialGradient(sunx, suny, 0, sunx, suny, S * 0.46);
    glowOv.addColorStop(0, "rgba(255, 240, 206, 0.20)");   // a warm wash binding the web to the sun behind it
    glowOv.addColorStop(1, "rgba(255, 240, 206, 0)");
    ctx.fillStyle = glowOv; ctx.fillRect(0, 0, S, S);
    var vg = ctx.createRadialGradient(sunx, suny, S * 0.30, S * 0.5, S * 0.56, S * 0.86);
    vg.addColorStop(0, "rgba(30,38,30,0)");
    vg.addColorStop(1, "rgba(24,30,26,0.52)");             // cool shadow falls to the corners
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
