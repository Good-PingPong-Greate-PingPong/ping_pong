import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.mailer.user,
    pass: config.mailer.pass,
  },
});
const mailer = () => {
  const sendResetEmail = async (to: string, resetToken: string) => {
    const resetLink = `${config.mailer.link}${resetToken}`;

    await transporter.sendMail({
      from: `"Great Ping Pong" <${config.mailer.user}>`,
      to,
      subject: 'Reset Your 2FA Authentication',
      text: `Hello!\n\nClick this link to reset your 2FA authentication:\n\n${resetLink}\n\nThis link will expire in 5 minutes.\n\nIf you did not request this, please ignore this email.`,
    });
  };

  return {
    sendResetEmail,
  };
};

export default mailer();
