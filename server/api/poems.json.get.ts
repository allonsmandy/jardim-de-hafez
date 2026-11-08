import { comparePoems, toSummary } from '#shared/utils/library'

/** Índice de todos os poemas publicados (prerenderizado como JSON estático). */
export default defineEventHandler(async () => {
  const poems = await getVisiblePoems()
  return poems.sort(comparePoems).map(toSummary)
})
