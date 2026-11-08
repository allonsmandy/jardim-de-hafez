import { parse } from 'yaml'
import type { z } from 'zod'
import { Poem } from '../schemas/poem'
import { SourceRegistry, type Source } from '../schemas/source'
import { Glossary, type GlossaryEntry } from '../schemas/glossary'
import { normalizeForSearch } from './text'

export interface ContentIssue {
  file: string
  path: string
  message: string
}

export interface LoadedContent {
  poems: Poem[]
  sources: Source[]
  glossary: GlossaryEntry[]
  issues: ContentIssue[]
}

const formatZod = (file: string, error: z.ZodError): ContentIssue[] =>
  error.issues.map((i) => ({ file, path: i.path.join('.') || '(raiz)', message: i.message }))

function parseYaml(file: string, raw: string): { data?: unknown; issue?: ContentIssue } {
  try {
    return { data: parse(raw) }
  } catch (err) {
    return { issue: { file, path: '(yaml)', message: (err as Error).message } }
  }
}

/**
 * Valida o acervo inteiro a partir de arquivos já lidos (path → conteúdo YAML).
 * É usada tanto pelo servidor Nitro quanto pelo script `pnpm content:validate`,
 * garantindo que as mesmas regras valham nos dois lugares.
 */
export function loadContent(files: {
  sources: string
  glossary?: string
  poems: Record<string, string>
}): LoadedContent {
  const issues: ContentIssue[] = []

  const sourcesYaml = parseYaml('content/sources.yml', files.sources)
  if (sourcesYaml.issue) issues.push(sourcesYaml.issue)
  const sourcesResult = SourceRegistry.safeParse(sourcesYaml.data ?? [])
  const sources = sourcesResult.success ? sourcesResult.data : []
  if (!sourcesResult.success) issues.push(...formatZod('content/sources.yml', sourcesResult.error))
  const sourceIds = new Set(sources.map((s) => s.id))

  const glossaryYaml = parseYaml('content/glossary.yml', files.glossary ?? '[]')
  if (glossaryYaml.issue) issues.push(glossaryYaml.issue)
  const glossaryResult = Glossary.safeParse(glossaryYaml.data ?? [])
  const glossary = glossaryResult.success ? glossaryResult.data : []
  if (!glossaryResult.success)
    issues.push(...formatZod('content/glossary.yml', glossaryResult.error))
  const glossaryIds = new Set(glossary.map((g) => g.id))

  const poems: Poem[] = []
  const byId = new Map<string, string>()
  const byFirstLine = new Map<string, string>()

  for (const [file, raw] of Object.entries(files.poems).sort(([a], [b]) => a.localeCompare(b))) {
    const yaml = parseYaml(file, raw)
    if (yaml.issue) {
      issues.push(yaml.issue)
      continue
    }
    const result = Poem.safeParse(yaml.data)
    if (!result.success) {
      issues.push(...formatZod(file, result.error))
      continue
    }
    const poem = result.data

    const expectedFile = `${poem.id}.yml`
    if (!file.endsWith(expectedFile)) {
      issues.push({ file, path: 'id', message: `O arquivo deveria se chamar ${expectedFile}.` })
    }
    if (byId.has(poem.id)) {
      issues.push({
        file,
        path: 'id',
        message: `Duplicata de ${byId.get(poem.id)} (mesma categoria e número).`,
      })
      continue
    }
    const firstLineKey = normalizeForSearch(poem.firstLine.fa)
    if (byFirstLine.has(firstLineKey)) {
      issues.push({
        file,
        path: 'firstLine.fa',
        message: `Mesmo primeiro verso de ${byFirstLine.get(firstLineKey)} — possível duplicata entre edições.`,
      })
    }

    const refs = [
      ...poem.references,
      ...(poem.original ? [poem.original.transcription, { source: poem.original.edition }] : []),
      ...(poem.translation?.basedOn ? [poem.translation.basedOn] : []),
      ...poem.culturalNotes.flatMap((n) => n.sources),
    ]
    for (const ref of refs) {
      if (!sourceIds.has(ref.source)) {
        issues.push({
          file,
          path: 'references',
          message: `Fonte "${ref.source}" não está em content/sources.yml.`,
        })
      }
    }
    for (const term of poem.glossary) {
      if (!glossaryIds.has(term)) {
        issues.push({
          file,
          path: 'glossary',
          message: `Termo "${term}" não está em content/glossary.yml.`,
        })
      }
    }
    if (poem.publicationAuthorized) {
      const basis = [
        { path: 'translation.basedOn', ref: poem.translation?.basedOn },
        { path: 'original.transcription', ref: poem.original?.transcription },
      ]
      for (const { path, ref } of basis) {
        const source = ref && sources.find((s) => s.id === ref.source)
        if (source && !source.usableForPublication) {
          issues.push({
            file,
            path,
            message: `A fonte "${source.id}" ainda não pode servir de base para texto publicado (${source.rights.status}).`,
          })
        }
      }
    }

    byId.set(poem.id, file)
    byFirstLine.set(firstLineKey, file)
    poems.push(poem)
  }

  return { poems, sources, glossary, issues }
}
