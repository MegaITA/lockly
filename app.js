const telegraf = require('telegraf');
const dotenv = require('dotenv').config();
const Composer = require('telegraf/composer');
const scheduler = require('node-schedule');
const TrainerService = require('./services/TrainerService');
const telegramParser = require('./utils/telegramParser');
const db = require('./db/db');

let trainerService = new TrainerService();

const trainJob = scheduler.scheduleJob('trainJob', '*/30 * * * *', trainerService.startThreadedTraining);

const bot = new telegraf.Telegraf(process.env.BOT_TOKEN);

// Middleware

const groupCommands = new Composer();

groupCommands.command('/debug', require('./events/commands/debug'));
groupCommands.command('/enable', require('./events/commands/enable'));
groupCommands.command('/disable', require('./events/commands/disable'));
groupCommands.command('/stats', require('./events/commands/stats'));
groupCommands.command('/clearMessages', require('./events/commands/clearMessages'));
groupCommands.on('callback_query', require('./events/callbacks/callbackQueryHandler'));

groupCommands.on('message', require('./events/messages/markovReply'));

bot.use(groupCommands);

bot.use(async (ctx, next) => {


  // IDK why sometimes is undefined even message...
  if(ctx.message == undefined)
    return;

  //If it's not a text message
  if(ctx.message.text == undefined) 
    return;

  // If it's start command and private chat, next.
  if(ctx.message.text.includes('start') && ctx.message.chat.type == 'private') 
    return next();

  // If it's start command but not in a private chat, return.
  if(ctx.message.text.includes('start') && ctx.message.chat.type != 'private') 
    return;

  // If it's any other command/text message but it's not coming from a supergroup or group, return.
  if(ctx.message.chat.type == 'private' || ctx.chat.type == 'channel') 
    return;

  // Any other case should work correctly with the bot, next.
  return next();

});

// Events

bot.start((ctx) => {

  ctx.replyWithHTML('<b>Benvento da Lockly Bot!</b>\nQuesto bot è stupido e vuole imparare a parlare.\nTi consigliamo di tenerlo disabilitato fino a quando non ha qualche centinaio di messaggi nel database (usa /stats nel gruppo) e di non condividere dati sensibili in quanto i messaggi vengono salvati in chiaro nel nostro database.')

});

bot.launch();