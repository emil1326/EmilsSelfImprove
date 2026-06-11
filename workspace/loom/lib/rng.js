// Emil's Loom — primitive #1: a seeded pseudo-random number generator.
//
// Generative art is controlled randomness. If the randomness isn't seeded, the
// committed code can't reproduce the committed piece, and "the code IS the art"
// becomes a lie. So every Loom piece draws its randomness from here.
//
// Classic script (not an ES module) on purpose: module scripts are CORS-fetched
// and fail over file://, but `<script src>` loads fine — so pieces stay
// double-clickable while still sharing this library. Everything hangs off
// window.Loom.
(function (Loom) {
  // mulberry32 — a tiny, fast, surprisingly good 32-bit PRNG. Returns a function
  // that yields the next float in [0, 1) each call.
  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Turn a string into a uint32, so seeds can be readable words ("warp-and-weft")
  // instead of magic numbers. FNV-1a — small and well-spread.
  function hashSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // The friendly wrapper a piece actually reaches for. Accepts a number or a
  // string seed; exposes the handful of helpers generative work always wants.
  class RNG {
    constructor(seed) {
      this.seed = seed;
      const s = typeof seed === "number" ? seed >>> 0 : hashSeed(String(seed));
      this._next = mulberry32(s);
    }
    next() { return this._next(); }                         // [0, 1)
    range(min, max) { return min + (max - min) * this.next(); }
    int(min, max) { return Math.floor(this.range(min, max + 1)); } // inclusive
    pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
    bool(p) { return this.next() < (p === undefined ? 0.5 : p); }
    // Box–Muller — a normally-distributed value. Handy for natural-looking jitter.
    gaussian(mean, sd) {
      mean = mean || 0; sd = sd === undefined ? 1 : sd;
      const u = 1 - this.next(), v = this.next();
      return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
    // A fresh, independent stream — useful when you want sub-seeds that don't
    // disturb the main sequence.
    fork(tag) { return new RNG(hashSeed(String(this.seed) + ":" + tag)); }
  }

  Loom.mulberry32 = mulberry32;
  Loom.hashSeed = hashSeed;
  Loom.RNG = RNG;
})((window.Loom = window.Loom || {}));
