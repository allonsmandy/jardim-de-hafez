# ADR 0004 — Sorteio do Fal-e Hafez

**Status:** aceita · 2026-11-07

## Decisão

- Conjunto elegível: gazéis **publicados** (mesmo filtro da biblioteca).
- Índice uniforme com `crypto.getRandomValues` + amostragem por rejeição (`shared/utils/oracle.ts`),
  fonte de aleatoriedade injetável para testes; teste estatístico (qui-quadrado) incluso.
- Evita repetir o último poema na mesma sessão quando há alternativa (não altera a uniformidade entre os demais).
- Sorteio no cliente, pois o site é pré-renderizado.
- Sem IA, sem mensagens atribuídas a Hafez, sem linguagem de previsão.
