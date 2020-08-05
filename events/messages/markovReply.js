const Composer = require('telegraf/composer');
const Markov = require('markov-strings').default;
const db = require('../../db/databaseManager');

module.exports = Composer.mount(
  'message',
  async (ctx) => {

    if (ctx.updateType != 'message' || !ctx.message.text)
      return;

    const groupChat = await db.findGroupByID(ctx);

    let markov = new Markov(groupChat.messages, { stateSize: 2 });
    await markov.buildCorpusAsync();

    const markovOptions = {

      maxTries: 10000,
      prng: Math.random,
      filter: (result) => {
        return result.string.split(' ').length >= 5
      }

    }

    const markovReply = await markov.generateAsync(markovOptions);

    if (!groupChat.debugMode) {

      ctx.reply(markovReply.string);

    } else {

      ctx.replyWithHTML(`<b>MESSAGGIO DEBUG</b>\n<b>Risposta:</b> ${markovReply.string}\n<b>Prove (tries):</b> ${markovReply.tries}\n<b>Score:</b> ${markovReply.score}`);

    }

    groupChat.messages.push(ctx.message.text);

    await groupChat.save();

  });