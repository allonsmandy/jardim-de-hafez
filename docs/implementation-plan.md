# Plano de implementação

Legenda: ✅ concluído e verificado · 🟡 parcial · ⬜ não iniciado

## Fase 00 — Descoberta ✅

- ✅ Auditoria do Hafiz on Love com crawler reproduzível (`pnpm inventory:crawl`): 150 páginas, 0 falhas.
- ✅ Inventário (`docs/content-inventory.md`), análise de licenças (`copyright-and-sources.md`).
- ✅ Arquitetura (`architecture.md`) e ADRs.

## Fase 01 — Fundação ✅

- ✅ Nuxt 4.6, TypeScript strict, Tailwind 4, ESLint, Prettier, Vitest.
- ✅ Schemas Zod de poema e fonte; regras de consistência e de publicação.
- ✅ Repositório de conteúdo + API JSON; validação do acervo (`pnpm content:validate`).
- ✅ Importador do texto persa (Ganjoor) — gazéis 1–5 importados como `pending`.
- ✅ 50 testes unitários (schema, publicação, busca, filtros, paginação, vizinhos, sorteio, texto, acervo).
- ✅ `pnpm generate` gera o site estático + sitemap.

## Fase 02 — Design system 🟡

- ✅ Tokens, tipografia, layout, cabeçalho/rodapé, navegação desktop e móvel, componentes base.
- ⬜ Revisão visual com a proprietária; ornamentos/ilustrações próprias; imagem Open Graph.

## Fase 03 — Biblioteca 🟡

- ✅ Listagem, busca (número e texto, pt/fa), filtros, paginação com estado na URL.
- ✅ Página do poema: leitura paralela/pt/fa, créditos, notas, vizinhos, favoritar, copiar, compartilhar.
- ⬜ Página “Meus favoritos”; índice por categoria com rota própria; leitura com conteúdo real.

## Fase 04 — Fal-e Hafez 🟡

- ✅ Introdução, sorteio uniforme (crypto + rejeição), animação de abertura com movimento reduzido, resultado, nova consulta, compartilhar/favoritar.
- ⬜ Validar a experiência com poemas reais publicados.

## Fase 05 — Conteúdo editorial ⬜

- ✅ Página O Poeta: biografia com selos de confiabilidade (fato / hipótese / tradição), régua
  comparativa, anatomia do gazel, duas leituras, lendas com veredito, legado e fontes.
- Aprofundar: gazel, simbolismo,
  sufismo, Shiraz, legado; galeria de arte com metadados e licenças. Ver ADR 0003 (Markdown).

## Fase 06 — Migração e tradução 🟡

- ✅ Gazéis 1–15: tradução preliminar por IA com introdução, explicação por dístico e glossário (ADR 0006).
- ✅ Páginas `/como-traduzimos` e `/glossario`.
- ⬜ Canal para envio de correções.

- Importar os 495 gazéis (texto persa) em lotes; verificar termos do Ganjoor ou conferir com edição impressa.
- Importar rubaiyat, Saqi-Nameh, Ahu-ye Vahshi e diversos (exige estender o importador).
- Primeiro lote de traduções + revisão + autorização.

## Fase 07 — Finalização ⬜

- Auditoria de acessibilidade (axe + leitor de tela), Lighthouse, testes de componentes/e2e,
  domínio e deploy, CI com `pnpm check`.

## Riscos

| Risco                           | Impacto                      | Mitigação                                                |
| ------------------------------- | ---------------------------- | -------------------------------------------------------- |
| Não há traduções aprovadas      | Site sem poemas publicados   | Decidir estratégia de lançamento (ver perguntas abertas) |
| Termos do Ganjoor               | Bloqueia publicação do persa | Verificar termos ou conferir com edição impressa         |
| Volume de tradução (495 gazéis) | Prazo                        | Lotes, priorizar gazéis mais conhecidos                  |
| Biografia com dados lendários   | Credibilidade                | Fontes acadêmicas por afirmação                          |
| Imagens sem licença             | Jurídico                     | Só acervos com licença verificada                        |

## Perguntas abertas para a proprietária

1. ~~Lançamento~~ — decidido: traduções preliminares por IA com aviso (ADR 0006).
2. **Revisores e correções:** quem revisa as traduções preliminares, sob qual termo de direitos, e qual será o canal para receber correções?
3. **Shahriari:** pedir autorização ao autor do Hafiz on Love para usar as traduções inglesas como apoio ou em paralelo?
4. **Domínio** definitivo (canônicas, Open Graph, sitemap) e **hospedagem**.
5. **Escopo do Fal:** só gazéis (tradição) ou também rubaiyat?
