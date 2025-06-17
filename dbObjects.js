const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.dqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);

module.exports = {Users};