/**
 * Descrição e chamada da página de privacidade — dependem de o Google
 * Analytics estar ligado no build (src/_data/analytics.js). Ficam aqui, e não
 * no front matter, porque o front matter não tem condição.
 */
import analytics from './_data/analytics.js';

export default analytics.ativo
  ? {
      description:
        'Como o site da Casa EME usa o Google Analytics, só se você aceitar, e como funcionam o WhatsApp, o Instagram e o mapa. Seus direitos pela LGPD.',
      chamadaPagina:
        'O que o site coleta, para quê, com quem compartilha e como mudar de ideia a qualquer momento.',
    }
  : {
      description:
        'O site da Casa EME não usa cookies, não tem formulário e não coleta dados de quem visita. Veja como funcionam o WhatsApp, o Instagram e o mapa.',
      chamadaPagina: 'Curto, porque há pouco a dizer — este site não coleta dados de quem o visita.',
    };
