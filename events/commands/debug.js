const Composer = require('telegraf/composer');
const db = require('../../db/databaseManager');
const { isAdmin } = require('../../utils/utils');

module.exports = Composer.mount(
  'message',
  async (ctx) => {

    let groupSettings = await db.findGroupByID(ctx);

    let admins = await ctx.getChatAdministrators();

    if(!isAdmin(admins, ctx.from.id)) return ctx.reply('Comando riservato agli amministratori.');
    
    groupSettings.debugMode = !groupSettings.debugMode;

    await groupSettings.save();
  
    if(groupSettings.debugMode) return ctx.reply('Debug mode attivata.');
  
    ctx.reply('Debug mode disattivata');
  
  } 
)