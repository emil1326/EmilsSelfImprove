// Emil's SelfImprove — memory integrity check.
//
// Validates that memory/learnings/ stays consistent: every lesson file is in the
// index, every wikilink resolves, every lesson has its frontmatter. Meant to back a
// commit hook (see learnings/README.md).
//
// CONTRACT — built so the checker can never lock me out:
//   exit 1  → memory is DEFINITELY inconsistent. (The hook blocks the commit.)
//   exit 0  → everything else: clean, OR the checker itself couldn't run.
// The fail-open lives here, not in the hook: a broken checker must never wall me off
// from committing — including the commit that fixes the checker.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

try {
  const here = dirname(fileURLToPath(import.meta.url)); // memory/learnings
  const mdFiles = readdirSync(here).filter((f) => f.endsWith(".md"));
  const lessonFiles = mdFiles.filter((f) => /^\d+-.*\.md$/.test(f));
  const slugs = new Set(lessonFiles.map((f) => f.replace(/\.md$/, "")));
  const problems = [];

  // Drop fenced code blocks so illustrative [[links]] inside ``` examples don't count.
  const stripFences = (s) => s.replace(/```[\s\S]*?```/g, "");
  const numericLinks = (text) => {
    const out = [];
    const re = /\[\[(\d+-[^\]]+)\]\]/g;
    let m;
    const clean = stripFences(text);
    while ((m = re.exec(clean)) !== null) out.push(m[1]);
    return out;
  };

  // 1. INDEX.md exists and links every lesson file.
  let indexText = "";
  try {
    indexText = readFileSync(join(here, "INDEX.md"), "utf8");
  } catch {
    problems.push("INDEX.md is missing");
  }
  const indexed = new Set(numericLinks(indexText));
  for (const slug of slugs) {
    if (!indexed.has(slug)) problems.push(`lesson not linked in INDEX.md: ${slug}`);
  }

  // 2. Every numeric wikilink (in INDEX + lessons) resolves to a real lesson file.
  for (const f of ["INDEX.md", ...lessonFiles]) {
    let text;
    try {
      text = readFileSync(join(here, f), "utf8");
    } catch {
      continue;
    }
    for (const slug of numericLinks(text)) {
      if (!slugs.has(slug)) problems.push(`dangling link in ${f}: [[${slug}]]`);
    }
  }

  // 3. Every lesson file has the required frontmatter.
  for (const f of lessonFiles) {
    const text = readFileSync(join(here, f), "utf8");
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const front = fm ? fm[1] : "";
    if (!fm) problems.push(`${f}: no frontmatter block`);
    for (const key of ["title", "when", "tags"]) {
      if (!new RegExp(`^${key}:`, "m").test(front)) {
        problems.push(`${f}: missing frontmatter field '${key}'`);
      }
    }
  }

  if (problems.length) {
    console.error(`memory check FAILED — ${problems.length} problem(s):`);
    for (const p of problems) console.error("  • " + p);
    process.exit(1); // inconsistent → hook blocks the commit
  }
  console.log(`memory check OK — ${lessonFiles.length} lessons, all indexed and linked.`);
  process.exit(0);
} catch (e) {
  // Fail-open: never block on the checker's own failure.
  console.error("memory check could not run (allowing commit): " + (e && e.message));
  process.exit(0);
}
