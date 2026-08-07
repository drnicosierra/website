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

### T5 — Gemini engine quota/billing in AI citation battery
**Status:** Deferred — Gemini reads as 0.0% in the 2026-08-07 baseline, but that's not a real signal.  
**Why:** The Gemini API key (created under renierbueno@gmail.com, not drnico@drnicosierra.com) is on the free tier and returns `429 quota exceeded` on every call. Free tier RPD/RPM limits are too low for a 75-call/run battery, especially once test/dry-runs stack on the same key in one day.  
**Fix:** Link a billing account to the Gemini API project (console.cloud.google.com/billing) — moves the key to paid tier with much higher limits. A "My Billing Account" Google Cloud Free Trial account is available to link; real usage cost for this battery is a few cents/month, well inside trial credit.  
**Until fixed:** Treat Gemini's 0% as unknown, not zero, when reading any baseline. The other 3 engines (OpenAI/Perplexity/Claude) are unaffected and reliable.  
**Note (2026-08-07):** battery script + all baseline data moved to `~/Developer/bipdoc` (`renierbueno/bipdoc`) — this fix still applies to the same underlying Gemini API key, just run from the new repo now: `python3 pipeline/measure/ai-battery.py --client drsierra`.  
**Owner:** Renier

### T5d — International patient segment (English content) — explicitly deferred
**Status:** Deferred by decision, not by default.  
**Why:** Both baselines (chat-engine battery and AI Overview check, both now in `bipdoc/clients/drsierra/data/baselines/`) independently found zero Dr. Sierra presence — no AI mention, no AI Overview, no organic ranking — on the two English "international patient" queries. The English SERP for these queries is dominated by **Bookimed** (medical-tourism aggregator), not individual competing surgeons. Confirmed 2026-08-07: not currently listed on Bookimed.  
**Decision:** Stay Spanish-only for now. Spain-first positioning takes priority (Phase 5 not yet complete); an English landing page or Bookimed listing are both real options but explicitly not now.  
**Revisit when:** Spain positioning is solid (per the original plan) — then reconsider either a single English landing page (cheaper than full site i18n) or a Bookimed profile, not necessarily a full site translation.  
**Owner:** Renier

### T5c — AI Overview check is manual, not automated
**Status:** Deferred — not urgent.  
**Why:** `bipdoc/clients/drsierra/data/baselines/ai-overviews-baseline-2026-08.md` (2026-08-07) was produced by manually navigating Google Search per query and reading results — no API involved. Fine for an occasional spot-check, not sustainable as a recurring measurement.  
**Fix:** DataForSEO SERP API (already the planned Layer 1/6 tool per `bipdoc/docs/architecture.md`) detects AI Overview presence as one of its SERP features on a normal rank-check pull — same account/integration that would also cover weekly position tracking. No separate tool needed, just build the DataForSEO integration whenever that's picked up — in the bipdoc repo, not here.  
**Owner:** Renier

### T8 — Blog content collection doesn't exist yet — blocks publishing pipeline-generated content
**Status:** Blocked — confirmed, not just assumed.  
**Why:** `bipdoc` (the multi-client tool) now has a working generate → review → publish pipeline, and 5 draft pieces for this client have been through Checkpoint #2 already (sitting in Drive, `bipdoc/clients/drsierra/data/generated/`). But `src/content/config.ts` here only defines `services, about, camino, homepage, cases` — no blog/article collection. `docs/architecture.md`'s own note ("Vidas Transformadas + Blog: NOT migrated — design placeholders, do not touch until design final") is the reason, confirmed still true 2026-08-07/08.  
**What this means concretely:** `bipdoc/pipeline/publish/publish.py` can commit an approved piece to a PR-ready branch, but only into a neutral staging path (`content-pending/blog/`) outside `src/content/` — it deliberately does *not* try to invent a schema and slot content into a real collection, since that's this repo's design decision, not the pipeline's to make.  
**Unblocks when:** blog page design is finalized (same trigger as T6/Vidas Transformadas). At that point, building the actual Astro-schema adapter in `bipdoc/pipeline/publish/` is a small, focused follow-up — the git mechanism already works.  
**Owner:** Renier (design) + Claude (adapter, once unblocked)

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

**Last updated:** 2026-08-08 · Renier + Claude

### T6 — Updated status (2026-07-28)
Script `scripts/censor-caso-images.py` written + committed. `originals/` gitignored.
**Blocked on:** opencv-python install — Catalina 10.15 builds from source (too slow). Install on new laptop with `pip3 install opencv-python-headless --user`, then test with a sample caso image before first content ship.
