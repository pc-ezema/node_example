const jwt = require('jsonwebtoken');
const config = require('../../config/app');
const blacklist = require('./blacklist');

const verifyJWT = (req, res, next) => {
    
    const token = req.header('Authorization').replace('Bearer ', '');

    // Check if the token is blacklisted
    if (blacklist.contains(token)) {
        // return res.status(401).json({ error: 'Token is invalid' });
        return res.json({ 
            success: false, 
            message: 'Token is invalid',
        });
    }

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Token is valid, proceed with the protected route logic
        req.user = user; // Store user information in request
        next();
    });
}

module.exports = { verifyJWT };