/**
 * Prova social.
 *
 * `itens` traz depoimentos reais, enviados pela casa, sem alterar o sentido:
 *  • tipo 'video': o arquivo, a capa e as legendas ficam em src/assets/video/
 *    (ver tools/video.js). `transcricao` é o texto falado, que aparece na
 *    página para quem não pode ou não quer ouvir. `trecho` é a frase em
 *    destaque — sempre uma frase que a pessoa disse, inteira.
 *  • tipo 'texto': `texto` é o depoimento como foi publicado pela casa.
 *
 * Nunca invente, resuma com outras palavras ou junte depoimentos diferentes.
 * Nome só se a casa informou. Nota média e número de avaliações não entram.
 *
 * `destaques` são os pontos que, segundo a Casa EME, mais se repetem nas
 * avaliações das clientes. Aparecem como temas, sem aspas e sem nome.
 */
export default {
  itens: [
    {
      tipo: 'video',
      autor: 'Paciente do tratamento capilar',
      contexto: 'Depoimento em vídeo, 48 segundos',
      trecho: 'Estou bem feliz. Recomendo demais o trabalho dela.',
      video: {
        mp4: '/assets/video/depoimento-capilar.mp4',
        legendas: '/assets/video/depoimento-capilar.vtt',
        duracao: 'PT48S',
        /** Data em que o vídeo entrou no site (AAAA-MM-DD). */
        publicadoEm: '2026-10-06',
        largura: 464,
        altura: 832,
        capa: { pasta: 'video', arquivo: 'depoimento-capilar', larguras: [320, 464], largura: 464, altura: 832 },
      },
      /**
       * Transcrição automática feita localmente e revisada. "Doutora Rejane"
       * foi corrigido pelo contexto (o reconhecimento de voz ouviu "Regiane").
       * Confirmar com a casa — README → Pendências.
       */
      transcricao:
        'Olá, passando para agradecer o tratamento e o trabalho realizado pela doutora Rejane, através de um tratamento capilar realizado por ela. Um mês atrás, mais ou menos, eu procurei o atendimento dela devido a uma queda acentuada dos fios de cabelo e, por indicação de uma amiga, acabei conhecendo o trabalho dela. Em apenas 10 sessões, nós conseguimos um resultado fantástico, bloqueando a queda e mantendo os fios que já existiam no couro cabeludo. E, além disso, a gente conseguiu aumentar o volume capilar, mantendo uma apresentação bem bacana. Estou bem feliz. Recomendo demais o trabalho dela e desejo sucesso aí para os clientes dela, para os pacientes que venham buscar o trabalho dela. Forte abraço, doutora Rejane, tudo de bom.',
    },
    {
      tipo: 'texto',
      autor: 'Aron Menczer',
      /* O original, em inglês, saiu numa arte da Dra. Rejane Rabelo, com a
         tradução abaixo. A foto que acompanhava o texto na arte não é usada. */
      contexto: 'Avaliação escrita em inglês; tradução publicada pela Dra. Rejane Rabelo',
      paragrafos: [
        'Sofri com a queda de cabelo por muito tempo e tentei diversas coisas sem realmente ver os resultados que esperava. Depois de apenas alguns tratamentos com a Rejane, comecei a notar uma diferença real, e a queda do meu cabelo diminuiu visivelmente. Só isso já fez uma diferença enorme para mim.',
        'O que realmente se destaca na Rejane é o quanto ela se importa de verdade com seus clientes. Ela se empenha muito para garantir que o procedimento ocorra da forma mais tranquila e indolor possível, e está sempre presente depois, acompanhando e certificando-se de que a recuperação esteja indo bem.',
        'Percebe-se que ela realmente se importa e não vê você apenas como mais um cliente. Agradeço muito pela dedicação e atenção dela durante todo o processo. Recomendo muito!',
      ],
    },
  ],

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
};
