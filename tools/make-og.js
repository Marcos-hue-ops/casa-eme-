/**
 * Cartão social (Open Graph), 1200×630.
 *
 * Desenhado em HTML com a tipografia, a paleta, o selo e a "janela" redonda
 * do próprio site, renderizado pelo Chromium e salvo em JPEG. O link do site
 * vai circular sobretudo no WhatsApp e no Instagram: o cartão precisa dizer,
 * de longe, quem é, o que faz e onde fica.
 *
 * O cartão não afirma nada além do que a página afirma.
 *
 * Uso: npm run og
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const RAIZ = new URL('../', import.meta.url);
const EXECUTAVEL = process.env.CHROMIUM || '/opt/pw-browsers/chromium';

const base64 = async (caminho) => (await readFile(new URL(caminho, RAIZ))).toString('base64');

const [serifa, sans, selo] = await Promise.all([
  base64('src/assets/fonts/baskervville-latin.woff2'),
  base64('src/assets/fonts/hanken-grotesk-latin.woff2'),
  base64('src/assets/img/marca/selo-casa-eme.svg'),
]);

const janela = (
  await sharp(fileURLToPath(new URL('src/assets/img/janela/ondas-caramelo-357.webp', RAIZ)))
    .jpeg({ quality: 92 })
    .toBuffer()
).toString('base64');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Baskervville'; src: url(data:font/woff2;base64,${serifa}) format('woff2'); font-weight: 400 700; }
  @font-face { font-family: 'Hanken Grotesk'; src: url(data:font/woff2;base64,${sans}) format('woff2'); font-weight: 300 700; }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background: #fbf7f1; color: #2a1e14; font-family: 'Hanken Grotesk', sans-serif;
  }
  /* A moldura dupla dos posts da casa. */
  .moldura { position: absolute; inset: 26px; border: 1.5px solid #74501c; }
  .moldura::before { content: ''; position: absolute; inset: 7px; border: 1px solid #c4ab8c; }
  .conteudo { position: absolute; inset: 70px 90px; display: flex; align-items: center; gap: 70px; }
  .texto { flex: 1; }
  .sobre { font-size: 17px; font-weight: 500; letter-spacing: .24em; text-transform: uppercase; color: #5c5244; }
  .nome { font-family: 'Baskervville', serif; font-weight: 600; font-size: 86px; line-height: 1; letter-spacing: .1em; white-space: nowrap;
          text-transform: uppercase; color: #74501c; margin-top: 26px; }
  .slogan { font-size: 18px; font-weight: 500; letter-spacing: .26em; text-transform: uppercase; color: #5c5244; margin-top: 22px; }
  .slogan i { font-style: normal; color: #af8b2b; margin: 0 .4em; }
  .fio { width: 72px; height: 2px; background: #74501c; margin-top: 30px; }
  .lema { font-family: 'Baskervville', serif; font-size: 44px; line-height: 1.1; margin-top: 28px; }
  .lema em { color: #74501c; white-space: nowrap; }
  .end { font-size: 19px; color: #5c5244; margin-top: 22px; }
  .visual { position: relative; width: 330px; height: 330px; flex: none; }
  .visual svg { position: absolute; inset: 0; width: 100%; height: 100%; fill: none; stroke: #74501c; stroke-width: .9; }
  .foto { position: absolute; inset: 9%; border-radius: 50%; overflow: hidden; }
  .foto img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .selo { position: absolute; left: -26px; bottom: -18px; width: 132px; height: 132px; border-radius: 50%; background: #fbf7f1; padding: 8px; }
  .selo img { width: 100%; height: 100%; display: block; }
</style></head>
<body>
  <div class="moldura"></div>
  <div class="conteudo">
    <div class="texto">
      <p class="sobre">Nova gestão · Moema, São Paulo</p>
      <h1 class="nome">Casa EME</h1>
      <p class="slogan">Beleza<i>|</i>Estética avançada<i>|</i>Saúde capilar</p>
      <div class="fio"></div>
      <p class="lema">Uma nova experiência <em>em Moema.</em></p>
      <p class="end">Rua Pintassilgo, 457 · Agendamento pelo WhatsApp</p>
    </div>
    <div class="visual">
      <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="98"/><circle cx="100" cy="100" r="88"/></svg>
      <div class="foto"><img src="data:image/jpeg;base64,${janela}" alt=""></div>
      <div class="selo"><img src="data:image/svg+xml;base64,${selo}" alt=""></div>
    </div>
  </div>
</body></html>`;

const navegador = await chromium.launch({ executablePath: EXECUTAVEL });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await pagina.setContent(html, { waitUntil: 'load' });
await pagina.evaluate(() => document.fonts.ready);
const png = await pagina.screenshot({ type: 'png' });
await navegador.close();

const destino = fileURLToPath(new URL('src/assets/img/og-casa-eme.jpg', RAIZ));
const { size } = await sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile(destino);
console.log(`og: src/assets/img/og-casa-eme.jpg — 1200×630, ${Math.round(size / 1024)} KB`);
