import nodemailer from "nodemailer";
import { ENV } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: ENV.BREVO_EMAIL,
    pass: ENV.BREVO_SMTP_KEY,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Brevo connection error:', error);
  } else {
    console.log('✅ Brevo email server ready');
  }
});