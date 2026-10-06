/**
 * Serviços da Casa EME, por categoria.
 *
 * A ORDEM importa: as três primeiras categorias (saúde capilar,
 * emagrecimento e estética avançada) são os destaques da casa e aparecem
 * primeiro no índice, no menu e na numeração das seções da home.
 *
 * É a fonte única de serviços: a home, a página de serviços, as páginas de
 * estética avançada e saúde capilar, o FAQ e o catálogo nos dados
 * estruturados leem daqui. Para incluir, tirar ou renomear um serviço, mexa
 * só neste arquivo.
 *
 * Regras de conteúdo (do briefing, e valem para quem editar depois):
 *  • só serviços que a casa oferece de fato;
 *  • sem preço avulso (nenhum foi informado) — os valores das assinaturas
 *    ficam em assinaturas.js;
 *  • sem promessa de resultado. Descrição diz o que a técnica é, não o que
 *    ela "garante".
 *
 * Campos:
 *  id        âncora na página de serviços (/servicos/#id) — não mude à toa:
 *            links internos e o sitemap mental do Google dependem dele
 *  nome      título da categoria
 *  chamada   linha curta sob o título
 *  texto     parágrafo de apresentação
 *  pagina    para onde a categoria leva (página própria ou âncora)
 *  wa        chave da mensagem de WhatsApp (business.js → whatsapp.messages)
 *  cta       texto do botão
 *  destaques itens mostrados no índice da home (nomes iguais aos de `itens`)
 *  grupos    subgrupos com seus itens ({ nome, desc? })
 */
