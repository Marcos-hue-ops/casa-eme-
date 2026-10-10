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
 * imagem por escrito (termo de consentimento) — ver README → Pendências.
 *
 * Os textos alternativos descrevem o que se vê, inclusive quando as duas
 * fotos têm ângulo, luz ou lugar diferentes. Não transforme o alt em
 * promessa ("pele perfeita", "cabelo recuperado").
 *
 * `creditado: true` marca os casos atendidos pela Dra. Rejane Rabelo. Os
 * capilares estão marcados (são a área dela, nas artes que ela publica); os
 * faciais não, porque ninguém informou quem os atendeu.
 *
 * Campos:
 *  area     'capilar' ou 'facial' (separa as seções e o filtro da galeria)
 *  titulo   legenda curta
 *  detalhe  uma linha sobre o que a foto mostra
 *  creditado true quando quem atendeu foi a Dra. Rejane (ver `credito`)
 *  layout   'empilhado' (antes em cima, depois embaixo: o site escreve
 *           "Antes" e "Depois" sobre cada metade) ou 'montagem' (a foto já
 *           traz as próprias marcações e não recebe rótulo)
 *  imagem   linha gerada por `npm run images`
 */
export default {
  /** Quem atendeu os casos marcados com `creditado` — aparece junto deles. */
  credito: 'Casos capilares: atendimento da Dra. Rejane Rabelo, biomédica esteta · CRBM 13690',
  /** O mesmo crédito, no singular, para a legenda de uma foto só (galeria). */
  creditoFoto: 'Atendimento da Dra. Rejane Rabelo, biomédica esteta · CRBM 13690',
  /**
   * `aviso` é a frase que o Código de Ética do Biomédico (Res. CFBM
   * 330/2020) pede junto de imagem de resultado. Vai, sem mudar uma
   * palavra, no pé da seção e na legenda de cada foto ampliada.
   */
  aviso:
    'Esta imagem não representa, em hipótese alguma, garantia de resultado. Cada ser humano tem características anatômicas e fisiológicas únicas.',
  ressalva: 'Fotos de pacientes atendidos na casa.',

  itens: [
    {
      area: 'capilar',
      titulo: 'Topo da cabeça, de abril a julho',
      detalhe: 'Registros de 13 de abril e de 27 de julho.',
      layout: 'empilhado',
      creditado: true,
      alt: 'Antes e depois capilar, vista do topo da cabeça: em cima, em 13 de abril, numa sala de atendimento, cabelo escuro com o couro cabeludo aparente no alto da cabeça; embaixo, em 27 de julho, em outro ambiente e com outra luz, a mesma região aparece mais coberta pelos fios.',
      imagem: { pasta: 'casos', arquivo: 'capilar-topo-abril-julho', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'capilar',
      titulo: 'Protocolo Capilaris',
      detalhe: 'Registros marcados com 10 e com 20 sessões.',
      layout: 'montagem',
      creditado: true,
      alt: 'Montagem do Protocolo Capilaris com quatro fotos do alto da cabeça. À esquerda, duas fotos lado a lado, a primeira com a etiqueta "10 sessões": na primeira aparecem a testa e o couro cabeludo entre fios ralos, na segunda há mais fios. À direita, duas fotos uma sobre a outra, a de baixo com a etiqueta "20 sessões": em cima o topo mais ralo, embaixo mais coberto.',
      imagem: { pasta: 'casos', arquivo: 'capilar-protocolo-capilaris', larguras: [480, 900], largura: 900, altura: 683 },
    },
    {
      area: 'facial',
      titulo: 'Glabela',
      detalhe: 'Região entre as sobrancelhas.',
      layout: 'empilhado',
      alt: 'Antes e depois da região entre as sobrancelhas, de frente: em cima, o rosto franzido, com rugas marcadas na glabela, no alto do nariz e ao redor dos olhos; embaixo, a testa e a glabela sem essas rugas, com os olhos abertos.',
      imagem: { pasta: 'casos', arquivo: 'facial-glabela', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'facial',
      titulo: 'Contorno dos olhos',
      detalhe: 'Linhas ao lado dos olhos ao sorrir.',
      layout: 'empilhado',
      alt: 'Antes e depois do contorno dos olhos, mulher sorrindo de perfil, virada para a esquerda: em cima, sorriso aberto, com linhas marcadas ao lado do olho e na bochecha; embaixo, sorriso mais contido, a região com linhas mais suaves e marcas avermelhadas na pele.',
      imagem: { pasta: 'casos', arquivo: 'facial-olhos-perfil-esquerdo', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'facial',
      titulo: 'Contorno dos olhos, outro lado',
      detalhe: 'A mesma paciente, do outro lado do rosto.',
      layout: 'empilhado',
      alt: 'Antes e depois do contorno dos olhos da mesma mulher, de perfil, virada para a direita: em cima, linhas profundas ao lado do olho ao sorrir; embaixo, a região mais lisa, com pontos avermelhados e a pele brilhante perto do olho.',
      imagem: { pasta: 'casos', arquivo: 'facial-olhos-perfil-direito', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'facial',
      titulo: 'Sorriso gengival',
      detalhe: 'A faixa de gengiva que aparece ao sorrir.',
      layout: 'empilhado',
      alt: 'Antes e depois do sorriso, de frente: em cima, o sorriso mostra uma faixa larga de gengiva acima dos dentes; embaixo, o mesmo sorriso mostra pouca gengiva.',
      imagem: { pasta: 'casos', arquivo: 'facial-sorriso-gengival', larguras: [480, 900], largura: 900, altura: 1600 },
    },
    {
      area: 'facial',
      titulo: 'Bochecha e têmpora',
      detalhe: 'Textura da pele.',
      layout: 'empilhado',
      alt: 'Antes e depois da pele do rosto de um homem: em cima, de três quartos e com a barba por fazer, poros aparentes e manchas na bochecha; embaixo, de perfil, barbeado e com outra luz, a pele da bochecha com aspecto mais uniforme.',
      imagem: { pasta: 'casos', arquivo: 'facial-textura-pele', larguras: [480, 900], largura: 900, altura: 1600 },
    },
  ],
};
