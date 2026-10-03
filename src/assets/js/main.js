/**
 * Ponto de entrada. Cada comportamento é um módulo que só age se encontrar o
 * seu elemento na página — todas as páginas carregam o mesmo arquivo, sem
 * verificação de rota.
 *
 * Nada aqui lê, grava ou envia dado de quem visita: não há cookie, não há
 * localStorage, não há requisição para terceiros.
 */
import { cabecalho } from './modules/header.js';
import { revelar } from './modules/reveal.js';
import { faq } from './modules/faq.js';
import { horarios } from './modules/hours.js';
import { flutuante } from './modules/float.js';
import { mapa } from './modules/map.js';
import { lupa } from './modules/lightbox.js';
import { manifesto } from './modules/manifesto.js';
import { galeria } from './modules/galeria.js';

const modulos = [cabecalho, revelar, faq, horarios, flutuante, mapa, lupa, manifesto, galeria];

/* Um módulo com erro não derruba os outros. */
for (const modulo of modulos) {
  try {
    modulo();
  } catch (erro) {
    console.error(`[casa-eme] ${modulo.name}:`, erro);
  }
}
