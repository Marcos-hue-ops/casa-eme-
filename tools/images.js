/**
 * Prepara as fotografias para o site.
 *
 * Lê os originais de `fotos/`, gera WebP nas larguras pedidas dentro de
 * `src/assets/img/<pasta>/` e imprime, pronto para copiar, a linha `imagem:`
 * que cada foto quer em src/_data/galeria.js — inclusive largura e altura,
 * que são o que impede o layout de pular quando a foto carrega.
 *
 * Uso:
 *   npm run images                                 todas as fotos de fotos/
 *   node tools/images.js fotos/galeria/salao.jpg   uma só
 *
 * Decisões que valem explicação:
 *
 * • Não há ampliação. Se o original tem 720px de largura, a maior saída tem
 *   720px. Esticar pixel não cria detalhe — cria borrão.
 *
 * • WebP e não AVIF. O AVIF comprime um pouco melhor, mas, nas larguras usadas
 *   aqui, o ganho é de poucos KB e todo navegador atual lê WebP.
 *
 * • `fotos/referencias/` e `fotos/nao-publicar/` nunca viram imagem do site.
 *   A primeira guarda prints usados como referência de marca e de conteúdo; a
 *   segunda, o que não pode ser publicado (ver o LEIAME.md de cada uma).
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const ENTRADA = path.join(RAIZ, 'fotos');
const SAIDA = path.join(RAIZ, 'src/assets/img');

/** Larguras pedidas por pasta, da menor para a maior. */
const LARGURAS = {
  galeria: [480, 960],
  ambiente: [640, 1280],
  janela: [360, 720],
  hero: [480, 680],
  casos: [480, 900],
  equipe: [480, 960],
};
const PADRAO = [480, 960];

const EXTENSOES = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif']);
const IGNORADAS = new Set(['referencias', 'nao-publicar']);

/**
 * Recortes, por caminho relativo dentro de `fotos/` (sem extensão).
 *
 * As fotos que chegaram são prints do Instagram: algumas trazem a interface do
 * aplicativo em volta. O recorte fica escrito aqui — e não num arquivo cortado
 * à mão — para que o original continue intacto e a decisão fique registrada.
 *
 * `origem` é o tamanho do arquivo sobre o qual o recorte foi medido. Se a foto
 * for trocada por uma versão maior com o mesmo nome, o recorte é reescalado;
 * se a nova versão já vier sem a interface (outra proporção), nada é cortado.
 */
const RECORTES = {
  /* Faixa escura de 16px da barra do Instagram no topo. */
  'galeria/cabelo-escova-antes-depois': {
    origem: { width: 720, height: 672 },
    left: 0,
    top: 16,
    width: 720,
    height: 656,
  },
  /* Dois pixels da barra do aplicativo no topo. */
  'galeria/cabelo-ondas-antes-depois': {
    origem: { width: 719, height: 768 },
    left: 0,
    top: 2,
    width: 719,
    height: 766,
  },
  /* Print da tela inteira (720×1600): a foto do post vai de y=246 a y=1091.
     O corte para em 1006 para deixar de fora o ícone de som do Instagram,
     que fica sobre o canto inferior direito da foto. */
  'galeria/unhas-francesinha-gel': {
    origem: { width: 720, height: 1600 },
    left: 0,
    top: 246,
    width: 720,
    height: 760,
  },

  /* Arte "Cuidado que vai além da beleza" (1600×900): o texto da esquerda vira
     texto de verdade na página (legível, indexável, acessível); aqui fica só a
     foto, que começa em x=930. */
  'hero/arte-cuidado-que-vai-alem': {
    origem: { width: 1600, height: 900 },
    left: 930,
    top: 0,
    width: 670,
    height: 900,
  },
  /* Painel "Before/After" do Protocolo Capilaris: só as quatro fotos, sem o
     cabeçalho em inglês e sem a faixa de texto de baixo. Os rótulos "Antes" e
     "Depois" entram em HTML, em português. */
  'casos/capilar-protocolo-capilaris': {
    origem: { width: 1080, height: 1080 },
    left: 38,
    top: 138,
    width: 1006,
    height: 763,
  },
  /* Retratos da Dra. Rejane: só a foto, sem os painéis de texto das artes. */
  'equipe/dra-rejane-rabelo-formacao': {
    origem: { width: 1600, height: 900 },
    left: 0,
    top: 0,
    width: 956,
    height: 900,
  },
  'equipe/dra-rejane-rabelo-blazer': {
    origem: { width: 1600, height: 900 },
    left: 0,
    top: 0,
    width: 1032,
    height: 900,
  },
  'equipe/dra-rejane-rabelo-avaliacao': {
    origem: { width: 720, height: 1280 },
    left: 0,
    top: 90,
    width: 720,
    height: 743,
  },
};

/**
 * Peças derivadas: recortes de uma foto que viram outra imagem do site.
 *
 * A "janela" da primeira dobra é o lado "depois" da montagem de ondas, em
 * quadrado, só com o cabelo — sem o rótulo, que vive na metade de baixo.
 */
