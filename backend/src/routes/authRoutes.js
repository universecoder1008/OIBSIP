const express = require('express')
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const {
     registerUser,
    loginUser,
    logoutUser,
    getProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile
}=require('../controller/authController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', logoutUser);

router.get('/profile', protect, getProfile);

router.put('/profile/update', protect, updateProfile);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.get('/verify-email/:token', verifyEmail);

module.exports = router