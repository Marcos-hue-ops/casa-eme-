/**
 * Textos das seções de destaque — saúde capilar, emagrecimento, estética
 * avançada e quem atende.
 *
 * Escritos só com o que a casa enviou (artes da Dra. Rejane Rabelo, fotos de
 * antes e depois, depoimentos). Ao editar, mantenha as regras do README:
 * sem promessa, sem tempo de profissão ou números que não foram informados,
 * e a Dra. Rejane é biomédica esteta, nunca "médica".
 */
export default {
  /*
   * `enfase`: o trecho do título que sai em itálico. Precisa estar escrito
   * exatamente igual dentro do título; se não estiver, o título sai inteiro
   * sem itálico (nada quebra).
   */

  /** Primeira dobra: o texto da arte "Cuidado que vai além da beleza", da própria casa. */
  hero: {
    /** Sobretítulo em versal; ' · ' separa as partes. */
    sobre: 'Nova gestão · Moema, São Paulo',
    lema: 'Cuidado que vai além da beleza.',
    /** Parte do lema que sai em itálico (precisa estar escrita igual no lema). */
    enfase: 'além da beleza.',
    texto: 'Cuidar de você é olhar para o todo. Aqui, cada protocolo é pensado para o seu caso e acompanhado de perto.',
    /** Frase de fecho opcional, embaixo do texto (vazia: não aparece). */
    fecho: '',
    /**
     * Linha de credenciais abaixo dos botões. Só fatos que a casa informou;
     * `href` é opcional (leva à seção correspondente na home).
     */
    credenciais: [
      { rotulo: 'Saúde capilar', valor: 'Dra. Rejane Rabelo', detalhe: 'Biomédica esteta · CRBM 13690', href: '#quem-atende' },
      { rotulo: 'Avaliação capilar', valor: 'Quatro etapas', detalhe: 'Anamnese, exame, fotos, protocolo' },
      { rotulo: 'Antes e depois', valor: 'Casos da casa', detalhe: 'Capilar e facial', href: '#antes-e-depois' },
    ],
  },

  /** Índice dos serviços, logo depois da primeira dobra. */
  indice: {
    titulo: 'Seis frentes, uma só casa',
    enfase: 'uma só casa',
    lead: 'Três especialidades e um salão de beleza completo. Cabelo, unhas, sobrancelhas, cílios e massagens têm a mesma atenção.',
    /** Selo nas três primeiras categorias de servicos.js. */
    selo: 'Especialidade',
  },

  /** Faixa escura de estética avançada, na home. */
  estetica: {
    titulo: 'Rosto e corpo, com critério',
    enfase: 'com critério',
    nota: 'Cada procedimento tem indicações, contraindicações e cuidados próprios, e a resposta é individual.',
  },

  /** Seção de beleza (salão), na home. */
  beleza: {
    titulo: 'Cabelo, unhas e olhar, em dia',
    enfase: 'em dia',
    nota: 'Esmaltação em gel dura em média 15 a 20 dias.',
  },

  /** Frase sob "Por que Casa EME?" (o manifesto em si é da casa: manifesto.js). */
  manifesto: {
    intro:
      'Uma casa intimista e acolhedora, para cuidar de você por inteiro.',
  },

  rejane: {
    /* Espaço inseparável entre "a" e "Dra.": o artigo não fica sozinho no fim da linha. */
    titulo: 'A saúde capilar é com a\u00a0Dra. Rejane Rabelo',
    enfase: 'Dra. Rejane Rabelo',
    paragrafos: [
      'Na Casa EME, é ela quem conduz cada caso de saúde capilar, da primeira consulta ao fim do tratamento.',
      'Biomédica patologista de formação, ela se aperfeiçoou em tricologia e metabolismo capilar.',
    ],
    fraseAvaliacao: 'A avaliação com ela, em quatro etapas',
  },

  capilar: {
    titulo: 'Cabelo que cai, afina ou não cresce',
    enfase: 'ou não cresce',
    intro:
      'As causas variam. A Dra. Rejane Rabelo começa pela consulta, examina o couro cabeludo e faz o registro fotográfico.',
    aviso: 'Esse cuidado não substitui o acompanhamento com dermatologista.',
    condicoes: [
      {
        nome: 'Alopecias',
        texto: 'Falhas ou áreas mais ralas. Há vários tipos.',
      },
      {
        nome: 'Dermatite e inflamações do couro cabeludo',
        texto: 'Coceira, descamação, vermelhidão ou oleosidade excessiva pedem avaliação.',
      },
      {
        nome: 'Queda de cabelo',
        texto: 'Se a queda aumenta ou dura semanas, vale investigar.',
      },
      {
        nome: 'Afinamento dos fios',
        texto: 'Aos poucos, o rabo de cavalo fica mais fino.',
      },
      {
        nome: 'Falta de crescimento',
        texto: 'Meses sem cortar, e o comprimento continua igual.',
      },
    ],
  },

  casos: {
    intro:
      'Casos atendidos aqui. A própria imagem traz as datas dos registros ou o número de sessões.',
    introFacial: 'Cinco casos de estética facial.',
  },

  emagrecimento: {
    titulo: 'Um plano para o seu corpo',
    enfase: 'para o seu corpo',
    paragrafos: [
      'Primeiro vem a avaliação. Dela sai o plano: protocolos corporais para gordura localizada, flacidez, celulite e contorno, com drenagem quando fizer sentido.',
    ],
    aviso:
      'Perder peso depende também de alimentação e atividade física. Os protocolos não substituem o acompanhamento médico e nutricional.',
    lead:
      'Protocolos corporais montados a partir da sua avaliação, aqui na Casa EME, na Rua Pintassilgo, 457.',
    etapas: [
      { nome: 'Avaliação individual', texto: 'Conversa sobre rotina, histórico e o que incomoda.' },
      { nome: 'Plano para o seu caso', texto: 'Técnicas e sessões sob medida, sem pacote pronto.' },
      { nome: 'Acompanhamento', texto: 'O plano se ajusta conforme a evolução.' },
    ],
  },

  depoimentos: {
    titulo: 'Quem tratou a queda conta como foi',
    enfase: 'conta como foi',
    intro:
      'Dois pacientes da Dra. Rejane Rabelo: um gravou em vídeo, o outro escreveu.',
    /** Vai logo depois dos depoimentos: relato não é promessa. */
    ressalva:
      'Relatos individuais, não promessa de resultado. O tratamento e o número de sessões dependem da avaliação.',
  },
};
