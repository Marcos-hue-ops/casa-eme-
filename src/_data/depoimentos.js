/**
 * Prova social.
 *
 * `destaques` são os pontos que, segundo a Casa EME, mais se repetem nas
 * avaliações das clientes. Aparecem como temas — sem aspas, sem nome, sem
 * nota — porque é isso que eles são.
 *
 * `itens` recebe avaliações reais, transcritas sem alterar o sentido. Enquanto
 * estiver vazio, a seção mostra só os destaques. Quando houver itens, eles
 * passam a aparecer como citações, com autoria.
 *
 * Exemplo (NÃO é uma avaliação real — apenas o formato):
 *   { texto: 'Trecho da avaliação, como foi escrito.', autor: 'Nome como aparece na avaliação', fonte: 'Google' },
 *
 * Nunca invente, edite o sentido ou junte avaliações diferentes num texto só.
 * Nota média e número de avaliações também não entram: não foram informados.
 */
export default {
  destaques: [
    'Atendimento acolhedor',
    'Ambiente intimista',
    'Profissionais atenciosas',
    'A sensação de estar em casa',
    'Profissionais experientes',
    'Cuidado',
    'Higiene',
    'Atendimento personalizado',
  ],
  itens: [],
};
