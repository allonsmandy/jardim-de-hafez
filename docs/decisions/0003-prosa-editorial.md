# ADR 0003 — Prosa editorial (biografia, cultura) em Markdown

**Status:** proposta · 2026-11-07

## Contexto

Biografia, ensaios culturais e textos de arte são prosa longa, com notas e fontes, escrita por pessoas não técnicas.

## Decisão proposta

Na Fase 05, avaliar `@nuxt/content` apenas para Markdown em `content/editorial/` (com frontmatter
validado: autor, revisão, fontes). Se o custo de dependências for alto, usar um renderizador
Markdown leve com sanitização. Em ambos os casos, o texto fica fora dos componentes.

## Consequências

Decidir antes de escrever a biografia; até lá as páginas exibem “em preparação”, sem texto provisório.
