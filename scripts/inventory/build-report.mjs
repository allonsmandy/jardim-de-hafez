#!/usr/bin/env node
/**
 * Gera docs/content-inventory.md a partir de data/inventory/hafizonlove.json
 * e do estado atual de content/poetry (estado de migração/tradução).
 *
 * Uso: pnpm inventory:report
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const inventory = JSON.parse(
  readFileSync(join(ROOT, 'data', 'inventory', 'hafizonlove.json'), 'utf8'),
)

const ROUTES = {
  home: () => '/',
  'poetry-index': () => '/diva',
  'ghazal-group-index': () => '/diva?categoria=gazal',
  ghazal: (p) => `/diva/gazeis/${p.number}`,
  'artwork-gallery': () => '/arte-persa',
  biography: () => '/o-poeta',
  fal: () => '/fal-e-hafez',
  'about-translator': () => '— (página pessoal do tradutor; não se aplica)',
  credits: () => '/creditos',
  disclaimer: () => '/creditos (seção de direitos)',
}
const OTHER_WORK_ROUTES = {
  rubaiyat: '/diva/rubaiyat/[n]',
  saghinameh: '/diva/saqi-nameh/1',
  wilddeer: '/diva/gazela-selvagem/1',
  miscellaneous: '/diva/diversos/[n]',
}
const TYPE_LABEL = {
  home: 'Página inicial',
  'poetry-index': 'Índice do Divã',
  'ghazal-group-index': 'Índice de grupo de gazéis',
  ghazal: 'Gazel',
  'other-work': 'Outra obra',
  'artwork-gallery': 'Galeria de arte',
  biography: 'Biografia',
  fal: 'Fal (interativo)',
  'about-translator': 'Texto pessoal do tradutor',
  credits: 'Créditos',
  disclaimer: 'Aviso legal',
}

function poemState(category, number) {
  const file = join(
    ROOT,
    'content',
    'poetry',
    category,
    `${category}-${String(number).padStart(3, '0')}.yml`,
  )
  if (!existsSync(file)) return { migration: 'não iniciada', translation: '—' }
  const poem = parse(readFileSync(file, 'utf8'))
  return {
    migration: poem.original ? 'texto persa importado (Ganjoor)' : 'arquivo criado',
    translation: poem.translationStatus,
  }
}

const pages = inventory.pages.filter((p) => p.path !== '/') // "/" e "/index.html" são a mesma página
const structural = pages.filter((p) => p.type !== 'ghazal')
const ghazals = pages.filter((p) => p.type === 'ghazal').sort((a, b) => a.number - b.number)

const row = (cells) => `| ${cells.join(' | ')} |`
const lines = []
lines.push(`# Inventário de conteúdo — Hafiz on Love

> Documento gerado por \`pnpm inventory:report\` a partir de \`data/inventory/hafizonlove.json\`
> (coletado por \`pnpm inventory:crawl\`). Não edite as tabelas à mão.
>
> Coleta: ${inventory.generatedAt.slice(0, 10)} · ${inventory.method}

## Resumo

| Item | Quantidade |
|---|---|
| Páginas HTML públicas | ${pages.length} |
| Gazéis com página própria (traduzidos para o inglês) | ${inventory.summary.ghazalsWithPage} de 495 |
| Gazéis sem página no site | ${inventory.summary.ghazalsWithoutPage} |
| Outras obras (páginas) | ${pages.filter((p) => p.type === 'other-work').length} |
| Imagens na página da galeria (35 obras + retrato) | ${pages.find((p) => p.type === 'artwork-gallery')?.images ?? '?'} |
| PDFs | ${inventory.assets.filter((a) => a.kind === 'pdf').length} |
| Falhas de acesso | ${inventory.failures.length} |

**Licença declarada no site:** ${inventory.license}

### Achados principais

1. **O site não contém os 495 gazéis.** Só ${inventory.summary.ghazalsWithPage} gazéis têm página (texto persa + tradução inglesa de Shahriar Shahriari). Os índices
   por grupo (1–50, 51–100…) listam apenas os traduzidos. Os outros ${inventory.summary.ghazalsWithoutPage} gazéis precisam vir de outra fonte (ex.: Ganjoor / edição Qazvini-Ghani).
2. **Fal-e Hafiz:** sorteio no navegador com \`Math.random()\` sobre uma lista embutida de ${pages.find((p) => p.type === 'fal')?.falPoolSize} gazéis —
   ${inventory.summary.falPoolMatchesGhazalPages ? 'exatamente os mesmos que têm página' : 'lista diferente das páginas'}. Mostra o primeiro dístico (persa + inglês) e um link para o gazel.
3. **Numeração:** a numeração de 1 a 495 coincide com a edição Qazvini-Ghani (o gazel 1 é “الا یا ایها الساقی…”), confirmada por amostragem com o Ganjoor.
4. **Galeria de arte:** imagens rotuladas apenas como “Artwork N”, sem autoria, data, acervo ou licença. **Não reutilizáveis** — a galeria brasileira será montada do zero com acervos de domínio público.
5. **Biografia:** mistura dados históricos com narrativas hagiográficas (ex.: vigílias, “Consciência Cósmica” aos 60 anos) sem fontes por afirmação. Não será traduzida; servirá apenas como mapa de temas, a ser reescrito com fontes acadêmicas.
6. **PDFs:** “Hafiz Divan” e “Large Print” reúnem o mesmo conteúdo do site (os ${inventory.summary.ghazalsWithPage} gazéis + outras obras), não o Divã completo.
7. **Sem robots.txt** (404) e nenhuma restrição técnica encontrada; coleta feita com intervalo entre requisições e somente metadados no repositório.

## Páginas estruturais e outras obras

${row(['URL original', 'Título', 'Tipo', 'Idiomas', 'Unidades', 'Rota no Jardim de Hafez', 'Migração', 'Revisão necessária'])}
${row(Array(8).fill('---'))}`)

for (const p of structural) {
  const route =
    p.type === 'other-work' ? (OTHER_WORK_ROUTES[p.slug] ?? '—') : (ROUTES[p.type]?.(p) ?? '—')
  const migration =
    p.type === 'other-work'
      ? 'não iniciada — texto persa a obter de fonte verificável'
      : ['credits', 'disclaimer', 'about-translator'].includes(p.type)
        ? 'não se aplica (conteúdo próprio)'
        : 'reescrita original (não traduzir)'
  const review =
    p.type === 'biography'
      ? 'Sim — separar fatos de tradição; fontes por afirmação'
      : p.type === 'artwork-gallery'
        ? 'Sim — sem metadados de origem/licença'
        : p.type === 'other-work'
          ? 'Sim — tradução e revisão'
          : 'Não'
  lines.push(
    row([
      `[${p.path}](${p.url})`,
      `${p.heading ?? p.title}${p.persianHeading ? ` — ${p.persianHeading}` : ''}`,
      TYPE_LABEL[p.type] ?? p.type,
      p.languages.join(', ') || 'en',
      p.units || '—',
      `\`${route}\``,
      migration,
      review,
    ]),
  )
}

lines.push(`
## Gazéis com página no Hafiz on Love (${ghazals.length})

Fonte e autoria: poema de Hafez (domínio público); tradução inglesa de Shahriar Shahriari (uso não comercial com crédito; **não autorizada como base de tradução**).
“Dísticos” = número de linhas paralelas persa/inglês na página.

${row(['Nº', 'URL original', 'Primeiro verso (persa)', 'Dísticos', 'Data da tradução inglesa', 'Rota', 'Migração', 'Tradução pt-BR'])}
${row(Array(8).fill('---'))}`)

for (const g of ghazals) {
  const state = poemState('gazal', g.number)
  lines.push(
    row([
      g.number,
      `[p_ghazal-${String(g.number).padStart(3, '0')}](${g.url})`,
      `<span dir="rtl">${g.firstLineFa ?? ''}</span>`,
      g.units,
      g.translationDate ?? '—',
      `\`/diva/gazeis/${g.number}\``,
      state.migration,
      state.translation,
    ]),
  )
}

const compress = (nums) => {
  const out = []
  for (let i = 0; i < nums.length; i++) {
    const start = nums[i]
    while (nums[i + 1] === nums[i] + 1) i++
    out.push(start === nums[i] ? `${start}` : `${start}–${nums[i]}`)
  }
  return out.join(', ')
}

lines.push(`
## Gazéis sem página no Hafiz on Love (${inventory.ghazalNumbersWithoutPage.length})

Serão migrados a partir do texto persa (Ganjoor, edição Qazvini-Ghani) com status \`pending\`:

${compress(inventory.ghazalNumbersWithoutPage)}

## Recursos e links externos

| Recurso | Tipo | Observação |
|---|---|---|
${inventory.assets
  .filter((a) => a.kind !== 'jpg')
  .map(
    (a) =>
      `| ${a.url} | ${a.kind} | ${a.kind === 'pdf' ? 'Compilação do mesmo conteúdo do site' : 'Recurso de interface — não reutilizar'} |`,
  )
  .join('\n')}
| ${inventory.assets.filter((a) => a.kind === 'jpg').length} imagens JPG | jpg | Galeria (35 obras, miniaturas e ampliações) e fotos do Hafezieh na biografia; sem licença declarada |

Links externos (sites do mesmo autor, fora do escopo): ${inventory.externalLinks.join(', ')}

## Limitações

- O inventário cobre apenas páginas alcançáveis por links a partir da home; páginas órfãs não seriam encontradas.
- O conteúdo dos PDFs foi verificado por amostragem (metadados e sumário), não verso a verso.
- A correspondência de numeração com Qazvini-Ghani foi verificada por amostragem (gazéis 1–5); a checagem completa será feita na importação.
`)

writeFileSync(join(ROOT, 'docs', 'content-inventory.md'), lines.join('\n'))
console.log('docs/content-inventory.md gerado.')
