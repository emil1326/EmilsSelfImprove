// Emil's Loom — primitive #16: a per-pixel field, rendered to an offscreen buffer.
//
// The GENERAL case beneath Loom.sphere (#15). The flat 2-D field-render-to-buffer loop — offscreen
// ImageData, a pixel loop, the caller's shade per pixel, putImageData — is hand-rolled IDENTICALLY in
// ~13 pieces (Koi, Molten, Geode, Strata, Turing, Strange, …). I harvested the sphere SPECIALIZATION at
// #71 and walked straight past this broader pattern (more consumers!) until the #75 audit's grep —
// extracting a special case can blind you to the general one beneath it
// ([[063-harvesting-a-specialization-leaves-the-general-pattern-unharvested]],
// [[060-harvest-hides-in-the-boilerplate-not-the-flashy-idiom]]).
//
// The DIVERGENCE — what colour each pixel is — is the caller's callback ([[023-primitive-returns-state-not-pixels]]:
// the primitive owns the loop, the caller owns the look). Returns the offscreen canvas; the caller draws it
// (usually UPSCALED — the soft-field pattern [[038-render-fields-numerically-then-upscale]]) and may paint
// MORE onto it first (Koi adds gradients before the upscale).
//
//   Loom.field(size, shade) → canvas
//     size  — the offscreen buffer is size×size (low-res for soft fields, then upscale)
//     shade(x, y, out) — fill out = [r,g,b,a] for buffer pixel (x, y):
//         x, y — buffer pixel integers (a screen-space caller does its own X = x*sc)
//         out  — [r,g,b,a], pre-set to [0,0,0,255]; set out[3] = 0 to leave a pixel transparent
//                (the geode's cavity clip — what used to be a loop `continue`)
//
// Every pixel is shaded — there's no built-in disc clip; that clip is exactly Loom.sphere's specialization
// (sphere = field + the sphere geometry in its shade). Left separate for now; see lib/sphere.js.
// Classic script on window.Loom — see lib/rng.js for why (no ES modules over file://).
(function (Loom) {
  Loom.field = function (size, shade) {
    var oc = document.createElement("canvas"); oc.width = size; oc.height = size;
    var octx = oc.getContext("2d"), img = octx.createImageData(size, size), data = img.data;
    var out = [0, 0, 0, 255];                       // reused per pixel — no per-pixel allocation
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        out[0] = 0; out[1] = 0; out[2] = 0; out[3] = 255;
        shade(x, y, out);
        var i = (y * size + x) * 4;
        data[i] = out[0]; data[i + 1] = out[1]; data[i + 2] = out[2]; data[i + 3] = out[3];
      }
    }
    octx.putImageData(img, 0, 0);
    return oc;
  };
})((window.Loom = window.Loom || {}));
