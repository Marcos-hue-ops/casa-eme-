/**
 * Botão fixo do WhatsApp.
 *
 * Aparece quando o botão principal da página não está na tela. Enquanto os
 * dois estariam visíveis juntos, o fixo seria a mesma ação duas vezes.
 *
 * Referência: o elemento com [data-wa-gatilho] (o botão da primeira dobra na
 * home, o do WhatsApp na página de contato). Nas outras páginas, a abertura —
 * o botão surge assim que ela sai da tela.
 */
export function flutuante() {
  const botao = document.querySelector('[data-wa-fixo]');
  if (!botao) return;

  const gatilho = document.querySelector('[data-wa-gatilho]') || document.querySelector('.abertura');

  if (!gatilho || !('IntersectionObserver' in window)) {
    botao.classList.add('is-vis');
    return;
  }

  new IntersectionObserver(([entrada]) => botao.classList.toggle('is-vis', !entrada.isIntersecting), {
    threshold: 0,
  }).observe(gatilho);
}
