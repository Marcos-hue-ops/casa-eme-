/** Desenvolvimento: Eleventy em watch + CSS e JS recompilados a cada alteração. */
import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { fileURLToPath } from 'node:url';

const run = (comando, args) =>
  spawn(comando, args, { stdio: 'inherit', shell: process.platform === 'win32' });

let cssTimer;
let jsTimer;
const adiar = (timer, fn) => {
  clearTimeout(timer);
  return setTimeout(fn, 120);
};

run('npx', ['eleventy', '--serve', '--port=8080']);
run('npm', ['run', 'build:css']);
run('npm', ['run', 'build:js']);

watch(fileURLToPath(new URL('../src/assets/css/', import.meta.url)), { recursive: true }, () => {
  cssTimer = adiar(cssTimer, () => run('npm', ['run', 'build:css']));
});

watch(fileURLToPath(new URL('../src/assets/js/', import.meta.url)), { recursive: true }, () => {
  jsTimer = adiar(jsTimer, () => run('npm', ['run', 'build:js']));
});
