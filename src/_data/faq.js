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
        em: ['home', 'servicos'],
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
        p: 'A Casa EME oferece avaliação capilar?',
        r: 'Sim. O diagnóstico reúne consulta capilar, avaliação do couro cabeludo e tricoscopia, e termina num plano individualizado. Saiba mais em <a href="/saude-capilar/">Saúde capilar</a>.',
        em: ['capilar', 'home'],
      },
      {
        id: 'tratamentos-capilares',
        p: 'Quais tratamentos capilares estão disponíveis?',
        r: 'Tratamentos para queda capilar, afinamento dos fios, alopecias e saúde do couro cabeludo, com microagulhamento capilar, terapias capilares e protocolos injetáveis. Há ainda recuperação da fibra capilar, cuidados de pré e pós-procedimento e acompanhamento da evolução.',
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
    grupo: 'Relax & Spa',
    id: 'relax',
    perguntas: [
      {
        id: 'drenagem-massagem',
        p: 'A Casa EME oferece drenagem e massagens?',
        r: 'Sim: drenagem linfática, massagem relaxante, liberação miofascial terapêutica e reflexologia podal.',
        em: ['home', 'servicos'],
      },
    ],
  },
];
