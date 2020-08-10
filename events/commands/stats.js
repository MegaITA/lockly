const Composer = require('telegraf/composer');
const db = require('../../db/databaseManager');
const sys = require('systeminformation');
const { isAdmin } = require('../../utils/utils');

module.exports = Composer.mount(
  'message',
  async (ctx) => {

    let admins = await ctx.getChatAdministrators();

    if(!isAdmin(admins, ctx.from.id)) return ctx.reply('Comando riservato agli amministratori.');

    let groupMessages = await db.getMessages(ctx.chat.id);

    await ctx.replyWithHTML(`<b>STATISTICHE BOT</b>\n\n<b>Messaggi nel database:</b> <code>${groupMessages.messages.length}</code>\n<b>Utilizzo CPU:</b> <code>${(await sys.currentLoad()).avgload}%</code>\n<b>Utilizzo RAM:</b> <code>${Math.floor(await process.memoryUsage().heapUsed / 1e6)}MB</code>`)
  
  } 
)