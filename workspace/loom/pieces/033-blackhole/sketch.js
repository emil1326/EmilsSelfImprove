// Emil's Loom · piece 033 — "Maw"
//
// A black hole: the event-horizon shadow ringed by a blazing accretion disk, and — the HOOK — the disk's
// far side bent up and OVER the top by gravity, with a near-white photon ring hugging the dark. The bold,
// dramatic, awe register the gallery had drifted away from (the #55 audit: I hadn't reached for drama
// since Strike #47). Aimed at the FELT awe, not a cold technical render ([[049-technical-pride-mispredicts-aim-for-the-aesthetic-oh]]):
// the gas giant (024) landed a 3 because a shaded sphere is neutral/familiar — a black hole is the
// opposite, all drama, and the lensing is genuinely SURPRISING.
//
// The whole read lives in the lensing ([[035-defining-feature-is-often-the-hard-part]]): WITHOUT the
// over-the-top arc + photon ring it's just a ringed disc (the Giant trap); WITH them it's unmistakably a
// black hole. On a dark ground luminosity is additive ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]]),
// and the disk's hot gradient is ONE layer where it's saturated so it doesn't wash to white ([[051-stacking-additive-glows-desaturates-to-white]]).
// Composes ramp (#11, the hot disk) + noise (#3, turbulence + stars) + glow (#8, the bloom). Static.
Loom.piece({
  id: "033",
  title: "Maw",
  seed: "gargantua",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var cx = S * 0.5, cy = S * 0.49, R = S * 0.125;          // hole centre + event-horizon radius
    var nz = Loom.noise(rng.int(1, 999999));
    var hot = Loom.ramp(["#1a0a04", "#5a1804", "#c03808", "#f0801e", "#ffc25a", "#fff0c4", "#ffffff"]);

    // ---- deep space + a warped starfield ----
    ctx.fillStyle = "#04040a"; ctx.fillRect(0, 0, S, S);
    var nStars = Math.round(360 * U);
    for (var i = 0; i < nStars; i++) {
      var stx = rng.range(0, 1) * S, sty = rng.range(0, 1) * S;
      var dxh = stx - cx, dyh = sty - cy, dh = Math.hypot(dxh, dyh);
      if (dh < R * 1.15) continue;                           // no stars inside the shadow
      // gentle gravitational displacement: stars near the hole get pulled toward it a touch
      if (dh < R * 4) { var pull = (R * 4 - dh) / (R * 4) * R * 0.5; stx -= dxh / dh * pull; sty -= dyh / dh * pull; }
      var br = rng.range(0, 1), sr = (0.4 + br * 1.4) * U;
      ctx.fillStyle = "rgba(" + (210 + br * 45 | 0) + "," + (215 + br * 40 | 0) + ",255," + (0.3 + br * 0.6).toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(stx, sty, sr, 0, TAU); ctx.fill();
    }

    // ---- the disk, drawn numerically so the hot gradient + turbulence + Doppler read on one buffer ----
    // The disk is a thin plane seen near edge-on (tilted), so on screen it's a very flattened ellipse.
    // Lensing: the FAR half is lifted into an arc OVER the top of the shadow; the NEAR half passes in front.
    var W = Math.round(S * 0.7), H = W, oc = document.createElement("canvas"); oc.width = W; oc.height = H;
    var octx = oc.getContext("2d"), img = octx.createImageData(W, H), data = img.data, col = [0, 0, 0];
    var ocx = W * 0.5, ocy = H * 0.5, oR = R;                // buffer draws 1:1 to screen, so oR = the shadow radius
    var flat = 0.28;                                         // vertical squash of the disk plane (edge-on-ish)
    var inner = oR * 1.08, outer = oR * 2.65;               // inner edge just OUTSIDE the shadow so the hot edge shows
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var dx = x - ocx, dy = (y - ocy) / flat;             // un-squash → disk plane coords
        var rr = Math.hypot(dx, dy);
        var idx = (y * W + x) * 4;
        if (rr < inner || rr > outer) continue;              // only the disk annulus
        var ang = Math.atan2(dy, dx);
        // radial falloff: white-hot at the inner edge → dark at the outer
        var radial = 1 - (rr - inner) / (outer - inner);
        radial = Math.pow(Math.max(0, radial), 1.4);
        // turbulence streaks along the orbit (sample noise on a circle in (angle) × radius, so it swirls)
        var turb = nz.fbm(Math.cos(ang) * 2.6 + 3, Math.sin(ang) * 2.6 + (rr / oR) * 2.6, 5, 2.0, 0.55);
        var v = radial * (0.42 + turb * 1.0);
        // Doppler beaming: the side rotating toward us (left, ang≈PI) brighter; receding (right) dimmer
        var dop = 0.6 + 0.55 * Math.cos(ang);                // bright left, dim right  (cos PI = -1 → dim... flip)
        dop = 1.15 - 0.55 * Math.cos(ang);                   // bright on the left (ang≈±PI → cos=-1 → 1.7), dim right
        v *= dop;
        v = Math.max(0, Math.min(1, v));
        if (v < 0.02) continue;
        hot.rgb(v, col);
        var a = Math.min(255, v * 320) | 0;                  // alpha so faint disk is translucent over stars
        data[idx] = col[0]; data[idx + 1] = col[1]; data[idx + 2] = col[2]; data[idx + 3] = a;
      }
    }
    octx.putImageData(img, 0, 0);

    // ---- composite, additively (the disk emits light), black hole drawn LAST = a pure void, no seam ----
    ctx.globalCompositeOperation = "lighter";
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";

    // (a) the accretion disk plane — a flattened hot band reaching out to the sides
    ctx.drawImage(oc, cx - W * 0.5, cy - H * 0.5, W, H);

    // (b) the LENSED ring (THE HOOK): the disk's far side bent up OVER the top + under the bottom by gravity,
    //     a hot ring wrapping the shadow — without it this is just a ringed disc (the Giant trap)
    var lr = ctx.createRadialGradient(cx, cy, R * 0.99, cx, cy, R * 1.78);
    lr.addColorStop(0, "rgba(255,150,52,0)");
    lr.addColorStop(0.16, "rgba(255,178,82,0.78)");
    lr.addColorStop(0.42, "rgba(240,120,32,0.36)");
    lr.addColorStop(1, "rgba(200,70,16,0)");
    ctx.fillStyle = lr; ctx.beginPath(); ctx.arc(cx, cy, R * 1.78, 0, TAU); ctx.fill();

    // (c) the photon ring: a thin near-white ring right at the edge (light orbiting the hole)
    var pr = ctx.createRadialGradient(cx, cy, R * 0.97, cx, cy, R * 1.22);
    pr.addColorStop(0, "rgba(255,255,255,0)");
    pr.addColorStop(0.5, "rgba(255,249,232,0.98)");
    pr.addColorStop(0.64, "rgba(255,214,150,0.6)");
    pr.addColorStop(1, "rgba(255,180,90,0)");
    ctx.fillStyle = pr; ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, TAU); ctx.fill();

    // (d) a soft outer bloom so it blazes
    Loom.glow(ctx, cx, cy, R * 3.4, "#e8842a", 0.16, 0.62);

    // (e) the event-horizon shadow LAST: pure black, covering any additive bleed inside the ring → a real void
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000000";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();

    // ---- a gentle vignette to seat it in the void ----
    var vg = ctx.createRadialGradient(cx, cy, S * 0.32, cx, cy, S * 0.78);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,4,0.6)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
