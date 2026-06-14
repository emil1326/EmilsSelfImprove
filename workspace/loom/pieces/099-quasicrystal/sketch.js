// Emil's Loom · piece 099 — "Quasicrystal"
//
// A Penrose rhombus tiling: two tile shapes (a fat rhomb and a thin one) laid edge to edge so the pattern
// has a clean five-fold symmetry and yet NEVER repeats, anywhere, ever — an order long thought impossible
// for a crystal, then found for real (quasicrystals, Nobel 2011), and, it turns out, raked into the girih
// tilework of medieval Persian shrines five centuries before Penrose. The hook is the REVEAL (090 — an
// abstract sings by showing the emergent STRUCTURE it hides, not the bare pattern): the tiling is
// SELF-SIMILAR — small tiles group into larger tiles of the very same two shapes, which group again, forever.
// So over the fine field I lay the bold skeleton of the same tiling one scale up (its own "inflation"): you
// see the pattern containing itself. Framed off-centre so the ten-fold hub usually sits out of frame and it
// reads as an endless aperiodic field, not a medallion. Emergent-structure lane (Karesansui/Ebru/Strange);
// bright/matte, NON-radial (varies off the radial-burst device + the glow-on-dark medium, #140 Q7).
// Self-directed; no advisor (no fork, 099). Built by Robinson-triangle deflation (the classic algorithm).
Loom.piece({
  id: "099",
  title: "Quasicrystal",
  seed: "girih",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size;
    var PHI = (1 + Math.sqrt(5)) / 2, INV = 1 / PHI, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- palette moods (Persian tilework: a warm ground, two jewel tile-tones, an ink skeleton) ----
    var MOODS = [
      { name: "lapis",       ground: "#efe6cf", fat: "#c8902e", thin: "#2c6298", skel: "#241606", grain: "#1a1408" },
      { name: "jade",        ground: "#f0ead4", fat: "#c4562f", thin: "#2f8f74", skel: "#241a10", grain: "#15110a" },
      { name: "pomegranate", ground: "#f1e7d3", fat: "#b23a46", thin: "#d09a32", skel: "#2a1410", grain: "#1c0e0a" },
      { name: "twilight",    ground: "#1a1d28", fat: "#d8a23e", thin: "#4f7fb8", skel: "#0b0d14", grain: "#e8d59a" }
    ];
    var mood = MOODS[rng.int(0, MOODS.length - 1)];
    var dark = mood.name === "twilight";                 // one inverted (dark-ground) mood for variety
    var fatRamp = Loom.ramp([Loom.mix(mood.fat, "#000000", 0.18), mood.fat, Loom.mix(mood.fat, "#ffffff", 0.22)]);
    var thinRamp = Loom.ramp([Loom.mix(mood.thin, "#000000", 0.18), mood.thin, Loom.mix(mood.thin, "#ffffff", 0.22)]);

    // ---- seed params: orientation, which patch we frame, zoom ----
    var rot = rng.range(0, TAU);
    var flip = rng.bool() ? 1 : -1;
    var camAng = rng.range(0, TAU), camR = rng.range(0.12, 0.42);    // offset of the framed patch from the hub
    var camScale = rng.range(1.14, 1.46) * S;                        // zoom (decagon overflows the canvas)

    // =========================================================================
    //  BUILD — a Penrose P3 tiling by deflating Robinson triangles (Preshing).
    //  Each rhomb is two mirror half-triangles; deflation splits every triangle
    //  into smaller ones by the golden ratio. Every level is a valid tiling at a
    //  larger scale — that's the self-similarity we'll reveal.
    // =========================================================================
    function lerp(p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; }
    var tris = [];
    for (var i = 0; i < 10; i++) {                       // the central "sun": 10 triangles round the hub
      var b = [Math.cos((2 * i - 1) * Math.PI / 10), Math.sin((2 * i - 1) * Math.PI / 10)];
      var c = [Math.cos((2 * i + 1) * Math.PI / 10), Math.sin((2 * i + 1) * Math.PI / 10)];
      if (i % 2 === 0) { var tmp = b; b = c; c = tmp; }
      tris.push({ col: 0, a: [0, 0], b: b, c: c });
    }
    function deflate(list) {
      var out = [];
      for (var k = 0; k < list.length; k++) {
        var T = list[k], A = T.a, B = T.b, C = T.c;
        if (T.col === 0) {                               // thin half (golden gnomon)
          var P = lerp(A, B, INV);
          out.push({ col: 0, a: C, b: P, c: B, anc: T.anc });
          out.push({ col: 1, a: P, b: C, c: A, anc: T.anc });
        } else {                                         // fat half (golden triangle)
          var Q = lerp(B, A, INV), R = lerp(B, C, INV);
          out.push({ col: 1, a: R, b: C, c: A, anc: T.anc });
          out.push({ col: 1, a: Q, b: R, c: B, anc: T.anc });
          out.push({ col: 0, a: R, b: Q, c: A, anc: T.anc });
        }
      }
      return out;
    }
    var SUPER = 3, DEPTH = 8;                            // SUPER = the coarse skeleton level; DEPTH = fine tiles
    for (var d = 0; d < SUPER; d++) tris = deflate(tris);
    for (var t0 = 0; t0 < tris.length; t0++) tris[t0].anc = t0;   // tag each super-tile so fine tiles inherit it
    var superTris = tris.slice();
    for (var d2 = 0; d2 < DEPTH - SUPER; d2++) tris = deflate(tris);

    // ---- camera: rotate the lattice, frame an off-hub patch ----
    var cosR = Math.cos(rot), sinR = Math.sin(rot);
    var ox = camR * Math.cos(camAng), oy = camR * Math.sin(camAng);
    function toScreen(p) {
      var x = p[0] * flip, y = p[1];
      var rx = x * cosR - y * sinR, ry = x * sinR + y * cosR;
      return [S * 0.5 + (rx - ox) * camScale, S * 0.5 + (ry - oy) * camScale];
    }
    function len2(p, q) { var dx = p[0] - q[0], dy = p[1] - q[1]; return dx * dx + dy * dy; }
    // the DIAGONAL of a half-rhomb is the odd-length edge; the two near-equal edges are the rhomb SIDES.
    function sideEdges(sa, sb, sc) {
      var l0 = len2(sa, sb), l1 = len2(sb, sc), l2 = len2(sc, sa);
      var d01 = Math.abs(l0 - l1), d12 = Math.abs(l1 - l2), d20 = Math.abs(l2 - l0);
      if (d01 <= d12 && d01 <= d20) return [[sa, sb], [sb, sc]];   // edge ca is the diagonal
      if (d12 <= d01 && d12 <= d20) return [[sb, sc], [sc, sa]];   // edge ab is the diagonal
      return [[sc, sa], [sa, sb]];                                 // edge bc is the diagonal
    }
    function onScreen(sa, sb, sc) {
      var m = 3;
      if (sa[0] < -m && sb[0] < -m && sc[0] < -m) return false;
      if (sa[0] > S + m && sb[0] > S + m && sc[0] > S + m) return false;
      if (sa[1] < -m && sb[1] < -m && sc[1] < -m) return false;
      if (sa[1] > S + m && sb[1] > S + m && sc[1] > S + m) return false;
      return true;
    }

    // =========================================================================
    //  RENDER
    // =========================================================================
    ctx.fillStyle = mood.ground;
    ctx.fillRect(0, 0, S, S);

    var rgb = [0, 0, 0];
    function tone(ramp, anc) {                           // gentle per-super-tile lightness so the field breathes
      var h = ((anc * 2654435761) % 1000) / 1000;        // deterministic hash of the super-tile id
      ramp.rgb(0.5 + (h - 0.5) * 0.34, rgb);
      return "rgb(" + (rgb[0] | 0) + "," + (rgb[1] | 0) + "," + (rgb[2] | 0) + ")";
    }

    // pass 1 — fill every fine rhomb-half by tile type, tinted by its super-tile
    var sideStroke = dark ? "rgba(10,12,20,0.55)" : "rgba(30,22,10,0.32)";
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    for (var k = 0; k < tris.length; k++) {
      var T = tris[k];
      var sa = toScreen(T.a), sb = toScreen(T.b), sc = toScreen(T.c);
      if (!onScreen(sa, sb, sc)) continue;
      ctx.fillStyle = tone(T.col === 1 ? fatRamp : thinRamp, T.anc);
      ctx.beginPath(); ctx.moveTo(sa[0], sa[1]); ctx.lineTo(sb[0], sb[1]); ctx.lineTo(sc[0], sc[1]); ctx.closePath();
      ctx.fill();
      // crisp rhomb sides (skip the internal diagonal so halves merge into a clean rhomb)
      var sides = sideEdges(sa, sb, sc);
      ctx.strokeStyle = sideStroke; ctx.lineWidth = Math.max(0.5, S * 0.0011);
      ctx.beginPath();
      ctx.moveTo(sides[0][0][0], sides[0][0][1]); ctx.lineTo(sides[0][1][0], sides[0][1][1]);
      ctx.moveTo(sides[1][0][0], sides[1][0][1]); ctx.lineTo(sides[1][1][0], sides[1][1][1]);
      ctx.stroke();
    }

    // pass 2 — THE REVEAL: the same tiling, one scale up, stroked bold over the fine field.
    // These super-rhombs are made of the small rhombs beneath them: the pattern contains itself.
    var skelCol = dark ? "rgba(245,225,150,0.92)" : mood.skel;
    for (var s = 0; s < superTris.length; s++) {
      var U = superTris[s];
      var ua = toScreen(U.a), ub = toScreen(U.b), uc = toScreen(U.c);
      if (!onScreen(ua, ub, uc)) continue;
      var us = sideEdges(ua, ub, uc);
      ctx.strokeStyle = skelCol; ctx.lineWidth = S * 0.0052;
      ctx.beginPath();
      ctx.moveTo(us[0][0][0], us[0][0][1]); ctx.lineTo(us[0][1][0], us[0][1][1]);
      ctx.moveTo(us[1][0][0], us[1][0][1]); ctx.lineTo(us[1][1][0], us[1][1][1]);
      ctx.stroke();
    }

    // ---- paper grain + a soft vignette to seat it ----
    ctx.globalAlpha = dark ? 0.05 : 0.06;
    for (var g = 0; g < 1400; g++) {
      var gx = rng.range(0, S), gy = rng.range(0, S);
      if (nz.fbm(gx * 0.05, gy * 0.05, 2) > 0.55) { ctx.fillStyle = mood.grain; ctx.fillRect(gx, gy, 1.3, 1.3); }
    }
    ctx.globalAlpha = 1;
    var vig = ctx.createRadialGradient(S * 0.5, S * 0.5, S * 0.5, S * 0.5, S * 0.5, S * 0.82);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, dark ? "rgba(0,0,0,0.30)" : "rgba(40,28,12,0.10)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);
  }
});
