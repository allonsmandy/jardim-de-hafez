import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../../shared/utils/content'

const ROOT = join(import.meta.dirname, '..', '..')

async function listYaml(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((e) =>
      e.isDirectory()
        ? listYaml(join(dir, e.name))
        : Promise.resolve(e.name.endsWith('.yml') ? [join(dir, e.name)] : []),
    ),
  )
  return nested.flat()
}

describe('acervo real em content/', () => {
  it('é válido', async () => {
    const poems: Record<string, string> = {}
    for (const f of await listYaml(join(ROOT, 'content', 'poetry')))
      poems[relative(ROOT, f)] = await readFile(f, 'utf8')
    const result = loadContent({
      sources: await readFile(join(ROOT, 'content', 'sources.yml'), 'utf8'),
      glossary: await readFile(join(ROOT, 'content', 'glossary.yml'), 'utf8'),
      poems,
    })
    expect(result.issues).toEqual([])
  })
})
