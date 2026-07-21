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

## Section backgrounds (flat, matches production)
Every homepage section is transparent — `body{background:#001e2e}` shows through all of them uniformly. The CTA banner (`.ns-cta-banner`) is the one deliberate exception at `#005240` (green). Hero has its own dark image background (`.ns-hero__media`, independent of this system). The `.ns-signature` footer block also keeps its own `#00111e`, unrelated to the flat-body system.
Do NOT reintroduce per-section background colors (teal/mid/deep/green "personalities") without deliberately deciding to — a prior version of this had unreachable color rules silently killed by a `background:transparent!important` override; both were removed together rather than re-enabled, because the flat look is the current intentional choice.

## Section dividers
`border-top:1px solid rgba(255,255,255,0.14)` between every adjacent section, including hero→first-section (`.ns-hero + .ns-scope.ns-section`) and on `.ns-cta-banner`/`.ns-signature`. This is a dedicated value — NOT `--ns-line` (that stays at its own `rgba(255,255,255,0.08)` and is only for card/quote/FAQ borders). Since backgrounds are flat, these hairlines are the only visual separation between sections — don't weaken them.

## Spacing / typography
- .sh class rhythm: eyebrow →12px→ h2 →16px→ lead →40px→ content
- p+p: 16px · h3+p: 8px · h4+p: 4px
- Section padding: clamp(72px,9vw,128px) · Container: max 1200px, sides clamp(20px,4vw,48px)
- `.ns-cta-banner` and `.ns-signature` use this same vertical rhythm (they used to drift with their own clamp values — keep them aligned)
- NEVER inline margin-top on headings/p
- NEVER adjacent sibling selectors across .reveal wrappers

## Components (archived for reuse)
WheelTeam.astro · CareTimeline.astro in src/components/ — ready to drop into another page.
Fuentes.astro — citation block, renders only when `sources` array is non-empty. Placed between dr-section and FAQ in ServicePageTemplate. Flip Zod `sources` from optional() to min(1) once content pipeline delivers citations.

## E-E-A-T UI classes
`.clinical-reviewer` — layout-driven reviewer strip in Layout.astro. Renders when `clinical={true}` + `lastReviewed` props passed. Pulls COLEGIADO from site.ts. Apply by passing `clinical={true}` on any clinical page Layout call.
`.footer-nap` — NAP block in footer first column (address + phone). Styled in global.css. Content driven by CLINIC_ADDRESS + CLINIC_PHONE from site.ts. `tel:` href strips spaces via `.replace(/ /g, "")`.

## Known dead code
.ns-btn-wa-hero in home.css ~307–319 — confirmed orphaned, queued for design-system unification. Don't rediscover it.

## Emails & misc
cuentame@drnicosierra.com (patient-facing) · admin@drnicosierra.com (tools) · Local dev: http://localhost:4321/

## Hero Sections

Two standardized classes replace all inline hero styles:

**.hero-section** — flex hero with background image support
```css
.hero-section { padding:120px 0 80px; min-height:60vh; display:flex; align-items:flex-end; }
.hero-section[data-height="50vh"] { min-height:50vh; }
.hero-section[data-height="40vh"] { min-height:40vh; }
.hero-section > div { max-width:var(--ns-container); margin:0 auto; padding:0 clamp(20px,4vw,48px); }
```
⚠️ Padding lives on the **inner div**, not the section. Never add horizontal padding to the section itself.

**.hero-simple** — non-flex, for text-only pages (Política de Privacidad)
```css
.hero-simple { background:#001629; padding:120px clamp(20px,4vw,48px) 60px; position:relative; }
```

## Breadcrumb

`src/components/Breadcrumb.astro` — place **inside** the inner div, as first child before `.sh`:
```astro
<section class="hero-section">
  <div>
    <Breadcrumb crumbs={[{ label: 'Inicio', href: '/' }, { label: 'Page Name' }]} />
    <div class="sh">...</div>
  </div>
</section>
```
Renders semantic `<nav>` + inline JSON-LD BreadcrumbList. Last crumb has no `href`. Home page and 404/gracias get no breadcrumb.
