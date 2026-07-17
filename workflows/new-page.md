# Workflow: New page / new service

Read first: CLAUDE.md + docs/architecture.md + docs/content-rules.md. Reference: docs/seo-aeo-brief.md Part A.

## Steps
1. Content first: full page content approved by Dr. Sierra via content-deploy workflow BEFORE building.
2. Create the JSON entry in src/content/ (services/*.json for services). Schema in src/content/config.ts validates on build.
3. Wire the wrapper page (8-line pattern, see existing service pages).
4. Meta: unique title per formula, description 150–160, OG image 1200×630 JPG via getImage() + new URL(..., Astro.site).
5. Schema markup: MedicalProcedure + FAQPage + BreadcrumbList. FAQ schema text = visible text exactly.
6. Internal links per the linking map (brief Part A) — update OTHER pages that should now link here too.
7. Images per docs/image-pipeline.md (getImage() in frontmatter — no <Image /> in set:html pages).
8. `npm run build` (guards run) → dev spot-check → commit.

## Gotchas
- Slug must match confirmed list exactly, trailing slash included.
- Any inline <script>: is:inline attribute (check:design catches, but write it).
- Section backgrounds follow the fixed alternation (docs/design-system.md).
