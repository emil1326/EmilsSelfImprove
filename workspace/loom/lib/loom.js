// Emil's Loom — the harness.
//
// The small, boring-but-essential plumbing every piece needs, plus the contract
// that ties pieces and the gallery together. A piece registers a *draw function*
// that paints into a given stage at a given size — nothing more. That one rule
// lets the same code render full-screen on its own page AND as a small preview
// in the gallery, with no iframes and no file:// framing questions.
//
// Classic script, hangs off window.Loom — see lib/rng.js for why.
(function (Loom) {
  Loom._pieces = {};

  // Read ?seed=... from the URL so a piece can be re-woven with a new seed
  // without touching code; falls back to the piece's committed default.
  Loom.seedFromUrl = function (fallback) {
    var u = new URLSearchParams(location.search).get("seed");
    return u === null || u === "" ? fallback : u;
  };

  // Size a canvas to `size` CSS pixels, crisp on hi-dpi screens, and return a
  // pre-scaled 2d context so a piece can draw in plain CSS pixels and forget the
  // device pixel ratio exists.
  function prepare(canvas, size) {
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }
  Loom.prepare = prepare;

  // A piece. `def` = { id, title, seed, draw(stage, rng) }, where stage is
  // { ctx, size } and rng is a seeded Loom.RNG. Registering is all a piece does;
  // on its own page it then renders full-screen automatically. The gallery sets
  // window.LOOM_GALLERY first, so there it only registers.
  //
  // ANIMATION: if draw() *returns a function* frame(t), the piece is animated —
  // draw() does the seeded setup once, and frame(seconds) paints each frame. The
  // full page runs a requestAnimationFrame loop; the gallery shows one static
  // frame (t=0). Static pieces just draw and return nothing (unchanged). Keeping
  // the rng work in draw() and only time in frame() keeps each frame reproducible.
  Loom.piece = function (def) {
    Loom._pieces[def.id] = def;
    if (!window.LOOM_GALLERY) renderFull(def);
    return def;
  };

  // Full-screen render for a piece's own page: a square canvas that fills the
  // viewport, the seed taken from the URL (or the piece default), plus caption
  // and the "weave another" control.
  function renderFull(def) {
    var size = Math.min(window.innerWidth, window.innerHeight) - 56;
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    var ctx = prepare(canvas, size);
    var seed = Loom.seedFromUrl(def.seed);
    var frame = def.draw({ ctx: ctx, size: size }, new Loom.RNG(seed));
    caption("Emil's Loom · " + def.id + " — " + def.title, seed);
    shuffleButton();
    if (typeof frame === "function") {           // animated piece — run the loop
      var t0 = performance.now();
      (function loop() {
        frame((performance.now() - t0) / 1000);
        requestAnimationFrame(loop);
      })();
    }
  }

  // Render a registered piece into an existing canvas at `size` px, using its
  // canonical (default-seed) form. This is how the gallery makes a preview —
  // same page, real drawing code, no iframe.
  Loom.preview = function (id, canvas, size) {
    var def = Loom._pieces[id];
    if (!def) return;
    var ctx = prepare(canvas, size);
    var frame = def.draw({ ctx: ctx, size: size }, new Loom.RNG(def.seed));
    if (typeof frame === "function") frame(0);   // animated piece → one static frame
  };

  // Show a small caption: piece title + the exact seed that made this image.
  // Seeing the seed matters — it's how a pretty accident becomes reproducible.
  function caption(title, seed) {
    var el = document.createElement("div");
    el.className = "loom-caption";
    el.innerHTML = '<span class="loom-title"></span><span class="loom-seed"></span>';
    el.querySelector(".loom-title").textContent = title;
    el.querySelector(".loom-seed").textContent = "seed: " + seed;
    document.body.appendChild(el);
  }

  // Wire the "weave another" / "reset" controls if the page has them. View-time
  // randomness only — the committed default seed is what reproduces the canon.
  function shuffleButton() {
    var bar = document.querySelector(".loom-controls");
    if (!bar) return;
    var another = bar.querySelector("[data-another]");
    var reset = bar.querySelector("[data-reset]");
    if (another) another.addEventListener("click", function () {
      location.search = "?seed=" + Math.floor(Math.random() * 1e9);
    });
    if (reset) reset.addEventListener("click", function () { location.search = ""; });
  }
})((window.Loom = window.Loom || {}));
