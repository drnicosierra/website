# Before you push — read this

This file exists because several of the mistakes below have already shipped
to production at least once and were only caught by a live PageSpeed test
or a real-device bug report, days or weeks later. Two automated guards now
catch the most common ones at build time (see below) — but they don't catch
everything, so read this too.

## Automated guards (run automatically, but know what they check)

- **`npm run check:design`** (runs before every `npm run build`, via `prebuild`)
  Fails the build if: a page redefines shared CSS instead of using
  `src/styles/global.css`; a `<style>` block has invalid nested `@media`;
  or — as of July 2026 — a `<script>` tag with inline JS content is
  missing `is:inline`.
- **`npm run check:perf`** (runs automatically after every `npm run build`, via `postbuild`)
  Checks the actual `dist/` output for: leftover Astro-hoisted script files,
  external Google Fonts requests, external `<link rel="stylesheet">` tags,
  and a rough total-JS budget.

If either fails, **the build fails** — this should also block a Netlify
deploy, since Netlify runs `npm run build` as its build command. If you're
ever unsure whether a change is safe, run `npm run build` locally and read
the output before pushing.

## Recurring gotchas, in order of how many times they've bitten this project

### 1. Every `<script>` with inline JS content must have `is:inline`
Astro's default behavior for a `<script>` tag with no `src=` is to treat it
as an ES module and bundle/hoist it into a separate file
(`dist/_astro/hoisted.*.js`). On this project, every real inline script is
deliberately kept as a genuine inline script (zero extra network request) —
losing `is:inline` silently turns it into a new render-blocking request.
This has already happened once (July 2026, homepage restructure away from
`Fragment set:html`) and cost real LCP time before anyone noticed via a
live test. `npm run check:design` now catches this automatically — but if
you're writing a *new* `<script>` tag, just remember the attribute.

Exception: `<script type="application/ld+json">` for JSON-LD schema is data,
not executable code — the guard already excludes it, don't add `is:inline`
to those, it's not needed.

### 2. Don't put `\n` inside a JS string that's itself inside an Astro
### `Fragment set:html={\`...\`}` template literal
If you're writing an inline `<script>` inside one of the (few) remaining
`Fragment set:html={\`...\`}` blocks, and that script builds a string using
`'\n'` for a line break, Astro's build-time evaluation of the *outer*
template literal will collapse that `\n` into a real newline character
*before* the browser ever sees it — producing invalid JS (a real newline
inside a single-quoted string) that fails completely silently, no error
anywhere. Use a plain separator like `' | '` instead of `'\n'` in any script
written this way. Verify with `node --check` on the extracted script content
if something "does nothing" for no visible reason.

### 3. zsh mangles `!` even inside double-quoted `python3 -c "..."` strings
`!important` (and anything else with a bare `!`) triggers zsh's history
expansion ("event not found") even inside a double-quoted string passed to
`python3 -c`. Always write multi-line/complex scripts to a file via a
**single-quoted** heredoc delimiter first — `cat > file.py << 'EOF' ... EOF`
— never `python3 -c "..."` for anything containing `!`.

### 4. Below-the-fold images need `loading="lazy"`; above-the-fold images don't
All ~18 before/after gallery photos, the doctor photo, and the services
background image are lazy-loaded — they're not visible on initial load, so
downloading them immediately just competes for bandwidth with the fonts and
hero content that actually matter for first paint. The **hero image and
logo are intentionally NOT lazy** — they're above the fold and should load
eagerly. If you add a new image, ask "is this visible without scrolling on
a typical phone?" — if no, add `loading="lazy"`.

### 5. Don't rely on the clipboard, and don't paste one giant single line
Every file-writing command should embed the actual content directly (real
multi-line text in a heredoc, or a Python triple-quoted string) — never
`pbpaste`, and never one extremely long single line. Terminal.app can
silently mangle very long single-line pastes. For genuinely large blocks of
plain text/JSON, real multi-line heredoc text is preferred over base64 —
base64 is only worth the size overhead for actual binary files (images,
fonts) or content with characters that would break string quoting.

### 6. Every file-writing script should verify before it writes
When editing an *existing* file by replacing a known chunk of text, use
`assert old_text in content` (Python) before writing — if the match fails,
the script should stop and print what to check, never silently do nothing
or write partial/corrupted content. `sed -i` matching one exact line is
fragile for the same reason: if whitespace doesn't match exactly, it fails
silently and doesn't tell you.

### 7. Workflow: batches of exactly 3 terminal steps, real verification
Give exactly 3 terminal steps at a time, then stop and wait for confirmation
(or a flag that one broke) before continuing. Every batch that changes code
should include `npm run build` as one of its 3 steps — that's the real
verification (catches actual Astro/TypeScript/Zod schema errors), not
`node -e "readFileSync(...)"` (which only proves a file has valid UTF-8
bytes, not that its contents are valid). No individual confirmation prompts
per single command, and no manual clipboard steps, ever.
