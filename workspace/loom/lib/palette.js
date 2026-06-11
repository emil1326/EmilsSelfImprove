// Emil's Loom — primitive #2: palettes & colour helpers.
//
// Distilled from the four palettes hand-tuned in piece 001, plus a few more,
// into something every future piece can reach for. A palette is just
// { name, bg, colors[] }; the helpers (rgba, mix, hexToRgb) are the small colour
// utilities generative work uses constantly — translucent strokes especially.
//
// Classic script on window.Loom — see lib/rng.js for why.
(function (Loom) {
  var PALETTES = [
    { name: "amber & sage",  bg: "#1d1a14", colors: ["#d98c3f", "#e7b261", "#a8602b", "#caa05a", "#5d7a6b", "#88a98f", "#6f9b86"] },
    { name: "teal & clay",   bg: "#121a1d", colors: ["#5aa7c4", "#7fc6df", "#3d7e98", "#a6d8e8", "#c96f5a", "#e0917b", "#d8a08f"] },
    { name: "violet & gold", bg: "#17141c", colors: ["#9b7bc4", "#bd9fe0", "#6e5292", "#cbb3e6", "#c4a14e", "#e0c477", "#d8bf8a"] },
    { name: "flax & moss",   bg: "#16160f", colors: ["#cfc08a", "#e6dcae", "#a99c62", "#ddd4a0", "#7d8a6a", "#9fae86", "#8c9b73"] },
    { name: "ember",         bg: "#1a120e", colors: ["#e8612c", "#f08c42", "#c23b22", "#f4b15e", "#b8743a", "#e8d6a0"] },
    { name: "deep sea",      bg: "#0d1418", colors: ["#2e6f8e", "#49a0b8", "#1c4a5e", "#7fd0d8", "#9ae0c8", "#d8efe4"] },
    { name: "orchard",       bg: "#14160f", colors: ["#b9c44e", "#d8e07a", "#8a9b33", "#e8b84e", "#c4682c", "#e6d6a0"] }
  ];

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.replace(/./g, "$&$&");
    var n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  Loom.hexToRgb = hexToRgb;

  // A translucent colour string from a hex + alpha. Flow fields lean on this hard.
  Loom.rgba = function (hex, a) {
    var c = hexToRgb(hex);
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + a + ")";
  };

  // Linear blend between two hex colours, t in [0, 1].
  Loom.mix = function (h1, h2, t) {
    var a = hexToRgb(h1), b = hexToRgb(h2);
    return "rgb(" +
      Math.round(a.r + (b.r - a.r) * t) + "," +
      Math.round(a.g + (b.g - a.g) * t) + "," +
      Math.round(a.b + (b.b - a.b) * t) + ")";
  };

  Loom.palettes = PALETTES;

  // Pick a palette with a seeded RNG (falls back to Math.random if none given).
  Loom.palette = function (rng) {
    var i = rng ? rng.int(0, PALETTES.length - 1) : Math.floor(Math.random() * PALETTES.length);
    return PALETTES[i];
  };
})((window.Loom = window.Loom || {}));
