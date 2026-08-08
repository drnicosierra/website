# Compliance — Spain (Catalonia focus)

Legal stack: Ley 34/1988 (general advertising) · RD 1907/1996 (health advertising — the core) · CCAA rules (Catalonia: Departament de Salut prior authorization for health advertising) · Código de Deontología Médica (OMC/COMB) · Ley 44/2003 (professional qualifications) · RGPD/LOPDGDD (no patient data in pipeline).

## BLOCK
1. Outcome guarantees as absolutes: elimina · cura definitiva · resultados garantizados · sin riesgos · indoloro.
2. Attributed or invented patient quotes in promotional framing.
3. Superlatives and comparatives: "el mejor cirujano de Barcelona". Must be EARNED via third-party signals, never self-claimed.
4. The word "testimonios" anywhere on the Vidas Transformadas page or its metadata.
5. First-person patient voice on any clinical-results page.
6. `Review`, `AggregateRating`, or `ratingValue` schema — anywhere on the site.
13. "Labio leporino" — banned everywhere in generated content, in any language, with exactly ONE
    exception: a piece whose entire stated purpose is explaining the term itself (title/target
    keyword literally about "labio leporino" — the one approved terminology page,
    `fisura-labiopalatina-labio-leporino`, see `seo-aeo-brief.md` § "Labio leporino" Policy [F]).
    Everywhere else, use fisura labiopalatina / labio fisurado / paladar hendido. This is a
    client-specific rule (not from the universal Spain-wide ruleset — it's a terminology/dignity
    choice, not a legal requirement) — it's numbered 13 here because it has no counterpart in
    `pipeline/lib/compliance_rules.py`'s universal list, unlike rules 1-12 above. **Added
    2026-08-08 after this exact gap let a real piece through**: piece 1 (diagnóstico prenatal)
    used the term in a bare, uncontrolled mention and the automated compliance verdict was PASS
    with no findings — because this rule didn't exist yet anywhere in the ruleset the pass checks
    against. Caught instead by the website's own build-time Zod guard, days later, by accident of
    a different verification step. Don't rely on that again.

## WARN
7. Pricing or promotional offers (Catalonia-sensitive). **Not the same as BLOCK — informational framing is permitted.** Precedent set 2026-08-07 (bipdoc strategy layer, `content-plan-2026-08.md` piece 5, pricing/Seguridad Social page): explain how the system works (public vs. private process, what influences cost) without ever publishing a specific price, fee, or "oferta", and without claiming a guaranteed insurance/coverage outcome — always route the actual cost question to a personalized consultation, never a number. Pricing/coverage is worth tackling deliberately rather than avoiding — it's consistently the most recurring patient question across research (present in 8 of 10 mined topics as of 2026-08), so silently ducking it is a real content gap, not a safe default.
8. Before/after imagery in promotional framing. Informational framing requires "los resultados pueden variar".

## REQUIRE
9. Nº de colegiado COMB: 45307 — on clinical pages, footer, Physician schema. ✅ Implemented (Phase 3): footer sitewide via Layout.astro (.footer-nap + footer-base), reviewer block on all clinical pages (.clinical-reviewer), Physician schema in ServicePageTemplate.
10. Disclaimer: "Este contenido es informativo y no sustituye una consulta médica." ✅ Implemented: `MEDICAL_DISCLAIMER` in `src/config/site.ts`, rendered sitewide via `Layout.astro`'s footer (`.footer-disclaimer`). Verified 2026-08-07.
11. Cited source for any efficacy, safety, or outcome claim.
12. Risk mention alongside any elective procedure description. **⚠️ NOT structurally automated** — unlike #9/#10, there's no fixed "Riesgos" block in the site's 9-block service-page structure (`seo-aeo-brief.md` Part A), so this has to be actively planned per piece, not assumed. Found missing in a real draft 2026-08-07 (bipdoc content plan piece 3, a multi-procedure timeline page) — caught in manual review, not by any guard. Check for this explicitly on any new content describing a procedure.

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
