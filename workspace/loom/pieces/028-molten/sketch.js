// Emil's Loom · piece 028 — "Molten"
//
// A lava lake at night, seen from above: a skin of dark crust plates fractured by incandescent cracks,
// the molten rock glowing through the seams — white-hot where it's freshest, cooling through gold and
// orange to deep red to black. The WARM swing after two cool blue/violet pieces (the attractor 026 + the
// lightning 027), and a non-circular field after a run of round compositions. Drama, but slow and heavy
// instead of the lightning's instant.
//
// How: scatter blue-noise plate centres (poisson, #4 — irregular, not a grid, [[026]]), then for every
// pixel take the distance to its nearest TWO centres — where those are nearly equal you're on a plate
// boundary, i.e. a crack (the Voronoi F2−F1 edge-distance trick; Tessera #4 used cell *membership*, this
// uses the *seam*). A large-scale fbm HEAT field makes some regions fresh-hot and others old-cool; the
// crack's heat climbs a lava ramp. Rendered to a small buffer and upscaled so the cracks BLOOM — here the
// 038 "soft-field" smear is exactly right, incandescent things should glow soft. Warm vent-glows fill the
// air so it reads HOT, not like cold cracked glaze ([[045-a-luminous-subject-needs-an-environment-to-light]]).
// Composes poisson (#4) + noise (#3) + ramp (#11) + glow (#8). Static.
Loom.piece({
  id: "028",
  title: "Molten",
  seed: "caldera",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size;

    var W = Math.round(S * 0.5), H = W;           // low-res; the upscale blooms the cracks (a feature here)
    var heat = Loom.noise(rng.int(1, 999999));    // large-scale heat field — fresh-hot vs old-cool regions
    var fine = Loom.noise(rng.int(1, 999999));    // crust micro-texture + per-seam open/healed variation

    // plate centres: blue-noise so the crust reads as crust, not a lattice (026)
    var r = Math.max(16, W / 11);
    var pts = Loom.poisson(rng, W, H, r);
    var n = pts.length;
    // each plate gets an additive weight (a power/Laguerre diagram: boundary where |p-cᵢ|-wᵢ ties) so
    // plate SIZES vary — uniform poisson alone reads as a regular honeycomb; real crust is big slabs + small shards
    var wt = new Float32Array(n);
    for (var wi = 0; wi < n; wi++) wt[wi] = Math.pow(rng.range(0, 1), 1.6) * r * 0.7;

    // a spatial grid over the centres → fast nearest-two lookup (≤1 point per cell)
    var cs = r, gw = Math.ceil(W / cs), gh = Math.ceil(H / cs);
    var grid = new Array(gw * gh);
    for (var gi = 0; gi < grid.length; gi++) grid[gi] = [];
    for (var p = 0; p < n; p++) {
      var gx = Math.min(gw - 1, Math.floor(pts[p][0] / cs));
      var gy = Math.min(gh - 1, Math.floor(pts[p][1] / cs));
      grid[gy * gw + gx].push(p);
    }

    // black crust → deep red → orange → gold → white-hot
    var ramp = Loom.ramp(["#070302", "#140805", "#2a0d04", "#5c1905", "#992806", "#d6450a", "#f47512", "#ffae3a", "#ffe7b0"]);
    var col = [0, 0, 0];                             // reused by the shade (closed over)
    // the crust is a per-pixel field (lib/field.js #16 — the harvested flat field-render loop)
    var oc = Loom.field(W, function (x, y, out) {
      var cyc = Math.min(gh - 1, Math.floor(y / cs));
      var cxc = Math.min(gw - 1, Math.floor(x / cs));
      // nearest two plate centres by WEIGHTED distance (5×5 cell neighbourhood)
      var v1 = 1e9, v2 = 1e9;
      for (var yy = Math.max(0, cyc - 2); yy <= Math.min(gh - 1, cyc + 2); yy++) {
        for (var xx = Math.max(0, cxc - 2); xx <= Math.min(gw - 1, cxc + 2); xx++) {
          var bucket = grid[yy * gw + xx];
          for (var bi = 0; bi < bucket.length; bi++) {
            var id0 = bucket[bi], pp = pts[id0];
            var ddx = pp[0] - x, ddy = pp[1] - y;
            var val = Math.sqrt(ddx * ddx + ddy * ddy) - wt[id0];
            if (val < v1) { v2 = v1; v1 = val; } else if (val < v2) { v2 = val; }
          }
        }
      }
      var edge = v2 - v1;                            // ~0 on a plate boundary (a crack)

      var nx = x / W, ny = y / H;
      var hv = heat.fbm(nx * 2.2 + 5, ny * 2.2, 4, 2.0, 0.55);
      hv = Math.max(0, Math.min(1, (hv - 0.32) * 2.1));           // punchy hot/cool composition (a molten heart, cooled edges)
      var crackW = r * (0.13 + 0.22 * hv);            // hairline seams where cool, a wide molten river where hot
      var crack = 1 - Math.min(1, edge / crackW);
      crack = crack * crack;                         // sharpen the seam (hot centre, soft shoulders)
      var open = 0.35 + 0.65 * fine.fbm(nx * 4.5 + 2, ny * 4.5 + 7, 3, 2.0, 0.5);  // some seams open, some healed

      var baseHeat = hv * hv * 0.26;                 // thin crust over the hottest lava glows dull-red
      var t = baseHeat + crack * open * (0.5 + 0.5 * hv);
      t += (fine.fbm(nx * 9 + 1, ny * 9 + 3, 2, 2.0, 0.5) - 0.5) * 0.05;            // crust micro-texture
      t = Math.max(0, Math.min(1, t));

      ramp.rgb(t, col);
      // rough basalt texture on the cooled crust so the plates read as solid rock, not flat black gaps
      if (t < 0.22) {
        var rock = fine.fbm(nx * 17 + 20, ny * 17 + 4, 3, 2.0, 0.5);
        var g = (rock - 0.32) * 30 * (1 - t / 0.22); // dim grey flecks, fading as the lava rises
        if (g > 0) { col[0] += g * 0.85; col[1] += g * 0.92; col[2] += g; }
      }
      out[0] = col[0]; out[1] = col[1]; out[2] = col[2];
    });

    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    ctx.fillStyle = "#070302"; ctx.fillRect(0, 0, S, S);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(oc, 0, 0, S, S);                  // bilinear upscale → the cracks bloom

    // glowing vents: warm light blooming off the hottest upwellings, so the heat fills the air
    var scaleUp = S / W;
    for (var vp = 0; vp < n; vp++) {
      var vx = pts[vp][0], vy = pts[vp][1];
      var vh = (heat.fbm(vx / W * 2.2 + 5, vy / H * 2.2, 4, 2.0, 0.55) - 0.32) * 2.1;
      if (vh > 0.55) {
        Loom.glow(ctx, vx * scaleUp, vy * scaleUp, S * 0.11, "#ff8a1e", 0.20 * Math.min(1, vh), 0.6);
      }
    }

    // dark vignette to seat the molten field in the night
    var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S * 0.82);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(4,1,0,0.6)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
