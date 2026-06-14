// Emil's Loom · piece 100 — "Bolide"
//
// A bolide is a fireball that goes off like a flare — a meteor bright enough to throw shadows, burning so
// hard it fragments, trailing a glowing wake of ionized air down the night sky. This one tears across a dark
// landscape at a steep diagonal: a white-hot head, a long luminous train graded from blue-white through
// ionized green to a smouldering copper tail, a few fragments shed off the head with their own little wakes,
// and the whole sky and the ridgeline lit for the one second it lasts. The hook is DRAMA / event-light — the
// brief violent instant (my Strike/Maw/Supernova lane), NOT a structural reveal (the #145 Q7 steer, varying
// off Venation+Quasicrystal). Glow-on-dark is the medium this is built for (037/045/056): additive light
// first, the opaque land laid on top to occlude. Chosen by the #145 choosing-breaker — the first genuine
// strong-zone pull, no survey. Self-directed; no advisor (no fork, 099). Composes glow + ramp + noise.
Loom.piece({
  id: "100",
  title: "Bolide",
  seed: "perseid",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));

    // ---- seed params: trajectory, colour, fragments, terrain ----
    var flip = rng.bool() ? 1 : -1;
    var head = [(0.5 + flip * rng.range(0.06, 0.20)) * S, rng.range(0.44, 0.56) * S];
    var A = rng.range(0.52, 0.82);                      // descent angle below horizontal
    var dir = [flip * Math.cos(A), Math.sin(A)];        // travel direction (down-flipward), unit
    var perp = [-dir[1], dir[0]];
    var L = rng.range(0.44, 0.62) * S;                  // train length
    var tail = [head[0] - dir[0] * L, head[1] - dir[1] * L];
    var horizonY = rng.range(0.73, 0.82) * S;
    var nFrag = rng.int(2, 5);

    var MOODS = [
      ["#eef6ff", "#bfe6ff", "#7dffb0", "#a6ff5e", "#ffd24a", "#dd6a1e"],   // emerald (the classic ionized bolide)
      ["#fff1e2", "#ffd9a0", "#ffae54", "#ff7e2e", "#e8531a", "#9c2a10"],   // copper
      ["#f1f8ff", "#cfeaff", "#9fd0ff", "#88b4ff", "#9a86ff", "#b890ff"]    // azure
    ];
    var moodI = rng.int(0, MOODS.length - 1);
    var trainRamp = Loom.ramp(MOODS[moodI]);
    var midHue = MOODS[moodI][2];                        // the train's signature glow colour
    var _c = [0, 0, 0];
    function thex(t) { trainRamp.rgb(Math.max(0, Math.min(1, t)), _c); return "#" + ((1 << 24) + ((_c[0] | 0) << 16) + ((_c[1] | 0) << 8) + (_c[2] | 0)).toString(16).slice(1); }
    function tcss(t, a) { trainRamp.rgb(Math.max(0, Math.min(1, t)), _c); return "rgba(" + (_c[0] | 0) + "," + (_c[1] | 0) + "," + (_c[2] | 0) + "," + a + ")"; }

    // path point at u in [0,1] (0=tail, 1=head), with a gentle turbulent wobble that disperses toward the tail
    function pathPt(u) {
      var bx = tail[0] + (head[0] - tail[0]) * u, by = tail[1] + (head[1] - tail[1]) * u;
      var wob = (nz.fbm(u * 6, 2.2, 2) - 0.5) * 0.06 * S * (1 - u * 0.6);
      return [bx + perp[0] * wob, by + perp[1] * wob];
    }

    // =========================================================================
    //  SKY + STARS
    // =========================================================================
    var sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, "#05070e"); sky.addColorStop(0.7, "#080d1a"); sky.addColorStop(1, "#0c1626");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, horizonY);

    for (var i = 0; i < 280; i++) {
      var sx = rng.range(0, S), sy = rng.range(0, horizonY - 2);
      var dim = Math.min(1, Math.hypot(sx - head[0], sy - head[1]) / S * 1.6);   // washed out near the fireball
      var b = rng.range(0.2, 1) * dim;
      if (b < 0.12) continue;
      ctx.fillStyle = "rgba(222,234,255," + (b * 0.9).toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(sx, sy, rng.range(0.3, 1.2), 0, TAU); ctx.fill();
    }

    // ---- the fireball lights the surrounding sky + pools at the horizon it's heading for ----
    var groundX = head[0] + dir[0] * ((horizonY - head[1]) / dir[1]);
    ctx.globalCompositeOperation = "lighter";
    Loom.glow(ctx, head[0], head[1], 0.52 * S, "#bcd8ff", 0.17, 0.85);
    Loom.glow(ctx, head[0], head[1], 0.30 * S, midHue, 0.15, 0.82);
    Loom.glow(ctx, groundX, horizonY, 0.34 * S, midHue, 0.12, 0.9);     // light pooling toward the horizon
    ctx.globalCompositeOperation = "source-over";

    // =========================================================================
    //  LANDSCAPE (opaque, laid on top to occlude — additive can't be darkened, 056)
    // =========================================================================
    var step = 4, ridge = [];
    for (var x = 0; x <= S; x += step) {
      ridge.push([x, horizonY - nz.fbm(x * 0.0045, 7.3, 4) * 0.12 * S - 5]);
    }
    ctx.beginPath(); ctx.moveTo(0, S); ctx.lineTo(ridge[0][0], ridge[0][1]);
    for (var r1 = 1; r1 < ridge.length; r1++) ctx.lineTo(ridge[r1][0], ridge[r1][1]);
    ctx.lineTo(S, S); ctx.closePath();
    ctx.fillStyle = "#03050b"; ctx.fill();

    // lit rim where the fireball's light rakes the ridge crest (045) — a smooth glow brightest under the fireball
    ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    var rimG = ctx.createLinearGradient(groundX - 0.55 * S, 0, groundX + 0.55 * S, 0);
    rimG.addColorStop(0, tcss(0.14, 0)); rimG.addColorStop(0.5, tcss(0.18, 0.6)); rimG.addColorStop(1, tcss(0.14, 0));
    ctx.strokeStyle = rimG; ctx.lineWidth = 2.3;
    ctx.beginPath(); ctx.moveTo(ridge[0][0], ridge[0][1]);
    for (var r2 = 1; r2 < ridge.length; r2++) ctx.lineTo(ridge[r2][0], ridge[r2][1]);
    ctx.stroke();

    // =========================================================================
    //  THE TRAIN — a glowing wake, faint+thin at the tail, brilliant+fat at the head
    // =========================================================================
    var N = 84;
    for (var k = 0; k <= N; k++) {
      var u = k / N, p = pathPt(u);
      Loom.glow(ctx, p[0], p[1], (0.005 + 0.028 * u * u) * S, thex(1 - u), 0.07 + 0.62 * u * u, 0.82);
    }
    // the incandescent core line down the middle
    var cg = ctx.createLinearGradient(tail[0], tail[1], head[0], head[1]);
    cg.addColorStop(0, tcss(1, 0)); cg.addColorStop(0.55, tcss(0.45, 0.45)); cg.addColorStop(1, "rgba(255,255,255,0.95)");
    ctx.strokeStyle = cg; ctx.lineWidth = 0.009 * S; ctx.lineCap = "round";
    ctx.beginPath();
    for (var k2 = 0; k2 <= N; k2++) { var p2 = pathPt(k2 / N); if (k2 === 0) ctx.moveTo(p2[0], p2[1]); else ctx.lineTo(p2[0], p2[1]); }
    ctx.stroke();

    // =========================================================================
    //  FRAGMENTS — shed off the head, each with its own little wake
    // =========================================================================
    for (var f = 0; f < nFrag; f++) {
      var fu = rng.range(0.6, 0.9), al = pathPt(fu);
      var off = rng.range(-1, 1) * 0.05 * S;
      var fhead = [al[0] + perp[0] * off, al[1] + perp[1] * off];
      var dv = rng.range(-0.28, 0.28);                  // diverge the fragment's path slightly
      var fdir = [dir[0] * Math.cos(dv) - dir[1] * Math.sin(dv), dir[0] * Math.sin(dv) + dir[1] * Math.cos(dv)];
      var fL = rng.range(0.06, 0.17) * S;
      var ft = [fhead[0] - fdir[0] * fL, fhead[1] - fdir[1] * fL], M = 18;
      for (var m = 0; m <= M; m++) {
        var mu = m / M, mp = [ft[0] + (fhead[0] - ft[0]) * mu, ft[1] + (fhead[1] - ft[1]) * mu];
        Loom.glow(ctx, mp[0], mp[1], (0.003 + 0.012 * mu) * S, thex((1 - mu) * 0.85), 0.05 + 0.32 * mu, 0.8);
      }
      Loom.glow(ctx, fhead[0], fhead[1], 0.03 * S, "#eaf4ff", 0.85, 0.55);
      ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.beginPath(); ctx.arc(fhead[0], fhead[1], 0.005 * S, 0, TAU); ctx.fill();
    }

    // =========================================================================
    //  THE HEAD — brilliant, white-hot
    // =========================================================================
    Loom.glow(ctx, head[0], head[1], 0.12 * S, midHue, 0.5, 0.72);
    Loom.glow(ctx, head[0], head[1], 0.07 * S, "#eaf4ff", 0.95, 0.6);
    Loom.glow(ctx, head[0], head[1], 0.032 * S, "#ffffff", 1.0, 0.5);
    ctx.fillStyle = "rgba(255,255,255,0.98)"; ctx.beginPath(); ctx.arc(head[0], head[1], 0.011 * S, 0, TAU); ctx.fill();

    // ---- sparks flung off near the head ----
    for (var sp = 0; sp < 44; sp++) {
      var su = rng.range(0.5, 1.0), sb = pathPt(su);
      var soff = rng.range(-1, 1) * 0.045 * S * (1 - su + 0.2);
      var spx = sb[0] + perp[0] * soff + rng.range(-1, 1) * 0.01 * S, spy = sb[1] + perp[1] * soff + rng.range(-1, 1) * 0.01 * S;
      ctx.fillStyle = tcss(rng.range(0, 0.5), rng.range(0.3, 0.9));
      ctx.beginPath(); ctx.arc(spx, spy, rng.range(0.4, 1.4), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    // ---- a final vignette, centred on the fireball ----
    var vig = ctx.createRadialGradient(head[0], head[1], 0.2 * S, S * 0.5, S * 0.55, 0.86 * S);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,3,0.5)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);
  }
});
