'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/app');

const sequelize = new Sequelize(config.dbDatabase, config.dbUsername, config.dbPassword, {
    host: config.dbHost,
    dialect: config.dbDialect,
});

module.exports = sequelize;
