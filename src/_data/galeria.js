/**
 * Galeria.
 *
 * Cada foto: categoria, texto alternativo, legenda e a linha `imagem:` que o
 * `npm run images` imprime. A página /galeria/ cria um filtro por categoria
 * automaticamente — só para as categorias que tiverem pelo menos uma foto.
 *
 * Para adicionar uma foto:
 *   1. salve o original em fotos/galeria/ com nome descritivo
 *      (ex.: fotos/galeria/ambiente-recepcao.jpg);
 *   2. rode `npm run images`;
 *   3. copie a linha `imagem:` para um item novo aqui e escreva o `alt`
 *      descrevendo o que a foto mostra (para quem não enxerga).
 *
 * Origem das fotos atuais: posts do Instagram @casaeme_moema, recortados de
 * prints (sem a interface do aplicativo — ver tools/images.js).
 *
 * `confirmar: true` marca foto cuja autoria precisa ser confirmada com a casa
 * antes de publicar (ver README → "Pendências"). Enquanto marcada, ela aparece
 * normalmente — o campo existe para a revisão não esquecer dela.
 */
const categorias = {
  ambiente: 'Ambiente',
  cabelo: 'Cabelo',
  unhas: 'Unhas',
  estetica: 'Estética',
  'saude-capilar': 'Saúde capilar',
  'bem-estar': 'Bem-estar',
};

export default {
  categorias,
  fotos: [
    {
      categoria: 'cabelo',
      alt: 'Antes e depois de finalização, vista de costas: cabelo longo com mechas caramelo, liso e sem movimento à esquerda; com ondas largas e volume à direita.',
      legenda: 'Finalização em ondas — antes e depois',
      imagem: { pasta: 'galeria', arquivo: 'cabelo-ondas-antes-depois', larguras: [480, 719], largura: 719, altura: 766 },
    },
    {
      categoria: 'unhas',
      alt: 'Mão com unhas quadradas em francesinha: base rosada translúcida e pontas brancas, anel de coração no dedo anelar.',
      legenda: 'Esmaltação em gel — francesinha',
      confirmar: true,
      imagem: { pasta: 'galeria', arquivo: 'unhas-francesinha-gel', larguras: [480, 720], largura: 720, altura: 760 },
    },
    {
      categoria: 'cabelo',
      alt: 'Antes e depois de escova, vista de costas: cabelo castanho com mechas, ondulado e com volume desalinhado à esquerda; liso, alinhado e com brilho à direita.',
      legenda: 'Escova — antes e depois',
      imagem: { pasta: 'galeria', arquivo: 'cabelo-escova-antes-depois', larguras: [480, 720], largura: 720, altura: 656 },
    },
    {
      categoria: 'unhas',
      alt: 'Mão com unhas curtas amendoadas alternando esmalte preto brilhante e efeito tartaruga em tons de âmbar.',
      legenda: 'Esmaltação — preto e tartaruga',
      confirmar: true,
      imagem: { pasta: 'galeria', arquivo: 'unhas-esmaltacao-tartaruga', larguras: [480, 719], largura: 719, altura: 480 },
    },
  ],

  /**
   * As duas "janelas" circulares da primeira dobra da home. São recortes das
   * fotos acima (ver DERIVADOS em tools/images.js). Quando chegarem fotos do
   * ambiente, uma delas pode virar a fachada ou a recepção.
   */
  janelas: {
    principal: {
      alt: 'Detalhe de cabelo longo em ondas, em tons de caramelo e mel.',
      sizes: '(min-width: 64rem) 22.5rem, (min-width: 30rem) 18rem, 15rem',
      imagem: { pasta: 'janela', arquivo: 'ondas-caramelo', larguras: [357], largura: 357, altura: 357 },
    },
    secundaria: {
      alt: 'Detalhe de unhas em francesinha, com pontas brancas.',
      imagem: { pasta: 'janela', arquivo: 'francesinha', larguras: [360, 420], largura: 420, altura: 420 },
    },
  },
};
