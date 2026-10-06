/** Navegação. A ordem aqui é a ordem no cabeçalho, no menu do celular e no rodapé. */
export default {
  /* Os três destaques da casa vêm primeiro. O FAQ fica no rodapé, no menu do
     celular e nos links das páginas (o cabeçalho do desktop tem lugar para sete). */
  principal: [
    { label: 'Saúde capilar', href: '/saude-capilar/' },
    { label: 'Emagrecimento', href: '/emagrecimento/' },
    { label: 'Estética avançada', curto: 'Estética', href: '/estetica-avancada/' },
    { label: 'Serviços', href: '/servicos/' },
    { label: 'Sobre', href: '/sobre/' },
    { label: 'Galeria', href: '/galeria/' },
    { label: 'Contato', href: '/contato/' },
  ],
  /** Itens que só aparecem no menu do celular, depois dos principais. */
  extra: [{ label: 'Perguntas frequentes', href: '/perguntas-frequentes/' }],
  rodape: [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre/' },
    { label: 'Saúde capilar', href: '/saude-capilar/' },
    { label: 'Emagrecimento', href: '/emagrecimento/' },
    { label: 'Estética avançada', href: '/estetica-avancada/' },
    { label: 'Serviços', href: '/servicos/' },
    { label: 'Galeria', href: '/galeria/' },
    { label: 'FAQ', href: '/perguntas-frequentes/' },
    { label: 'Contato', href: '/contato/' },
  ],
};
