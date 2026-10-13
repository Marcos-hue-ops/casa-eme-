/**
 * Auditoria no navegador.
 *
 * Sobe o dist/, abre cada página em cada largura da lista e confere o que só
 * dá para saber com a página renderizada: rolagem horizontal, erro de console,
 * violação de CSP, alvo de toque pequeno demais, imagem sem dimensão, ordem de
 * títulos e link interno quebrado. Com o Google Analytics no build, também o
 * caminho inteiro do aviso de cookies (nada do Google antes do "Aceitar").
 *
 * Sai com código 1 se achar qualquer coisa — serve para rodar antes de publicar.
 */
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const EXECUTAVEL = process.env.CHROMIUM || '/opt/pw-browsers/chromium';
const PORTA = 4398;
const BASE = `http://127.0.0.1:${PORTA}`;

const PAGINAS = [
  '/',
  '/sobre/',
  '/servicos/',
  '/estetica-avancada/',
  '/saude-capilar/',
  '/emagrecimento/',
  '/galeria/',
  '/perguntas-frequentes/',
  '/contato/',
  '/privacidade/',
  '/404.html',
];
const LARGURAS = [320, 375, 390, 430, 768, 1024, 1440, 1920];

const problemas = [];
const anota = (onde, o_que) => problemas.push(`${onde} — ${o_que}`);

const servidor = spawn(process.execPath, ['tools/serve.js'], {
  env: { ...process.env, PORT: String(PORTA) },
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 700));

const navegador = await chromium.launch({ executablePath: EXECUTAVEL });

/* ---------------------------------------------------------------- estrutura */
{
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await contexto.newPage();

  for (const url of PAGINAS) {
    const erros = [];
    pagina.on('console', (msg) => {
      if (msg.type() === 'error') erros.push(msg.text());
    });
    pagina.on('pageerror', (e) => erros.push(String(e)));

    await pagina.addInitScript(() => {
      window.__violacoes = [];
      document.addEventListener('securitypolicyviolation', (e) =>
        window.__violacoes.push(`${e.violatedDirective} ${e.blockedURI || ''}`)
      );
    });
    const resposta = await pagina.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
    const esperado = url === '/404.html' ? 200 : 200;
    if (!resposta || resposta.status() !== esperado) anota(url, `resposta ${resposta?.status()}`);
    const violacoes = await pagina.evaluate(() => window.__violacoes || []);
    violacoes.forEach((v) => anota(url, `violação de CSP: ${v}`));

    const relatorio = await pagina.evaluate(() => {
      const r = { h1: 0, ordem: [], semAlt: [], semDimensao: [], links: [], ancoras: [], idsRepetidos: [], jsonld: [] };

      r.h1 = document.querySelectorAll('h1').length;

      let anterior = 0;
      document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
        const nivel = Number(h.tagName[1]);
        if (anterior && nivel > anterior + 1) r.ordem.push(`${h.tagName} depois de H${anterior}: "${h.textContent.trim().slice(0, 40)}"`);
        anterior = nivel;
      });

      document.querySelectorAll('img').forEach((img) => {
        /* A imagem do diálogo de ampliação nasce sem src: ela é preenchida no
           clique. Cobrar dimensão dela seria cobrar de uma imagem que não existe. */
        if (!img.hasAttribute('src')) return;
        if (img.alt === null || img.alt === undefined) r.semAlt.push(img.src);
        if (!img.getAttribute('width') || !img.getAttribute('height')) r.semDimensao.push(img.src);
      });

      document.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href');
        if (href.startsWith('/') ) r.links.push(href);
        if (href.startsWith('#') && href.length > 1) r.ancoras.push(href);
        if (!a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('.so-leitor')) {
          r.links.push(`SEM-TEXTO:${href}`);
        }
      });

      const vistos = new Set();
      document.querySelectorAll('[id]').forEach((el) => {
        if (vistos.has(el.id)) r.idsRepetidos.push(el.id);
        vistos.add(el.id);
      });

      document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
        try { JSON.parse(s.textContent); r.jsonld.push('ok'); }
        catch (e) { r.jsonld.push(`INVÁLIDO: ${e.message}`); }
      });

      return r;
    });

    if (relatorio.h1 !== 1) anota(url, `${relatorio.h1} elemento(s) h1 (deve ser 1)`);
    relatorio.ordem.forEach((o) => anota(url, `salto de título: ${o}`));
    relatorio.semAlt.forEach((s) => anota(url, `imagem sem alt: ${s}`));
    relatorio.semDimensao.forEach((s) => anota(url, `imagem sem width/height: ${s}`));
    relatorio.idsRepetidos.forEach((i) => anota(url, `id repetido: ${i}`));
    relatorio.jsonld.filter((j) => j !== 'ok').forEach((j) => anota(url, `JSON-LD ${j}`));
    relatorio.links.filter((l) => l.startsWith('SEM-TEXTO')).forEach((l) => anota(url, `link sem nome acessível: ${l}`));

    for (const ancora of new Set(relatorio.ancoras)) {
      const existe = await pagina.evaluate((a) => Boolean(document.querySelector(a)), ancora);
      if (!existe) anota(url, `âncora sem destino: ${ancora}`);
    }

    for (const link of new Set(relatorio.links.filter((l) => l.startsWith('/')))) {
      const alvo = await pagina.request.get(`${BASE}${link}`);
      if (alvo.status() >= 400) anota(url, `link interno quebrado: ${link} (${alvo.status()})`);
    }

    erros.forEach((e) => anota(url, `console: ${e.slice(0, 160)}`));
    pagina.removeAllListeners('console');
    pagina.removeAllListeners('pageerror');
  }
  await contexto.close();
}

