// Emil's Loom — the harness.
//
// The small, boring-but-essential plumbing every piece needs: a crisp canvas
// (sharp on hi-dpi screens) and a way to read the piece's seed. Kept separate
// from the art so each piece's sketch.js can stay purely about the image.
//
// Classic script, hangs off window.Loom — see lib/rng.js for why.
(function (Loom) {
  // True when a piece is rendered inside the gallery's preview iframe. In that
  // case we draw only the art and skip the caption/controls chrome.
  Loom.embedded = window.top !== window.self;

  // Read ?seed=... from the URL so a piece can be re-woven with a new seed
  // without touching code; falls back to the piece's committed default.
  Loom.seedFromUrl = function (fallback) {
    var u = new URLSearchParams(location.search).get("seed");
    return u === null || u === "" ? fallback : u;
  };

  // A square canvas sized to fit the viewport (with margin), crisp on retina.
  // Returns { canvas, ctx, size, dpr } — the ctx is pre-scaled, so draw in CSS
  // pixels and forget the device pixel ratio exists.
  Loom.square = function (opts) {
    opts = opts || {};
    var margin = opts.margin === undefined ? 0 : opts.margin;
    var size = Math.min(window.innerWidth, window.innerHeight) - margin * 2;
    var canvas = document.createElement("canvas");
    (opts.parent || document.body).appendChild(canvas);
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return { canvas: canvas, ctx: ctx, size: size, dpr: dpr };
  };

  // Show a small caption (piece title + the exact seed that made this image).
  // Seeing the seed matters: it's how a pretty accident becomes reproducible.
  Loom.caption = function (title, seed) {
    if (Loom.embedded) return null;
    var el = document.createElement("div");
    el.className = "loom-caption";
    el.innerHTML =
      '<span class="loom-title"></span><span class="loom-seed"></span>';
    el.querySelector(".loom-title").textContent = title;
    el.querySelector(".loom-seed").textContent = "seed: " + seed;
    document.body.appendChild(el);
    return el;
  };

  // Wire a "weave another" control: reloads with a random seed to explore
  // variations. (View-time randomness only — the committed default seed is what
  // reproduces the committed image.)
  Loom.shuffleButton = function () {
    var bar = document.querySelector(".loom-controls");
    if (!bar) return;
    if (Loom.embedded) { bar.style.display = "none"; return; }
    var another = bar.querySelector("[data-another]");
    var reset = bar.querySelector("[data-reset]");
    if (another) another.addEventListener("click", function () {
      var s = Math.floor(Math.random() * 1e9);
      location.search = "?seed=" + s;
    });
    if (reset) reset.addEventListener("click", function () {
      location.search = "";
    });
  };
})((window.Loom = window.Loom || {}));
