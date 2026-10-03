/**
 * Identidade do site: endereço canônico, título e descrição padrão e cartão
 * social. Título e descrição de cada página ficam no front matter dela.
 */

/**
 * Endereço do site e interruptor de indexação — decididos no build.
 *
 * O endereço alimenta canonical, og:url, og:image, sitemap, robots e os dados
 * estruturados. O interruptor `publicavel`, em `false`, faz cada página sair
 * com `noindex, nofollow` e o robots.txt responder `Disallow: /`: é o estado
 * certo enquanto o site estiver num endereço provisório, porque um endereço
 * provisório indexado deixa rastro no Google que demora a sumir.
 *
 * Na Vercel, nada precisa ser editado:
 *
 *  • sem domínio próprio, o site usa o endereço `…vercel.app` do projeto e
 *    fica fora do Google (mas o link já funciona e o cartão de
 *    compartilhamento aparece no WhatsApp);
 *  • com domínio próprio conectado, o próximo deploy de produção usa esse
 *    domínio e libera a indexação sozinho;
 *  • deploys de prévia (branches, pull requests) nunca são indexados.
 *
 * Para mandar explicitamente, crie na Vercel (Settings → Environment
 * Variables) as variáveis:
 *   SITE_URL         ex.: https://www.casaeme.com.br  (o domínio principal)
 *   SITE_PUBLICAVEL  "true" ou "false"
 *
 * Fora da Vercel (build local, Netlify, servidor próprio), vale o que estiver
 * nessas variáveis, ou o domínio de reserva abaixo, sem indexação.
 */
const DOMINIO_RESERVA = 'https://www.casaememoema.com.br';

const ambiente = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development' | undefined
const dominioVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL; // sem https://

const url = (
  process.env.SITE_URL ||
  (dominioVercel ? `https://${dominioVercel}` : DOMINIO_RESERVA)
).replace(/\/+$/, '');

if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(url)) {
  throw new Error(
    `SITE_URL inválida: "${url}". Use só o domínio, com https:// e sem caminho — ex.: https://www.casaeme.com.br`
  );
}

const dominioProprio = !/\.vercel\.app$/i.test(new URL(url).hostname) && url !== DOMINIO_RESERVA;

const publicavel =
  process.env.SITE_PUBLICAVEL !== undefined
    ? process.env.SITE_PUBLICAVEL === 'true' && ambiente !== 'preview'
    : ambiente === 'production' && dominioProprio;

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
