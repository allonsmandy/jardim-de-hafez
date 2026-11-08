# ADR 0001 — Nuxt 4 com geração estática e API JSON pré-renderizada

**Status:** aceita · 2026-11-07

## Contexto

O conteúdo muda por publicação editorial, não por usuário. Não há login nem dados por usuário no servidor.

## Decisão

Usar Nuxt 4 com `nuxt generate`: páginas e endpoints `/api/*.json` são pré-renderizados. Busca,
filtros, paginação e o sorteio do Fal rodam no cliente sobre o índice estático.

## Consequências

- Hospedagem barata (qualquer CDN), rápida e indexável.
- Mesma base funciona em modo híbrido (`nuxt build`) se surgir CMS/API dinâmica.
  − Busca textual carrega o índice inteiro (estimado em < 1 MB para 495 poemas); se crescer, gerar índice dedicado.
