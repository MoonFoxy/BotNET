const Bot = require('./Bot.js');
const menu = require('./menu.js');
const { tokens, targets, words } = require('./paths.js');
const clients = [];

function addBot() {
  tokens.forEach((token, id, array) => {
    clients.push(new Bot(token, id));
  });
};

if (words.length === 0) console.log('[!!ВНИМАНИЕ!!] Отсутвуют слова унижения токсика');

if (targets.length === 0) console.log('[!!ВНИМАНИЕ!!] Отсутвуют цели');

if (tokens.length === 0) {
  throw new Error('[!!ВНИМАНИЕ!!] Отсутвуют токены ботов, без них мне нечего делать. Иди ищи токены! Только не вздумай брать токены ботов, ИДИОТ!');
}

addBot();
menu(clients);
