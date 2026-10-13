/**
 * Ampliação de foto.
 *
 * Usa <dialog>: prisão de foco, Esc e devolução do foco ao botão que abriu
 * são do navegador. O módulo troca a imagem, a legenda e permite passar de
 * uma foto para a outra dentro do mesmo grupo ([data-lupa-grupo]) — com as
 * setas da tela, as setas do teclado ou deslizando o dedo.
 */
export function lupa() {
  const dialogo = document.querySelector('[data-lupa-dialogo]');
  if (!dialogo || typeof dialogo.showModal !== 'function') return;

  const imagem = dialogo.querySelector('[data-lupa-img]');
  const legenda = dialogo.querySelector('[data-lupa-texto]');
  const conta = dialogo.querySelector('[data-lupa-conta]');
  const anterior = dialogo.querySelector('[data-lupa-ant]');
  const proxima = dialogo.querySelector('[data-lupa-prox]');

  let grupo = [];
  let atual = 0;

  const visiveis = (lista) => lista.filter((botao) => botao.getClientRects().length);

  const mostrar = (indice) => {
    if (!grupo.length) return;
    atual = (indice + grupo.length) % grupo.length;
    const botao = grupo[atual];
    const origem = botao.querySelector('img');
    imagem.src = botao.dataset.lupa || origem?.currentSrc || origem?.src || '';
    imagem.alt = origem?.alt || '';
    legenda.textContent = botao.dataset.lupaLegenda || origem?.alt || '';
    conta.textContent = grupo.length > 1 ? `${atual + 1} / ${grupo.length}` : '';
    anterior.hidden = proxima.hidden = grupo.length < 2;
  };

  document.querySelectorAll('[data-lupa]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const container = botao.closest('[data-lupa-grupo]');
      grupo = visiveis(container ? [...container.querySelectorAll('[data-lupa]')] : [botao]);
      mostrar(Math.max(0, grupo.indexOf(botao)));
      dialogo.showModal();
    });
  });

  anterior?.addEventListener('click', () => mostrar(atual - 1));
  proxima?.addEventListener('click', () => mostrar(atual + 1));
  dialogo.querySelector('[data-lupa-fechar]')?.addEventListener('click', () => dialogo.close());

  dialogo.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') mostrar(atual - 1);
    if (evento.key === 'ArrowRight') mostrar(atual + 1);
  });

  /* Clique fora da foto fecha — o alvo é o próprio <dialog> só na área vazia. */
  dialogo.addEventListener('click', (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });

  /* Deslizar o dedo para os lados troca de foto. */
  let inicioX = null;
  dialogo.addEventListener('touchstart', (evento) => {
    inicioX = evento.touches[0]?.clientX ?? null;
  }, { passive: true });
  dialogo.addEventListener('touchend', (evento) => {
    if (inicioX === null) return;
    const delta = (evento.changedTouches[0]?.clientX ?? inicioX) - inicioX;
    if (Math.abs(delta) > 50) mostrar(atual + (delta < 0 ? 1 : -1));
    inicioX = null;
  });

  dialogo.addEventListener('close', () => {
    imagem.removeAttribute('src');
  });
}
