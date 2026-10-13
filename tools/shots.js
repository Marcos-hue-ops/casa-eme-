/**
 * Captura de tela para conferência visual. Sobe o servidor estático, abre cada
 * página nas larguras que importam e grava os PNGs em .shots/ (fora do git).
 *
 * Uso: node tools/shots.js [largura...]  — sem argumentos, usa a lista padrão.
 */
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const EXECUTAVEL = process.env.CHROMIUM || '/opt/pw-browsers/chromium';
const PORTA = 4399;
const BASE = `http://127.0.0.1:${PORTA}`;

const PAGINAS = [
  ['home', '/'],
  ['sobre', '/sobre/'],
  ['servicos', '/servicos/'],
  ['estetica', '/estetica-avancada/'],
  ['capilar', '/saude-capilar/'],
  ['emagrecimento', '/emagrecimento/'],
  ['galeria', '/galeria/'],
  ['faq', '/perguntas-frequentes/'],
  ['contato', '/contato/'],
  ['privacidade', '/privacidade/'],
  ['404', '/404.html'],
];

/* `node tools/shots.js 390 1440 -- home sobre` captura só as páginas pedidas. */
const separador = process.argv.indexOf('--');
const so = separador > -1 ? process.argv.slice(separador + 1) : [];

const LARGURAS = process.argv.slice(2, separador > -1 ? separador : undefined).map(Number).filter(Boolean);
const PADRAO = [390, 768, 1440];

const servidor = spawn(process.execPath, ['tools/serve.js'], {
  env: { ...process.env, PORT: String(PORTA) },
  stdio: 'ignore',
});

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
await esperar(600);

await mkdir(new URL('../.shots/', import.meta.url), { recursive: true });

const navegador = await chromium.launch({ executablePath: EXECUTAVEL });

for (const largura of LARGURAS.length ? LARGURAS : PADRAO) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: Math.round(largura * 1.6) },
    deviceScaleFactor: 1,
    /* As animações de entrada dependem de rolagem; para a captura, o modo
       reduzido entrega a página no estado final sem esperar. */
    reducedMotion: 'reduce',
  });
  const pagina = await contexto.newPage();

  for (const [nome, url] of PAGINAS.filter(([n]) => !so.length || so.includes(n))) {
    await pagina.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready);

    /* Rola a página inteira antes de capturar. `fullPage` desenha tudo, mas
       não rola — e imagem `loading="lazy"` abaixo da dobra só é baixada quando
       chega perto da tela. Sem isto, a captura mostra a página com buracos no
       lugar das fotos e o erro parece ser do site. */
    await pagina.evaluate(async () => {
      const altura = document.documentElement.scrollHeight;
      for (let y = 0; y < altura; y += window.innerHeight * 0.8) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await pagina.evaluate(() =>
      Promise.all(
        [...document.images]
          .filter((img) => !img.complete)
          .map((img) => new Promise((r) => { img.onload = img.onerror = r; }))
      )
    );
    await esperar(320);

    await pagina.screenshot({
      path: `.shots/${nome}-${largura}.png`,
      fullPage: true,
    });
  }
  await contexto.close();
  console.log(`shots: ${largura}px`);
}

await navegador.close();
servidor.kill();
