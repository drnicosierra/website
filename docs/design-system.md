# Design System

## Fonts
DM Sans (headings) + Space Grotesk (body), self-hosted via @fontsource.
Weights: DM Sans 400/500/700 · Space Grotesk 400/500/600. Never add external font requests (check:perf blocks them).

## Colors (use the CSS variables, not raw hex)
- --ns-blue-500: #005085 (brand primary) · --ns-blue-400: #0d74c4 (interactive/CTA) · --ns-teal-600: #008362 (accent/warmth)
- Defined in both global.css and home.css :root blocks — if a value ever changes, change BOTH.
- Service accents: NAM #7C3AED · Labio #a01255 · Paladar #008362 · Revisión #0d74c4 · Encía #16A34A · Ortognática #B45309 · Rinoplastia #0891B2 · Otros #64748B

## --sc variable — allowed uses ONLY
eyebrow · em words in h1/h2 · card left borders · active nav underline · FAQ open border · related card top border · hero left accent · service CTA button · entity tags.
NEVER as section background.

## Section backgrounds (fixed alternation)
Hero #001629 → Qué es #001e2e → Cuándo #001629 → Proceso #001e2e → Resultados #001629 → Dr. Sierra #001e2e → FAQ #001629 → Related #001e2e → CTA #001e2e + teal border-top → Footer #000e1a

## Spacing / typography
- .sh class rhythm: eyebrow →12px→ h2 →16px→ lead →40px→ content
- p+p: 16px · h3+p: 8px · h4+p: 4px
- Section padding: clamp(72px,9vw,120px) · Container: max 1200px, sides clamp(20px,4vw,48px)
- NEVER inline margin-top on headings/p
- NEVER adjacent sibling selectors across .reveal wrappers

## Known dead code
.ns-btn-wa-hero in home.css ~328–340 — confirmed orphaned, queued for design-system unification. Don't rediscover it.

## Emails & misc
cuentame@drnicosierra.com (patient-facing) · admin@drnicosierra.com (tools) · Local dev: http://localhost:4321/
