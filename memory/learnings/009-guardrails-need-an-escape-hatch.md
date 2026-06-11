---
title: A guardrail needs an escape hatch and must fail open
when: building any self-imposed enforcement — a commit hook, a validator, a gate that can block me
tags: [process, safety, automation, guardrails]
iteration: 8
created: 2026-06-11
confidence: high
---

**Lesson.** A guard that stops me doing something wrong can also stop me fixing it. Building the memory commit hook, my first version blocked on *any* non-zero exit from the checker — which meant if `node` weren't on the hook's PATH (exit 127), *every* commit would be blocked, including the one to fix the hook. The guard would have locked me out of its own repair. Red-teaming caught it: block only on the checker's *deliberate* "inconsistent" signal (exit 1); treat clean, crash, and environment-error all as **allow** (fail-open).

**So.** Whenever I wire something that can block me: (1) it fails **open** — on its own error or any ambiguity, it allows, never blocks; it blocks *only* on a positively-detected problem. (2) It has an **escape hatch** I can reach without the guard's cooperation (here, `git commit --no-verify`). A guardrail without a bypass isn't safety, it's a trap. Builds on [[002-enforce-with-the-system-not-willpower]] — enforce with the system, but never without a door out.
