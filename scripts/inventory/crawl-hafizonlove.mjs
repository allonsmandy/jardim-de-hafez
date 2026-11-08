#!/usr/bin/env node
/**
 * Inventário do Hafiz on Love (https://www.hafizonlove.com).
 *
 * - Percorre apenas páginas HTML públicas do mesmo domínio, a partir da home.
 * - Respeita um intervalo entre requisições (padrão: 800 ms) e não tenta
 *   contornar bloqueios: qualquer resposta diferente de 200 é apenas registrada.
 * - Guarda o HTML bruto em `.cache/hafizonlove/` (ignorado pelo git) para que a
 *   análise seja reproduzível sem novas requisições.
 * - Grava SOMENTE METADADOS em `data/inventory/hafizonlove.json`. Nenhum texto
 *   de tradução é copiado para o repositório. O primeiro verso persa é guardado
 *   apenas como chave de identificação/deduplicação entre edições.
 *
 * Uso:
 *   node scripts/inventory/crawl-hafizonlove.mjs            # usa cache quando existir
 *   node scripts/inventory/crawl-hafizonlove.mjs --refresh  # ignora o cache
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const ORIGIN = 'https://www.hafizonlove.com'
const START = `${ORIGIN}/index.html`
const CACHE_DIR = join(ROOT, '.cache', 'hafizonlove')
const OUT_FILE = join(ROOT, 'data', 'inventory', 'hafizonlove.json')
const DELAY_MS = Number(process.env.CRAWL_DELAY_MS ?? 800)
const USER_AGENT = 'JardimDeHafezInventory/0.1 (auditoria editorial nao comercial)'
const REFRESH = process.argv.includes('--refresh')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))

const stripTags = (s) => decode(s.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '')).trim()

function cachePath(url) {
  const path = new URL(url).pathname.replace(/^\//, '') || 'index.html'
  return join(CACHE_DIR, path)
}

async function fetchHtml(url) {
  const file = cachePath(url)
  if (!REFRESH && existsSync(file)) {
    return { status: 200, html: await readFile(file, 'utf8'), cached: true }
  }
  await sleep(DELAY_MS)
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  const html = res.ok ? await res.text() : ''
  if (res.ok) {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
  }
  return { status: res.status, html, cached: false }
}

function extractLinks(html, base) {
  const links = []
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/gi)) {
    try {
      links.push(new URL(m[1], base).toString())
    } catch {
      /* ignora URLs malformadas */
    }
  }
  return [...new Set(links)]
}

const classify = (pathname) => {
  if (pathname === '/index.html' || pathname === '/') return 'home'
  if (pathname === '/divan/index.html') return 'poetry-index'
  if (/^\/divan\/index-\d+\.html$/.test(pathname)) return 'ghazal-group-index'
  if (/^\/divan\/p_ghazal-\d+\.html$/.test(pathname)) return 'ghazal'
  if (/^\/divan\/po_[a-z]+\.html$/.test(pathname)) return 'other-work'
  if (pathname === '/images/index.html') return 'artwork-gallery'
  if (pathname === '/more/index.html') return 'biography'
  if (pathname === '/more/fal.html') return 'fal'
  if (pathname === '/more/shahriar.html') return 'about-translator'
  if (pathname === '/more/credits.html') return 'credits'
  if (pathname === '/more/disclaimer.html') return 'disclaimer'
  return 'other'
}

