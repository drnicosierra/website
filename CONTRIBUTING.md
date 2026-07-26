# Moved

Gotchas absorbed into: docs/architecture.md (code gotchas) + CLAUDE.md (workflow/script rules).
Read CLAUDE.md before making any code change.

## Secrets hygiene

**This repo is public. Never commit API keys, tokens, or credentials.**

- All keys via environment variables or GitHub Secrets — never hardcoded
- The pipeline repo (`drnicosierra/pipeline`) is **private** — it holds client configs, API keys, and measurement databases (SQLite). Keep it that way.
- Local env vars: store in `~/.zshrc` or a `.env` file that is `.gitignore`d — never in any file tracked by git
- GitHub Actions secrets: set via repo Settings → Secrets and variables → Actions
- If a key is accidentally committed: rotate it immediately, then remove from history with `git filter-repo`
