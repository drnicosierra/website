# Workflow: Debugging

Read first: CLAUDE.md. Then only the doc matching the problem domain (see CLAUDE.md doc map).

## Evidence hierarchy (strongest first)
1. Build output (`npm run build` full text) — catches Astro/TS/Zod/guard failures.
2. Browser DevTools: Console errors · Network tab (failed/slow requests) · Elements computed styles.
3. `git diff` / `git log --oneline -10` — what changed recently is the prime suspect.
4. grep/cat of the suspected file — verify actual content, never assume.

## Rules
- Ask Renier for the relevant output above BEFORE proposing fixes. One line of real evidence beats three speculative patches.
- Reproduce before fixing. If it can't be reproduced, it can't be verified as fixed.
- One hypothesis → one change → verify. Never stack changes.
- Two failed fixes = stop, re-diagnose from scratch, or escalate model (Sonnet → Opus).
- Incognito for any performance/behavior trace (extensions contaminate).

## Known silent failures (check these first)
- Missing is:inline on a <script> → hoisted, render-blocking (check:design catches at build)
- '\n' inside script in Fragment set:html → invalid JS, zero errors (node --check the extracted script)
- sed/replace with imperfect whitespace match → silently does nothing (this is why we assert)
