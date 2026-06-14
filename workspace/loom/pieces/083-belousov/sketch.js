// Emil's Loom · piece 083 — "Belousov"
//
// An excitable medium: the Belousov-Zhabotinsky reaction, where a dish of chemistry won't settle to
// equilibrium but instead pulses — blue oxidation waves sweeping across a red ground, again and again.
// The same maths runs in heart tissue (the spiral that drives fibrillation) and in slime colonies. Each
// cell is excitable -> excited -> a refractory recovery -> excitable again, and a cell fires when enough
// neighbours are firing. From a few broken wavefronts (rotors) the medium self-organises into ROTATING
// SPIRAL WAVES that nobody placed. The Loom's cousin to Turing #016 (also a grid that grows its own
// pattern) but ALIVE where Turing freezes. The hook is the rotation around the spiral CORES — the phase
// singularities everything turns around (090: reveal the emergent structure, not the bare pattern).
//
// Greenberg-Hastings rule on a toroidal grid; rotor-seeded so spirals form in a few steps (cheap pre-roll).
// Animated as advanceTo(t) (consistent speed, reproducible, catch-up clamped); the gallery shows a static
// pre-rolled frame, it does NOT self-drive a live sim in the grid (the Quicksilver lesson, 092/Q10).
Loom.piece({
  id: "083",
  title: "Belousov",
  seed: "rotor",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size;

    var G = 200;                 // simulation grid (upscaled to S)
    var N = 16;                  // cycle length: 0 resting, 1 excited (the front), 2..N-1 refractory.
                                 //   sets arm spacing -> spiral size (a field of medium spirals, each with a clear core)
    var RAD = 2.6;               // circular neighbourhood radius — ROUND (not square) wavefronts
    var THRESH = 1;              // excited neighbours within RAD needed for a resting cell to fire
    var STEP_RATE = 10;          // CA steps per second (rotation speed)
    var PREROLL = 92;            // steps advanced before frame(0) — so the gallery preview shows spirals
    var MAX_CATCHUP = 12;        // cap steps per frame() call (a backgrounded tab must not hitch)

    var cells = new Int16Array(G * G);
    var next = new Int16Array(G * G);

    // ---- seed broken-wavefront rotors: a phase wheel around each centre = an instant spiral core ----
    var R = rng.int(4, 6);       // a handful of rotors -> a field of spiral waves, each a clear core
    var rot = [];
    for (var r = 0; r < R; r++) rot.push({ x: rng.range(0.14, 0.86) * G, y: rng.range(0.14, 0.86) * G, chir: rng.bool() ? 1 : -1 });
    for (var y = 0; y < G; y++) for (var x = 0; x < G; x++) {
      var best = 1e9, bj = 0;
      for (var j = 0; j < R; j++) { var dx = x - rot[j].x, dy = y - rot[j].y, d = dx * dx + dy * dy; if (d < best) { best = d; bj = j; } }
      var rr = rot[bj];
      var ang = Math.atan2((y - rr.y) * rr.chir, (x - rr.x));     // chirality flips the winding
      var ph = ang / (2 * Math.PI) + 0.5;                          // 0..1 around the core
      cells[y * G + x] = Math.floor(ph * N) % N;
    }

    // circular neighbourhood offsets, precomputed once — isotropic propagation (round wavefronts)
    var NBx = [], NBy = [], _ri = Math.ceil(RAD);
    for (var oy = -_ri; oy <= _ri; oy++) for (var ox = -_ri; ox <= _ri; ox++) {
      if ((ox || oy) && ox * ox + oy * oy <= RAD * RAD) { NBx.push(ox); NBy.push(oy); }
    }
    var NBN = NBx.length;

    // ---- one Greenberg-Hastings step (toroidal wrap, no boundary band to crop) ----
    function step() {
      for (var y = 0; y < G; y++) {
        var yc = y * G;
        for (var x = 0; x < G; x++) {
          var s = cells[yc + x];
          if (s !== 0) { next[yc + x] = (s + 1) % N; continue; }   // excited/refractory advance automatically
          var c = 0;
          for (var n = 0; n < NBN; n++) {
            var nx = x + NBx[n]; if (nx < 0) nx += G; else if (nx >= G) nx -= G;
            var ny = y + NBy[n]; if (ny < 0) ny += G; else if (ny >= G) ny -= G;
            if (cells[ny * G + nx] === 1) { c++; if (c >= THRESH) break; }
          }
          next[yc + x] = c >= THRESH ? 1 : 0;
        }
      }
      var tmp = cells; cells = next; next = tmp;
    }

    // ---- the REVEAL (090): a thin bright wavefront fading fast into the warm recovered ground.
    // Blue oxidation waves on a red reduced field — the look of the real BZ dish — so the spiral CORES
    // read as the still points the glowing arms wind into, not flat rainbow bands of a CA demo. ----
    var REST = "#481810";                                          // warm reduced ground (resting medium)
    var wave = Loom.ramp(["#eef5ff", "#abd9ff", "#4f93de", "#27508d", "#3a1b2c", REST]);  // front -> blue -> ground
    var WAVELEN = 8;                                               // states the visible wave spans (then back to REST)
    var LUT = new Uint8Array(N * 3), _rgb = [0, 0, 0], _rest = [0, 0, 0];
    wave.rgb(1, _rest);
    for (var s = 0; s < N; s++) {
      if (s === 0 || s > WAVELEN) { LUT[s * 3] = _rest[0] | 0; LUT[s * 3 + 1] = _rest[1] | 0; LUT[s * 3 + 2] = _rest[2] | 0; }
      else { wave.rgb((s - 1) / (WAVELEN - 1), _rgb); LUT[s * 3] = _rgb[0] | 0; LUT[s * 3 + 1] = _rgb[1] | 0; LUT[s * 3 + 2] = _rgb[2] | 0; }
    }

    var off = document.createElement("canvas");
    off.width = G; off.height = G;
    var octx = off.getContext("2d");
    var img = octx.createImageData(G, G);
    var data = img.data;
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    function render() {
      for (var i = 0; i < G * G; i++) {
        var b = cells[i] * 3, p = i * 4;
        data[p] = LUT[b]; data[p + 1] = LUT[b + 1]; data[p + 2] = LUT[b + 2]; data[p + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.filter = "blur(" + (0.6 * S / G).toFixed(2) + "px)";   // round the grid kinks + glow the front
      ctx.drawImage(off, 0, 0, G, G, 0, 0, S, S);
      ctx.filter = "none";
    }

    // ---- time -> step mapping: consistent speed, reproducible, clamped catch-up ----
    var cur = 0;
    function stepN(n) { for (var k = 0; k < n; k++) step(); cur += n; }
    stepN(PREROLL);                              // unclamped pre-roll so frame(0) is already developed
    render();

    return function frame(t) {
      var target = PREROLL + Math.floor(t * STEP_RATE);
      if (target > cur) {
        var steps = Math.min(target - cur, MAX_CATCHUP);
        for (var k = 0; k < steps; k++) step();
        cur = target;                            // skip any beyond the clamp (refocus jump, never a hitch)
      }
      render();
    };
  }
});
