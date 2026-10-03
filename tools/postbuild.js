/**
 * Pós-build:
 *  1. dá nome com impressão digital ao CSS e ao JS (main.3f9a1c2b.css) e
 *     reescreve as referências no HTML;
 *  2. calcula o hash SHA-256 de cada script inline e injeta na CSP da página;
 *  3. gera os arquivos de cabeçalho de segurança para a hospedagem.
 *
 * Por que (1): os assets saem com cache de um ano (`immutable`). Com nome fixo,
 * quem já visitou o site continuaria vendo o CSS antigo depois de uma
 * atualização. Com o hash do conteúdo no nome, cada versão é um arquivo novo.
 *
 * Por que (2): com os hashes, a política continua estrita ('self' + hash) sem
 * precisar de 'unsafe-inline' e sem manutenção manual a cada alteração.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const MARCA = '__CSP_SCRIPT_HASHES__';
const SCRIPT_INLINE = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;

async function paginas(dir) {
  const entradas = await readdir(dir, { withFileTypes: true });
  const arquivos = await Promise.all(
    entradas.map((entrada) => {
      const completo = path.join(dir, entrada.name);
      if (entrada.isDirectory()) return paginas(completo);
      return entrada.name.endsWith('.html') ? [completo] : [];
    })
  );
  return arquivos.flat();
}

const sha256 = (valor) => `'sha256-${createHash('sha256').update(valor, 'utf8').digest('base64')}'`;

/* 1. Impressão digital ------------------------------------------------------ */
const versionados = {};
for (const relativo of ['assets/css/main.css', 'assets/js/main.js']) {
  const origem = path.join(DIST, relativo);
  const conteudo = await readFile(origem);
  const digital = createHash('sha256').update(conteudo).digest('hex').slice(0, 10);
  const { dir, name, ext } = path.parse(relativo);
  const novo = `${dir}/${name}.${digital}${ext}`;
  await rename(origem, path.join(DIST, novo));
  versionados[`/${relativo}`] = `/${novo}`;
}

/* 2. Hashes de script inline ------------------------------------------------ */
const arquivos = await paginas(DIST);
const todosHashes = new Set();

for (const arquivo of arquivos) {
  let html = await readFile(arquivo, 'utf8');

  for (const [antigo, novo] of Object.entries(versionados)) {
    html = html.replaceAll(`"${antigo}"`, `"${novo}"`);
  }

  /* Só os scripts sem `type` ou com `type` executável entram: o JSON-LD é
     dado, não código, e não precisa de hash. */
  const hashes = [...html.matchAll(SCRIPT_INLINE)]
    .filter((achado) => !/type=["']application\/ld\+json["']/i.test(achado[0]))
    .map((achado) => sha256(achado[1]));

  hashes.forEach((hash) => todosHashes.add(hash));
  html = html.replaceAll(MARCA, hashes.join(' '));
  await writeFile(arquivo, html, 'utf8');
}

/* 3. Cabeçalhos ------------------------------------------------------------- */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  `script-src 'self' ${[...todosHashes].join(' ')}`,
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'none'",
  /* O mapa do Google só entra depois do clique de quem visita (ver map.js). */
  'frame-src https://www.google.com',
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

const cabecalhos = [
  'Referrer-Policy: strict-origin-when-cross-origin',
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy: same-origin',
  'Cross-Origin-Resource-Policy: same-origin',
  'Strict-Transport-Security: max-age=31536000; includeSubDomains',
];

/* Netlify e Cloudflare Pages leem um arquivo _headers na raiz publicada. */
const netlify = [
  '/*',
  `  Content-Security-Policy: ${csp}`,
  ...cabecalhos.map((linha) => `  ${linha}`),
  '',
  /* CSS e JS têm o hash no nome: podem ficar um ano em cache. */
  '/assets/css/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  '/assets/js/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  '/assets/fonts/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  /* Fotos mantêm o nome quando são trocadas por uma versão melhor: um mês de
     cache, com revalidação depois disso. */
  '/assets/img/*',
  '  Cache-Control: public, max-age=2592000, must-revalidate',
  '',
  '/*.html',
  '  Cache-Control: public, max-age=0, must-revalidate',
  '',
  '/robots.txt',
  '  Cache-Control: public, max-age=3600, must-revalidate',
  '',
  '/sitemap.xml',
  '  Cache-Control: public, max-age=3600, must-revalidate',
  '',
].join('\n');

/* Na Vercel os cabeçalhos vêm do vercel.json (e a CSP, da meta tag de cada
   página): os dois arquivos abaixo seriam só lixo público no site. */
if (!process.env.VERCEL) {
  await writeFile(path.join(DIST, '_headers'), netlify, 'utf8');
  await writeFile(
    path.join(DIST, 'csp.gerada.txt'),
    `${csp}\n\n# Cabeçalhos recomendados\n${cabecalhos.join('\n')}\n`,
    'utf8'
  );
}

console.log(
  `postbuild: ${arquivos.length} página(s), ${todosHashes.size} hash(es) de script inline, ` +
    `${Object.values(versionados).map((v) => path.basename(v)).join(' + ')}`
);
