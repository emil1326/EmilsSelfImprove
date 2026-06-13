// Emil's Loom · piece 064 — "Phyllotaxis"
//
// The golden angle, made visible. Place a seed, turn 137.5° (the golden angle, 2π/φ²), place another, turn
// again — a few thousand times — and the seeds pack into the spiral the sunflower, the pinecone, the
// daisy-head all use: dense, even, never-overlapping, with two sets of counter-rotating spiral arms
// (parastichies) that no one drew — they're a side effect of that ONE irrational angle. The HOOK is the
// emergence ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]): a system out-inventing me, the
// Strange-attractor lane (#026, a rated 5). Chosen by genuine PULL ([[075-i-reach-for-impressive-to-make-and-miscall-it-my-strength]]);
// it's crisp/geometric, which happens to vary off the last two soft atmospheric scenes (a bonus, not the
// reason — the 076 trap). Low-variance (the spiral always forms, 062); the work is the BEAUTY (jewel-shaded
// florets, a radial colour ramp). Composes ramp + palette + glow. Static — a settled, mesmerising thing.
Loom.piece({
  id: "064",
  title: "Phyllotaxis",
  seed: "goldenangle",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, PI = Math.PI;
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var clamp = function (v) { return v < 0 ? 0 : v > 255 ? 255 : v; };
    var rgbStr = function (r, g, b) { return "rgb(" + (clamp(r) + 0.5 | 0) + "," + (clamp(g) + 0.5 | 0) + "," + (clamp(b) + 0.5 | 0) + ")"; };
    var cx = 0.5 * S, cy = 0.5 * S, GA = PI * (3 - Math.sqrt(5));        // golden angle ≈ 2.39996 rad

    var N = rng.int(1700, 2300), c = 0.47 / Math.sqrt(N);
    // a few jewel ramps (center → edge), seed-picked; centres kept luminous so the core glows, not voids
    var ramps = [
      ["#6a34a2", "#a83a9a", "#dc5286", "#f29a4c", "#f7da6c"],   // violet → magenta → coral → gold
      ["#16606e", "#1b8c82", "#46c084", "#c2e26c", "#f5edb0"],   // teal → jade → chartreuse → cream
      ["#7a2848", "#b03a54", "#dc6450", "#f0a05e", "#f7de8c"],   // garnet → coral → amber
      ["#3a3088", "#5a5ab0", "#62acdc", "#aae2e2", "#f3f5da"]    // indigo → blue → cyan → pale
    ];
    var rmp = Loom.ramp(ramps[rng.int(0, ramps.length - 1)]);

    // ---- background: a dark spotlight on the mandala ----
    var bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 0.78 * S);
    bg.addColorStop(0, "#191325"); bg.addColorStop(0.6, "#0c0a18"); bg.addColorStop(1, "#05040d");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    var mc = rmp.rgb(0.4);                                              // a soft palette-coloured core glow under the centre
    var cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 0.22 * S);
    cg.addColorStop(0, "rgba(" + (mc[0] | 0) + "," + (mc[1] | 0) + "," + (mc[2] | 0) + ",0.55)");
    cg.addColorStop(1, "rgba(" + (mc[0] | 0) + "," + (mc[1] | 0) + "," + (mc[2] | 0) + ",0)");
    ctx.fillStyle = cg; ctx.fillRect(0, 0, S, S);

    // ---- the florets ----
    var col = [0, 0, 0];
    for (var n = 1; n <= N; n++) {
      var a = n * GA, r = c * Math.sqrt(n) * S, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      var t = n / N;
      rmp.rgb(t, col);
      var fr = 0.6 * c * S * lerp(0.52, 1.18, Math.pow(t, 0.34));
      var g = ctx.createRadialGradient(x - fr * 0.32, y - fr * 0.32, fr * 0.08, x, y, fr);
      g.addColorStop(0, rgbStr(col[0] * 1.55, col[1] * 1.55, col[2] * 1.55));
      g.addColorStop(0.55, rgbStr(col[0], col[1], col[2]));
      g.addColorStop(1, rgbStr(col[0] * 0.42, col[1] * 0.42, col[2] * 0.42));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, fr, 0, TAU); ctx.fill();
    }
  }
});
