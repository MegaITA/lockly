const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const group = sequelize.define('group', {

  gid: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true
  },

  debugMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, { timestamps: false });

group.sync();

module.exports = group;