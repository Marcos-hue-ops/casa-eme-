/**
 * Mapa sob clique.
 *
 * O iframe do Google Maps só existe depois que a pessoa pede. Antes disso o
 * Google não recebe o IP dela, não grava cookie e a página não baixa quase um
 * megabyte de mapa no carregamento. A capa diz isso em uma linha, antes do
 * clique — que é quando a informação serve para decidir.
 */
export function mapa() {
  document.querySelectorAll('[data-mapa]').forEach((caixa) => {
    const botao = caixa.querySelector('[data-mapa-abrir]');
    const src = caixa.dataset.mapa;
    if (!botao || !src) return;

    botao.addEventListener('click', () => {
      const quadro = document.createElement('iframe');
      quadro.src = src;
      quadro.title = 'Mapa com a localização da Casa EME, na Rua Pintassilgo, em Moema, São Paulo';
      quadro.loading = 'lazy';
      quadro.referrerPolicy = 'no-referrer';
      quadro.setAttribute('allowfullscreen', '');
      caixa.replaceChildren(quadro);
      /* O botão que tinha o foco sumiu: o foco vai para o mapa que entrou. */
      quadro.setAttribute('tabindex', '-1');
      quadro.focus({ preventScroll: true });
    });
  });
}
