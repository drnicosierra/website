# Content Rules — mechanical checklist

Distilled from docs/seo-aeo-brief.md (authoritative). For full SEO/AEO review use the brief in a master chat. These are the rules enforced mechanically (Zod schema + scripts/check_content_seo.py).

## Terminology — absolute
- NEVER "labio leporino". Use: fisura labiopalatina · labio fisurado · paladar hendido · labio y paladar hendido (LatAm)
- NEVER Operation Smile + Smile Train on the same page (Zod hard-fails)
- "Dr. Nico Sierra" patient-facing · "Nicolás E. Sierra"/"NE Sierra" academic only · never "Perilla"
- "Clínica Tresserra" (accent) · "Hospital Universitario Vall d'Hebron" full name on first mention
- Never "FLP" in patient-facing content; fine in internal/technical contexts

## Keywords
- Site primary: cirujano especialista en fisura labiopalatina en Barcelona
- H1 must contain the page's primary keyword — not just positioning language
- Title formula: [Procedure] en España │ Dr. Nico Sierra — Especialista en Fisura Labiopalatina
  (pipe separator, 50–60 chars, keyword in first 50)
- Meta description: 150–160 chars, keyword in first 20 words, ends with CTA phrase, no exclamation marks

## AEO rules
1. FAQ answers restate the question topic in the first sentence
2. Authority blocks: minimum 2 named entities. Highest value: CHOP · UFPR · Operation Smile · PubMed · Springer (Global Cleft Care in Low Resource Settings, 2021). High: FEBOMFS · Vall d'Hebron · Clínica Tresserra · MSI
3. Every bullet in Cuándo/Cómo/Resultados = complete sentence (subject + verb)
4. First paragraph of Qué es = self-contained answer, max 80 words
5. FAQ schema text = visible text, character-for-character

## Voice (Dr. Sierra)
- Clinical but warm. States, doesn't hedge. Claims + immediate specifics.
- Keep his verbs (acompañar, restaurar, devolver). Expand, don't replace openings.
- No superlatives without proof. Credentials stay factual.
- "Nunca es tarde" = revision surgery context ONLY.

## Open flags (not yet resolved by Dr. Sierra)
- FAQ question/answer topic matching fixed across 7 service pages — NOT yet reviewed by him. Flag in any FAQ session.
- Timeline clinical framing + NAM vs PSIO-NAM naming — pushed without explicit resolution.

## Pipeline
Google Sheets (16 tabs) → export → master chat review vs brief → back to Sheets → Dr. Sierra approval → Python deploy to JSON → npm run build → commit.
SEO/AEO review NEVER via CLI (lacks brief context).
