const cron = require("node-cron");
const nodemailer = require("nodemailer");
const {
  getMedicationWithUser,
  updateMedication,
} = require("../repositories/medication-repository");
const {
  generateRandomString,
} = require("../helpers/random-string-generator-helper");

async function sendMedicineNotification() {
  const medications = await getMedicationWithUser();

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  medications.forEach(async (medication) => {
    const authenticationCode = generateRandomString(64);

    await updateMedication(
      {
        authentication_code: authenticationCode,
      },
      {
        where: {
          id: medication.id,
        },
      }
    );

    const mailTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Medicine Reminder</title>
            </head>
            <body>
                <p>Hello, ${medication.user.first_name} ${medication.user.last_name}</p>
                <p>I hope this email finds you well. This is the reminder of <strong>${medication.medication_name}</strong> medicine at <strong>${medication.time} [UTC TIME +00:00]</strong>. Please click on the <a href="http://localhost:5000/mark-medicine-as-done/${authenticationCode}">Mark as Done</a> to get it done.</p>
                <p style="margin-bottom: 0">Regards,</p>
                <p style="margin-top: 0">Health and Wellness Management Platform</p>
            </body>
            </html>
        `;

    let messageOptions = {
      from: process.env.GMAIL_USER,
      to: medication.user.email,
      subject: "Medicine Reminder",
      html: mailTemplate,
    };

    transporter.sendMail(messageOptions, function (error, info) {
      if (error) {
        throw error;
      } else {
        console.log("Email successfully sent!");
      }
    });
  });

  console.log("Cron job executed at:", new Date());
}

cron.schedule("*/30 * * * *", () => {
  sendMedicineNotification();
});
