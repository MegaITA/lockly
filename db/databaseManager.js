const Group = require('./models/group');
const GroupMessages = require('./models/groupMessages');
const GroupMarkovData = require('./models/groupMarkovData');
const sequelize = require('sequelize');
const groupMessages = require('./models/groupMessages');

module.exports = {

  findGroupByIdOrCreate: async (ctx) => {

    let group = await Group.findOne({ where: { gid: ctx.chat.id } });

    if(!group) {

      let newGroup = await Group.create({

        gid: ctx.chat.id,
        enabled: true,
        debugMode: false
        
      });

      let newMessage = await GroupMessages.create({

        groupGid: ctx.chat.id,
        messages: [ctx.message.text]

      });

      return newGroup;
    
    }

    return group;

  },

  findGroupByID: async (gid) => {

    let groupChat = await Group.findOne({ where: { gid } });

    return groupChat;

  },
  
  getMarkovData: async (gid) => {

    let groupMarkovData = await GroupMarkovData.findOne({ where: { groupGid: gid } });

    if(!groupMarkovData)
      return false;

    return groupMarkovData;

  },

  updateOrCreateMarkovData: async (gid, markovData) => {

    let groupMarkovData = await GroupMarkovData.findOne({ where: { groupGid: gid } });

    if(!groupMarkovData) {

      let newMarkovData = await GroupMarkovData.create({

        groupGid: gid,
        markovData: markovData

      });

      return;

    }

    groupMarkovData.markovData = markovData;

    groupMarkovData.save();

    return true;

  },

  getMessages: async (gid) => {

    let groupChat = await GroupMessages.findOne({ where: { groupGid: gid } });

    if(!groupChat)
      return false;

    return groupChat;
  
  },

  addMessage: async (gid, message) => {

    let groupChat = await GroupMessages.findOne({ where: { groupGid: gid } });

    // Creating a new array instead of pushing since sequelize doesn't detect push changes and refuses to save the array.
    // Slicing in order to limit the messages size 
    // I already tried with something like 300k messages and a black hole appeared and ate my fucking RAM
    let newArr = [
      message, 
      ...groupChat.messages
        .slice(groupChat.messages.length - (process.env.MAX_MESSAGES - 1), groupChat.messages.length)
    ];

    groupChat.messages = newArr;

    await groupChat.save();

    return true;

  },

  clearMessages: async (gid) => {

    let groupChat = await GroupMessages.findOne({ where: { groupGid: gid } });

    let groupMarkovData = await GroupMarkovData.findOne({ where: { groupGid: gid } });

    if(groupMarkovData) {
      
      groupMarkovData.markovData = {};

      await groupMarkovData.save();

    }

    if(groupChat) {

      groupChat.messages = [];

      await groupChat.save();
    
    }

  },

  getGroups: async () => {

    let groupChats = await Group.findAll();

    return groupChats;

  }

}