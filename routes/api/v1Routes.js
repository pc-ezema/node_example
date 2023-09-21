const express = require('express');
const router = express.Router();
const authController = require('../../app/controllers/authController');
const dashboardController = require('../../app/controllers/dashboardController');
const verifyJWT = require('../../app/middlewares/verifyJWT');
const handleCustomError = require('../../exceptions/errorHandler');

router.get('/', (req, res, next) => {
    res.json({ 
        success: true, 
        message: 'Weclome to RESTful API using Nodejs.' 
    });    
});

router.post('/auth/register', authController.handleNewUser);
router.post('/auth/verify', authController.verifyUser);
router.post('/auth/verify/resend', authController.verifyResend);
router.post('/auth/login', authController.handleLogin);
router.post('/auth/refresh/token', authController.refreshToken);
router.post('/auth/forget/password', authController.forgetPassword);
router.post('/auth/reset/password', authController.resetPassword);

// Protected route
// router.use(verifyJWT);
router.get('/logout', verifyJWT.verifyJWT, dashboardController.handleLogout);
router.get('/profile', verifyJWT.verifyJWT, dashboardController.displayProfile);
router.post('/profile/updates', verifyJWT.verifyJWT, dashboardController.profileUpdate);

// Add the error handling middleware after your routes
router.use(handleCustomError);

// Export the router
module.exports = router;