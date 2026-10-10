/**
 * Perguntas frequentes.
 *
 * O <details> já abre e fecha sozinho — este módulo só acrescenta a animação
 * de altura e fecha a pergunta aberta do mesmo bloco, para que a lista não
 * vire uma parede de texto. Sem JavaScript tudo funciona, sem transição.
 */
export function faq() {
  const blocos = document.querySelectorAll('[data-faq]');
  if (!blocos.length) return;

  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ESPERA = 240;

  const animar = (resposta, de, para) => {
    if (menosMovimento.matches || typeof resposta.animate !== 'function') return;
    resposta.animate(
      { blockSize: [`${de}px`, `${para}px`], opacity: de > para ? [1, 0.3] : [0.3, 1] },
      { duration: 260, easing: 'cubic-bezier(.22,.61,.36,1)' }
    );
  };

  const fechar = (item) => {
    const resposta = item.querySelector('.faq__r');
    if (resposta) animar(resposta, resposta.scrollHeight, 0);
    setTimeout(() => {
      item.open = false;
    }, menosMovimento.matches ? 0 : ESPERA);
  };

  blocos.forEach((bloco) => {
    const itens = [...bloco.querySelectorAll('.faq__item')];

    itens.forEach((item) => {
      const resumo = item.querySelector('summary');
      const resposta = item.querySelector('.faq__r');
      if (!resumo || !resposta) return;

      resumo.addEventListener('click', (evento) => {
        evento.preventDefault();
        if (item.open) {
          fechar(item);
          return;
        }
        itens.filter((outro) => outro !== item && outro.open).forEach(fechar);
        item.open = true;
        animar(resposta, 0, resposta.scrollHeight);
      });
    });
  });

  /* Link direto para uma pergunta (#como-agendar): abre e rola até ela.
     Serve para mandar a resposta pronta pelo WhatsApp. */
  const abrirPorHash = () => {
    if (location.hash.length < 2) return;
    let alvo = null;
    try {
      alvo = document.querySelector(decodeURIComponent(location.hash));
    } catch {
      return;
    }
    if (alvo instanceof HTMLDetailsElement && alvo.classList.contains('faq__item')) alvo.open = true;
  };

  abrirPorHash();
  window.addEventListener('hashchange', abrirPorHash);
}
