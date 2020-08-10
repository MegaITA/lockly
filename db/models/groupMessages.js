const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db');
const group = require('./group');

const groupMessages = sequelize.define('groupMessages', {

  messages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    required: true,
    defaultValue: []
  }

}, { timestamps: false });

groupMessages.belongsTo(group);
groupMessages.sync();

module.exports = groupMessages;