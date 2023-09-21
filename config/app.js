require('dotenv').config();

const config = {
    appName: process.env.APP_NAME || 'Default App Name',

    mailMailer: process.env.MAIL_MAILER,
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUsername: process.env.MAIL_USERNAME,
    mailPassword: process.env.MAIL_PASSWORD,
    mailEncryption: process.env.MAIL_ENCRYPTION,
    mailFrom: process.env.MAIL_FROM_ADDRESS,
    mailSecure: 'tls',

    dbUsername: process.env.DB_USER,
    dbPassword: process.env.DB_PASS,
    dbDatabase: process.env.DB_NAME,
    dbHost: process.env.DB_HOST,
    dbDialect: 'mysql',

    JWT_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

module.exports = config;