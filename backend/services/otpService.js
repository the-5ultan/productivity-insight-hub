const { OtpVerification } = require('../models');
const generateOtp = require('../utils/generateOtp');
const { Op } = require('sequelize');

const createOtp = async (email, userId = null) => {
  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  console.log(`[OTP Service] Creating OTP for ${email}: code=${otpCode}, expiresAt=${expiresAt.toISOString()}`);

  await OtpVerification.create({
    userId,
    email,
    otpCode,
    expiresAt
  });

  console.log(`[OTP Service] OTP stored successfully for ${email}`);
  return otpCode;
};

const invalidateUserOtps = async (email) => {
  console.log(`[OTP Service] Invalidating all unused OTPs for ${email}`);
  const [affectedCount] = await OtpVerification.update(
    { isUsed: true },
    { where: { email, isUsed: false } }
  );
  console.log(`[OTP Service] Invalidated ${affectedCount} OTP(s) for ${email}`);
};

const verifyOtp = async (email, otpCode) => {
  console.log(`[OTP Service] Verifying OTP for ${email}: code=${otpCode}`);

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
    console.log(`[OTP Service] No valid OTP found for ${email} with code ${otpCode}`);
    return { success: false, message: 'Invalid or expired OTP' };
  }

  console.log(`[OTP Service] Valid OTP found for ${email}, marking as used`);
  otpEntry.isUsed = true;
  await otpEntry.save();

  console.log(`[OTP Service] OTP verified successfully for ${email}`);
  return { success: true, userId: otpEntry.userId };
};

module.exports = {
  createOtp,
  invalidateUserOtps,
  verifyOtp
};
