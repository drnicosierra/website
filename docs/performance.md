# Performance — current state & methodology

## Status: DONE, accepted at mobile PageSpeed 86 (diminishing returns). Don't re-optimize without new evidence.

## What's in place (and why — don't undo)
- Hero decoupled from JS/IntersectionObserver → pure CSS animation. This was the actual root cause of multi-second LCP.
- Self-hosted fonts via @fontsource; build.inlineStylesheets:'always' in astro.config.mjs
- GTM deferred: requestIdleCallback 2s timeout OR first scroll/click/touchstart/keydown
- Partytown fully removed (commit 41e3a99)
- transform:translateZ(0) on footer, section wrappers, reveal elements — baked into BOTH hidden and visible states. Fixes WebKit/iOS Safari blank-section bug. Stronger than will-change (a hint browsers can drop).

## Methodology
- PageSpeed/Lighthouse mobile LCP and Speed Index are unreliable — prefer real DevTools traces + real-device testing. TBT, CLS, FCP are more stable.
- Browser extensions contaminate traces — always cross-check in Incognito.
- npm run check:perf (postbuild) guards regressions: hoisted scripts, external fonts/stylesheets, JS budget.

## Analytics events (live)
- whatsapp_click: 21 data-wa-loc attributes across 13 files, delegated listener in Layout.astro. Params: wa_location, page_path.
- form_submit_success: Page View trigger on /gracias/
- GA4 loads solely via GTM's Google Tag (send_page_view=false on base). Old direct gtag.js removed.
- Scroll depth: deliberately deferred.
