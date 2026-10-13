/**
 * Prepara o vídeo de depoimento para o site.
 *
 *   videos/depoimento-paciente-capilar.mp4   original (como chegou do WhatsApp)
 *     → src/assets/video/depoimento-capilar.mp4       H.264 + AAC, volume nivelado,
 *                                                       `faststart` (começa a tocar
 *                                                       antes de baixar inteiro)
 *     → src/assets/img/video/depoimento-capilar-*.webp  capa (o quadro de 3 s)
 *
 * As legendas (src/assets/video/depoimento-capilar.vtt) são escritas à mão e
 * não são geradas aqui.
 *
 * Precisa do ffmpeg instalado. Uso: npm run video
 */
import { execFileSync } from 'node:child_process';
import { mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = new URL('../', import.meta.url);
const caminho = (relativo) => fileURLToPath(new URL(relativo, RAIZ));

const ORIGINAL = caminho('videos/depoimento-paciente-capilar.mp4');
const SAIDA = caminho('src/assets/video/depoimento-capilar.mp4');
const CAPA_TMP = caminho('src/assets/video/.capa.png');

await mkdir(caminho('src/assets/video/'), { recursive: true });
await mkdir(caminho('src/assets/img/video/'), { recursive: true });

const ffmpeg = (args) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

/* Vídeo vertical de celular (464×832): mantém a resolução, nivela o volume
   (o original foi gravado baixo) e põe o índice no começo do arquivo. */
ffmpeg([
  '-i', ORIGINAL,
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
  '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
  '-c:a', 'aac', '-b:a', '80k', '-ac', '1', '-ar', '44100',
  '-movflags', '+faststart',
  SAIDA,
]);

ffmpeg(['-ss', '3', '-i', ORIGINAL, '-frames:v', '1', CAPA_TMP]);
for (const largura of [320, 464]) {
  await sharp(CAPA_TMP)
    .resize({ width: largura })
    .webp({ quality: 78 })
    .toFile(caminho(`src/assets/img/video/depoimento-capilar-${largura}.webp`));
}
execFileSync('rm', ['-f', CAPA_TMP]);

const { size } = await stat(SAIDA);
console.log(`video: src/assets/video/depoimento-capilar.mp4 — ${(size / 1024 / 1024).toFixed(1)} MB`);
console.log('video: capas em src/assets/img/video/depoimento-capilar-{320,464}.webp');
