# Visão geral do projeto

**Jardim de Hafez** (باغ حافظ) é uma plataforma brasileira dedicada à poesia de Hafez de Shiraz.
O público são leitores de língua portuguesa — inclusive quem nunca teve contato com literatura persa,
sufismo ou a tradição do Fal-e Hafez.

## O que o site oferece

| Seção                                                                                                  | Rota                         | Estado                                                          |
| ------------------------------------------------------------------------------------------------------ | ---------------------------- | --------------------------------------------------------------- |
| Início                                                                                                 | `/`                          | Implementada                                                    |
| O Divã (biblioteca, busca, filtros, paginação)                                                         | `/diva`                      | Implementada; acervo publicado vazio até a 1ª tradução aprovada |
| Página do poema (persa, português, leitura paralela, créditos, notas, favoritos, copiar, compartilhar) | `/diva/<categoria>/<numero>` | Implementada                                                    |
| Fal-e Hafez (sorteio entre poemas publicados)                                                          | `/fal-e-hafez`               | Implementada; aguarda poemas publicados                         |
| O Poeta                                                                                                | `/o-poeta`                   | Estrutura; texto em preparação (Fase 05)                        |
| Arte Persa                                                                                             | `/arte-persa`                | Estrutura; galeria em preparação (Fase 05)                      |
| Sobre                                                                                                  | `/sobre`                     | Implementada                                                    |
| Créditos e fontes                                                                                      | `/creditos`                  | Implementada (gerada a partir de `content/sources.yml`)         |

## Princípios

1. **A poesia é o centro.** Nada de frases motivacionais, misticismo artificial ou “previsões”.
2. **Rigor editorial.** Nenhum poema é publicado sem tradução aprovada por revisão humana e autorização registrada (ver `content-model.md`).
3. **Fontes verificáveis.** Toda referência aponta para uma fonte registrada, com situação de direitos.
4. **Respeito a direitos autorais.** O Hafiz on Love é inspiração e objeto de inventário, não fonte de textos (ver `copyright-and-sources.md`).
5. **Acessibilidade e legibilidade** acima de efeitos visuais.

## Como rodar

```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm check               # lint + formatação + tipos + testes + validação do acervo
pnpm generate            # site estático em .output/public
```

Para ver rascunhos localmente (nunca em produção):

```bash
NUXT_EDITORIAL_PREVIEW=true NUXT_PUBLIC_EDITORIAL_PREVIEW=true pnpm dev
```

Ferramentas de acervo:

```bash
pnpm inventory:crawl          # re-inventaria o Hafiz on Love (metadados)
pnpm inventory:report         # regenera docs/content-inventory.md
pnpm import:ganjoor --from 6 --to 50   # importa texto persa como "pending"
pnpm content:validate         # valida content/ e mostra o painel editorial
```
