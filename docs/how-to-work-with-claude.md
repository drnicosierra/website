# Cheat sheet — working with Claude on this project

## Session starters (copy-paste templates)

**Chat, any task:**
> Read: CLAUDE.md + [doc from table below]. Task: [one sentence]. Files involved: [if known]. Don't inspect anything else unless necessary.

**Content review (master chat only):**
> Read: CLAUDE.md + docs/seo-aeo-brief.md. Reviewing [page] rows from Sheets: [paste rows]

**Bug:**
> Read: CLAUDE.md + workflows/debugging.md. Problem: [what you see]. Evidence: [build output / DevTools / screenshot]

Two layers — CLI models and chat models:
CLI (scripts/claude-api.sh) — already in CLAUDE.md:

Haiku: mechanical checks, validation, git questions, grep-style lookups
Sonnet: standalone content drafts, code snippets, one-shot reasoning
Opus: only if Sonnet fails

Chats (model picker in the app) — the same logic scaled up:
TaskModelContent review vs brief, terminology checksSonnet — rule-following, doesn't need deep reasoningRoutine code edits (menu swap, JSON changes, CSS fixes)SonnetDebugging that's gone in circles, unclear build failuresOpus or higher — fresh chat, full evidence pastedArchitecture decisions, migrations, restructures (like today)Opus or higherAnything where being wrong is expensive (schema changes, sitewide find/replace)Step up a tier
The heuristic: Sonnet is your default for everything routine. Escalate when the task requires judgment across many moving parts, or when a cheaper model has already failed once. Escalating after a failure wastes less than defaulting to the big model — except for one-time high-stakes work, where you start high.
Note the advice doc you brought this morning had outdated names — current lineup is Haiku 4.5 / Sonnet 4.6 / Opus 4.8 / Fable 5 (top tier, what you're talking to now). Your claude-api.sh model strings may be worth a quick check next session to confirm they point at current versions.
This table belongs in the cheat sheet too — but it's guidance for you choosing chats, not for Claude's behavior, so it fits how-to-work-with-claude.md perfectly. Want it appended in the same batch, or have you already run the append? Tell me where you are and I'll give you one clean consolidated command.

## Which doc for which task
| Task | Point Claude to |
|---|---|
| CSS, spacing, colors, visual bug | docs/design-system.md (+ workflows/css-fix.md) |
| Component/code change | docs/architecture.md |
| Content writing/review | docs/seo-aeo-brief.md (master chat) |
| Quick content lint | docs/content-rules.md |
| New page/service | workflows/new-page.md |
| Content Sheets→live | workflows/content-deploy.md |
| Anything broken | workflows/debugging.md |
| Images | docs/image-pipeline.md |
| Performance concern | docs/performance.md |

## Chat vs CLI decision
- **CLI Haiku** (`scripts/claude-api.sh haiku "..."`): mechanical checks, grep-style questions, git help, file validation. Cheap, instant. Claude in chats should flag when Haiku suffices.
- **CLI Sonnet**: standalone content drafts (NOT final review), code snippets, one-shot questions.
- **Fresh chat**: any task with more than 2–3 steps. Start with a template above. One task per chat — chats are disposable now; the repo carries the knowledge.
- **Master chat**: SEO/AEO content review ONLY (needs the brief). Nothing else needs it anymore.

## What to paste Claude (in order of value)
1. Full `npm run build` output when anything fails
2. DevTools: Console errors, Network failures, Elements computed styles
3. `git status` / `git diff --stat` at session start
4. grep output instead of whole files when Claude asks about specific code

## Rhythm reminders
- 3 terminal steps per batch, confirm between batches
- `git status` first, every session — clean tree before new work
- Commit locally per task; push in batches (Netlify credits)
- You decide when a task is done, not Claude
- If Claude gives a fix twice and it fails twice: demand re-diagnosis with evidence, or switch model up

## Terminal survival kit
Ctrl+U clear line · Ctrl+C abandon line/escape stuck heredoc · Ctrl+W delete word · Ctrl+A/E line start/end

## Master chat clarified
"Master chat" = any fresh chat inside the Claude project (has project context), NOT one eternal thread. One fresh chat per content review batch — long chats get expensive because the full history re-sends with every message. Fresh chat + brief from repo = full context, disposable.

## Doc maintenance rule
If a change invalidates something a doc says, updating the doc is part of the SAME task, same commit. Claude flags it; you run the fix. New agreements made mid-chat also get written to a doc before the task closes. Docs that rot are worse than no docs.

## Claude can fetch the public repo
In chats, Claude can read files directly from GitHub (pushed state only — local uncommitted changes are invisible). Shortest starter: "Fetch CLAUDE.md + docs/X.md from the repo. Task: ..." Saves your pasting time; token cost is the same.

## Your growth edge (assessed July 2026)
The highest-leverage skill: identifying WHERE a problem lives before opening a chat. Quick triage:
- Looks wrong (spacing, color, alignment) → CSS → design-system.md, DevTools Elements panel
- Wrong element/order/missing content → HTML structure → architecture.md, grep for the class/id
- Text/wording → content JSON → content-rules.md, src/content/
- Build fails → read the LAST error lines first; Zod field names mean content violation, not code bug
- Works on desktop, breaks on iPhone → WebKit history → performance.md

Before pasting an error to Claude, read its last 5 lines yourself and guess the category — right or wrong, the guess sharpens your prompt.

Git model in one line: working tree (your edits) → staging (git add) → commit (local snapshot) → push (GitHub + Netlify deploy). `git status` tells you which layer you're in.

Terminal reflexes to build: grep before assuming a file contains something · `git log --oneline -5` to see recent history · `open <path>` to jump to GUI · Ctrl+U to bail out of a pasted line.
