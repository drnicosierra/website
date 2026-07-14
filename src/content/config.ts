import { defineCollection, z } from 'astro:content';

// ── Shared building blocks ────────────────────────────────────────────────

const cta = z.object({
  label: z.string(),
  href: z.string(),
});

const credentialEntity = z.enum([
  'UFPR',
  'Children\u2019s Hospital of Philadelphia',
  'Operation Smile',
  'Smile Train',
  'FEBOMFS',
  'Springer',
]);

const faqItem = z.object({
  question: z.string(),
  answer: z.string(),
});

const cuandoItem = z.object({
  title: z.string(),
  text: z.string(), // AEO: must be a complete sentence, not a fragment
  icon: z.enum(['pulse', 'clock', 'family', 'ribbon']), // maps to a fixed SVG set in the template
});

const procesoStep = z.object({
  title: z.string(),
  text: z.string(),
  timeframe: z.string(), // AEO: specific timeframes signal authority
});

const relatedLink = z.object({
  slug: z.string(),      // must match a real service slug — checked in the template
  name: z.string(),
  num: z.string(),       // "01".."08", per existing card numbering
});

// ── The service page schema ──────────────────────────────────────────────

const services = defineCollection({
  type: 'data',
  schema: z.object({
    // Identity
    slug: z.string(),                 // e.g. "cirugia-labio-fisurado" — must match filename
    procedureName: z.string(),        // Spanish, e.g. "Reconstrucción de Labio Fisurado"
    bodyLocation: z.string(),         // e.g. "Labio", "Paladar", "Nariz"
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/), // service accent hex per design system

    // Meta (Section 5 of brief)
    title: z.string().max(60),
    description: z.string().min(120).max(160),
    ogTitle: z.string().max(60),
    ogDescription: z.string().max(160),
    heroImageQuery: z.string(),       // Unsplash search source, used by getImage() in template
    queEsImageQuery: z.string(),

    // Block 1 — Hero
    hero: z.object({
      h1: z.string(),                 // must contain primary keyword — spot-checked, not enforced in schema
      lead: z.string(),
    }),

    // Block 2 — Qué es (AEO critical: first paragraph = standalone snippet answer)
    queEs: z.object({
      firstParagraph: z.string().min(1),
      paragraphs: z.array(z.string()).min(1).max(2), // additional paragraphs beyond the first
    }),

    // Block 3 — Cuándo (AEO: each item.text must be a complete sentence)
    cuando: z.object({
      intro: z.string(),
      items: z.array(cuandoItem).min(3).max(5),
    }),

    // Block 4 — Cómo es el procedimiento
    proceso: z.object({
      intro: z.string(),
      steps: z.array(procesoStep).min(3).max(5),
    }),

    // Block 5 — Resultados
    resultados: z.object({
      intro: z.string(),
      revisionNote: z.string().optional(), // "signal for patients who have had prior surgery" per brief
    }),

    // Block 6 — Por qué Dr. Nico Sierra (AEO critical: >=2 named entities)
    porQue: z.object({
      lead: z.string(),
      body: z.string(),
      entities: z.array(credentialEntity).min(2),
      quote: z.string(),
    }),

    // Block 7 — FAQ (min 5, max 8 per brief; schema text must match visible text exactly —
    // guaranteed here since both are generated from this same array)
    faq: z.array(faqItem).min(5).max(8),

    // Block 9 — Internal links (min 3 per brief)
    relatedLinks: z.array(relatedLink).min(3),

    // Global placeholders not yet resolved
    whatsappNumber: z.string().default('WHATSAPP_NUMBER'),

    // Optional fields used by the como-te-ayudamos index page, so that page
    // can be generated directly from this collection instead of duplicating
    // service names/colors/order in a second place.
    indexNum: z.string().regex(/^\d{2}$/).optional(),
    indexTeaser: z.string().max(160).optional(),
  })
  // Cross-field rule: Operation Smile and Smile Train must never appear together
  .refine(
    (data) => !(data.porQue.entities.includes('Operation Smile') && data.porQue.entities.includes('Smile Train')),
    { message: 'Operation Smile and Smile Train must never appear together in the same page (per project rule).', path: ['porQue', 'entities'] }
  )
  // Cross-field rule: forbidden clinical term check across all free-text fields
  .refine(
    (data) => {
      const haystack = JSON.stringify(data).toLowerCase();
      return !haystack.includes('labio leporino');
    },
    { message: '"labio leporino" is forbidden — use "labio fisurado" per clinical terminology rules.' }
  ),
});

// ── About page (singleton) ────────────────────────────────────────────────

