# Cheat sheet — working with Claude on this project

## Session starters (copy-paste templates)

**Chat, any task:**
> Read: CLAUDE.md + [doc from table below]. Task: [one sentence]. Files involved: [if known]. Don't inspect anything else unless necessary.

**Content review (master chat only):**
> Read: CLAUDE.md + docs/seo-aeo-brief.md. Reviewing [page] rows from Sheets: [paste rows]

**Bug:**
> Read: CLAUDE.md + workflows/debugging.md. Problem: [what you see]. Evidence: [build output / DevTools / screenshot]

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
