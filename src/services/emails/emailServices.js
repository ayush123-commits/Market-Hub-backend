import nodemailer from "nodemailer";
import {
  welcomeEmail,
  verificationCodeEmail,
  passwordResetCodeEmail,
  accountVerifiedEmail,
} from "./Templates/registerEmail.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export const sendResigterEmail = (to, name) => {
  const email = welcomeEmail(name);

  return transporter.sendMail({
    from: process.env.BREVO_FROM_EMAIL,
    to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
};

export const sendAccountVerifiedEmail = (to) => {
  const email = accountVerifiedEmail();

  return transporter.sendMail({
    from: process.env.BREVO_FROM_EMAIL,
    to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
};

export const sendVerificationCodeEmail = (to, code) => {
  const email = verificationCodeEmail(code);

  return transporter.sendMail({
    from: process.env.BREVO_FROM_EMAIL,
    to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
};

export const sendPasswordResetCodeEmail = (to, code) => {
  const email = passwordResetCodeEmail(code);

  return transporter.sendMail({
    from: process.env.BREVO_FROM_EMAIL,
    to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
};
