/**
 * "Por que Casa EME?" — o detalhe que acompanha a rolagem.
 *
 * No desktop, o M grande fica parado enquanto a lista passa. Quando um item
 * cruza o meio da tela, ele vira o "ativo": a palavra ao lado do M troca
 * ("de Mulher", "de Movimento"...) e o contador avança. É o nome da casa
 * sendo soletrado pelo manifesto que ela mesma escreveu.
 *
 * Só liga em telas largas e sem pedido de movimento reduzido. Em qualquer
 * outro caso a seção é uma lista comum, com todo o texto visível.
 */
export function manifesto() {
  const secao = document.querySelector('[data-manifesto]');
  if (!secao || !('IntersectionObserver' in window)) return;

  const largo = window.matchMedia('(min-width: 64rem)');
  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  const palavra = secao.querySelector('[data-manifesto-palavra]');
  const contador = secao.querySelector('[data-manifesto-conta]');
  const itens = [...secao.querySelectorAll('.manifesto__item')];
  if (!palavra || !itens.length) return;

  let observador = null;
  let timer = null;

  const ativar = (item) => {
    if (item.classList.contains('is-ativo')) return;
    itens.forEach((outro) => outro.classList.toggle('is-ativo', outro === item));
    const indice = itens.indexOf(item);
    const nova = item.dataset.palavra || '';
    if (contador) contador.textContent = String(Math.min(indice + 1, itens.length - 1) || 1).padStart(2, '0');

    clearTimeout(timer);
    palavra.classList.add('is-trocando');
    timer = setTimeout(() => {
      palavra.textContent = nova;
      palavra.classList.remove('is-trocando');
    }, 220);
  };

  const ligar = () => {
    if (observador) return;
    secao.classList.add('is-ligado');
    observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) ativar(entrada.target);
        });
      },
      /* Uma faixa fina no meio da tela: só um item por vez cabe nela. */
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    itens.forEach((item) => observador.observe(item));
    ativar(itens[0]);
  };

  const desligar = () => {
    observador?.disconnect();
    observador = null;
    secao.classList.remove('is-ligado');
    itens.forEach((item) => item.classList.remove('is-ativo'));
  };

  const decidir = () => (largo.matches && !menosMovimento.matches ? ligar() : desligar());
  decidir();
  largo.addEventListener('change', decidir);
  menosMovimento.addEventListener('change', decidir);
}
