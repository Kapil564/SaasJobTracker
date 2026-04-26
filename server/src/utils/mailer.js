import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

  const info = await transporter.sendMail({
    from: `"SaasJobTracker" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email address",
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    html: `<p>Please verify your email by clicking the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
  });

  console.log("Message sent: %s", info.messageId);
};
