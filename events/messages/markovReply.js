const Composer = require('telegraf/composer');
const Markov = require('markov-strings').default;
const db = require('../../db/databaseManager');
const config = require('../../config.json')

module.exports = Composer.mount(
  'message',
  async (ctx) => {

    if (ctx.updateType != 'message' || !ctx.message.text)
      return;

    const group = await db.findGroupByIdOrCreate(ctx);

    if(!group.enabled) {

      await db.addMessage(ctx.chat.id, ctx.message.text);

      return;

    }
    
    let { messages } = await db.getMessages(ctx.chat.id);
    
    // Load pre-trained corpus to make the bot faster, the corpus will be trained for each group every x time
    let groupMarkovData = await db.getMarkovData(ctx.chat.id);

    let markov;

    // If we don't have already a pre-trained corpus, the group chat is new, so we will train it since it shouldn't take so long
    if(!groupMarkovData) {


      markov = new Markov({

        stateSize: config.bot.stateSize

      });

      await markov.addDataAsync(messages);

    } else {

      markov = new Markov({

        stateSize: config.bot.stateSize

      });

      // If we have the pre-trained data, import the stored one

      await markov.import(groupMarkovData.markovData);

    }

    // If can't train corpus due to a lack of messages and get back an empty object {}, just save the message and return
    // if(!markov.corpus) {

    //   if(group.debugMode)
    //     ctx.replyWithHTML(`<b>MESSAGGIO DEBUG</b>\n<b>Errore:</b> Non sono riuscito a generare un messaggio per via della scarsa disponibilità di messaggi nel mio database.`)

    //   await db.addMessage(ctx.chat.id, ctx.message.text);

    //   return;
    
    // }

    const markovOptions = {

      maxTries: 5000,
      prng: Math.random,
      filter: (result) => {

        return result.string.split(' ').length >= 5

      }

    }

    let replyMessage;

    try {
      
      const markovReply = await markov.generateAsync(markovOptions);

      if (!group.debugMode) {
  
        ctx.reply(markovReply.string);
  
      } else {
  
        replyMessage = `<b>MESSAGGIO DEBUG</b>\n<b>Risposta:</b> ${markovReply.string}\n<b>Prove (tries):</b> ${markovReply.tries}\n<b>Score:</b> ${markovReply.score}\n<b>Refs:</b> ${JSON.stringify(markovReply.refs)}`;
  
      }
      
    } catch (error) {

      replyMessage = `<b>MESSAGGIO DEBUG</b>\n<b>Errore:</b> ${error.message}`;
      
    }

    if(group.debugMode)
      ctx.replyWithHTML(replyMessage);

    await db.addMessage(ctx.chat.id, ctx.message.text);

  });