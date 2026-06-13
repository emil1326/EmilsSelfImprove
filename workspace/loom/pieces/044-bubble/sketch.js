// Emil's Loom · piece 044 — "Lustre"
//
// A single soap bubble, drifting — its skin swirling with thin-film iridescence, that oil-slick rainbow
// where the film's varying thickness splits the light into bands (Newton's series: silver, straw, magenta,
// violet, blue, cyan, green, cycling). A non-creature, object/phenomenon piece after a run of living things,
// and a DISTINCT iridescence from the peacock/hummingbird (structural patches) — this is the whole surface
// flowing with full-spectrum colour. The HOOK is the swirl ([[035-defining-feature-is-often-the-hard-part]]):
// a flat rainbow gradient is a marble; bands that wrap the sphere, compress at the rim, and drain thin at
// the top are a *bubble*.
//
// The film is a numeric field ([[038-render-fields-numerically-then-upscale]]): a swirling thickness (a
// gravity gradient + domain-warped noise) mapped through a CYCLIC colour ramp, with Fresnel (more colour at
// the grazing rim, transparent at the thin centre — you see the soft world through it). Composes ramp (#11,
// the thin-film cycle) + noise (#3, the swirl) + glow (#8, the rim + highlight). Static. Judged across
// several seeds ([[058-random-features-form-accidental-faces-check-many-seeds]]).
Loom.piece({
  id: "044",
  title: "Lustre",
  seed: "froth",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));
    // a cyclic thin-film ramp (first == last so it tiles seamlessly)
    var film = Loom.ramp(["#d2ccc0", "#e2d076", "#ec6a78", "#d048a4", "#6a5ad8", "#34a6cc", "#3ab892", "#a8d25a", "#e2d076", "#d2ccc0"]);

    // ---- a soft, dim room so the iridescence glows ----
    var bg = ctx.createLinearGradient(0, 0, 0, S);
    bg.addColorStop(0, "#1a2230"); bg.addColorStop(0.55, "#141a26"); bg.addColorStop(1, "#0c1019");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0, nb = Math.round(20 * U); i < nb; i++) {
      var bxk = rng.range(0, 1) * S, byk = rng.range(0, 1) * S, brd = rng.range(0.05, 0.14) * S;
      var g = ctx.createRadialGradient(bxk, byk, 0, bxk, byk, brd);
      var hh = rng.pick(["#5a6a90", "#8a7a6a", "#6a8a80"]);
      g.addColorStop(0, Loom.rgba(hh, rng.range(0.04, 0.1))); g.addColorStop(1, Loom.rgba(hh, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bxk, byk, brd, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    var cx = S * (0.5 + rng.range(-0.05, 0.05)), cy = S * (0.47 + rng.range(-0.04, 0.04)), R = S * rng.range(0.3, 0.35);
    var lightA = rng.range(-2.4, -1.9);                          // light direction (upper-left-ish)
    var swirl = rng.range(0, TAU), grav = rng.range(1.3, 1.9);

    // ---- the thin-film skin: a numeric field over the sphere ----
    var FW = Math.round(S * 0.6), oc = document.createElement("canvas"); oc.width = FW; oc.height = FW;
    var octx = oc.getContext("2d"), img = octx.createImageData(FW, FW), data = img.data, col = [0, 0, 0];
    var sc = S / FW, csw = Math.cos(swirl), ssw = Math.sin(swirl);
    for (var by = 0; by < FW; by++) {
      for (var bx = 0; bx < FW; bx++) {
        var X = bx * sc, Y = by * sc, dx = (X - cx) / R, dy = (Y - cy) / R, r2 = dx * dx + dy * dy;
        var idx = (by * FW + bx) * 4;
        if (r2 > 1) continue;
        var nzs = Math.sqrt(1 - r2);                            // surface normal z (1 centre → 0 rim)
        var fres = Math.pow(1 - nzs, 1.5);                      // grazing → more colour
        var st = clamp(1 / Math.max(0.32, nzs), 1, 3.1);        // foreshorten: bands compress toward the rim
        var wx = (dx * csw - dy * ssw) * st, wy = (dx * ssw + dy * csw) * st;
        var warp = nz.fbm(wx * 1.5 + 5, wy * 1.5 + 5, 4, 2.0, 0.55) - 0.5;
        var thick = (dy + 1.1) * grav + warp * 2.6 + nz.fbm(wx * 3.2 + 11, wy * 3.2 + 11, 2, 2.0, 0.5) * 0.9;
        var tc = thick - Math.floor(thick);                    // cyclic 0..1
        film.rgb(tc, col);
        // alpha: thin/transparent at the top-centre (the draining cap), colourful toward the rim
        var topThin = clamp(0.5 - dy * 0.55, 0, 1);            // dy<0 = upper → thinner
        var a = clamp((0.22 + fres * 0.72) * (1 - topThin * 0.55) * (0.6 + 0.5 * nz.fbm(wx * 2 + 20, wy * 2 + 20, 2, 2, 0.5)), 0, 0.95);
        data[idx] = col[0]; data[idx + 1] = col[1]; data[idx + 2] = col[2]; data[idx + 3] = (a * 255) | 0;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(oc, 0, 0, S, S);

    // ---- soft spherical form: a faint shade so it reads as a globe, not a disc ----
    var form = ctx.createRadialGradient(cx + Math.cos(lightA) * R * 0.4, cy + Math.sin(lightA) * R * 0.4, R * 0.1, cx, cy, R);
    form.addColorStop(0, "rgba(255,255,255,0.06)"); form.addColorStop(0.7, "rgba(0,0,0,0)"); form.addColorStop(1, "rgba(0,0,10,0.22)");
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip(); ctx.fillStyle = form; ctx.fillRect(0, 0, S, S); ctx.restore();

    // ---- the bright iridescent rim (the film catches light all the way round) ----
    ctx.globalCompositeOperation = "lighter";
    var rim = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.01);
    rim.addColorStop(0, "rgba(255,255,255,0)"); rim.addColorStop(0.8, "rgba(220,235,255,0)"); rim.addColorStop(0.95, "rgba(230,240,255,0.5)"); rim.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(cx, cy, R * 1.01, 0, TAU); ctx.fill();

    // ---- the specular highlight: a soft window reflection on the upper-left ----
    var hx = cx + Math.cos(lightA) * R * 0.5, hy = cy + Math.sin(lightA) * R * 0.5;
    Loom.glow(ctx, hx, hy, R * 0.38, "#ffffff", 0.45, 0.55);     // the soft specular bloom
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
    for (var w = 0; w < 4; w++) {                                // a soft, curved window reflection (not hard panes)
      var wxp = hx - R * 0.065 + (w % 2) * R * 0.13, wyp = hy - R * 0.065 + ((w / 2) | 0) * R * 0.13;
      Loom.glow(ctx, wxp, wyp, R * 0.075, "#ffffff", 0.75, 0.42);
    }
    ctx.restore();
    // a tiny bright kiss at the very top + a soft overall bloom
    Loom.glow(ctx, cx, cy, R * 1.25, "#9ab0d0", 0.1, 0.6);

    // ---- a couple of small companion bubbles drifting ----
    for (i = 0; i < rng.int(1, 3); i++) {
      var sr = R * rng.range(0.08, 0.2), sxx = cx + rng.range(-1.4, 1.4) * R, syy = cy + rng.range(-1.3, 1.4) * R;
      if (Math.hypot(sxx - cx, syy - cy) < R + sr * 1.5) continue;
      // additive only → a transparent bubble (rim + highlight + faint iridescent sheen), not a dark ball
      ctx.globalCompositeOperation = "lighter";
      var sf = ctx.createRadialGradient(sxx, syy, sr * 0.2, sxx, syy, sr);
      sf.addColorStop(0, Loom.rgba(film.css(rng.next()), 0)); sf.addColorStop(0.78, Loom.rgba(film.css(rng.next()), 0.07)); sf.addColorStop(0.95, "rgba(208,228,255,0.32)"); sf.addColorStop(1, "rgba(208,228,255,0)");
      ctx.fillStyle = sf; ctx.beginPath(); ctx.arc(sxx, syy, sr, 0, TAU); ctx.fill();
      Loom.glow(ctx, sxx - sr * 0.32, syy - sr * 0.34, sr * 0.42, "#ffffff", 0.7, 0.4);
      ctx.strokeStyle = "rgba(220,235,255,0.4)"; ctx.lineWidth = 1.2 * U; ctx.beginPath(); ctx.arc(sxx, syy, sr * 0.97, 0, TAU); ctx.stroke();
    }

    // ---- settle it ----
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(cx, cy, R * 0.9, S * 0.5, S * 0.5, S * 0.82);
    vg.addColorStop(0, "rgba(8,10,18,0)"); vg.addColorStop(1, "rgba(6,8,14,0.62)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
