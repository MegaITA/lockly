const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db');
const group = require('./group');

const groupMarkovData = sequelize.define('groupMarkovData', {

  markovData: {
    type: DataTypes.JSON,
    required: true,
    defaultValue: {} 
  }

}, { timestamps: false });

groupMarkovData.belongsTo(group);
groupMarkovData.sync();

module.exports = groupMarkovData;