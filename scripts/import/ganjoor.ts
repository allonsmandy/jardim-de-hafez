/**
 * Importa o TEXTO PERSA dos poemas de Hafez a partir da API pública do Ganjoor
 * e cria arquivos de poema com status `pending` (nunca publicados automaticamente).
 *
 * - Não sobrescreve arquivos existentes (para não apagar trabalho de tradução),
 *   exceto com --force, e mesmo assim só substitui o bloco `original`.
 * - Não importa comentários, resumos ou leituras do Ganjoor.
 * - Intervalo de 1 s entre requisições.
 *
 * Uso:
 *   pnpm import:ganjoor --from 1 --to 10                    (gazéis)
 *   pnpm import:ganjoor --category rubai --from 1 --to 42
 *   pnpm import:ganjoor --category saqi-nameh               (poema único)
 *   Categorias: gazal, rubai, qete, qaside, diversos, saqi-nameh, ahu-ye-vahshi
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse, stringify } from 'yaml'
import { Poem, type PoemCategoryId, type PoemInput } from '../../shared/schemas/poem'

const ROOT = join(import.meta.dirname, '..', '..')
const API = 'https://api.ganjoor.net/api/ganjoor/poem'
const USER_AGENT = 'JardimDeHafezImport/0.1 (projeto editorial nao comercial)'

/** Onde cada categoria do site fica no Ganjoor. `single` = poema único (número 1). */
const GANJOOR: Record<
  PoemCategoryId,
  { path: string; single?: boolean; locator: string; edition: string }
> = {
  gazal: { path: '/hafez/ghazal', locator: 'Gazel', edition: 'qazvini-ghani' },
  rubai: { path: '/hafez/robaee2', locator: 'Rubai', edition: 'qazvini-ghani' },
  qete: { path: '/hafez/ghete', locator: 'Qet‘e', edition: 'qazvini-ghani' },
  qaside: { path: '/hafez/ghaside', locator: 'Qaside', edition: 'qazvini-ghani' },
  'saqi-nameh': {
    path: '/hafez/saghiname',
    single: true,
    locator: 'Saqi-Nameh',
    edition: 'qazvini-ghani',
  },
  'ahu-ye-vahshi': {
    path: '/hafez/masnavi',
    single: true,
    locator: 'Masnavi (Ahu-ye Vahshi)',
    edition: 'qazvini-ghani',
  },
  // Poemas atribuídos (fora da edição Qazvini-Ghani): a referência é o próprio Ganjoor.
  diversos: { path: '/hafez/montasab', locator: 'Poema atribuído', edition: 'ganjoor' },
}

interface GanjoorVerse {
  vOrder: number
  coupletIndex: number
  versePosition: number
  text: string
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function fetchPoem(category: PoemCategoryId, n: number) {
  const map = GANJOOR[category]
  const params = new URLSearchParams({
    url: map.single ? map.path : `${map.path}/sh${n}`,
    verseDetails: 'true',
    catInfo: 'false',
    catPoems: 'false',
    rhymes: 'false',
    recitations: 'false',
    images: 'false',
    songs: 'false',
    comments: 'false',
    navigation: 'false',
    relatedpoems: 'false',
  })
  const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`Ganjoor respondeu ${res.status} para ${category} ${n}`)
  const data = (await res.json()) as { fullUrl: string; verses: GanjoorVerse[] }
  const couplets = new Map<number, string[]>()
  for (const v of [...data.verses].sort((a, b) => a.vOrder - b.vOrder)) {
    // versePosition 0/1 = hemistíquios direito/esquerdo de um bayt
    if (v.versePosition !== 0 && v.versePosition !== 1) continue
    const list = couplets.get(v.coupletIndex) ?? []
    list.push(v.text.trim())
    couplets.set(v.coupletIndex, list)
  }
  return { url: `https://ganjoor.net${data.fullUrl}`, stanzas: [...couplets.values()] }
}

async function main() {
  const category = (arg('category') ?? 'gazal') as PoemCategoryId
  const map = GANJOOR[category]
  if (!map) throw new Error(`Categoria desconhecida: ${category}`)
  const from = map.single ? 1 : Number(arg('from') ?? 1)
  const to = map.single ? 1 : Number(arg('to') ?? from)
  const force = process.argv.includes('--force')
  const today = new Date().toISOString().slice(0, 10)
  const dir = join(ROOT, 'content', 'poetry', category)
  await mkdir(dir, { recursive: true })

  for (let n = from; n <= to; n++) {
    const id = `${category}-${String(n).padStart(3, '0')}`
    const locator = map.single ? map.locator : `${map.locator} ${n}`
    const file = join(dir, `${id}.yml`)
    if (existsSync(file) && !force) {
      console.log(`= ${id} já existe (use --force para atualizar apenas o original)`)
      continue
    }
    const { url, stanzas } = await fetchPoem(category, n)
    const original = {
      language: 'fa' as const,
      stanzas,
      edition: map.edition,
      transcription: { source: 'ganjoor', locator, url },
    }
    const existing = existsSync(file)
      ? (parse(await readFile(file, 'utf8')) as PoemInput)
      : undefined
    const poem: PoemInput = existing
      ? { ...existing, original, updatedAt: today }
      : {
          id,
          category,
          number: n,
          firstLine: { fa: stanzas[0]![0]! },
          originalLanguage: 'fa',
          original,
          translationStatus: 'pending',
          publicationAuthorized: false,
          references: [{ source: map.edition, locator }],
          editorialNotes: [
            `Texto persa importado automaticamente do Ganjoor em ${today}; conferir com a edição impressa.`,
          ],
          updatedAt: today,
        }
    Poem.parse(poem)
    await writeFile(file, stringify(poem, { lineWidth: 0 }))
    console.log(`+ ${id} (${stanzas.length} dísticos)`)
    await new Promise((r) => setTimeout(r, 1000))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
