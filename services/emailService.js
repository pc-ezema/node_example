const nodemailer = require('nodemailer');
const ejs = require('ejs');
const config = require('../config/app');
const path = require('path');

const transport = nodemailer.createTransport({
    host: config.mailHost,
    port: config.mailPort,
    auth: {
        user: config.mailUsername,
        pass: config.mailPassword
      }
});

async function sendVerificationEmail(user) {
    const emailTemplatePath = path.join(__dirname, '../views/verification-email.ejs');

    const renderedHtml = await ejs.renderFile(emailTemplatePath, {
        appName: config.appName,
        name: user.firstName + ' ' + user.lastName,
        verificationCode: user.verificationCode,
    });

    const mailOptions = {
        from: config.mailFrom,
        to: user.email,
        subject: config.appName + ' Email Verification',
        html: renderedHtml,
    };

    // ... sendMail logic ...
    await transport.sendMail(mailOptions);
}

async function sendResetPasswordEmail(user, resetpassword) {
    const emailTemplatePath = path.join(__dirname, '../views/reset-password-email.ejs');

    const renderedHtml = await ejs.renderFile(emailTemplatePath, {
        appName: config.appName,
        name: user.firstName + ' ' + user.lastName,
        resetPasswordCode: resetpassword.resetCode,
    });

    const mailOptions = {
        from: config.mailFrom,
        to: user.email,
        subject: config.appName + ' Reset Password',
        html: renderedHtml,
    };

    // ... sendMail logic ...
    await transport.sendMail(mailOptions);
}

module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail
};