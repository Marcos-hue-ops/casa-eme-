/**
 * Nome, endereço, telefone e canais — a fonte única.
 *
 * O mesmo objeto alimenta cabeçalho, rodapé, página de contato, botões de
 * WhatsApp e dados estruturados. Divergência de NAP (nome, endereço,
 * telefone) entre páginas é o erro que mais custa em busca local, e aqui ela
 * não tem como acontecer: muda-se num lugar só.
 *
 * Nada aqui é estimado. Só entra o que a Casa EME informou.
 */

/** Número do WhatsApp no formato internacional, só dígitos (55 + DDD + número). */
const numero = '5511964121702';

const endereco = {
  street: 'Rua Pintassilgo, 457',
  district: 'Vila Uberabinha',
  neighborhood: 'Moema',
  city: 'São Paulo',
  state: 'SP',
  zip: '04514-032',
  country: 'BR',
};

/** O endereço exatamente como o Google Maps o escreve. */
const enderecoMaps = 'Rua Pintassilgo, 457 - Vila Uberabinha, São Paulo - SP, 04514-032';

export default {
  name: 'Casa EME',
  /** Como o perfil se apresenta no Instagram: "CASA EME | Moema". */
  fullName: 'Casa EME | Moema',
  slogan: 'Beleza · Estética avançada · Saúde capilar',
  lema: 'Uma nova experiência em Moema.',
  gestao: 'Nova gestão.',
  /** Fecho do manifesto "Por que Casa EME?", publicado pela própria casa. */
  assinatura: 'Uma casa para cuidar de mim.',

  address: {
    ...endereco,
    /** Uma linha, para texto corrido. */
    inline: `${endereco.street} · ${endereco.district}, ${endereco.neighborhood} · ${endereco.city} – ${endereco.state} · CEP ${endereco.zip}`,
  },

  /**
   * Links de mapa montados por busca, não por coordenada: não temos latitude
   * e longitude aferidas, e um pino errado é pior do que pino nenhum. A busca
   * por nome + endereço cai na ficha certa.
   */
  maps: {
    query: `Casa EME, ${enderecoMaps}`,
    get search() {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.query)}`;
    },
    get route() {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.query)}`;
    },
    /** Só é carregado depois do clique de quem visita (ver assets/js/modules/map.js). */
    get embed() {
      return `https://www.google.com/maps?q=${encodeURIComponent(enderecoMaps)}&output=embed`;
    },
  },

  whatsapp: {
    numero,
    display: '(11) 96412-1702',
    tel: '+5511964121702',
    base: `https://wa.me/${numero}`,
    /**
     * Mensagens pré-preenchidas por contexto. Quem clica no botão da saúde
     * capilar já abre a conversa dizendo isso — a equipe sabe o assunto antes
     * de responder. Para mudar uma frase, mude aqui.
     */
    messages: {
      geral: 'Olá! Gostaria de agendar um atendimento na Casa EME.',
      beleza: 'Olá! Gostaria de conhecer os serviços de beleza da Casa EME.',
      cabelo: 'Olá! Gostaria de agendar um horário de cabelo na Casa EME.',
      unhas: 'Olá! Gostaria de agendar manicure e/ou pedicure na Casa EME.',
      estetica: 'Olá! Gostaria de saber mais sobre os tratamentos de estética avançada.',
      capilar: 'Olá! Gostaria de agendar uma avaliação capilar.',
      emagrecimento: 'Olá! Gostaria de saber mais sobre o emagrecimento na Casa EME.',
      rejane: 'Olá! Gostaria de agendar uma avaliação com a Dra. Rejane.',
      relax: 'Olá! Gostaria de agendar uma massagem ou drenagem na Casa EME.',
      sobrancelhas: 'Olá! Gostaria de agendar sobrancelhas ou cílios na Casa EME.',
      assinaturas: 'Olá! Gostaria de saber mais sobre as assinaturas da Casa EME.',
      duvida: 'Olá! Vim pelo site da Casa EME e tenho uma dúvida.',
      local: 'Olá! Gostaria de confirmar como chegar à Casa EME.',
    },
  },

  instagram: {
    handle: '@casaeme_moema',
    url: 'https://www.instagram.com/casaeme_moema/',
  },
};
