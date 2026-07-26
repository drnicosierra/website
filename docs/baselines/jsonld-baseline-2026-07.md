# JSON-LD Baseline — 2026-07-26

## Finding
Zero JSON-LD present on any page at time of baseline capture.

Pages checked:
- https://drnicosierra.com/ — none
- https://drnicosierra.com/sobre-dr-nico-sierra/ — none
- https://drnicosierra.com/cirugia-labio-fisurado/ — none

## Implication
No Physician, MedicalProcedure, FAQPage, MedicalWebPage, or BreadcrumbList schema exists.
This is the primary cause of Gemini 0/75 citation rate in the AI baseline.

## Phase 3 scope (S4)
All schema to be generated fresh:
- Physician + alternateName + sameAs (home + bio)
- MedicalProcedure (all 8 service pages)
- FAQPage (all 8 service pages + homepage)
- MedicalWebPage (all clinical pages)
- BreadcrumbList (all pages)
- MedicalClinic (home + bio)
