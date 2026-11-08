import { loadContent, type LoadedContent } from '#shared/utils/content'
import { isPublishable } from '#shared/utils/publication'
import type { Poem } from '#shared/schemas/poem'

let cache: Promise<LoadedContent> | undefined

/**
 * Repositório de conteúdo. Hoje lê arquivos YAML de `content/` (server assets do
 * Nitro); no futuro pode ser trocado por um CMS mantendo a mesma interface.
 */
async function readAll(): Promise<LoadedContent> {
  const storage = useStorage('assets:content')
  const keys = await storage.getKeys('poetry')
  const poems: Record<string, string> = {}
  for (const key of keys.filter((k) => k.endsWith('.yml'))) {
    poems[`content/${key.replace(/:/g, '/')}`] = String((await storage.getItem(key)) ?? '')
  }
  const sources = String((await storage.getItem('sources.yml')) ?? '[]')
  const glossary = String((await storage.getItem('glossary.yml')) ?? '[]')
  const content = loadContent({ sources, glossary, poems })
  if (content.issues.length) {
    const detail = content.issues.map((i) => `${i.file} › ${i.path}: ${i.message}`).join('\n')
    throw new Error(`Conteúdo inválido. Rode "pnpm content:validate".\n${detail}`)
  }
  return content
}

export function getContent(): Promise<LoadedContent> {
  if (import.meta.dev) return readAll()
  cache ??= readAll()
  return cache
}

/** Poemas visíveis: publicados ou, na prévia editorial, todos. */
export async function getVisiblePoems(): Promise<Poem[]> {
  const { poems } = await getContent()
  const preview = useRuntimeConfig().editorialPreview
  return poems.filter((p) => preview || isPublishable(p))
}
