/**
 * Outubro Rosa — seção institucional da home.
 *
 * Conscientização, não venda: não há botão de agendamento nesta seção, e
 * nada aqui sugere que um procedimento estético previna ou trate câncer.
 *
 * `ativo: false` tira a seção do site. Sugestão: desligar em novembro e
 * religar em outubro, revendo o link do INCA (a página da campanha muda de
 * endereço a cada ano).
 */
export default {
  ativo: true,
  titulo: 'Outubro Rosa: um convite ao cuidado',
  paragrafos: [
    'Beleza e saúde caminham juntas. No Outubro Rosa, a Casa EME reforça a importância da informação e da prevenção.',
    'Conhecer o corpo, manter as consultas em dia e falar com seu médico sobre os exames também é cuidado.',
  ],
  aviso: 'A Casa EME não realiza diagnóstico nem substitui o acompanhamento médico.',
  link: {
    rotulo: 'Informações oficiais sobre o Outubro Rosa — INCA',
    url: 'https://www.gov.br/inca/pt-br/assuntos/campanhas/2024/outubro-rosa',
  },
};
