/**
 * Horário de funcionamento.
 *
 * ⚠ DIVERGÊNCIA CONHECIDA — confirmar com a Casa EME.
 * A bio do Instagram diz "Ter a Sáb, 9h às 19h". Os horários detalhados
 * informados para o site dizem terça a quinta até 18h e sexta e sábado até
 * 19h. O site usa os detalhados, como pedido no briefing. Quando a casa
 * confirmar, corrija aqui — um lugar só — e alinhe a bio do Instagram e a
 * ficha do Google para que os três digam a mesma coisa.
 *
 * O mesmo array monta a tabela de horários, o rodapé, o "aberto agora" e o
 * OpeningHoursSpecification do JSON-LD.
 *
 * `dia` é o nome que o schema.org espera; `en` é a abreviação que o Intl
 * devolve (é por ela que o script encontra a linha de hoje); `nome` e `curto`
 * são o que aparece na tela. Dia fechado: `abre` e `fecha` nulos.
 */
export default {
  semana: [
    { dia: 'Tuesday', en: 'Tue', nome: 'Terça-feira', curto: 'Ter', abre: '09:00', fecha: '18:00' },
    { dia: 'Wednesday', en: 'Wed', nome: 'Quarta-feira', curto: 'Qua', abre: '09:00', fecha: '18:00' },
    { dia: 'Thursday', en: 'Thu', nome: 'Quinta-feira', curto: 'Qui', abre: '09:00', fecha: '18:00' },
    { dia: 'Friday', en: 'Fri', nome: 'Sexta-feira', curto: 'Sex', abre: '09:00', fecha: '19:00' },
    { dia: 'Saturday', en: 'Sat', nome: 'Sábado', curto: 'Sáb', abre: '09:00', fecha: '19:00' },
    { dia: 'Sunday', en: 'Sun', nome: 'Domingo', curto: 'Dom', abre: null, fecha: null },
    { dia: 'Monday', en: 'Mon', nome: 'Segunda-feira', curto: 'Seg', abre: null, fecha: null },
  ],

  /** Resumo em grupos, para rodapé e faixas. Mantenha coerente com a semana acima. */
  grupos: [
    { dias: 'Terça a quinta', horas: '9h–18h', aberto: true },
    { dias: 'Sexta e sábado', horas: '9h–19h', aberto: true },
    { dias: 'Domingo e segunda', horas: 'Fechado', aberto: false },
  ],
  resumoCurto: 'Ter a qui, 9h–18h · Sex e sáb, 9h–19h',
  resumo: 'De terça a quinta, das 9h às 18h; sexta e sábado, das 9h às 19h.',
  fechado: 'Domingo e segunda: fechado',
  nota: 'Os horários de cada serviço são confirmados no agendamento, pelo WhatsApp.',
};
