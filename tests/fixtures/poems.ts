/**
 * Dados de TESTE. Os versos abaixo são marcadores neutros, não traduções de
 * Hafez, e nunca devem ser copiados para content/.
 */
import type { PoemInput } from '../../shared/schemas/poem'
import { Poem } from '../../shared/schemas/poem'

export function makePoemInput(overrides: Partial<PoemInput> = {}): PoemInput {
  const number = overrides.number ?? 1
  const category = overrides.category ?? 'gazal'
  return {
    id: `${category}-${String(number).padStart(3, '0')}`,
    category,
    number,
    firstLine: { fa: `مصرع آزمایشی ${number}`, pt: `Verso de teste ${number}` },
    original: {
      language: 'fa',
      stanzas: [
        [`مصرع آزمایشی ${number}`, 'مصرع دوم'],
        ['مصرع سوم', 'مصرع چهارم'],
      ],
      edition: 'qazvini-ghani',
      transcription: { source: 'ganjoor', locator: `Gazel ${number}` },
    },
    translation: {
      language: 'pt-BR',
      kind: 'translation',
      stanzas: [
        [`Verso de teste ${number}`, 'Segundo verso de teste'],
        ['Terceiro verso de teste com rosa', 'Quarto verso de teste'],
      ],
      translators: ['Tradutora de Teste'],
      reviewers: ['Revisor de Teste'],
      reviewedAt: '2026-01-10',
    },
    translationStatus: 'approved',
    publicationAuthorized: true,
    authorization: {
      by: 'Editora de Teste',
      at: '2026-01-11',
      basis: 'Tradução original do projeto',
    },
    references: [{ source: 'qazvini-ghani', locator: `Gazel ${number}` }],
    updatedAt: '2026-01-11',
    ...overrides,
  }
}

export const makePoem = (overrides: Partial<PoemInput> = {}) => Poem.parse(makePoemInput(overrides))

export const sourcesYaml = `
- id: qazvini-ghani
  type: critical-edition
  title: Divan
  rights: { status: public-domain, note: teste }
  usableForPublication: true
- id: ganjoor
  type: digital-transcription
  title: Ganjoor
  rights: { status: unverified, note: teste }
  usableForPublication: true
- id: restrita
  type: translation
  title: Tradução protegida
  rights: { status: restricted, note: teste }
  usableForPublication: false
`
