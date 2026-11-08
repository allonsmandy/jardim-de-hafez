import { z } from 'zod'
import { PoemCategoryId } from '#shared/schemas/poem'
import { getNeighbors, toSummary } from '#shared/utils/library'
import { checkPublication } from '#shared/utils/publication'

const Params = z.object({
  category: PoemCategoryId,
  number: z.coerce.number().int().positive(),
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (p) => Params.safeParse(p))
  if (!params.success) throw createError({ statusCode: 404, message: 'Poema não encontrado' })
  const { category, number } = params.data

  const poems = await getVisiblePoems()
  const poem = poems.find((p) => p.category === category && p.number === number)
  if (!poem) throw createError({ statusCode: 404, message: 'Poema não encontrado' })

  const { sources, glossary } = await getContent()
  const usedSourceIds = new Set([
    ...poem.references.map((r) => r.source),
    poem.original?.edition,
    poem.original?.transcription.source,
    poem.translation?.basedOn?.source,
    ...poem.culturalNotes.flatMap((n) => n.sources.map((s) => s.source)),
  ])

  return {
    poem,
    publication: checkPublication(poem),
    glossary: glossary.filter((g) => poem.glossary.includes(g.id)),
    neighbors: getNeighbors(poems.map(toSummary), poem),
    sources: sources.filter((s) => usedSourceIds.has(s.id)),
  }
})
