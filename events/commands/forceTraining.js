const Composer = require('telegraf/composer');
const TrainerService = require('../../services/TrainerService');
const db = require('../../db/databaseManager');
const { isAdmin } = require('../../utils/utils');

module.exports = Composer.mount(
  'message',
  async (ctx) => {

    let admins = await ctx.getChatAdministrators();

    if(!isAdmin(admins, ctx.from.id)) return ctx.reply('Comando riservato agli amministratori.');

    let groupMessages = await db.getMessages(ctx.chat.id);

    let trainerService = new TrainerService();
    
    trainerService.startThreadedTraining();

    await ctx.replyWithHTML(`Avviato training forzato del bot.`)
  
  } 
)