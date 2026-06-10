const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST api/auth/register
router.post('/register', AuthController.register);

// @route   POST api/auth/login
router.post('/login', AuthController.login);

// @route   GET api/auth/me
router.get('/me', authMiddleware, AuthController.getCurrentUser);

// @route   GET api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET api/auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  AuthController.googleCallback
);

module.exports = router;
