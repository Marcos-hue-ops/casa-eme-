# Casa EME | Moema — site

Site da **Casa EME**, casa de beleza, estética avançada e saúde capilar na
Rua Pintassilgo, 457 — Vila Uberabinha, Moema, São Paulo.

Site estático, rápido e sem coleta de dados: o WhatsApp é o canal de
agendamento, e cada botão abre a conversa com uma mensagem já escrita para o
assunto da página.

| | |
|---|---|
| Gerador | [Eleventy 3](https://www.11ty.dev/) (Nunjucks) |
| CSS | arquivos nativos, empacotados e minificados pelo Lightning CSS |
| JavaScript | módulos ES pequenos, empacotados pelo esbuild (~8 KB) |
| Imagens | WebP gerado com `sharp` a partir de `fotos/` |
| Hospedagem | Vercel (configurada) · Netlify/Cloudflare Pages · Apache/Nginx (exemplos em `deploy/`) |
| Node | 20 ou mais novo (`.nvmrc` pede 22) |

---

## Sumário

1. [Rodar e gerar o site](#1-rodar-e-gerar-o-site)
2. [Estrutura do projeto](#2-estrutura-do-projeto)
3. [Onde mudar cada coisa](#3-onde-mudar-cada-coisa)
4. [Fotos e imagens](#4-fotos-e-imagens)
5. [SEO](#5-seo)
6. [Publicar na Vercel](#6-publicar-na-vercel)
7. [Conectar o domínio](#7-conectar-o-domínio)
8. [Google Search Console e Perfil da Empresa](#8-google-search-console-e-perfil-da-empresa)
9. [Analytics](#9-analytics)
10. [Segurança e privacidade](#10-segurança-e-privacidade)
11. [Qualidade: testes e auditoria](#11-qualidade-testes-e-auditoria)
12. [Pendências e decisões](#12-pendências-e-decisões)
13. [Antes de publicar — checklist](#13-antes-de-publicar--checklist)

---

## 1. Rodar e gerar o site

```bash
npm install          # uma vez
npm run dev          # desenvolvimento em http://localhost:8080 (recarrega sozinho)
npm run build        # gera o site final em dist/
npm run serve        # serve o dist/ em http://localhost:4321 para conferir
```

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run images` | gera os WebP a partir de `fotos/` (ver seção 4) |
| `npm run og` | redesenha o cartão de compartilhamento (`src/assets/img/og-casa-eme.jpg`) |
| `npm run icons` | regera favicon e ícones PNG a partir dos SVG da marca |
| `npm run test` | testes de conteúdo, SEO e segurança sobre o `dist/` |
| `npm run qa` | auditoria no navegador em 8 larguras (320 → 1920px) |
| `npm run shots` | capturas de tela de todas as páginas em `.shots/` |

`test`, `qa`, `shots` e `og` rodam sobre o `dist/` — rode `npm run build` antes.
`qa`, `shots` e `og` usam o Chromium em `/opt/pw-browsers/chromium`; em outra
máquina, aponte a variável `CHROMIUM` para o executável do Chrome/Chromium.

> Em `npm run dev` a Content-Security-Policy não é aplicada (os hashes dos
> scripts só existem no build final). Para conferir o site como ele vai ao ar,
> use `npm run build && npm run serve`.

---

## 2. Estrutura do projeto

```
.
├── fotos/                     originais das fotos (não vão para o site direto)
│   ├── galeria/               fotos de trabalhos → viram WebP
│   ├── referencias/           prints usados como referência (logo, manifesto, assinaturas)
│   └── nao-publicar/          o que NÃO pode ir ao site (ver LEIAME.md)
├── src/
│   ├── _data/                 ★ TODO O CONTEÚDO EDITÁVEL MORA AQUI
│   ├── _includes/
│   │   ├── layouts/           base.njk (<head>, SEO, CSP) e pagina.njk (páginas internas)
│   │   ├── components/        cabeçalho, rodapé, trilha, ampliação de foto, macros
│   │   └── sections/          seções da home (hero, manifesto, serviços, assinaturas...)
│   ├── assets/
│   │   ├── css/               tokens (cores, fontes, espaços) → base → componentes → seções
│   │   ├── js/                main.js + módulos (menu, horários, galeria, mapa...)
│   │   ├── fonts/             Baskervville e Hanken Grotesk (servidas do próprio site)
│   │   └── img/               imagens prontas (geradas por `npm run images`)
│   ├── static/                favicon, ícones e manifest (copiados para a raiz)
│   ├── index.njk              home
│   ├── sobre.njk  servicos.njk  estetica-avancada.njk  saude-capilar.njk
│   ├── galeria.njk  perguntas-frequentes.njk  contato.njk  privacidade.njk  404.njk
│   ├── sitemap.njk            → /sitemap.xml (automático)
│   └── robots.njk             → /robots.txt (automático)
├── tools/                     scripts de build, imagens, ícones, testes e auditoria
├── deploy/                    exemplos de configuração para Apache e Nginx
├── docs/guia-de-estilo.md     direção de arte: paleta, tipografia, tom, princípios
├── vercel.json                build e cabeçalhos de segurança na Vercel
└── netlify.toml               alternativa: Netlify / Cloudflare Pages
```

Páginas e endereços:

| Página | URL |
|---|---|
| Início | `/` |
| Sobre | `/sobre/` |
| Serviços (todas as categorias + assinaturas) | `/servicos/` |
| Estética avançada | `/estetica-avancada/` |
| Saúde capilar | `/saude-capilar/` |
| Galeria | `/galeria/` |
| Perguntas frequentes | `/perguntas-frequentes/` |
| Contato | `/contato/` |
| Privacidade (fora do Google) | `/privacidade/` |

---

## 3. Onde mudar cada coisa

Quase tudo é texto em `src/_data/`. Cada arquivo tem, no topo, um comentário
explicando os campos. Mude, rode `npm run build`, confira e publique.

| Quero mudar… | Arquivo | Observação |
|---|---|---|
| **Número do WhatsApp** | `src/_data/business.js` → `numero`, `display`, `tel` | `numero` só dígitos: `55` + DDD + número |
| **Mensagens pré-escritas do WhatsApp** | `src/_data/business.js` → `whatsapp.messages` | uma por contexto (beleza, estética, capilar...) |
| **Instagram** | `src/_data/business.js` → `instagram` | |
| **Endereço / CEP** | `src/_data/business.js` → `address` e `enderecoMaps` | o mesmo dado alimenta rodapé, contato, mapa e schema |
| **Horários** | `src/_data/hours.js` | mude a `semana` **e** os `grupos`/resumos logo abaixo (ver pendência sobre a bio do Instagram) |
| **Serviços** (incluir, tirar, renomear) | `src/_data/servicos.js` | alimenta home, serviços, estética, capilar, FAQ e schema |
| **Assinaturas** (planos, valores, condições) | `src/_data/assinaturas.js` | `mostrarPrecos: false` esconde os valores |
| **Perguntas frequentes** | `src/_data/faq.js` | o campo `em` diz em que outras páginas a pergunta aparece |
| **Manifesto "Por que Casa EME?"** | `src/_data/manifesto.js` | texto da própria casa |
| **Depoimentos** | `src/_data/depoimentos.js` | só avaliações reais, transcritas sem mudar o sentido |
| **Diferenciais (página Sobre)** | `src/_data/diferenciais.js` | |
| **Outubro Rosa** (texto, link, ligar/desligar) | `src/_data/outubroRosa.js` | `ativo: false` tira a seção |
| **Menu** | `src/_data/nav.js` | |
| **Fotos da galeria e da primeira dobra** | `src/_data/galeria.js` | ver seção 4 |
| **Título e descrição de uma página (SEO)** | front matter no topo de cada `src/*.njk` (`title`, `description`) | |
| **Título/descrição padrão, domínio, cartão social** | `src/_data/site.js` | |
| **Textos de uma seção da home** | `src/_includes/sections/*.njk` | |
| **Cores, fontes, espaçamentos** | `src/assets/css/base/tokens.css` | todas as cores moram aqui |

---

## 4. Fotos e imagens

### Adicionar uma foto

1. Salve o **original** em `fotos/galeria/` com um nome descritivo, sem
   espaços nem acentos — por exemplo `fotos/galeria/ambiente-recepcao.jpg`.
   (Para fotos grandes do espaço, `fotos/ambiente/` gera larguras maiores.)
2. Rode `npm run images`. O script gera os WebP em `src/assets/img/` e
   imprime uma linha `imagem: { ... }` para cada foto.
3. Em `src/_data/galeria.js`, crie um item novo em `fotos`, cole a linha
   `imagem:` e preencha:
   - `categoria`: `ambiente`, `cabelo`, `unhas`, `estetica`, `saude-capilar` ou `bem-estar`;
   - `alt`: descrição do que a foto **mostra**, para quem não enxerga;
   - `legenda`: o nome curto que aparece embaixo.
4. `npm run build`.

O filtro da galeria cria os botões sozinho, só para as categorias que têm
foto. Fotos com categoria `ambiente` também aparecem na página **Sobre**.

**Use os arquivos originais da câmera/celular**, não prints. As fotos atuais
vieram de prints do Instagram (720 px de largura) e por isso aparecem em
tamanho moderado. O script nunca amplia uma imagem — avisa quando o original é
pequeno demais.

### Trocar as "janelas" redondas da primeira dobra

São recortes quadrados das fotos de cabelo e unhas, declarados em
`tools/images.js` (`DERIVADOS`) e referenciados em `galeria.js → janelas`.
Quando houver uma boa foto do espaço (fachada, recepção, sala), ela pode
virar a janela principal: declare o recorte em `DERIVADOS`, rode
`npm run images` e troque a linha `imagem:` em `janelas.principal`. Depois
rode `npm run og` para atualizar o cartão social.

### Logo

O selo (`src/assets/img/marca/selo-casa-eme.svg`), o favicon com o "M" e os
ícones foram **redesenhados em vetor** a partir da logo do perfil do Instagram,
com a fonte Baskervville. Se a Casa EME tiver o arquivo vetorial original da
logo (`.svg`, `.ai`, `.pdf`), ele deve substituir o selo — e então rode
`npm run icons` e `npm run og`. Para regerar o selo atual:
`python3 tools/marca/gerar-selo.py` (precisa de `pip install fonttools brotli`).

---

## 5. SEO

- **Título e descrição** de cada página: front matter (`title`, `description`)
  no topo do arquivo da página em `src/`. Mantenha os títulos com até ~60
  caracteres e as descrições entre ~120 e 160. O `npm run test` reprova títulos
  e descrições repetidos ou fora do tamanho.
- **Canonical, Open Graph e Twitter Card** saem sozinhos em todas as páginas
  (`src/_includes/layouts/base.njk`), a partir de `site.url` + o endereço da
  página.
- **Dados estruturados** (`src/_data/schema.js`): `BeautySalon` com endereço,
  telefone, horários, Instagram e catálogo de serviços; `WebSite`;
  `BreadcrumbList` nas páginas internas; `Service` nas páginas de estética e
  saúde capilar; `FAQPage` só na página de perguntas frequentes. Ficam de fora,
  de propósito, nota média, número de avaliações, preços e coordenadas — nada
  disso foi informado ou aferido. (O Google hoje só mostra o resultado
  enriquecido de FAQ para sites de governo e saúde; a marcação continua
  válida e ajuda a entender a página.)
- **Sitemap** (`/sitemap.xml`) é gerado a cada build com todas as páginas
  públicas — não precisa editar. Página nova entra sozinha; para deixar uma
  página de fora, coloque `robots: noindex` no front matter dela.
- **robots.txt** é gerado a partir do interruptor `publicavel` em
  `src/_data/site.js` (ver seção 7).

---

## 6. Publicar na Vercel

1. Suba este repositório para o GitHub (já está).
2. Em [vercel.com](https://vercel.com) → **Add New… → Project** → importe o
   repositório `casa-eme-`.
3. A Vercel lê o `vercel.json`: comando `npm run build`, pasta `dist`. Não é
   preciso mudar nada na tela de configuração. Em **Node.js Version**, escolha
   22.x (ou 20.x).
4. **Deploy**. Cada push na branch principal publica de novo; cada branch ou
   pull request ganha um endereço de prévia.

O `vercel.json` já envia os cabeçalhos de segurança (HSTS, nosniff,
X-Frame-Options, Referrer-Policy, Permissions-Policy) e o cache certo para
cada tipo de arquivo. A CSP vai na própria página (`<meta>`), com os hashes
calculados no build.

**Netlify / Cloudflare Pages:** use o `netlify.toml` (mesmo comando, pasta
`dist`); os cabeçalhos saem do `dist/_headers`, gerado no build.
**Servidor próprio:** veja `deploy/nginx.conf` e `deploy/apache.htaccess`.

---

## 7. Conectar o domínio

1. Na Vercel: **Project → Settings → Domains → Add** e digite o domínio
   (ex.: `www.casaememoema.com.br`). Adicione também a versão sem `www` e
   marque o redirecionamento para a principal.
2. No registro do domínio (Registro.br, por exemplo), crie os registros DNS
   que a Vercel mostrar — normalmente um `CNAME` de `www` para
   `cname.vercel-dns.com` e um `A` do domínio raiz para o IP indicado. O HTTPS
   é emitido sozinho.
3. Em `src/_data/site.js`:
   - troque `url` pelo domínio definitivo (com `https://`, sem barra no fim);
   - mude `publicavel` para `true`.
4. Rode `npm run build && npm run test`, faça o commit e o push.

> **Por que `publicavel` começa em `false`:** enquanto o domínio não estiver
> definido, todas as páginas saem com `noindex` e o `robots.txt` bloqueia o
> rastreamento. Assim o Google não indexa um endereço provisório (como o da
> prévia da Vercel), o que deixaria rastro difícil de limpar.

---

## 8. Google Search Console e Perfil da Empresa

**Search Console** (depois que o domínio estiver no ar e `publicavel: true`):

1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
   → **Adicionar propriedade**.
2. Prefira **Domínio** e a verificação por **registro TXT no DNS** — não
   depende do HTML e vale para `www` e sem `www`.
3. Se preferir **Prefixo do URL** com **meta tag**: copie só o valor do
   `content` que o Search Console mostrar e cole em `src/_data/site.js` →
   `googleSiteVerification`. A meta tag passa a sair em todas as páginas.
   Publique e clique em **Verificar**.
4. Em **Sitemaps**, envie `sitemap.xml`.
5. Em **Inspeção de URL**, peça a indexação da home.

**Perfil da Empresa no Google** (Google Maps): é o que mais pesa em buscas
como "salão de beleza em Moema". Garanta que nome, endereço, telefone e
horários sejam **idênticos** aos do site, coloque o site no campo "Site", a
categoria principal (ex.: "Salão de beleza") e as secundárias que fizerem
sentido, e publique fotos reais do espaço.

---

## 9. Analytics

Não há nenhuma ferramenta de análise instalada, de propósito: o site não
coleta dados de quem visita, e a página de privacidade diz isso.

Se a Casa EME decidir medir audiência:

- prefira uma ferramenta sem cookies (ex.: Vercel Web Analytics, Plausible);
- inclua o script em `src/_includes/layouts/base.njk` (há um comentário
  marcando o lugar);
- libere o domínio dela na CSP — no `<meta>` de `base.njk` **e** em
  `tools/postbuild.js` (`script-src` e `connect-src`);
- atualize `src/privacidade.njk`;
- ajuste o teste "sem rastreador" em `tools/test.js`.

---

## 10. Segurança e privacidade

- Nenhum formulário, nenhum banco de dados, nenhum cookie, nenhum
  `localStorage`. O agendamento acontece no WhatsApp.
- **Content-Security-Policy** estrita em todas as páginas: só recursos do
  próprio domínio; scripts inline liberados por hash (sem `unsafe-inline`);
  `frame-src` só para o Google Maps.
- O mapa do Google **só carrega quando a pessoa clica** em "Mostrar o mapa".
- Fontes, CSS, JS e imagens saem do próprio domínio — nenhuma requisição a
  terceiros no carregamento.
- Cabeçalhos: HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`,
  `frame-ancestors 'none'`, `Referrer-Policy`, `Permissions-Policy`,
  `Cross-Origin-Opener-Policy`.
- Links externos com `rel="noopener noreferrer"`.
- Sem chaves, tokens ou segredos no código.
- Dependências apenas de build (Eleventy, esbuild, Lightning CSS, sharp,
  playwright-core); nada disso vai para o navegador. Rode `npm audit` de vez
  em quando e `npm update` para mantê-las em dia.
  Em outubro de 2026, o `npm audit` aponta um alerta "high" no pacote
  `braces`, usado pelo observador de arquivos (`chokidar`) do Eleventy. Ele só
  roda na máquina de quem desenvolve, durante o `npm run dev`; o site
  publicado é HTML estático e não executa nada disso. Não há versão corrigida
  do `braces`, e o `npm audit fix --force` sugerido rebaixaria o Eleventy
  para a 0.6 — não aplique.

---

## 11. Qualidade: testes e auditoria

```bash
npm run build && npm run test && npm run qa
```

- **`npm run test`** lê o HTML gerado e cobra: NAP idêntico em todas as
  páginas; todo link de WhatsApp com o número certo e uma mensagem de
  `business.js`; título e descrição únicos e no tamanho; um `h1` por página;
  canonical, Open Graph e Twitter Card; sitemap e robots coerentes com
  `publicavel`; schema coerente com os dados (endereço, telefone, horários,
  serviços); `FAQPage` só no FAQ; ausência de formulário, iframe, rastreador e
  recurso de terceiros; CSP sem `unsafe-*`; preços só os das assinaturas;
  nenhuma frase proibida pelo briefing ("resultado garantido", "sem riscos",
  clichês, superlativos, certificações, tempo de mercado...); nenhuma citação
  enquanto não houver depoimento real; imagens existentes, com dimensões e
  `alt` descritivo; nada de `fotos/nao-publicar/` publicado.
- **`npm run qa`** abre cada página no Chromium em 320, 375, 390, 430, 768,
  1024, 1440 e 1920 px e cobra: sem rolagem horizontal, sem erro de console,
  sem violação de CSP, alvos de toque ≥ 44 px nas ações, contraste WCAG AA,
  hierarquia de títulos sem saltos, ids únicos, âncoras e links internos
  válidos, imagens carregadas e animações de entrada que de fato revelam o
  conteúdo.

Medição feita com 4G lento simulado e CPU 4× mais lenta (celular): LCP
≈ 1,3–1,4 s e CLS 0 na home, serviços e galeria.

---

## 12. Pendências e decisões

Itens que dependem da Casa EME — nenhum deles impede publicar, mas todos
melhoram o site:

1. **Horários — divergência.** A bio do Instagram diz "Ter a Sáb, 9h às
   19h"; os horários detalhados informados dizem terça a quinta até 18h e
   sexta e sábado até 19h. O site usa os detalhados (como pedido) e traz a
   nota "Os horários de cada serviço são confirmados no agendamento". Confirme
   com a casa, ajuste `src/_data/hours.js` se for o caso e alinhe a bio do
   Instagram e a ficha do Google.
2. **Foto marcada como IA — fora do site.** O story "Unhas" (esmalte
   perolado com vidros Impala) aparece no Instagram com o selo **"Conteúdo de
   IA"**. Como o briefing proíbe imagem artificial apresentada como real, ela
   ficou em `fotos/nao-publicar/` e o teste impede que seja publicada.
3. **Autoria das fotos de unhas.** As fotos "francesinha" e "preto e
   tartaruga" estão no feed da casa, mas têm cara de foto de referência.
   Estão no site marcadas com `confirmar: true` em `galeria.js`. Se não forem
   trabalhos da Casa EME, troque por fotos próprias.
4. **Fotos do ambiente, da equipe e de estética/saúde capilar.** Não há
   nenhuma ainda. A galeria e a página Sobre já estão preparadas para recebê-las
   (seção 4). Fotos reais do espaço são o que mais falta para a primeira
   impressão — e para o Perfil da Empresa no Google.
5. **Depoimentos.** O briefing citou os pontos que mais se repetem nas
   avaliações, mas nenhum texto de avaliação. O site mostra esses pontos como
   temas, sem aspas e sem nomes. Para mostrar citações, transcreva avaliações
   reais (com o nome como aparece no Google) em `src/_data/depoimentos.js`.
6. **Equipe.** Nenhuma profissional foi apresentada; a página Sobre não cita
   nomes nem formações. Se a casa quiser, dá para incluir uma seção com fotos
   e funções (sem certificações que não possam ser comprovadas).
7. **Assinaturas.** Valores e condições transcritos do story da casa. Revise
   sempre que a tabela mudar (`src/_data/assinaturas.js`).
8. **Outubro Rosa.** Seção ligada (`src/_data/outubroRosa.js`). Desligue em
   novembro e, no próximo outubro, atualize o link do INCA para a campanha do
   ano.
9. **Domínio.** `site.url` está com um domínio provisório
   (`www.casaememoema.com.br`) e `publicavel: false`. Ver seção 7.
10. **Logo vetorial.** O selo foi redesenhado a partir do print do perfil;
    se houver o arquivo original, ele substitui o redesenho (seção 4).

---

## 13. Antes de publicar — checklist

- [ ] Domínio definitivo em `src/_data/site.js` → `url`
- [ ] `publicavel: true` em `src/_data/site.js`
- [ ] Horários confirmados com a casa (pendência 1)
- [ ] Autoria das fotos de unhas confirmada (pendência 3)
- [ ] Valores das assinaturas conferidos
- [ ] `npm run build && npm run test && npm run qa` sem falhas
- [ ] Domínio conectado na Vercel, HTTPS ativo
- [ ] Search Console verificado e `sitemap.xml` enviado
- [ ] Site cadastrado no Perfil da Empresa no Google, com NAP idêntico

---

Fontes: Baskervville (ANRT) e Hanken Grotesk, ambas sob SIL Open Font License,
servidas do próprio site.
