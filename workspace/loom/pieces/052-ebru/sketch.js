// Emil's Loom · piece 052 — "Ebru"
//
// Paper marbling — ebru, the old Turkish craft of floating ink on water. You drop a bead of ink and it
// spreads into a disc, pushing every colour already on the water OUTWARD into a thin ring around it; drop
// another inside it and the rings nest; then you drag a comb through and the whole field shears into
// feathered waves. Lift a sheet of paper to the surface and it takes the pattern. Here the water is the
// canvas and the "ink" is maths. The HOOK ([[065-a-defining-feature-isnt-a-hook-legibility-isnt-impact]]):
// the mesmerising folded swirl is *emergent* — unlike a Chladni figure (#051) it has no canonical look, so
// every seed is a genuinely different marble (the Strange/Current register, where the system surprises you).
//
// THE TRICK ([[038-render-fields-numerically-then-upscale]] — a 4th dogfood of lib/field.js #16): the two
// marbling moves — a DROP and a COMB/tine — each map the plane to itself in closed form AND invert in closed
// form (each displacement is along an axis whose perpendicular coordinate it leaves unchanged). So instead of
// forward-simulating polygons (which tears and grinds — the wave/firefly trap), I render BACKWARD per pixel:
// walk the op list in reverse, and the first drop-disc the back-mapped point falls inside is the colour on
// top (a free painter's order + an early-out, like Iris's disc). Crisp folds at any resolution. Composes
// field (#16) + palette + noise. Static. The drop/comb operators are a future-harvest candidate (not yet —
// one consumer, [[054-shared-shape-isnt-a-seam-wait-for-identical-body]]).
Loom.piece({
  id: "052",
  title: "Ebru",
  seed: "float",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;
    var rgb = function (h) { var c = Loom.hexToRgb(h); return [c.r, c.g, c.b]; };

    // ---- ink palettes: a base coat (the tray) + a handful of inks dropped onto it ----
    var pals = {
      indigo:   { base: "#ece3cb", inks: ["#16284a", "#2c4f86", "#7c2230", "#c08a3c", "#f3ecd6", "#16284a", "#2c4f86"] },
      lagoon:   { base: "#0b1b22", inks: ["#2e8f8f", "#56c2b0", "#e8d9a8", "#c8623f", "#103038", "#9ad8c4"] },
      ember:    { base: "#160d0b", inks: ["#d8451f", "#f0822e", "#f6c052", "#8c1f1c", "#f0e2c0", "#d8451f"] },
      ink:      { base: "#f1ecdd", inks: ["#11131a", "#2a3550", "#5c6273", "#11131a", "#9aa0ab", "#11131a"] },
      malachite:{ base: "#07140f", inks: ["#1f6b46", "#3da06a", "#7fd0a0", "#0e3a28", "#d8ecd6", "#1f6b46"] }
    };
    var palName = rng.pick(["indigo", "indigo", "lagoon", "ember", "ink", "malachite"]);
    var P = pals[palName];
    var base = rgb(P.base);
    var inks = P.inks.map(rgb);

    // ---- build the op list (forward order: drop all the ink, THEN comb) ----
    var ops = [];

    // DROPS — each pushes prior ink outward; nesting builds the marble. A jittered grid lays down even
    // coverage (so no bare "open water" voids), then extra random drops + a few big "stones" make it
    // organic. (To FILL the tray the ink area Σπr² must reach ~1.5–2× the canvas, hence many drops.)
    var gridN = rng.int(7, 10);
    for (var gy = 0; gy < gridN; gy++) {
      for (var gx = 0; gx < gridN; gx++) {
        ops.push({
          t: 0,
          cx: (gx + rng.range(0.12, 0.88)) / gridN,
          cy: (gy + rng.range(0.12, 0.88)) / gridN,
          r: rng.range(0.035, 0.07),
          col: inks[rng.int(0, inks.length - 1)]
        });
      }
    }
    var nExtra = rng.int(22, 48);
    for (var i = 0; i < nExtra; i++) {
      var big = rng.bool(0.3);                                       // a few late "stones" give structure
      ops.push({
        t: 0,
        cx: rng.range(-0.02, 1.02),
        cy: rng.range(-0.02, 1.02),
        r: rng.range(0.03, 0.07) * (big ? 1.9 : 1.0),
        col: inks[rng.int(0, inks.length - 1)]
      });
    }

    // COMBS — a periodic sine-shear: points slide along `u` by amp·sin(perp/spacing). One op = a full
    // comb across the tray (perp is invariant under motion along u, so it inverts by negation). Alternating
    // directions give the feathered nonpareil.
    var nCombs = rng.bool(0.82) ? rng.int(1, 3) : 0;     // mostly combed (the hook); a few stay pure stone
    var nTines = rng.bool(0.45) ? rng.int(1, 2) : 0;
    for (var c = 0; c < nCombs; c++) {
      var ang = (c % 2 === 0) ? rng.range(-0.3, 0.3) : rng.range(TAU / 4 - 0.3, TAU / 4 + 0.3);
      var ux = Math.cos(ang), uy = Math.sin(ang);
      ops.push({
        t: 2,
        ux: ux, uy: uy, wx: -uy, wy: ux,                 // w ⊥ u
        s: rng.range(0.035, 0.12),                        // finer spacing → tighter nonpareil feathering
        amp: rng.range(0.02, 0.055),
        phase: rng.range(0, TAU)
      });
    }
    // TINES — single decaying pulls (a stylus drawn through), for occasional drama.
    for (var ti = 0; ti < nTines; ti++) {
      var tang = rng.range(0, TAU);
      var lnx = Math.cos(tang), lny = Math.sin(tang);    // line normal
      ops.push({
        t: 1,
        ax: rng.range(0.2, 0.8), ay: rng.range(0.2, 0.8),
        nlx: lnx, nly: lny,
        dx: -lny, dy: lnx,                               // displacement along the line (⊥ normal)
        u: rng.range(0.05, 0.13) * (rng.bool(0.5) ? 1 : -1),
        k: Math.log(rng.range(0.25, 0.5)),               // decay (ln z, <0)
        lam: rng.range(0.08, 0.18)
      });
    }

    var nOps = ops.length;

    // ---- the inverse render: for each pixel, walk the ops in REVERSE to find its ink ----
    var veinW = 0.006;                                   // dark line where inks meet (the rim of each drop)
    var vein = 0.34;                                     // how dark the vein gets (0..1)
    var paper = Loom.noise(rng.int(1, 999999));          // faint paper tooth, so it reads as a lifted sheet
    var FW = Math.min(S, 900);
    var sc = 1 / FW;
    var marble = Loom.field(FW, function (x, y, out) {
      var nx = (x + 0.5) * sc, ny = (y + 0.5) * sc;
      var col = base, rim = 0;
      for (var k = nOps - 1; k >= 0; k--) {
        var op = ops[k];
        if (op.t === 0) {                                // DROP (inverse)
          var ddx = nx - op.cx, ddy = ny - op.cy;
          var dp = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dp < op.r) {                               // inside this drop's disc → its colour is on top
            col = op.col;
            rim = (op.r - dp < veinW) ? (1 - (op.r - dp) / veinW) : 0;
            break;
          }
          var s2 = Math.sqrt(dp * dp - op.r * op.r) / dp;  // pull the point back inward
          nx = op.cx + ddx * s2; ny = op.cy + ddy * s2;
        } else if (op.t === 2) {                         // COMB (inverse)
          var perp = nx * op.wx + ny * op.wy;
          var disp = op.amp * Math.sin(perp / op.s * TAU + op.phase);
          nx -= op.ux * disp; ny -= op.uy * disp;
        } else {                                         // TINE (inverse)
          var pd = (nx - op.ax) * op.nlx + (ny - op.ay) * op.nly;
          var d2 = op.u * Math.exp(op.k * Math.abs(pd) / op.lam);
          nx -= op.dx * d2; ny -= op.dy * d2;
        }
      }
      var r = col[0], g = col[1], b = col[2];
      if (rim > 0) { var f = 1 - vein * rim; r *= f; g *= f; b *= f; }   // darken the rim → fine vein
      var gg = 0.965 + 0.035 * paper(x * 0.18, y * 0.18);               // faint paper tooth
      out[0] = r * gg; out[1] = g * gg; out[2] = b * gg; out[3] = 255;
    });

    // draw the marble to fill the canvas (near-1:1 → crisp folds, not the soft-field blur)
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(marble, 0, 0, S, S);

    // ---- a soft vignette so the sheet sits in space, not flat against the glass ----
    var vg = ctx.createRadialGradient(S * 0.5, S * 0.5, S * 0.36, S * 0.5, S * 0.5, S * 0.72);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  }
});
