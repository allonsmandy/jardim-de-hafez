/**
 * Temas do glossário, para filtrar e colorir a página /glossario.
 * Termos novos que não estiverem aqui caem em "outros" — basta acrescentá-los.
 */
export interface GlossaryGroup {
  id: string
  label: string
  /** Cor de destaque (tokens do design system). */
  color: string
  ids: string[]
}

export const GLOSSARY_GROUPS: GlossaryGroup[] = [
  {
    id: 'forma',
    label: 'A forma do poema',
    color: 'var(--color-wine)',
    ids: ['gazel', 'disticos', 'hemistiquio', 'radif', 'takhallos', 'divan'],
  },
  {
    id: 'personagens',
    label: 'Personagens',
    color: '#8a6a2c',
    ids: ['saqi', 'amado', 'rend', 'pir-e-moghan', 'xeque', 'dervixe', 'sufi', 'sultao'],
  },
  {
    id: 'simbolos',
    label: 'Símbolos',
    color: '#a2524f',
    ids: [
      'vinho',
      'rosa-rouxinol',
      'cipreste',
      'narciso',
      'almiscar',
      'gazela',
      'saba',
      'kherqe',
      'huri',
    ],
  },
  {
    id: 'historias',
    label: 'Histórias e lendas',
    color: '#5b3f7a',
    ids: ['majnun', 'jose-zuleica', 'jamshid', 'shakh-e-nabat'],
  },
  {
    id: 'religiao',
    label: 'Religião e língua',
    color: 'var(--color-cypress)',
    ids: ['alcorao', 'islam', 'arabe'],
  },
  {
    id: 'historia',
    label: 'Época de Hafez',
    color: '#1f3d5a',
    ids: [
      'mongois',
      'abu-said',
      'abu-eshaq',
      'vizir',
      'haji-qavam',
      'mobarez',
      'mozaffaridas',
      'shah-shoja',
      'timur',
      'golandam',
    ],
  },
  {
    id: 'lugares',
    label: 'Lugares',
    color: '#3f6b4c',
    ids: ['shiraz', 'mosalla', 'yazd', 'isfahan', 'samarcanda', 'bucara'],
  },
  {
    id: 'poetas',
    label: 'Poetas, livros e artistas',
    color: '#6b4f1a',
    ids: ['hafez', 'saadi', 'rumi', 'nezami', 'attar', 'jami', 'dowlatshah', 'shajarian'],
  },
  {
    id: 'tradicoes',
    label: 'Tradições',
    color: '#c97b4a',
    ids: ['fal', 'yalda', 'nowruz', 'chahar-bagh'],
  },
]

export const OTHER_GROUP: GlossaryGroup = {
  id: 'outros',
  label: 'Outros',
  color: 'var(--color-ink-muted)',
  ids: [],
}

export function groupOf(termId: string): GlossaryGroup {
  return GLOSSARY_GROUPS.find((g) => g.ids.includes(termId)) ?? OTHER_GROUP
}
