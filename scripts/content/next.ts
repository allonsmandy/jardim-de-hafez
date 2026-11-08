/**
 * Lista os próximos poemas ainda não traduzidos (status `pending`), em ordem.
 *
 * Uso:
 *   pnpm content:next                       (10 próximos, todas as categorias)
 *   pnpm content:next --category rubai --count 20
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { parse } from 'yaml'
import { POEM_CATEGORIES } from '../../shared/utils/categories'
import type { PoemInput } from '../../shared/schemas/poem'

const ROOT = join(import.meta.dirname, '..', '..')

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function main() {
  const only = arg('category')
  const count = Number(arg('count') ?? 10)
  const categories = POEM_CATEGORIES.filter((c) => !only || c.id === only)
  if (!categories.length) throw new Error(`Categoria desconhecida: ${only}`)

  let shown = 0
  for (const category of categories) {
    const dir = join(ROOT, 'content', 'poetry', category.id)
    const files = (await readdir(dir).catch(() => [] as string[]))
      .filter((f) => f.endsWith('.yml'))
      .sort()
    const pending: { file: string; poem: PoemInput }[] = []
    for (const f of files) {
      const poem = parse(await readFile(join(dir, f), 'utf8')) as PoemInput
      if (poem.translationStatus === 'pending') pending.push({ file: join(dir, f), poem })
    }
    const done = files.length - pending.length
    console.log(
      `\n${category.labelPlural} — ${done} traduzidos, ${pending.length} pendentes` +
        (category.expectedCount && files.length < category.expectedCount
          ? ` (faltam importar ${category.expectedCount - files.length})`
          : ''),
    )
    for (const { file, poem } of pending.slice(0, count - shown)) {
      const n = poem.original?.stanzas.length ?? 0
      console.log(`  ${relative(ROOT, file).padEnd(45)} ${String(n).padStart(3)} estrofes`)
      shown++
    }
    if (shown >= count) break
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
