/**
 * Valida todo o acervo em content/ e imprime um relatório editorial.
 * Sai com código 1 se houver qualquer problema — usado no `pnpm check` e na CI.
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { loadContent } from '../../shared/utils/content'
import { checkPublication } from '../../shared/utils/publication'
import { POEM_CATEGORIES } from '../../shared/utils/categories'

const ROOT = join(import.meta.dirname, '..', '..')

async function listYaml(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
  const nested = await Promise.all(
    entries.map((e) =>
      e.isDirectory()
        ? listYaml(join(dir, e.name))
        : Promise.resolve(e.name.endsWith('.yml') ? [join(dir, e.name)] : []),
    ),
  )
  return nested.flat()
}

async function main() {
  const poemFiles = await listYaml(join(ROOT, 'content', 'poetry'))
  const poems: Record<string, string> = {}
  for (const f of poemFiles) poems[relative(ROOT, f)] = await readFile(f, 'utf8')
  const sources = await readFile(join(ROOT, 'content', 'sources.yml'), 'utf8')

  const glossary = await readFile(join(ROOT, 'content', 'glossary.yml'), 'utf8')
  const result = loadContent({ sources, glossary, poems })

  console.log('Jardim de Hafez — validação do acervo\n')
  for (const category of POEM_CATEGORIES) {
    const list = result.poems.filter((p) => p.category === category.id)
    const counts = { pending: 0, draft: 0, review: 0, approved: 0 }
    for (const p of list) counts[p.translationStatus]++
    const checks = list.map(checkPublication)
    const published = checks.filter((c) => c.level === 'verified').length
    const preliminary = checks.filter((c) => c.level === 'preliminary').length
    const expected = category.expectedCount ? ` / ${category.expectedCount} previstos` : ''
    console.log(
      `${category.labelPlural.padEnd(20)} ${String(list.length).padStart(3)} arquivos${expected} · ` +
        `pendentes ${counts.pending} · rascunho ${counts.draft} · revisão ${counts.review} · aprovados ${counts.approved} · publicados ${published} · preliminares ${preliminary}`,
    )
  }
  console.log(
    `\nFontes registradas: ${result.sources.length} · termos no glossário: ${result.glossary.length}`,
  )

  if (result.issues.length) {
    console.error(`\n✗ ${result.issues.length} problema(s):`)
    for (const i of result.issues) console.error(`  ${i.file} › ${i.path}: ${i.message}`)
    process.exit(1)
  }
  console.log('\n✓ Acervo válido.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
