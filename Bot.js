const { Client } = require('discord.js');
const ytdl = require('ytdl-core-discord');
const fetch = require('node-fetch');
const { targets, words } = require('./paths.js');

class Bot extends Client {
  constructor(token, id, options) {
    super(options);
    this.id = id;
    this.token = token;
    this.targets = targets;
    this.words = words;
    this.musicModule = false;
    this.dispatcher;
    this.voiceId = '';

    this.login(this.token).catch(err => {
      console.error(`[Токен №${this.id}] - Не смог залогиниться патамушта ${err.name}`);
    });

    this.on('ready', () => {
      if (this.user.bot) console.log(`[!!ВНИМАНИЕ!!] [Токен №${this.id}] - ${this.user.tag} является ботом, это опасно и некоторые функции не будут работать!`)
      console.log(`[${this.user.tag}] - готов к дерьму (${this.guilds.cache.size} серверов)`);
      this.user.setPresence({
        activity: {
          name: 'Raid: Shadow Legends',
          type: 0,
        },
      }).catch((err) => null);
    });

    this.on('message', async (msg) => {
      if (this.targets.length === 0 || this.words.length === 0) return;
      if (this.targets.includes(msg.author.id)) {
        msg.channel.send(`${msg.author.username} ${this.words[Math.floor(Math.random() * this.words.length)]}`);
      } 
    });
  }

  get client() {
    return this;
  }

  resetWords(path) {
    this.words = path;
  }

  resetTargets(path) {
    this.targets = path;
  }
  
  get activity() {
    const presence = this.user.presence.activities[0];
    console.log(`[${this.user.tag}] - Так что тут [${presence.type}] ${presence.name} ну и ${this.user.presence.status}.`);
  }

  set activity({name, type, status}) {
    this.user.setPresence({
        activity: {
          name,
          type,
        },
        status,
      }).catch((err) => null);
  }

  sendMessage(chnlId, content) {
    this.channels.cache.get(chnlId).send(content)
      .then(() => {
        console.log(`[${this.user.tag}] - Отправил успешно.`);
      })
      .catch((err) => {
       console.error(`[${this.user.tag}] - Не смог отправить патамушта ${err.name}.`);
      });
  }

  sendDDos(chnlId, content, count) {
    try {
      for(let i = 0; i < +count; i++) {
        this.channels.cache.get(chnlId).send(content)
          .then(() => {
            console.log(`[${this.user.tag}] - Отправил успешно.`);
          })
          .catch((err) => {
            console.error(`[${this.user.tag}] - Не смог отправить патамушта ${err.name}.`);
          });
      }
    } catch (err) {
      console.error(`[${this.user.tag}] - Не смог отправить патамушта ${err.name}.`);
    }
  }

  joinChannel(chnlId) {
    this.voiceId = chnlId;
    try {
      const channel = this.channels.cache.get(chnlId);
      if (!channel.joinable) return console.log(`[${this.user.tag}] - А мне сюда нельзя.`);
      channel.join();
      console.log(`[${this.user.tag}] - Заебись вошёл.`);
    } catch(err) {
      console.error(`[${this.user.tag}] - Не смог войти патамушта ${err.name}.`);
    }
  }

  leaveChannel() {
    if (this.voiceId === '') return console.log(`[${this.user.tag}] - Не откуда выходить.`); 
    try {
      const channel = this.channels.cache.get(this.voiceId);
      channel.leave();
      this.voiceId = '';
      console.log(`[${this.user.tag}] - Заебись ливнул.`);
    } catch(err) {
      console.error(`[${this.user.tag}] - Не смог ливнуть патамушта ${err.name}.`);
    }
  }

  joinGuild(key) {
    fetch(`https://discordapp.com/api/v6/invites/${key}?token=${this.token}`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(res => {
        if (res.ok){
          console.log(`[${this.user.tag}] - Заебись вошёл.`);
        } else {
          console.error(`[${this.user.tag}] - Не смог войти.`);
        }
      });
  }

  leaveGuild(guildId) {
    const guild = this.guilds.cache.get(guildId.toString());
    if (!guild) return console.log(`[${this.user.tag}] - Нету у меня этой хрени.`);

    guild.leave()
    .then(() => {
      console.log(`[${this.user.tag}] - Ливнул из ${guild.name}.`);
    })
    .catch((err) => {
      console.error(`[${this.user.tag}] - Не могу выйти из ${guild.name} патамушта ${err.name}.`);
    });
  }

  clearGuilds() {
    this.guilds.cache.forEach(async (guild) => {
      setTimeout(async () => {
        await guild.leave()
          .then(() => {
            console.log(`[${this.user.tag}] - Ливнул из ${guild.name}.`)
          })
          .catch((err) => {
            console.error(`[${this.user.tag}] - Не могу выйти из ${guild.name} патамушта ${err.name}.`);
          });
      }, 1000);
    })
  }

  music() {
    if (this.musicModule) {
      this.musicModule = false;
      console.log(`[${this.user.tag}] - Модуль музыки отключен.`);
    } else {
      this.musicModule = true;
      console.log(`[${this.user.tag}] - Модуль музыки включен.`);
    }
  }

  musicPlay(url) {
    if (this.musicModule) {
      if (this.voiceId === '') return console.log(`[${this.user.tag}] - ID голосового канала отсутсвует.`);
      const channel = this.channels.cache.get(this.voiceID);
      await channel.join()
        .then((conn) => {
          dispatcher = conn.play(await ytdl(url), { type: 'opus' });
          console.log(`[${this.user.tag}] - играю музычку.`);
        });
    } else {
      console.log(`[${this.user.tag}] - Модуль музыки ОТКЛЮЧЕН.`);
    }
  }

  musicStop() {
    if (this.dispatcher) this.dispatcher.end();
  }

  musicVolume(volume) {
    if (this.musicModule) {
      if (this.dispatcher) {
        this.dispatcher.setVolumeLogarithmic(volume);
        console.log(`[${this.user.tag}] - Громкость сейчас ${volume}%.`);
      } else {
        console.log(`[${this.user.tag}] - Музыка не играет.`);
      }
    } else {
      console.log(`[${this.user.tag}] - Модуль музыки ОТКЛЮЧЕН.`);
    }
  }
}

module.exports = Bot;
