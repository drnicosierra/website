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

const gridRow = z.object({
  num: z.string(),
  name: z.string(),
  tag: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  href: z.string().regex(/^\/[a-z-]+\/$|^\/cuentanos-tu-historia$/, 'href must be a real slug ending in / (or /cuentanos-tu-historia)'),
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

    servicesGrid: z.object({
      eyebrow: z.string(),
      h2: z.string(),
      rows: z.array(gridRow).min(6).max(9),
    }),

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

export const collections = { services, about, camino, homepage };


