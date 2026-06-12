// Emil's Loom · piece 027 — "Strike"
//
// A great forking bolt of lightning across a storm sky, the clouds lit from within, a dark earth far
// below for scale. The BOLD swing after the cool abstract attractor (026): drama and raw power, a moment
// caught as a still — lightning IS an instant, so a static frame is honest to it. Glow-on-dark is the
// register I'm strongest in ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]]).
//
// The crux is the bolt reading as real LIGHTNING and not a white zigzag ([[035-defining-feature-is-often-the-hard-part]]):
//   1. a recursive MIDPOINT-DISPLACEMENT channel (jagged at every scale) with subordinate forks that
//      branch downward, thinner + dimmer than the main channel (real bolts have one clear channel);
//   2. drawn as a wide additive GLOW halo (which lights the clouds it passes through) with a thin
//      near-white hot CORE on top — the core+halo+cloud-illumination is what says "lit", per 037;
//   3. the storm clouds are a numeric fbm field rendered small + upscaled (soft field, 038), dark and
//      saturated so the bolt's light has somewhere to bloom against.
// Composes glow (#8) + noise (#3) + ramp (#11). Static.
Loom.piece({
  id: "027",
  title: "Strike",
  seed: "tempest",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size;
    var horizon = S * 0.82;

    // ---------- 1. storm sky: numeric fbm clouds, rendered small then upscaled (038) ----------
    var nz = Loom.noise(rng.int(1, 999999));
    var W = Math.round(S * 0.6), H = W;
    // dark base climbing to a visible storm-violet so cloud masses pull clear of the near-black gaps
    var sky = Loom.ramp(["#04050c", "#0a0b18", "#13152b", "#20223f", "#30335e", "#474c84"]);
    var oc = document.createElement("canvas"); oc.width = W; oc.height = H;
    var o = oc.getContext("2d");
    var img = o.createImageData(W, H), data = img.data, col = [0, 0, 0];
    for (var j = 0; j < H; j++) {
      var ny = j / H;
      // a dense cloud bank up top, thinning to a dim rain-haze base near the horizon
      var band = ny < 0.62 ? (0.55 + 0.45 * (1 - ny / 0.62)) : Math.max(0.18, 0.55 - (ny - 0.62) * 1.4);
      for (var i = 0; i < W; i++) {
        var nx = i / W;
        var c = nz.fbm(nx * 2.7 + 11, ny * 2.9, 6, 2.0, 0.56);
        var detail = nz.fbm(nx * 6.2 + 4, ny * 6.2 + 9, 4, 2.0, 0.5);
        c = c * 0.62 + detail * 0.38;
        c = c * c * 1.8;                                  // contrast — billowing masses, not a flat wash
        var t = Math.max(0, Math.min(1, c * band + 0.03));
        sky.rgb(t, col);
        var idx = (j * W + i) * 4;
        data[idx] = col[0]; data[idx + 1] = col[1]; data[idx + 2] = col[2]; data[idx + 3] = 255;
      }
    }
    o.putImageData(img, 0, 0);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    ctx.fillStyle = "#03040b"; ctx.fillRect(0, 0, S, S);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(oc, 0, 0, S, S);

    // ---------- 2. build the bolt: recursive midpoint displacement + downward forks ----------
    // origin high in the cloud, strike a bit offset so the channel slants naturally
    var ox = S * (0.40 + rng.range(-0.06, 0.06)), oy = S * 0.04;
    var sx = S * (0.54 + rng.range(-0.10, 0.10)), sy = horizon;

    var polylines = [];   // each: { pts:[{x,y}...], energy }
    var queue = [{ x0: ox, y0: oy, x1: sx, y1: sy, gens: 7, offset: S * 0.13, energy: 1 }];
    var guard = 0;
    while (queue.length && guard++ < 400) {
      var b = queue.shift();
      var pts = [{ x: b.x0, y: b.y0 }, { x: b.x1, y: b.y1 }];
      var curOff = b.offset;
      for (var g = 0; g < b.gens; g++) {
        var next = [];
        for (var k = 0; k < pts.length - 1; k++) {
          var a = pts[k], cc = pts[k + 1];
          var mx = (a.x + cc.x) / 2, my = (a.y + cc.y) / 2;
          var dx = cc.x - a.x, dy = cc.y - a.y, len = Math.hypot(dx, dy) || 1;
          var px = -dy / len, py = dx / len;                 // perpendicular
          var disp = rng.range(-1, 1) * curOff;
          mx += px * disp; my += py * disp;
          next.push(a); next.push({ x: mx, y: my });
          // spawn a downward fork from this midpoint, in the middle generations
          if (g >= 1 && g <= b.gens - 2 && b.energy > 0.25 && rng.bool(0.14 * b.energy + 0.04)) {
            var ang = Math.atan2(cc.y - my, cc.x - mx) + rng.range(-0.85, 0.85);
            var blen = len * rng.range(1.2, 2.2);
            var ex = mx + Math.cos(ang) * blen, ey = my + Math.sin(ang) * blen;
            if (ey > my) {                                   // only forks that head DOWNWARD (real bolts)
              // offset proportional to the branch's OWN length so it jags like the main channel
              // (using curOff here leaves late forks near-straight); min 3 gens for visible jag
              queue.push({ x0: mx, y0: my, x1: ex, y1: ey, gens: Math.max(3, b.gens - 2), offset: blen * 0.16, energy: b.energy * 0.5 });
            }
          }
        }
        next.push(pts[pts.length - 1]);
        pts = next; curOff *= 0.5;
      }
      polylines.push({ pts: pts, energy: b.energy });
    }

    // ---------- 3. illuminate the clouds the bolt passes through (cloud lit from within, 037) ----------
    ctx.globalCompositeOperation = "lighter";
    var main = polylines[0].pts;
    for (var m = 0; m < main.length; m += Math.max(1, Math.floor(main.length / 22))) {
      var pt = main[m];
      if (pt.y < horizon) {
        var rr = S * (0.08 + 0.11 * (1 - pt.y / horizon));   // bigger halos higher up in the cloud
        Loom.glow(ctx, pt.x, pt.y, rr, "#6b71d6", 0.40 * (1 - 0.5 * pt.y / horizon), 0.58);
      }
    }

    // ---------- 4. the bolt: wide additive glow halo, then a thin near-white hot core ----------
    function strokePolyline(pts, w, color, alpha) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var n = 1; n < pts.length; n++) ctx.lineTo(pts[n].x, pts[n].y);
      ctx.lineWidth = w; ctx.strokeStyle = color; ctx.globalAlpha = alpha;
      ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
    }
    // glow halos (two passes: broad soft + tighter brighter), then the hot core
    for (var pass = 0; pass < polylines.length; pass++) {
      var pl = polylines[pass], e = pl.energy;
      strokePolyline(pl.pts, 11 * e + 2, "#3b41a8", 0.18 * e);     // broad violet halo
      strokePolyline(pl.pts, 5 * e + 1, "#7e84e0", 0.34 * e);      // tighter brighter
    }
    for (var pass2 = 0; pass2 < polylines.length; pass2++) {
      var pl2 = polylines[pass2], e2 = pl2.energy;
      strokePolyline(pl2.pts, 2.2 * e2 + 0.5, "#cdd2ff", 0.6 * e2);   // near-white inner
      strokePolyline(pl2.pts, 1.0 * e2 + 0.3, "#ffffff", 0.85 * e2);  // hot core
    }
    ctx.globalAlpha = 1;

    // ---------- 5. ground flash + dark land silhouette ----------
    // a burst of light where the bolt meets the earth
    Loom.glow(ctx, sx, horizon, S * 0.16, "#8f95f0", 0.7, 0.45);
    Loom.glow(ctx, sx, horizon, S * 0.06, "#eef0ff", 0.9, 0.3);

    // dark land, drawn last so its edge is crisp (dark structure on top, 037 step 4)
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    ctx.fillStyle = "#02030a";
    ctx.beginPath();
    ctx.moveTo(0, S);
    ctx.lineTo(0, horizon);
    var lnz = Loom.noise(rng.int(1, 999999));
    for (var lx = 0; lx <= S; lx += 6) {
      var ridge = horizon + (lnz.fbm(lx / S * 4 + 2, 0.7, 3, 2.0, 0.5) - 0.5) * S * 0.05;
      ctx.lineTo(lx, ridge);
    }
    ctx.lineTo(S, S); ctx.closePath(); ctx.fill();
    // a thin lit rim on the land directly under the strike
    var grad = ctx.createLinearGradient(sx - S * 0.2, 0, sx + S * 0.2, 0);
    grad.addColorStop(0, "rgba(120,128,230,0)");
    grad.addColorStop(0.5, "rgba(150,158,240,0.45)");
    grad.addColorStop(1, "rgba(120,128,230,0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = grad;
    ctx.fillRect(0, horizon - 3, S, 5);

    // ---------- 6. vignette ----------
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(S / 2, S * 0.45, S * 0.35, S / 2, S * 0.5, S * 0.8);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(1,1,6,0.6)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
