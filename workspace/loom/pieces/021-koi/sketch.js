// Emil's Loom · piece 021 — "Koi"
//
// A koi pond seen from straight above: sunlit clear water, a few nishikigoi gliding at different
// depths, dappled caustic light on the sandy bed, lily pads and a lotus on the surface. The bright,
// serene swing after four dark/moody pieces — daytime, top-down, no horizon, no human; the koi are
// the living soul.
//
// The crux (my own, after the rose window taught me to find it): make it read as luminous water with
// real DEPTH, not a flat blue pattern. Depth is built by LAYERING, not by one trick — the caustic web
// on the bed (deep, dim, soft), a translucent water column over it, koi sandwiched at depths (deeper =
// dimmer, cooler, softer, with a shadow cast on the bed below them), then the surface on top (sharp
// ripple-light, sun glints, and pads/petals that clearly float ON the water). And because the water is
// BRIGHT, luminosity here is tone — light value against a mid surround — not additive glow, which goes
// inert on a pale ground ([[022-luminosity-on-bright-is-tone]]). The koi reading as koi (elongated body +
// flowing bilobed tail + pectoral fins + kohaku blotches) is the legibility part I can't skip
// ([[035-defining-feature-is-often-the-hard-part]]).
//
// Static — a caught sunlit instant, fully verifiable from a still. Composes the library: noise (caustics,
// bed, ripples), ramp/palette (water depth + koi colour). All randomness is in setup → reproduces from
// the seed. The caustic web is a harvest candidate (god-rays fakes caustics too → a 2nd consumer).
Loom.piece({
  id: "021",
  title: "Koi",
  seed: "still",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853, PI = Math.PI;

    // ---- palette: a sunlit pond ----
    var bedBase = "#6f6a3c";          // sandy-green pond bed (already dimmed by water)
    var bedDeep = "#33442f";          // where the water is deeper / shadowed
    var waterTint = "#1f6f5a";        // the green of clear pond water
    var causticCol = "#eef6cf";       // focused sunlight on the bed
    var sky = "#cfeaf0";              // pale sky caught in the surface glints

    var bedN = Loom.noise(rng.int(0, 1e9));     // bed mottle
    var depthN = Loom.noise(rng.int(0, 1e9));   // where the pond is deeper
    var cauA = Loom.noise(rng.int(0, 1e9));     // caustic web, layer A
    var cauB = Loom.noise(rng.int(0, 1e9));     // caustic web, layer B (domain warp)
    var ripN = Loom.noise(rng.int(0, 1e9));     // surface ripple field

    // depth at a point in [0,1] (0 shallow, 1 deep) — a slow noise so caustics fade in the deeps
    function depthAt(x, y) {
      return depthN.fbm(x / S * 2.2 + 3, y / S * 2.2 + 7, 3);
    }
    // the caustic web — ridged, domain-warped noise into a net of bright veins (primitive #13).
    // Takes NORMALISED coords; call it caustic(x/S, y/S).
    var caustic = Loom.caustics(cauA, { scale: 5.5, octaves: 3, ridged: true, sharpen: 2, warp: 1.6, warpNoise: cauB, warpScale: 3 });

    // ---------- the koi ----------
    var SCHEMES = [
      { body: "#f3ebdd", marks: ["#df531a", "#c62d12"] },  // kohaku (white + red)
      { body: "#e8641e", marks: ["#f3ebdd", "#b23f0d"] },  // orange
      { body: "#f3ebdd", marks: ["#e8641e"] },             // white + a single orange cap
      { body: "#3a414c", marks: ["#e8641e", "#d8881e"] },  // utsuri (steel-charcoal + orange)
      { body: "#eaa62c", marks: ["#f3ebdd"] }              // yamabuki gold
    ];
    function makeKoi(x, y, len, ang, depth, scheme, curve) {
      var marks = [], nm = rng.int(2, 4);
      for (var i = 0; i < nm; i++) {
        marks.push({
          x: rng.range(-0.36, 0.34), y: rng.range(-0.7, 0.7),
          rx: rng.range(0.08, 0.2), ry: rng.range(0.45, 0.95),
          rot: rng.range(0, PI), c: rng.pick(scheme.marks)
        });
      }
      return { x: x, y: y, len: len, ang: ang, depth: depth, body: scheme.body, marks: marks, curve: curve };
    }

    // body outline in local space: nose at +0.5L, tail base at -0.42L, half-width W. A `curve`
    // bows the spine so the fish reads as mid-swim, not a rigid ellipse.
    function koiBodyPath(L, W, curve) {
      var p = new Path2D(), c = curve * W * 1.6;
      p.moveTo(0.5 * L, 0);
      p.bezierCurveTo(0.46 * L, -W, 0.18 * L, -W + c, -0.02 * L, -0.92 * W + c);
      p.bezierCurveTo(-0.26 * L, -0.78 * W + c, -0.42 * L, -0.26 * W + c * 0.5, -0.42 * L, 0 + c * 0.4);
      p.bezierCurveTo(-0.42 * L, 0.26 * W + c * 0.5, -0.26 * L, 0.78 * W + c, -0.02 * L, 0.92 * W + c);
      p.bezierCurveTo(0.18 * L, W + c, 0.46 * L, W, 0.5 * L, 0);
      p.closePath();
      return p;
    }

    function drawKoi(k) {
      var L = k.len, W = L * 0.22, dv = k.depth;
      ctx.save();
      ctx.translate(k.x, k.y);
      ctx.rotate(k.ang);
      var fade = 1 - dv * 0.55;                  // deeper fish are dimmer
      // flowing bilobed tail fin — the key "this is a fish" signal, so make it read
      ctx.fillStyle = "rgba(247,243,235," + (0.36 * fade).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(-0.42 * L, 0);
      ctx.quadraticCurveTo(-0.6 * L, -0.7 * W, -0.92 * L, -1.05 * W);   // out to the upper lobe tip
      ctx.quadraticCurveTo(-0.74 * L, -0.34 * W, -0.72 * L, 0);        // in to the notch
      ctx.quadraticCurveTo(-0.74 * L, 0.34 * W, -0.92 * L, 1.05 * W);  // out to the lower lobe tip
      ctx.quadraticCurveTo(-0.6 * L, 0.7 * W, -0.42 * L, 0);
      ctx.closePath(); ctx.fill();
      // pectoral fins — flaring, translucent, near the head
      ctx.fillStyle = "rgba(247,243,235," + (0.26 * fade).toFixed(3) + ")";
      for (var s = -1; s <= 1; s += 2) {
        ctx.beginPath();
        ctx.moveTo(0.16 * L, s * 0.5 * W);
        ctx.quadraticCurveTo(0.38 * L, s * 1.8 * W, 0.06 * L, s * 1.7 * W);
        ctx.quadraticCurveTo(-0.02 * L, s * 0.9 * W, 0.16 * L, s * 0.5 * W);
        ctx.fill();
      }
      // body
      var body = koiBodyPath(L, W, k.curve);
      ctx.fillStyle = k.body; ctx.fill(body);
      ctx.save();
      ctx.clip(body);
      // kohaku blotches
      for (var m = 0; m < k.marks.length; m++) {
        var mk = k.marks[m];
        ctx.save();
        ctx.translate(mk.x * L, mk.y * W); ctx.rotate(mk.rot);
        ctx.fillStyle = mk.c;
        ctx.beginPath(); ctx.ellipse(0, 0, mk.rx * L, mk.ry * W, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
      // back sheen (top lighter, belly darker) — wet roundness from tone, not glow
      var sh = ctx.createLinearGradient(0, -W, 0, W);
      sh.addColorStop(0, "rgba(255,255,255,0.0)");
      sh.addColorStop(0.42, "rgba(255,255,255,0.28)");
      sh.addColorStop(0.6, "rgba(255,255,255,0.05)");
      sh.addColorStop(1, "rgba(0,0,0,0.16)");
      ctx.fillStyle = sh; ctx.fillRect(-0.5 * L, -W, L, 2 * W);
      ctx.restore();
      // depth: cool the whole fish the deeper it swims
      if (dv > 0.02) { ctx.globalAlpha = dv * 0.5; ctx.fillStyle = waterTint; ctx.fill(body); ctx.globalAlpha = 1; }
      ctx.restore();
    }

    // soft shadow a koi casts on the bed below (a depth cue) — drawn in pond space, under the water tint
    function koiShadow(k) {
      var L = k.len, off = (0.04 + k.depth * 0.1) * L;
      ctx.save();
      ctx.translate(k.x + off * 0.5, k.y + off);
      ctx.rotate(k.ang);
      ctx.fillStyle = "rgba(10,26,24," + (0.22 * (1 - k.depth * 0.4)).toFixed(3) + ")";
      ctx.fill(koiBodyPath(L * 1.04, L * 0.27 * 1.06, k.curve));
      ctx.restore();
    }

    // ---------- surface furniture ----------
    function lilyPad(x, y, r, hue) {
      ctx.save(); ctx.translate(x, y);
      // drop shadow on the water
      ctx.fillStyle = "rgba(8,30,28,0.22)";
      ctx.beginPath(); ctx.arc(0.05 * r, 0.08 * r, r, 0, TAU); ctx.fill();
      // the pad — a disc with the characteristic wedge slit
      var slit = rng.range(0, TAU);
      ctx.fillStyle = hue;
      ctx.beginPath();
      ctx.arc(0, 0, r, slit + 0.42, slit - 0.42);
      ctx.lineTo(0, 0);
      ctx.closePath(); ctx.fill();
      // radial veins + a lighter rim
      ctx.strokeStyle = "rgba(20,52,24,0.5)"; ctx.lineWidth = 1.2 * U;
      for (var v = 0; v < 9; v++) {
        var a = slit + 0.5 + v / 9 * (TAU - 1);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92); ctx.stroke();
      }
      var rim = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r);
      rim.addColorStop(0, "rgba(255,255,255,0)"); rim.addColorStop(1, "rgba(180,220,150,0.25)");
      ctx.fillStyle = rim;
      ctx.beginPath(); ctx.arc(0, 0, r, slit + 0.42, slit - 0.42); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function lotus(x, y, r) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "rgba(8,30,28,0.2)";
      ctx.beginPath(); ctx.arc(0.04 * r, 0.06 * r, r * 1.05, 0, TAU); ctx.fill();
      // two rings of petals, pale pink tipped deeper
      for (var ring = 0; ring < 2; ring++) {
        var pr = ring === 0 ? r : r * 0.6, n = ring === 0 ? 8 : 6, off = ring * 0.4;
        for (var i = 0; i < n; i++) {
          var a = off + i / n * TAU;
          ctx.save(); ctx.rotate(a);
          var g = ctx.createLinearGradient(0, 0, 0, -pr);
          g.addColorStop(0, "#f6e6ec"); g.addColorStop(1, "#e495b4");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-0.28 * pr, -0.6 * pr, 0, -pr);
          ctx.quadraticCurveTo(0.28 * pr, -0.6 * pr, 0, 0);
          ctx.fill();
          ctx.restore();
        }
      }
      // golden centre
      ctx.fillStyle = "#e7c34e";
      ctx.beginPath(); ctx.arc(0, 0, r * 0.22, 0, TAU); ctx.fill();
      ctx.restore();
    }

    // ---------- build the cast ----------
    var koi = [];
    // a lead koi — large, vivid kohaku, near the surface, off-centre
    koi.push(makeKoi(S * 0.44, S * 0.5, S * 0.28, rng.range(-0.7, -0.4), 0.05, SCHEMES[0], rng.range(-0.5, 0.5)));
    for (var i = 0; i < 6; i++) {
      koi.push(makeKoi(
        rng.range(0.2, 0.8) * S, rng.range(0.18, 0.82) * S,
        rng.range(0.15, 0.23) * S, rng.range(0, TAU),
        rng.range(0.15, 0.72), rng.pick(SCHEMES), rng.range(-0.6, 0.6)
      ));
    }
    koi.sort(function (a, b) { return b.depth - a.depth; });  // deep first, shallow last (painter's order)

    var pads = [];
    for (var i = 0; i < 4; i++) {
      var pa = rng.range(0, TAU), prad = rng.range(0.3, 0.46) * S;
      pads.push({ x: 0.5 * S + Math.cos(pa) * prad, y: 0.5 * S + Math.sin(pa) * prad, r: rng.range(0.06, 0.1) * S, hue: rng.pick(["#3f7236", "#4d8a3c", "#356b39", "#5c9440"]) });
    }

    // ---------- paint ----------
    function paint() {
      // ---- the water (bed + caustics + depth veil + surface ripple) is rendered into a half-res
      //      offscreen and smoothly upscaled, so the per-cell field work can't leave a grid ([[026]]). ----
      var OS = Math.round(S * 0.42), k = S / OS;
      function rgb(h) { var c = Loom.hexToRgb(h); return [c.r, c.g, c.b]; }
      function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
      var BED = rgb(bedBase), DEEP = rgb(bedDeep), WAT = rgb(waterTint), CAU = rgb(causticCol), SKY = rgb(sky), TRO = [12, 58, 48];
      // the water (bed → caustics → green veil → ripple) is a per-pixel field (lib/field.js #16), then upscaled
      var oc = Loom.field(OS, function (ox, oy, out) {
        var px = ox * k, py = oy * k;
        var d = depthAt(px, py);
        var col = lerp3(BED, DEEP, Math.min(1, d * 0.85 + bedN.fbm(px / S * 7, py / S * 7, 3) * 0.25));
        var c = caustic(px / S, py / S);
        if (c > 0.42) col = lerp3(col, CAU, Math.min(0.85, (c - 0.42) * 2.0 * (1 - d * 0.7)));
        col = lerp3(col, WAT, 0.34);                                   // green water veil
        var rv = ripN.fbm(px / S * 9, py / S * 9, 3);
        if (rv > 0.62) col = lerp3(col, SKY, Math.min(0.3, (rv - 0.62) * 0.5));
        else if (rv < 0.3) col = lerp3(col, TRO, Math.min(0.18, (0.3 - rv) * 0.4));
        out[0] = col[0]; out[1] = col[1]; out[2] = col[2];
      });
      var o = oc.getContext("2d");                                     // keep painting onto the buffer before the upscale
      // soft deep patches + a sense of sun from the upper-left, as cheap smooth gradients on top
      for (var i = 0; i < 7; i++) {
        var bx = rng.range(0.1, 0.9), by = rng.range(0.1, 0.9), dd = depthAt(bx * S, by * S), br = rng.range(0.18, 0.34) * OS;
        var dg = o.createRadialGradient(bx * OS, by * OS, 0, bx * OS, by * OS, br);
        dg.addColorStop(0, "rgba(18,66,64," + (0.16 + dd * 0.22).toFixed(3) + ")");
        dg.addColorStop(1, "rgba(18,66,64,0)");
        o.fillStyle = dg; o.beginPath(); o.arc(bx * OS, by * OS, br, 0, TAU); o.fill();
      }
      var slant = o.createLinearGradient(0, 0, OS, OS);   // sun on bright water = tone, not glow ([[022]])
      slant.addColorStop(0, "rgba(250,250,224,0.17)"); slant.addColorStop(0.5, "rgba(250,250,224,0)");
      o.fillStyle = slant; o.fillRect(0, 0, OS, OS);

      // smoothly upscale the water onto the main canvas
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(oc, 0, 0, S, S);

      // koi shadows on the bed, then the koi themselves (deep → shallow), at full resolution
      for (var i = 0; i < koi.length; i++) koiShadow(koi[i]);
      for (var i = 0; i < koi.length; i++) drawKoi(koi[i]);

      // surface sun-sparkle — bright specular glints where ripple crests catch the sun, denser on
      // the sunward (upper-left) side; jittered points, not a grid ([[026]])
      for (var g = 0; g < 280; g++) {
        var gx = rng.range(0, 1), gy = rng.range(0, 1);
        var rv = ripN.fbm(gx * 9, gy * 9, 3);
        if (rv < 0.66) continue;
        var sunny = 1 - (gx + gy) * 0.45;
        if (sunny < 0.25) continue;
        ctx.globalAlpha = Math.min(0.85, (rv - 0.66) * 2.6 * sunny);
        ctx.fillStyle = "#fdfbe9";
        var gr = rng.range(0.6, 1.9) * U;
        ctx.beginPath(); ctx.arc(gx * S, gy * S, gr, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // concentric ripple rings — something just touched the surface
      for (var rr = 0; rr < 2; rr++) {
        var rx = rng.range(0.3, 0.7) * S, ry = rng.range(0.3, 0.7) * S, n = rng.int(3, 5);
        for (var ring = 1; ring <= n; ring++) {
          var rad = ring * rng.range(0.03, 0.05) * S;
          ctx.strokeStyle = "rgba(238,246,207," + (0.18 * (1 - ring / n)).toFixed(3) + ")"; ctx.lineWidth = 1.6 * U;
          ctx.beginPath(); ctx.arc(rx, ry, rad, 0, TAU); ctx.stroke();
          ctx.strokeStyle = "rgba(10,40,52," + (0.12 * (1 - ring / n)).toFixed(3) + ")";
          ctx.beginPath(); ctx.arc(rx, ry, rad + 1.6 * U, 0, TAU); ctx.stroke();
        }
      }
      // floating furniture on the surface — pads, a lotus, a few drifting petals
      for (var i = 0; i < pads.length; i++) lilyPad(pads[i].x, pads[i].y, pads[i].r, pads[i].hue);
      lotus(rng.range(0.55, 0.78) * S, rng.range(0.6, 0.82) * S, S * 0.06);
      for (var i = 0; i < 7; i++) {
        var fx = rng.range(0, 1) * S, fy = rng.range(0, 1) * S, fr = rng.range(2.5, 5) * U;
        ctx.fillStyle = rng.pick(["rgba(246,224,232,0.85)", "rgba(232,149,180,0.8)", "rgba(255,240,210,0.8)"]);
        ctx.save(); ctx.translate(fx, fy); ctx.rotate(rng.range(0, TAU));
        ctx.beginPath(); ctx.ellipse(0, 0, fr, fr * 0.5, 0, 0, TAU); ctx.fill(); ctx.restore();
      }
      // a gentle vignette to settle the eye toward the centre
      var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.32, S / 2, S / 2, S * 0.72);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(8,28,30,0.34)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
    }

    paint();   // STATIC — paint once, return nothing.
  }
});
