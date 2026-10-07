import business from './business.js';
import hours from './hours.js';
import assinaturas from './assinaturas.js';

/**
 * Perguntas frequentes, em grupos.
 *
 * As respostas usam SÓ o que a Casa EME informou. Onde a informação não
 * existe (valores avulsos, duração de sessão, estacionamento, formas de
 * pagamento), a resposta encaminha para o WhatsApp em vez de supor.
 *
 * Campos:
 *  id   âncora (/perguntas-frequentes/#id) — dá para mandar o link direto
 *  p    pergunta
 *  r    resposta. Pode ter link interno simples (<a href="/...">).
 *  em   onde mais a pergunta aparece: 'home', 'estetica', 'capilar',
 *       'servicos', 'contato'. A página de dúvidas mostra todas.
 *
 * A marcação FAQPage (dados estruturados) é gerada a partir daqui e sai só
 * na página /perguntas-frequentes/.
 */

const planos = assinaturas.planos.map((plano) => `${plano.nome} (${plano.inclui.join(' e ')})`).join('; ');

export default [
  {
    grupo: 'Agendamento e horários',
    id: 'agendamento',
    perguntas: [
      {
        id: 'como-agendar',
        p: 'Como faço para agendar?',
        r: `Pelo WhatsApp ${business.whatsapp.display}. Conte qual serviço você procura e o melhor dia para você; a equipe responde com os horários disponíveis.`,
        em: ['home', 'contato'],
      },
      {
        id: 'agendamento-whatsapp',
        p: 'O agendamento é feito pelo WhatsApp?',
        r: 'Sim, o WhatsApp é o canal de agendamento da Casa EME. Os botões do site abrem a conversa com uma mensagem já escrita para o serviço que você estava vendo — é só enviar.',
        em: ['contato'],
      },
      {
        id: 'horario',
        p: 'Qual o horário de funcionamento?',
        r: `${hours.resumo} Domingo e segunda, a casa fica fechada. ${hours.nota}`,
        em: ['home', 'contato'],
      },
      {
        id: 'sabado',
        p: 'A Casa EME atende aos sábados?',
        r: 'Sim. Aos sábados, a Casa EME atende das 9h às 19h.',
        em: ['contato'],
      },
    ],
  },
  {
    grupo: 'Quem atende',
    id: 'quem-atende',
    perguntas: [
      {
        id: 'quem-faz-os-tratamentos',
        p: 'Quem faz os tratamentos de saúde capilar?',
        r: 'A Dra. Rejane Rabelo, biomédica esteta (CRBM 13690). Ela conduz a avaliação, em quatro etapas, e estrutura o protocolo de cada paciente.',
        em: ['home', 'capilar', 'contato'],
      },
      {
        id: 'formacao-dra-rejane',
        p: 'Qual é a formação da Dra. Rejane Rabelo?',
        r: 'Ela é biomédica esteta (CRBM 13690) e biomédica patologista, com pós-graduação em estética avançada. Entre os cursos de aperfeiçoamento que ela lista estão uma pós-graduação pelo IOA, Instituto Orofacial das Américas, e cursos de suplementação injetável e exames laboratoriais, PRP, tricologia e metabolismo capilar.',
        em: ['capilar'],
      },
    ],
  },
  {
    grupo: 'Localização',
    id: 'localizacao',
    perguntas: [
      {
        id: 'onde-fica',
        p: 'Onde fica a Casa EME?',
        r: `Na ${business.address.street}, ${business.address.district}, em ${business.address.neighborhood}, ${business.address.city} – ${business.address.state}, CEP ${business.address.zip}.`,
        em: ['home', 'contato'],
      },
      {
        id: 'como-chegar-a-casa-eme',
        p: 'Como chegar à Casa EME?',
        r: `A casa fica na ${business.address.street}, no trecho de Moema conhecido como Moema Pássaros — onde as ruas levam nomes de pássaros. Na página de <a href="/contato/">contato</a>, o botão "Traçar rota" abre o caminho no Google Maps a partir de onde você estiver.`,
        em: ['contato'],
      },
    ],
  },
  {
    grupo: 'Beleza',
    id: 'beleza',
    perguntas: [
      {
        id: 'servicos-de-cabelo',
        p: 'Quais serviços de cabelo são oferecidos?',
        r: 'Corte, escova, penteado, coloração, mechas, iluminação, hidratação, reconstrução, tratamentos e finalização. A lista completa está em <a href="/servicos/#beleza">Serviços</a>.',
        em: ['servicos'],
      },
      {
        id: 'manicure-pedicure',
        p: 'A Casa EME oferece manicure e pedicure?',
        r: 'Sim. Na manicure: tradicional, esmaltação, esmaltação em gel, blindagem, alongamento e spa das mãos. Na pedicure: tradicional, esmaltação, esmaltação em gel, spa dos pés e cuidados especiais.',
        em: ['servicos'],
      },
      {
        id: 'esmaltacao-gel',
        p: 'Quanto dura a esmaltação em gel?',
        r: 'Em média, de 15 a 20 dias.',
        em: ['servicos'],
      },
      {
        id: 'sobrancelhas-e-cilios-na-casa',
        p: 'Há serviços de sobrancelhas e cílios?',
        r: 'Sim: design de sobrancelhas, design de sobrancelhas com tintura, limpeza de sobrancelhas e extensão de cílios.',
        em: ['servicos'],
      },
    ],
  },
  {
    grupo: 'Assinaturas',
    id: 'assinaturas',
    perguntas: [
      {
        id: 'o-que-sao-assinaturas',
        p: 'Como funcionam as assinaturas?',
        r: `São planos mensais que reúnem serviços de unhas, escova ou retoque de raiz: ${planos}. Os valores estão em <a href="/servicos/#assinaturas">Serviços</a>.`,
        em: ['servicos'],
      },
      {
        id: 'condicoes-assinaturas',
        p: 'As assinaturas valem em qualquer dia?',
        r: `Não. Conforme divulgado pela Casa EME, as assinaturas valem de terça a quinta, por 30 dias, com renovação automática. Para assinar ou tirar dúvidas sobre as condições, fale pelo WhatsApp.`,
        em: ['servicos'],
      },
    ],
  },
  {
    grupo: 'Estética avançada',
    id: 'estetica',
    perguntas: [
      {
        id: 'procedimentos-estetica',
        p: 'Quais procedimentos de estética avançada são oferecidos?',
        r: 'No rosto: toxina botulínica, preenchimento, bioestimuladores, skinbooster, microagulhamento, rejuvenescimento e tratamentos para a qualidade da pele. No corpo: tratamentos para gordura localizada, flacidez, celulite e contorno corporal, drenagem e protocolos personalizados. Veja em <a href="/estetica-avancada/">Estética avançada</a>.',
        em: ['estetica', 'home'],
      },
      {
        id: 'como-funciona-avaliacao',
        p: 'Como funciona uma avaliação?',
        r: 'É o primeiro passo na estética avançada e na saúde capilar: uma conversa sobre o que você procura e uma análise da pele, do corpo ou do couro cabeludo, conforme o caso. É a partir dela que se define se há indicação e qual protocolo faz sentido. Para saber duração e valor da avaliação, pergunte pelo WhatsApp.',
        em: ['estetica', 'capilar'],
      },
      {
        id: 'protocolo-personalizado',
        p: 'É possível montar um protocolo personalizado?',
        r: 'Sim. Na estética corporal há protocolos personalizados, e na saúde capilar o tratamento segue um plano individualizado — nos dois casos, definidos depois da avaliação de cada pessoa.',
        em: ['estetica', 'capilar'],
      },
      {
        id: 'resultado',
        p: 'Dá para saber o resultado antes do procedimento?',
        r: 'Não com certeza: cada organismo responde de um jeito, e todo procedimento tem indicações, limites e cuidados próprios. Por isso a Casa EME não promete resultado, e nenhum tratamento começa sem avaliação individual.',
        em: ['estetica'],
      },
    ],
  },
  {
    grupo: 'Saúde capilar',
    id: 'capilar',
    perguntas: [
      {
        id: 'avaliacao-capilar',
        p: 'Como é a avaliação capilar?',
        r: 'É feita pela Dra. Rejane Rabelo, em quatro etapas: a consulta, com anamnese (a conversa sobre histórico, hábitos e queixas); o exame físico do couro cabeludo e dos fios; o registro fotográfico; e, por último, a estruturação do protocolo de tratamento. Saiba mais em <a href="/saude-capilar/">Saúde capilar</a>.',
        em: ['capilar', 'home'],
      },
      {
        id: 'tratamentos-capilares',
        p: 'Quais tratamentos capilares estão disponíveis?',
        r: 'Tratamentos para alopecias, dermatite e inflamações do couro cabeludo, queda de cabelo, afinamento dos fios e falta de crescimento, com recursos como microagulhamento capilar, terapias capilares, protocolos injetáveis e o Protocolo Capilaris. Há ainda recuperação da fibra capilar, cuidados de pré e pós-procedimento e acompanhamento da evolução.',
        em: ['capilar'],
      },
      {
        id: 'dermatite-couro-cabeludo',
        p: 'A Dra. Rejane atende dermatite no couro cabeludo?',
        r: 'Dermatite e outras inflamações do couro cabeludo estão entre as queixas capilares que a Dra. Rejane Rabelo atende, sempre a partir da avaliação, com exame do couro cabeludo. Diagnóstico de doença e receita de remédio são com o médico: esse cuidado não substitui o acompanhamento com dermatologista.',
        em: ['capilar', 'home'],
      },
      {
        id: 'quantas-sessoes',
        p: 'Quantas sessões vou precisar fazer?',
        r: 'Depende da avaliação. O número de sessões muda conforme o quadro e a resposta de cada pessoa, fica definido no protocolo e pode ser revisto ao longo do tratamento, com a ajuda das fotos de acompanhamento.',
        em: ['capilar', 'emagrecimento'],
      },
      {
        id: 'registro-fotografico',
        p: 'Para que serve o registro fotográfico?',
        r: 'É a terceira etapa da avaliação. As fotos marcam o ponto de partida e permitem comparar a evolução nas sessões seguintes, sem depender só da impressão no espelho.',
        em: ['capilar'],
      },
      {
        id: 'capilar-medico',
        p: 'O tratamento capilar substitui o dermatologista?',
        r: 'Não. Queda de cabelo e alopecias podem ter causas clínicas que pedem investigação médica. O cuidado capilar da Casa EME não substitui o acompanhamento com um dermatologista.',
        em: ['capilar'],
      },
    ],
  },
  {
    grupo: 'Emagrecimento',
    id: 'emagrecimento',
    perguntas: [
      {
        id: 'tratamento-emagrecimento',
        p: 'A Casa EME tem tratamento para emagrecimento?',
        r: 'Tem. O atendimento começa por uma avaliação individual e pode incluir protocolos corporais para gordura localizada, flacidez, celulite e contorno. Saiba mais em <a href="/emagrecimento/">Emagrecimento</a>.',
        em: ['home', 'emagrecimento'],
      },
      {
        id: 'emagrecimento-acompanhamento-medico',
        p: 'O emagrecimento na Casa EME substitui o médico ou o nutricionista?',
        r: 'Não. Os protocolos da casa não substituem o acompanhamento médico e nutricional; eles podem caminhar junto com ele.',
        em: ['emagrecimento'],
      },
    ],
  },
  {
    grupo: 'Relax & Spa',
    id: 'relax',
    perguntas: [
      {
        id: 'drenagem-massagem',
        p: 'A Casa EME oferece drenagem e massagens?',
        r: 'Sim: drenagem linfática, massagem relaxante, liberação miofascial terapêutica e reflexologia podal.',
        em: ['servicos'],
      },
    ],
  },
];
