/**
 * Cabeçalho: fundo sólido a partir do primeiro scroll, e o painel de menu no
 * celular e no tablet.
 *
 * O estado sólido vem de um IntersectionObserver sobre uma sentinela de 1px
 * no topo — o navegador avisa quando muda, em vez de perguntarmos a cada
 * quadro de rolagem.
 */
export function cabecalho() {
  const cab = document.querySelector('[data-cab]');
  if (!cab) return;

  const sentinela = document.createElement('div');
  sentinela.setAttribute('aria-hidden', 'true');
  sentinela.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none';
  document.body.prepend(sentinela);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entrada]) => cab.classList.toggle('cab--solido', !entrada.isIntersecting),
      { threshold: 0 }
    ).observe(sentinela);
  } else {
    cab.classList.add('cab--solido');
  }

  /* Painel ---------------------------------------------------------------- */
  const botao = cab.querySelector('[data-menu]');
  const painel = document.querySelector('[data-painel]');
  if (!botao || !painel) return;

  const rotulo = botao.querySelector('.menu-btn__txt');
  let ultimoFoco = null;

  const abrir = () => {
    ultimoFoco = document.activeElement;
    painel.removeAttribute('inert');
    painel.classList.add('is-aberto');
    botao.setAttribute('aria-expanded', 'true');
    if (rotulo) rotulo.textContent = 'Fechar';
    document.body.classList.add('trava');
    painel.querySelector('a[href]')?.focus();
  };

  const fechar = ({ devolverFoco = true } = {}) => {
    painel.classList.remove('is-aberto');
    painel.setAttribute('inert', '');
    botao.setAttribute('aria-expanded', 'false');
    if (rotulo) rotulo.textContent = 'Menu';
    document.body.classList.remove('trava');
    if (devolverFoco && ultimoFoco instanceof HTMLElement) ultimoFoco.focus();
  };

  botao.addEventListener('click', () => (painel.classList.contains('is-aberto') ? fechar() : abrir()));

  /* Clique num link do painel: fecha (o link de âncora da mesma página
     precisa disso, os outros saem da página de qualquer jeito). */
  painel.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) fechar({ devolverFoco: false });
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && painel.classList.contains('is-aberto')) fechar();
  });

  /* Prende o Tab entre o botão de fechar e o painel enquanto ele está aberto. */
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Tab' || !painel.classList.contains('is-aberto')) return;
    const focaveis = [botao, ...painel.querySelectorAll('a[href], button:not([disabled])')];
    const primeiro = focaveis[0];
    const ultimo = focaveis.at(-1);
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  });

  /* Girar o tablet para paisagem pode passar da largura do menu: o painel
     some por CSS, e sem isto a rolagem ficaria travada. */
  window.matchMedia('(min-width: 75rem)').addEventListener('change', (evento) => {
    if (evento.matches && painel.classList.contains('is-aberto')) fechar({ devolverFoco: false });
  });
}
