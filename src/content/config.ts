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

export const collections = { services };
