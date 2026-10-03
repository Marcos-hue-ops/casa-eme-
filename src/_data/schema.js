import site from './site.js';
import business from './business.js';
import hours from './hours.js';
import servicos from './servicos.js';

/**
 * Dados estruturados do site (JSON-LD), montados a partir dos mesmos objetos
 * que alimentam as páginas — o schema não afirma nada que a página não diga.
 *
 * BeautySalon é o tipo do schema.org para salão de beleza (é um
 * LocalBusiness, que por sua vez é uma Organization: logo, sameAs e contato
 * cabem nele sem precisar de um nó Organization separado).
 *
 * Ausências deliberadas:
 *  • aggregateRating e review — nota e número de avaliações não foram
 *    informados; e avaliação coletada pelo Google, marcada como própria, é o
 *    caso que as diretrizes chamam de autorreferente.
 *  • priceRange e preços — não há preço avulso informado. Os valores das
 *    assinaturas aparecem na página, mas ficam fora da marcação: preço em
 *    schema desatualizado vira divergência.
 *  • geo (latitude/longitude) — não foram aferidas. O endereço completo basta.
 */

const idNegocio = `${site.url}/#casa-eme`;
const idSite = `${site.url}/#site`;

const horarios = hours.semana
  .filter((dia) => dia.abre && dia.fecha)
  .map((dia) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${dia.dia}`,
    opens: dia.abre,
    closes: dia.fecha,
  }));

const endereco = {
  '@type': 'PostalAddress',
  streetAddress: business.address.street,
  addressLocality: business.address.city,
  addressRegion: business.address.state,
  postalCode: business.address.zip,
  addressCountry: business.address.country,
};

/** Catálogo de serviços: só nomes, por categoria — sem preço, sem promessa. */
const catalogo = {
  '@type': 'OfferCatalog',
  name: 'Serviços da Casa EME',
  itemListElement: servicos.map((categoria) => ({
    '@type': 'OfferCatalog',
    name: categoria.nome,
    url: `${site.url}${categoria.pagina}`,
    itemListElement: categoria.grupos.flatMap((grupo) =>
      grupo.itens.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item.nome, provider: { '@id': idNegocio } },
      }))
    ),
  })),
};

const negocio = {
  '@type': 'BeautySalon',
  '@id': idNegocio,
  name: business.name,
  alternateName: [business.fullName, 'Casa EME Moema'],
  slogan: business.assinatura,
  description: site.description,
  url: `${site.url}/`,
  logo: `${site.url}/icon-512.png`,
  image: `${site.url}${site.ogImage}`,
  telephone: business.whatsapp.tel,
  address: endereco,
  areaServed: [
    { '@type': 'Place', name: 'Moema, São Paulo' },
    { '@type': 'City', name: 'São Paulo' },
  ],
  openingHoursSpecification: horarios,
  hasMap: business.maps.search,
  currenciesAccepted: 'BRL',
  knowsLanguage: 'pt-BR',
  sameAs: [business.instagram.url],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'reservations',
    telephone: business.whatsapp.tel,
    url: business.whatsapp.base,
    availableLanguage: 'pt-BR',
  },
  hasOfferCatalog: catalogo,
};

export default {
  '@context': 'https://schema.org',
  '@graph': [
    negocio,
    {
      '@type': 'WebSite',
      '@id': idSite,
      url: `${site.url}/`,
      name: site.nome,
      alternateName: business.fullName,
      description: site.description,
      inLanguage: site.lang,
      publisher: { '@id': idNegocio },
    },
  ],
};
