'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Import your Sequelize instance

const User = sequelize.define('User', {
    accountType: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    verificationCode: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
});

module.exports = User;
