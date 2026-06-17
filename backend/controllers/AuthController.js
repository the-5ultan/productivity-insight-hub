const authService = require('../services/authService');
const otpService = require('../services/otpService');
const emailService = require('../services/emailService');
const activityService = require('../services/activityService');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const user = await authService.registerUser(name, email, password);
    
    const otp = await otpService.createOtp(email, user.id);
    await emailService.sendOtpEmail(email, otp);

    await activityService.logActivity(user.id, 'REGISTER', 'User registered with email', req.ip);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.'
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const result = await otpService.verifyOtp(email, otpCode);

    if (!result.success) {
      return res.status(400).json(result);
    }

    const user = await User.findOne({ where: { email } });
    user.isEmailVerified = true;
    user.accountStatus = 'active';
    await user.save();

    await emailService.sendWelcomeEmail(email, user.name);
    await activityService.logActivity(user.id, 'OTP_VERIFIED', 'User verified email successfully', req.ip);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now login.'
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    await activityService.logActivity(user.id, 'LOGIN', 'User logged in successfully', req.ip);

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const user = await User.findOne({ where: { email } });
    
    if (user) {
      const otp = await otpService.createOtp(email, user.id);
      await emailService.sendOtpEmail(email, otp);
      await activityService.logActivity(user.id, 'FORGOT_PASSWORD', 'Password reset requested', req.ip);
    }

    res.status(200).json({
      success: true,
      message: 'If the email exists, a reset code has been sent.'
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    const result = await otpService.verifyOtp(email, otpCode);

    if (!result.success) {
      return res.status(400).json(result);
    }

    const user = await User.findOne({ where: { email } });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await activityService.logActivity(user.id, 'RESET_PASSWORD', 'Password reset successfully', req.ip);

    res.status(200).json({
      success: true,
      message: 'Password reset successful.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword
};
