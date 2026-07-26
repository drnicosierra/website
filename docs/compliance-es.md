# Compliance — Spain (Catalonia focus)

Legal stack: Ley 34/1988 (general advertising) · RD 1907/1996 (health advertising — the core) · CCAA rules (Catalonia: Departament de Salut prior authorization for health advertising) · Código de Deontología Médica (OMC/COMB) · Ley 44/2003 (professional qualifications) · RGPD/LOPDGDD (no patient data in pipeline).

## BLOCK
1. Outcome guarantees as absolutes: elimina · cura definitiva · resultados garantizados · sin riesgos · indoloro.
2. Attributed or invented patient quotes in promotional framing.
3. Superlatives and comparatives: "el mejor cirujano de Barcelona". Must be EARNED via third-party signals, never self-claimed.
4. The word "testimonios" anywhere on the Vidas Transformadas page or its metadata.
5. First-person patient voice on any clinical-results page.
6. `Review`, `AggregateRating`, or `ratingValue` schema — anywhere on the site.

## WARN
7. Pricing or promotional offers (Catalonia-sensitive).
8. Before/after imagery in promotional framing. Informational framing requires "los resultados pueden variar".

## REQUIRE
9. Nº de colegiado COMB: 45307 — on clinical pages, footer, Physician schema.
10. Disclaimer: "Este contenido es informativo y no sustituye una consulta médica."
11. Cited source for any efficacy, safety, or outcome claim.
12. Risk mention alongside any elective procedure description.

## Casos clínicos (Vidas Transformadas) — resolved July 2026

Art. 4.7 RD 1907/1996 analysis: the page as designed — third-person clinical voice, no subjective patient endorsement, no promotional inducement — falls outside art. 4.7 scope. Format = clinical case documentation, not testimonials.

What makes it defensible: author is Dr. Sierra (clinician), voice is third-person objective, content is clinical facts and documented outcomes, no patient satisfaction language, no Review schema.

### Before/after photos
- Written informed consent explicitly covering web/promotional use (not just clinical photography — legally distinct).
- Consent must name the specific use channel (website).
- If faces shown: explicit facial consent. Anonymisation eliminates this.
- **Minors (under 18): anonymised by default.** LO 1/1982 + RGPD art. 8 / LOPDGDD art. 7 — Ministerio Fiscal can intervene on a minor's image rights even with parental consent. Crop to surgical field.
- Schema: `MedicalWebPage` + `MedicalProcedure`, never `Review`.
- Page framing: "documentación clínica de casos tratados", never "testimonios".

### Recommended
30-min COMB deontological advisory consult (free for colegiados) for written cover before publishing first batch.
