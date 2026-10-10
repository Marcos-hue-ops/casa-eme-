/**
 * Entrada de elementos ao aparecer na tela — uma vez por elemento.
 *
 * Quem pede menos movimento recebe tudo visível de imediato, sem observador.
 * O observador fica no próprio elemento, que nunca tem área zero (só
 * opacidade e um deslocamento curto): assim ele é sempre reportado.
 */
export function revelar() {
  const alvos = document.querySelectorAll('.reveal');
  if (!alvos.length) return;

  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (menosMovimento.matches || !('IntersectionObserver' in window)) {
    alvos.forEach((alvo) => alvo.classList.add('is-vis'));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-vis');
        observador.unobserve(entrada.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
  );

  alvos.forEach((alvo) => observador.observe(alvo));
}
