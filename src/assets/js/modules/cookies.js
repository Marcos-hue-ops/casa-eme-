/**
 * Aviso de cookies e Google Analytics 4.
 *
 * O aviso só existe no HTML quando o build tem um ID do GA4
 * (src/_data/analytics.js). Sem ele, este módulo não encontra nada e sai.
 *
 * O que fica garantido:
 *
 *  • antes do "Aceitar", nenhum script do Google é baixado, nenhum cookie é
 *    gravado e nada sai do navegador. É o modo básico do Consent Mode do
 *    Google: a tag só entra na página depois do consentimento;
 *  • recusar é tão fácil quanto aceitar, e a escolha pode ser revista a
 *    qualquer momento em "Preferências de cookies" (rodapé e página de
 *    privacidade);
 *  • quem volta atrás depois de aceitar tem o envio cortado na hora e os
 *    cookies do Analytics apagados;
 *  • a escolha vale pela versão do aviso e por um prazo (`data-versao`,
 *    `data-validade`); passado o prazo ou mudada a versão, a pergunta volta;
 *  • a escolha feita numa aba vale nas outras já abertas e na página que o
 *    navegador devolve do cache ao voltar: recusar lá desliga aqui;
 *  • uma página é uma visualização: o site não tem navegação por JavaScript,
 *    então o `page_view` automático do `config` é o único que sai.
 *
 * A escolha fica no localStorage, na chave CHAVE — é o único dado que o site
 * grava por conta própria, e grava justamente para não perguntar de novo a
 * cada página. Se o navegador bloquear o armazenamento, o aviso aparece em
 * toda página e o Analytics não carrega sem um "Aceitar" ali mesmo.
 *
 * O GA4 sai sem Google Signals e sem personalização de anúncios. Nenhum dado
 * de quem visita é acrescentado ao que o próprio gtag.js lê da página.
 */
const CHAVE = 'casa-eme:cookies';
const DIA = 24 * 60 * 60 * 1000;

function lerEscolha(versao, validadeDias) {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (!salvo || salvo.versao !== versao) return null;
    if (salvo.escolha !== 'aceito' && salvo.escolha !== 'recusado') return null;
    const quando = Date.parse(salvo.data);
    if (!Number.isFinite(quando) || Date.now() - quando > validadeDias * DIA) return null;
    return salvo.escolha;
  } catch {
    return null;
  }
}

function guardarEscolha(escolha, versao) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ escolha, versao, data: new Date().toISOString() }));
  } catch {
    /* Armazenamento bloqueado: a escolha vale só para esta página. */
  }
}

let carregado = false;

/** Carrega o GA4 — uma vez por página, e só depois do "Aceitar". */
function ligarAnalytics(id) {
  window[`ga-disable-${id}`] = false;

  if (carregado) {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    return;
  }
  carregado = true;

  /* O trecho oficial do Google, sem o <script> inline (a CSP não deixaria). O
     gtag.js lê o objeto `arguments`, não uma lista: por isso a função comum. */
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(script);
}

/** Corta o envio na hora (a chave `ga-disable-` é a do próprio Google) e apaga os cookies. */
function desligarAnalytics(id) {
  window[`ga-disable-${id}`] = true;
  if (carregado) window.gtag('consent', 'update', { analytics_storage: 'denied' });
  apagarCookiesDoAnalytics();
}

function apagarCookiesDoAnalytics() {
  const nomes = document.cookie
    .split(';')
    .map((par) => par.split('=')[0].trim())
    .filter((nome) => /^(_ga|_ga_\w+|_gid|_gat\w*)$/.test(nome));
  if (!nomes.length) return;

  /* O GA4 grava no domínio mais alto que o navegador aceita
     (casaememoema.com.br, valendo também para o www). Sem saber qual foi,
     apaga em cada nível, além do cookie preso só ao endereço atual. */
  const partes = location.hostname.split('.');
  const dominios = [''];
  for (let i = 0; i < partes.length - 1; i += 1) dominios.push(`; domain=${partes.slice(i).join('.')}`);

  for (const nome of nomes) {
    for (const dominio of dominios) document.cookie = `${nome}=; max-age=0; path=/${dominio}`;
  }
}

