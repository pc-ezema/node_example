'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Import your Sequelize instance

const ResetPassword = sequelize.define('ResetPassword', {
    email: DataTypes.STRING,
    resetCode: DataTypes.STRING,
    resetCodeExpire: DataTypes.STRING
});

module.exports = ResetPassword;
