const Composer = require('telegraf/composer');
const Markov = require('markov-strings').default;
const db = require('../../db/databaseManager');

module.exports = Composer.mount(
  'message',
  async (ctx) => {

    if (ctx.updateType != 'message' || !ctx.message.text)
      return;

    const groupChat = await db.findGroupByIdOrCreate(ctx);

    let markov = new Markov(groupChat.messages, { 

      stateSize: groupChat.messages <= 1000 ? 1 : 2

    });
    
    // Load pre-trained corpus to make the bot faster, the corpus will be trained for each group every x time
    let preTrainedCorpus = await db.getCorpus(ctx.chat.id);

    // If we don't have already a pre-trained corpus, the group chat is new, so we will train it since it shouldn't take so long
    if(!preTrainedCorpus) {

      await markov.buildCorpusAsync();

    } else {

      // If we have the pre-trained corpus, build a small corpus and then change it with the pre-trained one 
      // (if you have a better solution, please help me, I also tried to save the instance on the database but it's missing the methods)

      await markov.buildCorpusAsync([]);

      markov.corpus = preTrainedCorpus;

    }

    // If can't train corpus due to a lack of messages and get back an empty object {}, just save the message and return
    if(Object.keys(markov.corpus).length === 0) {

      await db.addMessage(ctx.chat.id, ctx.message.text);

      return;
    
    }

    const markovOptions = {

      maxTries: 10000,
      prng: Math.random

    }

    let debugMessage;

    try {
      
      const markovReply = await markov.generateAsync(markovOptions);

      if (!groupChat.debugMode) {
  
        ctx.reply(markovReply.string);
  
      } else {
  
        debugMessage = `<b>MESSAGGIO DEBUG</b>\n<b>Risposta:</b> ${markovReply.string}\n<b>Prove (tries):</b> ${markovReply.tries}\n<b>Score:</b> ${markovReply.score}\n<b>Refs:</b> ${JSON.stringify(markovReply.refs)}`;
  
      }
      
    } catch (error) {

      debugMessage = `<b>MESSAGGIO DEBUG</b>\n<b>Errore:</b> ${error.message}`;
      
    }

    if(groupChat.debugMode)
      ctx.replyWithHTML(debugMessage);

    await db.addMessage(ctx.chat.id, ctx.message.text);

  });