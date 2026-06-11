const { OtpVerification } = require('../models');
const generateOtp = require('../utils/generateOtp');
const { Op } = require('sequelize');

const createOtp = async (email, userId = null) => {
  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await OtpVerification.create({
    userId,
    email,
    otpCode,
    expiresAt
  });

  return otpCode;
};

const verifyOtp = async (email, otpCode) => {
  const otpEntry = await OtpVerification.findOne({
    where: {
      email,
      otpCode,
      isUsed: false,
      expiresAt: {
        [Op.gt]: new Date()
      }
    }
  });

  if (!otpEntry) {
    return { success: false, message: 'Invalid or expired OTP' };
  }

  otpEntry.isUsed = true;
  await otpEntry.save();

  return { success: true, userId: otpEntry.userId };
};

module.exports = {
  createOtp,
  verifyOtp
};
