const { config } = require("dotenv");
config({ path: `.env` });
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

module.exports = transporter;