const DERIVADOS = {
  'janela/ondas-caramelo': {
    de: 'galeria/cabelo-ondas-antes-depois',
    origem: { width: 719, height: 768 },
    left: 362,
    top: 290,
    width: 357,
    height: 357,
  },
  /* Janela principal do hero: o rosto da arte "Cuidado que vai além da beleza". */
  'janela/mulher-sorrindo': {
    de: 'hero/arte-cuidado-que-vai-alem',
    origem: { width: 1600, height: 900 },
    left: 890,
    top: 15,
    width: 650,
    height: 650,
  },
  /* Janela menor do hero: o rosto da Dra. Rejane. */
  'janela/dra-rejane': {
    de: 'equipe/dra-rejane-rabelo-blazer',
    origem: { width: 1600, height: 900 },
    left: 330,
    top: 10,
    width: 460,
    height: 460,
  },
  'janela/francesinha': {
    de: 'galeria/unhas-francesinha-gel',
    origem: { width: 720, height: 1600 },
    left: 250,
    top: 380,
    width: 420,
    height: 420,
  },
};

/** Traduz um recorte para os pixels do arquivo que está em `fotos/` agora. */
function recorteEm(recorte, largura, altura) {
  if (!recorte) return null;

  const proporcaoOrigem = recorte.origem.width / recorte.origem.height;
  if (Math.abs(largura / altura - proporcaoOrigem) > 0.01) return null;

  const fator = largura / recorte.origem.width;
  const caixa = {
    left: Math.round(recorte.left * fator),
    top: Math.round(recorte.top * fator),
    width: Math.round(recorte.width * fator),
    height: Math.round(recorte.height * fator),
  };
  caixa.width = Math.min(caixa.width, largura - caixa.left);
  caixa.height = Math.min(caixa.height, altura - caixa.top);
  return caixa;
}

const semAcento = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function listar(dir) {
  const entradas = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const arquivos = await Promise.all(
    entradas.map(async (entrada) => {
      const completo = path.join(dir, entrada.name);
      if (entrada.isDirectory()) return IGNORADAS.has(entrada.name) ? [] : listar(completo);
      return EXTENSOES.has(path.extname(entrada.name).toLowerCase()) ? [completo] : [];
    })
  );
  return arquivos.flat();
}

async function gerar({ original, destinoRel, recorte, larguras }) {
  const pasta = path.dirname(destinoRel);
  const nome = path.basename(destinoRel);
  await mkdir(path.join(SAIDA, pasta), { recursive: true });

  const meta = await sharp(original).metadata();
  const caixa = recorteEm(recorte, meta.width, meta.height);
  const width = caixa ? caixa.width : meta.width;
  const height = caixa ? caixa.height : meta.height;

  const geradas = [];
  for (const pedida of larguras) {
    const largura = Math.min(pedida, width);
    if (geradas.some((g) => g.largura === largura)) continue;

    const etapa = sharp(original);
    if (caixa) etapa.extract(caixa);
    const info = await etapa
      .resize({ width: largura, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(SAIDA, pasta, `${nome}-${largura}.webp`));

    geradas.push({ largura, altura: info.height, bytes: info.size });
  }

  const { size } = await stat(original);
  const maior = geradas.at(-1);
  console.log(
    `\n${path.relative(RAIZ, original)}  (${meta.width}×${meta.height}, ${Math.round(size / 1024)} KB)` +
      (caixa ? `  — recorte ${width}×${height}` : '')
  );
  geradas.forEach((g) =>
    console.log(`  → ${pasta}/${nome}-${g.largura}.webp  ${g.largura}×${g.altura}  ${Math.round(g.bytes / 1024)} KB`)
  );
  if (maior.largura < Math.max(...larguras)) {
    console.log(
      `  ! o original tem ${width}px e a peça pede até ${Math.max(...larguras)}px — nada foi ampliado. ` +
        'Quando houver o arquivo original da câmera, troque e rode de novo.'
    );
  }
  console.log(
    `  imagem: { pasta: '${pasta}', arquivo: '${nome}', larguras: [${geradas.map((g) => g.largura).join(', ')}], ` +
      `largura: ${maior.largura}, altura: ${maior.altura} },`
  );
}

const pedidos = process.argv.slice(2);
const originais = pedidos.length ? pedidos.map((p) => path.resolve(p)) : (await listar(ENTRADA)).sort();

if (!originais.length) {
  console.log('images: nenhuma foto em fotos/. Coloque os originais em fotos/galeria/ (ou fotos/ambiente/) e rode de novo.');
  process.exit(0);
}

for (const original of originais) {
  const relativo = path.relative(ENTRADA, original);
  const pasta = path.dirname(relativo) === '.' ? 'galeria' : path.dirname(relativo);
  const nome = semAcento(path.basename(original, path.extname(original)));
  const chave = `${pasta}/${nome}`.replaceAll(path.sep, '/');

  await gerar({
    original,
    destinoRel: chave,
    recorte: RECORTES[chave],
    larguras: LARGURAS[pasta] || PADRAO,
  });

  for (const [destino, derivado] of Object.entries(DERIVADOS)) {
    if (derivado.de !== chave) continue;
    await gerar({
      original,
      destinoRel: destino,
      recorte: derivado,
      larguras: LARGURAS[path.dirname(destino)] || PADRAO,
    });
  }
}

console.log('\nCopie a linha `imagem:` para o item correspondente em src/_data/galeria.js');
console.log('e escreva o `alt` descrevendo a foto que entrou.');
