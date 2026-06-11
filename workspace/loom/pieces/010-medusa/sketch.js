// Emil's Loom · piece 010 — "Medusa"
//
// The first living *subject*: a bioluminescent jellyfish drifting in deep water.
// (A "medusa" is the free-swimming, bell-shaped stage of a jelly — the form everyone
// pictures.) The two scenes before this were vistas — a sky, a sea; this one has a
// protagonist. It breathes: the bell pulses closed to push, then opens slowly as the
// long tentacles trail behind, and a ring of bioluminescence flares on each push.
//
// Animated: draw() seeds the whole creature once and returns frame(t); only time
// flows through the frame (lesson 017). Built on the new glow primitive (lib/glow.js).
Loom.piece({
  id: "010",
  title: "Medusa",
  seed: "glide",
  draw: function (stage, rng) {
    var ctx = stage.ctx;
    var S = stage.size;
    var U = S / 700;                 // scale unit, so line widths read the same at any size
    var TAU = 6.2831853;

    // Bioluminescent moods. Each: deep water (top→bottom), the bell's body tint,
    // its glow/halo colour, and the brighter biolum highlight on rim and tips.
    var SCHEMES = [
      { wTop: "#04161e", wBot: "#01070b", body: "#1d6f7e", glow: "#36e6da", lum: "#9bfff2" }, // abyssal cyan (canonical)
      { wTop: "#100422", wBot: "#03010a", body: "#7a2f86", glow: "#ff4fcf", lum: "#ffb0f0" }, // orchid / magenta
      { wTop: "#0a1410", wBot: "#02070a", body: "#2f7e58", glow: "#46e0a0", lum: "#bfffd8" }, // jade phosphor
      { wTop: "#0b0f24", wBot: "#02030c", body: "#3a468f", glow: "#6a7bff", lum: "#bcc8ff" }  // deep violet-blue
    ];
    var sc = SCHEMES[rng.int(0, SCHEMES.length - 1)];

    // The bell. Centred a little above middle so the tentacles have room to fall.
    var bx = S * rng.range(0.42, 0.56);
    var by = S * rng.range(0.34, 0.40);          // rim height (apex sits bh above this)
    var bw = S * rng.range(0.15, 0.19);          // bell half-width (relaxed)
    var bh = S * rng.range(0.16, 0.20);          // bell height (relaxed)
    var pulseRate = rng.range(0.20, 0.30);       // pulses per second
    var pulsePhase = rng.range(0, 1);
    var swayAmp = S * rng.range(0.012, 0.022);   // gentle horizontal drift
    var scN = rng.int(7, 10);                    // little lappets around the margin

    // The bell's silhouette as a profile: dome on top, scalloped open margin below.
    // u runs -1 (left corner) .. +1 (right corner). dome(u)=1 at apex, 0 at corners.
    function dome(u) { return Math.pow(Math.max(0, 1 - u * u), 0.62); }
    function margin(u) { return 0.03 * Math.abs(Math.sin(u * scN * Math.PI)); } // small lappets, in bh units

    // Marginal tentacles — many, long, thin, trailing. Roots spread across the margin.
    var tentacles = [];
    var nT = rng.int(22, 30);
    for (var i = 0; i < nT; i++) {
      var u = (i / (nT - 1)) * 1.7 - 0.85;       // spread across [-0.85, 0.85]
      tentacles.push({
        u: u,
        len: S * rng.range(0.26, 0.52),
        amp: S * rng.range(0.020, 0.055),        // lateral swing, grows toward the tip
        freq: rng.range(2.2, 3.6),               // waves along its length
        speed: rng.range(1.3, 2.1),              // travelling-wave speed
        phase: rng.range(0, TAU),
        w: rng.range(0.8, 1.7) * U,
        tip: rng.bool(0.5)                       // half carry a glowing bead at the tip
      });
    }

    // Oral arms — a few thick, frilly ribbons from the centre of the bell.
    var arms = [];
    var nA = rng.int(4, 5);
    for (var a = 0; a < nA; a++) {
      arms.push({
        u: rng.range(-0.34, 0.34),
        len: S * rng.range(0.16, 0.28),
        amp: S * rng.range(0.018, 0.034),
        freq: rng.range(3.2, 5.0),               // frillier than the tentacles
        speed: rng.range(1.6, 2.4),
        phase: rng.range(0, TAU),
        w: rng.range(3.0, 5.5) * U
      });
    }

    // Bioluminescent beads around the bell margin (these flare on each pulse).
    var beads = [];
    var nB = rng.int(10, 14);
    for (var b = 0; b < nB; b++) {
      var bu = (b / (nB - 1)) * 1.8 - 0.9;
      beads.push({ u: bu, ph: rng.range(0, TAU), r: rng.range(1.4, 2.6) * U });
    }

    // Drifting marine snow for depth and scale. Parallax: bigger = nearer = faster.
    var motes = [];
    var nM = rng.int(46, 64);
    for (var m = 0; m < nM; m++) {
      var sz = rng.range(0.5, 2.4) * U;
      motes.push({
        x: rng.range(0, S),
        y: rng.range(0, S),
        r: sz,
        spd: rng.range(3, 9) * (sz / U) * 0.4,   // bigger drifts faster
        sway: rng.range(6, 16) * U,
        ph: rng.range(0, TAU),
        a: rng.range(0.05, 0.22),
        bright: rng.bool(0.12)                   // a few catch the light
      });
    }

    // The pulse: a quick squeeze, a slow relax. pc in [0,1], 1 = fully contracted.
    function pulseAt(t) {
      var cycle = (t * pulseRate + pulsePhase) % 1;
      if (cycle < 0.34) return Math.sin((cycle / 0.34) * (Math.PI / 2));        // 0→1 fast
      return Math.cos(((cycle - 0.34) / 0.66) * (Math.PI / 2));                 // 1→0 slow
    }

    // Draw one trailing strand (tentacle or oral arm) as a wavy polyline. Returns the
    // tip point so callers can place a glowing bead there.
    function strand(rootX, rootY, s, t, lag) {
      var segs = 18;
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      var px = rootX, py = rootY;
      for (var j = 1; j <= segs; j++) {
        var f = j / segs;                         // 0 root → 1 tip
        py = rootY + f * s.len;
        // lateral travelling wave, amplitude swelling toward the tip; the bell's sway
        // (lag) carries the whole strand, and the squeeze pulls roots a touch inward.
        var swell = f * f * (1.5 - 0.5 * f);
        px = rootX + lag + s.amp * swell * Math.sin(f * s.freq * Math.PI - t * s.speed + s.phase);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
      return { x: px, y: py };
    }

    return function frame(t) {
      var pc = pulseAt(t);

      // --- water -------------------------------------------------------------
      var water = ctx.createLinearGradient(0, 0, 0, S);
      water.addColorStop(0, sc.wTop);
      water.addColorStop(1, sc.wBot);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = water;
      ctx.fillRect(0, 0, S, S);

      // a soft shaft of light filtering down from the surface
      Loom.glow(ctx, S * 0.5, -S * 0.15, S * 0.7, sc.glow, 0.06, 0.5);

      // --- drifting motes (behind) ------------------------------------------
      ctx.globalCompositeOperation = "lighter";
      for (var m = 0; m < motes.length; m++) {
        var mo = motes[m];
        var my = (mo.y + t * mo.spd) % S;
        var mx = mo.x + Math.sin(t * 0.3 + mo.ph) * mo.sway;
        if (mo.bright) {
          Loom.glow(ctx, mx, my, mo.r * 6, sc.lum, 0.22, 0.4);
        } else {
          ctx.fillStyle = Loom.rgba(sc.lum, mo.a);
          ctx.beginPath();
          ctx.arc(mx, my, mo.r, 0, TAU);
          ctx.fill();
        }
      }

      // bell geometry for this frame: squeeze narrows + heightens it, margin tucks up
      var w = bw * (1 - 0.20 * pc);
      var h = bh * (1 + 0.18 * pc);
      var sway = Math.sin(t * pulseRate * TAU + pulsePhase * TAU) * swayAmp;
      var cx = bx + sway;                          // bell centre x this frame
      var bob = -pc * S * 0.025;                   // each squeeze nudges it upward
      var cy = by + bob;
      function marginY(u) { return cy - h * margin(u) + pc * h * 0.10 * (1 - u * u); }

      // --- the bell's glow halo (behind the body) ---------------------------
      Loom.glow(ctx, cx, cy - h * 0.45, w * 2.4, sc.glow, 0.14 + 0.10 * pc, 0.5);

      // --- tentacles (behind the bell) --------------------------------------
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (var i = 0; i < tentacles.length; i++) {
        var te = tentacles[i];
        var rx = cx + w * te.u;
        var ry = marginY(te.u);
        ctx.strokeStyle = Loom.rgba(sc.lum, 0.18);
        ctx.lineWidth = te.w;
        var tip = strand(rx, ry, te, t, sway * 1.6);   // tentacles lag the bell's sway
        if (te.tip) Loom.glow(ctx, tip.x, tip.y, 7 * U, sc.lum, 0.5, 0.4);
      }

      // --- oral arms (thicker, in front of tentacles, under the bell) -------
      for (var a = 0; a < arms.length; a++) {
        var ar = arms[a];
        var arx = cx + w * 0.5 * ar.u;
        var ary = cy + h * 0.04;
        ctx.strokeStyle = Loom.rgba(sc.body, 0.5);
        ctx.lineWidth = ar.w;
        strand(arx, ary, ar, t, sway * 1.2);
        ctx.strokeStyle = Loom.rgba(sc.lum, 0.10);    // a luminous highlight down the arm
        ctx.lineWidth = ar.w * 0.4;
        strand(arx, ary, ar, t, sway * 1.2);
      }

      // --- the bell body (translucent, layered for thickness) ---------------
      ctx.globalCompositeOperation = "source-over";
      function bellPath() {
        ctx.beginPath();
        var first = true;
        for (var k = 0; k <= 40; k++) {            // top dome, left→right
          var u = -1 + (k / 40) * 2;
          var x = cx + w * u, y = cy - h * dome(u);
          if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
        }
        for (var k2 = 40; k2 >= 0; k2--) {         // open margin, right→left
          var u2 = -1 + (k2 / 40) * 2;
          ctx.lineTo(cx + w * u2, marginY(u2));
        }
        ctx.closePath();
      }
      // body fill: a vertical gel gradient, brighter up top where the glow catches it
      var bg = ctx.createLinearGradient(0, cy - h, 0, cy);
      bg.addColorStop(0, Loom.rgba(sc.lum, 0.34));
      bg.addColorStop(0.4, Loom.rgba(sc.body, 0.40));
      bg.addColorStop(1, Loom.rgba(sc.body, 0.12));
      bellPath();
      ctx.fillStyle = bg;
      ctx.fill();
      // light the gel from within + trace its inner thickness — all clipped to the bell
      ctx.save();
      bellPath(); ctx.clip();
      Loom.glow(ctx, cx, cy - h * 0.5, w * 1.5, sc.glow, 0.24 + 0.12 * pc, 0.55);
      ctx.globalCompositeOperation = "lighter";
      for (var d = 1; d <= 2; d++) {
        var iw = w * (1 - d * 0.22), ih = h * (1 - d * 0.16);
        ctx.beginPath();
        for (var q = 0; q <= 30; q++) {
          var uu = -1 + (q / 30) * 2;
          var xx = cx + iw * uu, yy = (cy - h * 0.10) - ih * dome(uu);
          if (q === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.strokeStyle = Loom.rgba(sc.lum, 0.09);
        ctx.lineWidth = 2 * U;
        ctx.stroke();
      }
      ctx.restore();
      // a luminous edge along the bell's dome — light catching through the gel
      ctx.globalCompositeOperation = "lighter";
      ctx.beginPath();
      for (var e = 0; e <= 40; e++) {
        var ue = -1 + (e / 40) * 2;
        var xe = cx + w * ue, ye = cy - h * dome(ue);
        if (e === 0) ctx.moveTo(xe, ye); else ctx.lineTo(xe, ye);
      }
      ctx.strokeStyle = Loom.rgba(sc.lum, 0.22);
      ctx.lineWidth = 1.4 * U;
      ctx.stroke();

      // --- the bioluminescent margin + beads (front, flaring on the squeeze) -
      ctx.globalCompositeOperation = "lighter";
      ctx.beginPath();                              // the glowing rim line
      for (var r = 0; r <= 48; r++) {
        var ur = -1 + (r / 48) * 2;
        var xr = cx + w * ur, yr = marginY(ur);
        if (r === 0) ctx.moveTo(xr, yr); else ctx.lineTo(xr, yr);
      }
      ctx.strokeStyle = Loom.rgba(sc.lum, 0.30 + 0.45 * pc);
      ctx.lineWidth = 1.6 * U;
      ctx.stroke();
      for (var bd = 0; bd < beads.length; bd++) {
        var be = beads[bd];
        var bxp = cx + w * be.u, byp = marginY(be.u);
        var flare = 0.35 + 0.55 * pc + 0.10 * Math.sin(t * 3 + be.ph);
        Loom.glow(ctx, bxp, byp, be.r * 4.5, sc.lum, Math.min(0.85, flare), 0.4);
      }

      // --- a few foreground motes catching the light ------------------------
      for (var fm = 0; fm < motes.length; fm += 7) {
        var f2 = motes[fm];
        var fy = (f2.y + t * f2.spd * 1.6) % S;
        var fx = f2.x + Math.sin(t * 0.4 + f2.ph) * f2.sway * 1.4;
        Loom.glow(ctx, fx, fy, f2.r * 4, sc.lum, 0.14, 0.4);
      }
      ctx.globalCompositeOperation = "source-over";
    };
  }
});
