import type { GlossaryEntry } from '../schemas/glossary'

export type TextSegment = { text: string; termId?: undefined } | { text: string; termId: string }

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Compila um localizador de termos do glossário (aliases mais longos primeiro). */
export function buildGlossaryMatcher(entries: readonly GlossaryEntry[]) {
  const aliasToId = new Map<string, string>()
  for (const e of entries) for (const alias of e.aliases) aliasToId.set(alias, e.id)
  const aliases = [...aliasToId.keys()].sort((a, b) => b.length - a.length)
  const regex = aliases.length
    ? new RegExp(`(?<![\\p{L}\\p{N}])(${aliases.map(escape).join('|')})(?![\\p{L}\\p{N}])`, 'gu')
    : undefined
  return { regex, aliasToId }
}

/**
 * Divide um texto em trechos, marcando os termos do glossário.
 * Cada termo é marcado só na primeira ocorrência (dentro de `seen`), para não poluir a leitura.
 */
export function splitByGlossary(
  text: string,
  matcher: ReturnType<typeof buildGlossaryMatcher>,
  seen: Set<string> = new Set(),
  exclude?: string,
): TextSegment[] {
  if (!matcher.regex) return [{ text }]
  const segments: TextSegment[] = []
  let last = 0
  for (const m of text.matchAll(matcher.regex)) {
    const id = matcher.aliasToId.get(m[0])
    if (!id || id === exclude || seen.has(id)) continue
    seen.add(id)
    if (m.index > last) segments.push({ text: text.slice(last, m.index) })
    segments.push({ text: m[0], termId: id })
    last = m.index + m[0].length
  }
  if (last < text.length) segments.push({ text: text.slice(last) })
  return segments
}
