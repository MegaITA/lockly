const Composer = require('telegraf/composer');
const Markov = require('markov-strings').default;
const db = require('../../db/databaseManager');

module.exports = Composer.mount(
  'message',
  async (ctx) => {

    if (ctx.updateType != 'message' || !ctx.message.text)
      return;

    const groupChat = await db.findGroupByIdOrCreate(ctx);

    let markov = new Markov(groupChat.messages, { stateSize: 2 });
    
    // Load pre-trained corpus to make the bot faster, the corpus will be trained for each group every x time
    let preTrainedCorpus = await db.getCorpus(ctx.chat.id);

    // If we don't have already a pre-trained corpus, the group chat is new, so we will train it since it shouldn't take so long
    if(!preTrainedCorpus) {

      await markov.buildCorpusAsync();

    } else {

      // If we have the pre-trained corpus, just set the value
      markov.corpus = preTrainedCorpus;

    }

    // If can't train corpus due to a lack of messages and get back an empty object {}, just save the message and return
    if(Object.keys(markov.corpus).length === 0) {

      await db.addMessage(ctx.chat.id, ctx.message.text);

      return;
    
    }

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

      ctx.replyWithHTML(`<b>MESSAGGIO DEBUG</b>\n<b>Risposta:</b> ${markovReply.string}\n<b>Prove (tries):</b> ${markovReply.tries}\n<b>Score:</b> ${markovReply.score}\n<b>Refs:</b> ${JSON.stringify(markovReply.refs)}`);

    }

    await db.addMessage(ctx.chat.id, ctx.message.text);

  });