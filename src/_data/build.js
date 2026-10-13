/** Dados do próprio build, usados no rodapé e no sitemap. */
const agora = new Date();

export default {
  ano: agora.getFullYear(),
  /**
   * `npm run dev` (eleventy --serve): a CSP sai do HTML, porque os hashes dos
   * scripts só são calculados no build de produção (tools/postbuild.js).
   */
  dev: process.env.ELEVENTY_RUN_MODE === 'serve',
  /** AAAA-MM-DD em horário de São Paulo, para <lastmod>. */
  data: new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(agora),
};
