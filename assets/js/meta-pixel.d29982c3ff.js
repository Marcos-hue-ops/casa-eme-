// Pixel da Meta (Facebook/Instagram), só com consentimento.
// Segue a mesma escolha do aviso de cookies que liga o Google Analytics
// (chave "casa-eme:cookies" no localStorage, mesma versão e validade).
// Sem "Aceitar", nenhum script da Meta entra na página.

const PIXEL_ID = "4214019418843524";
const CHAVE = "casa-eme:cookies";

const aviso = document.querySelector("[data-cookies]");
const versao = Number(aviso?.dataset.versao);
const validade = Number(aviso?.dataset.validade);

function escolha() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (!salvo || salvo.versao !== versao) return null;
    const data = Date.parse(salvo.data);
    if (!Number.isFinite(data) || Date.now() - data > validade * 864e5) return null;
    return salvo.escolha === "aceito" || salvo.escolha === "recusado" ? salvo.escolha : null;
  } catch {
    return null;
  }
}

let carregado = false;

function ligar() {
  if (carregado) {
    window.fbq("consent", "grant");
    return;
  }
  carregado = true;
  // Código-base oficial da Meta, sem o script inline (bloqueado pela CSP).
  const fbq = function () {
    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
  };
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  fbq("consent", "grant");
  fbq("init", PIXEL_ID);
  fbq("track", "PageView");

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.append(s);
}

function desligar() {
  if (carregado) window.fbq("consent", "revoke");
  const nomes = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n === "_fbp" || n === "_fbc");
  if (!nomes.length) return;
  const partes = location.hostname.split(".");
  const dominios = [""];
  for (let i = 0; i < partes.length - 1; i += 1) dominios.push(`; domain=${partes.slice(i).join(".")}`);
  for (const n of nomes) for (const d of dominios) document.cookie = `${n}=; max-age=0; path=/${d}`;
}

function aplicar() {
  const e = escolha();
  if (e === "aceito") ligar();
  else if (e === "recusado") desligar();
}

if (aviso) {
  aplicar();
  // O clique grava a escolha (no script principal) antes de chegar aqui.
  aviso.querySelector("[data-cookies-aceitar]")?.addEventListener("click", () => setTimeout(aplicar));
  aviso.querySelector("[data-cookies-recusar]")?.addEventListener("click", () => setTimeout(aplicar));
  window.addEventListener("storage", (ev) => {
    if (ev.key === CHAVE || ev.key === null) aplicar();
  });
  window.addEventListener("pageshow", (ev) => {
    if (ev.persisted) aplicar();
  });
}
