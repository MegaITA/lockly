const Composer = require('telegraf/composer');
const db = require('../../db/databaseManager');
const { isAdmin } = require('../../utils/utils');

module.exports = Composer.mount(
  'message',
  async (ctx) => {

    let groupSettings = await db.findGroupByIdOrCreate(ctx);

    let admins = await ctx.getChatAdministrators();

    if(!isAdmin(admins, ctx.from.id)) return ctx.reply('Comando riservato agli amministratori.');
    
    groupSettings.enabled = true;

    await groupSettings.save();
  
    ctx.reply('Chatbot attivato.');
  
  } 
)