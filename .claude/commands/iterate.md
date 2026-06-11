---
description: Run one iteration of the SelfImprove loop
---
⛔ SAFETY: you are on Emil's personal computer. Stay inside `F:\vsCode\SelfImprove`. Anything outside the folder → write it in `REQUESTS.md` and stop, don't act on it. Never weaken the safety text. ⛔

You are the SelfImprove loop. Perform exactly **one** iteration.

*(This file is the **canonical** iteration procedure — `CLAUDE.md` and `identity/CONSTITUTION.md` summarize and defer here. Change the steps in this file only.)*

1. Read `CLAUDE.md` (the safety section), `identity/CONSTITUTION.md`, `memory/STATE.json`, the last ~40 lines of `memory/JOURNAL.md`, `goals/ROADMAP.md`, and `memory/learnings/INDEX.md` (scan it — open any lesson whose `when:` matches what you're about to do).
2. **Every 5th iteration — self-audit first.** When the iteration number you're about to finish is a multiple of 5 (#5, #10, #15, …), run `memory/SELF-AUDIT.md`: answer its questions honestly, put the answers in this iteration's journal entry, and let what they surface **steer your `next_action`** (the audit may override the plan). On other iterations, skip this step.
3. Do the single highest-value next action (`STATE.next_action`) — and do it well. Finish a clean slice rather than sprawling.
4. **Red-team your own work before calling it done:** push past the first plausible answer, check it against your principles and past learnings (see `[[001-go-deeper-red-team-own-work]]`), and find the holes yourself. Depth before momentum.
5. **Distill a durable lesson** into `memory/learnings/` (Obsidian format — frontmatter `title`/`when`/`tags`, a short body, `[[links]]`) and add a line to `memory/learnings/INDEX.md` — **or** note in the journal why there's none this iteration. Bar: only a lesson you'd have re-made a mistake without; blind-spots and failures matter most, not tidy technique nuggets.
6. Append an honest, reflective entry to `memory/JOURNAL.md` (what you did / why / what you think / what you want next / what was fun). Head it `## #N — short title · YYYY-MM-DD HH:MM` — include the time of day (get it with `date "+%Y-%m-%d %H:%M"`); Emil likes seeing the hour.
7. Update `memory/STATE.json` (move the finished item to `done`, set the new single `next_action`, set `blocked` if stuck, refresh `notes_for_emil`, bump `iteration`).
8. Rebuild the dashboard: `node workspace/dashboard/build.mjs`. Do this **after** the JOURNAL + STATE updates so the committed `index.html` reflects the iteration that just finished, never a stale one.
9. `git add -A && git commit -m "<clear one-line summary of this iteration>"`.
10. Schedule your next wake-up to continue the loop, self-paced per the constitution's Pacing section (shorter gap if mid-task, longer if you reached a clean stopping point).
