const prompts = require('prompts');
const { tokens, targets, words } = require('./paths.js');

async function menu(clients) {
  const menuRes = await prompts([
    {
      type: 'select',
      name: 'text',
      message: 'Выбери действие',
      choices: [
        { title: 'Включить модуль музыки [on / off] (НЕ ДОСТУПНО!)', value: 'music' },
        { title: 'Присоединиться к войсу (НЕ ДОСТУПНО!)', value: 'joinVoice' },
        { title: 'Ливнуть с войса (НЕ ДОСТУПНО!)', value: 'leaveVoice' },
        { title: 'Играть музычку (НЕ ДОСТУПНО!)', value: 'musicPlay' },
        { title: 'Громкость музыки (НЕ ДОСТУПНО!)', value: 'musicVolume' },
        { title: 'Остановить музыку (НЕ ДОСТУПНО!)', value: 'musicStop' },
        { title: 'Добавить нового бота', value: 'addBot' },
        { title: 'Добавить слова', value: 'addWords' },
        { title: 'Удалить последнее добавленное слово', value: 'remLastWord' },
        { title: 'Добавить токсика', value: 'addTargets' },
        { title: 'Убрать последнего в списке токсиков', value: 'remLastTarget' },
        { title: 'Убрать из токсиков', value: 'remTargets' },
        { title: 'Присоединиться к серверу', value: 'joinGuild' },
        { title: 'Ливнуть с сервера', value: 'leaveGuild' },
        { title: 'Очистить сервера', value: 'clearGuilds' },
        { title: 'Отправить сообщение рандомным ботом', value: 'sendMsgOnce' },
        { title: 'Отправить сообщение всеми ботами', value: 'sendMsg' },
        { title: 'Ддудос сообщениями', value: 'sendDDos' },
        { title: 'Сменить статус', value: 'setPresence' },
        { title: 'Посмотреть все статусы', value: 'getPresence' },
      ],
    }
  ]);

  switch (menuRes.text) {
    case 'music': {
      await clients.forEach((bot) => {
        bot.music();
      });
      return menu(clients);
    } break;

    case 'joinVoice': {
      const id = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь ID канала.',
          validate: (value) => value.length < 18 ? 'А это точно ID?' : true,
        }
      ]);
      await clients.forEach((bot, i) => {
        setTimeout(() => {
          bot.joinChannel(id.text);
        }, i * 150);
      });
      return menu(clients);
    } break;

    case 'leaveVoice': {
      await clients.forEach((bot, i) => {
        setTimeout(() => {
          bot.leaveChannel();
        }, i * 150);
      });
      return menu(clients);
    } break;

    case 'musicPlay': {
      const url = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь ссылку из YouTube.',
          validate: (value) => value ? 'Пусто' : true,
        }
      ]);
      await clients.forEach((bot, i) => {
        bot.musicPlay(url.text);
      });
      return menu(clients);
    } break;

    case 'musicVolume': {
      const volume = await prompts([
        {
          type: 'number',
          name: 'text',
          message: 'Укажи громкость.',
          validate: (value) => (value > 100 || value < 0) ? 'Значение от 0 до 100' : true,
        }
      ]);
      await clients.forEach((bot, i) => {
        bot.musicVolume(volume.text);
      });
      return menu(clients);
    } break;

    case 'musicStop': {
      await clients.forEach((bot, i) => {
        bot.musicStop();
      });
      return menu(clients);
    } break;

    case 'addBot': {
      const token = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь токен чтобы добавить его.',
        }
      ]);
      tokens.push(token.text);
      try {
        clients.push(new Bot(token.text, tokens.length));
      } catch (err) {
        console.err('Хрень токен удаляю');
        tokens.pop();
      }
      return menu(clients);
    } break;

    case 'addWords': {
      const word = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь слово / фразу чтобы добавить.',
          validate: (value) => value ? 'Пусто' : true,
        }
      ]);
      words.push(word.text);
      await clients.forEach((bot) => {
        bot.resetWords(words);
      });
      console.log(`Добавил [ ${word.text} ]`);
      return menu(clients);
    } break;

    case 'remLastWord': {
      words.pop()
        .then((del) => {
          await clients.forEach((bot) => {
            bot.resetWords(words);
          });
          console.log(`Удалил [ ${del} ]`);
        });
      return menu(clients);
    } break;

    case 'addTargets': {
      const target = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь ID токсика на добавление.',
          validate: (value) => value.length < 18 ? 'А это точно ID?' : true,
        }
      ]);
      targets.push(target.text);
      await clients.forEach((bot) => {
        bot.resetTargets(targets);
      });
      console.log(`Добавил [ ${target.text} ]`);
      return menu(clients);
    } break;

    case 'remLastTarget': {
      targets.pop()
        .then((del) => {
          await clients.forEach((bot) => {
            bot.resetTargets(targets);
          });
          console.log(`Удалил [ ${del} ]`);
        });
      return menu(clients);
    } break;

    case 'remTargets': {
      const target = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь ID токсика на удаление.',
          validate: (value) => value.length < 18 ? 'А это точно ID?' : true,
        }
      ]);
      targets.splice(targets.indexOf(target.text))
        .then(() => {
          await clients.forEach((bot) => {
            bot.resetTargets(targets);
          });
          console.log(`Удалил [ ${del} ]`);
        });
      return menu(clients);
    } break;

    case 'joinGuild': {
      const code = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь код приглашения.',
        }
      ]);
      await clients.forEach((bot, i) => {
        setTimeout(() => {
          bot.joinGuild(code.text);
        }, i * 150);
      });
      return menu(clients);
    } break;

    case 'leaveGuild': {
      const id = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь ID сервера.',
          validate: (value) => value.length < 18 ? 'А это точно ID?' : true,
        }
      ]);
      await clients.forEach((bot, i) => {
        setTimeout(() => {
          bot.leaveGuild(id.text);
        }, i * 150);
      });
      return menu(clients);
    } break;

    case 'clearGuilds': {
      await clients.forEach((bot, i) => {
        setTimeout(() => {
          bot.clearGuilds();
        }, i * 150);
      });
      return menu(clients);
    } break;

    case 'sendMsgOnce': {
      const id = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь ID сервера.',
          validate: (value) => value.length < 18 ? 'А это точно ID?' : true,
        }
      ]);
      const msg = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Напиши сообщение.',
          validate: (value) => value ? 'Пусто' : true,
        }
      ]);
      await clients[Math.floor(Math.random() * clients.length)].sendMessage(id.text, msg.text)
      return menu(clients);
    } break;

    case 'sendMsg': {
      const id = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Вставь ID сервера.',
          validate: (value) => value.length < 18 ? 'А это точно ID?' : true,
        }
      ]);
      const msg = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Напиши сообщение.',
          validate: (value) => value ? 'Пусто' : true,
        }
      ]);
      await clients.forEach((bot, i) => {
        setTimeout(() => {
          bot.sendMessage(id.text, msg.text);
        }, i * 150);
      });
      return menu(clients);
    } break;

    case 'sendDDos': {
      const id = await prompts([
        {
          type: 'number',
          name: 'text',
          message: 'Вставь ID сервера.',
          validate: (value) => value.length < 18 ? 'А это точно ID?' : true,
        }
      ]);
      const msg = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Напиши сообщение.',
          validate: (value) => value ? 'Пусто' : true,
        }
      ]);
      const count = await prompts([
        {
          type: 'number',
          name: 'text',
          message: 'Сколько раз?',
          validate: (value) => value.length < 1 ? 'Чет мало' : true,
        }
      ]);
      await clients.forEach((bot, i) => {
        setTimeout(() => {
          bot.sendDDos(id.text, msg.text, count.text);
        }, i * 150);
      });
      return menu(clients);
    } break;

    case 'setPresence': {
      const name = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Название.',
        }
      ]);
      const type = await prompts([
        {
          type: 'select',
          name: 'text',
          message: 'Тип.',
          choices: [
            { title: 'Играет', value: 'PLAYING' },
            { title: 'Стримит', value: 'STREAMING' },
            { title: 'Слушает', value: 'LISTENING' },
            { title: 'Смотрит', value: 'WATCHING' },
            { title: 'Кастомный статус', value: 'CUSTOM_STATUS' },
          ],
        }
      ]);
      const status = await prompts([
        {
          type: 'text',
          name: 'text',
          message: 'Статус.',
          choices: [
            { title: 'Онлайн', value: 'online' },
            { title: 'AFK', value: 'idle' },
            { title: 'Оффлайн или невидим', value: 'offline' },
            { title: 'Не беспокоить', value: 'dnd' },
          ],
        }
      ]);
      await clients.forEach((bot, i) => {
        setTimeout(() => {
          bot.activity({ name.text, type.text, status.text });
        }, i * 150);
      });
      return menu(clients);
    } break;

    case 'getPresence': {
      await clients.forEach((bot, i) => {
        setTimeout(() => {
          bot.activity;
        }, i * 150);
      });
      return menu(clients);
    } break;

    default: {
      return menu(clients);
    } break;
  }
}

module.exports = menu;
