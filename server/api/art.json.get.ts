import { parse } from 'yaml'
import { ArtCollection } from '#shared/schemas/artwork'

/** Galeria Arte Persa: obras com origem e licença verificadas (content/art.yml). */
export default defineEventHandler(async () => {
  const raw = String((await useStorage('assets:content').getItem('art.yml')) ?? '[]')
  const result = ArtCollection.safeParse(parse(raw))
  if (!result.success) {
    throw createError({
      statusCode: 500,
      message: `content/art.yml inválido: ${result.error.message}`,
    })
  }
  const { glossary } = await getContent()
  const known = new Set(glossary.map((g) => g.id))
  const unknown = result.data.flatMap((a) => a.glossary.filter((id) => !known.has(id)))
  if (unknown.length) {
    throw createError({
      statusCode: 500,
      message: `Termos inexistentes em art.yml: ${unknown.join(', ')}`,
    })
  }
  return result.data
})
