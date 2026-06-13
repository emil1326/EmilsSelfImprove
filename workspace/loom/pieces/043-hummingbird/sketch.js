// Emil's Loom · piece 043 — "Sylph"
//
// A hummingbird hovering at a flower, frozen mid-hum: the long needle beak dipped to the nectar, the wings
// blurred to soft fans, and — the HOOK — the iridescent GORGET, that throat-patch of structural colour that
// flares magenta then gold then green as the light catches it. The jewel-bright, alive register, after the
// quiet bonsai. The read lives in the silhouette + the blur ([[035-defining-feature-is-often-the-hard-part]]):
// the long beak + the hovering tilt + the blurred wing-fans say "hummingbird" the way nothing else does.
//
// Iridescence reads on a darker ground (like the peacock), so it's a shaded garden with soft bokeh; the
// gorget is a gradient patch with a hot flash, NOT additive glow (it's structural colour, lit pigment —
// [[040-wet-living-surface-needs-all-light-cues-to-agree]] / [[022-luminosity-on-bright-is-tone]]). Built
// silhouette-first. Composes noise (#3, bokeh + feather sheen) + glow (#8, the catchlights) + the palette
// helpers. Static — a caught instant (the blur carries the motion). Judged across seeds ([[058-random-features-form-accidental-faces-check-many-seeds]]).
Loom.piece({
  id: "043",
  title: "Sylph",
  seed: "rubythroat",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853, U = S / 760;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- a shaded garden: deep teal-green, soft dappled bokeh ----
    var bg = ctx.createLinearGradient(0, 0, 0, S);
    bg.addColorStop(0, "#16322c"); bg.addColorStop(0.55, "#102621"); bg.addColorStop(1, "#0a1a16");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0, nb = Math.round(26 * U); i < nb; i++) {
      var bxk = rng.range(0, 1) * S, byk = rng.range(0, 1) * S, br = rng.range(0.04, 0.13) * S;
      var hue = rng.bool(0.3) ? "#d8c46a" : "#7fae5a";
      var g = ctx.createRadialGradient(bxk, byk, 0, bxk, byk, br);
      g.addColorStop(0, Loom.rgba(hue, rng.range(0.05, 0.14))); g.addColorStop(0.7, Loom.rgba(hue, 0.03)); g.addColorStop(1, Loom.rgba(hue, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bxk, byk, br, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    // ---- placement: the flower hangs upper-right, the bird hovers below-left, beak up into the throat ----
    var flx = S * (0.66 + rng.range(-0.04, 0.04)), fly = S * (0.34 + rng.range(-0.04, 0.04));
    var bcx = S * (0.42 + rng.range(-0.03, 0.03)), bcy = S * (0.56 + rng.range(-0.03, 0.03));
    var phi = -0.62 + rng.range(-0.08, 0.08);                    // body tilt: head up-right toward the flower
    var bodyLen = S * 0.2, cph = Math.cos(phi), sph = Math.sin(phi);
    // local (along-body x: + = head/forward; perp y: + = belly/under) → screen
    function B(lx, ly) { return [bcx + (lx * cph - ly * sph) * bodyLen, bcy + (lx * sph + ly * cph) * bodyLen]; }

    // seed-varied plumage — a different hummingbird each time (back gradient / iridescent sheen / gorget / flash)
    var plumage = rng.pick([
      { back: ["#43c88c", "#1f8a5a", "#15623f", "#0e4630"], sheen: "#78f0b4", gorget: ["#ffd86a", "#ff5aa0", "#d8266e", "#7a1e6a"], flash: "#ff7ab0" },
      { back: ["#7a6ad8", "#4a3aa0", "#2e2470", "#16124a"], sheen: "#a89cf0", gorget: ["#d8c0ff", "#9a5aff", "#6a2ad0", "#34187a"], flash: "#b894ff" },
      { back: ["#d89a52", "#b06a2a", "#7a4418", "#4a2a10"], sheen: "#f0c890", gorget: ["#ffe07a", "#ff8a3a", "#e2541a", "#882c10"], flash: "#ffb070" },
      { back: ["#4ac8d8", "#2a8aa0", "#186270", "#0c4450"], sheen: "#80e0f0", gorget: ["#a8ecff", "#3aaaff", "#2060d0", "#103a78"], flash: "#84c8ff" }
    ]);

    // ---- the blurred wing-fans (drawn behind the body): rapid-beat = soft translucent sweeps ----
    // a blurred wing-blade sweeping from the shoulder: a fast beat reads as a soft translucent fan + ghost arcs
    function wing(ang, len, wid, alpha) {
      var root = B(0.1, -0.02);                                  // shoulder
      ctx.save(); ctx.translate(root[0], root[1]); ctx.rotate(phi + ang);
      var g = ctx.createLinearGradient(0, 0, len, 0);
      g.addColorStop(0, "rgba(208,224,216," + alpha.toFixed(3) + ")"); g.addColorStop(0.55, "rgba(196,214,206," + (alpha * 0.45).toFixed(3) + ")"); g.addColorStop(1, "rgba(190,210,200,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(len * 0.52, 0, len * 0.52, wid, 0, 0, TAU); ctx.fill();    // the soft blurred blade
      ctx.strokeStyle = "rgba(224,236,228," + (alpha * 0.5).toFixed(3) + ")"; ctx.lineWidth = 0.9 * U;
      for (var k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(len * 0.52, 0, len * 0.52, wid * (0.32 + k * 0.3), 0, 0, TAU); ctx.stroke(); }  // beat ghosts
      ctx.restore();
    }
    wing(-1.2, bodyLen * 1.7, bodyLen * 0.3, 0.13);              // far wing: swept up-and-back

    // ---- the body: a streamlined teardrop, iridescent emerald back over a pale belly ----
    var backG = ctx.createLinearGradient(B(0, -0.6)[0], B(0, -0.6)[1], B(0, 0.6)[0], B(0, 0.6)[1]);
    backG.addColorStop(0, plumage.back[0]); backG.addColorStop(0.4, plumage.back[1]); backG.addColorStop(0.7, plumage.back[2]); backG.addColorStop(1, plumage.back[3]);
    ctx.fillStyle = backG;
    ctx.beginPath();
    var p, c1;
    p = B(-1.12, 0.02); ctx.moveTo(p[0], p[1]);                  // tail point
    p = B(0.42, -0.24); c1 = B(-0.5, -0.32); ctx.quadraticCurveTo(c1[0], c1[1], p[0], p[1]);  // slim back up to the shoulder
    p = B(0.66, -0.02); c1 = B(0.72, -0.2); ctx.quadraticCurveTo(c1[0], c1[1], p[0], p[1]);   // crown / small head
    p = B(0.5, 0.18); c1 = B(0.7, 0.1); ctx.quadraticCurveTo(c1[0], c1[1], p[0], p[1]);       // throat / chin
    p = B(-0.5, 0.22); c1 = B(0.02, 0.3); ctx.quadraticCurveTo(c1[0], c1[1], p[0], p[1]);     // belly (slim)
    p = B(-1.12, 0.02); c1 = B(-0.86, 0.14); ctx.quadraticCurveTo(c1[0], c1[1], p[0], p[1]);  // back to tail
    ctx.closePath(); ctx.fill();
    // pale belly wash (lower half)
    ctx.save(); ctx.clip();
    var belly = ctx.createLinearGradient(B(0, 0)[0], B(0, 0)[1], B(0, 0.5)[0], B(0, 0.5)[1]);
    belly.addColorStop(0, "rgba(210,220,200,0)"); belly.addColorStop(1, "rgba(214,224,206,0.85)");
    ctx.fillStyle = belly; var bb = B(-0.6, 0.45), bb2 = B(0.6, 0.45); ctx.fillRect(Math.min(bb[0], bb2[0]) - S * 0.1, Math.min(bb[1], bb2[1]) - S * 0.1, S * 0.5, S * 0.5);
    // a sheen highlight on the back (iridescent)
    var sheen = ctx.createLinearGradient(B(-0.2, -0.4)[0], B(-0.2, -0.4)[1], B(0.4, -0.1)[0], B(0.4, -0.1)[1]);
    sheen.addColorStop(0, Loom.rgba(plumage.sheen, 0)); sheen.addColorStop(0.5, Loom.rgba(plumage.sheen, 0.4)); sheen.addColorStop(1, Loom.rgba(plumage.sheen, 0));
    ctx.fillStyle = sheen; ctx.fillRect(B(-1, -0.6)[0] - S * 0.1, B(-1, -0.6)[1] - S * 0.1, S * 0.6, S * 0.4);
    ctx.restore();

    // ---- the tail fan (short, behind) ----
    ctx.strokeStyle = plumage.back[3]; ctx.lineWidth = 3.4 * U; ctx.lineCap = "round";
    for (var t = -2; t <= 2; t++) { var a0 = B(-0.92, 0.03), a1 = B(-1.5, 0.03 + t * 0.15); ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke(); }

    // ---- the GORGET: the iridescent throat patch — magenta core flaring to gold/green ----
    var gc = B(0.46, 0.22);
    var ir = ctx.createRadialGradient(B(0.52, 0.16)[0], B(0.52, 0.16)[1], 1, gc[0], gc[1], bodyLen * 0.4);
    ir.addColorStop(0, plumage.gorget[0]); ir.addColorStop(0.28, plumage.gorget[1]); ir.addColorStop(0.6, plumage.gorget[2]); ir.addColorStop(0.85, plumage.gorget[3]); ir.addColorStop(1, Loom.rgba(plumage.gorget[3], 0));
    ctx.fillStyle = ir;
    ctx.beginPath();
    p = B(0.66, 0.06); ctx.moveTo(p[0], p[1]);
    p = B(0.54, 0.34); c1 = B(0.66, 0.26); ctx.quadraticCurveTo(c1[0], c1[1], p[0], p[1]);
    p = B(0.18, 0.38); c1 = B(0.36, 0.42); ctx.quadraticCurveTo(c1[0], c1[1], p[0], p[1]);
    p = B(0.3, 0.12); c1 = B(0.2, 0.22); ctx.quadraticCurveTo(c1[0], c1[1], p[0], p[1]);
    p = B(0.66, 0.06); c1 = B(0.5, 0.04); ctx.quadraticCurveTo(c1[0], c1[1], p[0], p[1]);
    ctx.closePath(); ctx.fill();
    Loom.glow(ctx, B(0.52, 0.16)[0], B(0.52, 0.16)[1], bodyLen * 0.19, plumage.flash, 0.7, 0.38);   // the hot iridescent flash — pops on any plumage
    ctx.fillStyle = Loom.rgba(plumage.gorget[0], 0.9); ctx.beginPath(); ctx.arc(B(0.52, 0.15)[0], B(0.52, 0.15)[1], bodyLen * 0.05, 0, TAU); ctx.fill();

    // ---- head detail: eye + the long needle beak reaching to the flower ----
    var eye = B(0.6, -0.04);
    ctx.fillStyle = "#0a1410"; ctx.beginPath(); ctx.arc(eye[0], eye[1], bodyLen * 0.05, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(220,240,230,0.9)"; ctx.beginPath(); ctx.arc(eye[0] - U, eye[1] - U, bodyLen * 0.018, 0, TAU); ctx.fill();
    var beakBase = B(0.72, 0.02);
    ctx.strokeStyle = "#15110c"; ctx.lineWidth = 2.4 * U; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(beakBase[0], beakBase[1]);
    ctx.quadraticCurveTo((beakBase[0] + flx) / 2, (beakBase[1] + fly) / 2 - S * 0.01, flx - S * 0.01, fly + S * 0.04); ctx.stroke();

    // ---- the near wing (over the body, brighter), swept up-and-forward ----
    wing(-0.5, bodyLen * 1.6, bodyLen * 0.28, 0.2);

    // ---- the flower: a pendant trumpet bloom the beak dips into ----
    (function flower() {
      var pet = rng.pick([["#ff6a72", "#e23a52", "#b02440"], ["#f48ab0", "#e25a92", "#b03a78"], ["#ffa24a", "#f0701e", "#c84810"]]);
      // stem
      ctx.strokeStyle = "#2e5a30"; ctx.lineWidth = 3 * U; ctx.beginPath(); ctx.moveTo(flx + S * 0.04, fly - S * 0.16); ctx.quadraticCurveTo(flx + S * 0.09, fly - S * 0.1, flx + S * 0.02, fly - S * 0.04); ctx.stroke();
      // the trumpet (a tapering tube opening downward) + back petals
      var fg = ctx.createLinearGradient(flx, fly - S * 0.06, flx, fly + S * 0.08);
      fg.addColorStop(0, pet[2]); fg.addColorStop(0.5, pet[1]); fg.addColorStop(1, pet[0]);
      ctx.fillStyle = fg;
      for (var pe = 0; pe < 5; pe++) {
        var pa = -1.0 + pe * 0.5 + rng.range(-0.08, 0.08);
        ctx.beginPath(); ctx.moveTo(flx, fly - S * 0.02);
        var tipx = flx + Math.cos(pa) * S * 0.075, tipy = fly + S * 0.02 + Math.sin(pa) * S * 0.075;
        ctx.quadraticCurveTo(flx + Math.cos(pa - 0.25) * S * 0.05, fly + Math.sin(pa - 0.25) * S * 0.05, tipx, tipy);
        ctx.quadraticCurveTo(flx + Math.cos(pa + 0.25) * S * 0.05, fly + Math.sin(pa + 0.25) * S * 0.05, flx, fly - S * 0.02);
        ctx.closePath(); ctx.fill();
      }
      // the throat
      ctx.fillStyle = pet[2]; ctx.beginPath(); ctx.ellipse(flx, fly + S * 0.01, S * 0.022, S * 0.03, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,240,180,0.7)"; ctx.beginPath(); ctx.ellipse(flx, fly + S * 0.005, S * 0.01, S * 0.016, 0, 0, TAU); ctx.fill();
    })();

    // ---- a few motes of pollen drifting in the light + a soft vignette ----
    ctx.globalCompositeOperation = "lighter";
    for (i = 0; i < Math.round(18 * U); i++) { ctx.fillStyle = "rgba(255,240,180," + rng.range(0.1, 0.4).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(rng.range(0, 1) * S, rng.range(0, 1) * S, rng.range(0.5, 1.6) * U, 0, TAU); ctx.fill(); }
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(bcx + S * 0.05, bcy - S * 0.05, S * 0.3, S * 0.5, S * 0.5, S * 0.8);
    vg.addColorStop(0, "rgba(6,16,12,0)"); vg.addColorStop(1, "rgba(4,12,9,0.6)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
