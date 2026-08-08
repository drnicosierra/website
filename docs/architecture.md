# Architecture — Astro specifics & gotchas

## Structure
- 8 service pages: src/content/services/*.json + ServicePageTemplate.astro (8-line wrappers)
- Homepage, About, Tu Camino: JSON in src/content/, rendered via templates
- Cómo Te Ayudamos: generated from the services collection directly
- Vidas Transformadas: NOT migrated — design placeholder, do not touch until design final (T6, PENDING.md)
- Blog: migrated 2026-08-08 — `blog` content collection (type:'content', markdown) + `ArticlePageTemplate.astro` + category taxonomy/gallery. See PENDING.md T8 for full detail.
- Zod schema (src/content/config.ts) hard-fails builds on forbidden terms, meta lengths, OS+ST co-occurrence, FAQ minimums
- `src/config/site.ts` — single source of truth for COLEGIADO, WHATSAPP, WHATSAPP_URL, MEDICAL_DISCLAIMER, CLINIC_NAME, CLINIC_ADDRESS, CLINIC_PHONE, CLINIC_CITY, CLINIC_COUNTRY. Import from here; never hardcode in components.
- ServicePageTemplate generates 5 schema blocks: MedicalProcedure · FAQPage · BreadcrumbList · Physician (alternateName + dual affiliation: Clínica Tresserra + Vall d'Hebron) · MedicalWebPage (author / reviewedBy / datePublished / dateModified). Pass additional blocks via `schemaBlocks` prop on Layout.
- All service pages + about JSON have `publishDate` (2026-07-09) and `lastReviewed` (2026-07-27) fields. Services also have `sources` array (optional, empty until content pipeline delivers citations).

## Gotcha 1 — every inline <script> needs is:inline
Astro hoists any <script> without src= into a bundled render-blocking file.
This shipped to production once (July 2026) and cost real LCP.
`npm run check:design` (prebuild) now catches it — but write the attribute anyway.
Exception: <script type="application/ld+json"> is data, not code — no is:inline needed.

## Gotcha 2 — no '\n' inside scripts within Fragment set:html template literals
Astro collapses '\n' to a real newline at build time → invalid JS, fails silently.
Use plain separators like ' | '. Verify with `node --check` on extracted script if something "does nothing".

## Gotcha 3 — <Image /> cannot be used in Fragment set:html pages
Homepage + all 8 service pages use <Fragment set:html={...}>.
Pattern: getImage() in frontmatter + ${var.src} interpolation. Full details: docs/image-pipeline.md

## Gotcha 4 — lazy loading policy
Below the fold (gallery, doctor photo, services background): loading="lazy".
Above the fold (hero image, logo): intentionally eager — do NOT add lazy.
Test: "visible without scrolling on a typical phone?" No → lazy.

## Build guards
- `npm run check:design` (prebuild): shared-CSS duplication, invalid nested @media, missing is:inline
- `npm run check:perf` (postbuild): hoisted scripts in dist/, external fonts/stylesheets, JS budget
- Either failing fails the build → blocks Netlify deploy. A failing build may be the guard working.

## Sandbox note (Claude's container)
Cannot reach images.unsplash.com — builds fail at the external-fetch step only. That failure is expected there; verify real builds locally.
