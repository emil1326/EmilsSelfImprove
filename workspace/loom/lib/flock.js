// Emil's Loom — primitive #12: flock (3D boids, the motion of a murmuration).
//
// Reynolds' three rules — separation, alignment, cohesion — with the one twist that turns
// "a boids demo" into "starlings": each bird steers by its ~k NEAREST neighbours
// (TOPOLOGICAL), not by everyone inside a fixed radius (metric). Real starlings track a
// fixed count of neighbours regardless of how far they are (Ballerini/Cavagna, 2008), and
// that is what gives a murmuration its soul: density waves rippling through the mass, the
// shimmer, a sharp morphing boundary — instead of a uniform orbiting blob. Metric radius
// can't do that; topological can.
//
// It owns the MOTION only. It exposes flat state arrays (x/y/z + vx/vy/vz) and a step();
// the caller reads them and draws however it likes — dots, oriented marks, anything
// ([[023-primitive-returns-state-not-pixels]]). The step is DETERMINISTIC (the only
// randomness is the seeded setup), so a piece built on it reproduces from its seed
// ([[017-animation-seed-setup-once]], [[007-seed-all-randomness]]). A uniform grid with
// ring-expansion finds the k nearest in ~O(n) even though the flock clumps hard. No
// per-step allocation (hot loop runs thousands of birds × 60fps).
//
// Classic script on window.Loom — see lib/rng.js for why (no ES modules over file://).
(function (Loom) {
  Loom.flock = function (rng, opts) {
    opts = opts || {};
    var n   = opts.n   || 800;
    var W   = opts.w   || 1000, H = opts.h || 1000, D = opts.d || 600;  // the box it flies in
    var k   = opts.k   || 7;                       // topological neighbours
    var REF = Math.max(W, H);
    var maxSpeed = opts.maxSpeed != null ? opts.maxSpeed : 0.010 * REF;
    var minSpeed = opts.minSpeed != null ? opts.minSpeed : 0.006 * REF;  // birds keep flying
    var maxForce = opts.maxForce != null ? opts.maxForce : 0.0014 * REF;
    var sepDist  = opts.sepDist  != null ? opts.sepDist  : 0.022 * REF;  // personal space
    var wSep = opts.sep != null ? opts.sep : 1.7;
    var wAli = opts.ali != null ? opts.ali : 1.0;
    var wCoh = opts.coh != null ? opts.coh : 0.9;
    var margin = opts.margin != null ? opts.margin : 0.28;   // free-roam zone (frac of box half-extent)
    var wander = opts.wander != null ? opts.wander : 0.45;   // how much the mass roams

    // soft radial "bowl": the flock roams freely inside R0 of the box ellipsoid and is gently
    // turned back toward centre past it — keeps it framed without a point-attractor (which would
    // pull it into a round blob), and without per-axis walls (which let it slide a flat edge).
    var cxC = W / 2, cyC = H / 2, czC = D / 2;
    var hx2 = cxC * cxC, hy2 = cyC * cyC, hz2 = czC * czC;
    var R0 = 1 - margin, turn = maxForce * 2.4;

    // optional predator — a hunter that homes on the flock's centre of mass. Birds flee it,
    // which carves holes and sends agitation WAVES rippling through the mass: the thing a
    // murmuration is really about. A lagging chase (it's a touch slower than the birds) so it
    // never quite catches and the flock swirls around it. Deterministic; the caller can read
    // .pred.{x,y,z} to draw it. Off unless opts.predator is set.
    var hasPred = !!opts.predator, pOpt = opts.predator || {};
    var pRad   = pOpt.radius != null ? pOpt.radius : 0.22 * REF;
    var pForce = pOpt.force  != null ? pOpt.force  : maxForce * 11;
    var pSpeed = pOpt.speed  != null ? pOpt.speed  : maxSpeed * 1.05;
    var ppx = cxC + (rng.bool() ? 1 : -1) * W * 0.42, ppy = cyC, ppz = czC, pvx = 0, pvy = 0, pvz = 0;

    // gentle global cohesion (spring toward the centroid) — a bird 0.3·REF out feels `center`
    // worth of maxForce; near birds feel almost nothing, so it binds without rounding the shape
    var cReturn = (opts.center != null ? opts.center : 0.6) * maxForce / (0.3 * REF);

    var px = new Float32Array(n), py = new Float32Array(n), pz = new Float32Array(n);
    var vx = new Float32Array(n), vy = new Float32Array(n), vz = new Float32Array(n);
    var ax = new Float32Array(n), ay = new Float32Array(n), az = new Float32Array(n);

    // seed a loose cluster near the middle, velocities in random 3D directions (no net drift,
    // so it organises in place instead of shooting off to a wall; alignment soon coheres them)
    for (var i = 0; i < n; i++) {
      px[i] = W * 0.5 + rng.gaussian() * W * 0.12;
      py[i] = H * 0.5 + rng.gaussian() * H * 0.10;
      pz[i] = D * 0.5 + rng.gaussian() * D * 0.12;
      var a = rng.range(0, 6.2831853), el = rng.range(-0.4, 0.4), sp = (minSpeed + maxSpeed) * 0.5;
      vx[i] = Math.cos(a) * Math.cos(el) * sp;
      vy[i] = Math.sin(el) * sp;
      vz[i] = Math.sin(a) * Math.cos(el) * sp;
    }

    // seeded wander oscillators (deterministic per step → reproducible)
    var w1 = rng.range(0.004, 0.009), w2 = rng.range(0.003, 0.007), w3 = rng.range(0.005, 0.011);
    var pH1 = rng.range(0, 6.28), pH2 = rng.range(0, 6.28), pH3 = rng.range(0, 6.28);

    // --- spatial grid (rebuilt each step) ---
    var cell = Math.max(sepDist * 1.6, REF / 36);
    var gx = Math.max(1, Math.ceil(W / cell)), gy = Math.max(1, Math.ceil(H / cell)), gz = Math.max(1, Math.ceil(D / cell));
    var head = new Int32Array(gx * gy * gz), next = new Int32Array(n);
    var cix = new Int16Array(n), ciy = new Int16Array(n), ciz = new Int16Array(n);
    function clampi(v, hi) { return v < 0 ? 0 : v > hi ? hi : v; }
    function rebuild() {
      head.fill(-1);
      for (var i = 0; i < n; i++) {
        var cx = clampi((px[i] / cell) | 0, gx - 1), cy = clampi((py[i] / cell) | 0, gy - 1), cz = clampi((pz[i] / cell) | 0, gz - 1);
        cix[i] = cx; ciy[i] = cy; ciz[i] = cz;
        var c = (cx * gy + cy) * gz + cz;
        next[i] = head[c]; head[c] = i;
      }
    }

    // k-nearest scratch (reused; we keep the k smallest squared-distances seen)
    var nbI = new Int32Array(k), nbD = new Float64Array(k);
    var stepCount = 0;

    function step() {
      rebuild();
      // flock centroid — for the predator's hunt AND a gentle global cohesion that keeps the
      // whole mass from fragmenting into separate clumps (topological cohesion is local only,
      // so once a piece splits off nothing pulls it home; a weak centre-pull binds them as one)
      var mX = 0, mY = 0, mZ = 0;
      for (var ci = 0; ci < n; ci++) { mX += px[ci]; mY += py[ci]; mZ += pz[ci]; }
      mX /= n; mY /= n; mZ /= n;
      if (hasPred) {
        var hX = mX - ppx, hY = mY - ppy, hZ = mZ - ppz, hmg = Math.sqrt(hX * hX + hY * hY + hZ * hZ) || 1e-4;
        // weak steering → a WIDE turn radius, so it overshoots through the flock and loops out
        // for another pass instead of orbiting tightly in the centre (which made a static ring)
        pvx += hX / hmg * maxForce * 0.6; pvy += hY / hmg * maxForce * 0.6; pvz += hZ / hmg * maxForce * 0.6;
        // constant speed (always normalise, don't just cap) so it overshoots THROUGH the flock
        // and loops back for another pass, instead of decelerating and parking in the centre
        var psp = Math.sqrt(pvx * pvx + pvy * pvy + pvz * pvz) || 1e-4, pcl = pSpeed / psp;
        pvx *= pcl; pvy *= pcl; pvz *= pcl;
        ppx += pvx; ppy += pvy; ppz += pvz;
      }
      // a slow common "intent" so the whole mass roams and keeps maneuvering instead of
      // settling into a still blob — deterministic from the step counter (reproducible).
      var t = stepCount;
      var wx = Math.sin(t * w1 + pH1) * maxForce * wander;
      var wy = Math.cos(t * w2 + pH2) * maxForce * wander * 0.5;
      var wz = Math.sin(t * w3 + pH3) * maxForce * wander;

      // ---- pass 1: accelerations from a snapshot (synchronous, order-independent) ----
      for (var i = 0; i < n; i++) {
        var cx = cix[i], cy = ciy[i], cz = ciz[i];
        var cnt = 0, worst = -1;
        // widen the ring until we have k candidates (the flock clumps, so r=1 usually suffices)
        for (var r = 1; r <= 4; r++) {
          cnt = 0; worst = -1;
          var x0 = cx - r < 0 ? 0 : cx - r, x1 = cx + r > gx - 1 ? gx - 1 : cx + r;
          var y0 = cy - r < 0 ? 0 : cy - r, y1 = cy + r > gy - 1 ? gy - 1 : cy + r;
          var z0 = cz - r < 0 ? 0 : cz - r, z1 = cz + r > gz - 1 ? gz - 1 : cz + r;
          for (var bx = x0; bx <= x1; bx++)
            for (var by = y0; by <= y1; by++)
              for (var bz = z0; bz <= z1; bz++)
                for (var j = head[(bx * gy + by) * gz + bz]; j !== -1; j = next[j]) {
                  if (j === i) continue;
                  var dx = px[j] - px[i], dy = py[j] - py[i], dz = pz[j] - pz[i];
                  var d2 = dx * dx + dy * dy + dz * dz;
                  if (cnt < k) {
                    nbI[cnt] = j; nbD[cnt] = d2; cnt++;
                    if (cnt === k) { worst = 0; for (var q = 1; q < k; q++) if (nbD[q] > nbD[worst]) worst = q; }
                  } else if (d2 < nbD[worst]) {
                    nbI[worst] = j; nbD[worst] = d2;
                    worst = 0; for (var q2 = 1; q2 < k; q2++) if (nbD[q2] > nbD[worst]) worst = q2;
                  }
                }
          if (cnt >= k) break;
        }

        // accumulate cohesion (avg pos), alignment (avg vel), separation (sum of away)
        var cX = 0, cY = 0, cZ = 0, aX = 0, aY = 0, aZ = 0, sX = 0, sY = 0, sZ = 0;
        for (var s = 0; s < cnt; s++) {
          var jj = nbI[s];
          cX += px[jj]; cY += py[jj]; cZ += pz[jj];
          aX += vx[jj]; aY += vy[jj]; aZ += vz[jj];
          var dd = Math.sqrt(nbD[s]) || 1e-4;
          if (dd < sepDist) { var sw = (sepDist - dd) / sepDist / dd; sX += (px[i] - px[jj]) * sw; sY += (py[i] - py[jj]) * sw; sZ += (pz[i] - pz[jj]) * sw; }
        }

        var axi = wx, ayi = wy, azi = wz, m, sc;
        axi += (mX - px[i]) * cReturn; ayi += (mY - py[i]) * cReturn; azi += (mZ - pz[i]) * cReturn;
        if (cnt > 0) {
          var inv = 1 / cnt;
          // cohesion: steer toward neighbours' centre (limited to maxForce)
          var chx = cX * inv - px[i], chy = cY * inv - py[i], chz = cZ * inv - pz[i];
          m = Math.sqrt(chx * chx + chy * chy + chz * chz); if (m > maxForce) { sc = maxForce / m; chx *= sc; chy *= sc; chz *= sc; }
          // alignment: steer toward neighbours' average velocity
          var alx = aX * inv - vx[i], aly = aY * inv - vy[i], alz = aZ * inv - vz[i];
          m = Math.sqrt(alx * alx + aly * aly + alz * alz); if (m > maxForce) { sc = maxForce / m; alx *= sc; aly *= sc; alz *= sc; }
          axi += chx * wCoh + alx * wAli; ayi += chy * wCoh + aly * wAli; azi += chz * wCoh + alz * wAli;
        }
        // flee the predator — a strong panic (not force-limited), ramping up as it nears
        if (hasPred) {
          var fdx = px[i] - ppx, fdy = py[i] - ppy, fdz = pz[i] - ppz, fd2 = fdx * fdx + fdy * fdy + fdz * fdz;
          if (fd2 < pRad * pRad) { var fd = Math.sqrt(fd2) || 1e-4, ff = pForce * (1 - fd / pRad) / fd; axi += fdx * ff; ayi += fdy * ff; azi += fdz * ff; }
        }
        // separation (limited to maxForce)
        m = Math.sqrt(sX * sX + sY * sY + sZ * sZ); if (m > maxForce) { sc = maxForce / m; sX *= sc; sY *= sc; sZ *= sc; }
        ax[i] = axi + sX * wSep; ay[i] = ayi + sY * wSep; az[i] = azi + sZ * wSep;
      }

      // ---- pass 2: integrate + soft boundaries + speed clamp ----
      for (var p = 0; p < n; p++) {
        vx[p] += ax[p]; vy[p] += ay[p]; vz[p] += az[p];
        var ex = px[p] - cxC, ey = py[p] - cyC, ez = pz[p] - czC;
        var rr = Math.sqrt(ex * ex / hx2 + ey * ey / hy2 + ez * ez / hz2);   // 1 at the box face
        if (rr > R0) {
          var bf = turn * (rr - R0) / (1 - R0), dm = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1e-4;
          vx[p] -= ex / dm * bf; vy[p] -= ey / dm * bf; vz[p] -= ez / dm * bf;
        }
        var spd = Math.sqrt(vx[p] * vx[p] + vy[p] * vy[p] + vz[p] * vz[p]) || 1e-4;
        var cl = spd < minSpeed ? minSpeed / spd : spd > maxSpeed ? maxSpeed / spd : 1;
        vx[p] *= cl; vy[p] *= cl; vz[p] *= cl;
        px[p] += vx[p]; py[p] += vy[p]; pz[p] += vz[p];
      }
      stepCount++;
    }

    return {
      n: n, w: W, h: H, d: D,
      x: px, y: py, z: pz, vx: vx, vy: vy, vz: vz,
      step: step,
      pred: hasPred ? { get x() { return ppx; }, get y() { return ppy; }, get z() { return ppz; }, get vx() { return pvx; }, get vy() { return pvy; }, get vz() { return pvz; } } : null,
      get steps() { return stepCount; }
    };
  };
})((window.Loom = window.Loom || {}));
