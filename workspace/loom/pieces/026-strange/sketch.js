// Emil's Loom · piece 026 — "Strange"
//
// A strange attractor: the trace of a chaotic map (de Jong), millions of iterated points falling into
// impossible delicate filigree. No subject, no scene — pure code-as-art, chaos resolving into structure.
// The deliberate BOLD/abstract swing after a run of beautiful-but-representational pieces (the #45 audit
// caught me narrowing into "a pretty picture of a thing"); a return to the systems register the early
// Loom had, and a home for the quiet "Patterns & fields" movement.
//
// How: iterate (x,y) -> (sin(a·y)-cos(b·x), sin(c·x)-cos(d·y)) a few million times, accumulating a DENSITY
// buffer (how often each pixel is visited). Then map log(density) through a luminous ramp — the structure
// glows where the orbit lingers, fades where it rarely goes. The four parameters (seeded) decide the whole
// form, so "weave another" finds a different universe each time. Accumulated at supersample res and
// downscaled for smooth filigree. Composes ramp (the glow) + the palette helpers. Static — a caught orbit.
Loom.piece({
  id: "026",
  title: "Strange",
  seed: "39",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size;
    // The de Jong parameters — the whole attractor lives in these four numbers. But ~60% of random
    // quadruples are DEGENERATE: the orbit collapses to a point or a tiny loop (this is how seed
    // "chaos-7" gave a near-black dot). So sample params, run a cheap coverage pre-pass, and keep
    // re-rolling — deterministically, from the same seeded rng — until we land in the interesting
    // region. Same seed always runs the same search and lands on the same attractor, so the piece
    // stays reproducible AND every "weave another" shows real structure, not an occasional broken
    // dot. The 0.12 threshold sits in the natural gap between the dud cluster (<0.05) and the full
    // attractors (>0.2). (lesson 014 — precompute seed→outcome instead of blind-sampling live.)
    function coverageOf(a, b, c, d) {
      var G = 120, seen = new Uint8Array(G * G), sc = G * 0.225, oxg = G * 0.5, oyg = G * 0.5;
      var x = 0.1, y = 0.1, distinct = 0;
      for (var i = 0; i < 50000; i++) {
        var nx = Math.sin(a * y) - Math.cos(b * x), ny = Math.sin(c * x) - Math.cos(d * y);
        x = nx; y = ny;
        if (i < 256) continue;
        var px = (oxg + x * sc) | 0, py = (oyg + y * sc) | 0;
        if (px < 0 || px >= G || py < 0 || py >= G) continue;
        var k = py * G + px; if (!seen[k]) { seen[k] = 1; distinct++; }
      }
      return distinct / (G * G);
    }
    var a, b, c, d, bestCov = -1, ba = 0, bb = 0, bc = 0, bd = 0;
    for (var attempt = 0; attempt < 30; attempt++) {
      a = rng.range(-2.7, 2.7); b = rng.range(-2.7, 2.7); c = rng.range(-2.7, 2.7); d = rng.range(-2.7, 2.7);
      var cov = coverageOf(a, b, c, d);
      if (cov > bestCov) { bestCov = cov; ba = a; bb = b; bc = c; bd = d; }
      if (cov >= 0.12) break;            // a full, interesting attractor — stop searching
    }
    a = ba; b = bb; c = bc; d = bd;      // the first that passed, or (if none did) the fullest seen

    var W = Math.round(S * 1.3), H = W;                 // supersample, then downscale for smooth filigree
    var dens = new Float32Array(W * H);
    var scale = W * 0.225, ox = W * 0.5, oy = W * 0.5;  // attractor lives in ~[-2,2]² → centre it
    var iters = Math.round(2600000 * (W / 988) * (W / 988));
    var x = 0.1, y = 0.1, maxD = 0;
    for (var i = 0; i < iters; i++) {
      var nx = Math.sin(a * y) - Math.cos(b * x);
      var ny = Math.sin(c * x) - Math.cos(d * y);
      x = nx; y = ny;
      if (i < 256) continue;                            // let the transient settle
      var pxi = (ox + x * scale) | 0, pyi = (oy + y * scale) | 0;
      if (pxi < 0 || pxi >= W || pyi < 0 || pyi >= H) continue;
      var v = ++dens[pyi * W + pxi];
      if (v > maxD) maxD = v;
    }

    // luminous nebula ramp: near-black → indigo → violet → magenta → gold → white-hot
    var ramp = Loom.ramp(["#06040e", "#161a52", "#3a2f96", "#7b3fb0", "#c9498a", "#f0a64e", "#fff3da", "#ffffff"]);
    var lmax = Math.log(1 + maxD) || 1, col = [0, 0, 0];
    var bg = Loom.hexToRgb("#05040c");
    var oc = document.createElement("canvas"); oc.width = W; oc.height = H;
    var o = oc.getContext("2d");
    var img = o.createImageData(W, H), data = img.data;
    for (var p = 0; p < W * H; p++) {
      var dd = dens[p], idx = p * 4;
      if (dd === 0) { data[idx] = bg.r; data[idx + 1] = bg.g; data[idx + 2] = bg.b; data[idx + 3] = 255; continue; }
      var t = Math.log(1 + dd) / lmax;                  // log compresses the huge density range
      t = Math.pow(t, 0.68);                            // gamma<1 lifts the mid-densities so the diffuse veils
                                                        // pick up the ramp's rose/magenta/gold — without it the
                                                        // peaked density collapses almost everything to flat violet
      ramp.rgb(t, col);
      data[idx] = col[0]; data[idx + 1] = col[1]; data[idx + 2] = col[2]; data[idx + 3] = 255;
    }
    o.putImageData(img, 0, 0);

    // ---- compose onto the main canvas ----
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    ctx.fillStyle = "#05040c"; ctx.fillRect(0, 0, S, S);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(oc, 0, 0, S, S);
    // a soft vignette
    var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.38, S / 2, S / 2, S * 0.78);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(3,2,8,0.55)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
