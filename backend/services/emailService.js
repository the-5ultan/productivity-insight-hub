const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Techlytics Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

const sendOtpEmail = async (email, otp) => {
  const subject = 'Your Techlytics Verification Code';
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #000; text-align: center;">Welcome to Techlytics</h2>
      <p style="font-size: 16px; color: #555;">Use the following 6-digit code to verify your email address. This code is valid for 5 minutes.</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #888; text-align: center;">If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #aaa; text-align: center;">© 2026 Techlytics Platform. All rights reserved.</p>
    </div>
  `;
  await sendEmail(email, subject, html);
};

const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to Techlytics!';
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #000; text-align: center;">Account Verified!</h2>
      <p style="font-size: 16px; color: #555;">Hello ${name},</p>
      <p style="font-size: 16px; color: #555;">Your account at Techlytics has been successfully verified. You can now complete your profile and start your research journey.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #000; color: #fff; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Go To Dashboard</a>
      </div>
      <p style="font-size: 12px; color: #aaa; text-align: center;">© 2026 Techlytics Platform. All rights reserved.</p>
    </div>
  `;
  await sendEmail(email, subject, html);
};

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail
};
