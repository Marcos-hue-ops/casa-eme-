# Guia de estilo — Casa EME | Moema

Direção de arte do site. O *porquê* de cada escolha, para que futuras páginas,
posts ou peças continuem parecendo da mesma casa.

## Ponto de partida

Três materiais da própria Casa EME definiram tudo:

1. **A logo** do perfil do Instagram — disco creme, dois anéis finos marrons e
   CASA EME em serifa clássica, em versal espaçada.
2. **O manifesto "Por que Casa EME?"** — EME é o nome da letra M, e cada M é
   uma razão: Mulher, Movimento, Mudança, Momento, Mãos, Mente, Melhor, e "acima
   de tudo, M de mim. Uma casa para cuidar de mim." Diagramado em serifa
   itálica, dentro de uma moldura de fio duplo.
3. **A arte das assinaturas** — faixas caramelo, mel e pêssego.

## Conceito

**"Uma casa para cuidar de mim."** O site é uma casa — íntima, acolhedora,
organizada — e não uma vitrine de salão. A frase é da própria Casa EME.

Mood: **acolhedor · editorial · íntimo · preciso · caloroso.**

## Concorrência (Moema)

Os sites do segmento no bairro (salões e clínicas de estética) repetem a mesma
fórmula: template, banner de banco de imagem, "tecnologia de última geração",
preto e dourado ou rosa e dourado. A Casa EME se diferencia pelo oposto:
tipografia editorial, fotos reais, linguagem responsável e as cores da própria
marca.

## Paleta

Medida nos pixels da logo e da arte de assinaturas. Tokens em
`src/assets/css/base/tokens.css`.

| Token | Hex | Uso |
|---|---|---|
| `--papel` | `#FBF7F1` | fundo das páginas |
| `--creme` | `#F3E6D6` | o disco da logo; faixas alternadas |
| `--marca` | `#74501C` | o marrom dos anéis e do nome; botões, títulos em itálico |
| `--cafe` | `#2A1E14` | texto; faixa escura (estética) e rodapé |
| `--mel` | `#AF8B2B` | fios e detalhes (nunca texto sobre claro) |
| `--mel-claro` | `#DCBB73` | dourado para texto sobre o café |
| `--caramelo` | `#996744` | decorativo, só em tamanhos grandes |
| `--pessego-claro` | `#F8E6CF` | fundo da seção de assinaturas |
| `--texto-2` | `#5C5244` | texto secundário |
| `--rosa-*` | `#F7E9E8` / `#C07B85` / `#8A3D4B` | **só** na seção Outubro Rosa |

Todas as combinações de texto passam no contraste WCAG AA (o `npm run qa`
mede).

## Tipografia

- **Baskervville** (títulos) — entre as fontes livres comparadas lado a lado
  com a logo, a mais próxima do letreiro CASA EME; o itálico conversa com o do
  manifesto. Peso 500 nos títulos, 600 no nome.
- **Hanken Grotesk** (texto e interface) — faz o papel das versais finas do
  slogan "BELEZA | ESTÉTICA AVANÇADA | SAÚDE CAPILAR".

Gestos tipográficos recorrentes:

- título com a segunda metade em **itálico marrom** ("Cabelo, mãos e pés: *o
  cuidado de todo dia*");
- **rótulo** de seção em versal espaçada com um fio curto dourado antes;
- o **nome** sempre em versal espaçada, como na logo.

## Elementos gráficos

- **Anel duplo** (da logo): moldura das fotos redondas da primeira dobra, do
  "M" do manifesto, dos números da saúde capilar, do mapa, das aberturas.
- **Moldura de fio duplo** (dos posts): foto de antes e depois, cardápio das
  assinaturas.
- **Fio curto** sob o slogan (da logo): no hero e no cartão das assinaturas.
- Nada de gradiente, sombra pesada, ícone decorativo ou card em grade.

## Fotografia

Só fotos reais da casa. Luz natural e quente, tons de mel e caramelo,
enquadramento próximo (mãos, fios, texturas). Fotos de antes e depois
mantêm os rótulos originais. Banco de imagem e imagem gerada por IA não
entram — inclusive a foto de unhas que o Instagram marcou como "Conteúdo de IA".

## Layout

- Composição **assimétrica** em duas colunas (5/7) no desktop; uma coluna no
  celular, que é o uso principal.
- Listas tipográficas com fio entre itens (como um índice de revista) em vez
  de cards.
- Ritmo de faixas: papel → creme → pêssego → café → creme → papel → linho →
  rosa (outubro).
- Respiro generoso entre seções (`--secao`), sem deixar a página vazia.

## Movimento

Discreto e com propósito:

- os anéis da primeira dobra se desenham ao carregar;
- no desktop, o "M" do manifesto fica parado e a palavra ao lado acompanha a
  rolagem (Mulher → Movimento → … → mim);
- o fio que liga as três etapas da saúde capilar se desenha ao entrar na tela;
- hover com fio que cresce e seta que avança.

Com `prefers-reduced-motion`, nada se move e todo o conteúdo aparece.

## Voz

Segura, calorosa, precisa. Frases curtas. Nada de "eleve sua beleza",
"transforme sua autoestima", "experiência única". Em estética e saúde capilar:
avaliação individual, protocolo para cada pessoa, nunca promessa de resultado,
sempre o lembrete de que não substitui acompanhamento médico.
