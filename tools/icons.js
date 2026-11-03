/**
 * Gera os ícones PNG a partir dos desenhos da marca.
 *
 *  • favicon-32.png        ← src/static/favicon.svg (o M no anel duplo)
 *  • apple-touch-icon.png  ← tools/marca/selo-icone.svg (o selo com o nome)
 *  • icon-192 / icon-512   ← o mesmo selo
 *  • icon-512-maskable     ← o selo dentro da área segura do Android
 *
 * Roda sob demanda (`npm run icons`), não a cada build: o desenho muda uma vez
 * por projeto.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = new URL('../', import.meta.url);
const STATIC = fileURLToPath(new URL('src/static/', RAIZ));

const favicon = await readFile(new URL('src/static/favicon.svg', RAIZ));
const selo = await readFile(new URL('tools/marca/selo-icone.svg', RAIZ));

const raster = (svg, tamanho) => sharp(svg, { density: 600 }).resize(tamanho, tamanho).png().toBuffer();

await writeFile(`${STATIC}favicon-32.png`, await raster(favicon, 32));
console.log('icons: favicon-32.png');

for (const [arquivo, tamanho] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await writeFile(`${STATIC}${arquivo}`, await raster(selo, tamanho));
  console.log(`icons: ${arquivo}`);
}

/* O Android recorta o ícone "maskable" em formas variadas: o selo precisa
   caber nos 80% centrais, sobre o creme da marca. */
const interno = Math.round(512 * 0.78);
const maskable = await sharp({
  create: { width: 512, height: 512, channels: 4, background: '#F3E6D6' },
})
  .composite([{ input: await raster(selo, interno), gravity: 'center' }])
  .png()
  .toBuffer();
await writeFile(`${STATIC}icon-512-maskable.png`, maskable);
console.log('icons: icon-512-maskable.png');
