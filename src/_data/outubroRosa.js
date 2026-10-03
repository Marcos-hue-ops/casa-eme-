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
    'O cuidado com a beleza também pode caminhar ao lado do cuidado com a saúde. Durante o Outubro Rosa, a Casa EME reforça a importância da informação, da prevenção e do acompanhamento profissional.',
    'Conhecer o próprio corpo, manter as consultas em dia e conversar com seu médico sobre os exames indicados para você são gestos de cuidado tão importantes quanto qualquer outro.',
  ],
  aviso: 'A Casa EME não realiza diagnóstico nem substitui o acompanhamento médico.',
  link: {
    rotulo: 'Informações oficiais sobre o Outubro Rosa — INCA',
    url: 'https://www.gov.br/inca/pt-br/assuntos/campanhas/2024/outubro-rosa',
  },
};