const about = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string().min(120).max(160),
    canonical: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string(),
    schemaEntities: z.array(credentialEntity).min(1),
    hero: z.object({
      eyebrow: z.string(),
      h1: z.string(),
      lead: z.string(),
    }),
    bio: z.object({
      paragraphs: z.array(z.string()).min(2).max(4),
      credentials: z.array(z.object({
        title: z.string(),
        text: z.string(),
        accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      })).min(3).max(6),
    }),
    cta: z.object({
      eyebrow: z.string(),
      h2: z.string(),
      text: z.string(),
    }),
    whatsappNumber: z.string().default('WHATSAPP_NUMBER'),
  })
  .refine(
    (data) => !(data.schemaEntities.includes('Operation Smile') && data.schemaEntities.includes('Smile Train')),
    { message: 'Operation Smile and Smile Train must never appear together (per project rule).', path: ['schemaEntities'] }
  )
  .refine(
    (data) => !JSON.stringify(data).toLowerCase().includes('labio leporino'),
    { message: '"labio leporino" is forbidden — use "labio fisurado" per clinical terminology rules.' }
  ),
});

// ── Tu Camino Con Nosotros page (singleton) ───────────────────────────────

const camino = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string().min(120).max(160),
    canonical: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      h1: z.string(),
      lead: z.string(),
    }),
    steps: z.array(z.object({
      num: z.string().regex(/^\d{2}$/),
      title: z.string(),
      text: z.string(),
    })).min(3).max(6),
    ctaLabel: z.string(),
    ctaHref: z.string(),
  })
  .refine(
    (data) => !JSON.stringify(data).toLowerCase().includes('labio leporino'),
    { message: '"labio leporino" is forbidden — use "labio fisurado" per clinical terminology rules.' }
  ),
});

// ── Homepage (singleton) ──────────────────────────────────────────────────

const timelineNode = z.object({
  num: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  iconSvg: z.string(),
  name: z.string(),
  text: z.string(),
  href: z.string().regex(/^\/[a-z-]+\/$|^\/cuentanos-tu-historia$/, 'href must be a real slug ending in / (or /cuentanos-tu-historia)'),
});

const careRow = z.object({
  label: z.string(),
  type: z.enum(['treatment', 'coordinated']),
  // 1-indexed CSS grid-column positions against careTimeline.columns.
  // endCol is exclusive (CSS grid-column-end convention) — a bar covering
  // only the first column is startCol:1, endCol:2.
  startCol: z.number().int().min(1),
  endCol: z.number().int().min(2),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  href: z.string().regex(/^\/[a-z-]+\/$/).optional(),
}).refine(
  (row) => row.type === 'coordinated' || (row.color && row.href),
  { message: 'A "treatment" row must have both color and href — it renders as a clickable link to a real service page. Rows without an owned service page must be type:"coordinated" instead.' }
);

const careTimeline = z.object({
  eyebrow: z.string(),
  h2: z.string(),
  lead: z.string(),
  columns: z.array(z.string()).min(4),
  rows: z.array(careRow).min(4),
  legendTreatment: z.string(),
  legendCoordinated: z.string(),
});

const homepage = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    canonical: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string(),
    keywords: z.string(),
    whatsappNumber: z.string().default('WHATSAPP_NUMBER'),

    hero: z.object({
      eyebrow: z.string(),
      h1: z.string(),
      lead: z.string(),
      tickerItems: z.array(z.string()).min(4),
    }),

    about: z.object({
      eyebrow: z.string(),
      h2: z.string(),
      paragraphs: z.array(z.string()).min(2).max(5),
      credentials: z.array(z.object({
        iconSvg: z.string(),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        title: z.string(),
        text: z.string(),
      })).min(3).max(6),
      ctaLabel: z.string(),
      ctaHref: z.string(),
    }),

    timeline: z.object({
      eyebrow: z.string(),
      h2: z.string(),
      lead: z.string(),
      nodes: z.array(timelineNode).min(6).max(9),
    }),

    careTimeline,

    journey: z.object({
      eyebrow: z.string(),
      h2: z.string(),
      lead: z.string(),
      ctaLabel: z.string(),
      ctaHref: z.string(),
      steps: z.array(z.object({
        num: z.string(),
        title: z.string(),
        text: z.string(),
      })).min(3).max(6),
    }),

    results: z.object({
      eyebrow: z.string(),
      h2: z.string(),
      lead: z.string(),
      ctaLabel: z.string(),
      ctaHref: z.string(),
    }),

    testimonials: z.object({
      eyebrow: z.string(),
      h2: z.string(),
      quotes: z.array(z.object({
        text: z.string(),
        name: z.string(),
        role: z.string(),
      })).min(1).max(6),
    }),

    faq: z.array(faqItem).min(5).max(8),

    ctaBanner: z.object({
      eyebrow: z.string(),
      h2: z.string(),
      lead: z.string(),
      whatsappLabel: z.string(),
      formLabel: z.string(),
      formHref: z.string(),
    }),

    signature: z.object({
      name: z.string(),
      line: z.string(),
    }),
  })
  .refine(
    (data) => !(JSON.stringify(data).includes('Operation Smile') && JSON.stringify(data).includes('Smile Train')),
    { message: 'Operation Smile and Smile Train must never appear together (per project rule).' }
  )
  .refine(
    (data) => !JSON.stringify(data).toLowerCase().includes('labio leporino'),
    { message: '"labio leporino" is forbidden — use "labio fisurado" per clinical terminology rules.' }
  ),
});

