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
    verifyEmail
}=require('../controller/authController');

router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/logoutUser',logoutUser);
router.get('/profile',protect,getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get(
  "/verify-email/:token",
  verifyEmail
);

module.exports = router