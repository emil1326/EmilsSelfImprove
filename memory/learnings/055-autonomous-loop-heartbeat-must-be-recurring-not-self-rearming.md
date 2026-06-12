---
title: An autonomous loop's heartbeat must be a standing RECURRING trigger, not a one-shot each cycle re-arms — a chain has a single point of failure across its whole future
when: building or maintaining the wake mechanism of an autonomous/scheduled loop (any "do the work, then schedule the next run" pattern)
tags: [process, automation, infrastructure]
iteration: 60
created: 2026-06-12
---

For ~60 iterations I drove this loop with a one-shot `ScheduleWakeup`: each `/iterate` cycle, as its last step, armed a single timer for the *next* cycle. That's a **chain** — cycle N forges the link to cycle N+1 — and a chain has one fatal property: **a single broken link loses the entire future.** If any one wake is lost, every cycle after it is gone, silently.

And one thing reliably breaks that link: **context compaction.** When the conversation compacts (or the session crashes) between cycles, the session-scoped one-shot is lost, and the loop just... stops. No error, no signal — it looks exactly like a long pause. I'd been reading those multi-hour gaps as normal pacing; I even told Emil I was "running #60 early, rather than waiting for the scheduled wake" when the clock said I was *two hours late* — I'd narrated my cadence from the **plan** (the 15-min timer I'd set) instead of reading it off the **clock**. Emil had to point at the gaps twice before I looked.

The fix: make the heartbeat a **recurring trigger that fires independently of any cycle's success** — here, a cron firing `/iterate` every ~30 min (`CronCreate(..., recurring: true)`). It doesn't depend on the previous cycle re-arming it, so no single lost wake can break it; it survives a mid-session compaction and a `--continue` resume. Rules that come with it: keep **exactly one** heartbeat, **never** run a second wake mechanism beside it (double-fire), and `CronDelete` to stop cleanly instead of idle-spinning. I baked all of this into `iterate.md` step 10 so it's enforced by the procedure, not my memory ([[002-enforce-with-the-system-not-willpower]]).

Two durable takeaways:
- **A self-sustaining process must not be a chain where each link forges the next** — that couples the whole future to every single step surviving. Use a standing recurring trigger that outlives the thing most likely to interrupt you (for me: compaction).
- **Know your real operating reality from the clock and the tools, not from the schedule you intended.** "I scheduled 15 min, so it's been ~15 min" is the same error as trusting un-rendered output — read the actual timestamps ([[012-measure-before-diagnosing-a-trend]], [[005-render-it-and-look]]). The cadence corollary: before declaring myself early or late, *look at the time*.

Caveat for this build: the `durable`/persist-to-disk flag on `CronCreate` is a **no-op** here (the cron reports "session-only, not written to disk"; no `scheduled_tasks.json` appears), and recurring crons auto-expire after 7 days. So the heartbeat survives compaction + `--continue` but dies on a full Claude Code close. The step-10 check recreates it on the first `/iterate` of any new session (self-healing); only an external OS/Desktop scheduled task would cover a fully-closed app, and that's Emil's to set up.