export default [
  {
    id: 'saude-capilar',
    nome: 'Saúde capilar',
    chamada: 'Diagnóstico, tratamento e acompanhamento',
    texto:
      'Queda acima do normal, fios cada vez mais finos ou um couro cabeludo que coça e descama podem ter causas bem diferentes. Por isso o atendimento começa pela consulta e pelo exame do couro cabeludo, com a Dra. Rejane Rabelo, e só depois vem o protocolo.',
    pagina: '/saude-capilar/',
    wa: 'capilar',
    cta: 'Agendar avaliação capilar',
    destaques: ['Alopecias', 'Dermatite e inflamações do couro cabeludo', 'Queda de cabelo', 'Afinamento dos fios', 'Falta de crescimento', 'Tricoscopia'],
    grupos: [
      {
        id: 'diagnostico',
        nome: 'Diagnóstico',
        etapa: 'Entender',
        texto: 'O primeiro passo é olhar com atenção para o couro cabeludo e para os fios.',
        itens: [
          { nome: 'Consulta capilar' },
          { nome: 'Avaliação do couro cabeludo' },
          { nome: 'Tricoscopia', desc: 'Exame do couro cabeludo e dos fios com aparelho de ampliação.' },
          { nome: 'Registro fotográfico', desc: 'Fotos do ponto de partida, para comparar a evolução.' },
          { nome: 'Plano individualizado' },
        ],
      },
      {
        id: 'tratamentos',
        nome: 'Tratamentos',
        etapa: 'Tratar',
        texto: 'Com o plano definido, os recursos são escolhidos para a queixa de cada pessoa.',
        itens: [
          { nome: 'Alopecias' },
          { nome: 'Dermatite e inflamações do couro cabeludo' },
          { nome: 'Queda de cabelo' },
          { nome: 'Afinamento dos fios' },
          { nome: 'Falta de crescimento' },
          { nome: 'Saúde do couro cabeludo' },
          { nome: 'Protocolo Capilaris', desc: 'O protocolo capilar da casa, ajustado a cada caso na avaliação.' },
          { nome: 'Microagulhamento capilar' },
          { nome: 'Terapias capilares' },
          { nome: 'Protocolos injetáveis' },
        ],
      },
      {
        id: 'cuidado-e-recuperacao',
        nome: 'Cuidado e recuperação',
        etapa: 'Acompanhar',
        texto: 'O cuidado continua depois da sessão: recuperação da fibra, pré e pós-procedimento e acompanhamento da evolução.',
        itens: [
          { nome: 'Recuperação da fibra capilar' },
          { nome: 'Pré e pós-procedimento' },
          { nome: 'Acompanhamento da evolução' },
        ],
      },
    ],
  },

  {
    id: 'emagrecimento',
    nome: 'Emagrecimento',
    chamada: 'Corpo e saúde metabólica',
    texto:
      'Protocolos corporais para gordura localizada, flacidez, celulite e contorno, com atenção também à saúde metabólica. O plano sai da avaliação individual e vai sendo ajustado conforme a evolução.',
    pagina: '/emagrecimento/',
    wa: 'emagrecimento',
    cta: 'Agendar avaliação de emagrecimento',
    destaques: ['Gordura localizada', 'Contorno corporal', 'Flacidez', 'Celulite', 'Drenagem', 'Acompanhamento da evolução'],
    grupos: [
      {
        id: 'emagrecimento-plano',
        nome: 'Emagrecimento',
        itens: [
          { nome: 'Avaliação individual', desc: 'Conversa sobre rotina, histórico e o que mais incomoda no corpo.' },
          { nome: 'Gordura localizada' },
          { nome: 'Contorno corporal' },
          { nome: 'Flacidez' },
          { nome: 'Celulite' },
          { nome: 'Drenagem', desc: 'Técnica manual de movimentos leves e ritmados, quando fizer sentido para o caso.' },
          { nome: 'Protocolos de emagrecimento', desc: 'Combinação de técnicas montada para cada caso e revista ao longo do acompanhamento.' },
          { nome: 'Acompanhamento da evolução' },
        ],
      },
    ],
  },

  {
    id: 'estetica-avancada',
    nome: 'Estética avançada',
    chamada: 'Facial e corporal',
    texto:
      'Procedimentos faciais e corporais definidos a partir de uma avaliação individual. O que se indica — e se algo se indica — depende de cada pessoa, da pele, do corpo e do que ela procura.',
    pagina: '/estetica-avancada/',
    wa: 'estetica',
    cta: 'Agendar avaliação de estética',
    destaques: ['Toxina botulínica', 'Preenchimento', 'Bioestimuladores', 'Skinbooster', 'Flacidez', 'Contorno corporal'],
    grupos: [
      {
        id: 'facial',
        nome: 'Facial',
        itens: [
          { nome: 'Toxina botulínica', desc: 'Procedimento injetável voltado às linhas de expressão.' },
          { nome: 'Preenchimento', desc: 'Procedimento injetável que trabalha volume e contorno.' },
          { nome: 'Bioestimuladores', desc: 'Injetáveis que atuam no estímulo de colágeno.' },
          { nome: 'Skinbooster', desc: 'Injetável voltado à hidratação da pele.' },
          { nome: 'Microagulhamento', desc: 'Microperfurações controladas na pele.' },
          { nome: 'Rejuvenescimento', desc: 'Protocolos que combinam técnicas conforme a avaliação.' },
          { nome: 'Qualidade da pele', desc: 'Tratamentos voltados a textura, viço e uniformidade.' },
        ],
      },
      {
        id: 'corporal',
        nome: 'Corporal',
        itens: [
          { nome: 'Gordura localizada' },
          { nome: 'Flacidez' },
          { nome: 'Celulite' },
          { nome: 'Contorno corporal' },
          { nome: 'Drenagem', desc: 'Técnica manual de movimentos leves e ritmados.' },
          { nome: 'Protocolos personalizados', desc: 'Combinação de técnicas montada para cada caso.' },
        ],
      },
    ],
  },

  {
    id: 'beleza',
    nome: 'Beleza',
    chamada: 'Cabelo, manicure e pedicure',
    texto:
      'Do corte à finalização, da coloração às mechas: o cabelo é cuidado por inteiro, com hidratação e reconstrução quando o fio pede. Nas mãos e nos pés, esmaltação tradicional ou em gel, blindagem, alongamento e os spas de mãos e pés.',
    pagina: '/servicos/#beleza',
    wa: 'beleza',
    cta: 'Agendar serviço de beleza',
    destaques: ['Corte', 'Coloração', 'Mechas', 'Escova', 'Esmaltação em gel', 'Alongamento', 'Spa dos pés'],
    grupos: [
      {
        id: 'cabelo',
        nome: 'Cabelo',
        wa: 'cabelo',
        itens: [
          { nome: 'Corte' },
          { nome: 'Escova' },
          { nome: 'Penteado' },
          { nome: 'Coloração' },
          { nome: 'Mechas' },
          { nome: 'Iluminação' },
          { nome: 'Hidratação' },
          { nome: 'Reconstrução' },
          { nome: 'Tratamentos' },
          { nome: 'Finalização' },
        ],
      },
      {
        id: 'manicure',
        nome: 'Manicure',
        wa: 'unhas',
        itens: [
          { nome: 'Manicure tradicional' },
          { nome: 'Esmaltação' },
          { nome: 'Esmaltação em gel', desc: 'Dura, em média, de 15 a 20 dias.' },
          { nome: 'Blindagem' },
          { nome: 'Alongamento' },
          { nome: 'Spa das mãos' },
        ],
      },
      {
        id: 'pedicure',
        nome: 'Pedicure',
        wa: 'unhas',
        itens: [
          { nome: 'Pedicure tradicional' },
          { nome: 'Esmaltação' },
          { nome: 'Esmaltação em gel' },
          { nome: 'Spa dos pés' },
          { nome: 'Cuidados especiais' },
        ],
      },
    ],
  },

  {
    id: 'relax-spa',
    nome: 'Relax & Spa',
    chamada: 'Massagens e drenagem',
    texto:
      'Técnicas manuais para desacelerar e cuidar do corpo, feitas no mesmo ambiente intimista dos outros atendimentos da casa.',
    pagina: '/servicos/#relax-spa',
    wa: 'relax',
    cta: 'Agendar massagem ou drenagem',
    destaques: ['Drenagem linfática', 'Massagem relaxante', 'Liberação miofascial terapêutica', 'Reflexologia podal'],
    grupos: [
      {
        id: 'relax',
        nome: 'Relax & Spa',
        itens: [
          { nome: 'Drenagem linfática', desc: 'Movimentos manuais leves, lentos e ritmados.' },
          { nome: 'Massagem relaxante', desc: 'Toque contínuo e ritmo calmo, para desacelerar.' },
          {
            nome: 'Liberação miofascial terapêutica',
            desc: 'Pressão manual sustentada sobre a musculatura e a fáscia.',
          },
          { nome: 'Reflexologia podal', desc: 'Pressão em pontos específicos dos pés.' },
        ],
      },
    ],
  },

  {
    id: 'sobrancelhas-e-cilios',
    nome: 'Sobrancelhas e cílios',
    chamada: 'Beleza e cuidado',
    texto:
      'O desenho da sobrancelha pensado para o rosto de cada pessoa, com ou sem tintura, e a extensão de cílios.',
    pagina: '/servicos/#sobrancelhas-e-cilios',
    wa: 'sobrancelhas',
    cta: 'Agendar sobrancelhas ou cílios',
    destaques: ['Design de sobrancelhas', 'Design de sobrancelhas com tintura', 'Limpeza de sobrancelhas', 'Extensão de cílios'],
    grupos: [
      {
        id: 'sobrancelhas-cilios',
        nome: 'Sobrancelhas e cílios',
        itens: [
          { nome: 'Design de sobrancelhas com tintura' },
          { nome: 'Design de sobrancelhas' },
          { nome: 'Limpeza de sobrancelhas' },
          { nome: 'Extensão de cílios' },
        ],
      },
    ],
  },
];
