const User = require('../../models/user');
const ResetPassword = require('../../models/resetpassword');
const bcrypt = require('bcrypt');
const handleCustomError = require('../../exceptions/errorHandler');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../../services/emailService'); // Import the email service
const jwt = require('jsonwebtoken');
const config = require('../../config/app');
const Joi = require('joi');

function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
}

exports.handleNewUser = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Confirm password does not match',
        }),
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.json({ 
            success: false, 
            message: 'Please see errors parameter for all errors.',
            errors: error.details[0].message
        });
    }

    try {
        const verificationCode = generateVerificationCode(); // Generate a random code
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Check if the username already exists
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.json({ 
                success: false, 
                message: 'Email already exists',
            });
        }

        const user = await User.create({
            accountType: 'User',
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            verificationCode: verificationCode
        });

        // Send verification email
        await sendVerificationEmail(user);

        return res.json({ 
            success: true, 
            message: 'Please check your email for a verification code to complete your registration.',
            data: user
        });
    } catch (err) {
        handleCustomError(err, res);
    }
}

exports.verifyUser = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
        code: Joi.string().required(),
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.json({ 
            success: false, 
            message: 'Please see errors parameter for all errors.',
            errors: error.details[0].message
        });
    }

    try {
        const user = await User.findOne({ where: { verificationCode: req.body.code } });

        if (!user) {
            return res.json({ 
                success: false, 
                message: 'Invalid verification code.'
            });
        }

        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        return res.json({ 
            success: true, 
            message: 'Email verified successfully.'
        });
    } catch (err) {
        handleCustomError(err, res);
    }
}

exports.verifyResend = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.json({ 
            success: false, 
            message: 'Please see errors parameter for all errors.',
            errors: error.details[0].message
        });
    }

    try {
        const verificationCode = generateVerificationCode(); // Generate a random code

        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.json({ 
                success: false, 
                message: 'Not found iun our database.'
            });
        }

        if(user.isVerified == true)
        {
            return res.json({ 
                success: false, 
                message: 'Email has been verified, You can now login.'
            });
        }

        user.verificationCode = verificationCode;
        await user.save();

        // Send verification email
        await sendVerificationEmail(user);

        return res.json({ 
            success: true, 
            message: 'A fresh verification code has been sent to your email address.'
        });
    } catch (err) {
        handleCustomError(err, res);
    }
}

exports.handleLogin = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.json({ 
            success: false, 
            message: 'Please see errors parameter for all errors.',
            errors: error.details[0].message
        });
    }

    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.json({ 
                success: false, 
                message: "Email doesn't exist in our database.",
            });
        }
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            return res.json({ 
                success: false, 
                message: "Incorrect password.",
            });
        }

        // Generate access token
        const accessToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, { expiresIn: '5h' });

        // Generate refresh token (and save it in the database)
        const refreshToken = jwt.sign({ userId: user.id }, config.REFRESH_SECRET, { expiresIn: '7d' });

        // Saving refreshToken with current user
        user.refreshToken = refreshToken;
        await user.save();

        return res.json({ 
            success: true, 
            message: "User logged in succesfully.",
            accessToken: accessToken,
            data: user
        });

    } catch (error) {
        handleCustomError(err, res);
    }
}

exports.refreshToken = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
        refreshToken: Joi.string().required(),
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.json({ 
            success: false, 
            message: 'Please see errors parameter for all errors.',
            errors: error.details[0].message
        });
    }

    const user = await User.findOne({ where: { refreshToken: req.body.refreshToken } });
    if (!user) {
        return res.json({ 
            success: false, 
            message: "Refresh Token doesn't exist in our database.",
        });
    }

    try {
        // Generate a new access token
        const accessToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, { expiresIn: '5h' });

        return res.json({ 
            success: true, 
            message: "User logged in succesfully.",
            accessToken: accessToken,
            data: user
        });
    } catch(err) {
        handleCustomError(err, res);
    }
}

exports.forgetPassword = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.json({ 
            success: false, 
            message: 'Please see errors parameter for all errors.',
            errors: error.details[0].message
        });
    }

    // Find the user based on the provided email
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
        return res.json({
            success: false,
            message: "User not found in our database."
        });
    }

    ResetPassword.destroy({ where: {email: req.body.email}});

    try {
        const resetCode = generateVerificationCode(); // Generate a random code

        const resetpassword = await ResetPassword.create({
            email: user.email,
            resetCode: resetCode,
            resetCodeExpire: Date.now() + 3600000, // Reset token valid for 1 hour,
        });

        // Send reset code email
        await sendResetPasswordEmail(user, resetpassword);

        return res.json({ 
            success: true, 
            message: 'We have emailed your password reset code.',
        });
    } catch(err) {
        handleCustomError(err, res);
    }
}

exports.resetPassword = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
        resetCode: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Confirm password does not match',
        }),
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res.json({ 
            success: false, 
            message: 'Please see errors parameter for all errors.',
            errors: error.details[0].message
        });
    }

    try {
        // Find the reset token
        const resetPassword = await ResetPassword.findOne({ where: { resetCode: req.body.resetCode } });

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        if (!resetPassword || resetPassword.resetCodeExpire < new Date()) {
            return res.json({ 
                success: false, 
                message: 'Invalid or expired token.',
            });
        }

        // Find the user based on the provided email
        const user = await User.findOne({ where: { email: resetPassword.email } });

        if (!user) {
            return res.json({ 
                success: false, 
                message: 'User not found in our database.',
            });
        }

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Delete the reset token
        await resetPassword.destroy();

        return res.json({ 
            success: true, 
            message: 'Password reset successfully.',
        });
    } catch (error) {
        handleCustomError(err, res);
    }
}