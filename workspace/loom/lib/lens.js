// Emil's Loom — lens (primitive #14).
//
// The "droplet-full-of-the-world" refraction: a water bead — or any clear lens — shows a WIDE-ANGLE,
// INVERTED, minified view of whatever is behind it. Rain (023) and Dew (030) both hand-rolled the exact
// same trick: paint a background canvas scaled by a negative factor about the bead's centre. Two
// consumers, so it earned its place as a shared primitive ([[019-harvest-primitives-from-duplication]]).
// Anything refractive wants it: rain on a window, dew on a web, a glass marble, a crystal ball, a bubble.
//
// It draws ONLY the refraction, and respects the caller's current CLIP, globalAlpha and composite — so
// the caller owns the bead's shape (clip an ellipse first) and its surface dressing (meniscus, glint,
// rim, lift), which legitimately differ by the lighting. The harvested SEAM is the refraction, not the
// whole droplet: the two pieces' dressing diverges too much to share without a tangle of flags, but the
// lens at the core is identical (only k differs). Compose, don't bundle — [[023-primitive-returns-state-not-pixels]].
//
// Classic script on window.Loom.
(function (Loom) {
  // Paint `bg` (a canvas) as a lens centred at (x, y): the scene scaled by k about that point.
  //   k < 0  → inverted, and (|k| < 1) minified — the classic upside-down droplet world (e.g. -0.45 / -0.5).
  //   k > 0  → an upright magnifier.
  // Respects the caller's clip + globalAlpha + globalCompositeOperation, so a bead on a DARK ground can
  // call it twice (once source-over, once additive at low alpha) to concentrate the bright lights behind
  // it, while a bead on a BRIGHT ground calls it once. Its own save/restore touches only the transform.
  Loom.lens = function (ctx, bg, x, y, k) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
    ctx.drawImage(bg, 0, 0, bg.width, bg.height);
    ctx.restore();
  };
})((window.Loom = window.Loom || {}));
