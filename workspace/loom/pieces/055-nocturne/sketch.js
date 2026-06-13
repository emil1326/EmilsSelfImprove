// Emil's Loom · piece 055 — "Nocturne"
//
// A rainy city street at night — a lone figure under a streetlamp, the warm light pooling and smearing
// down the wet black road. A deliberate swing back to a COMPOSED SCENE with a subject and a bit of story
// (the #85 audit's watch: I'd drifted to bare renders of a phenomenon — a marble, a network — and away
// from the Aurora / eclipse-watchers register where a small figure in a world carries the soul). The HOOK
// ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]): the EMOTION — lonely-but-cosy, the glow
// in the wet dark — and a fresh register the gallery completely lacked (the first city / architecture).
//
// The CRUX ([[035-defining-feature-is-often-the-hard-part]]): the road reading as WET ASPHALT, not a lake.
// Wet asphalt smears every light DOWNWARD into broken vertical streaks (the surface is rain-pocked, not a
// mirror) — so reflections are stretched, dimmed, and rippled, drawn additively because it's light on a dark
// wet ground ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]]). Composes glow (#8) + noise (#3)
// + ramp. Lamp + window layout + figure + rain are seed-varied.
Loom.piece({
  id: "055",
  title: "Nocturne",
  seed: "midnight",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    var roadY = S * rng.range(0.55, 0.60);                 // where the wet road begins
    var bldgTop = S * rng.range(0.14, 0.22);               // tops of the shopfronts

    // ---- night sky: deep blue-black, a faint warm sodium haze low (city light-pollution) ----
    var sky = ctx.createLinearGradient(0, 0, 0, roadY);
    sky.addColorStop(0, "#070a12"); sky.addColorStop(0.7, "#0d1320"); sky.addColorStop(1, "#1c1c24");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, roadY + 1);
    // warm haze glow above the rooftops
    var haze = ctx.createLinearGradient(0, bldgTop - S * 0.12, 0, bldgTop + S * 0.04);
    haze.addColorStop(0, "rgba(0,0,0,0)"); haze.addColorStop(1, "rgba(120,84,48,0.28)");
    ctx.fillStyle = haze; ctx.fillRect(0, bldgTop - S * 0.12, S, S * 0.16);

    // ---- the back wall of shopfronts: dark blocks with lit windows (kept for the road to reflect) ----
    var lights = [];                                        // {x,y,w,h,col,intensity} — every glowing thing
    var bx = 0;
    while (bx < S) {
      var bw = rng.range(0.12, 0.22) * S;
      var bh = rng.range(0.6, 1.0) * (roadY - bldgTop);
      var by = roadY - bh;
      ctx.fillStyle = "#0a0c12"; ctx.fillRect(bx, by, bw + 1, bh);
      ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(bx, by, bw + 1, 2 * U);   // roof edge
      // windows in a loose grid
      var cols = Math.max(2, Math.round(bw / (28 * U))), rows = Math.max(2, Math.round(bh / (34 * U)));
      var mx = bw * 0.14, gw = (bw - 2 * mx) / cols, gh = (bh - 2 * mx) / rows;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        if (!rng.bool(0.5)) continue;                       // many windows dark
        var wx = bx + mx + c * gw + gw * 0.16, wy = by + mx + r * gh + gh * 0.16;
        var ww = gw * 0.68, wh = gh * 0.66;
        var warm = rng.bool(0.7);
        var col = warm ? (rng.bool(0.5) ? "#ffd07a" : "#f0a850") : (rng.bool(0.5) ? "#9cc0e0" : "#c8d8e8");
        ctx.fillStyle = col; ctx.globalAlpha = rng.range(0.55, 0.9);
        ctx.fillRect(wx, wy, ww, wh); ctx.globalAlpha = 1;
        lights.push({ x: wx + ww / 2, y: wy + wh, w: ww, col: col, intensity: warm ? 0.5 : 0.35 });
      }
      bx += bw + 1;                                         // advance to the next shopfront (don't loop forever)
    }
    // atmospheric haze over the city — pushes the buildings back so the lamp + figure are the focus
    var cityHaze = ctx.createLinearGradient(0, bldgTop - S * 0.02, 0, roadY);
    cityHaze.addColorStop(0, "rgba(22,28,42,0.55)"); cityHaze.addColorStop(1, "rgba(15,19,28,0.12)");
    ctx.fillStyle = cityHaze; ctx.fillRect(0, bldgTop - S * 0.02, S, roadY - bldgTop + S * 0.02);

    // ---- the streetlamp ----
    var lampX = S * rng.range(0.28, 0.42), lampHeadY = bldgTop + S * rng.range(0.02, 0.08);
    var lampCol = "#ffca74";
    ctx.strokeStyle = "#13151c"; ctx.lineWidth = 3 * U;     // pole
    ctx.beginPath(); ctx.moveTo(lampX, roadY); ctx.lineTo(lampX, lampHeadY + 6 * U); ctx.stroke();
    ctx.fillStyle = "#15171e"; ctx.beginPath();             // lamp housing
    ctx.ellipse(lampX, lampHeadY, 8 * U, 11 * U, 0, 0, 6.2832); ctx.fill();
    Loom.glow(ctx, lampX, lampHeadY + 2 * U, 96 * U, lampCol, 0.95, 0.42);   // the warm halo
    ctx.fillStyle = "#fff0d0"; ctx.beginPath(); ctx.arc(lampX, lampHeadY + 2 * U, 4 * U, 0, 6.2832); ctx.fill();  // hot bulb
    lights.push({ x: lampX, y: lampHeadY + 2 * U, w: 14 * U, col: lampCol, intensity: 1.0, lamp: true });

    // ---- the WET ROAD ----
    var road = ctx.createLinearGradient(0, roadY, 0, S);
    road.addColorStop(0, "#181a22"); road.addColorStop(0.5, "#101218"); road.addColorStop(1, "#0a0b10");
    ctx.fillStyle = road; ctx.fillRect(0, roadY, S, S - roadY);

    // reflections: smear each light DOWN the road as a stretched, dimmed, rippled streak (additive)
    ctx.save(); ctx.beginPath(); ctx.rect(0, roadY, S, S - roadY); ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < lights.length; i++) {
      var L = lights[i];
      var depth = (roadY - L.y);                            // how high the light sits = how long it streaks
      var len = clamp(depth * (L.lamp ? 1.05 : 0.5) + 14 * U, 0, (S - roadY) * 0.82);
      var steps = Math.round(len / (3 * U));
      for (var s = 0; s < steps; s++) {
        var t = s / steps;                                  // 0 at road edge → 1 at end of streak
        var ry = roadY + t * len;
        var fall = (1 - t) * (1 - t);                       // fade down
        var rip = clamp(nz.fbm(L.x * 0.05, ry * 0.22 + i, 2, 2, 0.5) * 1.7 - 0.35, 0, 1);  // rain-broken
        var a = L.intensity * fall * rip * 0.55;
        if (a < 0.01) continue;
        var wob = (nz.fbm(ry * 0.08 + i * 3, 5, 2, 2, 0.5) - 0.5) * 8 * U * t;  // horizontal wobble
        var rw = L.w * (0.5 + t * 1.6);                     // widen with depth
        ctx.globalAlpha = a;
        ctx.fillStyle = L.col;
        ctx.fillRect(L.x - rw / 2 + wob, ry, rw, 3 * U);
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.restore();

    // ---- the lamp pools warm light on the wet ground ----
    ctx.save(); ctx.beginPath(); ctx.rect(0, roadY, S, S - roadY); ctx.clip();
    Loom.glow(ctx, lampX, roadY + 6 * U, 165 * U, lampCol, 0.5, 0.5);
    ctx.restore();

    // ---- volumetric light: a soft warm cone hanging in the rainy air under the lamp ----
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.filter = "blur(" + (8 * U) + "px)";  // soft edges, not a hard wedge
    var coneBot = roadY + (S - roadY) * 0.45;
    var cone = ctx.createLinearGradient(0, lampHeadY, 0, coneBot);
    cone.addColorStop(0, Loom.rgba(lampCol, 0.24)); cone.addColorStop(1, Loom.rgba(lampCol, 0));
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(lampX - 13 * U, lampHeadY); ctx.lineTo(lampX + 13 * U, lampHeadY);
    ctx.lineTo(lampX + 150 * U, coneBot); ctx.lineTo(lampX - 150 * U, coneBot);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    // ---- the figure: a lone silhouette under an umbrella, near the lamp's pool (the soul) ----
    var dark = "#070809";
    var figSide = rng.bool(0.5) ? 1 : -1;                   // which side of the lamp the figure stands
    var figX = clamp(lampX + figSide * S * rng.range(0.10, 0.15), S * 0.16, S * 0.54);
    var fh = S * rng.range(0.2, 0.24);
    var lampSide = lampX >= figX ? 1 : -1;                  // rim-light side (toward the lamp)

    function figureShapes(fx, footY, h, color) {
      ctx.fillStyle = color;
      var legH = h * 0.46, torsoH = h * 0.32, headR = h * 0.066, hipW = h * 0.052, shW = h * 0.12;
      ctx.beginPath();                                       // legs (a small stride)
      ctx.moveTo(fx - hipW * 1.7, footY); ctx.lineTo(fx - hipW * 0.5, footY - legH); ctx.lineTo(fx - hipW * 0.05, footY - legH); ctx.lineTo(fx - hipW * 0.1, footY); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fx + hipW * 1.4, footY); ctx.lineTo(fx + hipW * 0.6, footY - legH); ctx.lineTo(fx + hipW * 0.1, footY - legH); ctx.lineTo(fx + hipW * 0.15, footY); ctx.closePath(); ctx.fill();
      var ty = footY - legH;                                 // torso / coat (slightly flared hem)
      ctx.beginPath();
      ctx.moveTo(fx - hipW * 1.5, ty + 2); ctx.lineTo(fx - shW, ty - torsoH); ctx.lineTo(fx + shW, ty - torsoH); ctx.lineTo(fx + hipW * 1.5, ty + 2); ctx.closePath(); ctx.fill();
      var hy = ty - torsoH - headR * 0.7;                    // head
      ctx.beginPath(); ctx.arc(fx, hy, headR, 0, 6.2832); ctx.fill();
      var uy = hy - headR - h * 0.06, cw = h * 0.34;         // umbrella: stem + a shallow scalloped dome
      ctx.lineWidth = 2 * U; ctx.strokeStyle = color;
      ctx.beginPath(); ctx.moveTo(fx + shW * 0.3, hy - headR * 0.2); ctx.lineTo(fx + cw * 0.16, uy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx - cw, uy);
      ctx.quadraticCurveTo(fx, uy - h * 0.13, fx + cw, uy);
      ctx.quadraticCurveTo(fx + cw * 0.55, uy + h * 0.035, fx + cw * 0.2, uy + h * 0.005);
      ctx.quadraticCurveTo(fx, uy + h * 0.05, fx - cw * 0.2, uy + h * 0.005);
      ctx.quadraticCurveTo(fx - cw * 0.55, uy + h * 0.035, fx - cw, uy); ctx.closePath(); ctx.fill();
    }

    // reflection of the figure in the wet road (flipped, stretched, dark, faint, clipped to the road)
    ctx.save(); ctx.beginPath(); ctx.rect(0, roadY, S, S - roadY); ctx.clip();
    ctx.globalAlpha = 0.4; ctx.translate(0, roadY); ctx.scale(1, -1.25); ctx.translate(0, -roadY);
    figureShapes(figX, roadY, fh, dark);
    ctx.restore();

    // the figure: a warm rim (an offset duplicate peeking out toward the lamp) under the dark silhouette
    figureShapes(figX - lampSide * 1.8 * U, roadY - 0.6 * U, fh, "rgba(255,201,118,0.6)");
    figureShapes(figX, roadY, fh, dark);

    // ---- rain: diagonal streaks, warm and bright where the lamp catches them, cool and faint elsewhere ----
    var ang = rng.range(-0.16, -0.10), rdx = Math.sin(ang), rdy = Math.cos(ang);
    var lampMidY = (lampHeadY + roadY) * 0.5;
    var nDrops = Math.round(520 * U);
    for (var d = 0; d < nDrops; d++) {
      var rx = rng.range(-S * 0.05, S * 1.05), ry = rng.range(0, S);
      var rl = rng.range(9, 26) * U;
      var dl = Math.sqrt((rx - lampX) * (rx - lampX) + (ry - lampMidY) * (ry - lampMidY));
      var lit = clamp(1 - dl / (S * 0.3), 0, 1); lit = lit * lit;
      var a = rng.range(0.03, 0.08) + lit * 0.30;
      var cr = Math.round(176 + lit * 79), cg = Math.round(196 + lit * 40), cb = Math.round(228 - lit * 30);
      ctx.strokeStyle = "rgba(" + cr + "," + cg + "," + cb + "," + a + ")";
      ctx.lineWidth = rng.range(0.6, 1.25) * U;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + rdx * rl, ry + rdy * rl); ctx.stroke();
    }

    // ---- a soft vignette ----
    var vg = ctx.createRadialGradient(S * 0.5, roadY, S * 0.3, S * 0.5, roadY, S * 0.75);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(2,3,6,0.55)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
