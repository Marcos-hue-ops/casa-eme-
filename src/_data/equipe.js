/**
 * Quem atende.
 *
 * Dados da Dra. Rejane Rabelo tirados das três artes enviadas pela casa
 * (originais em fotos/equipe/). Nada além do que está nelas: sem tempo de
 * profissão, número de pacientes ou títulos que não apareçam ali.
 *
 * Ela é biomédica esteta (registro no Conselho Regional de Biomedicina).
 * Em nenhum texto do site ela é chamada de médica ou dermatologista.
 *
 * O telefone pessoal que aparece nas artes dela NÃO entra no site: o canal de
 * agendamento é um só, o WhatsApp da Casa EME (business.js).
 */
export default {
  rejane: {
    nome: 'Dra. Rejane Rabelo',
    nomeCurto: 'Dra. Rejane',
    funcao: 'Biomédica esteta',
    registro: { conselho: 'CRBM', numero: '13690', formatado: 'CRBM 13690' },
    assinatura: 'Saúde capilar e metabólica',
    instagram: {
      handle: '@dra_rejane_rabelo',
      url: 'https://www.instagram.com/dra_rejane_rabelo/',
    },

    /** Formação, como ela lista. */
    formacao: [
      'Biomédica patologista',
      'Pós-graduação em estética avançada pelo IOA, Instituto Orofacial das Américas',
    ],
    cursos: [
      'Tricologia',
      'Metabolismo capilar',
      'PRP',
      'Suplementação injetável e exames laboratoriais',
    ],

    /** As quatro etapas da avaliação, na ordem em que ela as apresenta. */
    avaliacao: [
      { nome: 'Consulta e anamnese', texto: 'Conversa sobre a queixa, o histórico, a rotina e o que já foi tentado.' },
      { nome: 'Exame físico', texto: 'Exame do couro cabeludo e dos fios, que pode incluir a tricoscopia.' },
      { nome: 'Registro fotográfico', texto: 'Fotos do ponto de partida, para comparar a evolução ao longo do tratamento.' },
      { nome: 'Protocolo de tratamento', texto: 'Com essas informações em mãos, o tratamento é montado para o caso.' },
    ],

    /** Queixas capilares que ela atende, como ela as nomeia. */
    tratamentosCapilares: ['Alopecias', 'Dermatite e inflamações', 'Queda de cabelo', 'Afinamento dos fios', 'Falta de crescimento'],

    /**
     * Retratos (linhas geradas por `npm run images`). O `alt` descreve a foto;
     * o nome dela já está escrito ao lado, na página.
     */
    fotos: {
      principal: {
        alt: 'Dra. Rejane Rabelo de blazer branco e blusa preta, braços cruzados, diante de uma parede clara com relevo geométrico.',
        imagem: { pasta: 'equipe', arquivo: 'dra-rejane-rabelo-formacao', larguras: [480, 956], largura: 956, altura: 900 },
      },
      blazer: {
        alt: 'Dra. Rejane Rabelo sorrindo, de blazer branco, ao lado de um vaso com capim seco, em frente a uma parede clara com relevo.',
        imagem: { pasta: 'equipe', arquivo: 'dra-rejane-rabelo-blazer', larguras: [480, 960], largura: 960, altura: 837 },
      },
      avaliacao: {
        alt: 'Dra. Rejane Rabelo de pé, de blazer branco, na sala de atendimento, com um vaso de capim seco ao lado.',
        imagem: { pasta: 'equipe', arquivo: 'dra-rejane-rabelo-avaliacao', larguras: [480, 720], largura: 720, altura: 743 },
      },
      rosto: {
        alt: 'Retrato da Dra. Rejane Rabelo sorrindo.',
        imagem: { pasta: 'janela', arquivo: 'dra-rejane', larguras: [360, 460], largura: 460, altura: 460 },
      },
    },
  },
};
