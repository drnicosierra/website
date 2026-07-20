# Workflow: Content deploy (Sheets → live)

Read first: CLAUDE.md + docs/content-rules.md. Full review: docs/seo-aeo-brief.md (master chat only).

## Steps
1. Renier exports pending rows from Google Sheets: `Content Pipeline → 1. Exportar pendientes para Claude` menu. Copies the generated text block.
2. Paste to master chat → review against brief → Claude gives back a text block in the same import format (see below) → paste into `Content Pipeline → 2. Importar revisiones de Claude`. This writes TEXTO REVISADO + Comentarios and sets Estado to "Pendiente Aprobación (Dr. Sierra)" automatically — no manual per-cell pasting.
3. Dr. Sierra approves per row. Nothing deploys without explicit approval.
4. Python deploy script writes approved text to src/content/*.json (assert-based, per CLAUDE.md script rules).
5. `npm run build` — Zod schema + check scripts are the gate. A failing build may be the guard catching a violation, not a bug.
6. Spot-check the page in `npm run dev`.
7. Commit. Push when batching is done (Netlify credits).

## Import/export text format (content_pipeline_v2.gs)
The Apps Script behind the Sheet's `Content Pipeline` menu (source kept at `scripts/content_pipeline_v2.gs` — it runs bound to the Sheet, not from this repo) parses a specific plain-text format. Claude's review output must match it exactly for the import to route to the right cells:

```
TAB: <sheet/tab name, exact>
<Sección> | <Elemento>
<revised text — may span multiple lines/paragraphs>
COMENTARIO: <what changed and why>
---
<Sección> | <Elemento>
<revised text>
COMENTARIO: <...>
---
```

Notes:
- `Sección | Elemento` must match the sheet's columns character-for-character (the script does an exact trimmed-string match against column A/B) — mismatches land in a "no encontrado" list instead of silently writing to the wrong row.
- A new `TAB:` line is only needed when switching tabs; `---` alone resets to the next Sección/Elemento within the same tab.
- Omit `COMENTARIO:` only if there's truly nothing to note — it's what populates "Comentarios (Claude)" for Dr. Sierra's review trail.
- `3. Marcar estados (consistencia)` in the same menu recomputes Estado from column contents if it ever drifts (e.g., stale "Live" tags on rows that already have a draft).

## Hard gates
- SEO/AEO review NEVER via CLI — master chat only.
- Open flags to surface every content session: FAQ fixes not yet reviewed by Dr. Sierra; Timeline framing + NAM/PSIO-NAM naming unresolved.
