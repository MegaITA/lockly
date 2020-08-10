const db = require('../db/databaseManager');
const fs = require('fs');
const { bot } = require('../config.json');

module.exports = {

  parseGroupJSON: async (groupID, path) => {

    let group = await db.findGroupByID(groupID);

    if(!group)
      throw new Error(`Unable to find a group with groupID: ${groupID}`);

    let groupChat = await db.getMessages(groupID);

    if(!groupChat)
      throw new Error(`Unable to find a group chat with groupID: ${groupID}`);

    const JSONFile = await JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }));

    const parsedMessages = JSONFile.messages
      .filter((msg) => msg.type == 'message' && typeof msg.text == 'string' && msg.text != '')
      .map((msg) => msg.text);

    // console.log(parsedMessages.length);

    groupChat.messages = parsedMessages.slice(parsedMessages.length - ( bot.messagesArrayMaxSize - 1 ), parsedMessages.length);

    groupChat.save();

  }

}