/* ------------------------------------------------- larguras e alvos de toque */
for (const largura of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    isMobile: largura < 768,
    hasTouch: largura < 768,
  });
  const pagina = await contexto.newPage();

  for (const url of PAGINAS) {
    await pagina.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });

    const largo = await pagina.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    if (largo > 1) anota(`${url} @${largura}`, `rolagem horizontal de ${largo}px`);

    /**
     * Alvos de toque. Duas réguas, porque as regras são duas:
     *
     * • 24px para qualquer alvo — é o mínimo do WCAG 2.2 (2.5.8, nível AA);
     * • 44px para o que é ação de verdade — botão, item de menu, pergunta do
     *   FAQ, barra fixa —, que é a régua do nível AAA e a que importa para a
     *   conversão: o botão do WhatsApp errado no polegar é uma consulta a
     *   menos.
     *
     * Link dentro de frase fica de fora nas duas: o próprio WCAG o isenta, e
     * engordá-lo quebraria a entrelinha do parágrafo.
     */
    if (largura < 768) {
      const medidos = await pagina.$$eval('a, button, summary', (els) => {
        const ACOES =
          '.btn, .wa-fixo, .menu-btn, .painel__link, .faq__p, .link-seta, .nav__link, .atalho, .filtro, .indice__link, .lupa__passo, .lupa__fechar';
        return els
          .filter((el) => el.getClientRects().length)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              t: (el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 34),
              h: r.height,
              inline: getComputedStyle(el).display === 'inline',
              acao: Boolean(el.closest(ACOES)) || el.matches(ACOES) || el.tagName === 'SUMMARY',
            };
          })
          .filter((x) => x.h > 0 && !x.inline);
      });

      medidos
        .filter((x) => x.h < 24)
        .forEach((x) => anota(`${url} @${largura}`, `alvo abaixo de 24px (${Math.round(x.h)}px): "${x.t}"`));

      medidos
        .filter((x) => x.acao && x.h >= 24 && x.h < 44)
        .forEach((x) => anota(`${url} @${largura}`, `ação abaixo de 44px (${Math.round(x.h)}px): "${x.t}"`));
    }
  }
  await contexto.close();
}

