const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: 'lockly-db',
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;