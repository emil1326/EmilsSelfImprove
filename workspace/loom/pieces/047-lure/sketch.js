// Emil's Loom · piece 047 — "Lure"
//
// A deep-sea anglerfish alone in the abyss, lit only by the glowing bait it dangles before its own jaws —
// the bioluminescent esca, a single point of cold light in a mile of black water, and below it a mouth of
// long glass teeth waiting. The alien/menacing-beautiful register (the black-hole / octopus family), and a
// strong HOOK ([[035-defining-feature-is-often-the-hard-part]] + [[055...]]'s "every 5 has a hook"): the
// lure-light IS the piece — it's the light source, the bait, and the dread, all at once.
//
// Built hook-first and with the whale's lesson applied PRE-emptively
// ([[061-when-attempts-fail-alike-the-bug-is-in-what-they-share]]): the read-bearing features are built AS
// the silhouette from the start — the gaping toothy mouth is a real CONTOUR-EVENT (a notched gape lined
// with teeth), not a smooth blob with detail bolted on; plus the dangling illicium + the eerie eye. A
// FORGIVING silhouette (a globular body is iconic + un-fussy), chosen consciously as a higher-variance bold
// swing ([[062-field-subjects-are-lower-variance-than-silhouettes]]). Pure glow-on-dark
// ([[037-backlit-glow-on-dark-is-flat-paper-not-kaleidoscope]]): the esca's glow lights the water, the
// opaque body OCCLUDES it ([[056-additive-light-cant-be-darkened-occlude-on-top]]), and the lit face/teeth
// are painted additively on top — one saturated bioluminescent layer ([[051-stacking-additive-glows-desaturates-to-white]]).
// Lure colour seed-varied (cyan / icy-blue / ghost-green), judged across seeds
// ([[058-random-features-form-accidental-faces-check-many-seeds]]). Composes noise (#3) + glow (#8) +
// palette helpers. Static. No new primitive (compose — 054/060).
Loom.piece({
  id: "047",
  title: "Lure",
  seed: "abyss",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var nz = Loom.noise(rng.int(1, 999999));

    // ---- lure mood (the one colour in the dark) ----
    var moods = {
      cyan: { core: "#e8fffa", glow: "#4ee2c0", lit: "#2c4a46", tooth: "#d6eae6" },
      icy: { core: "#eef5ff", glow: "#56a6f0", lit: "#28384e", tooth: "#d6e2f0" },
      ghost: { core: "#f2ffe8", glow: "#84e06e", lit: "#2c4230", tooth: "#dcead2" }
    };
    var M = moods[rng.pick(["cyan", "cyan", "icy", "ghost"])];
    var body1 = "#070605", maw = "#1c0e0b";                       // the fish is near-black; ONLY the lure tints what it touches
    var flip = rng.bool(0.5);
    if (flip) { ctx.save(); ctx.translate(S, 0); ctx.scale(-1, 1); }

    // ---- the abyss ----
    var bg = ctx.createLinearGradient(0, 0, 0, S);
    bg.addColorStop(0, "#04080c"); bg.addColorStop(0.5, "#020509"); bg.addColorStop(1, "#010204");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);

    // fish placement (faces LEFT; the lure dangles up-left in open water)
    var u = S * rng.range(0.30, 0.34);
    var ox = S * rng.range(0.55, 0.6), oy = S * (0.52 + rng.range(-0.03, 0.03));
    var jy = rng.range(-0.03, 0.03);
    function X(x) { return ox + x * u; }
    function Y(y) { return oy + (y + jy) * u; }
    // the esca (lure bulb) position — the light source — in front of/above the jaws
    var ex = X(-1.06 + rng.range(-0.05, 0.05)), ey = Y(-0.72 + rng.range(-0.06, 0.04));

    // ---- marine snow drifting BEHIND the fish (faint, lit a touch by the lure) ----
    function snow(n, near) {
      for (var i = 0; i < n; i++) {
        var px = rng.range(0, 1) * S, py = rng.range(0, 1) * S;
        var d = Math.hypot(px - ex, py - ey) / (S * 0.5);
        var a = clamp((near ? 0.5 : 0.22) * (1 - d * 0.7), 0.02, 0.6);
        ctx.fillStyle = Loom.rgba(d < 0.5 ? M.core : "#9fb0b0", a * rng.range(0.4, 1));
        ctx.beginPath(); ctx.arc(px, py, rng.range(0.5, 1.7) * U, 0, TAU); ctx.fill();
      }
    }
    snow(Math.round(90 * U), false);

    // ---- the lure's glow in the water (additive — this is what the body will occlude) ----
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, ex, ey, u * 0.85, M.glow, 0.5, 0.5);          // a tight bait-light, not a background wash
    Loom.glow(ctx, ex, ey, u * 0.4, M.core, 0.5, 0.5);
    ctx.globalCompositeOperation = "source-over";

    // ---- the fish body — silhouette WITH the gape as a contour-event; opaque, so it occludes the glow ----
    var body = new Path2D();
    body.moveTo(X(-1.00), Y(-0.16));                              // upper-jaw tip (juts forward-left)
    body.bezierCurveTo(X(-0.86), Y(-0.40), X(-0.78), Y(-0.52), X(-0.62), Y(-0.56)); // up the snout to the forehead
    body.bezierCurveTo(X(-0.34), Y(-0.74), X(0.06), Y(-0.78), X(0.40), Y(-0.64));   // over the humped back
    body.bezierCurveTo(X(0.72), Y(-0.52), X(0.92), Y(-0.34), X(1.00), Y(-0.12));    // down to the tail stock
    body.bezierCurveTo(X(1.06), Y(-0.02), X(1.06), Y(0.08), X(1.00), Y(0.16));      // around the tail base
    body.bezierCurveTo(X(0.84), Y(0.42), X(0.46), Y(0.62), X(0.06), Y(0.62));       // under the round belly
    body.bezierCurveTo(X(-0.34), Y(0.62), X(-0.66), Y(0.56), X(-0.92), Y(0.44));    // toward the lower jaw
    body.lineTo(X(-1.00), Y(0.40));                                                 // lower-jaw tip
    body.bezierCurveTo(X(-0.80), Y(0.26), X(-0.64), Y(0.16), X(-0.52), Y(0.10));    // GAPE: lower jaw inward to the hinge
    body.bezierCurveTo(X(-0.60), Y(-0.02), X(-0.74), Y(-0.10), X(-1.00), Y(-0.16)); // GAPE: hinge back out to the upper-jaw tip
    body.closePath();

    ctx.fillStyle = body1; ctx.fill(body);                       // opaque near-black base (occludes the glow behind)
    // the body stays black except where the lure reaches it — a faint mottle, then the LURE-LIT side additively
    ctx.save(); ctx.clip(body);
    for (var m = 0, nm = Math.round(60 * U); m < nm; m++) {       // subtle skin mottle (irregular, 047)
      var mx = X(rng.range(-0.9, 1.0)), my = Y(rng.range(-0.7, 0.6));
      ctx.fillStyle = Loom.rgba(rng.bool(0.5) ? "#000000" : M.lit, rng.range(0.05, 0.14));
      ctx.beginPath(); ctx.arc(mx, my, rng.range(3, 10) * U, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "lighter";                    // the esca lights the near flesh (one saturated layer)
    var litg = ctx.createRadialGradient(ex, ey, 0, ex, ey, u * 1.32);
    litg.addColorStop(0, Loom.rgba(M.glow, 0.65)); litg.addColorStop(0.22, Loom.rgba(M.glow, 0.4)); litg.addColorStop(0.5, Loom.rgba(M.lit, 0.5)); litg.addColorStop(0.8, Loom.rgba(M.lit, 0.14)); litg.addColorStop(1, Loom.rgba(M.lit, 0));
    ctx.fillStyle = litg; ctx.fillRect(0, 0, S, S);
    ctx.restore();
    // a cold rim-light on the lure-facing edge (snout + forehead)
    ctx.strokeStyle = Loom.rgba(M.glow, 0.5); ctx.lineWidth = 2 * U; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(X(-1.00), Y(-0.16));
    ctx.bezierCurveTo(X(-0.86), Y(-0.40), X(-0.78), Y(-0.52), X(-0.62), Y(-0.56));
    ctx.bezierCurveTo(X(-0.45), Y(-0.66), X(-0.2), Y(-0.74), X(0.0), Y(-0.76));
    ctx.stroke();

    // ---- the maw + teeth (the menace) ----
    var maww = new Path2D();                                      // the dark throat inside the gape
    maww.moveTo(X(-1.00), Y(-0.16)); maww.lineTo(X(-1.00), Y(0.40));
    maww.bezierCurveTo(X(-0.78), Y(0.24), X(-0.62), Y(0.16), X(-0.50), Y(0.08));
    maww.bezierCurveTo(X(-0.42), Y(0.0), X(-0.40), Y(-0.06), X(-0.42), Y(-0.12));
    maww.bezierCurveTo(X(-0.6), Y(-0.14), X(-0.8), Y(-0.16), X(-1.00), Y(-0.16));
    maww.closePath();
    ctx.save(); ctx.clip(maww);
    var mg = ctx.createRadialGradient(X(-0.55), Y(0.05), 0, X(-0.55), Y(0.05), u * 0.7);
    mg.addColorStop(0, "#2a1010"); mg.addColorStop(1, "#0a0403");
    ctx.fillStyle = mg; ctx.fillRect(0, 0, S, S);
    ctx.restore();
    // teeth: long glassy needles on both jaws, pointing into the gape, lit by the lure
    function teeth(ax, ay, bx, by, dir, n) {                     // jaw from (ax,ay)→(bx,by); dir = perpendicular sign into the mouth
      for (var t = 0; t < n; t++) {
        var f = (t + 0.5) / n, jx = ax + (bx - ax) * f, jyy = ay + (by - ay) * f;
        var len = (0.10 + 0.06 * Math.sin(f * 3.3)) * u * rng.range(0.8, 1.15);
        var nxp = -(by - ay), nyp = (bx - ax), nl = Math.hypot(nxp, nyp); nxp /= nl; nyp /= nl;
        var tx = jx + nxp * dir * len + (bx - ax) / nl * len * 0.4, ty = jyy + nyp * dir * len + (by - ay) / nl * len * 0.4;
        var w = 2.4 * U * (1 - f * 0.3);
        var lit = clamp(1 - Math.hypot(jx - ex, jyy - ey) / (u * 1.6), 0.15, 1);
        ctx.fillStyle = Loom.rgba(M.tooth, 0.5 + lit * 0.45);
        ctx.beginPath(); ctx.moveTo(jx - (bx - ax) / nl * w, jyy - (by - ay) / nl * w);
        ctx.lineTo(jx + (bx - ax) / nl * w, jyy + (by - ay) / nl * w); ctx.lineTo(tx, ty); ctx.closePath(); ctx.fill();
      }
    }
    teeth(X(-0.98), Y(-0.15), X(-0.50), Y(0.09), 1, 8);          // upper jaw → teeth point DOWN into the gape
    teeth(X(-0.97), Y(0.39), X(-0.52), Y(0.10), -1, 7);         // lower jaw → teeth point UP into the gape

    // ---- the eye (small, high on the head, with a cold lure-reflection) ----
    var eyx = X(-0.52), eyy = Y(-0.34);
    ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.arc(eyx, eyy, 6.5 * U, 0, TAU); ctx.fill();
    ctx.fillStyle = Loom.rgba(M.lit, 0.6); ctx.beginPath(); ctx.arc(eyx, eyy, 6.5 * U, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, eyx - 1.5 * U, eyy - 1.5 * U, 5 * U, M.core, 0.7, 0.5);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = Loom.rgba(M.core, 0.95); ctx.beginPath(); ctx.arc(eyx - 1.6 * U, eyy - 1.6 * U, 1.6 * U, 0, TAU); ctx.fill();

    // ---- fins (small, wispy, translucent) ----
    ctx.globalCompositeOperation = "lighter";
    function fin(fx, fy, fr, ang, spread) {
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(ang);
      for (var r = 0; r < 5; r++) {
        var a2 = (r / 4 - 0.5) * spread;
        ctx.strokeStyle = Loom.rgba(M.lit, 0.3); ctx.lineWidth = 1.4 * U;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a2) * fr, Math.sin(a2) * fr); ctx.stroke();
      }
      ctx.restore();
    }
    fin(X(0.12), Y(0.40), u * 0.34, 1.3, 1.0);                   // pectoral
    fin(X(0.98), Y(0.04), u * 0.4, 0.1, 1.4);                    // tail
    ctx.globalCompositeOperation = "source-over";

    // ---- the illicium (lure stalk) + the esca (the bait, the brightest thing) ----
    ctx.strokeStyle = Loom.rgba("#1a1a18", 0.9); ctx.lineWidth = 3 * U; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(X(-0.5), Y(-0.56)); ctx.bezierCurveTo(X(-0.7), Y(-0.9), X(-0.95), Y(-0.92), ex, ey); ctx.stroke();
    ctx.strokeStyle = Loom.rgba(M.glow, 0.4); ctx.lineWidth = 1.4 * U;   // the stalk catches a little of its own light
    ctx.beginPath(); ctx.moveTo(X(-0.5), Y(-0.56)); ctx.bezierCurveTo(X(-0.7), Y(-0.9), X(-0.95), Y(-0.92), ex, ey); ctx.stroke();
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, ex, ey, u * 0.6, M.glow, 0.6, 0.5);
    Loom.glow(ctx, ex, ey, u * 0.26, M.core, 0.9, 0.5);
    ctx.fillStyle = M.core; ctx.beginPath(); ctx.arc(ex, ey, 4.5 * U, 0, TAU); ctx.fill();   // the bright bulb

    // ---- marine snow in FRONT, lit motes near the lure + a faint volumetric cone ----
    snow(Math.round(40 * U), true);
    ctx.globalCompositeOperation = "source-over";

    // ---- settle the abyss: a heavy vignette pulling the edges to black ----
    var vg = ctx.createRadialGradient(ex, ey, u * 0.3, ex, ey, S * 0.72);
    vg.addColorStop(0, "rgba(2,4,6,0)"); vg.addColorStop(0.55, "rgba(1,2,4,0.34)"); vg.addColorStop(1, "rgba(0,1,2,0.92)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);

    if (flip) ctx.restore();
  }
});
