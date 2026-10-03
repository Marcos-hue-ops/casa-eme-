/**
 * Identidade do site: endereço canônico, título e descrição padrão e cartão
 * social. Título e descrição de cada página ficam no front matter dela.
 */

/**
 * Interruptor de publicação.
 *
 * Em `false`, cada página sai com `noindex, nofollow` e o robots.txt responde
 * `Disallow: /`. É o estado certo enquanto o domínio definitivo não estiver
 * no ar: um site indexado num endereço provisório deixa rastro no Google que
 * demora a sumir.
 *
 * Antes de virar para `true`, confira README.md → "Antes de publicar".
 */
const publicavel = false;

/**
 * Domínio. PROVISÓRIO — troque pelo definitivo antes de publicar. Ele alimenta
 * canonical, og:url, sitemap, robots e os dados estruturados.
 */
const url = 'https://www.casaememoema.com.br';

export default {
  publicavel,
  url,
  lang: 'pt-BR',
  locale: 'pt_BR',
  nome: 'Casa EME',
  title: 'Casa EME Moema | Beleza, Estética Avançada e Saúde Capilar',
  description:
    'Casa EME, salão de beleza em Moema (SP): cabelo, unhas, sobrancelhas e cílios, estética facial e corporal, saúde capilar e massagens. Agendamento pelo WhatsApp.',
  themeColor: '#FBF7F1',
  ogImage: '/assets/img/og-casa-eme.jpg',
  ogImageAlt:
    'Casa EME — beleza, estética avançada e saúde capilar. Rua Pintassilgo, 457, Moema, São Paulo.',

  /**
   * Google Search Console — verificação por meta tag.
   *
   * Cole aqui SÓ o valor do atributo content que o Search Console mostrar
   * (ex.: 'AbCdEf123...'). Vazio, a meta tag não sai. Prefira, se puder, a
   * verificação por DNS do domínio: ela não depende do HTML. Ver README.md.
   */
  googleSiteVerification: '',
};
