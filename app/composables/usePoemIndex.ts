import type { PoemSummary } from '#shared/schemas/poem'

/** Índice de poemas publicados (JSON estático, compartilhado entre páginas). */
export function usePoemIndex() {
  return useFetch<PoemSummary[]>('/api/poems.json', {
    key: 'poem-index',
    default: () => [],
  })
}
