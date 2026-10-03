/** Servidor estático mínimo para conferência local do dist/. */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  let file = path.join(DIST, decodeURIComponent(url.pathname));

  /* Impede sair da pasta publicada. */
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const info = await stat(file).catch(() => null);
    if (!info || info.isDirectory()) file = path.join(file, 'index.html');
    await stat(file);
  } catch {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    createReadStream(path.join(DIST, '404.html')).pipe(res);
    return;
  }

  const type = TYPES[path.extname(file)] || 'application/octet-stream';
  const { size } = await stat(file);

  /* Vídeo é pedido em pedaços: sem resposta 206 o navegador desiste de tocar e
     o problema parece ser do site. */
  const range = type.startsWith('video/') ? /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '') : null;
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
      res.writeHead(416, { 'content-range': `bytes */${size}` }).end();
      return;
    }
    res.writeHead(206, {
      'content-type': type,
      'accept-ranges': 'bytes',
      'content-range': `bytes ${start}-${end}/${size}`,
      'content-length': end - start + 1,
    });
    createReadStream(file, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': size });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
