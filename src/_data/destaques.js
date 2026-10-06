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
    lema: 'Cuidado que vai além da beleza.',
    /** Parte do lema que sai em itálico (precisa estar escrita igual no lema). */
    enfase: 'além da beleza.',
    texto:
      'Na Casa EME, acreditamos que cuidar de você é olhar para o todo. Unimos beleza, estética avançada, terapia capilar e saúde em uma experiência completa, personalizada e pensada para o seu bem-estar.',
    fecho: 'Porque quando você se cuida por inteiro, a beleza acontece de dentro para fora.',
  },

  pilares: {
    titulo: 'Saúde capilar, emagrecimento e estética avançada',
    enfase: 'e estética avançada',
    intro:
      'Cabelo, unhas, spa, sobrancelhas e cílios seguem na agenda da casa como sempre. Nestas três áreas, o atendimento começa por uma avaliação individual, e o protocolo é montado depois dela, para uma pessoa só.',
    /** Um texto por categoria, pelo id de servicos.js. */
    textos: {
      'saude-capilar':
        'Alopecias, dermatite e outras inflamações do couro cabeludo, queda, afinamento dos fios e falta de crescimento. Quem atende é a Dra. Rejane Rabelo, que examina o couro cabeludo, faz o registro fotográfico e só então estrutura o tratamento.',
      emagrecimento:
        'Protocolos corporais para gordura localizada, flacidez e contorno, com atenção também à saúde metabólica. O plano sai da avaliação individual e vai sendo ajustado conforme a evolução.',
      'estetica-avancada':
        'No rosto, toxina botulínica, preenchimento, bioestimuladores, skinbooster e microagulhamento. No corpo, celulite, flacidez e drenagem, com indicação definida na avaliação.',
    },
  },

  rejane: {
    /* Espaço inseparável entre "a" e "Dra.": o artigo não fica sozinho no fim da linha. */
    titulo: 'Quem te atende é a\u00a0Dra. Rejane Rabelo',
    enfase: 'Dra. Rejane Rabelo',
    paragrafos: [
      'A Dra. Rejane Rabelo é biomédica esteta, com registro no CRBM 13690. Biomédica patologista de formação, fez pós-graduação em estética avançada.',
      'A pós-graduação foi pelo IOA, o Instituto Orofacial das Américas. Os cursos que vieram depois giram quase todos em torno do cabelo e do metabolismo, e é assim que ela apresenta o próprio trabalho: saúde capilar e metabólica.',
      'Na Casa EME, é ela quem atende na saúde capilar e na estética avançada. Um paciente que tratou a queda de cabelo com ela conta que, depois do procedimento, ela seguiu acompanhando de perto como ia a recuperação.',
    ],
    fraseAvaliacao: 'Antes de qualquer protocolo, a avaliação com ela passa por quatro etapas:',
  },

  capilar: {
    titulo: 'Quando o cabelo cai, afina ou para de crescer',
    enfase: 'ou para de crescer',
    intro:
      'Queda acima do normal, fios cada vez mais finos ou um couro cabeludo que coça e descama podem ter causas bem diferentes. Por isso a Dra. Rejane Rabelo começa pela consulta, examina o couro cabeludo e faz o registro fotográfico antes de montar o seu protocolo.',
    aviso: 'Esse cuidado não substitui o acompanhamento com dermatologista.',
    condicoes: [
      {
        nome: 'Alopecias',
        texto: 'Nome dado às perdas de cabelo que deixam áreas mais ralas ou com falhas; há vários tipos, com causas diferentes.',
      },
      {
        nome: 'Dermatite e inflamações do couro cabeludo',
        texto: 'Coceira, descamação, vermelhidão ou oleosidade fora do comum podem indicar inflamação no couro cabeludo e pedem avaliação.',
      },
      {
        nome: 'Queda de cabelo',
        texto: 'Perder alguns fios por dia é normal; quando a quantidade aumenta ou se arrasta por semanas, vale investigar a causa.',
      },
      {
        nome: 'Afinamento dos fios',
        texto: 'Os fios ficam mais finos e o volume diminui aos poucos, o que às vezes se nota primeiro no rabo de cavalo ou na repartição.',
      },
      {
        nome: 'Falta de crescimento',
        texto: 'Quando o cabelo parece parado no mesmo comprimento, a avaliação ajuda a separar o fio que quebra do crescimento que está mais lento.',
      },
    ],
  },

  casos: {
    titulo: 'Antes e depois de quem tratou aqui',
    enfase: 'de quem tratou aqui',
    intro:
      'Fotos de pacientes atendidos aqui na Casa EME, no tratamento capilar e no rosto. Nos casos capilares, a própria imagem traz as datas dos registros ou o número de sessões.',
    tituloFacial: 'No rosto',
    introFacial: 'Casos de estética avançada facial. A legenda diz a região; o procedimento de cada caso é definido na avaliação.',
  },

  emagrecimento: {
    titulo: 'Emagrecimento com avaliação e acompanhamento de perto',
    enfase: 'com avaliação e acompanhamento de perto',
    paragrafos: [
      'Na Casa EME, o cuidado com o emagrecimento começa por uma avaliação individual, com uma conversa sobre a sua rotina, o seu histórico e o que mais incomoda no corpo. A partir dela entram os protocolos corporais da casa para gordura localizada, flacidez, celulite e contorno, com drenagem quando fizer sentido para o caso.',
      'A Dra. Rejane Rabelo, que apresenta o próprio trabalho como saúde capilar e metabólica, tem cursos de suplementação injetável e de exames laboratoriais. Quais técnicas entram no plano e quantas sessões ele terá, a avaliação é que define, e o plano pode ser revisto ao longo do acompanhamento.',
    ],
    aviso: 'Os protocolos da casa não substituem o acompanhamento médico e nutricional.',
    lead:
      'Cada plano começa por uma avaliação individual e reúne protocolos corporais para gordura localizada, flacidez e contorno, com atenção também à saúde metabólica. Tudo aqui na Casa EME, na Rua Pintassilgo, em Moema.',
    etapas: [
      { nome: 'Avaliação individual', texto: 'Conversa sobre a sua rotina, o seu histórico e o que mais incomoda no corpo.' },
      { nome: 'Plano para o seu caso', texto: 'As técnicas e o número de sessões saem da avaliação, e não de um pacote pronto.' },
      { nome: 'Acompanhamento', texto: 'O plano pode ser revisto ao longo do caminho, conforme a evolução.' },
    ],
  },

  depoimentos: {
    titulo: 'Quem tratou a queda de cabelo aqui conta como foi',
    enfase: 'conta como foi',
    intro:
      'Um paciente gravou o depoimento em vídeo e Aron Menczer escreveu o dele em inglês, aqui traduzido; os dois procuraram a Dra. Rejane Rabelo por causa da queda de cabelo.',
  },
};
