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
 * Origem das quatro primeiras fotos: posts do Instagram @casaeme_moema,
 * recortados de prints (sem a interface do aplicativo — ver tools/images.js).
 *
 * Os casos de antes e depois (casos.js) entram no fim da lista sozinhos, nas
 * categorias "Saúde capilar" e "Estética", com o aviso do conselho e, quando
 * informado, o crédito de quem atendeu.
 * Para mudar um deles, edite casos.js — não este arquivo.
 *
 * `confirmar: true` marca foto cuja autoria precisa ser confirmada com a casa
 * antes de publicar (ver README → "Pendências"). Enquanto marcada, ela aparece
 * normalmente — o campo existe para a revisão não esquecer dela.
 */
import casos from './casos.js';

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
    ...casos.itens.map((caso) => ({
      categoria: caso.area === 'capilar' ? 'saude-capilar' : 'estetica',
      alt: caso.alt,
      legenda: caso.layout === 'empilhado' ? `${caso.titulo} — antes (em cima) e depois (embaixo)` : `${caso.titulo} — antes e depois`,
      credito: caso.creditado ? casos.creditoFoto : '',
      aviso: casos.aviso,
      imagem: caso.imagem,
    })),
  ],

  /**
   * As duas "janelas" circulares da primeira dobra da home. São recortes das
   * fotos acima (ver DERIVADOS em tools/images.js). Quando chegarem fotos do
   * ambiente, uma delas pode virar a fachada ou a recepção.
   */
  janelas: {
    /* Foto da arte "Cuidado que vai além da beleza", enviada pela casa para a
       primeira dobra. É uma imagem de campanha (a mesma modelo aparece na
       arte das assinaturas): o alt não a apresenta como cliente. */
    principal: {
      alt: 'Mulher sorrindo, de cabelo preso, com a mão apoiada no queixo.',
      sizes: '(min-width: 64rem) 26rem, (min-width: 30rem) 20rem, 16rem',
      imagem: { pasta: 'janela', arquivo: 'mulher-sorrindo', larguras: [360, 650], largura: 650, altura: 650 },
    },
    /* Retrato da Dra. Rejane Rabelo, quem atende na saúde capilar. O nome
       vem escrito logo ao lado (legenda da janela), por isso o alt não o repete. */
    secundaria: {
      alt: 'Retrato de rosto, sorriso leve, cabelo escuro e longo, brinco dourado e blazer branco.',
      imagem: { pasta: 'janela', arquivo: 'dra-rejane', larguras: [360, 460], largura: 460, altura: 460 },
    },
    /* As janelas anteriores (ondas e francesinha) continuam geradas por
       tools/images.js, caso a casa queira voltar a usá-las. */
  },
};
