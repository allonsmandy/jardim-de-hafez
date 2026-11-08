# ADR 0006 — Traduções preliminares feitas por IA, publicadas com aviso

**Status:** aceita · 2026-11-07 · decisão da proprietária

## Contexto

Ainda não há equipe de tradutores. A proprietária pediu que a IA (Claude) traduzisse os poemas
diretamente do persa, com explicações completas, para que o acervo possa ser lido desde já, e que a
comunidade contribua depois com correções.

## Decisão

- Novo nível de publicação `authorization.level: preliminary`, além de `verified`.
- Requisitos do nível preliminar: tradução presente (status `draft`/`review`), mesmo número de
  estrofes do original, texto persa e autorização registrada.
- O tradutor é registrado como "Claude (IA, Anthropic)" com `machineAssisted: true` — nunca como pessoa.
- Aviso visível em todos os lugares onde a tradução aparece (página do poema, cartões, Fal), com link
  para `/como-traduzimos`; a cópia de versos inclui "(preliminar)" no crédito.
- Cada poema traz introdução, explicação por dístico (literal, sentido, escolhas) e glossário.
- O nível `verified` continua exigindo revisão humana e aprovação.

## Consequências

- Ganho: o site tem conteúdo legível imediatamente, com transparência total sobre a origem.
- Risco: erros de interpretação publicados; mitigado pelo aviso e pelo fluxo de correção.
- Pendência: o canal para envio de correções ainda precisa ser definido.
