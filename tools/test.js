/**
 * Testes sobre o site já construído (rode `npm run build` antes).
 *
 * O QA (tools/qa.js) abre o navegador e olha a página renderizada. Este aqui
 * lê o HTML gerado e cobra o que é conteúdo e contrato: NAP igual em todo
 * lugar, WhatsApp certo em cada link, títulos e descrições únicos e no
 * tamanho, dados estruturados coerentes com os dados de origem, nenhum
 * recurso de terceiro no carregamento e nenhuma afirmação que a Casa EME não
 * tenha feito.
 *
 * Sai com código 1 se algo falhar.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import site from '../src/_data/site.js';
import business from '../src/_data/business.js';
import hours from '../src/_data/hours.js';
import faq from '../src/_data/faq.js';
import assinaturas from '../src/_data/assinaturas.js';
import servicos from '../src/_data/servicos.js';
import galeria from '../src/_data/galeria.js';
import depoimentos from '../src/_data/depoimentos.js';
import outubroRosa from '../src/_data/outubroRosa.js';
import casos from '../src/_data/casos.js';
import equipe from '../src/_data/equipe.js';
import destaques from '../src/_data/destaques.js';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

let falhas = 0;
const ok = (condicao, descricao, detalhe = '') => {
  if (condicao) return;
  falhas += 1;
  console.error(`  ✕ ${descricao}${detalhe ? `\n      ${detalhe}` : ''}`);
};

async function paginas(dir) {
  const entradas = await readdir(dir, { withFileTypes: true });
  const achados = await Promise.all(
    entradas.map((e) => {
      const completo = path.join(dir, e.name);
      if (e.isDirectory()) return paginas(completo);
      return e.name.endsWith('.html') ? [completo] : [];
    })
  );
  return achados.flat();
}

const arquivos = await paginas(DIST);
const html = Object.fromEntries(
  await Promise.all(arquivos.map(async (f) => [path.relative(DIST, f), await readFile(f, 'utf8')]))
);
const naoErro = Object.entries(html).filter(([nome]) => nome !== '404.html');
const textoDe = (conteudo) =>
  conteudo
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');

const PAGINAS_PUBLICAS = [
  '/',
  '/sobre/',
  '/servicos/',
  '/estetica-avancada/',
  '/saude-capilar/',
  '/emagrecimento/',
  '/galeria/',
  '/perguntas-frequentes/',
  '/contato/',
];

console.log(`\ntestes — ${arquivos.length} página(s)\n`);

/* ------------------------------------------------------------------ NAP */
console.log('NAP e contato');
const mensagens = new Set(Object.values(business.whatsapp.messages));
for (const [nome, conteudo] of Object.entries(html)) {
  ok(conteudo.includes(business.whatsapp.display), `${nome}: telefone visível`);
  const links = [...conteudo.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map((m) => m[1].replaceAll('&amp;', '&'));
  ok(links.length > 0, `${nome}: tem link de WhatsApp`);
  for (const link of new Set(links)) {
    const url = new URL(link);
    ok(url.pathname === `/${business.whatsapp.numero}`, `${nome}: wa.me aponta para ${business.whatsapp.numero}`, link);
    const texto = url.searchParams.get('text');
    ok(Boolean(texto) && mensagens.has(texto), `${nome}: mensagem do WhatsApp é uma das de business.js`, texto || link);
  }
  ok(conteudo.includes(business.instagram.url), `${nome}: link do Instagram`);
}
for (const [nome, conteudo] of naoErro) {
  ok(conteudo.includes(business.address.street), `${nome}: logradouro`);
  ok(conteudo.includes(business.address.zip), `${nome}: CEP`);
  ok(conteudo.includes('Moema'), `${nome}: bairro`);
  ok(conteudo.includes(business.maps.search.replaceAll('&', '&amp;')) || conteudo.includes(business.maps.search), `${nome}: link do Google Maps`);
}

/* Horários: os grupos do rodapé batem com a semana de hours.js. */
const diasAbertos = hours.semana.filter((d) => d.abre);
ok(diasAbertos.length === 5, 'hours.js: cinco dias de atendimento (terça a sábado)');
for (const g of hours.grupos) {
  ok(html['index.html'].includes(g.dias) && html['index.html'].includes(g.horas), `rodapé mostra "${g.dias} ${g.horas}"`);
}

/* ---------------------------------------------------------------- <head> */
console.log('\nMetadados');
const titulos = new Map();
const descricoes = new Map();
for (const [nome, conteudo] of Object.entries(html)) {
  const titulo = conteudo.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
  const descricao = conteudo.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';

  ok(titulo.length >= 25 && titulo.length <= 65, `${nome}: título com ${titulo.length} caracteres (25–65)`, titulo);
  ok(descricao.length >= 90 && descricao.length <= 165, `${nome}: descrição com ${descricao.length} caracteres (90–165)`, descricao);
  ok(!titulos.has(titulo), `${nome}: título único`, `repete ${titulos.get(titulo)}`);
  ok(!descricoes.has(descricao), `${nome}: descrição única`, `repete ${descricoes.get(descricao)}`);
  titulos.set(titulo, nome);
  descricoes.set(descricao, nome);

  ok(/<link rel="canonical" href="https:\/\/[^"]+\/"/.test(conteudo) || nome === '404.html', `${nome}: canonical com barra final`);
  ok(conteudo.includes('property="og:image"'), `${nome}: og:image`);
  ok(conteudo.includes('property="og:title"'), `${nome}: og:title`);
  ok(conteudo.includes('name="twitter:card"'), `${nome}: twitter card`);
  ok(conteudo.includes('<html lang="pt-BR"'), `${nome}: idioma declarado`);
  ok((conteudo.match(/<h1[\s>]/g) || []).length === 1, `${nome}: um único h1`);
  ok(conteudo.includes('rel="icon"') && conteudo.includes('rel="manifest"'), `${nome}: ícones e manifest`);
}
ok(/Casa EME/.test(titulos.keys().next().value), 'títulos levam a marca');
for (const titulo of titulos.keys()) ok(titulo.includes('Casa EME'), `título com a marca: "${titulo}"`);

/* ------------------------------------------------------------ indexação */
console.log('\nIndexação');
const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8');
const sitemap = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');

if (site.publicavel) {
  ok(robots.includes('Allow: /'), 'robots libera o rastreamento');
  ok(robots.includes(`${site.url}/sitemap.xml`), 'robots aponta o sitemap');
  for (const [nome, conteudo] of naoErro) {
    if (nome === 'privacidade/index.html') continue;
    ok(conteudo.includes('content="index, follow'), `${nome}: indexável`);
  }
  ok(html['privacidade/index.html'].includes('content="noindex, follow'), 'privacidade: noindex');
} else {
  ok(robots.includes('Disallow: /'), 'robots bloqueia enquanto o site não está liberado');
  for (const [nome, conteudo] of Object.entries(html)) {
    ok(conteudo.includes('content="noindex, nofollow"'), `${nome}: noindex enquanto não publicável`);
  }
}

ok(!sitemap.includes('/privacidade/'), 'sitemap não lista a privacidade');
ok(!sitemap.includes('404'), 'sitemap não lista a 404');
for (const url of PAGINAS_PUBLICAS) {
  ok(sitemap.includes(`<loc>${site.url}${url}</loc>`), `sitemap lista ${url}`);
}
ok((sitemap.match(/<loc>/g) || []).length === PAGINAS_PUBLICAS.length, 'sitemap só com as páginas públicas');

/* ------------------------------------------------------ dados estruturados */
console.log('\nDados estruturados');
const blocosDe = (conteudo) =>
  [...conteudo.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((b, i) => {
    try {
      return JSON.parse(b[1]);
    } catch (erro) {
      ok(false, `JSON-LD #${i + 1} inválido`, erro.message);
      return {};
    }
  });

for (const [nome, conteudo] of Object.entries(html)) {
  const blocos = blocosDe(conteudo);
  ok(blocos.length >= 1, `${nome}: tem JSON-LD`);
  if (nome !== 'index.html' && nome !== '404.html') {
    ok(blocos.some((b) => b['@type'] === 'BreadcrumbList'), `${nome}: BreadcrumbList`);
  }
}

const grafo = blocosDe(html['index.html'])[0];
const salao = grafo['@graph'].find((n) => n['@type'] === 'BeautySalon');
ok(Boolean(salao), 'JSON-LD declara BeautySalon');
ok(grafo['@graph'].some((n) => n['@type'] === 'WebSite'), 'JSON-LD declara WebSite');
ok(salao?.address.postalCode === business.address.zip, 'CEP do schema bate com os dados');
ok(salao?.address.streetAddress === business.address.street, 'logradouro do schema bate com os dados');
ok(salao?.telephone === business.whatsapp.tel, 'telefone do schema bate com os dados');
ok(salao?.sameAs.includes(business.instagram.url), 'schema aponta o Instagram');
ok(salao?.openingHoursSpecification.length === diasAbertos.length, 'schema tem um horário por dia de atendimento');
for (const dia of diasAbertos) {
  ok(
    salao?.openingHoursSpecification.some(
      (h) => h.dayOfWeek.endsWith(dia.dia) && h.opens === dia.abre && h.closes === dia.fecha
    ),
    `schema: ${dia.nome} ${dia.abre}–${dia.fecha}`
  );
}
const servicosNoSchema = salao?.hasOfferCatalog.itemListElement.flatMap((c) => c.itemListElement.map((o) => o.itemOffered.name)) ?? [];
const servicosNosDados = servicos.flatMap((c) => c.grupos.flatMap((g) => g.itens.map((i) => i.nome)));
ok(servicosNoSchema.length === servicosNosDados.length, 'catálogo do schema = serviços de servicos.js');
ok(!('geo' in (salao || {})), 'schema sem coordenadas (não aferidas)');
ok(!('priceRange' in (salao || {})), 'schema sem faixa de preço inventada');

for (const [nome, conteudo] of Object.entries(html)) {
  ok(!conteudo.includes('aggregateRating'), `${nome}: sem aggregateRating`);
  ok(!/"@type":"Review"/.test(conteudo), `${nome}: sem Review na marcação`);
}

const faqLd = blocosDe(html['perguntas-frequentes/index.html']).find((b) => b['@type'] === 'FAQPage');
const totalPerguntas = faq.reduce((n, g) => n + g.perguntas.length, 0);
ok(Boolean(faqLd), 'página de dúvidas declara FAQPage');
ok(faqLd?.mainEntity.length === totalPerguntas, `FAQPage tem as ${totalPerguntas} perguntas`, `tem ${faqLd?.mainEntity.length}`);
for (const [nome, conteudo] of Object.entries(html)) {
  if (nome === 'perguntas-frequentes/index.html') continue;
  ok(!conteudo.includes('"FAQPage"'), `${nome}: não duplica o FAQPage`);
}
/* Toda pergunta marcada no schema aparece visível na página. */
const textoFaq = textoDe(html['perguntas-frequentes/index.html']);
for (const g of faq) for (const p of g.perguntas) ok(textoFaq.includes(p.p), `FAQ visível: "${p.p}"`);

/* ------------------------------------------------ privacidade e segurança */
console.log('\nPrivacidade e segurança');
const PERMITIDOS = /^https:\/\/(wa\.me|www\.instagram\.com|www\.google\.com\/maps|www\.gov\.br\/inca)\//;
for (const [nome, conteudo] of Object.entries(html)) {
  ok(!/<form\b/i.test(conteudo), `${nome}: sem formulário`);
  ok(!/<iframe\b/i.test(conteudo), `${nome}: sem iframe no HTML entregue`);
  ok(!/\b(gtag|googletagmanager|google-analytics|fbq|hotjar|clarity\.ms)\b/i.test(conteudo), `${nome}: sem rastreador`);
  ok(!conteudo.includes('unsafe-inline') && !conteudo.includes('unsafe-eval'), `${nome}: CSP sem unsafe-*`);
  ok(conteudo.includes('http-equiv="Content-Security-Policy"'), `${nome}: CSP na página`);
  ok(!conteudo.includes('__CSP_SCRIPT_HASHES__'), `${nome}: hashes da CSP injetados`);
  ok(!/\sstyle="/.test(conteudo), `${nome}: sem atributo style (a CSP o bloquearia)`);

  const externos = [
    ...conteudo.matchAll(/<(?:script|img|iframe|source|video|audio)[^>]*\ssrc="(https?:\/\/[^"]+)"/g),
    ...conteudo.matchAll(/<link[^>]*\srel="(?:stylesheet|preload|preconnect|dns-prefetch|modulepreload)"[^>]*\shref="(https?:\/\/[^"]+)"/g),
  ].map((m) => m[1]);
  ok(externos.length === 0, `${nome}: nenhum recurso de terceiro no carregamento`, externos.join('\n      '));

  const linksExternos = [...conteudo.matchAll(/<a[^>]*\shref="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  for (const link of new Set(linksExternos)) {
    ok(PERMITIDOS.test(link), `${nome}: link externo esperado`, link);
  }
  /* Todo link que abre nova aba leva noopener. */
  const novaAba = [...conteudo.matchAll(/<a[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
  for (const a of novaAba) ok(/rel="[^"]*noopener/.test(a), `${nome}: target=_blank com noopener`, a.slice(0, 90));
}

/* O _headers (Netlify, Cloudflare) não é gerado em build da Vercel. */
const cabecalhos = process.env.VERCEL ? null : await readFile(path.join(DIST, '_headers'), 'utf8');
for (const esperado of cabecalhos === null ? [] : [
  'Content-Security-Policy',
  "frame-ancestors 'none'",
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'Permissions-Policy',
  'Strict-Transport-Security',
  'Referrer-Policy',
]) {
  ok(cabecalhos.includes(esperado), `_headers inclui ${esperado}`);
}
if (cabecalhos !== null) {
  ok(/script-src 'self' 'sha256-/.test(cabecalhos), '_headers tem hash de script em vez de unsafe-inline');
}

/* .htaccess (Hostinger e outros Apache/LiteSpeed): mesma política do _headers. */
if (!process.env.VERCEL) {
  const htaccess = await readFile(path.join(DIST, '.htaccess'), 'utf8');
  for (const esperado of ['Content-Security-Policy', "frame-ancestors 'none'", 'X-Content-Type-Options', 'Options -Indexes', 'ErrorDocument 404 /404.html']) {
    ok(htaccess.includes(esperado), `.htaccess inclui ${esperado}`);
  }
  ok(/script-src 'self' 'sha256-/.test(htaccess), '.htaccess tem hash de script em vez de unsafe-inline');
  ok(!/^\s*RewriteCond %\{HTTPS\} !=on/m.test(htaccess), '.htaccess não força HTTPS (isso fica para o hPanel, depois do SSL)');
  ok(/RewriteCond %\{HTTP_HOST\} \^www/.test(htaccess), '.htaccess leva o www para o domínio sem www');
}
for (const [nome, conteudo] of Object.entries(html)) {
  ok(!conteudo.includes('upgrade-insecure-requests'), `${nome}: CSP sem upgrade-insecure-requests (quebraria o site em http)`);
}

const vercel = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const chavesVercel = vercel.headers.flatMap((h) => h.headers.map((x) => x.key));
for (const chave of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options', 'Strict-Transport-Security']) {
  ok(chavesVercel.includes(chave), `vercel.json envia ${chave}`);
}

/* CSS e JS com impressão digital no nome (cache de um ano sem servir versão velha). */
for (const [nome, conteudo] of Object.entries(html)) {
  ok(/\/assets\/css\/main\.[0-9a-f]{10}\.css/.test(conteudo), `${nome}: CSS com hash no nome`);
  ok(/\/assets\/js\/main\.[0-9a-f]{10}\.js/.test(conteudo), `${nome}: JS com hash no nome`);
}

/* ------------------------------------------------------------- conteúdo */
console.log('\nConteúdo');
/**
 * O briefing proíbe promessa, superlativo sem prova, clichê e informação não
 * fornecida. Se alguém acrescentar sem ter recebido a informação, é aqui que
 * aparece antes de ir ao ar.
 */
const proibidos = [
  /* A frase do conselho ("…não representa, em hipótese alguma, garantia de
     resultado") é ressalva, não promessa: fica de fora do padrão. */
  [/resultados? garantidos?|(?<!n[aã]o representa, em hip[oó]tese alguma, )garantia de resultado|garantimos/i, 'promessa de resultado'],
  [/elimina(r)? definitivamente|sem riscos?|resultado imediato/i, 'promessa médica'],
  [/eleve sua beleza|sua beleza,? nossa paix[aã]o|transforme sua autoestima|descubra o poder|uma experi[eê]ncia [úu]nica|seu momento de autocuidado/i, 'clichê do briefing'],
  [/\b(o|a) melhor (sal[aã]o|cl[ií]nica|espa[cç]o|de moema|de s[aã]o paulo)|n[úu]mero 1|refer[eê]ncia em/i, 'superlativo não comprovável'],
  [/tecnologia de ponta|[úu]ltima gera[cç][aã]o/i, 'tecnologia não informada'],
  [/\d+\s*anos de (experi[eê]ncia|mercado|tradi[cç][aã]o)/i, 'tempo de mercado não informado'],
  [/certificad[ao]s?|premiad[ao]s?|pr[eê]mio/i, 'certificação ou prêmio não informado'],
  [/\b\d+(\.\d+)?\s*(mil )?(clientes|atendimentos) (atendid|realizad)/i, 'número de clientes não informado'],
  [/nota \d|★|estrelas no google/i, 'nota de avaliação não informada'],
  [/lorem ipsum/i, 'texto provisório'],
  [/previne|previn(a|e) o c[aâ]ncer|trata(r)? o c[aâ]ncer/i, 'alegação médica (Outubro Rosa)'],
  [/perca (at[ée] )?\d+|emagre[çc]a \d+|\d+\s?kg\b|\d+ quilos|em \d+ (dias|semanas) voc[eê]/i, 'promessa de emagrecimento'],
  [/cura (a |da )?(calv[ií]cie|alopecia|queda)|fim da (calv[ií]cie|queda)|nascer cabelo em/i, 'promessa capilar'],
  [/Rejane( Rabelo)?,? (é |a )?(m[ée]dica|dermatologista)|(m[ée]dica|dermatologista) Rejane/i, 'Dra. Rejane apresentada como médica'],
];
for (const [nome, conteudo] of Object.entries(html)) {
  const texto = textoDe(conteudo);
  for (const [padrao, rotulo] of proibidos) {
    const achado = texto.match(padrao);
    ok(!achado, `${nome}: sem ${rotulo}`, achado?.[0]);
  }
}

/* Preço: só os das assinaturas, como divulgados, e só onde elas aparecem. */
const precosValidos = new Set(assinaturas.planos.map((p) => p.preco));
for (const [nome, conteudo] of Object.entries(html)) {
  const precos = [...textoDe(conteudo).matchAll(/R\$\s?[\d.]+,\d{2}/g)].map((m) => m[0]);
  for (const preco of precos) ok(precosValidos.has(preco), `${nome}: preço "${preco}" é de uma assinatura divulgada`);
  if (precos.length) ok(conteudo.includes('id="assinaturas"'), `${nome}: preço só dentro da seção de assinaturas`);
}
if (assinaturas.mostrarPrecos) {
  for (const plano of assinaturas.planos) {
    ok(html['servicos/index.html'].includes(plano.preco), `serviços: assinatura ${plano.nome} ${plano.preco}`);
  }
}
for (const condicao of assinaturas.condicoes) {
  ok(textoDe(html['index.html']).includes(condicao), `home: condição "${condicao}"`);
}

/* Todos os serviços informados aparecem na página de serviços. */
const textoServicos = textoDe(html['servicos/index.html']);
for (const item of servicosNosDados) ok(textoServicos.includes(item), `serviços: "${item}"`);
for (const cat of servicos) {
  for (const destaque of cat.destaques || []) {
    ok(servicosNosDados.includes(destaque), `destaque "${destaque}" existe nos itens de ${cat.nome}`);
  }
}

/* Estética e saúde capilar: linguagem responsável presente. */
ok(textoDe(html['estetica-avancada/index.html']).includes('avaliação individual'), 'estética: avaliação individual');
ok(textoDe(html['saude-capilar/index.html']).includes('não substitui o acompanhamento com um dermatologista'), 'capilar: aviso do dermatologista');

/* Depoimentos: enquanto não houver avaliação real transcrita, nenhuma citação. */
if (!depoimentos.itens.length) {
  for (const [nome, conteudo] of Object.entries(html)) ok(!/<blockquote/.test(conteudo), `${nome}: sem citação inventada`);
}

/* Outubro Rosa: institucional, com aviso e sem botão de venda. */
if (outubroRosa.ativo) {
  const secao = html['index.html'].match(/<section class="rosa"[\s\S]*?<\/section>/)?.[0] ?? '';
  ok(Boolean(secao), 'home: seção Outubro Rosa');
  ok(textoDe(secao).includes(outubroRosa.aviso), 'Outubro Rosa: aviso de que não substitui acompanhamento médico');
  ok(!secao.includes('wa.me'), 'Outubro Rosa: sem botão de agendamento');
}

/* Telefone: um só, o da casa. O pessoal da Dra. Rejane (que aparece nas artes
   dela) não entra no site. */
for (const [nome, conteudo] of Object.entries(html)) {
  const telefones = [...textoDe(conteudo).matchAll(/\(?\b\d{2}\)?\s?9\d{4}[-\s]?\d{4}\b/g)].map((m) => m[0]);
  for (const tel of telefones) ok(tel === business.whatsapp.display, `${nome}: só o telefone da casa`, tel);
}

/* Antes e depois: aviso do conselho onde houver caso; crédito com registro
   onde houver caso atendido pela Dra. Rejane; nenhum crédito inventado. */
for (const [nome, conteudo] of Object.entries(html)) {
  const presentes = casos.itens.filter((c) => conteudo.includes(`/casos/${c.imagem.arquivo}-`));
  if (!presentes.length) continue;
  const texto = textoDe(conteudo);
  ok(texto.includes(casos.aviso), `${nome}: antes e depois com o aviso do conselho`);
  const creditoDaPagina = nome === 'galeria/index.html' ? casos.creditoFoto : casos.credito;
  if (presentes.some((c) => c.creditado)) {
    ok(texto.includes(creditoDaPagina), `${nome}: antes e depois com o crédito e o registro de quem atendeu`);
  } else {
    ok(!texto.includes(creditoDaPagina), `${nome}: sem crédito em caso que ninguém assinou`);
  }
  for (const c of presentes) {
    const legenda = conteudo.match(new RegExp(`data-lupa="[^"]*/casos/${c.imagem.arquivo}-[^"]*"[^>]*data-lupa-legenda="([^"]*)"`))?.[1] ?? '';
    ok(legenda.includes(casos.aviso), `${nome}: foto ampliada de ${c.imagem.arquivo} leva o aviso`);
  }
}
for (const caso of casos.itens) {
  ok(html['index.html'].includes(`${caso.imagem.arquivo}-`), `home: caso ${caso.imagem.arquivo}`);
}

/* Quem atende: nome, função e registro juntos, e a seção nas páginas certas. */
for (const pagina of ['index.html', 'sobre/index.html', 'saude-capilar/index.html']) {
  const texto = textoDe(html[pagina]);
  ok(html[pagina].includes('id="quem-atende"'), `${pagina}: seção de quem atende`);
  ok(texto.includes(equipe.rejane.funcao) && texto.includes(equipe.rejane.registro.formatado), `${pagina}: função e registro da Dra. Rejane`);
}
const pessoa = blocosDe(html['index.html'])[0]['@graph'].find((n) => n['@type'] === 'Person');
ok(pessoa?.identifier?.propertyID === equipe.rejane.registro.conselho && pessoa?.identifier?.value === equipe.rejane.registro.numero, 'schema: Person com o registro da Dra. Rejane');
ok(salao?.employee?.['@id'] === pessoa?.['@id'], 'schema: Dra. Rejane ligada à Casa EME');

/* Depoimento em vídeo: sem baixar antes do play, com legenda e transcrição. */
const video = depoimentos.itens.find((d) => d.tipo === 'video');
if (video) {
  for (const pagina of ['index.html', 'saude-capilar/index.html']) {
    const conteudo = html[pagina];
    const tag = conteudo.match(/<video\b[^>]*>/)?.[0] ?? '';
    ok(Boolean(tag), `${pagina}: vídeo do depoimento`);
    ok(tag.includes('preload="none"'), `${pagina}: vídeo só baixa no play`);
    ok(/\sposter="\/[^"]+"/.test(tag), `${pagina}: vídeo com capa`);
    ok(/<track kind="captions"[^>]*srclang="pt-BR"[^>]*default/.test(conteudo), `${pagina}: vídeo com legenda`);
    ok(textoDe(conteudo).includes(video.transcricao), `${pagina}: transcrição completa na página`);
    const ld = blocosDe(conteudo).find((b) => b['@type'] === 'VideoObject');
    ok(Boolean(ld), `${pagina}: VideoObject`);
    ok(ld?.contentUrl === `${site.url}${video.video.mp4}`, `${pagina}: VideoObject aponta o arquivo`);
    ok(/^\d{4}-\d{2}-\d{2}/.test(ld?.uploadDate || ''), `${pagina}: VideoObject com data`);
  }
  for (const arquivo of [video.video.mp4, video.video.legendas, ...video.video.capa.larguras.map((l) => `/assets/img/${video.video.capa.pasta}/${video.video.capa.arquivo}-${l}.webp`)]) {
    const existe = await stat(path.join(DIST, arquivo.replace(/^\//, ''))).then(() => true).catch(() => false);
    ok(existe, `arquivo do vídeo publicado: ${arquivo}`);
  }
  const legendas = await readFile(path.join(DIST, video.video.legendas.replace(/^\//, '')), 'utf8');
  ok(legendas.startsWith('WEBVTT'), 'legendas em WebVTT');
}

/* Depoimentos: relato não é promessa. */
for (const pagina of ['index.html', 'saude-capilar/index.html']) {
  ok(textoDe(html[pagina]).includes(destaques.depoimentos.ressalva), `${pagina}: ressalva dos depoimentos`);
}

/* Emagrecimento: aviso de que não substitui o acompanhamento médico. */
ok(textoDe(html['emagrecimento/index.html']).includes('não substituem o acompanhamento médico e nutricional'), 'emagrecimento: aviso do acompanhamento médico');

/* Divergência de horário documentada no código (não escondida). */
const fonteHorario = await readFile(new URL('../src/_data/hours.js', import.meta.url), 'utf8');
ok(fonteHorario.includes('DIVERGÊNCIA CONHECIDA'), 'hours.js registra a divergência com a bio do Instagram');

/* ------------------------------------------------------------- imagens */
console.log('\nImagens');
const publicadas = (await readdir(path.join(DIST, 'assets/img'), { recursive: true })).map((f) => String(f).toLowerCase());
for (const proibida of ['conteudo-ia', 'story', 'logo-perfil', 'manifesto', 'screenshot']) {
  ok(!publicadas.some((f) => f.includes(proibida)), `nada de "${proibida}" publicado em assets/img`);
}

for (const [nome, conteudo] of Object.entries(html)) {
  const referenciadas = new Set([
    ...[...conteudo.matchAll(/<img[^>]*\ssrc="(\/[^"]+)"/g)].map((m) => m[1]),
    ...[...conteudo.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)]
      .flatMap((m) => m[1].split(','))
      .map((parte) => parte.trim().split(/\s+/)[0]),
    ...[...conteudo.matchAll(/data-lupa="(\/[^"]+)"/g)].map((m) => m[1]),
  ]);
  for (const caminho of referenciadas) {
    const existe = await stat(path.join(DIST, caminho.replace(/^\//, ''))).then(() => true).catch(() => false);
    ok(existe, `${nome}: imagem existe — ${caminho}`);
  }

  for (const tag of conteudo.matchAll(/<img\b[^>]*>/g)) {
    const img = tag[0];
    if (img.includes('data-lupa-img')) continue;
    ok(/\swidth="\d+"/.test(img) && /\sheight="\d+"/.test(img), `${nome}: imagem com width e height`, img.slice(0, 90));
    const alt = img.match(/\salt="([^"]*)"/)?.[1];
    ok(alt !== undefined, `${nome}: imagem com alt`, img.slice(0, 90));
    /* alt vazio só para o selo, que é decorativo ao lado do nome escrito. */
    if (alt === '') ok(/favicon\.svg|selo-casa-eme\.svg/.test(img), `${nome}: alt vazio só em imagem decorativa`, img.slice(0, 90));
    else ok(alt.length >= 20 && !/\.(webp|jpe?g|png)/i.test(alt), `${nome}: alt descritivo ("${alt}")`);
  }
}

/* Toda foto declarada na galeria tem arquivo e chega à página da galeria. */
for (const foto of galeria.fotos) {
  ok(html['galeria/index.html'].includes(`${foto.imagem.arquivo}-`), `galeria: ${foto.imagem.arquivo}`);
}

console.log(falhas ? `\n✕ ${falhas} falha(s)\n` : '\n✓ tudo certo\n');
process.exit(falhas ? 1 : 0);
