// Emil's Loom — primitive #15: a field on a sphere.
//
// HARVESTED at #71 from three pieces that each hand-rolled the IDENTICAL scaffolding and went unnoticed for
// fourteen iterations — Giant (024, banded clouds), Sun (041, granulation), Bubble (044, thin-film). Each
// renders a per-pixel field onto a sphere, and I kept missing the seam because the loop is BOILERPLATE, not
// the flashy part of any of them ([[060-harvest-hides-in-the-boilerplate-not-the-flashy-idiom]]).
//
// The shared body: an offscreen ImageData, a pixel loop, screen → normalized sphere coords, clip the disc,
// the surface normal nz = sqrt(1 - r²), then putImageData. The DIVERGENCE — what colour each pixel is — is
// the caller's `shade` callback ([[023-primitive-returns-state-not-pixels]] in spirit: the primitive owns the
// geometry, the caller owns the look). Returns the offscreen canvas (the caller draws it, usually upscaled —
// the soft-field pattern, [[038-render-fields-numerically-then-upscale]]); pixels outside the disc stay
// transparent.
//
//   Loom.sphere(size, cx, cy, R, shade) → canvas
//     size        — the offscreen buffer is size×size (low res for soft fields, then upscale)
//     cx, cy, R   — the sphere's centre + radius IN BUFFER PIXELS (for a half-res buffer, pass cx/sc, etc.)
//     shade(x, y, dx, dy, nz, r2, out) — fill out = [r,g,b,a] for this pixel:
//         x, y    — buffer pixel (integers); a screen-space caller does its own X = x*sc
//         dx, dy  — normalized sphere coords in [-1,1] = ((x-cx)/R, (y-cy)/R)
//         nz      — surface normal z = sqrt(1 - r²): 1 at the centre, 0 at the limb
//                   (this IS the limb-darkening factor / the Fresnel base — grazing angle = small nz)
//         r2      — dx² + dy²
//         out     — [r,g,b,a], pre-set to [0,0,0,255]; set out[3] for transparency (the bubble's thin cap)
//
// Classic script on window.Loom — see lib/rng.js for why (no ES modules over file://).
(function (Loom) {
  Loom.sphere = function (size, cx, cy, R, shade) {
    var oc = document.createElement("canvas"); oc.width = size; oc.height = size;
    var octx = oc.getContext("2d"), img = octx.createImageData(size, size), data = img.data;
    var out = [0, 0, 0, 255];                       // reused per pixel — no per-pixel allocation
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var dx = (x - cx) / R, dy = (y - cy) / R, r2 = dx * dx + dy * dy;
        if (r2 > 1) continue;                       // outside the disc → left transparent
        var nz = Math.sqrt(1 - r2);
        out[0] = 0; out[1] = 0; out[2] = 0; out[3] = 255;
        shade(x, y, dx, dy, nz, r2, out);
        var i = (y * size + x) * 4;
        data[i] = out[0]; data[i + 1] = out[1]; data[i + 2] = out[2]; data[i + 3] = out[3];
      }
    }
    octx.putImageData(img, 0, 0);
    return oc;
  };
})((window.Loom = window.Loom || {}));
