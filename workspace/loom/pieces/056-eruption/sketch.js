// Emil's Loom · piece 056 — "Eruption"
//
// A volcano erupting at night — a lava fountain at the summit, glowing rivers down the flanks, and a vast
// ash plume boiling up into the dark, lit from WITHIN by the eruption, with volcanic lightning crackling in
// it. Raw earth power. The HOOK ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]): drama —
// the loud-awe register of Strike (#027, a 5) and the aurora, which my rated set says hits hardest (the
// divider isn't depiction-vs-emergent, it's DRAMA-vs-quiet). Deliberately loud after the quiet Nocturne.
//
// The CRUX ([[035-defining-feature-is-often-the-hard-part]]): it must read as FORCE, not a pretty glowing
// cone — so the plume boils up dense and turbulent and internally-lit (hot at the vent, dark smoke above),
// the fountain throws incandescent ejecta, and the volcanic lightning forks through the ash. A tiny figure
// anchors the scale and the soul ([[071-a-scene-needs-its-subject-as-the-focal-anchor-not-just-present]]).
// Plume = a turbulent field (#16, noise-broken + soft so it reads as smoke not a shape, [[069-translucent-atmosphere-shaped-by-a-mask-reads-as-solid]]).
// Composes field + noise + ramp + glow. Static (frozen at the peak of the blast).
Loom.piece({
  id: "056",
  title: "Eruption",
  seed: "vesuvius",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    var vx = S * rng.range(0.40, 0.52), vy = S * rng.range(0.48, 0.56);  // summit
    var groundY = S * rng.range(0.76, 0.82);
    var coneHalf = S * rng.range(0.26, 0.34);                            // cone half-width at the base
    var lava = Loom.ramp(["#2a0805", "#7a1c08", "#d4480e", "#f5912a", "#ffd060", "#fff2c8"]);

    // ---- night sky + a hot glow thrown up around the eruption ----
    var sky = ctx.createLinearGradient(0, 0, 0, groundY);
    sky.addColorStop(0, "#080509"); sky.addColorStop(0.6, "#140a10"); sky.addColorStop(1, "#2a1410");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, groundY + 1);
    for (var st = 0, ns = Math.round(120 * U); st < ns; st++) {          // a few stars (away from the plume)
      var sx = rng.range(0, S), sy = rng.range(0, vy * 0.8);
      ctx.fillStyle = "rgba(220,220,235," + rng.range(0.1, 0.5) + ")";
      ctx.fillRect(sx, sy, rng.range(0.6, 1.4) * U, rng.range(0.6, 1.4) * U);
    }
    ctx.save(); ctx.globalCompositeOperation = "lighter";                // sky glow above the summit
    Loom.glow(ctx, vx, vy - S * 0.05, S * 0.45, "#e85a18", 0.4, 0.55);
    ctx.restore();

    // ---- the ash plume: a turbulent column boiling up, hot at the vent → dark smoke above (field #16) ----
    var plumeTop = S * rng.range(-0.02, 0.05), plumeH = vy - plumeTop;
    var drift = S * rng.range(-0.16, 0.16), baseW = S * 0.10, spreadW = S * rng.range(0.26, 0.38);
    var smoke = [0, 0, 0], lv = [0, 0, 0];
    var FW = Math.round(Math.min(S, 760) * 0.6), sc = S / FW;
    var plume = Loom.field(FW, function (x, y, out) {
      var X = x * sc, Y = y * sc;
      if (Y > vy + S * 0.02 || Y < plumeTop - S * 0.04) { out[3] = 0; return; }
      var hn = clamp((vy - Y) / plumeH, 0, 1);                           // 0 at vent → 1 at top
      var cxh = vx + drift * hn * hn;                                    // lean with height
      var halfW = baseW + hn * spreadW + Math.sin(hn * 3.3 + 1) * S * 0.03;  // billowing width
      var dx = (X - cxh) / halfW;
      if (dx < -1.5 || dx > 1.5) { out[3] = 0; return; }
      var turb = nz.fbm(X * 0.0055 + 5, Y * 0.0055, 6, 2.3, 0.58);
      var horiz = Math.exp(-dx * dx * 1.3);
      var vert = clamp(hn * 7, 0, 1) * (1 - hn * 0.08);                  // ramp fast off the vent, dense to the top
      var d = clamp((turb - 0.31) * 3.4, 0, 1) * horiz * vert;          // sharper threshold → defined billows
      if (d < 0.04) { out[3] = 0; return; }
      var lightF = clamp(1 - hn * 1.55, 0, 1) * clamp(1.4 - Math.abs(dx), 0, 1);  // glow concentrated at the vent
      lava.rgb(clamp(0.32 + 0.5 * turb + (1 - hn) * 0.30, 0, 1), lv);   // hotter near the vent
      var sm = 12 + 22 * turb;                                          // dark ash (high contrast)
      smoke[0] = sm * 1.35; smoke[1] = sm; smoke[2] = sm * 0.82;
      var f = clamp(lightF * 1.2, 0, 1); f = f * f;
      out[0] = clamp(smoke[0] + (lv[0] - smoke[0]) * f, 0, 255);
      out[1] = clamp(smoke[1] + (lv[1] - smoke[1]) * f, 0, 255);
      out[2] = clamp(smoke[2] + (lv[2] - smoke[2]) * f, 0, 255);
      out[3] = clamp(d * (1.0 + 0.5 * lightF), 0, 1) * 255;
    });
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(plume, 0, 0, S, S);

    // ---- the cone: a dark silhouette, roughened, with glowing lava flows down the flanks ----
    var craterHalf = coneHalf * rng.range(0.13, 0.2);
    var flankPts = function (x0, y0, x1, y1, n, into, sd) {             // a jittered line of n points
      for (var k = 1; k <= n; k++) { var tt = k / n; into.push(x0 + (x1 - x0) * tt, y0 + (y1 - y0) * tt + (nz.fbm(tt * 5 + sd, 2, 2, 2, 0.5) - 0.5) * S * 0.018); }
    };
    var lp = [vx - coneHalf, groundY];
    flankPts(vx - coneHalf, groundY, vx - craterHalf, vy + S * 0.006, 8, lp, 40);
    lp.push(vx + craterHalf, vy + S * 0.006);
    flankPts(vx + craterHalf, vy + S * 0.006, vx + coneHalf, groundY, 8, lp, 80);
    ctx.beginPath(); ctx.moveTo(lp[0], lp[1]); for (var cp = 2; cp < lp.length; cp += 2) ctx.lineTo(lp[cp], lp[cp + 1]); ctx.closePath();
    ctx.fillStyle = "#0a0506"; ctx.fill();
    // glowing lava flows running down the flanks (jagged, additive)
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round"; ctx.lineCap = "round";
    for (var fl = 0, nFlows = rng.int(2, 4); fl < nFlows; fl++) {
      var fdir = rng.bool(0.5) ? 1 : -1;
      var fx = vx + fdir * craterHalf * 0.6, fy = vy + S * 0.012;
      var endx = vx + fdir * coneHalf * rng.range(0.5, 0.95), endy = groundY - S * rng.range(0, 0.05);
      var fpts = [fx, fy]; jag(fx, fy, endx, endy, S * 0.045, fpts);
      ctx.strokeStyle = "rgba(120,28,8,0.55)"; ctx.lineWidth = rng.range(3, 6) * U;
      ctx.beginPath(); ctx.moveTo(fpts[0], fpts[1]); for (var fq = 2; fq < fpts.length; fq += 2) ctx.lineTo(fpts[fq], fpts[fq + 1]); ctx.stroke();
      ctx.strokeStyle = "rgba(255,150,40,0.8)"; ctx.lineWidth = rng.range(1, 2.3) * U;
      ctx.beginPath(); ctx.moveTo(fpts[0], fpts[1]); for (var fq2 = 2; fq2 < fpts.length; fq2 += 2) ctx.lineTo(fpts[fq2], fpts[fq2 + 1]); ctx.stroke();
    }
    ctx.restore();

    // ---- the lava: a fountain at the crater + incandescent glow ----
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, vx, vy, S * 0.13, "#ff7a1e", 0.9, 0.4);              // vent glow
    Loom.glow(ctx, vx, vy, S * 0.05, "#ffe69a", 1.0, 0.5);              // white-hot core
    for (var j = 0, nj = Math.round(60 * U); j < nj; j++) {            // the fountain jet (bright streaks up)
      var a0 = -TAU / 4 + rng.range(-0.5, 0.5);
      var sp = rng.range(0.04, 0.16) * S, jx = vx + Math.cos(a0) * sp * 0.5, jy = vy + Math.sin(a0) * sp;
      lava.rgb(rng.range(0.6, 1.0), lv);
      ctx.strokeStyle = "rgba(" + (lv[0] | 0) + "," + (lv[1] | 0) + "," + (lv[2] | 0) + "," + rng.range(0.4, 0.9) + ")";
      ctx.lineWidth = rng.range(0.8, 2.2) * U;
      ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(jx, jy); ctx.stroke();
    }
    ctx.restore();

    // ---- ejecta: incandescent bombs flung from the crater in ballistic arcs (violence) ----
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    var grav = S * 1.7;
    for (var e = 0, ne = Math.round(28 * U); e < ne; e++) {
      var dir = rng.bool(0.5) ? 1 : -1;
      var v0 = rng.range(0.11, 0.30) * S, ea = rng.range(0.75, 1.3);
      var evx = dir * Math.cos(ea) * v0, evy = -Math.sin(ea) * v0;
      var npt = Math.round(rng.range(7, 16));
      for (var p = 0; p < npt; p++) {
        var tt = (p / npt) * 1.25;
        var ex = vx + evx * tt, ey = vy + evy * tt + 0.5 * grav * tt * tt;
        if (ey > groundY) break;
        var fade = clamp(1 - tt * 0.8, 0, 1);
        lava.rgb(rng.range(0.55, 0.95), lv);
        ctx.fillStyle = "rgba(" + (lv[0] | 0) + "," + (lv[1] | 0) + "," + (lv[2] | 0) + "," + (fade * 0.85) + ")";
        var sz = rng.range(0.9, 2.4) * U * (0.5 + fade);
        ctx.fillRect(ex - sz / 2, ey - sz / 2, sz, sz);
      }
    }
    ctx.restore();

    // ---- volcanic lightning: short forking bolts crackling in the ash (the hook) ----
    function jag(x0, y0, x1, y1, disp, pts) {
      if (disp < 3 * U) { pts.push(x1, y1); return; }
      var mx = (x0 + x1) / 2 + rng.range(-1, 1) * disp, my = (y0 + y1) / 2 + rng.range(-1, 1) * disp;
      jag(x0, y0, mx, my, disp * 0.58, pts);
      jag(mx, my, x1, y1, disp * 0.58, pts);
    }
    function drawBolt(x0, y0, x1, y1) {
      var pts = [x0, y0]; jag(x0, y0, x1, y1, Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) * 0.22, pts);
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(150,120,255,0.5)"; ctx.lineWidth = 5 * U;   // soft purple glow
      ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (var q = 2; q < pts.length; q += 2) ctx.lineTo(pts[q], pts[q + 1]); ctx.stroke();
      ctx.strokeStyle = "rgba(234,230,255,0.95)"; ctx.lineWidth = 1.4 * U;  // white-hot core
      ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (var q2 = 2; q2 < pts.length; q2 += 2) ctx.lineTo(pts[q2], pts[q2 + 1]); ctx.stroke();
      ctx.restore();
    }
    var nb = rng.int(2, 4);
    for (var b = 0; b < nb; b++) {
      var bx0 = vx + rng.range(-spreadW * 0.5, spreadW * 0.5), by0 = vy - plumeH * rng.range(0.15, 0.5);
      drawBolt(bx0, by0, bx0 + rng.range(-1, 1) * S * 0.12, by0 + rng.range(-1, 1) * S * 0.16);
      if (rng.bool(0.6)) drawBolt(bx0, by0, bx0 + rng.range(-1, 1) * S * 0.09, by0 + rng.range(0.04, 0.13) * S);  // a fork
    }

    // ---- foreground land + a lone tiny figure watching (scale + soul, [[071]]) ----
    ctx.fillStyle = "#070405"; ctx.fillRect(0, groundY, S, S - groundY);
    ctx.save(); ctx.globalCompositeOperation = "lighter";              // warm wash on the near ground
    var fgGlow = ctx.createLinearGradient(0, groundY, 0, groundY + S * 0.12);
    fgGlow.addColorStop(0, "rgba(120,40,12,0.5)"); fgGlow.addColorStop(1, "rgba(60,18,8,0)");
    ctx.fillStyle = fgGlow; ctx.fillRect(0, groundY, S, S * 0.13);
    ctx.restore();
    var figSide = rng.bool(0.5) ? 1 : -1;                              // a distant silhouette on the plain, watching
    var figX = vx + figSide * S * rng.range(0.2, 0.3), figY = groundY + S * rng.range(0.03, 0.07);
    var fh = S * rng.range(0.04, 0.055), fw = fh * 0.26;
    ctx.fillStyle = "#050304";
    ctx.beginPath(); ctx.moveTo(figX - fw * 0.5, figY); ctx.lineTo(figX - fw * 0.32, figY - fh * 0.9);
    ctx.lineTo(figX + fw * 0.32, figY - fh * 0.9); ctx.lineTo(figX + fw * 0.5, figY); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(figX, figY - fh, fw * 0.5, 0, TAU); ctx.fill();   // head
    var rimDir = (vx >= figX) ? 1 : -1;                                // a faint warm rim, eruption side
    ctx.strokeStyle = "rgba(230,100,34,0.6)"; ctx.lineWidth = 1 * U;
    ctx.beginPath(); ctx.moveTo(figX + rimDir * fw * 0.46, figY - 1 * U); ctx.lineTo(figX + rimDir * fw * 0.4, figY - fh * 0.88); ctx.stroke();

    // ---- a soft vignette ----
    var vg = ctx.createRadialGradient(vx, vy, S * 0.3, vx, vy, S * 0.85);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(4,2,3,0.6)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
