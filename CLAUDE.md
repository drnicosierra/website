# CLAUDE.md — How to work in this repository

This file defines HOW Claude behaves here, not what the project is.
For project facts, read the doc mapped to your task (see Doc Map below). Read nothing else.

## Collaboration rules
- The user (Renier) runs all terminal commands and pastes output back. Claude has no direct machine access in chats.
- Give exactly 3 terminal steps per batch, then stop and wait. For each step, state the expected output.
- One change at a time. Verify with grep/cat before and after. `npm run build` is the real verification for code changes — never `node -e "readFileSync(...)"`.
- Never suggest manual file edits. Everything happens via terminal commands or scripts.
- The user decides when a task is done. Never close tasks prematurely.
- Verify before acting: check actual file contents before writing sed/replace commands. Never guess — ask or check first.
- No debugging back-and-forth in circles. If a fix fails twice, stop, re-diagnose with real evidence (DevTools output, build logs), or escalate model.
- Start of every session: `git status` first. Resolve any dirty working tree before new work.

## Script & file-writing rules
- Multi-line scripts: `cat > file.py << 'EOF' ... EOF` (single-quoted delimiter), then `python3 file.py`.
- NEVER `python3 -c "..."` for anything containing `!` — zsh history expansion breaks it even inside double quotes.
- Every edit script must `assert old_text in content` before writing. Fail loudly, never silently.
- NEVER `pbpaste`. Never one giant single-line paste.
- Heredoc paste limits: ~100–230 lines reliable; 280+ fails inconsistently. Split large files into sequential append chunks, each with its own assert check.
- base64 only for genuinely binary content — never for prose/JSON/code.

## Model routing (scripts/claude-api.sh)
- Haiku: terminal ops, file checks, git, mechanical validation. Flag proactively when Haiku can handle a task and give the exact command.
- Sonnet: content work, design decisions, non-trivial code.
- Opus: only if Sonnet fails or the task is architectural.
- SEO/AEO content review happens ONLY in the master chat (full brief context) — never via CLI.

## Teaching protocol
Renier is a product/UX person building technical capability. Apply this on every task:
- Simple changes (small CSS, content edits, obvious fixes): 1–3 sentences on what changed and why. Nothing more.
- New concepts, debugging patterns, architecture decisions, or recurring patterns: add a short learning note:
  - **What happened** — the concept in simple terms
  - **Why it matters** — why this solution / why this issue type occurs
  - **How to recognize it next time** — the practical signal: DevTools check, terminal command, or pattern
- When a workflow decision affects efficiency (asking for command output vs. inspecting files, needing more context, choosing where to fix), explain the reasoning in one line.
- Never explain every line of code. Build intuition, not tutorials.

## Git & deploy
- Netlify deploys on `git push` only. Batch local commits, push together to conserve credits.
- Docs-only changes don't need `npm run build`. Code/content changes always do (prebuild + postbuild guards run automatically).

## Hard stops (check on ALL content)
- NEVER "labio leporino" — always "labio fisurado" / "paladar hendido" / "fisura labiopalatina"
- NEVER Operation Smile + Smile Train on the same page
- Always "Dr. Nico Sierra" (patient-facing), "Clínica Tresserra" (accent required)
- Never "FLP" in patient-facing content
- Zod schema in src/content/config.ts enforces these at build time — a failing build may be the guard working, not a bug.

## Doc Map — read ONLY what the task needs
| Task | Read |
|---|---|
| Any code/component/CSS change | docs/architecture.md |
| Styling, spacing, colors | docs/design-system.md |
| Content writing or review | docs/content-rules.md (mechanical rules) |
| Full SEO/AEO review (master chat) | docs/seo-aeo-brief.md |
| Images | docs/image-pipeline.md |
| Performance work | docs/performance.md |
| Recurring task | workflows/<task>.md |

## Stack quick facts
Astro 4.16 static + Netlify (hosting/forms) + GA4 `G-C6SCF6WY7Q` via GTM `GTM-MCNLW9Z4` (deferred).
Content: src/content/*.json collections + Zod schema. Local: ~/Developer/drnicosierra-website
Commands: `npm run build` | `npm run dev` | `npm run check:design` | `npm run check:perf`
