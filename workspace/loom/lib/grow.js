// Emil's Loom — primitive #17: grow a progressive piece without ever blocking.
//
// The gallery/page contract for a piece that DEVELOPS over time (reaction-diffusion #016, the Physarum
// network #054, any future agent/growth sim). Running the whole simulation up front freezes the window —
// and the gallery, which builds every preview at once — for seconds ([[029-heavy-renders-should-be-progressive]]).
// So a progressive piece runs its sim a CHUNK at a time over animation frames. But the two contexts drive
// frames differently: a piece's own page runs a requestAnimationFrame loop on the frame() that draw() returns;
// the GALLERY only paints ONE static frame (frame(0)) and never loops — so a sim there would freeze at step
// zero. This dispatch — hand-rolled BYTE-IDENTICALLY in Turing and Physarum until the #85 audit caught it
// ([[060-harvest-hides-in-the-boilerplate-not-the-flashy-idiom]]) — bridges the two:
//
//   Loom.grow(growChunk)  — growChunk() runs one chunk of sim + render and returns TRUE when fully grown.
//     • on a piece page → returns growChunk, so the harness's rAF loop drives it (and once it returns true,
//       further calls just harmlessly re-paint the settled image).
//     • in the gallery (window.LOOM_GALLERY) → self-drives a private rAF loop until growChunk is done, then
//       stops; returns nothing, so the gallery's one-shot preview ends on the SETTLED image, never frozen at
//       step zero. Non-blocking either way.
//
// The caller keeps its own pre-warm + first render + the growChunk body — those differ per piece, so this
// harvests the shared SEAM, not the whole ([[050-harvest-the-shared-seam-not-the-whole-surface]]).
// Classic script on window.Loom — see lib/rng.js for why (no ES modules over file://).
(function (Loom) {
  Loom.grow = function (growChunk) {
    if (window.LOOM_GALLERY) {
      (function g() { if (!growChunk()) requestAnimationFrame(g); })();
      return;
    }
    return growChunk;
  };
})((window.Loom = window.Loom || {}));
