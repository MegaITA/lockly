const Composer = require('telegraf/composer');
const Extra = require('telegraf/extra');
const db = require('../../db/databaseManager');
const { isAdmin } = require('../../utils/utils');

module.exports = Composer.mount(
  'callback_query',
  async (ctx) => {

    let admins = await ctx.getChatAdministrators();

    if(!isAdmin(admins, ctx.update.callback_query.from.id)) return ctx.reply('Comando riservato agli amministratori.');

    let choice = ctx.update.callback_query.data;

    if(choice == 'confirm_reset') {

      await db.clearMessages(ctx.chat.id);

      ctx.editMessageText('Messaggi del bot resettati correttamente.');

      return;

    }

    ctx.editMessageText('Annullato.');
    
  } 
)