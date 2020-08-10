const Sequelize = require('sequelize');
const { database } = require('../config.json');

const sequelize = new Sequelize(database.dbName, database.username, database.password, {
    host: database.host,
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;