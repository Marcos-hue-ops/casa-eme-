/**
 * Antes e depois — casos atendidos na Casa EME.
 *
 * Fotos enviadas pela casa (originais em fotos/casos/). Cada montagem já vem
 * com o "antes" em cima e o "depois" embaixo, exceto o painel do Protocolo
 * Capilaris, que junta dois registros (10 e 20 sessões) numa arte só. Desse
 * painel saíram o cabeçalho "Before/After" e as frases de propaganda do
 * rodapé da arte ("resultados visíveis" etc.), que o site não usa.
 *
 * O que NÃO se afirma aqui: qual procedimento foi feito em cada caso facial
 * (não foi informado), número de sessões além do que está escrito na própria
 * foto, ou qualquer promessa. A legenda descreve a região e o que se vê.
 *
 * Antes de publicar, confira com a casa que cada paciente autorizou o uso da
 * imagem por escrito (termo de autorização de uso de imagem) — ver README.
 *
 * Campos:
 *  area     'capilar' ou 'facial' (separa as seções e o filtro da galeria)
 *  titulo   legenda curta
 *  detalhe  uma linha sobre o que a foto mostra
 *  layout   'empilhado' (antes em cima, depois embaixo: o site escreve
 *           "Antes" e "Depois" sobre cada metade) ou 'montagem' (a foto já
 *           traz as próprias marcações e não recebe rótulo)
 *  imagem   linha gerada por `npm run images`
 */
export default {
  /** Quem assina os atendimentos — aparece junto das fotos. */
  credito: 'Atendimento: Dra. Rejane Rabelo, biomédica esteta · CRBM 13690',
  ressalva:
    'Fotos de pacientes atendidos na casa. Cada organismo responde de um jeito: o resultado de um caso não se repete igual em outro.',

  itens: [
    {
      area: 'capilar',
      titulo: 'Topo da cabeça, de abril a julho',
      detalhe: 'Mesma vista do couro cabeludo em 13 de abril e em 27 de julho.',
      layout: 'empilhado',
      alt: 'Antes e depois capilar, vista do topo da cabeça: em cima, em 13 de abril, cabelo escuro com o couro cabeludo aparente no alto da cabeça; embaixo, em 27 de julho, a mesma região mais coberta e com fios mais densos.',
      imagem: { pasta: 'casos', arquivo: 'capilar-topo-abril-julho', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'capilar',
      titulo: 'Protocolo Capilaris',
      detalhe: 'Registros de 10 e de 20 sessões, na montagem feita pela casa.',
      layout: 'montagem',
      alt: 'Montagem do Protocolo Capilaris com quatro fotos do topo da cabeça. À esquerda, duas fotos lado a lado, marcadas com 10 sessões: na primeira o couro cabeludo aparece mais, na segunda há mais fios. À direita, duas fotos uma sobre a outra, marcadas com 20 sessões: em cima o topo mais ralo, embaixo mais coberto.',
      imagem: { pasta: 'casos', arquivo: 'capilar-protocolo-capilaris', larguras: [480, 900], largura: 900, altura: 683 },
    },
    {
      area: 'facial',
      titulo: 'Glabela',
      detalhe: 'Linhas entre as sobrancelhas ao franzir a testa.',
      layout: 'empilhado',
      alt: 'Antes e depois da região entre as sobrancelhas, de frente: em cima, o rosto franzido com rugas marcadas na glabela e ao redor dos olhos; embaixo, a testa e a glabela lisas, com a expressão relaxada.',
      imagem: { pasta: 'casos', arquivo: 'facial-glabela', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'facial',
      titulo: 'Contorno dos olhos',
      detalhe: 'Linhas ao lado dos olhos ao sorrir.',
      layout: 'empilhado',
      alt: 'Antes e depois do contorno dos olhos, mulher sorrindo de perfil, virada para a esquerda: em cima, linhas marcadas ao lado do olho e na bochecha; embaixo, a mesma região com as linhas mais suaves.',
      imagem: { pasta: 'casos', arquivo: 'facial-olhos-perfil-esquerdo', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'facial',
      titulo: 'Contorno dos olhos, outro lado',
      detalhe: 'A mesma paciente, do outro lado do rosto.',
      layout: 'empilhado',
      alt: 'Antes e depois do contorno dos olhos da mesma mulher, de perfil, virada para a direita: em cima, linhas profundas ao lado do olho ao sorrir; embaixo, a região mais lisa, com a pele ainda levemente avermelhada.',
      imagem: { pasta: 'casos', arquivo: 'facial-olhos-perfil-direito', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'facial',
      titulo: 'Sorriso gengival',
      detalhe: 'Quanto da gengiva aparece no sorriso.',
      layout: 'empilhado',
      alt: 'Antes e depois do sorriso, de frente: em cima, o sorriso mostra uma faixa larga de gengiva acima dos dentes; embaixo, o mesmo sorriso mostra pouca gengiva.',
      imagem: { pasta: 'casos', arquivo: 'facial-sorriso-gengival', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'facial',
      titulo: 'Textura e manchas da pele',
      detalhe: 'Bochecha e têmpora, de perfil.',
      layout: 'empilhado',
      alt: 'Antes e depois da pele do rosto de um homem, de perfil: em cima, poros aparentes e manchas escuras na bochecha; embaixo, a pele com textura mais uniforme e menos manchas.',
      imagem: { pasta: 'casos', arquivo: 'facial-textura-pele', larguras: [480, 900], largura: 900, altura: 1600 },
    },
  ],
};
