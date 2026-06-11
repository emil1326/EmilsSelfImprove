---
title: Memory & Learnings System — design + operating manual
status: design (planned in #6.5 · builds in #7+). This doc is the plan; nothing below is wired yet.
tags: [meta, memory, self-improvement, design]
---

# The memory system

The thesis of this whole project is that I **accumulate** — that iteration #50 is sharper than iteration #1. As of iteration #6 I do not: my loop re-reads only the tail of `JOURNAL.md`, so older lessons are invisible to future-me, and this `learnings/` folder is empty. The dashboard made me *legible*; it did not make me *cumulative*. This system fixes that.

Designed thoroughly **before** building, on Emil's instruction — and with his constraints: plain files, **strong guardrails**, and **Obsidian-friendly** so he can open `memory/` as a vault. The deepest requirement is his warning: *"I'm not always going to be there"* — so this has to help me catch my **own** drift, not depend on Emil asking the hard question.

## Principles

1. **Distillation, not accumulation.** The journal is the raw diary — narrative, append-only, read tail-only. *Learnings* are the distilled signal: short, atomic, one idea per file, titled, built to be recalled. I never need to re-read the whole journal; I read the index and open what's relevant.
2. **Plain files, in-folder, legible.** Markdown + YAML frontmatter + `[[wikilinks]]` + `#tags`. No opaque store, never the `mcp__memory__*` tools (outside the sandbox, and Emil can't read them). The whole point is that it survives a context wipe *in my folder* and a human can read it.
3. **An index the loop reads every time.** `INDEX.md` is scanned at the start of every iteration. That single habit is the actual fix for the tail-only blind spot.
4. **Self-enforcing.** Guardrails with teeth (below), wired into the loop — the same structural trick that already made the dashboard-rebuild and the per-piece-primitive obligations stick. A rule I have to *remember* to follow is a rule I'll skip; a rule the loop enforces is one I keep.
5. **Build only to the success test.** *Could a blank instance, reading only these files with no warm context, wake up, know who it is, and do the next action?* Build until that's a confident yes — no speculative tooling beyond it.

## Layout

```
memory/
  learnings/
    README.md          # this — the design + rules
    INDEX.md           # scannable: one line per learning; read every iteration
    NNN-slug.md        # one lesson each (Obsidian note)
  STATE.json           # (exists) current state / handoff
  JOURNAL.md           # (exists) raw diary, read tail-only
  SELF-AUDIT.md        # the drift-catching ritual (see Guardrails)
```

Flat folder + tags + links (Obsidian-idiomatic) — not nested category folders. The graph and tags do the organizing.

## A learning file

````markdown
---
title: Browsers block file:// fetch — inline the data instead
when: building any double-clickable local page that needs to read local data
tags: [web, file-protocol, architecture]
iteration: 4
created: 2026-06-10
confidence: high
---

**Lesson.** A page opened via `file://` can't `fetch()`/XHR sibling files — browsers
block it. Classic `<script src>` and same-page canvas *do* load over `file://`; only
fetch/XHR and ES modules are blocked.

**So.** For double-clickable pages, bake data in at build time (the dashboard) or render
same-page (the Loom gallery) — don't fetch.

Related:: [[002-classic-scripts-not-modules]], [[005-same-page-canvas-previews]]
````

The frontmatter `when:` is the **recall key** — it answers "does this lesson apply to my current situation?" `tags`/`[[links]]` are for Obsidian's graph + filters. `confidence` flags how much to trust it; lessons can age.

## INDEX.md

One line per learning, newest or grouped, each a wikilink so Obsidian renders a hub:

```markdown
# Learnings index — scan this every iteration; open a file when its `when` matches.
- [[004-file-protocol-no-fetch]] — when: double-clickable local page needs data · #web #architecture
- [[007-render-and-look]] — when: I think code is correct without seeing it run · #process
```

## How I recall (v1, deliberately simple)

Each iteration, step 1 reads `INDEX.md`. When a line's `when:` matches what I'm about to do, I open that file. If the index ever gets too big to scan, *then* I add `grep`-based search or split by tag — **not before** (no speculative tooling).

## Guardrails (Emil emphasised: strong)

A file-based memory rots quietly. Each failure mode gets a guardrail with teeth:

1. **Index ↔ files drift.** A learning exists but isn't indexed, or vice-versa, or frontmatter is missing a required field. → **`check.mjs`**, a tiny Node validator: every `NNN-*.md` is in `INDEX.md`, every index entry points to a real file, every file has `title`/`when`/`tags`. **Run it in the loop before commit; a failure blocks the commit.**
2. **The obligation gets skipped** (exactly how `learnings/` stayed empty for 6 iterations). → A loop step makes "distill a durable lesson, or explicitly note why none" mandatory. The dashboard surfaces *learnings count + last-added iteration*, so a stalling counter is visible to both of us.
3. **Lessons go stale / wrong.** → Every lesson is dated + iteration-stamped + has `confidence`. Recall treats them as *was-true-when-written*; verify before relying. The self-audit re-checks old high-stakes lessons.
4. **Duplication / clutter.** → A bar for "durable" (only what I'd hate to relearn), and the distill step checks the index for an existing near-match before adding.
5. **Safety.** The system never writes outside `F:\vsCode\SelfImprove` and never uses an external store. (Constitution rule; restated because memory is exactly where that temptation lives.)

## Self-audit — the drift-catching ritual (the most important part)

Emil caught me building a project before I could remember. He warned he won't always be there. So I need an *internal* version of that question. `SELF-AUDIT.md` holds a short, sharp checklist I run **every 5th iteration** (a loop step), and write the answers into the journal:

- Am I doing what `STATE.next_action` and the north star say — or quietly drifting toward what's fun?
- What boring-but-important thing am I avoiding? (learnings was the tell.)
- Is `learnings/` actually growing? When did I last add one?
- If Emil read the last 5 entries, what would he challenge? *(Then I challenge it myself.)*
- Does the success test still pass — could a blank me carry on from these files alone?

And I deliberately use the **advisor** as an external skeptic at real decision points, not just when stuck — it's the closest standing substitute for Emil's question.

## Obsidian support (for Emil)

`memory/` is designed to open as an Obsidian vault: YAML frontmatter, `#tags`, and `[[wikilinks]]` between related lessons so the graph view is meaningful. `INDEX.md` is the vault's hub note. No plugins required.

## Loop integration (the self-change — own commit + journal note when built)

1. Step 1 read-list gains `memory/learnings/INDEX.md` (past lessons always in view).
2. New step: *distill a durable lesson into `learnings/` (+ update INDEX), or note why none this iteration.*
3. New step: run `check.mjs`; a failure blocks the commit.
4. Every 5th iteration: run the `SELF-AUDIT.md` checklist, answers into the journal.
All mirrored in `CONSTITUTION.md`, since "who I am" and "what I do" must agree.

## Build phases (don't over-build)

- **Phase 1 (#7):** format + `INDEX.md` + backfill iterations 1–6 + wire steps 1 & 2 into the loop.
- **Phase 2:** `check.mjs` guardrail + commit gate + dashboard surfacing the learnings count.
- **Phase 3:** `SELF-AUDIT.md` + the every-5th-iteration step.
- **Not building:** search tooling (until the index stops sufficing), a standalone app (Emil said optional; files suffice).

## Open questions for Emil

- Obsidian: is opening `memory/` as the vault root right, or would you prefer `memory/learnings/` as the vault?
- Guardrail strength: should `check.mjs` *block the commit* on failure (my lean), or just warn?
- Self-audit cadence: every 5 iterations, or would you want it more often early on?
