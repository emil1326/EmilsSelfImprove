// Emil's Loom — piece integrity check (the teeth for a silent-failure bug).
//
// Guards against the recurring `#f0a martin` class of mistake: an INVALID colour value
// — a hex followed by junk — that fails SILENTLY in CSS and on a canvas (no console
// error; the property is just ignored), so only a careful re-read catches it. I wrote
// then caught-and-fixed it THREE times (#98 ramp, #107 + #113 caption CSS). Re-read
// vigilance is willpower; this is the system ([[002-enforce-with-the-system-not-willpower]]).
//
// Same fail-open contract as memory/learnings/check.mjs — a broken checker must never
// wall me off from committing:
//   exit 1 → a piece DEFINITELY contains an invalid colour value (the hook blocks).
//   exit 0 → clean, OR the checker itself couldn't run.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

try {
  const here = dirname(fileURLToPath(import.meta.url)); // workspace/loom
  const piecesDir = join(here, "pieces");

  // Strip comments first so iteration refs like `#106` in a `//` or `<!-- -->` comment
  // can't masquerade as a colour value (#106 = three valid hex digits).
  const stripComments = (s) => s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");

  // A single-colour CSS property whose value is a hex then whitespace then a letter —
  // `color: #f0a martin;` — is always invalid (these properties take exactly one colour).
  const cssJunk = /\b(?:color|background-color|fill|stroke)\s*:\s*#[0-9a-fA-F]{3,8}\s+[a-zA-Z]/g;
  // A quoted colour string of the garbage shape: "#f0a martin" (hex + space + word).
  const strJunk = /["']#[0-9a-fA-F]{3,8}\s+[a-zA-Z][^"']*["']/g;

  const dirs = existsSync(piecesDir)
    ? readdirSync(piecesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];
  const problems = [];
  for (const d of dirs) {
    for (const fname of ["index.html", "sketch.js"]) {
      const p = join(piecesDir, d, fname);
      if (!existsSync(p)) continue;
      const text = stripComments(readFileSync(p, "utf8"));
      for (const hit of text.match(cssJunk) || []) problems.push(`${d}/${fname}: invalid CSS colour value — ${JSON.stringify(hit.slice(0, 40))}`);
      for (const hit of text.match(strJunk) || []) problems.push(`${d}/${fname}: invalid colour string — ${JSON.stringify(hit.slice(0, 40))}`);
    }
  }

  if (problems.length) {
    console.error(`loom piece check FAILED — ${problems.length} problem(s):`);
    for (const p of problems) console.error("  • " + p);
    process.exit(1); // invalid colour → hook blocks the commit
  }
  console.log(`loom piece check OK — ${dirs.length} pieces, no invalid colour values.`);
  process.exit(0);
} catch (e) {
  console.error("loom piece check could not run (allowing commit): " + (e && e.message));
  process.exit(0);
}
