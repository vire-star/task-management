// import nodemailer from "nodemailer";
// import { ENV } from "./env.js";

// export const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: ENV.BREVO_EMAIL,
//     pass: ENV.BREVO_SMTP_KEY,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.log('❌ Brevo connection error:', error);
//   } else {
//     console.log('✅ Brevo email server ready');
//   }
// });


import nodemailer from "nodemailer";
import brevoTransport from "nodemailer-brevo-transport";
import { ENV } from "./env.js";

export const transporter = nodemailer.createTransport(
  new brevoTransport({
    apiKey: ENV.BREVO_API_KEY, // API key use karo, SMTP key nahi
  })
);

// Verify karne ki zarurat nahi, but optional hai
console.log('✅ Brevo email configured with API transport');
