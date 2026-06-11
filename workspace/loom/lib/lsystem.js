// Emil's Loom — primitive #5: L-systems (string rewriting) + a turtle to draw them.
//
// The classic engine behind plants, ferns, corals, Koch/Hilbert/dragon curves — any
// form built by repeatedly rewriting a string and then interpreting it as turtle
// moves. Reproducible: stochastic rules draw from the passed Loom.RNG.
//
//   Loom.lsystem(axiom, rules, iterations, rng) → expanded string
//     rules[c] = "replacement"  OR  ["opt1","opt2",…] (one picked per occurrence via rng)
//
//   Loom.turtle(str, opts, handlers)  — interpret turtle commands:
//     F forward+draw · f forward · +/- turn ±opts.turn · [ push · ] pop
//     opts: { x, y, angle(deg, 0 = +x, -90 = up), step, turn(deg), stepScale }
//     handlers: { segment(x0,y0,x1,y1,depth), tip(x,y,depth) }
//     stepScale^depth shrinks each branch level so it tapers like a real plant.
(function (Loom) {
  Loom.lsystem = function (axiom, rules, iterations, rng) {
    var s = axiom;
    for (var it = 0; it < iterations; it++) {
      var out = "";
      for (var j = 0; j < s.length; j++) {
        var c = s[j], rep = rules[c];
        if (rep == null) out += c;
        else if (typeof rep === "string") out += rep;
        else out += rep[rng ? rng.int(0, rep.length - 1) : 0];
      }
      s = out;
    }
    return s;
  };

  Loom.turtle = function (str, opts, handlers) {
    var DEG = Math.PI / 180;
    var x = opts.x, y = opts.y, a = (opts.angle || 0) * DEG;
    var step = opts.step, turn = (opts.turn || 25) * DEG;
    var scale = opts.stepScale == null ? 1 : opts.stepScale;
    var depth = 0, stack = [];
    handlers = handlers || {};
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      if (c === "F" || c === "f") {
        var len = step * Math.pow(scale, depth);
        var nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len;
        if (c === "F" && handlers.segment) handlers.segment(x, y, nx, ny, depth);
        x = nx; y = ny;
      } else if (c === "+") { a += turn; }
      else if (c === "-") { a -= turn; }
      else if (c === "[") { stack.push([x, y, a, depth]); depth++; }
      else if (c === "]") {
        if (handlers.tip) handlers.tip(x, y, depth);
        var st = stack.pop();
        if (st) { x = st[0]; y = st[1]; a = st[2]; depth = st[3]; }
      }
    }
  };
})((window.Loom = window.Loom || {}));
