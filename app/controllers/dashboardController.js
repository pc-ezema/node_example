const User = require('../../models/user');
const bcrypt = require('bcrypt');
const handleCustomError = require('../../exceptions/errorHandler');
const config = require('../../config/app');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const blacklist = require('../middlewares/blacklist');

exports.handleLogout = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    try {
        const user = await User.findByPk(req.user.userId);

        if (!user) {
            return res.json({ 
                success: false, 
                message: 'Token expired.',
            });
        }

        user.refreshToken = null;
        user.save();

         // Add the token to the blacklist
        blacklist.add(token);

        return res.json({ 
            success: true, 
            message: 'Logout successful.',
        });
    } catch(err) {
        handleCustomError(err, res);
    }
    
}

exports.displayProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);

        if (!user) {
            return res.json({ 
                success: false, 
                message: 'User not found.',
            });
        }

        return res.json({ 
            success: true, 
            message: 'My profile details.',
            data: user
        });
        
    } catch (err) {
        handleCustomError(err, res);
    }
}

exports.profileUpdate = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
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
}