const cron = require("node-cron");
const nodemailer = require("nodemailer");
const {
  getMedicationWithUser,
} = require("../repositories/medication-repository");

async function sendMedicationNotification() {
  const medications = await getMedicationWithUser();

  console.log(medications, "..............");
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  medications.forEach((medication) => {
    const mailTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Medicine Reminder</title>
            </head>
            <body>
                <p>Hello, ${medication.user.first_name} ${medication.user.last_name}</p>
                <p>I hope this email finds you well. This is the reminder of <strong>${medication.medication_name}</strong> medicine at <strong>${medication.time}{}[24 Hours Format]<strong>. Please click on the <a href="http://localhost:5000/get-users">Mark as Done</a> to mark it as done.</p>
                <hr>

                <p>Regards,</p>
                <p>Health and Wellness Management Platform</p>
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

cron.schedule("* * * * *", () => {
  sendMedicationNotification();
});
