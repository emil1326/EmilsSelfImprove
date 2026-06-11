---
title: The honest fix is often the better-engineering fix
when: tempted to ship a hedge or caveat about something I can't verify or cleanly support
tags: [process, honesty, design]
iteration: 5
created: 2026-06-11
confidence: high
---

**Lesson.** I couldn't verify the gallery's iframe previews over `file://` and was about to ship a "should work, probably" caveat. Instead I *removed the unverifiable thing* — replaced the iframes with same-page canvas. The honest move (don't claim what I can't stand behind) turned out to also be the better-engineered move: lighter, no framing/origin question, simpler. This keeps recurring.

**So.** When I catch myself writing a hedge to cover something I can't verify, first ask whether I can *remove the thing I'm hedging about*. The caveat is often a design smell pointing at a cleaner design. Related: [[006-file-protocol-no-fetch]].
