# Design system

## Conceito

Uma edição literária contemporânea com memória de manuscrito persa: muito espaço, papel cor de
marfim, tinta escura, ornamentos mínimos (um botão de rosa entre fios dourados). Nada de gradientes,
sombras pesadas ou cards por estrofe — o poema é um bloco contínuo.

## Cores (`app/assets/css/main.css`, `@theme`)

| Token       | Hex     | Uso                                        | Contraste sobre marfim |
| ----------- | ------- | ------------------------------------------ | ---------------------- |
| `ivory`     | #F7F1E6 | Fundo                                      | —                      |
| `paper`     | #EFE6D6 | Superfícies, faixas                        | —                      |
| `line`      | #E0D3BD | Bordas e divisores                         | decorativo             |
| `wine`      | #702F3D | Marca, links, botões                       | ≈ 9:1 (AAA)            |
| `wine-deep` | #57232F | Hover                                      | AAA                    |
| `cypress`   | #24483F | Persa em leitura paralela, foco, rótulos   | ≈ 9:1 (AAA)            |
| `gold`      | #B59558 | **Somente** ornamentos                     | não usar em texto      |
| `rose`      | #C99499 | **Somente** detalhes (sublinhado, seleção) | não usar em texto      |
| `ink`       | #282522 | Texto                                      | ≈ 14:1                 |
| `ink-muted` | #5C534A | Texto secundário                           | ≈ 6.8:1 (AA)           |

Modo escuro: não previsto na v1 (decisão de produto pendente).

## Tipografia

| Papel                | Fonte              | Motivo                                                                            |
| -------------------- | ------------------ | --------------------------------------------------------------------------------- |
| Títulos              | Cormorant Garamond | Serifada editorial de alto contraste, elegante em tamanhos grandes                |
| Texto longo e versos | Literata           | Desenhada para leitura longa em tela; ótima cobertura de diacríticos do português |
| Persa                | Noto Naskh Arabic  | Naskh tradicional, legível, suporte completo ao persa (پ چ ژ گ ی ک) e aos harakat |

Fontes auto-hospedadas via Fontsource (sem requisição a terceiros; `unicode-range` faz o navegador
baixar só os subconjuntos usados). Licença SIL OFL.

Persa: `[lang='fa']` aplica Naskh, `line-height: 2.1` (espaço para diacríticos) e sem `letter-spacing`
(que quebraria as ligaduras). Sempre usar `<PersianText>` ou `lang="fa" dir="rtl"`; em texto misto,
`unicode-bidi: isolate` evita que números e pontuação “pulem”.

## Componentes base

- Utilitários: `container-editorial` (6xl), `container-reading` (3xl), `eyebrow`, `btn-primary`,
  `btn-secondary`, `btn-quiet`.
- `PageIntro`, `EmptyState`, `LoadingState`, `OrnamentDivider`, `PersianText`.
- `PoemReader`: modos `paralelo` (persa ao lado, empilha no celular), `portugues`, `persa`; a escolha
  fica salva no navegador.

## Movimento

Transições curtas (`--ease-garden`). A abertura do livro no Fal dura 1,4 s. Com
`prefers-reduced-motion: reduce`, todas as animações são anuladas e o Fal pula a espera.

## Acessibilidade

Link “Pular para o conteúdo”, foco visível (`cypress`), alvos de toque ≥ 40px, landmarks
(`header/nav/main/footer`), `aria-live` em resultados de busca e ações, `aria-pressed` em favoritos,
menu móvel com `aria-expanded` e Esc.

## Ritmo visual (revisão de 2026-11-07)

Para textos longos não cansarem, as páginas alternam **faixas**: marfim (leitura), papel (destaques),
verde-cipreste (guias e curiosidades, texto marfim) e vinho (chamadas, como o Fal). Elementos:

- `PersianArch`: moldura em arco ogival (portais persas) no topo da página inicial e dos poemas.
- `PoemHero`: medalhão em estrela de oito pontas com o número em algarismos persas + temas em pílulas.
- `BeginnerGuide`: "Como ler um poema de Hafez" em quatro cartões (pode ser fechado; lembrado no navegador).
- `PoemStudy` (modo **Estudar**, padrão): um cartão por dístico — versos em faixa de papel, bloco
  rosado "Em palavras simples", "Por trás das palavras" e um recolhível "Para quem quer se aprofundar".
- Modo **Só ler**: o poema inteiro numa folha contínua, sem notas.

## Glossário em todo o site

Qualquer texto passado por `<GlossaryText>` tem os termos do glossário (campo `aliases`) sublinhados
em pontilhado dourado; ao tocar, abre o modal global `GlossaryDialog` (`<dialog>` nativo: foco
preso, Esc fecha, clique fora fecha) com a explicação curta (`short`) e "Saber mais" (`definition`).
Cada termo é marcado só na primeira ocorrência de cada bloco de texto.