// ── Vidas Transformadas — case studies ────────────────────────────────────
// Real patient cases (before/after). Every field here maps directly to the
// page design confirmed with Renier: hub page (vidas-transformadas.astro)
// lists all cases as cards; each case gets its own page via
// CasePageTemplate.astro, following the exact same getEntry() + template
// pattern as the services collection above.

const procedureRecord = z.object({
  name: z.string(),   // e.g. "Queiloplastia 1\u00aa Bilateral"
  date: z.string(),   // ISO date (YYYY-MM-DD) \u2014 template formats it for display
});

const cases = defineCollection({
  type: 'data',
  schema: ({ image }) => {
    const timelineEntry = z.object({
      label: z.string(),  // e.g. "Pre cl\u00ednica", "Post cl\u00ednica (2 meses)" \u2014
                           // AEO: include a clear time marker so AI systems can
                           // extract "at X months, result was Y" from this page.
      images: z.array(z.object({
        image: image(),
        alt: z.string(),
      })).min(1).max(4),
    });

    return z.object({
    // Identity \u2014 anonymized by default. Only set patientName if signed
    // public-website-use consent is confirmed for THIS specific use (separate
    // from any clinical/teaching consent that may already exist) \u2014 same
    // "first name only, consent confirmed" rule as testimonials (SEO brief
    // \u00a716.4). If absent, the template shows "Paciente, {age}" instead.
    slug: z.string(),
    patientName: z.string().optional(),
    age: z.string(),          // age at time of first surgery, e.g. "1 a\u00f1o 8 meses"
    condition: z.string(),    // e.g. "Fisura labiopalatina bilateral"

    // Meta
    title: z.string().max(60),
    description: z.string().min(120).max(160),
    ogTitle: z.string().max(60),
    ogDescription: z.string().max(160),
    cardImage: image(),       // hub-page card + OG image
    cardImageAlt: z.string(),

    // Procedures performed, chronological
    procedures: z.array(procedureRecord).min(1),

    // Which service page(s) this case demonstrates \u2014 rendered as the
    // related-links block, same component as service pages use.
    // Minimum 3, matching the sitewide internal-linking rule used by every
    // other related-links block on the site — .related-grid is a fixed
    // 3-column grid, so fewer than 3 leaves visible empty space.
    serviceLinks: z.array(z.string()).min(3),

    // Chronological photo timeline \u2014 this is the core of the page.
    timeline: z.array(timelineEntry).min(2),

    // Dr. Sierra's narrative account of the case. AEO: firstParagraph should
    // stand alone as a complete answer (same rule as service pages' que\u00e9s).
    narrative: z.object({
      firstParagraph: z.string(),
      paragraphs: z.array(z.string()).max(4),
    }),

    // Optional \u2014 not every case has video yet.
    video: z.object({
      url: z.string(),
      caption: z.string().optional(),
    }).optional(),

    // Consent tracking lives with the case record itself. consentConfirmed
    // is a HARD BUILD GATE below \u2014 a case cannot deploy without it.
    consentConfirmed: z.boolean(),
    consentNotes: z.string().optional(),

    // Set true ONLY for test/placeholder fixtures (fake data used to verify
    // the template). Real cases should never set this \u2014 they're the whole
    // point of building this page's SEO/AEO structure in the first place.
    noindex: z.boolean().optional(),

    whatsappNumber: z.string().default('WHATSAPP_NUMBER'),
    })
      .refine(
        (data) => !JSON.stringify(data).toLowerCase().includes('labio leporino'),
        { message: '"labio leporino" is forbidden \u2014 use "labio fisurado" per clinical terminology rules.' }
      )
      .refine(
        (data) => data.consentConfirmed === true,
        {
          message: 'consentConfirmed must be true \u2014 a case cannot be published without ' +
            'confirmed signed consent for PUBLIC WEBSITE use (separate from any clinical/teaching ' +
            'consent that may already exist). Set consentNotes with who confirmed it and when.',
          path: ['consentConfirmed'],
        }
      );
  },
});

export const collections = { services, about, camino, homepage, cases };


