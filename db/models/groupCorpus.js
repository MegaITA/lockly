const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db');
const group = require('./group');

const groupCorpus = sequelize.define('groupCorpus', {

  corpus: {
    type: DataTypes.JSON,
    required: true,
    defaultValue: {} 
  }

}, { timestamps: false });

groupCorpus.belongsTo(group);
groupCorpus.sync();

module.exports = groupCorpus;