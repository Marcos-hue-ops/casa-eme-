/**
 * Horários: marca a linha de hoje na tabela e diz se a casa está aberta agora.
 *
 * O fuso é fixado em America/Sao_Paulo. Sem isso, quem abre o site de outro
 * fuso — ou com o relógio do aparelho errado — veria "aberto agora" numa
 * segunda-feira, e o site perderia credibilidade exatamente onde tentava
 * ganhá-la.
 *
 * Os horários vêm do HTML (data-semana, gerado a partir de hours.js): o
 * script não guarda cópia nenhuma.
 */
export function horarios() {
  const estados = document.querySelectorAll('[data-estado]');
  const tabelas = document.querySelectorAll('[data-horarios]');
  if (!estados.length && !tabelas.length) return;

  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const valor = (tipo) => partes.find((parte) => parte.type === tipo)?.value ?? '';
  const hoje = valor('weekday');
  /* Alguns ambientes devolvem 24:00 no lugar de 00:00. */
  const minutosAgora = (Number(valor('hour')) % 24) * 60 + Number(valor('minute'));
  const emMinutos = (texto) => {
    const [h, m] = texto.split(':').map(Number);
    return h * 60 + m;
  };

  tabelas.forEach((tabela) => {
    tabela.querySelector(`[data-dia="${hoje}"]`)?.classList.add('horarios__linha--hoje');
  });

  estados.forEach((estado) => {
    let semana = [];
    try {
      semana = JSON.parse(estado.dataset.semana || '[]');
    } catch {
      return;
    }
    const dia = semana.find((d) => d.en === hoje);
    const aberto =
      Boolean(dia?.abre && dia?.fecha) &&
      minutosAgora >= emMinutos(dia.abre) &&
      minutosAgora < emMinutos(dia.fecha);

    estado.dataset.aberto = aberto ? 'sim' : 'nao';
    estado.textContent = aberto ? 'Aberto agora' : 'Fechado agora';
    estado.hidden = false;
  });
}
