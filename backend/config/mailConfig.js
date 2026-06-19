const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const mailConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: parseInt(process.env.SMTP_PORT, 10) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

const transporter = nodemailer.createTransport(mailConfig);

// Validate SMTP on startup
console.log(`[SMTP Config] Attempting connection to host: ${mailConfig.host}:${mailConfig.port} (secure: ${mailConfig.secure})`);
transporter.verify((error, success) => {
  if (error) {
    console.error('⚠ SMTP Connection Result: Failed to verify SMTP connection or credentials. Error details:', error);
  } else {
    console.log('✓ SMTP Connection Result: Successfully connected and authenticated with SMTP server.');
  }
});

module.exports = transporter;
