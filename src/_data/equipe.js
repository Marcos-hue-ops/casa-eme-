/**
 * Quem atende — uma entrada por profissional, cada uma com a sua seção
 * (sections/pessoa.njk). Campos usados pela seção:
 *  ancora   id da seção na página (links: /sobre/#ancora)
 *  legenda  linha embaixo do retrato
 *  resumo   o que vem depois do nome na linha "Responsável" (página de serviços)
 *  ficha    linhas da ficha ao lado do texto ({ rotulo, valor } — `valor`
 *           pode ser uma lista, que sai uma por linha)
 *  wa, cta  chave da mensagem de WhatsApp (business.js) e texto do botão
 *
 * Dra. Rejane Rabelo: dados tirados das três artes enviadas pela casa
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
    /* Não publicar: as artes desse perfil trazem o telefone pessoal (README → Pendências). */
    instagram: {
      handle: '@dra_rejane_rabelo',
      url: 'https://www.instagram.com/dra_rejane_rabelo/',
    },

    /**
     * Formação e cursos, como ela lista e na mesma ordem. A arte traz a
     * pós em estética avançada (sem instituição) separada da pós pelo IOA
     * (sem área): não junte as duas sem confirmação dela.
     */
    formacao: ['Biomédica patologista', 'Pós-graduação em estética avançada'],
    cursos: [
      'Pós-graduação pelo IOA, Instituto Orofacial das Américas',
      'Suplementação injetável e exames laboratoriais',
      'PRP',
      'Tricologia',
      'Metabolismo capilar',
    ],

    ancora: 'quem-atende',
    legenda: 'Dra. Rejane Rabelo · Biomédica esteta · CRBM 13690',
    resumo: 'Biomédica esteta · CRBM 13690',
    ficha: [
      { rotulo: 'Registro', valor: 'Biomédica esteta, CRBM 13690' },
      { rotulo: 'Formação', valor: ['Biomédica patologista', 'Pós-graduação em estética avançada'] },
      {
        rotulo: 'Aperfeiçoamento',
        valor: 'Pós-graduação pelo IOA, Instituto Orofacial das Américas · Suplementação injetável e exames laboratoriais · PRP · Tricologia · Metabolismo capilar',
      },
    ],
    wa: 'rejane',
    cta: 'Agendar avaliação com a Dra. Rejane',

    /** As quatro etapas da avaliação, na ordem em que ela as apresenta. */
    avaliacao: [
      { nome: 'Consulta e anamnese', texto: 'Conversa sobre a queixa, o histórico, a rotina e o que já foi tentado.' },
      { nome: 'Exame físico', texto: 'Exame do couro cabeludo e dos fios.' },
      { nome: 'Registro fotográfico', texto: 'Fotos do ponto de partida, para comparar a evolução ao longo do tratamento.' },
      { nome: 'Estruturação do protocolo', texto: 'Com o que viu nas etapas anteriores, ela monta o tratamento de cada paciente.' },
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
      /* reserva: não usado nas páginas hoje */
      blazer: {
        alt: 'Dra. Rejane Rabelo sorrindo, de blazer branco, ao lado de um vaso com capim seco, em frente a uma parede clara com relevo.',
        imagem: { pasta: 'equipe', arquivo: 'dra-rejane-rabelo-blazer', larguras: [480, 960], largura: 960, altura: 837 },
      },
      avaliacao: {
        alt: 'Dra. Rejane Rabelo de pé, de blazer branco, na sala de atendimento, com um vaso de capim seco ao lado.',
        imagem: { pasta: 'equipe', arquivo: 'dra-rejane-rabelo-avaliacao', larguras: [480, 720], largura: 720, altura: 743 },
      },
      /* reserva: não usado nas páginas hoje */
      rosto: {
        alt: 'Retrato da Dra. Rejane Rabelo sorrindo.',
        imagem: { pasta: 'janela', arquivo: 'dra-rejane', larguras: [360, 460], largura: 460, altura: 460 },
      },
    },
  },

  /**
   * Gilberto, responsável pela beleza (cabelo, mãos e pés, sobrancelhas e
   * cílios). Biografia enviada pela casa em 09/10/2026; foto em
   * fotos/equipe/gilberto.jpg (na Beauty Fair Internacional).
   *
   * A confirmar com a casa (README → Pendências): o sobrenome; "Senac do RG"
   * (o site diz só "Faculdade Senac"); a grafia "Llongueras" (a casa
   * escreveu "longuera"); o nome da "Academia Lafi".
   */
  gilberto: {
    nome: 'Gilberto',
    nomeCurto: 'Gilberto',
    funcao: 'Responsável pela beleza',
    /** Informado pela casa. É o único tempo de profissão que o site cita. */
    experiencia: '30 anos de experiência',
    formacao: ['Faculdade Senac'],
    cursos: [
      'Especialização em corte pela academia Toni&Guy',
      'Corte programado Llongueras',
      'Clareamento e cor pela L’Oréal',
      'Gestão e beleza pela Academia Lafi',
    ],
    salao: 'Ezatto Cabeleireiros, em Florianópolis',
    ancora: 'quem-cuida-da-beleza',
    legenda: 'Gilberto · Responsável pela beleza · 30 anos de experiência',
    resumo: '30 anos de experiência',
    ficha: [
      { rotulo: 'Experiência', valor: '30 anos' },
      { rotulo: 'Formação', valor: 'Faculdade Senac' },
      {
        rotulo: 'Especializações',
        valor: ['Corte · Toni&Guy', 'Corte programado · Llongueras', 'Clareamento e cor · L’Oréal', 'Gestão e beleza · Academia Lafi'],
      },
      { rotulo: 'Salão próprio', valor: 'Ezatto Cabeleireiros, Florianópolis' },
    ],
    wa: 'gilberto',
    cta: 'Agendar com o Gilberto',
    fotos: {
      principal: {
        alt: 'Gilberto de blazer cinza e camisa azul-marinho, em pé diante do painel da Beauty Fair Internacional.',
        imagem: { pasta: 'equipe', arquivo: 'gilberto', larguras: [480, 960], largura: 960, altura: 1258 },
      },
    },
  },
};
