# Arquitetura

## Stack

Nuxt 4 · Vue 3 (Composition API) · TypeScript strict · Tailwind CSS 4 · Zod 4 · Vitest · ESLint (@nuxt/eslint) + Prettier · Lucide · @nuxtjs/sitemap · fontes auto-hospedadas (Fontsource).

## Estrutura

```text
app/                    Interface (Nuxt srcDir)
  assets/css/main.css   Tokens do design system (@theme do Tailwind 4)
  components/
    common/             PersianText, EmptyState, LoadingState, OrnamentDivider, PageIntro…
    layout/             AppHeader, AppFooter, MainNavigation, MobileNavigation
    poetry/             PoemReader, PoemCard, PoemFilters, PoemPagination, PoemNavigation,
                        PoemLanguageToggle, PoemCredits, PoemActions, FavoriteButton
    oracle/             OracleIntro, OracleReveal, OracleResult
  composables/          usePoemIndex, useFavorites, useReadingPreferences, useLocalState
  layouts/ pages/ utils/
server/                 Nitro: repositório de conteúdo + API JSON
  utils/content-repository.ts
  api/poems.json.get.ts, api/poems/[category]/[number].get.ts, api/sources.json.get.ts
shared/                 Código compartilhado entre app, server, scripts e testes
  schemas/              Zod: Poem, Source
  utils/                publicação, busca/filtro/paginação, sorteio, texto, categorias, loader
content/                Acervo editorial (YAML), independente da interface
  sources.yml
  poetry/<categoria>/<categoria>-NNN.yml
scripts/
  inventory/            Crawler e relatório do Hafiz on Love
  import/               Importação do texto persa (Ganjoor)
  validate/             Validação do acervo + painel editorial
data/inventory/         Saída do crawler (somente metadados)
tests/unit/             Testes de domínio (Vitest)
docs/                   Documentação e ADRs
```

## Fluxo de dados

```text
content/*.yml ──(server assets)──▶ server/utils/content-repository.ts
                                    │  loadContent(): YAML → Zod → regras de acervo
                                    │  isPublishable(): filtro de publicação
                                    ▼
                    /api/poems.json (índice resumido, prerenderizado)
                    /api/poems/:categoria/:numero (poema completo + vizinhos + fontes)
                                    ▼
              páginas Vue (SSR/prerender) ─ busca, filtros, paginação e sorteio no cliente
```

- **As mesmas funções** (`shared/utils/content.ts`, `publication.ts`) rodam no servidor, no script
  `content:validate` e nos testes. Não há segunda implementação das regras.
- O servidor **recusa iniciar** com acervo inválido (erro explícito), e o `pnpm check` falha antes disso.
- Busca/filtro/paginação acontecem no cliente sobre o índice estático — rápido, funciona em hospedagem
  estática e mantém o estado na URL (`?q=&categoria=&pagina=`).
- O **sorteio do Fal** ocorre no navegador (se fosse no servidor, a pré-renderização congelaria o resultado).

## Renderização e deploy

`pnpm generate` produz um site estático completo (`.output/public`), com rastreamento de links:
cada poema publicado vira HTML + JSON. `pnpm build` gera a versão híbrida (Node/serverless) caso
um CMS ou API dinâmica seja adicionado. Poemas não publicados não têm rota, não entram no sitemap e
respondem 404.

## Evolução prevista

- **CMS:** substituir a leitura de YAML em `content-repository.ts` mantendo a interface
  (`getContent`, `getVisiblePoems`). Schemas e regras continuam em `shared/`.
- **i18n:** textos de interface estão em português; ao adicionar outro idioma, extrair para
  `@nuxtjs/i18n` e prefixar rotas. O modelo de tradução já registra `language: pt-BR`.
- **Prosa editorial** (biografia, cultura): Markdown em `content/editorial/` — ver ADR 0003.

Decisões detalhadas em `docs/decisions/`.
