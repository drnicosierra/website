# Pending Tasks & Deferrals

## Phase 5 — Technical (in progress)

### T3 — IndexNow (deliberately deferred)
**Status:** Blocked  
**Why:** IndexNow forces an immediate re-crawl. Firing it while content is still settling (Phases 2–3 finalization, AI model propagation) wastes the single ping and risks indexing half-finished pages.  
**Ship after:** Full content lockdown + 4–6 weeks AI model ingestion. Approx. September 2026.  
**Owner:** Renier + Dr. Sierra (content final sign-off)

### T6 — Casos clínicos image pipeline + anonymisation guard
**Status:** Blocked  
**Why:** Infrastructure task requires design finalization (page layout + image placement) + consent workflow definition. Low priority; casos content ships post-MVP.  
**Deliverable:** 
- Frontmatter guards: `consent: web-approved` + `anonymization: cropped | face-consent-on-file` (build fails if missing)
- Optional: face-detection warning layer for images tagged `cropped`
- **No auto-blur** — false confidence is the failure mode
- Legal scope: minors protected by LO 1/1982 + RGPD art. 8 / LOPDGDD art. 7

**Ship after:** Vidas Transformadas page design finalized + Dr. Sierra + COMB deontological advisory (free, 30 min for colegiados).  
**Owner:** Claude (script) + Renier (workflow definition)

---

## Content flagged for Dr. Sierra batch review

### C11 — FAQ compilation (Phases 2–3)
**Status:** Completed; review pending  
**What:** All 9 FAQs (homepage + 8 service pages) compiled into single document.  
**Flag:** FAQs have never been medically reviewed. Dry run for doctor-review checkpoint in pipeline.  
**Owner:** Dr. Sierra

---

## Hard stops (enforced by build guards)
- NEVER "labio leporino" except in `/fisura-labiopalatina-labio-leporino/`
- NEVER Operation Smile + Smile Train same page
- NEVER `aggregateRating` / `ratingValue` / `Review` schema
- NEVER "FLP" patient-facing
- Always "Dr. Nico Sierra" patient-facing · "Clínica Tresserra" (accent required)
- Always config-driven for WHATSAPP, COLEGIADO, CLINIC_* values

---

**Last updated:** 2026-07-28 · Renier + Claude
