/**
 * Assinaturas mensais.
 *
 * Fonte: story "Assinaturas" do Instagram @casaeme_moema (print em
 * fotos/referencias/assinaturas-story.jpg). Planos, composição, valores e
 * condições foram transcritos exatamente como divulgados pela casa.
 *
 * Mudou um valor? Troque aqui. Os planos aparecem na home, na página de
 * serviços e no FAQ a partir deste arquivo.
 *
 * `mostrarPrecos: false` esconde os valores (os planos continuam listados,
 * com o convite para consultar pelo WhatsApp). Útil se a tabela estiver
 * sendo revista.
 *
 * Os preços NÃO entram nos dados estruturados de propósito: preço em schema
 * desatualizado vira divergência apontada pelo Google.
 */
export default {
  mostrarPrecos: true,
  titulo: 'Assinaturas',
  chamada: 'Mais praticidade no dia a dia',
  texto:
    'Para quem mantém unhas e escova em dia, a Casa EME tem planos mensais: os serviços do mês reunidos numa assinatura só.',
  planos: [
    {
      nome: 'Manicure + Pedicure',
      inclui: ['4 serviços de manicure', '2 serviços de pedicure'],
      preco: 'R$ 230,00',
    },
    {
      nome: 'Manicure',
      inclui: ['4 serviços de manicure'],
      preco: 'R$ 144,00',
    },
    {
      nome: 'Retoque de raiz',
      inclui: ['2 serviços de lavatório', '2 serviços de retoque de raiz'],
      preco: 'R$ 380,00',
    },
    {
      nome: 'Escova',
      variante: '4 escovas',
      inclui: ['4 serviços de lavatório', '4 serviços de escova'],
      preco: 'R$ 356,00',
    },
    {
      nome: 'Escova',
      variante: '8 escovas',
      inclui: ['8 serviços de lavatório', '8 serviços de escova'],
      preco: 'R$ 640,00',
    },
  ],
  condicoes: ['Válido por 30 dias', 'Válido de terça a quinta', 'Renovação automática'],
  ressalva: 'Valores e condições conforme divulgados pela Casa EME. Confirme pelo WhatsApp antes de assinar.',
};
