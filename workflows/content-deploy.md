# Workflow: Content deploy (Sheets → live)

Read first: CLAUDE.md + docs/content-rules.md. Full review: docs/seo-aeo-brief.md (master chat only).

## Steps
1. Renier exports pending rows from Google Sheets (content_pipeline_v2.gs menu).
2. Paste to master chat → review against brief → TEXTO REVISADO back to Sheets.
3. Dr. Sierra approves per row. Nothing deploys without explicit approval.
4. Python deploy script writes approved text to src/content/*.json (assert-based, per CLAUDE.md script rules).
5. `npm run build` — Zod schema + check scripts are the gate. A failing build may be the guard catching a violation, not a bug.
6. Spot-check the page in `npm run dev`.
7. Commit. Push when batching is done (Netlify credits).

## Hard gates
- SEO/AEO review NEVER via CLI — master chat only.
- Open flags to surface every content session: FAQ fixes not yet reviewed by Dr. Sierra; Timeline framing + NAM/PSIO-NAM naming unresolved.
