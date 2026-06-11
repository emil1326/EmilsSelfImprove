// Emil's SelfImprove — dashboard builder
//
// Reads the loop's live memory (STATE.json + JOURNAL.md), bakes it into a single
// self-contained index.html, and writes it next to this script. No server, no fetch:
// a static page opened over file:// can't read local files, so the data is inlined.
//
// Run it as the LAST step of an iteration (after JOURNAL + STATE are updated) so the
// dashboard reflects the iteration that just finished.
//
//   node build.mjs
//
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));   // workspace/dashboard
const root = join(here, "..", "..");                    // repo root
const memory = join(root, "memory");

const stateRaw = readFileSync(join(memory, "STATE.json"), "utf8");
const journalRaw = readFileSync(join(memory, "JOURNAL.md"), "utf8");
const template = readFileSync(join(here, "template.html"), "utf8");

// Validate STATE parses (fail loudly rather than ship a broken dashboard).
const state = JSON.parse(stateRaw);

// Learnings health: how many lessons, and the most recent iteration that added one.
// A stalling counter (last-added far behind the current iteration) is visible drift.
let learnings = { count: 0, lastAdded: null };
try {
  const lessonFiles = readdirSync(join(memory, "learnings")).filter((f) => /^\d+-.*\.md$/.test(f));
  let lastAdded = 0;
  for (const f of lessonFiles) {
    const m = readFileSync(join(memory, "learnings", f), "utf8").match(/^iteration:\s*([\d.]+)/m);
    if (m) lastAdded = Math.max(lastAdded, parseFloat(m[1]));
  }
  learnings = { count: lessonFiles.length, lastAdded: lastAdded || null };
} catch { /* learnings dir is optional */ }

// Escape "<" to its JSON unicode form so neither the journal nor the state can
// close the <script> tag we inline them into. "<" parses back to "<".
const noScriptBreak = (s) => s.replace(/</g, "\\u003c");

const dataBlock = [
  "const STATE = " + noScriptBreak(JSON.stringify(state)) + ";",
  "const JOURNAL = " + noScriptBreak(JSON.stringify(journalRaw)) + ";",
  "const LEARNINGS = " + JSON.stringify(learnings) + ";",
  "const GENERATED_AT = " + JSON.stringify(new Date().toISOString()) + ";",
].join("\n");

const token = "/* __SELFIMPROVE_DATA__ */";
if (!template.includes(token)) {
  console.error("build.mjs: data placeholder not found in template.html — aborting.");
  process.exit(1);
}

// Function replacer so "$" sequences in the data aren't treated as replacement patterns.
const html = template.replace(token, () => dataBlock);
writeFileSync(join(here, "index.html"), html, "utf8");

console.log(
  "Dashboard built → index.html (iteration #" + state.iteration +
  ", " + journalRaw.length + " journal chars)."
);
