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

Each iteration, step 1 reads `INDEX.md`. When a line's `when:` matches what I'm about to do, I open that file. **Honest about the decay:** an unbounded index rots exactly the way the journal tail did — past some size I'll skim it and stop truly reading, which is the same blind spot in a new coat. So the trigger to evolve it (group by tag, or surface only entries relevant to the current `next_action`) is *when it stops fitting one quick scan* — call it ~30–40 lines — and I act on that **before** it stops working, not after. Until then, simple is correct; no speculative search tooling.

## Guardrails (Emil emphasised: strong)

A file-based memory rots quietly. Each failure mode gets a guardrail with teeth:

1. **Index ↔ files drift.** A learning exists but isn't indexed, or vice-versa, or frontmatter is missing a required field. → **`check.mjs`**, a tiny Node validator: every `NNN-*.md` is in `INDEX.md`, every index entry points to a real file, every file has `title`/`when`/`tags`. **Enforced by a hook, not by me remembering** — see below. (Emil's point, and the right one: a guardrail I have to *run* is the same fragile pattern that left `learnings/` empty for 6 iterations.)
2. **The obligation gets skipped** (exactly how `learnings/` stayed empty for 6 iterations). → A loop step makes "distill a durable lesson, or explicitly note why none" mandatory. The dashboard surfaces *learnings count + last-added iteration*, so a stalling counter is visible to both of us.
3. **Lessons go stale / wrong.** → Every lesson is dated + iteration-stamped + has `confidence`. Recall treats them as *was-true-when-written*; verify before relying. The self-audit re-checks old high-stakes lessons.
4. **Duplication / clutter.** → A bar for "durable" (only what I'd hate to relearn), and the distill step checks the index for an existing near-match before adding.
5. **Safety.** The system never writes outside `F:\vsCode\SelfImprove` and never uses an external store. (Constitution rule; restated because memory is exactly where that temptation lives.)

**What these guardrails do *not* do — said plainly so I don't trust them past their reach.** `check.mjs` enforces *tidiness* (index ↔ files ↔ frontmatter), never *truth* or *value*: a memory full of consistent-but-wrong or consistent-but-useless lessons passes clean. Correctness is what `confidence` + the self-audit (re-checking high-stakes lessons) are for; value is a hard bar on what earns a file at all — **only a lesson I'd have re-made a mistake without, that names a future situation it applies to.** The "distill every iteration" obligation therefore *explicitly permits "no durable lesson this time"* — a manufactured lesson is noise, and noise is how the index rots into another unread wall. A periodic **prune/merge** (part of the self-audit) deletes the stale and fuses the duplicated: the index is allowed to *shrink*.

## Self-audit — the drift-catching ritual (the most important part)

Emil caught me building a project before I could remember. He warned he won't always be there. So I need an *internal* version of that question. `SELF-AUDIT.md` holds a short, sharp checklist I run **every 5th iteration** (a loop step), and write the answers into the journal:

- Am I doing what `STATE.next_action` and the north star say — or quietly drifting toward what's fun?
- What boring-but-important thing am I avoiding? (learnings was the tell.)
- **Where did I go shallow** — ship a design or fix where I stopped at the first plausible answer instead of pushing one level deeper? *(A recurring failure of mine. The "run check.mjs in the loop" hole — which was a hook waiting to happen — is the type case. Emil caught it; I should have.)*
- Is `learnings/` actually growing **with the right kind of lesson**? The most valuable ones are my *blind spots and mistakes*, not tidy technique nuggets — and those are exactly the ones I'm least inclined to write down. When did I last record a *failure* lesson?
- If Emil read the last 5 entries, what would he challenge? *(Then I challenge it myself.)*
- Does the success test still pass — could a blank me carry on from these files alone?

And I deliberately use the **advisor** as an external skeptic at real decision points, not just when stuck — it's the closest standing substitute for Emil's question. But the advisor and Emil are for catching the *subtle*; the self-contradictions in my own work are mine to catch first (step 4 of every iteration).

## Enforcement: a hook, not my willpower (Emil's point)

The strongest guardrail is one the **harness** runs, not one I have to remember — because "remember to run it" is precisely the failure that emptied `learnings/`. So `check.mjs` is wired as a **`PreToolUse` hook** in project-scoped `.claude/settings.json` (inside the sandbox — *never* user/global settings) that matches `git commit` commands, runs the validator, and **denies the commit** if memory is inconsistent. The harness enforces it on every commit attempt whether or not I think to.

Cautions, because a self-imposed commit-block is a footgun if done carelessly (and Emil said *be careful up there*):
- **Two distinct outcomes, so I'm never locked out.** The hook blocks *only* on a clean verdict that memory is **inconsistent** (fail-closed). If `check.mjs` is missing, throws, or can't decide, the hook **allows the commit with a loud warning** (fail-open) — a broken validator must never wall me off from committing, *including the commit that fixes the validator itself*. (Belt and braces: the hook lives in live-read `settings.json` I can edit in-folder, so there's always a manual escape.) Verify the exact PreToolUse deny mechanism against current Claude Code docs when building it.
- **Order matters:** add the hook *with* `check.mjs` (Phase 2), never before — a hook calling a script that doesn't exist would block every commit.
- It lives in committed `settings.json` (part of my governance, legible, survives a fresh clone), which means it also applies to Emil's own sessions in this folder — acceptable, since it only ever blocks a genuinely inconsistent memory.
- Build it via the `update-config` skill (the right tool for settings/hooks).

This generalises: future "always do X" obligations of mine are candidates for hooks too (the harness is the enforcer), within the same sandbox rule.

## Obsidian support (for Emil)

`memory/` is designed to open as an Obsidian vault: YAML frontmatter, `#tags`, and `[[wikilinks]]` between related lessons so the graph view is meaningful. `INDEX.md` is the vault's hub note. No plugins required.

## Loop integration (the self-change — own commit + journal note when built)

1. Step 1 read-list gains `memory/learnings/INDEX.md` (past lessons always in view).
2. New step: *distill a durable lesson into `learnings/` (+ update INDEX), or note why none this iteration.*
3. Integrity is enforced by the **commit hook** (above), not a loop step I run — that's the whole point of using a hook.
4. Every 5th iteration: run the `SELF-AUDIT.md` checklist, answers into the journal.
All mirrored in `CONSTITUTION.md`, since "who I am" and "what I do" must agree.

## Build phases (don't over-build)

- **Phase 1 (#7):** format + `INDEX.md` + backfill iterations 1–6 + wire steps 1 & 2 into the loop.
- **Phase 2:** `check.mjs` validator **+ the `PreToolUse` commit hook in `.claude/settings.json`** (added together) + dashboard surfacing the learnings count.
- **Phase 3:** `SELF-AUDIT.md` + the every-5th-iteration step.
- **Not building:** search tooling (until the index stops sufficing), a standalone app (Emil said optional; files suffice).

## Decisions (Emil handed these back to me — #6.5)

I asked Emil three questions; he declined to dictate any, with two pieces of meta-guidance: **be careful — "you don't want a mess up there"**, and (on cadence) *"the whole point of self-improvement is you guess a value, see if it goes wrong or could be better, and keep improving."* So these are my calls, held as **starting guesses to tune**, not settled truths:

- **Vault root → `memory/`** (the whole folder as one vault; richest graph, wikilinks can span learnings + journal + state).
- **`check.mjs` on failure → blocks the commit.** "Don't want a mess up there" points straight at the careful option: a memory that fails its own integrity check shouldn't be allowed to persist.
- **Self-audit cadence → start at every 5 iterations**, explicitly a guess. If drift still slips through, tighten; if it's just noise, loosen. The cadence is itself subject to the loop — which is the point.

The deeper takeaway outlived the questions: **iterate, don't perfect.** Pick a reasonable value, ship it, watch it, improve it. That now applies to every design choice here, not just the cadence — see `CONSTITUTION.md`.
