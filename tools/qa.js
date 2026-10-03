/**
 * Auditoria no navegador.
 *
 * Sobe o dist/, abre cada página em cada largura da lista e confere o que só
 * dá para saber com a página renderizada: rolagem horizontal, erro de console,
 * violação de CSP, alvo de toque pequeno demais, imagem sem dimensão, ordem de
 * títulos e link interno quebrado.
 *
 * Sai com código 1 se achar qualquer coisa — serve para rodar antes de publicar.
 */
import { spawn } from 'node:child_process';
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

await navegador.close();
servidor.kill();

if (problemas.length) {
  console.error(`\nqa: ${problemas.length} problema(s)\n`);
  problemas.forEach((p) => console.error(`  • ${p}`));
  process.exit(1);
}
console.log('qa: sem problemas');
