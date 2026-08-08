// Single source of truth for the blog's category taxonomy (Option C, decided
// 2026-08-08: procedure = primary crawlable category, matching the 8 existing
// service pages exactly — same slugs as src/content/services/*.json — plus
// one catch-all for pieces that don't map to a single procedure, e.g.
// "cómo elegir cirujano especialista" or "sanidad pública vs. privada".
export const BLOG_CATEGORIES = {
  'ortopedia-prequirurgica-nam': { name: 'Ortopedia Prequirúrgica (NAM)', href: '/ortopedia-prequirurgica-nam/' },
  'cirugia-labio-fisurado': { name: 'Labio Fisurado', href: '/cirugia-labio-fisurado/' },
  'cirugia-paladar-hendido': { name: 'Paladar Hendido', href: '/cirugia-paladar-hendido/' },
  'injerto-oseo-alveolar': { name: 'Injerto Óseo Alveolar', href: '/injerto-oseo-alveolar/' },
  'cirugia-ortognatica-flp': { name: 'Cirugía Ortognática', href: '/cirugia-ortognatica-flp/' },
  'rinoplastia-flp': { name: 'Rinoplastia', href: '/rinoplastia-flp/' },
  'cirugia-revision-fisura': { name: 'Cirugía de Revisión', href: '/cirugia-revision-fisura/' },
  'otros-procedimientos': { name: 'Otros Procedimientos', href: '/otros-procedimientos/' },
  'recursos-generales': { name: 'Recursos Generales', href: null },
} as const;

export type BlogCategory = keyof typeof BLOG_CATEGORIES;

export const BLOG_CATEGORY_SLUGS = Object.keys(BLOG_CATEGORIES) as BlogCategory[];
