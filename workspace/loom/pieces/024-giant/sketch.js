// Emil's Loom · piece 024 — "Giant"
//
// A ringed gas giant hanging in the dark: banded, turbulent clouds lit from one side into a soft
// terminator, a delicate ring system passing behind and in front, the planet's shadow falling across
// it, a scatter of stars. The first time the Loom leaves Earth — vast, serene, a held Voyager moment.
//
// The discriminator (035 again): it must read as a LIT 3D SPHERE, not a striped disc. So the cloud
// bands are mapped to LATITUDE on the sphere (compressing toward the poles) and the turbulence to
// (longitude, latitude) so it foreshortens at the limb; the surface is shaded by one light (diffuse
// N·L) into a bright limb, a soft terminator, and a near-black night side. The bands are SOFT, so the
// planet is rendered to a low-res ImageData and upscaled ([[038-render-fields-numerically-then-upscale]]
// — the soft-field case, NOT the iris's crisp one). The rings sell the 3D by occlusion: the far half
// is drawn behind the planet, the near half over it. Composes ramp (band colour) + noise (turbulence)
// + glow (stars). Static — space holds still.
Loom.piece({
  id: "024",
  title: "Giant",
  seed: "jovian",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853, PI = Math.PI;
    var px = S * 0.55, py = S * 0.47, R = S * 0.32;          // planet centre + radius (off-centre)
    var tilt = 0.42;                                          // axial tilt toward the viewer (~24°)
    var ct = Math.cos(tilt), st = Math.sin(tilt);
    // sun direction (upper-left, slightly toward us), normalised
    var L = (function (a, b, c) { var m = Math.hypot(a, b, c); return [a / m, b / m, c / m]; })(-0.62, -0.36, 0.70);

    var turbN = Loom.noise(rng.int(0, 1e9));                  // band waver (domain warp)
    var cloudN = Loom.noise(rng.int(0, 1e9));                 // fine cloud detail
    var band = Loom.ramp(["#6f4126", "#b07a44", "#dcc193", "#f1e8cf"]);  // rust belt -> cream zone
    var storm = [179, 74, 46];                                // a Great-Red-Spot rust oval
    var stormLat = rng.range(-0.45, -0.2), stormLon = rng.range(-0.6, 0.6), stormR = rng.range(0.42, 0.6);

    function lerp3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function smooth(a, b, x) { x = (x - a) / (b - a); x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }

    // ---- the planet, rendered numerically into a low-res offscreen, then upscaled ----
    function renderPlanet() {
      var OS = Math.round(2 * R * 0.62), oc = document.createElement("canvas"); oc.width = OS; oc.height = OS;
      var o = oc.getContext("2d"), img = o.createImageData(OS, OS), data = img.data, bc = [0, 0, 0];
      for (var oy = 0; oy < OS; oy++) {
        for (var ox = 0; ox < OS; ox++) {
          var nx = (ox + 0.5) / OS * 2 - 1, ny = (oy + 0.5) / OS * 2 - 1, rr2 = nx * nx + ny * ny, idx = (oy * OS + ox) * 4;
          if (rr2 > 1) { data[idx + 3] = 0; continue; }        // outside the disc → space
          var nz = Math.sqrt(1 - rr2);
          // sphere mapping: pole = (0, -ct, st)
          var lat = Math.asin(Math.max(-1, Math.min(1, ny * -ct + nz * st)));
          var lon = Math.atan2(nx, ny * st + nz * ct);    // 0 at the sub-observer point → seam hidden at the back
          // banded clouds, wavering with turbulence; mapped to lat/lon so they foreshorten at the limb
          var clon = Math.cos(lon), slon = Math.sin(lon);   // seamless longitude (no antimeridian seam)
          var warp = turbN.fbm(clon * 2.0, slon * 2.0 + lat * 1.6, 3);
          var poleFade = Math.cos(lat); poleFade *= poleFade;   // strong fade toward the poles (smooth polar cap)
          var bandAmp = 0.5 * (0.16 + 0.84 * poleFade);
          var bv = 0.5 + bandAmp * Math.sin(lat * 8.0 + (warp - 0.5) * 2.4 + slon * 0.25);  // +slon breaks the mirror seam
          band.rgb(bv, bc);
          var detail = 1 + (cloudN.fbm(clon * 4.2 + 9, slon * 4.2 + lat * 3, 4) - 0.5) * 0.62 * (0.28 + 0.72 * poleFade);
          var R0 = bc[0] * detail, G0 = bc[1] * detail, B0 = bc[2] * detail;
          // the storm oval (in lon/lat space)
          var dlon = lon - stormLon; if (dlon > PI) dlon -= TAU; else if (dlon < -PI) dlon += TAU;
          var sd = (dlon * dlon) / (stormR * stormR) + ((lat - stormLat) * (lat - stormLat)) / (0.15 * 0.15);
          if (sd < 1) { var sf = (1 - sd) * 0.85; R0 += (storm[0] - R0) * sf; G0 += (storm[1] - G0) * sf; B0 += (storm[2] - B0) * sf; }
          // lighting: one sun → bright limb, soft terminator, near-black night; mild limb-darkening
          var diff = nx * L[0] + ny * L[1] + nz * L[2];
          var light = 0.06 + smooth(-0.12, 0.32, diff) * 1.12;   // soft terminator (no hard kink)
          light *= (0.62 + 0.38 * nz);                            // mild limb-darkening
          data[idx] = R0 * light; data[idx + 1] = G0 * light; data[idx + 2] = B0 * light; data[idx + 3] = 255;
        }
      }
      o.putImageData(img, 0, 0);
      return oc;
    }
    var planetC = renderPlanet();

    // ---- the rings: concentric bands; far half drawn behind the planet, near half over it ----
    var ringBands = [
      { i: 1.20, o: 1.34, a: 0.22, c: "#b9a888" },   // faint inner (C) ring
      { i: 1.36, o: 1.70, a: 0.88, c: "#e9ddc2" },   // bright (B) ring
      { i: 1.76, o: 2.05, a: 0.55, c: "#ccb990" },   // outer (A) ring
      { i: 2.10, o: 2.13, a: 0.7, c: "#f0e8d4" }     // thin outer ringlet
    ];
    function drawRings(mode) {
      ctx.save();
      if (mode === "front") {                 // the near half, re-drawn only OVER the planet's lower disc
        ctx.beginPath(); ctx.rect(0, py, S, S - py); ctx.clip();
        ctx.beginPath(); ctx.arc(px, py, R * 0.998, 0, TAU); ctx.clip();
      }                                         // "full" = no clip: the whole ring, behind the planet
      ctx.globalCompositeOperation = "source-over";
      for (var i = 0; i < ringBands.length; i++) {
        var b = ringBands[i];
        ctx.globalAlpha = b.a; ctx.fillStyle = b.c;
        ctx.beginPath();
        ctx.ellipse(px, py, b.o * R, b.o * R * st, 0, 0, TAU);
        ctx.ellipse(px, py, b.i * R, b.i * R * st, 0, 0, TAU, true);   // the gap
        ctx.fill("evenodd");
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // the planet's shadow falling across the rings on the anti-sun side — the iconic Saturn detail
    function drawRingShadow() {
      var asx = -L[0], asy = -L[1], am = Math.hypot(asx, asy); asx /= am; asy /= am;   // anti-sun, screen
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(px, py, 2.13 * R, 2.13 * R * st, 0, 0, TAU);
      ctx.ellipse(px, py, 1.18 * R, 1.18 * R * st, 0, 0, TAU, true);
      ctx.clip("evenodd");                                       // only on the ring annulus, never the planet
      // a soft dark band along the anti-sun direction, sheared into the (squashed) ring plane
      ctx.translate(px, py); ctx.rotate(Math.atan2(asy * st, asx));
      var hw = R * 0.6;
      var g = ctx.createLinearGradient(0, -hw, 0, hw);
      g.addColorStop(0, "rgba(3,4,8,0)"); g.addColorStop(0.5, "rgba(3,4,8,0.66)"); g.addColorStop(1, "rgba(3,4,8,0)");
      ctx.fillStyle = g; ctx.fillRect(0, -hw, 3.2 * R, 2 * hw);
      ctx.restore();
    }

    function paint() {
      // 1. deep space + a faint nebula wash
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.fillStyle = "#05060a"; ctx.fillRect(0, 0, S, S);
      var neb = ctx.createRadialGradient(S * 0.3, S * 0.7, 0, S * 0.3, S * 0.7, S * 0.7);
      neb.addColorStop(0, "rgba(40,40,70,0.18)"); neb.addColorStop(1, "rgba(40,40,70,0)");
      ctx.fillStyle = neb; ctx.fillRect(0, 0, S, S);
      // 2. stars
      var starN = rng.int(0, 1e9), srng = new Loom.RNG(starN);
      for (var i = 0, ns = Math.round(420 * (S / 760)); i < ns; i++) {
        var sx = srng.range(0, 1) * S, sy = srng.range(0, 1) * S, mag = srng.next();
        var sr = (mag < 0.92 ? srng.range(0.3, 1.0) : srng.range(1.1, 2.0)) * U;
        ctx.globalAlpha = 0.25 + mag * 0.7;
        ctx.fillStyle = srng.bool(0.1) ? "#cdd8ff" : srng.bool(0.15) ? "#ffe8cc" : "#ffffff";
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
        if (mag > 0.985) Loom.glow(ctx, sx, sy, sr * 7, "#ffffff", 0.35, 0.5);
      }
      ctx.globalAlpha = 1;
      // 3. the rings: the whole ring behind the planet
      drawRings("full");
      // 4. the planet
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(planetC, px - R, py - R, 2 * R, 2 * R);
      // a thin lit-limb atmosphere glow on the sunward edge
      ctx.globalCompositeOperation = "lighter";
      Loom.glow(ctx, px + L[0] * R * 0.7, py + L[1] * R * 0.7, R * 1.5, "#a9c4e8", 0.1, 0.6);
      ctx.globalCompositeOperation = "source-over";
      // 5. the rings: near half re-drawn over the planet's lower disc
      drawRings("front");
      // 5b. the planet's shadow across the rings (soft, anti-sun)
      drawRingShadow();
      // 6. a soft vignette
      var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.4, S / 2, S / 2, S * 0.82);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
    }

    paint();   // STAGE 1 — planet + stars only, to verify the sphere reads before adding rings.
  }
});
