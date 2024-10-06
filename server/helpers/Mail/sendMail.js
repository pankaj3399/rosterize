const nodemailer = require("nodemailer");
require("dotenv").config();

const SENDER_EMAIL = process.env.PASSWORD_RESET_SENDER_EMAIL;
const SENDER_PASSWORD = process.env.PASSWORD_RESET_SENDER_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  console.log("Email Inputs:", { to, subject, text });

  if (!to || !subject || !text) {
    console.error("Please provide all required fields");
    throw new Error("Please provide all required fields");
  }

  if (!SENDER_EMAIL || !SENDER_PASSWORD) {
    throw new Error("Configuration error: Sender Email not configured");
  }

  const mailOptions = {
    from: SENDER_EMAIL,
    to: to,
    subject: subject,
    text: text,
  };
  console.log("Sending email ", mailOptions);

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    return {
      error: "Error sending email",
      message: error.message,
    };
  }
};

module.exports = sendEmail;
