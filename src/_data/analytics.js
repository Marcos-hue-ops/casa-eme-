/**
 * Google Analytics 4 — só para quem aceitar.
 *
 * O ID de métricas (G-XXXXXXXXXX) vem da variável de ambiente
 * GA_MEASUREMENT_ID, lida no build. A Hostinger não roda build: quem gera o
 * site é a automação .github/workflows/hostinger.yml, e é nela que o ID
 * entra (README → "Analytics"). Na Vercel, a variável vai em Settings →
 * Environment Variables.
 *
 * Sem ID, o site sai exatamente como era antes do Analytics: sem aviso de
 * cookies, sem botão de preferências, sem domínio do Google na CSP e com a
 * página de privacidade dizendo que nada é coletado.
 *
 * Com ID, cada página leva o aviso de cookies, e o script do Google só é
 * baixado depois que a pessoa toca em "Aceitar" (assets/js/modules/cookies.js).
 * O ID não é segredo: ele aparece no HTML de qualquer site que usa o GA4.
 */
const id = (process.env.GA_MEASUREMENT_ID || '').trim();

if (id && !/^G-[A-Z0-9]{4,15}$/.test(id)) {
  throw new Error(
    `GA_MEASUREMENT_ID inválido: "${id}". Use o ID de métricas do fluxo de dados da web do GA4, ` +
      'no formato G-XXXXXXXXXX (Administrador → Fluxos de dados → o site).'
  );
}

export default {
  id,
  ativo: Boolean(id),

  /**
   * Versão do aviso. Quando mudar o que o site coleta ou com quem compartilha,
   * suba o número: a escolha antiga deixa de valer e o aviso aparece de novo
   * para todo mundo.
   */
  versao: 1,

  /** Depois deste prazo, a pergunta é feita de novo. */
  validadeDias: 365,

  /**
   * Origens que a CSP libera quando o Analytics está ligado — as do guia de
   * CSP do Google para o GA4. `script-src` só precisa do endereço do gtag.js;
   * o envio dos dados usa servidores regionais (region1.google-analytics.com e
   * afins), por isso o curinga em `connect-src` e `img-src`.
   */
  csp: id
    ? {
        script: ['https://www.googletagmanager.com'],
        connect: [
          'https://*.google-analytics.com',
          'https://*.analytics.google.com',
          'https://*.googletagmanager.com',
        ],
        img: ['https://*.google-analytics.com', 'https://*.googletagmanager.com'],
      }
    : { script: [], connect: [], img: [] },
};
