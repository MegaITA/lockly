const Composer = require('telegraf/composer');
const Extra = require('telegraf/extra');
const db = require('../../db/databaseManager');
const { isAdmin } = require('../../utils/utils');

module.exports = Composer.mount(
  'message',
  async (ctx) => {

    let admins = await ctx.getChatAdministrators();

    if(!isAdmin(admins, ctx.from.id)) return ctx.reply('Comando riservato agli amministratori.');

    ctx.reply('Questa azione è irreversibile, sei sicuro di voler cancellare tutti i messaggi del bot?', Extra.HTML().markup((m) => 
    
    m.inlineKeyboard([

      m.callbackButton('Conferma', 'confirm_reset'),
      m.callbackButton('Annulla', 'cancel_reset')

    ])))

    
  } 
)