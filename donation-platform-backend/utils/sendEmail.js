const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,              // 🔥 Changed to 587 (Cloud standard)
    secure: false,          // 🔥 Must be false for 587 (it upgrades to secure TLS automatically)
    requireTLS: true,       // 🔥 Forces TLS security
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Bypasses SSL certificate strictness
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