import type { PoemCategoryId } from '../schemas/poem'

export interface PoemCategory {
  id: PoemCategoryId
  /** Segmento da URL em português: /diva/<slug>/<numero> */
  slug: string
  label: string
  labelPlural: string
  labelFa: string
  description: string
  /** Total tradicional de peças nesta categoria, quando conhecido. */
  expectedCount?: number
}

/**
 * Categorias identificadas no Hafiz on Love (ver docs/content-inventory.md).
 * A grafia em português segue a convenção adotada em docs/translation-workflow.md.
 */
export const POEM_CATEGORIES: readonly PoemCategory[] = [
  {
    id: 'gazal',
    slug: 'gazeis',
    label: 'Gazel',
    labelPlural: 'Gazéis',
    labelFa: 'غزلیات',
    description:
      'Poemas líricos curtos, de rima única, em que o poeta costuma assinar o próprio nome no último dístico. São o coração do Divã.',
    expectedCount: 495,
  },
  {
    id: 'rubai',
    slug: 'rubaiyat',
    label: 'Rubai',
    labelPlural: 'Rubaiyat',
    labelFa: 'رباعیات',
    description: 'Quadras de quatro versos, formas breves e epigramáticas.',
    expectedCount: 42,
  },
  {
    id: 'saqi-nameh',
    slug: 'saqi-nameh',
    label: 'Saqi-Nameh',
    labelPlural: 'Saqi-Nameh',
    labelFa: 'ساقی نامه',
    description: 'O “Livro do Copeiro”, poema longo em dísticos dirigidos ao saqi, o copeiro.',
    expectedCount: 1,
  },
  {
    id: 'ahu-ye-vahshi',
    slug: 'gazela-selvagem',
    label: 'A gazela selvagem',
    labelPlural: 'A gazela selvagem',
    labelFa: 'آهوی وحشی',
    description:
      'Poema em dísticos que começa com o chamado a uma gazela selvagem (Ahu-ye Vahshi).',
    expectedCount: 1,
  },
  {
    id: 'qete',
    slug: 'qetes',
    label: 'Qet‘e',
    labelPlural: 'Qet‘es',
    labelFa: 'قطعات',
    description:
      'Poemas curtos de ocasião — conselhos, elogios, datas de morte de amigos e protetores — sem a rima no primeiro verso que o gazel exige.',
    expectedCount: 34,
  },
  {
    id: 'qaside',
    slug: 'qasides',
    label: 'Qaside',
    labelPlural: 'Qasides',
    labelFa: 'قصاید',
    description: 'Odes longas e solenes, escritas para elogiar governantes e vizires de Shiraz.',
    expectedCount: 3,
  },
  {
    id: 'diversos',
    slug: 'diversos',
    label: 'Poema diverso',
    labelPlural: 'Diversos',
    labelFa: 'اشعار منتسب',
    description:
      'Poemas atribuídos a Hafez por tradição, mas cuja autoria os estudiosos consideram duvidosa.',
    expectedCount: 118,
  },
] as const

export function getCategory(id: PoemCategoryId): PoemCategory {
  const category = POEM_CATEGORIES.find((c) => c.id === id)
  if (!category) throw new Error(`Categoria desconhecida: ${id}`)
  return category
}

export function getCategoryBySlug(slug: string): PoemCategory | undefined {
  return POEM_CATEGORIES.find((c) => c.slug === slug)
}

export function poemPath(poem: { category: PoemCategoryId; number: number }): string {
  return `/diva/${getCategory(poem.category).slug}/${poem.number}`
}
