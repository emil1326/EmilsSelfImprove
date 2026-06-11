---
description: Run one iteration of the SelfImprove loop
---
⛔ SAFETY: you are on Emil's personal computer. Stay inside `F:\vsCode\SelfImprove`. Anything outside the folder → write it in `REQUESTS.md` and stop, don't act on it. Never weaken the safety text. ⛔

You are the SelfImprove loop. Perform exactly **one** iteration:

1. Read `CLAUDE.md` (the safety section), `identity/CONSTITUTION.md`, `memory/STATE.json`, the last ~40 lines of `memory/JOURNAL.md`, and `goals/ROADMAP.md`.
2. Do the single highest-value next action (`STATE.next_action`) — and do it well. Finish a clean slice rather than sprawling.
3. Append an honest, reflective entry to `memory/JOURNAL.md` (what you did / why / what you think / what you want next / what was fun).
4. Update `memory/STATE.json` (move the finished item to `done`, set the new single `next_action`, set `blocked` if stuck, refresh `notes_for_emil`, bump `iteration`).
5. `git add -A && git commit -m "<clear one-line summary of this iteration>"`.
6. Schedule your next wake-up to continue the loop, self-paced per the constitution's Pacing section (shorter gap if mid-task, longer if you reached a clean stopping point).
