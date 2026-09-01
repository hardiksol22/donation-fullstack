const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter (Using Gmail as an example)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME, // Your platform's official email
      pass: process.env.EMAIL_PASSWORD, // App Password generated from Google Account
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'Donation Platform Team <noreply@daansetu.com>',
    to: options.email,
    subject: options.subject,
    html: options.html, // Using HTML for beautiful formatted emails
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;