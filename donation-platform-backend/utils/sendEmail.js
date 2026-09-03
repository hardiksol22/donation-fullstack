const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // 🔥 Explicitly define host instead of 'service'
    port: 465,              // 🔥 Force Port 465
    secure: true,           // 🔥 Force Secure Connection
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Bypasses strict cloud server network blocks
    }
  });

  const message = {
    from: `DaanSetu Team <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;