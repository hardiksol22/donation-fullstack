const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a strict, explicit IPv4 Transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Using port 465 (Implicit SSL)
    secure: true, 
    family: 4, // 🔥 Force IPv4 to bypass cloud network blocks
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // 2. VERIFY CONNECTION BEFORE SENDING (Pro Debugging)
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("❌ SMTP Verification Failed:", error);
          reject(error);
        } else {
          console.log("✅ SMTP Server is ready to send messages!");
          resolve(success);
        }
      });
    });

    // 3. Prepare the Email Message
    const message = {
      from: {
        name: 'DaanSetu Team',
        address: process.env.EMAIL_USER
      },
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    // 4. Send Email
    const info = await transporter.sendMail(message);
    console.log("✅ Email successfully sent! Message ID:", info.messageId);
    return true;

  } catch (error) {
    console.error("❌ Final Email Sending Error:", error);
    throw error;
  }
};

module.exports = sendEmail;