// Emil's Loom · piece 054 — "Physarum"
//
// A slime mould thinking out loud. Physarum polycephalum is a single brainless cell that solves mazes and
// rebuilds the Tokyo rail map by a stupidly simple trick: thousands of little fronts crawl about, each
// leaving a chemical trail and steering toward the strongest trail it can smell. From that one local rule —
// deposit, sense, turn, move — a whole transport NETWORK self-organises: trunk lines, branches, loops,
// nodes. Nobody designs it; it emerges. The HOOK ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]):
// the same "a system surprises me" awe as Murmuration's flock (#017) and the de Jong attractor (#026) — the
// emergent register that hits hardest — a network that looks neural / mycelial / like the cosmic web, grown
// not drawn. Deliberately chosen AGAINST a run of faithful depictions (Resonance/Prismatic), per #83's watch.
//
// The agent rule is the classic Jones (2010), made DETERMINISTIC (turn toward the stronger sensor, no
// coin-flip) so the per-frame step is rng-free and the settled image reproduces from the seed alone
// ([[017-animation-seed-setup-once]]); all the randomness is the seeded SETUP (start positions + the
// sense/turn/decay parameters that pick which kind of network grows). Grown progressively over animation
// frames so the page never freezes and the gallery self-drives to a settled network ([[029-heavy-renders-should-be-progressive]],
// the Turing #016 pattern). Trail field → ramp (#11), upscaled ([[038-render-fields-numerically-then-upscale]]).
Loom.piece({
  id: "054",
  title: "Physarum",
  seed: "forage",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;

    var G = 300;                                            // simulation grid (upscaled to S)
    var N = 20000;                                          // agents (the crawling fronts) — dense → a fine web

    // dark ground → glowing filament. Each scheme a different organism-light.
    var SCHEMES = [
      { ramp: ["#04060c", "#08243a", "#176a92", "#46c4dc", "#cdeef8"] },  // electric cyan
      { ramp: ["#08040c", "#2a0a38", "#7a1f8c", "#d65ac4", "#f8ccee"] },  // neural magenta
      { ramp: ["#0a0703", "#2c1c08", "#8a5a18", "#dcad42", "#f8e8b4"] },  // mycelial gold
      { ramp: ["#04080a", "#0a2a1e", "#1f7a4c", "#5cd28e", "#dcf8cc"] },  // bioluminescent green
      { ramp: ["#0a0404", "#300e0a", "#8c2c1c", "#e26a40", "#f8d4a6"] }   // ember
    ];
    var ramp = Loom.ramp(rng.pick(SCHEMES).ramp);

    // sense/turn parameters — picked within known-good ranges (Physarum is sensitive to them)
    var SA = rng.range(0.38, 0.62);                        // sensor angle (rad)
    var SD = rng.range(4.5, 8.5);                          // sensor distance (grid px) — shorter → finer web
    var TA = rng.range(0.32, 0.58);                        // turn angle (rad)
    var SP = rng.range(0.85, 1.15);                        // move speed (grid px/step)
    var DEP = 4.0;                                         // trail deposited per step
    var DEC = rng.range(0.88, 0.93);                       // trail evaporation per step
    var DIFF = 0.2;                                        // diffusion rate (low → thin, crisp filaments)

    var trail = new Float32Array(G * G), tmp = new Float32Array(G * G);
    var ax = new Float32Array(N), ay = new Float32Array(N), ah = new Float32Array(N);

    // start the fronts: mostly a uniform scatter (reliably fills space into a web); a ring now and then.
    // (a central disc collapses into one bright node — dropped.)
    var mode = rng.pick(["scatter", "scatter", "scatter", "ring"]);
    for (var i = 0; i < N; i++) {
      if (mode === "scatter") {
        ax[i] = rng.range(0, G); ay[i] = rng.range(0, G); ah[i] = rng.range(0, TAU);
      } else { // ring
        var t = rng.range(0, TAU), rr = G * 0.36 + rng.range(-G * 0.03, G * 0.03);
        ax[i] = G / 2 + Math.cos(t) * rr; ay[i] = G / 2 + Math.sin(t) * rr; ah[i] = t + TAU / 4 * (rng.bool(0.5) ? 1 : -1);
      }
    }

    // a deterministic per-(agent, step) pseudo-random in [0,1) — gives the exploration the classic
    // algorithm gets from a coin-flip, but as a pure function of (i, step) so it reproduces from the seed
    // no matter how the growth is sliced across frames ([[017-animation-seed-setup-once]]).
    var stepCount = 0;
    function hash(i, s) { var v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return v - Math.floor(v); }

    function sense(x, y, a) {
      var sx = x + Math.cos(a) * SD, sy = y + Math.sin(a) * SD;
      sx = sx < 0 ? sx + G : (sx >= G ? sx - G : sx);
      sy = sy < 0 ? sy + G : (sy >= G ? sy - G : sy);
      return trail[(sy | 0) * G + (sx | 0)];
    }

    function step() {
      stepCount++;
      for (var i = 0; i < N; i++) {
        var x = ax[i], y = ay[i], a = ah[i];
        var f = sense(x, y, a), l = sense(x, y, a - SA), r = sense(x, y, a + SA);
        if (f >= l && f >= r) { /* trail ahead strongest → hold course */ }
        else if (f < l && f < r) { a += (hash(i, stepCount) < 0.5 ? -TA : TA); }  // ahead WEAKEST → explore (random turn)
        else if (l > r) { a -= TA; } else { a += TA; }      // otherwise steer toward the stronger side
        x += Math.cos(a) * SP; y += Math.sin(a) * SP;
        if (x < 0) x += G; else if (x >= G) x -= G;
        if (y < 0) y += G; else if (y >= G) y -= G;
        ax[i] = x; ay[i] = y; ah[i] = a;
        trail[(y | 0) * G + (x | 0)] += DEP;                // lay a little trail
      }
      // diffuse (separable 3-tap box blur, toroidal) + evaporate
      var x2, y2;
      for (y2 = 0; y2 < G; y2++) {
        var row = y2 * G;
        for (x2 = 0; x2 < G; x2++) {
          var xl = x2 === 0 ? G - 1 : x2 - 1, xr = x2 === G - 1 ? 0 : x2 + 1;
          tmp[row + x2] = (trail[row + xl] + trail[row + x2] + trail[row + xr]) * 0.3333333;
        }
      }
      for (y2 = 0; y2 < G; y2++) {
        var yu = (y2 === 0 ? G - 1 : y2 - 1) * G, yd = (y2 === G - 1 ? 0 : y2 + 1) * G, rc = y2 * G;
        for (x2 = 0; x2 < G; x2++) {
          var bl = (tmp[yu + x2] + tmp[rc + x2] + tmp[yd + x2]) * 0.3333333;
          trail[rc + x2] = (trail[rc + x2] * (1 - DIFF) + bl * DIFF) * DEC;     // weak diffusion → thin filaments
        }
      }
    }

    // ---- render the trail field → glowing network ----
    var off = document.createElement("canvas"); off.width = G; off.height = G;
    var octx = off.getContext("2d"), img = octx.createImageData(G, G), data = img.data, rgb = [0, 0, 0];
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    function render() {
      for (var i = 0; i < G * G; i++) {
        var s = trail[i] * 0.07;
        var v = s / (s + 1);                                // saturating tonemap: lifts faint filaments, tames blown cores
        v = Math.pow(v, 0.85);
        ramp.rgb(v, rgb);
        var p = i * 4; data[p] = rgb[0]; data[p + 1] = rgb[1]; data[p + 2] = rgb[2]; data[p + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.drawImage(off, 0, 0, G, G, 0, 0, S, S);
    }

    // ---- grow it (the Turing #016 progressive pattern; never block the page or the gallery) ----
    var BUDGET = rng.int(420, 520);
    var warm = 6; for (var w = 0; w < warm; w++) step();
    render();
    var done = warm;
    function growChunk() {
      if (done >= BUDGET) return true;
      for (var c = 0; c < 6 && done < BUDGET; c++) { step(); done++; }
      render();
      return done >= BUDGET;
    }
    if (window.LOOM_GALLERY) { (function grow() { if (!growChunk()) requestAnimationFrame(grow); })(); return; }
    return growChunk;
  }
});
