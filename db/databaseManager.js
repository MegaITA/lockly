const group = require('./models/group');

module.exports = {

  findGroupByIdOrCreate: async (ctx) => {

    let groupChat = await group.findOne({ groupID: ctx.chat.id });

    if(!groupChat) {

      let newGroupChat = await group.create({

        groupID: ctx.chat.id,
        messages: [ctx.message.text]

      });

      return newGroupChat;
    
    }

    return groupChat;

  },

  findGroupByID: async (groupID) => {

    let groupChat = await group.findOne({ groupID });

    return groupChat;

  },
  
  getCorpus: async (groupID) => {

    let groupChat = await group.findOne({ groupID });

    if(!groupChat.corpus)
      return false;

    return JSON.parse(groupChat.corpus);

  },

  updateCorpus: async (groupID, corpus) => {

    let groupChat = await group.findOne({ groupID });

    groupChat.corpus = JSON.stringify(corpus);

    groupChat.save();

    return true;

  },

  getMessages: async (groupID) => {

    let groupChat = await group.findOne({ groupID });

    return groupChat.messages;
  
  },

  addMessage: async (groupID, message) => {

    let groupChat = await group.findOne({ groupID });

    groupChat.messages.push(message);

    groupChat.save();

    return true;

  },

  getGroups: async () => {

    let groupChats = await group.find({});

    return groupChats;

  }

}