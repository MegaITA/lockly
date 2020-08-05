const group = require('./models/group');

module.exports = {

  findGroupByID: async (ctx) => {

    let groupChat = await group.findOne({ groupID: ctx.chat.id });

    if(!groupChat) {

      let newGroupChat = await group.create({

        groupID: ctx.chat.id,
        messages: [ctx.message.text]

      });

      return newGroupChat;
    
    }

    return groupChat;

  }

}