/* ------------------------------------------------------------- contraste */
/**
 * Contraste de texto, medido na página renderizada.
 *
 * Percorre cada elemento que tem texto próprio, resolve a cor de fundo subindo
 * a árvore até achar uma opaca e calcula a razão da WCAG. O limite segue a
 * norma: 3:1 para texto grande (24px, ou 18,66px em peso 700) e 4,5:1 para o
 * resto. Elemento decorativo (`aria-hidden`) fica de fora — o monograma da
 * moldura e o número gigante de seção não são lidos por ninguém.
 *
 * Medir vale mais do que calcular à mão: a faixa escura troca as variáveis de
 * cor em bloco, e é exatamente aí que um par passa despercebido.
 */
{
  const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await contexto.newPage();

  for (const url of PAGINAS) {
    await pagina.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });

    const fracos = await pagina.evaluate(() => {
      const canal = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      const luminancia = ([r, g, b]) =>
        0.2126 * canal(r / 255) + 0.7152 * canal(g / 255) + 0.0722 * canal(b / 255);
      const razao = (a, b) => {
        const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
        return (x + 0.05) / (y + 0.05);
      };
      const rgb = (valor) => {
        const n = valor.match(/[\d.]+/g)?.map(Number);
        return n && n.length >= 3 ? { cor: n.slice(0, 3), alfa: n[3] ?? 1 } : null;
      };

      /* Sobe a árvore até achar um fundo opaco; o padrão é o fundo do corpo. */
      const fundoDe = (el) => {
        for (let no = el; no && no !== document.documentElement; no = no.parentElement) {
          const f = rgb(getComputedStyle(no).backgroundColor);
          if (f && f.alfa >= 0.95) return f.cor;
        }
        const corpo = rgb(getComputedStyle(document.body).backgroundColor);
        return corpo ? corpo.cor : [255, 255, 255];
      };

      const achados = [];
      document.querySelectorAll('body *').forEach((el) => {
        if (el.closest('[aria-hidden="true"], .so-leitor, dialog, [inert]')) return;
        if (!el.getClientRects().length) return;

        const texto = [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent.trim())
          .join(' ')
          .trim();
        if (!texto) return;

        const estilo = getComputedStyle(el);
        const frente = rgb(estilo.color);
        if (!frente || frente.alfa < 0.95) return;

        const px = parseFloat(estilo.fontSize);
        const peso = Number(estilo.fontWeight) || 400;
        const grande = px >= 24 || (px >= 18.66 && peso >= 700);
        const minimo = grande ? 3 : 4.5;

        const r = razao(frente.cor, fundoDe(el));
        if (r < minimo) {
          achados.push({
            seletor: el.className || el.tagName,
            texto: texto.slice(0, 38),
            razao: Math.round(r * 100) / 100,
            minimo,
            px: Math.round(px),
          });
        }
      });
      return achados;
    });

    fracos.forEach((f) =>
      anota(url, `contraste ${f.razao}:1 (mín. ${f.minimo}) em ${f.px}px — "${f.texto}" [${f.seletor}]`)
    );
  }
  await contexto.close();
}

/* ------------------------------------------------- imagens com movimento */
/**
 * As animações de entrada não podem esconder conteúdo.
 *
 * Existe por causa de um erro real: o recorte de revelação estava no próprio
 * elemento observado, e um elemento com área visível zero nunca é reportado
 * como visível pelo IntersectionObserver — `.is-vis` não chegava, o recorte
 * não abria e as imagens, por serem `loading="lazy"`, nem eram baixadas. O
 * site ficava sem imagem nenhuma para quem não pede movimento reduzido, e as
 * capturas de tela não mostravam nada porque rodavam justamente em modo
 * reduzido.
 *
 * Este passo rola a página inteira com o movimento ligado e cobra que cada
 * imagem tenha sido carregada e esteja de fato desenhada.
 */
{
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
  });
  const pagina = await contexto.newPage();

  for (const url of PAGINAS) {
    await pagina.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });

    const altura = await pagina.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < altura; y += 700) {
      await pagina.evaluate((v) => window.scrollTo(0, v), y);
      await pagina.waitForTimeout(120);
    }
    await pagina.waitForTimeout(1100);

    const relatorio = await pagina.evaluate(() => {
      const problemas = [];

      document.querySelectorAll('img[src]').forEach((img) => {
        const nome = (img.getAttribute('src') || '').split('/').pop();
        if (!img.complete || img.naturalWidth === 0) {
          problemas.push(`imagem não carregou: ${nome}`);
          return;
        }
        const r = img.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) problemas.push(`imagem com caixa zerada: ${nome}`);

        /* Recorte ainda fechado depois de a página inteira ter passado pela
           tela: é exatamente a assinatura do erro descrito acima. */
        for (let no = img; no && no !== document.body; no = no.parentElement) {
          const clip = getComputedStyle(no).clipPath;
          if (clip && clip !== 'none' && /inset\([^)]*\b(100%|99(\.\d+)?%)/.test(clip)) {
            problemas.push(`recorte de revelação não abriu sobre ${nome} (${clip})`);
            break;
          }
        }
      });

      document.querySelectorAll('.reveal').forEach((el) => {
        if (!el.classList.contains('is-vis')) {
          problemas.push(
            `elemento de entrada nunca revelado: .${[...el.classList].filter((c) => c !== 'reveal').join('.') || el.tagName}`
          );
        }
      });

      return problemas;
    });

    [...new Set(relatorio)].forEach((p) => anota(`${url} (movimento ligado)`, p));
  }
  await contexto.close();
}

