const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Matching your .env
      pass: process.env.EMAIL_PASS, // Matching your .env
    },
  });

  const message = {
    from: `DaanSetu Team <${process.env.EMAIL_USER}>`, // Sends from your email
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;