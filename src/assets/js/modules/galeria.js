/**
 * Filtro da galeria por categoria.
 *
 * Os botões só aparecem com JavaScript (o CSS os esconde em `.no-js`; sem
 * ele, todas as fotos ficam à vista, que é o estado certo). O filtro esconde
 * itens com `hidden`, e a ampliação só percorre as fotos visíveis.
 */
export function galeria() {
  const raiz = document.querySelector('[data-galeria]');
  const filtros = raiz?.querySelector('[data-filtros]');
  if (!raiz || !filtros) return;

  const grade = raiz.querySelector('.galeria__grade');
  const itens = [...raiz.querySelectorAll('[data-categoria]')];
  const botoes = [...filtros.querySelectorAll('[data-filtro]')];

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      const escolha = botao.dataset.filtro;
      botoes.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === botao)));
      itens.forEach((item) => {
        item.hidden = escolha !== 'todas' && item.dataset.categoria !== escolha;
      });
      grade?.classList.toggle('is-filtrada', escolha !== 'todas');
    });
  });
}
