# ADR 0002 — Poemas em YAML validados por Zod próprio (sem Nuxt Content)

**Status:** aceita · 2026-11-07

## Contexto

Os poemas têm regras de domínio fortes (gate de publicação, fontes, alinhamento de estrofes, conjunto
elegível do Fal) que precisam valer igualmente no servidor, em scripts de importação/validação e em testes.
O Nuxt Content v3 usa um banco SQLite próprio e consultas por coleção, e traz muitas dependências.

## Decisão

Poemas e fontes ficam em YAML em `content/`, lidos pelo Nitro como server assets e validados por
`shared/schemas` (Zod 4) via `loadContent()`. A mesma função é usada no `pnpm content:validate`.

## Consequências

- Uma única implementação das regras; acervo legível e versionável (diffs de revisão claros).
- Troca por CMS isolada em `server/utils/content-repository.ts`.
  − Sem editor visual por enquanto (editores trabalham em YAML ou via futuro CMS).
