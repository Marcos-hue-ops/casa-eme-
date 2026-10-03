import icons from './src/_data/icons.js';

/**
 * Escapa o que poderia encerrar um bloco <script> a partir de dados, para que
 * o JSON-LD continue sendo dado mesmo se um texto trouxer `</script>`.
 */
function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': 'assets/fonts' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/img': 'assets/img' });
  eleventyConfig.addPassthroughCopy({ 'src/static': '.' });

  eleventyConfig.addWatchTarget('./src/assets/css/');
  eleventyConfig.addWatchTarget('./src/assets/js/');

  /**
   * Link do WhatsApp com a mensagem já escrita. A chave escolhe uma das
   * mensagens de business.js: quem clica em "Agendar avaliação capilar" abre a
   * conversa dizendo exatamente isso.
   */
  eleventyConfig.addFilter('wa', (whatsapp, chave = 'geral') => {
    const mensagem = whatsapp.messages[chave];
    if (!mensagem) throw new Error(`Mensagem de WhatsApp desconhecida: ${chave}`);
    return `${whatsapp.base}?text=${encodeURIComponent(mensagem)}`;
  });

  eleventyConfig.addFilter('json', safeJson);

  eleventyConfig.addFilter('slug', (value) =>
    String(value)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  );

  /** "09:00" → "9h"; "18:30" → "18h30". */
  eleventyConfig.addFilter('hora', (valor) => {
    if (!valor) return '';
    const [h, m] = valor.split(':');
    return `${Number(h)}h${m === '00' ? '' : m}`;
  });

  /** Dois dígitos: 1 → "01". Numeração editorial das listas. */
  eleventyConfig.addFilter('dois', (n) => String(n).padStart(2, '0'));

  /** Busca uma categoria de serviços pelo id. */
  eleventyConfig.addFilter('categoria', (servicos, id) => {
    const achada = servicos.find((c) => c.id === id);
    if (!achada) throw new Error(`Categoria de serviço desconhecida: ${id}`);
    return achada;
  });

  /** Todas as perguntas do FAQ, achatadas a partir dos grupos. */
  eleventyConfig.addFilter('achatarFaq', (grupos) => grupos.flatMap((grupo) => grupo.perguntas));

  /** Perguntas marcadas para aparecer num contexto (home, estética, capilar...). */
  eleventyConfig.addFilter('faqDe', (grupos, contexto) =>
    grupos.flatMap((grupo) => grupo.perguntas).filter((item) => (item.em || []).includes(contexto))
  );

  /** Fotos da galeria de uma ou mais categorias. */
  eleventyConfig.addFilter('fotosDe', (fotos, ...categorias) =>
    fotos.filter((foto) => categorias.flat().includes(foto.categoria))
  );

  /** srcset a partir da linha `imagem:` gerada por tools/images.js. */
  eleventyConfig.addFilter('srcset', (imagem) =>
    imagem.larguras.map((l) => `/assets/img/${imagem.pasta}/${imagem.arquivo}-${l}.webp ${l}w`).join(', ')
  );
  eleventyConfig.addFilter('src', (imagem, largura) => {
    const escolhida = largura && imagem.larguras.includes(largura) ? largura : imagem.larguras.at(-1);
    return `/assets/img/${imagem.pasta}/${imagem.arquivo}-${escolhida}.webp`;
  });

  /**
   * BreadcrumbList a partir da trilha declarada no front matter da página.
   * Só entra em páginas internas: na home a trilha seria de um item só.
   */
  eleventyConfig.addFilter('trilhaLd', (trilha, base) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trilha.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nome,
      item: `${base}${item.href}`,
    })),
  }));

  /** FAQPage a partir dos grupos de perguntas — só na página de dúvidas. */
  eleventyConfig.addFilter('faqLd', (grupos, base) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${base}/perguntas-frequentes/#faq`,
    mainEntity: grupos.flatMap((grupo) =>
      grupo.perguntas.map((item) => ({
        '@type': 'Question',
        name: item.p,
        acceptedAnswer: { '@type': 'Answer', text: item.r.replace(/<[^>]+>/g, '') },
      }))
    ),
  }));

  /** Ícone do conjunto próprio, inline e invisível a leitores de tela. */
  eleventyConfig.addShortcode('icon', function (name, className = '') {
    const def = icons[name];
    if (!def) throw new Error(`Ícone desconhecido: ${name}`);
    const attrs = def.fill
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
    const cls = ['icon', className].filter(Boolean).join(' ');
    return `<svg class="${cls}" viewBox="${def.viewBox}" ${attrs} aria-hidden="true" focusable="false">${def.body}</svg>`;
  });

  return {
    dir: { input: 'src', output: 'dist', includes: '_includes', data: '_data' },
    templateFormats: ['njk', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
}