const TEXTO_ESTADO = {
  aceito: 'Sua escolha atual: aceitou.',
  recusado: 'Sua escolha atual: recusou.',
};

export function cookies() {
  const aviso = document.querySelector('[data-cookies]');
  if (!aviso) return;

  const id = aviso.dataset.ga4;
  const versao = Number(aviso.dataset.versao);
  const validade = Number(aviso.dataset.validade);
  const estado = aviso.querySelector('[data-cookies-estado]');
  const raiz = document.documentElement;
  let voltarPara = null;

  /* Enquanto o aviso está aberto, `.com-aviso` e a altura dele (`--aviso-cookies`)
     ficam na raiz: o botão fixo do WhatsApp sobe e aparece acima dele no
     celular (wa-fixo.css), e o fim da página e o foco do teclado não ficam
     por baixo dele (cookies.css). */
  const medir = () => raiz.style.setProperty('--aviso-cookies', `${aviso.offsetHeight}px`);
  const observador = 'ResizeObserver' in window ? new ResizeObserver(medir) : null;

  const mostrar = (atual) => {
    estado.textContent = TEXTO_ESTADO[atual] || '';
    estado.hidden = !atual;
    aviso.hidden = false;
    raiz.classList.add('com-aviso');
    medir();
    observador?.observe(aviso);
  };

  const esconder = () => {
    aviso.hidden = true;
    observador?.disconnect();
    raiz.classList.remove('com-aviso');
    raiz.style.removeProperty('--aviso-cookies');
    /* Quem abriu pelas preferências volta para o botão de onde saiu. */
    if (voltarPara) voltarPara.focus();
    voltarPara = null;
  };

  const decidir = (escolha) => {
    guardarEscolha(escolha, versao);
    if (escolha === 'aceito') ligarAnalytics(id);
    else desligarAnalytics(id);
    esconder();
  };

  aviso.querySelector('[data-cookies-aceitar]').addEventListener('click', () => decidir('aceito'));
  aviso.querySelector('[data-cookies-recusar]').addEventListener('click', () => decidir('recusado'));

  /* Reaberto pelas preferências, com escolha já feita, o Esc fecha sem mudar nada. */
  aviso.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && voltarPara && lerEscolha(versao, validade)) esconder();
  });

  document.querySelectorAll('[data-cookies-abrir]').forEach((botao) => {
    botao.addEventListener('click', () => {
      voltarPara = botao;
      mostrar(lerEscolha(versao, validade));
      aviso.focus({ preventScroll: true });
    });
  });

  /* A escolha pode mudar em outra aba, ou enquanto esta página esperava no
     cache de voltar/avançar. Recusa lá desliga aqui; aceite lá vale aqui; e o
     aviso aberto sozinho fecha, porque a pergunta já foi respondida. Só a
     recusa gravada desliga: um aceite que valeu só para esta página
     (armazenamento bloqueado) não é desfeito. */
  const reavaliar = () => {
    const atual = lerEscolha(versao, validade);
    if (atual === 'recusado' && carregado) desligarAnalytics(id);
    if (atual === 'aceito') ligarAnalytics(id);
    if (atual && !aviso.hidden && !voltarPara) esconder();
  };
  window.addEventListener('storage', (evento) => {
    if (evento.key === CHAVE || evento.key === null) reavaliar();
  });
  window.addEventListener('pageshow', (evento) => {
    if (evento.persisted) reavaliar();
  });

  const escolha = lerEscolha(versao, validade);
  if (escolha === 'aceito') ligarAnalytics(id);
  else if (escolha === 'recusado') apagarCookiesDoAnalytics();
  else mostrar(null);
}
