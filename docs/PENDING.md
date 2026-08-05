# Pending Tasks & Deferrals

## Phase 5 — Technical (in progress)

### T3 — IndexNow
**Status:** Infra shipped (2026-08-05) — key file `public/<key>.txt` + `npm run indexnow` (submits every URL in `public/sitemap.xml` to `api.indexnow.org`).  
**Note:** IndexNow is consumed by Bing/Yandex/Seznam/Naver only — **Google does not use this protocol.** It does not affect Google indexing speed or favicon refresh; relevant here mainly for Bing's index and AI engines that lean on it (Copilot, parts of Perplexity) per the T5 AI-citation goal.  
**First real ping:** Run `npm run indexnow` only after the key file is deployed (i.e. after a push) — search engines fetch `keyLocation` to verify before accepting the submission.  
**Owner:** Renier

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

### T7 — Service page "Ver todos →" should deep-link per procedure
**Status:** Deferred — placeholder link  
**Why:** Merged Resultados/Por qué section (2026-08-05, all 8 service pages) has a "Ver todos →" link that should go to a results view filtered to that specific procedure (e.g. the NAM service page → NAM cases only), not the flat hub. Per-procedure filtering on Vidas Transformadas doesn't exist yet — only one example case template lives at `/vidas-transformadas/caso-ejemplo-plantilla/`.  
**Current interim:** All 8 links point to `/vidas-transformadas/` (hub).  
**Ship after:** T6 above (Vidas Transformadas page design + pipeline finalized with per-procedure filtering).  
**Owner:** Renier + Claude

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

### T6 — Updated status (2026-07-28)
Script `scripts/censor-caso-images.py` written + committed. `originals/` gitignored.
**Blocked on:** opencv-python install — Catalina 10.15 builds from source (too slow). Install on new laptop with `pip3 install opencv-python-headless --user`, then test with a sample caso image before first content ship.
