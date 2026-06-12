// Emil's Loom · piece 020 — "Rose Window"
//
// A gothic rose window with the late sun coming through it: jewel glass set in near-black stone,
// throwing colour down onto the chapel floor. The hard pivot after three soft, hazy, glowing
// scenes (a dusk flock, a blue-hour fire, underwater shafts) — this one is hard-edged, saturated
// and architectural. It's also the grown-up of piece 004 "Tessera", which traced a flat Voronoi
// mosaic "like stained glass": here the glass actually GLOWS.
//
// The discriminator (advisor, #36): a rose window lives or dies on the LIGHT, not the tracery.
// The failure mode isn't "kaleidoscope" — it's "flat coloured paper", saturated cells that sit
// there as pattern instead of glowing. So it's built as luminous glass lit from behind: dark
// stone, a warm backlight behind the whole window, each cell brightest at its own centre and
// graded down toward the rim by that backlight, with the near-black came (the lead/stone bars)
// laid on LAST — the black-against-glowing-glass contrast is what sells "glass" over "paint".
// Gothic reads through HIERARCHY (a foiled heart -> a ring of foils -> pointed petals -> spandrel
// eyelets) and through SYMMETRY (cells share a colour by their place in the 12-fold, never random
// — random reads as confetti, symmetric reads as designed). And it's a place, not a logo: a
// pointed stone arch above, light pooling on the floor below. See
// [[035-defining-feature-is-often-the-hard-part]] (the cusped foils are the hard, defining part)
// and [[022-luminosity-on-bright-is-tone]] (here the ground is dark, so additive light works).
//
// Static — a held instant, fully verifiable from a still. Composes the library: noise (glass
// mottle + stone texture), glow (the centre boss + the colour pooled on the floor), palette
// helpers. All randomness lives in setup, so it reproduces exactly from the seed. Harvest
// candidates noted for a future piece: a multifoil-outline generator and a radial replicator.
Loom.piece({
  id: "020",
  title: "Rose Window",
  seed: "sanctus",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, PI = Math.PI;
    var cx = S * 0.5, cy = S * 0.45;            // window centre — a touch high, floor below it
    var R = S * 0.345;                          // glass radius
    var N = 12;                                 // the window's symmetry

    // ---- jewel glass, named so symmetric cells can share a colour (designed, not confetti) ----
    var G = {
      cobalt:  "#1f3f96", cobaltHi: "#3f7ff0",
      ruby:    "#9c1f30", rubyHi:   "#e74b62",
      gold:    "#c39a2e", goldHi:   "#f7d566",
      emerald: "#1d774a", emerHi:   "#46c585",
      violet:  "#352765", violetHi: "#7a5cc8",
      clear:   "#cdd9f2", clearHi:  "#ffffff"
    };
    var stone = "#0e0c10", stoneLit = "#26212c", sun = "#fff0d2";

    var glassN = Loom.noise(rng.int(0, 1e9));   // streaky cathedral-glass mottle
    var stoneN = Loom.noise(rng.int(0, 1e9));   // wall texture

    // The backlight behind the glass: ~1 at the light source (just above centre), fading out.
    // Everything's brightness is graded by this, so the window glows from its heart.
    var lx = cx, ly = cy - R * 0.10;
    function back(x, y) {
      var d = Math.hypot(x - lx, y - ly) / (R * 1.55);
      return Math.max(0.36, 1.12 - d);          // the whole window glows; brightest at the heart
    }

    // ---------- geometry: every opening is a Path2D, reused for both glass and came ----------
    function circlePath(x, y, r) { var p = new Path2D(); p.arc(x, y, r, 0, TAU); return p; }

    // A multifoil (trefoil/quatrefoil/rosette): the union outline of k tangent lobe-circles, so
    // it has k rounded lobes meeting at sharp inward cusps — the gothic signature. Sampled as a
    // polyline from a radius-by-angle function (distance to the far edge of the nearest lobe).
    function multifoilPath(x, y, rr, k, phase) {
      var s = Math.sin(PI / k), rho = rr * s / (1 + s), D = rr - rho, steps = k * 22;
      var p = new Path2D();
      for (var i = 0; i <= steps; i++) {
        var th = phase + TAU * i / steps;
        var seg = Math.round((th - phase) / (TAU / k));
        var d = th - (phase + seg * (TAU / k));            // in [-pi/k, pi/k]
        var sn = Math.sin(d);
        var rad = D * Math.cos(d) + Math.sqrt(Math.max(0, rho * rho - D * D * sn * sn));
        var px = x + rad * Math.cos(th), py = y + rad * Math.sin(th);
        if (i === 0) p.moveTo(px, py); else p.lineTo(px, py);
      }
      p.closePath(); return p;
    }

    // A pointed petal (a lens, pointed at both ends) along angle a, spanning radius [ri, ro].
    function petalPath(a, ri, ro, hw) {
      var ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca, midR = (ri + ro) * 0.5;
      var w = (ro - ri) * hw;
      function P(r, off) { return [cx + ca * r + nx * off, cy + sa * r + ny * off]; }
      var inP = P(ri, 0), outP = P(ro, 0), lC = P(midR, w), rC = P(midR, -w);
      var p = new Path2D();
      p.moveTo(inP[0], inP[1]);
      p.quadraticCurveTo(lC[0], lC[1], outP[0], outP[1]);
      p.quadraticCurveTo(rC[0], rC[1], inP[0], inP[1]);
      p.closePath(); return p;
    }

    // ---------- build the cells, coloured by their place in the symmetry ----------
    var feat = [];   // feature cells (get the full luminous treatment)
    function cell(path, base, hi, ux, uy, rad) { feat.push({ p: path, base: base, hi: hi, x: ux, y: uy, rad: rad }); }

    // centre rosette — an 8-foil heart in gold, with a clear boss
    cell(multifoilPath(cx, cy, R * 0.165, 8, -PI / 2), G.gold, G.goldHi, cx, cy, R * 0.165);
    cell(circlePath(cx, cy, R * 0.058), G.clear, G.clearHi, cx, cy, R * 0.058);

    // inner ring — N small circles, alternating ruby / cobalt
    for (var i = 0; i < N; i++) {
      var a = -PI / 2 + TAU * i / N, rr = R * 0.285;
      var px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
      var k = (i % 2 === 0) ? "ruby" : "cobalt";
      cell(circlePath(px, py, R * 0.05), G[k], G[k + (k === "ruby" ? "Hi" : "Hi")], px, py, R * 0.05);
    }

    // main ring — N pointed petals in cobalt, each holding a ruby trefoil out near its tip
    for (var i = 0; i < N; i++) {
      var a = -PI / 2 + TAU * i / N;
      var mx = cx + Math.cos(a) * R * 0.62, my = cy + Math.sin(a) * R * 0.62;
      cell(petalPath(a, R * 0.40, R * 0.88, 0.46), G.cobalt, G.cobaltHi, mx, my, R * 0.24);
      var tx = cx + Math.cos(a) * R * 0.72, ty = cy + Math.sin(a) * R * 0.72;
      cell(multifoilPath(tx, ty, R * 0.072, 3, a + PI / 2), G.ruby, G.rubyHi, tx, ty, R * 0.072);
    }

    // spandrel eyelets — N small quatrefoils between the petal tips at the rim, emerald / gold
    for (var i = 0; i < N; i++) {
      var a = -PI / 2 + TAU * (i + 0.5) / N, rr = R * 0.93;
      var px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
      var k = (i % 2 === 0) ? "emerald" : "gold";
      var hi = (k === "emerald") ? G.emerHi : G.goldHi;
      cell(multifoilPath(px, py, R * 0.044, 4, a), G[k], hi, px, py, R * 0.044);
    }

    // ---------- painting ----------
    function paintFeatureGlass(c) {
      var b = back(c.x, c.y);                 // 0.14 (rim) .. ~1.06 (heart)
      ctx.save();
      ctx.clip(c.p);
      // a DARK, saturated base — luminous glass is mostly deep colour, blazing only where the
      // light is right behind it. Start near-black-jewel so the additive light has room to climb.
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.fillStyle = c.base; ctx.fill(c.p);
      ctx.fillStyle = "rgba(0,0,4,0.46)"; ctx.fill(c.p);
      // streaky mottle (real glass isn't flat) — subtle hue streaks, before the bloom
      var step = Math.max(2.5, c.rad * 0.16);
      ctx.globalCompositeOperation = "lighter";
      for (var yy = c.y - c.rad; yy <= c.y + c.rad; yy += step) {
        for (var xx = c.x - c.rad; xx <= c.x + c.rad; xx += step) {
          var nv = glassN.fbm(xx / S * 16, yy / S * 16, 3);
          var a = (nv - 0.5) * 0.45 * b;
          if (a <= 0.012) continue;
          ctx.globalAlpha = Math.min(0.4, a);
          ctx.fillStyle = c.hi;
          ctx.fillRect(xx, yy, step + 0.5, step + 0.5);
        }
      }
      ctx.globalAlpha = 1;
      // ADDITIVE bloom from behind: a broad hue glow that fills the pane...
      var g1 = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.rad * 1.8);
      g1.addColorStop(0, Loom.rgba(c.hi, Math.min(1, 0.45 + 0.6 * b)));
      g1.addColorStop(0.5, Loom.rgba(c.hi, 0.2 + 0.32 * b));
      g1.addColorStop(1, Loom.rgba(c.hi, 0));
      ctx.fillStyle = g1; ctx.fill(c.p);
      // ...and a hot near-white core where the sun sits right behind the pane (centre panes blaze,
      // rim panes barely) — this is the "lit from behind" pop that turns paper into glass.
      var hot = Math.max(0, b - 0.34) * 0.8;
      if (hot > 0.02) {
        var g2 = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.rad * 0.7);
        g2.addColorStop(0, Loom.rgba("#fff1d6", Math.min(0.5, hot)));     // a small, restrained hot core
        g2.addColorStop(0.5, Loom.rgba(c.hi, hot * 0.4));
        g2.addColorStop(1, Loom.rgba(c.hi, 0));
        ctx.fillStyle = g2; ctx.fill(c.p);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function paintCame() {
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.strokeStyle = stone; ctx.lineJoin = "round"; ctx.lineCap = "round";
      var w = Math.max(2, S * 0.0058);
      // structural armature first: concentric ring-bars + radial spokes between the petals
      ctx.lineWidth = w * 1.15;
      [0.165, 0.285, 0.40, 0.88].forEach(function (f) {
        var p = new Path2D(); p.arc(cx, cy, R * f, 0, TAU); ctx.stroke(p);
      });
      for (var i = 0; i < N; i++) {
        var a = -PI / 2 + TAU * (i + 0.5) / N, p = new Path2D();
        p.moveTo(cx + Math.cos(a) * R * 0.285, cy + Math.sin(a) * R * 0.285);
        p.lineTo(cx + Math.cos(a) * R * 0.90, cy + Math.sin(a) * R * 0.90);
        ctx.stroke(p);
      }
      // then the came around every cell opening
      ctx.lineWidth = w;
      for (var i = 0; i < feat.length; i++) ctx.stroke(feat[i].p);
      // a thin cool bevel sheen on the lead, so it catches a little light
      ctx.strokeStyle = "rgba(150,170,214,0.16)"; ctx.lineWidth = Math.max(1, w * 0.26);
      for (var i = 0; i < feat.length; i++) ctx.stroke(feat[i].p);
    }

    // an equilateral (two-centre) gothic arch head over the window, sampled as a polyline.
    var archAW = R * 1.15, archBaseY = cy + R * 0.80;       // springline geometry (shared with jambs)
    function archPath(off) {
      var aw = archAW, baseY = archBaseY, r = 2 * aw + off, p = new Path2D();
      for (var k = 0; k <= 22; k++) {                       // left arc, centre (cx+aw, baseY)
        var ang = PI + (PI / 3) * (k / 22);
        var x = cx + aw + Math.cos(ang) * r, y = baseY + Math.sin(ang) * r;
        if (k === 0) p.moveTo(x, y); else p.lineTo(x, y);
      }
      for (var k = 0; k <= 22; k++) {                       // right arc, centre (cx-aw, baseY)
        var ang = (-PI / 3) + (PI / 3) * (k / 22);
        p.lineTo(cx - aw + Math.cos(ang) * r, baseY + Math.sin(ang) * r);
      }
      return p;
    }

    function paint() {
      // 1. stone wall, mottled
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.fillStyle = stone; ctx.fillRect(0, 0, S, S);
      var bs = S * 0.028;
      for (var y = 0; y < S; y += bs) {
        for (var x = 0; x < S; x += bs) {
          var nv = stoneN.fbm(x / S * 5.5, y / S * 5.5, 4);
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = Loom.mix(stone, stoneLit, nv * 0.9);
          ctx.fillRect(x, y, bs + 0.5, bs + 0.5);
        }
      }
      ctx.globalAlpha = 1;

      // 2. the gothic OPENING the window sits in: two vertical jambs + a pointed (two-centre) arch
      //    head, in LIT stone (it catches the window's glow) so it reads as a moulding, not a blob.
      var sillY = S * 0.84, litStone = "#332e38";
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      function jamb(x, w, col) {
        ctx.strokeStyle = col; ctx.lineWidth = w;
        var p = new Path2D(); p.moveTo(x, sillY); p.lineTo(x, archBaseY); ctx.stroke(p);
      }
      jamb(cx - archAW, R * 0.12, "#050406"); jamb(cx + archAW, R * 0.12, "#050406");   // dark outer joint
      ctx.strokeStyle = "#050406"; ctx.lineWidth = R * 0.12; ctx.stroke(archPath(R * 0.06));
      jamb(cx - archAW, R * 0.072, litStone); jamb(cx + archAW, R * 0.072, litStone);   // lit stone face
      ctx.strokeStyle = litStone; ctx.lineWidth = R * 0.072; ctx.stroke(archPath(R * 0.05));

      // 3. a soft halo of the window's light bleeding out onto the dark stone around it
      Loom.glow(ctx, lx, ly, R * 1.45, sun, 0.2, 0.5);

      // 4. background glass — the dim violet matrix, glowing warm from behind (the light itself)
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
      ctx.fillStyle = G.violet; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      ctx.fillStyle = "rgba(0,0,6,0.52)"; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);  // deepen the matrix so cells pop
      ctx.globalCompositeOperation = "lighter";
      var bg = ctx.createRadialGradient(lx, ly, 0, lx, ly, R * 1.05);
      bg.addColorStop(0, Loom.rgba(sun, 0.42));
      bg.addColorStop(0.4, Loom.rgba(G.violetHi, 0.24));
      bg.addColorStop(1, Loom.rgba(G.violet, 0));
      ctx.fillStyle = bg; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      ctx.restore();

      // 5. the jewel cells, lit from behind
      for (var i = 0; i < feat.length; i++) paintFeatureGlass(feat[i]);

      // 5b. a warm wash of the sun behind the WHOLE window — binds the panes into one lit object
      //     (each pane is lit on its own above; this is the single light source they all share).
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
      ctx.globalCompositeOperation = "lighter";
      var wash = ctx.createRadialGradient(lx, ly, 0, lx, ly, R * 1.3);
      wash.addColorStop(0, Loom.rgba(sun, 0.17));
      wash.addColorStop(0.5, Loom.rgba(sun, 0.06));
      wash.addColorStop(1, Loom.rgba(sun, 0));
      ctx.fillStyle = wash; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      ctx.restore();

      // 6. the came (lead/stone bars) on top — the contrast that sells "glass"
      paintCame();

      // 7. the outer stone frame ring around the glass (seats the window in the wall)
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#080709"; ctx.lineWidth = R * 0.11;
      var fr = new Path2D(); fr.arc(cx, cy, R * 1.05, 0, TAU); ctx.stroke(fr);
      ctx.strokeStyle = Loom.mix(stone, stoneLit, 0.75); ctx.lineWidth = R * 0.02;
      var fr2 = new Path2D(); fr2.arc(cx, cy, R * 1.0, 0, TAU); ctx.stroke(fr2);

      // 8. the floor, and the colour the window pools onto it
      var floorY = S * 0.84;
      var fg = ctx.createLinearGradient(0, floorY, 0, S);
      fg.addColorStop(0, "#100d12"); fg.addColorStop(1, "#070608");
      ctx.fillStyle = fg; ctx.fillRect(0, floorY, S, S - floorY);
      // pooled light: soft, flattened, additive blobs sampled from the window's colours
      ctx.save();
      ctx.translate(cx, floorY + (S - floorY) * 0.5);
      ctx.scale(1, 0.34);
      Loom.glow(ctx, 0, -R * 0.08, R * 1.3, sun, 0.16, 0.55);             // the bright heart of the pool
      var pool = [G.cobaltHi, G.cobalt, G.rubyHi, G.goldHi, G.cobaltHi, G.violetHi, G.rubyHi, G.cobalt];
      for (var i = 0; i < pool.length; i++) {
        var jx = (rng.next() - 0.5) * R * 1.8, jy = (rng.next() - 0.25) * R * 0.7;
        Loom.glow(ctx, jx, jy, R * (0.42 + rng.next() * 0.4), pool[i], 0.24, 0.5);
      }
      ctx.restore();
      // a faint volumetric cone from the window down to the pool (used sparingly)
      ctx.globalCompositeOperation = "lighter";
      var cone = ctx.createLinearGradient(cx, cy, cx, floorY);
      cone.addColorStop(0, Loom.rgba(sun, 0.05));
      cone.addColorStop(1, Loom.rgba(G.cobaltHi, 0));
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(cx - R * 0.5, cy); ctx.lineTo(cx + R * 0.5, cy);
      ctx.lineTo(cx + R * 1.1, floorY); ctx.lineTo(cx - R * 1.1, floorY);
      ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // 8b. a lone figure before the rose — small, so the window towers over them; rim-lit by its
      //     glow. A place needs a soul, and with no creature here the quiet human moment carries it.
      var fx = cx - R * 0.04, fy = S * 0.96, FH = S * 0.175;
      function figureFill(x, y, H, col) {
        var hemW = H * 0.40, waistW = H * 0.30, shW = H * 0.40,
            neckY = y - H * 0.70, shoulderY = y - H * 0.66, headR = H * 0.105, headY = y - H * 0.83;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(x - hemW * 0.5, y);
        ctx.quadraticCurveTo(x - waistW * 0.5, y - H * 0.44, x - shW * 0.5, shoulderY);  // side up to the shoulder
        ctx.quadraticCurveTo(x - shW * 0.34, neckY, x - headR, neckY - H * 0.01);          // shoulder in to the neck
        ctx.quadraticCurveTo(x, neckY - H * 0.045, x + headR, neckY - H * 0.01);           // the nape behind the head
        ctx.quadraticCurveTo(x + shW * 0.34, neckY, x + shW * 0.5, shoulderY);
        ctx.quadraticCurveTo(x + waistW * 0.5, y - H * 0.44, x + hemW * 0.5, y);
        ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x, headY, headR * 0.92, headR, 0, 0, TAU); ctx.fill();
      }
      // a rim of the window's light around the silhouette: a slightly larger bright copy, re-covered
      ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.5;
      ctx.save(); ctx.translate(fx, fy); ctx.scale(1.06, 1.035); ctx.translate(-fx, -fy);
      figureFill(fx, fy, FH, "rgba(150,178,240,1)");
      ctx.restore();
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      figureFill(fx, fy, FH, "#050407");

      // 9. vignette, to seat the whole scene in the dark
      var vg = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, S * 0.78);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(3,2,5,0.66)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
    }

    // STATIC — paint once, return nothing.
    paint();
  }
});