/* ---------------------------------------------- consentimento de cookies */
/**
 * Só roda quando o dist/ foi gerado com um ID do GA4 (o ID vem do próprio
 * HTML, não do ambiente: testa o que vai ser publicado).
 *
 * Os pedidos ao Google são interceptados e respondidos aqui — nenhum dado
 * sai de verdade e o teste não depende de rede. O gtag.js de mentira só
 * marca que foi baixado; o que importa é QUANDO ele é pedido e o que o site
 * pôs no dataLayer.
 */
const ga4 = (await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')).match(/data-ga4="([^"]+)"/)?.[1];
if (ga4) {
  const onde = 'consentimento';
  const GOOGLE = /^https:\/\/([a-z0-9-]+\.)*(googletagmanager\.com|google-analytics\.com|analytics\.google\.com)\//;
  const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  let pedidos = [];
  await contexto.route(GOOGLE, (rota) => {
    const url = rota.request().url();
    pedidos.push(url);
    const gtag = url.startsWith('https://www.googletagmanager.com/gtag/js');
    return rota.fulfill({ status: gtag ? 200 : 204, contentType: 'text/javascript', body: gtag ? 'window.__gtagBaixado = (window.__gtagBaixado || 0) + 1;' : '' });
  });
  await contexto.addInitScript(() => {
    window.__violacoes = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__violacoes.push(`${e.violatedDirective} ${e.blockedURI || ''}`));
  });
  const pagina = await contexto.newPage();
  const erros = [];
  pagina.on('console', (msg) => msg.type() === 'error' && erros.push(msg.text()));
  pagina.on('pageerror', (e) => erros.push(String(e)));

  const aviso = '[data-cookies]';
  const visivel = () => pagina.isVisible(aviso);
  const camadas = () =>
    pagina.evaluate(() => (window.dataLayer || []).map((item) => Array.from(item)));
  const pedidosGtag = () => pedidos.filter((u) => u.startsWith('https://www.googletagmanager.com/gtag/js'));
  const escolhaGuardada = () =>
    pagina.evaluate(() => JSON.parse(localStorage.getItem('casa-eme:cookies') || 'null')?.escolha ?? null);

  /* 1. Primeira visita: o aviso aparece e nada do Google é pedido. */
  await pagina.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  if (!(await visivel())) anota(onde, 'o aviso não aparece na primeira visita');
  if (pedidos.length) anota(onde, `pedido ao Google antes de qualquer escolha: ${pedidos[0]}`);
  if ((await camadas()).length) anota(onde, 'dataLayer preenchido antes de qualquer escolha');

  /* O botão fixo do WhatsApp não pode ficar por baixo do aviso no celular. */
  await pagina.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
  await pagina.waitForTimeout(700);
  const cobre = await pagina.evaluate(() => {
    const a = document.querySelector('[data-cookies]').getBoundingClientRect();
    const w = document.querySelector('[data-wa-fixo]').getBoundingClientRect();
    return w.bottom > a.top + 1;
  });
  if (cobre) anota(onde, 'o aviso cobre o botão fixo do WhatsApp no celular');

  /* 2. Recusar: o aviso some, a escolha fica, e a página seguinte não pede nada. */
  await pagina.click('[data-cookies-recusar]');
  if (await visivel()) anota(onde, 'o aviso não fecha ao recusar');
  if ((await escolhaGuardada()) !== 'recusado') anota(onde, 'a recusa não foi guardada');
  await pagina.goto(`${BASE}/servicos/`, { waitUntil: 'networkidle' });
  if (await visivel()) anota(onde, 'o aviso volta depois de recusado');
  if (pedidos.length) anota(onde, `pedido ao Google depois de recusar: ${pedidos[0]}`);

  /* 3. Rever pelo rodapé e aceitar: o gtag.js é pedido uma vez, com o ID certo,
        e o foco volta ao botão de onde a pessoa saiu. */
  await pagina.click('.rodape [data-cookies-abrir]');
  if (!(await visivel())) anota(onde, '"Preferências de cookies" não reabre o aviso');
  if (!(await pagina.evaluate(() => document.activeElement?.matches('[data-cookies]'))))
    anota(onde, 'o foco não vai para o aviso reaberto');
  if (!(await pagina.textContent('[data-cookies-estado]'))?.includes('recusou'))
    anota(onde, 'o aviso reaberto não mostra a escolha atual');
  await pagina.click('[data-cookies-aceitar]');
  await pagina.waitForFunction(() => window.__gtagBaixado === 1, null, { timeout: 5000 }).catch(() => {});
  if (pedidosGtag().length !== 1) anota(onde, `gtag.js pedido ${pedidosGtag().length} vez(es) depois do aceite (esperado: 1)`);
  else if (!pedidosGtag()[0].endsWith(`?id=${ga4}`)) anota(onde, `gtag.js pedido com outro ID: ${pedidosGtag()[0]}`);
  if (!(await pagina.evaluate(() => document.activeElement?.matches('.rodape [data-cookies-abrir]'))))
    anota(onde, 'o foco não volta ao botão de preferências');

  const conferirCamadas = async (pagina_) => {
    const itens = await camadas();
    const padrao = itens.find(([c, t]) => c === 'consent' && t === 'default')?.[2];
    if (!padrao || padrao.analytics_storage !== 'granted' || padrao.ad_storage !== 'denied' || padrao.ad_user_data !== 'denied' || padrao.ad_personalization !== 'denied')
      anota(`${onde} ${pagina_}`, `consentimento padrão inesperado: ${JSON.stringify(padrao)}`);
    const configs = itens.filter(([c, alvo]) => c === 'config' && alvo === ga4);
    if (configs.length !== 1) anota(`${onde} ${pagina_}`, `${configs.length} config(s) do GA4 (esperado: 1 — uma visualização por página)`);
    const opcoes = configs[0]?.[2] || {};
    if (opcoes.allow_google_signals !== false || opcoes.allow_ad_personalization_signals !== false)
      anota(`${onde} ${pagina_}`, `Google Signals ou personalização de anúncios ligados: ${JSON.stringify(opcoes)}`);
  };
  await conferirCamadas('/servicos/');

  /* 4. Página seguinte, já aceito: o GA4 carrega sozinho, uma vez, sem aviso. */
  pedidos = [];
  await pagina.goto(`${BASE}/contato/`, { waitUntil: 'networkidle' });
  if (await visivel()) anota(onde, 'o aviso volta depois de aceito');
  if (pedidosGtag().length !== 1) anota(onde, `gtag.js pedido ${pedidosGtag().length} vez(es) na página seguinte (esperado: 1)`);
  await conferirCamadas('/contato/');

  /* 5. Voltar atrás: o envio é cortado na hora e os cookies do GA4 somem. */
  await pagina.evaluate((id) => {
    document.cookie = '_ga=GA1.1.111.222; path=/';
    document.cookie = `_ga_${id.slice(2)}=GS1.1.333; path=/`;
  }, ga4);
  await pagina.click('.rodape [data-cookies-abrir]');
  /* Com escolha feita, o Esc fecha sem mudar nada. */
  await pagina.keyboard.press('Escape');
  if (await visivel()) anota(onde, 'o Esc não fecha o aviso reaberto');
  await pagina.click('.rodape [data-cookies-abrir]');
  await pagina.click('[data-cookies-recusar]');
  const depois = await pagina.evaluate((id) => ({
    desligado: window[`ga-disable-${id}`] === true,
    cookies: document.cookie,
    atualizacao: (window.dataLayer || []).map((i) => Array.from(i)).some(([c, t, v]) => c === 'consent' && t === 'update' && v?.analytics_storage === 'denied'),
  }), ga4);
  if (!depois.desligado) anota(onde, 'recusar depois de aceitar não corta o envio (ga-disable)');
  if (!depois.atualizacao) anota(onde, 'recusar depois de aceitar não atualiza o consentimento para denied');
  if (/(^|;\s*)_ga/.test(depois.cookies)) anota(onde, `cookies do GA4 continuam depois da recusa: ${depois.cookies}`);
  if ((await escolhaGuardada()) !== 'recusado') anota(onde, 'a nova recusa não foi guardada');

  /* 5b. Recusa feita em outra aba desliga esta, que continua aberta. */
  await pagina.click('.rodape [data-cookies-abrir]');
  await pagina.click('[data-cookies-aceitar]');
  const outraAba = await contexto.newPage();
  await outraAba.goto(`${BASE}/sobre/`, { waitUntil: 'networkidle' });
  await outraAba.click('.rodape [data-cookies-abrir]');
  await outraAba.click('[data-cookies-recusar]');
  await pagina.waitForFunction((id) => window[`ga-disable-${id}`] === true, ga4, { timeout: 3000 }).catch(() => {});
  if (!(await pagina.evaluate((id) => window[`ga-disable-${id}`] === true, ga4)))
    anota(onde, 'recusar em outra aba não desliga o GA4 na aba que já estava aberta');
  await outraAba.close();

  pedidos = [];
  await pagina.goto(`${BASE}/privacidade/`, { waitUntil: 'networkidle' });
  if (pedidos.length) anota(onde, `pedido ao Google depois de voltar atrás: ${pedidos[0]}`);
  /* O botão da própria política também reabre o aviso. */
  await pagina.click('.prosa [data-cookies-abrir]');
  if (!(await visivel())) anota(onde, '"Rever minha escolha", na privacidade, não reabre o aviso');

  /* 6. Escolha vencida: depois do prazo, a pergunta volta e nada carrega antes. */
  await pagina.evaluate(() =>
    localStorage.setItem('casa-eme:cookies', JSON.stringify({ escolha: 'aceito', versao: 1, data: '2000-01-01T00:00:00.000Z' }))
  );
  pedidos = [];
  await pagina.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  if (!(await visivel())) anota(onde, 'escolha vencida não faz o aviso voltar');
  if (pedidos.length) anota(onde, 'escolha vencida ainda carrega o GA4');

  const violacoes = await pagina.evaluate(() => window.__violacoes || []);
  violacoes.forEach((v) => anota(onde, `violação de CSP: ${v}`));
  erros.forEach((e) => anota(onde, `console: ${e.slice(0, 160)}`));

  /* 7. No fim da página, em qualquer largura, o botão fixo do WhatsApp não
        cobre "Preferências de cookies" — é o caminho para voltar atrás. */
  for (const largura of LARGURAS) {
    const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, isMobile: largura < 768, hasTouch: largura < 768 });
    await ctx.route(GOOGLE, (rota) => rota.fulfill({ status: 204, body: '' }));
    await ctx.addInitScript(() =>
      localStorage.setItem('casa-eme:cookies', JSON.stringify({ escolha: 'recusado', versao: 1, data: new Date().toISOString() }))
    );
    const p = await ctx.newPage();
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(700);
    const coberto = await p.evaluate(() => {
      const botao = document.querySelector('.rodape [data-cookies-abrir]');
      const r = botao.getBoundingClientRect();
      return [r.left + 2, r.left + r.width / 2, r.right - 2].some((x) => !botao.contains(document.elementFromPoint(x, r.top + r.height / 2)));
    });
    if (coberto) anota(`${onde} @${largura}`, '"Preferências de cookies" coberto no fim da página');
    await ctx.close();
  }

  /* 7b. Com o aviso ainda aberto: no celular o botão fixo do WhatsApp aparece
         acima dele; no fim da página nada do rodapé fica por baixo dele; com
         zoom de 400% (320×256) o título continua na tela; no celular deitado
         o botão fixo não sobe para baixo do cabeçalho. */
  for (const [largura, altura, url] of [[320, 568, '/contato/'], [375, 667, '/'], [768, 1024, '/contato/'], [320, 256, '/'], [568, 320, '/servicos/']]) {
    const ctx = await navegador.newContext({ viewport: { width: largura, height: altura }, isMobile: largura < 768, hasTouch: largura < 768 });
    await ctx.route(GOOGLE, (rota) => rota.fulfill({ status: 204, body: '' }));
    const p = await ctx.newPage();
    const aqui = `${onde} ${url} @${largura}×${altura}`;
    await p.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const aviso = document.querySelector('[data-cookies]').getBoundingClientRect();
      const wa = document.querySelector('[data-wa-fixo]');
      const estiloWa = getComputedStyle(wa);
      return {
        topoAviso: aviso.top,
        waVisivel: estiloWa.visibility === 'visible' && Number(estiloWa.opacity) > 0.9,
        waTopo: wa.getBoundingClientRect().top,
        cab: document.querySelector('.cab')?.getBoundingClientRect().bottom ?? 0,
      };
    });
    if (largura < 768 && altura > 400 && !r.waVisivel) anota(aqui, 'aviso aberto no celular sem o botão fixo do WhatsApp');
    if (r.topoAviso < 0) anota(aqui, `o aviso passa da altura da tela (começa em ${Math.round(r.topoAviso)}px)`);
    if (r.waVisivel && r.waTopo < r.cab) anota(aqui, 'o botão fixo do WhatsApp subiu para baixo do cabeçalho');
    if (altura > 400) {
      await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await p.waitForTimeout(700);
      const cobertos = await p.evaluate(() =>
        [...document.querySelectorAll('.rodape__base a, .rodape__base button')]
          .filter((el) => el.getClientRects().length)
          .filter((el) => {
            const b = el.getBoundingClientRect();
            return document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)?.closest('[data-cookies]');
          })
          .map((el) => el.textContent.trim())
      );
      if (cobertos.length) anota(aqui, `no fim da página, o aviso cobre: ${cobertos.join(', ')}`);
    }
    await ctx.close();
  }

  /* 8. Sem JavaScript: nem aviso, nem botão de preferências, nem Google. */
  const semJs = await navegador.newContext({ javaScriptEnabled: false });
  const pedidosSemJs = [];
  await semJs.route(GOOGLE, (rota) => (pedidosSemJs.push(rota.request().url()), rota.abort()));
  const paginaSemJs = await semJs.newPage();
  await paginaSemJs.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  if (await paginaSemJs.isVisible(aviso)) anota(`${onde} sem JS`, 'o aviso aparece sem JavaScript');
  if (await paginaSemJs.isVisible('.rodape [data-cookies-abrir]')) anota(`${onde} sem JS`, 'o botão de preferências aparece sem JavaScript');
  if (pedidosSemJs.length) anota(`${onde} sem JS`, `pedido ao Google: ${pedidosSemJs[0]}`);
  await semJs.close();

  await contexto.close();
  console.log(`qa: consentimento de cookies conferido (${ga4})`);
}

await navegador.close();
servidor.kill();

if (problemas.length) {
  console.error(`\nqa: ${problemas.length} problema(s)\n`);
  problemas.forEach((p) => console.error(`  • ${p}`));
  process.exit(1);
}
console.log('qa: sem problemas');