function analyse(url, html) {
  const { pathname } = new URL(url)
  const type = classify(pathname)
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '')
  const h1 = stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '')
  const persianHeading = stripTags(
    html.match(/<span class="(?:fa-n|fa-h)">([\s\S]*?)<\/span>/i)?.[1] ?? '',
  )
  const faBlocks = [...html.matchAll(/<(?:div|p) class="v-fa">([\s\S]*?)<\/(?:div|p)>/gi)].map(
    (m) => stripTags(m[1]),
  )
  const enBlocks = [...html.matchAll(/<(?:div|p) class="v-en">([\s\S]*?)<\/(?:div|p)>/gi)]
  const record = {
    url,
    path: pathname,
    type,
    title,
    heading: h1 || null,
    persianHeading: persianHeading || null,
    languages: [
      enBlocks.length ? 'en' : null,
      faBlocks.length || /[؀-ۿ]/.test(h1 + persianHeading) ? 'fa' : null,
    ].filter(Boolean),
    hasPersianText: faBlocks.length > 0,
    hasEnglishTranslation: enBlocks.length > 0,
    units: Math.max(faBlocks.length, enBlocks.length),
  }
  if (type === 'ghazal') {
    record.number = Number(pathname.match(/p_ghazal-(\d+)/)[1])
    record.translationDate =
      stripTags(
        html.match(/<h1>[\s\S]*?<\/h1>\s*<span class="muted"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? '',
      ) || null
    record.firstLineFa = faBlocks[0]?.split('\n')[0]?.trim() ?? null
  }
  if (type === 'other-work') {
    record.slug = pathname.match(/po_([a-z]+)/)[1]
    record.firstLineFa = faBlocks[0]?.split('\n')[0]?.trim() ?? null
  }
  if (type === 'artwork-gallery') {
    const imgs = [...html.matchAll(/src="([^"]+\.(?:jpe?g|png|gif))"/gi)].map((m) => m[1])
    record.images = imgs.length
    record.imageMetadata =
      'Somente rótulos genéricos ("Artwork N"); sem autoria, data, acervo ou licença.'
  }
  if (type === 'fal') {
    const m = html.match(/var falData = (\[[\s\S]*?\]);/)
    if (m) {
      const data = JSON.parse(m[1])
      record.falPoolSize = data.length
      record.falPoolNumbers = data.map((d) => d.number)
      record.falAlgorithm = /Math\.floor\(Math\.random\(\) \* falData\.length\)/.test(html)
        ? 'Math.floor(Math.random() * falData.length) — sorteio uniforme sobre os gazéis traduzidos'
        : 'não identificado'
    }
  }
  return record
}

async function main() {
  const queue = [START]
  const seen = new Set(queue)
  const pages = []
  const assets = []
  const external = new Set()
  const failures = []

  while (queue.length) {
    const url = queue.shift()
    const { status, html, cached } = await fetchHtml(url)
    process.stdout.write(`${cached ? 'cache' : status} ${url}\n`)
    if (status !== 200) {
      failures.push({ url, status })
      continue
    }
    pages.push(analyse(url, html))
    for (const link of extractLinks(html, url)) {
      const u = new URL(link)
      if (u.hostname.replace(/^www\./, '') !== 'hafizonlove.com') {
        if (/^https?:$/.test(u.protocol)) external.add(`${u.origin}${u.pathname}`)
        continue
      }
      u.hostname = 'www.hafizonlove.com'
      u.protocol = 'https:'
      const normalized = u.toString()
      if (seen.has(normalized)) continue
      seen.add(normalized)
      if (/\.html?$/.test(u.pathname) || u.pathname.endsWith('/')) queue.push(normalized)
      else assets.push({ url: normalized, kind: u.pathname.split('.').pop() })
    }
  }

  pages.sort((a, b) => a.path.localeCompare(b.path, 'en', { numeric: true }))
  const ghazals = pages.filter((p) => p.type === 'ghazal')
  const ghazalNumbers = ghazals.map((g) => g.number).sort((a, b) => a - b)
  const missing = []
  for (let i = 1; i <= 495; i++) if (!ghazalNumbers.includes(i)) missing.push(i)
  const fal = pages.find((p) => p.type === 'fal')

  const out = {
    generatedAt: new Date().toISOString(),
    origin: ORIGIN,
    method:
      'Rastreamento BFS de páginas HTML públicas a partir da home; sem robots.txt (404); intervalo de ' +
      DELAY_MS +
      ' ms.',
    license:
      '© 1999–2025 Shahriar Shahriari. "Non-commercial use permitted with full credit and hyperlink." Ver docs/copyright-and-sources.md.',
    summary: {
      htmlPages: pages.length,
      byType: pages.reduce((acc, p) => ((acc[p.type] = (acc[p.type] ?? 0) + 1), acc), {}),
      ghazalsWithPage: ghazals.length,
      ghazalsWithoutPage: missing.length,
      falPoolMatchesGhazalPages: fal
        ? JSON.stringify([...fal.falPoolNumbers].sort((a, b) => a - b)) ===
          JSON.stringify(ghazalNumbers)
        : null,
      assets: assets.length,
      failures: failures.length,
    },
    ghazalNumbersWithPage: ghazalNumbers,
    ghazalNumbersWithoutPage: missing,
    pages,
    assets,
    externalLinks: [...external].sort(),
    failures,
  }

  await mkdir(dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, JSON.stringify(out, null, 2) + '\n')
  console.log('\nResumo:', JSON.stringify(out.summary, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
