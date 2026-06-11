// Emil's Loom · piece 001 — "Warp & Weft"
//
// The first thing the Loom weaves: actual cloth. Warp threads run vertical, weft
// threads run horizontal, and at every crossing one passes over the other in an
// alternating checker — the same over-under that makes real woven fabric hold
// together. Threads carry small seeded variations in colour and position so it
// reads as hand-woven, not a rigid grid.
//
// The artifact is THIS code + the seed. Same seed → same cloth, every time.
(function () {
  var DEFAULT_SEED = "warp-and-weft";
  var seed = Loom.seedFromUrl(DEFAULT_SEED);
  var rng = new Loom.RNG(seed);

  var stage = Loom.square({ margin: 28 });
  var ctx = stage.ctx;
  var S = stage.size;

  // A few hand-tuned palettes; the seed picks one. Each: bg + warp/weft thread sets.
  var PALETTES = [
    { bg: "#1d1a14", warp: ["#d98c3f", "#e7b261", "#a8602b", "#caa05a"], weft: ["#5d7a6b", "#88a98f", "#3f5a4d", "#6f9b86"] }, // amber & sage
    { bg: "#141a1d", warp: ["#5aa7c4", "#7fc6df", "#3d7e98", "#a6d8e8"], weft: ["#c96f5a", "#e0917b", "#9c4f3d", "#d8a08f"] }, // teal & clay
    { bg: "#1a161e", warp: ["#9b7bc4", "#bd9fe0", "#6e5292", "#cbb3e6"], weft: ["#c4a14e", "#e0c477", "#8f7233", "#d8bf8a"] }, // violet & gold
    { bg: "#16160f", warp: ["#cfc08a", "#e6dcae", "#a99c62", "#ddd4a0"], weft: ["#7d8a6a", "#9fae86", "#586348", "#8c9b73"] }  // flax & moss
  ];
  var pal = rng.pick(PALETTES);

  // Number of threads each way (slightly different so it's never a perfect square).
  var nWarp = rng.int(15, 24);
  var nWeft = rng.int(15, 24);

  // Build thread tracks: a centre position and a colour for each, with a little
  // gaussian jitter on the spacing so the weave breathes instead of marching.
  function tracks(n, palette) {
    var step = S / n;
    var arr = [];
    for (var i = 0; i < n; i++) {
      arr.push({
        center: step * (i + 0.5) + rng.gaussian(0, step * 0.05),
        width: step * rng.range(0.66, 0.86),   // thread thickness; the rest is gap
        color: rng.pick(palette)
      });
    }
    return arr;
  }
  var warps = tracks(nWarp, pal.warp);
  var wefts = tracks(nWeft, pal.weft);

  // Background.
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, S, S);

  // A thread band with a cross-section sheen: dark at the edges, light down the
  // middle, so each thread looks like a little rounded tube catching the light.
  function thread(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    var grad = (w >= h)
      ? ctx.createLinearGradient(0, y, 0, y + h)   // shade across the short axis
      : ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, "rgba(0,0,0,0.30)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.11)");
    grad.addColorStop(1, "rgba(0,0,0,0.30)");
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  }

  // The over-under, in three honest passes:
  // 1) lay every weft thread down full-length,
  // 2) lay every warp thread on top full-length (so warp is "over" everywhere),
  // 3) at the cells where the weft should win, redraw just that weft crossing on
  //    top of the warp. Parity (i + j) decides, giving the alternating weave.
  for (var a = 0; a < nWeft; a++) {
    thread(0, wefts[a].center - wefts[a].width / 2, S, wefts[a].width, wefts[a].color);
  }
  for (var b = 0; b < nWarp; b++) {
    thread(warps[b].center - warps[b].width / 2, 0, warps[b].width, S, warps[b].color);
  }
  for (var j = 0; j < nWeft; j++) {
    var weft = wefts[j];
    for (var i = 0; i < nWarp; i++) {
      if ((i + j) % 2 === 1) {            // weft passes over here
        var cellL = (i === 0) ? 0 : (warps[i - 1].center + warps[i].center) / 2;
        var cellR = (i === nWarp - 1) ? S : (warps[i].center + warps[i + 1].center) / 2;
        thread(cellL, weft.center - weft.width / 2, cellR - cellL, weft.width, weft.color);
      }
    }
  }

  // A faint vignette to settle the cloth into the dark.
  var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.35, S / 2, S / 2, S * 0.72);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, S, S);

  Loom.caption("Emil's Loom · 001 — Warp & Weft", seed);
  Loom.shuffleButton();
})();
