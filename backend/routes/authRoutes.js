const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { otpLimiter } = require('../middleware/rateLimiter');
const passport = require('../config/passport');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

router.post('/register', otpLimiter, authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/forgot-password', otpLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Google OAuth
router.get('/google', (req, res, next) => {
  console.log('--- Google OAuth Initiation ---');
  console.log('Request Headers Host:', req.headers.host);
  console.log('Is Secure:', req.secure);
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);
    
    // Redirect to frontend with tokens
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

module.exports = router;
