# Direitos autorais e fontes

> Este documento registra a análise técnica-editorial feita para o projeto. **Não é parecer jurídico.**
> Decisões que dependam de interpretação legal devem ser confirmadas por profissional habilitado.

## Hafiz on Love (hafizonlove.com)

- Aviso: “© 1999–2025 Shahriar Shahriari… You may use any part presented herein for non-commercial
  purposes only, on the condition of giving full credit to the author and to this home page”.
- Isso **não** equivale a uma licença para traduzir, adaptar ou redistribuir as traduções inglesas,
  e impede qualquer uso comercial (inclusive anúncios, assinaturas ou venda de produtos).
- O Jardim de Hafez **não** copia código, identidade visual, ilustrações, traduções nem textos
  editoriais do site. Usa-o apenas para: inventário de estrutura, numeração e categorias; comparação
  de cobertura; link de atribuição na página Sobre.
- **Se a proprietária quiser usar as traduções de Shahriari** (ex.: como apoio ou para oferecer o
  inglês em paralelo), é necessária autorização por escrito do autor, registrada em `sources.yml`.

## Texto persa

O texto de Hafez (século XIV) está em domínio público. Adotamos a numeração e o estabelecimento do
texto de Qazvini-Ghani (1941), sem reproduzir prefácio, aparato ou notas dos editores. A transcrição digital vem do Ganjoor. Verificado em 2026-11-07: a página “Sobre” do Ganjoor declara
que o projeto não é comercial, que suas fontes são majoritariamente livres e que o acervo é publicado
como banco de dados livre para que outros façam trabalhos semelhantes. Importamos só o texto dos
versos, com crédito e link — nunca os comentários e resumos do site.

## Traduções

| Fonte                                               | Situação                                                   | Uso permitido                                   |
| --------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------- |
| Traduções originais do projeto                      | Direitos do(a) tradutor(a) — exige termo de cessão/licença | Publicação após aprovação                       |
| H. Wilberforce Clarke (1891)                        | Domínio público                                            | Consulta, notas, tradução indireta identificada |
| Gertrude Bell (1897)                                | Domínio público                                            | Consulta, notas, tradução indireta identificada |
| Shahriari, Paul Smith, E. T. Gray, Aryanpur Kashani | Protegidas                                                 | Somente referência bibliográfica                |

Recomenda-se um termo simples de cessão de direitos (ou licença, ex.: CC BY-NC-SA) assinado por cada
tradutor(a) e revisor(a), registrado no campo `authorization.basis`.

## Imagens

Nenhuma imagem do Hafiz on Love será usada (não há autoria, acervo nem licença). Candidatas para a
galeria: coleções de domínio público/abertas de museus e bibliotecas (ex.: Met Open Access, Walters
Art Museum, Wikimedia Commons com licença verificada), sempre com título, data, acervo e licença.

## Regras aplicadas pelo sistema

1. Toda referência deve existir em `content/sources.yml`, com situação de direitos.
2. Fontes com `usableForPublication: false` não podem fundamentar texto publicado (validador).
3. Nada é publicado sem status `approved` + autorização registrada.
4. Adaptações livres são rotuladas na página como “Adaptação livre — não é uma tradução literal”.
5. O crawler guarda apenas metadados; o HTML bruto fica em `.cache/` (fora do git).

## Galeria Arte Persa (`content/art.yml`)

- Hoje todas as obras vêm do **Metropolitan Museum of Art — Open Access** (imagens de obras em
  domínio público, liberadas sob CC0). Fonte registrada como `met-open-access` em `content/sources.yml`.
- Dados conferidos na API oficial do museu (`collectionapi.metmuseum.org`) em 2026-11-08:
  `isPublicDomain: true`, título original, data, lugar, técnica, número de inventário e linha de crédito.
- As imagens são carregadas diretamente do servidor do museu (`images.metmuseum.org`); cada obra tem
  link para a ficha oficial e para a imagem em alta resolução.
- Títulos em português, descrições e "por que está aqui" são textos do projeto.
- Cuidado ao buscar: "Hafiz-i Abru" é um historiador do século XV, não o poeta — obras dele não entram.
- Obra nova só entra com: acervo, número de inventário, data, licença aberta verificada e link oficial.
  O schema (`shared/schemas/artwork.ts`) e a API (`server/api/art.json.get.ts`) recusam o resto.
