const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const mailConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

const transporter = nodemailer.createTransport(mailConfig);

// Validate SMTP on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('⚠ SMTP Credentials Missing or Invalid');
  } else {
    console.log('✓ SMTP Configuration Loaded');
  }
});

module.exports = transporter;
