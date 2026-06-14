// Emil's Loom · piece 085 — "Stoop"
//
// A peregrine falcon at the top of its stoop — the hunting dive, the fastest motion in nature — plunging
// down a long diagonal of charged sky toward a fleeing bird far below, the land a hazy floor a thousand
// feet down. The #125 audit caught me parking subjects dead-centre (four of five), so this is the deliberate
// opposite: an OFF-CENTRE, DYNAMIC composition where the whole frame is a diagonal of fall. The read is two
// things, not one (the advisor): it must read as a raptor AND as falling-fast — and speed in a still image
// can't come from the pose alone, so the dive has a CARRIER: a target below (turns "a bird" into "a hunt",
// charges the empty sky into a gulf), the sheer drop, and raking low-sun rim-light. Crisp silhouette on sky
// = good medium-fit (my proven lane). Composes noise + ramp + glow.
Loom.piece({
  id: "085",
  title: "Stoop",
  seed: "peregrine",
  draw: function (stage, rng) {
    var ctx = stage.ctx, S = stage.size, U = S / 760, TAU = 6.2831853;
    var nz = Loom.noise(rng.int(1, 99999));
    var flip = rng.bool() ? 1 : 0;
    function mx(fx) { return (flip ? 1 - fx : fx) * S; }     // mirror the whole composition L<->R per seed

    // ---- seeded composition: predator high on one side, prey low on the other (a long diagonal) ----
    var fx = mx(rng.range(0.60, 0.76)), fy = rng.range(0.15, 0.29) * S;   // the falcon
    var px = mx(rng.range(0.24, 0.42)), py = rng.range(0.52, 0.66) * S;   // the fleeing prey
    var r = rng.range(0.085, 0.115) * S;                                  // falcon scale
    var ang = Math.atan2(py - fy, px - fx);                               // it dives toward the prey
    var horizonY = rng.range(0.85, 0.93) * S;                             // the land, far far below (height)
    var sunFx = flip ? 1 - rng.range(0.12, 0.34) : rng.range(0.12, 0.34); // low sun on the predator's side
    var sunX = sunFx * S, sunY = rng.range(0.16, 0.34) * S;

    // a seeded sky MOOD so "weave another" is a different hour, not just a different dive (085)
    var MOODS = [
      { sky: ["#1f2c44", "#33476a", "#7d7e8e", "#caa777"], flush: "248,206,140", flush2: "228,150,110", land: ["#b69a78", "#6f6a5c", "#3f4444"], haze: "202,167,119" }, // blue dusk
      { sky: ["#2a2f58", "#5a4f7a", "#c07f64", "#f3c073"], flush: "252,206,128", flush2: "236,138,92", land: ["#caa074", "#7a6450", "#43413e"], haze: "230,170,110" },  // golden sunset
      { sky: ["#26303c", "#41505d", "#8a8d92", "#b6ac98"], flush: "226,224,212", flush2: "180,182,176", land: ["#9a958a", "#5e605c", "#363b3c"], haze: "176,176,170" }   // cold overcast
    ];
    var mood = rng.pick(MOODS);

    // ---- charged high-altitude sky (NOT flat blue — the hook is drama, so the light serves drama) ----
    var sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, mood.sky[0]); sky.addColorStop(0.45, mood.sky[1]); sky.addColorStop(0.8, mood.sky[2]); sky.addColorStop(1, mood.sky[3]);
    ctx.fillStyle = sky; ctx.fillRect(0, 0, S, horizonY);
    // a sun-flush low on the predator's side
    var flush = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 0.6 * S);
    flush.addColorStop(0, "rgba(" + mood.flush + ",0.5)"); flush.addColorStop(0.5, "rgba(" + mood.flush2 + ",0.12)"); flush.addColorStop(1, "rgba(" + mood.flush2 + ",0)");
    ctx.fillStyle = flush; ctx.fillRect(0, 0, S, horizonY);

    // ---- the land, a hazy floor a long way down ----
    var land = ctx.createLinearGradient(0, horizonY, 0, S);
    land.addColorStop(0, mood.land[0]); land.addColorStop(0.4, mood.land[1]); land.addColorStop(1, mood.land[2]);
    ctx.fillStyle = land; ctx.fillRect(0, horizonY, S, S - horizonY);
    var haze = ctx.createLinearGradient(0, horizonY - 0.05 * S, 0, horizonY + 0.04 * S);
    haze.addColorStop(0, "rgba(" + mood.haze + ",0)"); haze.addColorStop(1, "rgba(" + mood.haze + ",0.55)");
    ctx.fillStyle = haze; ctx.fillRect(0, horizonY - 0.05 * S, S, 0.1 * S);

    // ---- the fleeing prey: a small bird banking away (the dive's destination — its stakes) ----
    function smallBird(bx, by, bs, banking) {
      ctx.fillStyle = "#222732";
      ctx.beginPath(); ctx.ellipse(bx, by, bs, bs * 0.4, banking, 0, TAU); ctx.fill();   // little body
      ctx.lineWidth = bs * 0.34; ctx.strokeStyle = "#222732"; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(bx - bs * 1.7 * Math.cos(banking), by - bs * 1.7 * Math.sin(banking) - bs);
      ctx.quadraticCurveTo(bx, by - bs * 0.3, bx + bs * 1.7 * Math.cos(banking), by - bs * 1.7 * Math.sin(banking) - bs * 0.6);
      ctx.stroke();
    }
    smallBird(px, py, r * 0.16, rng.range(-0.5, 0.5));

    // ---- the falcon, mid-stoop: swept-back-but-still-winged, taut, talons just beginning to extend ----
    function falcon(cx, cy, rr, a, rim) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
      ctx.fillStyle = "#1a1d26";
      // slender body tapering to a clear TAIL SPIKE (head forward at +x, tail at -x)
      ctx.beginPath();
      ctx.moveTo(1.05 * rr, 0);
      ctx.bezierCurveTo(0.5 * rr, -0.095 * rr, -0.2 * rr, -0.07 * rr, -1.5 * rr, -0.012 * rr);
      ctx.bezierCurveTo(-0.2 * rr, 0.07 * rr, 0.5 * rr, 0.095 * rr, 1.05 * rr, 0);
      ctx.closePath(); ctx.fill();
      // two swept-back POINTED wings — tips pulled well back (taut stoop, not a wide glide)
      for (var s = -1; s <= 1; s += 2) {
        ctx.beginPath();
        ctx.moveTo(0.38 * rr, s * 0.05 * rr);
        ctx.bezierCurveTo(0.16 * rr, s * 0.36 * rr, -0.3 * rr, s * 0.62 * rr, -0.72 * rr, s * 0.74 * rr);   // pointed tip, swept well back
        ctx.bezierCurveTo(-0.5 * rr, s * 0.42 * rr, -0.32 * rr, s * 0.18 * rr, -0.52 * rr, s * 0.07 * rr);  // concave trailing edge -> body
        ctx.bezierCurveTo(-0.2 * rr, s * 0.05 * rr, 0.14 * rr, s * 0.05 * rr, 0.38 * rr, s * 0.05 * rr);
        ctx.closePath(); ctx.fill();
      }
      // a small clean head + beak at the front (reads as a bird, no bulbous blob)
      ctx.beginPath(); ctx.ellipse(0.84 * rr, 0, 0.13 * rr, 0.1 * rr, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(1.02 * rr, -0.01 * rr); ctx.lineTo(1.18 * rr, 0.025 * rr); ctx.lineTo(0.98 * rr, 0.055 * rr); ctx.closePath(); ctx.fill();
      // a thin warm rim where the low sun catches the leading edge (subtle — drama, not a bold graphic)
      if (rim) {
        ctx.strokeStyle = "rgba(252,216,156,0.55)"; ctx.lineWidth = 0.022 * rr; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(0.34 * rr, rim * 0.08 * rr);
        ctx.bezierCurveTo(0.16 * rr, rim * 0.38 * rr, -0.3 * rr, rim * 0.62 * rr, -0.7 * rr, rim * 0.72 * rr); ctx.stroke();
        ctx.fillStyle = "rgba(252,216,156,0.5)"; ctx.beginPath(); ctx.arc(0.92 * rr, rim * 0.03 * rr, 0.04 * rr, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    // motion-blur ghosts trailing behind = the speed carrier (the dive reads as FAST, not perched)
    var dvx = Math.cos(ang), dvy = Math.sin(ang);
    var rimSign = Math.sin(Math.atan2(sunY - fy, sunX - fx) - ang) >= 0 ? 1 : -1;   // which edge faces the sun
    ctx.globalAlpha = 0.1; falcon(fx - dvx * 0.55 * r, fy - dvy * 0.55 * r, r, ang, 0);
    ctx.globalAlpha = 0.2; falcon(fx - dvx * 0.28 * r, fy - dvy * 0.28 * r, r, ang, 0);
    ctx.globalAlpha = 1; falcon(fx, fy, r, ang, rimSign);
  }
});
