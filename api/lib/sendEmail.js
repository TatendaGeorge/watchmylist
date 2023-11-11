// sendEmail.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  pool: true,
  service: "hotmail",  // Change this to "outlook"
  port: 2525,           // Use port 587 for Outlook
  secure: false,       // Set secure to false if using port 587
  auth: {
    user: "pricewizard@outlook.com",
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1,
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: "pricewizard@outlook.com",
      to,
      subject,
      text,
    });

    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Example: Sending a test email
sendEmail(
  "tatenda@obox.co.za",
  "Test Subject",
  "This is a test email from Nodemailer."
);
