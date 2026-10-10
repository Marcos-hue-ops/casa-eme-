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
| Hospedagem | Vercel (configurada) · Hostinger (branch `hostinger`, com `.htaccess`) · Netlify/Cloudflare Pages · Apache/Nginx (exemplos em `deploy/`) |
| Node | 20 ou mais novo (`.nvmrc` pede 22) |

---

## Sumário

1. [Rodar e gerar o site](#1-rodar-e-gerar-o-site)
2. [Estrutura do projeto](#2-estrutura-do-projeto)
3. [Onde mudar cada coisa](#3-onde-mudar-cada-coisa)
4. [Fotos e imagens](#4-fotos-e-imagens)
5. [SEO](#5-seo)
6. [Publicar na Vercel (ou na Hostinger)](#6-publicar-na-vercel)
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
| `npm run video` | prepara o vídeo do depoimento para a web e gera a capa (ver seção 4) |
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
│   ├── hero/                  arte "Cuidado que vai além da beleza" (primeira dobra)
│   ├── casos/                 antes e depois de pacientes (saúde capilar e rosto)
│   ├── equipe/                artes da Dra. Rejane Rabelo e a foto do Gilberto
│   ├── galeria/               fotos de trabalhos → viram WebP
│   ├── referencias/           prints usados como referência (logo, manifesto, assinaturas, depoimento escrito)
│   └── nao-publicar/          o que NÃO pode ir ao site (ver LEIAME.md)
├── videos/                    original do depoimento em vídeo (→ `npm run video`)
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
│   │   ├── img/               imagens prontas (geradas por `npm run images`)
│   │   └── video/             vídeo do depoimento pronto para a web + legendas (.vtt)
│   ├── static/                favicon, ícones e manifest (copiados para a raiz)
│   ├── index.njk              home
│   ├── sobre.njk  servicos.njk  saude-capilar.njk  emagrecimento.njk  estetica-avancada.njk
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
| Saúde capilar | `/saude-capilar/` |
| Emagrecimento | `/emagrecimento/` |
| Estética avançada | `/estetica-avancada/` |
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
| **Serviços** (incluir, tirar, renomear) | `src/_data/servicos.js` | alimenta home, serviços, estética, capilar, emagrecimento, FAQ e schema. A **ordem** das categorias é a ordem do índice e da numeração da home: as três primeiras são os destaques |
| **Textos da home e das especialidades** (primeira dobra e credenciais, índice de serviços, saúde capilar, quem atende, depoimentos, emagrecimento, estética, beleza, frase do manifesto) | `src/_data/destaques.js` | `enfase` é o trecho do título que sai em itálico. Os textos foram enxutos de propósito: frases curtas, uma ideia por frase |
| **Credenciais da primeira dobra** | `src/_data/destaques.js → hero.credenciais` | só fatos informados (registro, método, casos); `href` leva à seção da home |
| **Dra. Rejane Rabelo** (formação, cursos, registro, fotos, etapas da avaliação) | `src/_data/equipe.js` → `rejane` | só o que está nas artes dela; nunca "médica" |
| **Gilberto** (beleza: experiência, formação, cursos, salão, foto) | `src/_data/equipe.js` → `gilberto`; textos da seção em `destaques.js → gilberto` | só o que a casa informou; a seção é a mesma da Dra. Rejane (`src/_includes/sections/pessoa.njk`), com o retrato à direita |
| **Responsável por uma categoria** (linha "Responsável" na página de serviços) | `src/_data/servicos.js` → `responsavel` | chave de `equipe.js`: `'rejane'`, `'gilberto'` |
| **Antes e depois** | `src/_data/casos.js` | crédito e ressalva aparecem junto das fotos; os casos entram sozinhos na galeria |
| **Assinaturas** (planos, valores, condições) | `src/_data/assinaturas.js` | `mostrarPrecos: false` esconde os valores |
| **Perguntas frequentes** | `src/_data/faq.js` | o campo `em` diz em que outras páginas a pergunta aparece |
| **Manifesto "Por que Casa EME?"** | `src/_data/manifesto.js` | texto da própria casa |
| **Depoimentos** (vídeo e texto) | `src/_data/depoimentos.js` | só depoimentos reais, sem mudar o sentido; o vídeo tem transcrição e legendas (`src/assets/video/*.vtt`) |
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

A grande é a foto da arte "Cuidado que vai além da beleza" (a mulher
sorrindo); a pequena é o rosto da Dra. Rejane Rabelo. São recortes quadrados
declarados em `tools/images.js` (`DERIVADOS`) e referenciados em
`galeria.js → janelas`. O **texto** da arte não fica na imagem: ele é HTML, em
`destaques.js → hero`, para ser lido pelo Google e por leitor de tela.

Para trocar uma janela, declare o recorte em `DERIVADOS`, rode
`npm run images` e troque a linha `imagem:` em `janelas.principal` (ou
`secundaria`). Os recortes antigos (ondas e francesinha) continuam gerados.

### Antes e depois

Os originais ficam em `fotos/casos/`. Para incluir um caso: salve a montagem
(antes em cima, depois embaixo) em `fotos/casos/`, rode `npm run images` e
crie um item em `src/_data/casos.js` com `area` (`capilar` ou `facial`),
`titulo`, `detalhe`, `alt` e a linha `imagem:`. O site escreve "Antes" e
"Depois" sobre cada metade (`layout: 'empilhado'`); montagem com marcações
próprias usa `layout: 'montagem'`. Marque `creditado: true` só quando a casa
informar que a Dra. Rejane atendeu o caso — aí o crédito com o registro no
CRBM aparece junto. A frase do conselho ("Esta imagem não representa…") sai
sozinha no pé das fotos e na foto ampliada. **Só publique com o termo de
consentimento do paciente assinado** (pendência 2).

### Vídeo do depoimento

O original fica em `videos/`. `npm run video` gera a versão para a web
(H.264, áudio normalizado, `faststart` para começar a tocar antes de baixar
tudo, ~2 MB) e a capa em WebP. O vídeo só começa a baixar quando a pessoa
aperta o play. A legenda (`src/assets/video/depoimento-capilar.vtt`) e a
transcrição (`depoimentos.js → transcricao`) foram feitas com reconhecimento
de voz rodando localmente e revisadas; se mudar uma, mude a outra.

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
  telefone, horários, Instagram e catálogo de serviços; `Person` para a Dra.
  Rejane Rabelo (com o registro no CRBM), ligada ao salão; `WebSite`;
  `BreadcrumbList` nas páginas internas; `Service` nas páginas de saúde
  capilar, emagrecimento e estética; `VideoObject` para o depoimento em vídeo
  (home e saúde capilar); `FAQPage` só na página de perguntas frequentes. Ficam de fora,
  de propósito, nota média, número de avaliações, preços e coordenadas — nada
  disso foi informado ou aferido. (O Google hoje só mostra o resultado
  enriquecido de FAQ para sites de governo e saúde; a marcação continua
  válida e ajuda a entender a página.)
- **Sitemap** (`/sitemap.xml`) é gerado a cada build com todas as páginas
  públicas — não precisa editar. Página nova entra sozinha; para deixar uma
  página de fora, coloque `robots: noindex` no front matter dela.
- **robots.txt** é gerado a partir do interruptor `publicavel` de
  `src/_data/site.js`, decidido no build (ver seção 6).

---

## 6. Publicar na Vercel

### Antes de importar: a branch certa

O código do site está na branch `claude/brave-faraday-alroh1`. Na hora de
importar, a Vercel escolhe sozinha a branch de produção (`main`, `master` ou
a branch padrão do GitHub) e **guarda essa escolha no projeto**: trocar a
branch padrão do GitHub depois não muda o que a Vercel publica. Confira, logo
depois de importar, em *Settings → Environments → Production → Branch
Tracking* (ou *Settings → Git → Production Branch*, conforme a tela), que
está `claude/brave-faraday-alroh1`; se não estiver, digite e faça
*Deployments → ⋯ → Redeploy*.

**Nunca** use a branch `hostinger` como produção na Vercel: ela só tem o site
pronto, sem `package.json` nem `vercel.json`, e o build falha. As prévias que
a Vercel tenta gerar dela aparecem com um X vermelho nos commits da
`hostinger` no GitHub; isso não afeta a Hostinger nem a produção da Vercel.
Para sumir com o X: em cada projeto, *Settings → Build and Deployment →
Ignored Build Step* → comando `[ "$VERCEL_GIT_COMMIT_REF" = "hostinger" ] && exit 0 || exit 1`.

### Importar

1. Em [vercel.com](https://vercel.com), entre com a conta do GitHub.
2. **Add New… → Project** → na lista, **Import** ao lado de `casa-eme-`.
   (Se o repositório não aparecer: *Adjust GitHub App Permissions* e libere o
   acesso a ele.)
3. Na tela de configuração **não mude nada**: o `vercel.json` já define
   tudo — sem preset de framework, instalação `npm ci`, build
   `npm run build`, pasta `dist`, Node 22 (lido do `package.json`).
   *Root Directory* fica vazio.
4. **Deploy**. Em cerca de um minuto o site está no ar em
   `https://<nome-do-projeto>.vercel.app`.

Daí em diante, cada push na branch de produção publica de novo; cada outra
branch ou pull request ganha um endereço de prévia.

### O que acontece sozinho

| Situação | Endereço usado no canonical, sitemap e cartão social | Google |
|---|---|---|
| Produção sem domínio próprio | `https://<projeto>.vercel.app` | fora (`noindex`) |
| Produção com domínio próprio | o domínio | **indexa** |
| Prévias (branches, PRs) | o endereço de produção | fora (`noindex`) |
| Build local / outro provedor | `SITE_URL`, ou `https://casaememoema.com.br` | fora, salvo `SITE_PUBLICAVEL=true` |
| Hostinger (branch `hostinger`, gerada pela automação) | `https://casaememoema.com.br` | dentro |

Ou seja: dá para publicar já, mandar o link pelo WhatsApp (o cartão com a
foto aparece) e só entrar no Google quando o domínio estiver conectado. A
regra está em `src/_data/site.js`.

**Variáveis opcionais** (*Settings → Environment Variables*, ambiente
*Production*; depois, *Redeploy*):

| Variável | Para quê |
|---|---|
| `SITE_URL` | fixar o domínio principal, ex.: `https://casaememoema.com.br`. Use quando o principal for outro (a Vercel, sozinha, escolhe o domínio mais curto, que é o sem www). |
| `SITE_PUBLICAVEL` | `false` segura o site fora do Google mesmo com domínio; `true` libera mesmo no `.vercel.app` (não recomendado). |

O `vercel.json` também envia os cabeçalhos de segurança (HSTS, nosniff,
X-Frame-Options, Referrer-Policy, Permissions-Policy) e o cache certo de
cada tipo de arquivo. A CSP vai na própria página (`<meta>`), com os hashes
calculados no build.

**Netlify / Cloudflare Pages:** use o `netlify.toml` (mesmo comando, pasta
`dist`); os cabeçalhos saem do `dist/_headers`, gerado no build. Defina
`SITE_URL` e `SITE_PUBLICAVEL=true` nas variáveis do provedor quando o
domínio estiver pronto.
**Servidor próprio:** veja `deploy/nginx.conf` e `deploy/apache.htaccess`;
rode o build com `SITE_URL=https://seu.dominio SITE_PUBLICAVEL=true npm run build`.

### Hostinger (hospedagem de sites)

A hospedagem de sites da Hostinger **não gera o site**: ela não roda
`npm run build`, só copia arquivos para a pasta `public_html`. Se ela
receber o código-fonte (a branch `claude/brave-faraday-alroh1`), aparece
erro 403, a página padrão da Hostinger ou uma lista de pastas.

Por isso o repositório tem a branch **`hostinger`**, só com o site pronto
(o `index.html` na raiz, as pastas das páginas, `assets/` e o `.htaccess`).
Quem a mantém é a automação `.github/workflows/hostinger.yml`: a cada
atualização da branch do site, o GitHub gera o site, roda os testes e grava
um commit novo na branch `hostinger`, em cima do anterior (o histórico fica,
e o `git pull` da Hostinger sempre consegue avançar). Ninguém precisa mexer
nela à mão.

O Git do hPanel só existe em site do tipo **site vazio (PHP/HTML)**. Site
criado pelo construtor da Hostinger (Website Builder) não tem essa opção:
nesse caso, crie um site vazio para o domínio ou use o caminho 2.

**Caminho 1 — Git do hPanel (atualiza sozinho)**

1. Antes: no **Gerenciador de arquivos**, abra `public_html` e apague o que
   a Hostinger deixou lá (`default.php`, `index.php`). O Git do hPanel só
   implanta em pasta vazia.
2. hPanel → **Sites → Gerenciar → Avançado → Git**.
3. **Repositório:** se aparecer **Conectar com o GitHub**, autorize e
   escolha `casa-eme-`. Se aparecer um campo de endereço, use
   `https://github.com/Marcos-hue-ops/casa-eme-.git` — o repositório é
   público, então não precisa de chave SSH. (Se um dia ele virar
   **privado**: `git@github.com:Marcos-hue-ops/casa-eme-.git`, com a chave
   SSH do hPanel colada em GitHub → **Settings → Deploy keys**, só leitura.)
4. **Branch:** `hostinger`. O hPanel costuma sugerir `main` ou `master`, que
   **não existem** neste repositório; a branch do código
   (`claude/brave-faraday-alroh1`) também não serve. **Diretório:** deixe em
   branco, para ir direto em `public_html`.
5. **Criar** e depois **Implantar**. Para atualizar sozinho a cada mudança,
   ative a **Implantação automática**, copie a URL do webhook e cole em
   GitHub → **Settings → Webhooks → Add webhook** (tipo `application/json`).

**Caminho 2 — enviar o zip**

1. Pegue o zip do site pronto: `casa-eme-hostinger.zip` (gerado com
   `cd dist && zip -qr ../casa-eme-hostinger.zip . -x csp.gerada.txt _headers`),
   ou no GitHub, branch `hostinger` → **Code → Download ZIP**. Prefira o
   primeiro: o zip do GitHub vem dentro de uma pasta
   (`casa-eme--hostinger/`), e o que vai para `public_html` é o
   **conteúdo** dela, não a pasta. Nunca baixe o zip da branch do código.
2. hPanel → **Gerenciador de arquivos** → `public_html` → apague os
   arquivos padrão → **Enviar** o zip → botão direito → **Extrair** para
   `public_html`.
3. Confira que ficaram `public_html/index.html` e `public_html/.htaccess`
   (o `.htaccess` começa com ponto: ligue "mostrar arquivos ocultos").

**Depois de publicar**

- **SSL:** hPanel → **Segurança → SSL**: confirme o certificado ativo e só
  então ligue **Forçar HTTPS**. (O `.htaccess` não força HTTPS por conta
  própria, para o site não ficar fora do ar enquanto o certificado sai.)
- **www:** o `.htaccess` já leva o `www.` para o endereço sem www. **Não**
  crie no hPanel o redirecionamento contrário (sem www → www): os dois juntos
  fazem o navegador girar em círculo ("too many redirects").
- **Erro 403 depois de publicar:** confira que `index.html` está direto em
  `public_html` (e não numa subpasta). Se estiver, no Gerenciador de arquivos
  use **Corrigir permissões** (pastas 755, arquivos 644).
- **Teste de segurança:** abra `https://casaememoema.com.br/.git/config` e
  `https://casaememoema.com.br/.htaccess`. Os dois têm de dar erro (403 ou
  404): o `.htaccess` do build bloqueia qualquer arquivo que comece com ponto.
- **Domínio e Google:** a branch `hostinger` já sai com o domínio
  **`https://casaememoema.com.br`** (sem www) no canonical, no sitemap e no
  cartão social, e com a indexação ligada. Quem digitar `www.` é levado para o
  endereço sem www pelo `.htaccess`. Para mudar, crie em GitHub → **Settings →
  Secrets and variables → Actions → Variables** `SITE_URL` e/ou
  `SITE_PUBLICAVEL` (`false` tira do Google) e rode **Actions → Site para a
  Hostinger → Run workflow**. (Esse botão só aparece quando a branch padrão do
  GitHub é a do código, `claude/brave-faraday-alroh1`. Com a `hostinger` como
  padrão, a automação continua rodando a cada mudança no código, mas o botão
  some: aí é preciso uma alteração qualquer no código para gerar de novo.)
- **Branch padrão do GitHub:** a Hostinger não precisa que a `hostinger`
  seja a padrão — vale o que estiver escrito no campo **Branch** do hPanel
  (que vem com `main`; troque para `hostinger`). Se a `hostinger` for a
  padrão, atenção ao enviar fotos ou arquivos pelo site do GitHub: escolha
  antes a branch `claude/brave-faraday-alroh1` no seletor, senão o arquivo
  vai para a `hostinger` e some na próxima atualização automática.
- **DNS:** se o domínio foi registrado fora da Hostinger (Registro.br, por
  exemplo), aponte os servidores DNS (ou os registros `A` e `CNAME` do `www`)
  para os que o hPanel mostrar em **Domínios** (em geral
  `ns1.dns-parking.com` e `ns2.dns-parking.com`). Enquanto o DNS não propaga
  (de minutos a 48 horas), o domínio ainda abre o endereço antigo.
  **Atenção ao e-mail:** se já existe e-mail com `@casaememoema.com.br`, trocar
  os servidores DNS apaga os registros MX de onde ele está. Antes de trocar,
  anote os MX atuais e recrie na zona DNS da Hostinger, ou aponte só os
  registros `A`/`CNAME` do site e deixe os servidores DNS onde estão.
- **Mudança não apareceu:** confira em GitHub → **Actions** que a "Site
  para a Hostinger" terminou verde; depois hPanel → **Git → Implantar** (se a
  implantação automática não estiver ligada) e **Desempenho → Cache** (e
  **CDN**, se estiver ligado) → limpar; no navegador, Ctrl+Shift+R.
- **Vercel e Hostinger ao mesmo tempo:** o domínio aponta para um só. Os dois
  podem continuar gerando o site, mas o Google e os clientes veem o que o
  domínio aponta.

---

## 7. Conectar o domínio

1. Na Vercel: **Project → Settings → Domains → Add** e digite o domínio
   (`casaememoema.com.br`). A Vercel oferece adicionar junto a versão com
   `www` e redirecionar uma para a outra — aceite.
2. No registro do domínio (Registro.br, por exemplo), crie os registros DNS
   que a Vercel mostrar — normalmente um `A` do domínio raiz para o IP
   indicado e um `CNAME` de `www` para o endereço indicado. O HTTPS é emitido
   sozinho quando o DNS propagar (de minutos a algumas horas).
3. Se o domínio **principal** for o com `www`, crie a variável
   `SITE_URL=https://www.seudominio.com.br` (seção 6).
4. **Deployments → ⋯ → Redeploy** no último deploy de produção. Esse deploy
   já sai com o domínio no canonical, no sitemap e no cartão social, e com a
   indexação liberada.
5. Confira: `https://seudominio.com.br/robots.txt` deve mostrar `Allow: /`
   e o endereço do sitemap.

---

## 8. Google Search Console e Perfil da Empresa

**Search Console** (depois que o domínio próprio estiver conectado e o
`robots.txt` dele mostrar `Allow: /`):

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
  clichês, superlativos, certificações, tempo de mercado, promessa de quilos
  ou de cura capilar, a Dra. Rejane chamada de médica...); um único telefone
  (o da casa); antes e depois sempre com o crédito (registro no CRBM) e a
  ressalva; vídeo com `preload="none"`, capa, legenda, transcrição e
  `VideoObject`; aviso de acompanhamento médico no emagrecimento; imagens
  existentes, com dimensões e `alt` descritivo; nada de `fotos/nao-publicar/`
  publicado.
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

Itens que dependem da Casa EME. Os marcados **(antes de publicar)** tratam
de autorização, de regra de publicidade em saúde ou de fato que o site
afirma — respondê-los antes de o site ir ao ar evita problema com conselho
profissional, com paciente ou com o Código de Defesa do Consumidor. Os
outros melhoram o site, mas não impedem a publicação.

1. **Horários — divergência.** A bio do Instagram diz "Ter a Sáb, 9h às
   19h"; os horários detalhados informados dizem terça a quinta até 18h e
   sexta e sábado até 19h. O site usa os detalhados (como pedido) e traz a
   nota "Os horários de cada serviço são confirmados no agendamento". Confirme
   com a casa, ajuste `src/_data/hours.js` se for o caso e alinhe a bio do
   Instagram e a ficha do Google.
2. **Antes e depois — autorização e condições (antes de publicar).**
   - Termo de consentimento assinado por **cada paciente** das 7 fotos de
     `fotos/casos/`, autorizando o uso no site. Foto de saúde é dado pessoal
     sensível (LGPD, art. 11). Pelo Código de Ética do Biomédico (Res. CFBM
     330/2020), o termo também deve ser encaminhado ao conselho; a frase
     obrigatória ("Esta imagem não representa, em hipótese alguma, garantia
     de resultado…") já está no site, junto das fotos e na foto ampliada.
   - Quem atendeu cada caso. O site credita à Dra. Rejane só os dois casos
     capilares (`creditado: true` em `casos.js`); os faciais estão sem
     crédito porque ninguém informou quem os fez.
   - Condições das fotos: na **glabela**, o "depois" foi tirado tentando
     franzir ou em repouso? Nos dois **contornos dos olhos**, o "depois" tem
     pele avermelhada e brilhante — se foi tirado logo após o procedimento,
     o par não deve ir ao site como resultado. No **topo da cabeça**, as
     fotos são de lugares e luz diferentes. No **Protocolo Capilaris**,
     qual foto é o ponto de partida em cada par, e se é o mesmo paciente.
     Os textos alternativos descrevem essas diferenças em vez de prometer
     melhora.
3. **Procedimentos injetáveis — quem pode fazer e anunciar (antes de
   publicar).** A revisão encontrou notícias (março e maio de 2026) de que o
   TRF-1 manteve a anulação da Res. CFBM 241/2014, que autorizava biomédicos
   a aplicar toxina botulínica, preenchimentos e outros injetáveis, com
   recurso anunciado pelo CFBM. As fontes oficiais não puderam ser abertas
   daqui, então trate isto como alerta, não como parecer. A lista de estética
   avançada (que veio do briefing) e os "protocolos injetáveis" do capilar
   continuam no site; confirme com advogado ou com o CRBM quem faz esses
   procedimentos na casa. Se for médico(a), o site pode citar nome e CRM
   informados pela casa.
4. **Depoimentos (antes de publicar).**
   - **Vídeo:** autorização de uso de imagem e voz do paciente. Confirmar a
     transcrição — o reconhecimento de voz ouviu "Regiane" (corrigido para
     "Rejane") e vale conferir "Um mês atrás, mais ou menos" junto de "10
     sessões". Se mudar, mude a legenda (`.vtt`) e `depoimentos.js` juntos.
   - **Aron Menczer:** de onde veio o depoimento (link ou print) e a
     autorização dele para o nome aparecer. O original em inglês escreve
     "Rejeni" e vem com um retrato que parece de banco de imagens (não usado
     no site). Sem confirmação, tire o item de `depoimentos.js`, o nome do
     texto de abertura e a última frase do 3º parágrafo sobre a Dra. Rejane
     em `destaques.js`.
   - O Código do CONAR (Anexo G) restringe depoimento de leigo em
     publicidade de tratamento clínico. O site mostra os relatos com a
     ressalva de que não são promessa; mantê-los é decisão da casa.
5. **Dra. Rejane Rabelo — dados para conferir.** Região do registro (ex.:
   CRBM-1 13690) e habilitações registradas; se a pós em estética avançada
   é a mesma do IOA (a arte traz as duas separadas, e o site também); se ela
   atende estética avançada e emagrecimento na casa (hoje o site a apresenta
   só na saúde capilar); se pode entrar o link para o Instagram dela (tirado
   porque as artes de lá trazem o telefone pessoal, e o agendamento do site
   é um só). As artes dela dizem "Atendimento: Moema/Morumbi"; o site diz
   que ela atende na Casa EME.
6. **Saúde capilar — textos para a Dra. Rejane revisar.** As explicações
   curtas de cada queixa (alopecias, dermatite, queda, afinamento, falta de
   crescimento) foram escritas para o site (`destaques.js → capilar`). E o
   que é o **Protocolo Capilaris** — protocolo dela, da casa ou nome
   comercial de terceiro?
7. **Emagrecimento.** Nenhuma fonte descreveu o serviço; o site o monta com
   os protocolos corporais que já estavam no briefing (gordura localizada,
   flacidez, celulite, contorno, drenagem) e um passo a passo genérico
   (avaliação, plano, acompanhamento). Confirme o que entra e quem atende.
   Medicamento, suplemento ou injetável não vão ao site.
8. **Foto da primeira dobra.** A modelo da arte "Cuidado que vai além da
   beleza" é uma imagem de campanha (a mesma aparece na arte das
   assinaturas). Confirme que a licença dessa imagem cobre o uso no site.
9. **Foto marcada como IA — fora do site.** O story "Unhas" (esmalte
   perolado com vidros Impala) aparece no Instagram com o selo **"Conteúdo de
   IA"**. Como o briefing proíbe imagem artificial apresentada como real, ela
   ficou em `fotos/nao-publicar/` e o teste impede que seja publicada.
10. **Autoria das fotos de unhas.** As fotos "francesinha" e "preto e
    tartaruga" estão no feed da casa, mas têm cara de foto de referência.
    Estão no site marcadas com `confirmar: true` em `galeria.js`. Se não
    forem trabalhos da Casa EME, troque por fotos próprias.
11. **Fotos do ambiente.** Ainda não há fotos do espaço (fachada, recepção,
    salas). A galeria e a página Sobre já estão preparadas para recebê-las
    (seção 4) — é o que mais falta para a primeira impressão e para o Perfil
    da Empresa no Google.
12. **Assinaturas.** Valores e condições transcritos do story da casa.
    Revise sempre que a tabela mudar (`src/_data/assinaturas.js`).
13. **Outubro Rosa.** Seção ligada (`src/_data/outubroRosa.js`). Desligue em
    novembro e, no próximo outubro, atualize o link do INCA para a campanha
    do ano.
14. **Domínio.** Sem domínio próprio, o site funciona no endereço
    `.vercel.app`, fora do Google. Conectar o domínio libera a indexação
    (seções 6 e 7).
15. **Logo vetorial.** O selo foi redesenhado a partir do print do perfil;
    se houver o arquivo original, ele substitui o redesenho (seção 4).
16. **Gilberto — dados para conferir.** O site usa o que a casa mandou:
    30 anos de experiência, formação pela Faculdade Senac, especialização em
    corte pela Toni&Guy, corte programado Llongueras, clareamento e cor pela
    L’Oréal, gestão e beleza pela Academia Lafi, dono da Ezatto Cabeleireiros
    em Florianópolis. Confira: o sobrenome (o site usa só "Gilberto"); qual
    Senac ("Senac do RG" ficou como "Faculdade Senac" — se for Rio Grande,
    RS, dá para escrever); a grafia **Llongueras** (a mensagem dizia
    "longuera"); o nome exato da **Academia Lafi**; se a Ezatto pode ser
    citada; e a autorização dele para o uso da foto.
17. **Foto do Gilberto — tratada.** A foto da Beauty Fair chegou pelo
    WhatsApp (848×1416, com a luz roxa do evento). A do site foi ampliada
    para o dobro, com a compressão limpa, mais nitidez e a cor corrigida só
    nele (cabelo grisalho, pele, blazer). Nada foi redesenhado nem inventado.
    O original está em `fotos/nao-publicar/`. Se houver a foto original da
    câmera (sem passar pelo WhatsApp), ela fica ainda melhor: troque o
    arquivo em `fotos/equipe/gilberto.jpg` e rode `npm run images`.

---

## 13. Antes de publicar — checklist

- [ ] Termos de consentimento dos 7 casos e autorização do vídeo conferidos (pendências 2 e 4)
- [ ] Quem faz e quem pode anunciar os injetáveis confirmado (pendência 3)
- [ ] Depoimento do Aron Menczer confirmado ou retirado (pendência 4)
- [ ] Dados do Gilberto e autorização da foto confirmados (pendência 16)
- [ ] Dados da Dra. Rejane conferidos com ela (pendência 5)
- [ ] Licença da foto da primeira dobra confirmada (pendência 8)
- [ ] Horários confirmados com a casa (pendência 1)
- [ ] Autoria das fotos de unhas confirmada (pendência 10)
- [ ] Valores das assinaturas conferidos
- [ ] `npm run build && npm run test && npm run qa` sem falhas
- [ ] Production Branch da Vercel em `claude/brave-faraday-alroh1`; campo Branch do hPanel em `hostinger`
- [ ] Domínio apontando para a hospedagem que publica o site (Hostinger), SSL ativo e "Forçar HTTPS" ligado
- [ ] `robots.txt` do domínio com `Allow: /`
- [ ] Search Console verificado e `sitemap.xml` enviado
- [ ] Site cadastrado no Perfil da Empresa no Google, com NAP idêntico

---

Fontes: Baskervville (ANRT) e Hanken Grotesk, ambas sob SIL Open Font License,
servidas do próprio site.
