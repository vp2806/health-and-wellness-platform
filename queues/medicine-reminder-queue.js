const { Queue, Worker } = require("bullmq");
const { config } = require("dotenv");
config({ path: `.env` });
const transporter = require("../helpers/send-mail-helper");
const {
  createMedicationActivity,
} = require("../repositories/medication-activity-repository");

const medicineReminderQueue = new Queue("reminderQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const sendMedicineReminderWorker = new Worker(
  "reminderQueue",
  async (job) => {
    try {
      const mailTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Medicine Reminder</title>
            </head>
            <body>
                <p>Hello, ${job.data.user.first_name} ${
        job.data.user.last_name
      }</p>
                <p>I hope this email finds you well. This is the reminder of <strong>${
                  job.data.medication_name
                }</strong> medicine at <strong>${job.data.start_date
        .split(" ")
        .pop()} </strong>. Please click on the <a href="http://localhost:5000/mark-medicine-as-done?medicine=${
        job.data.id
      }&current=${new Date()
        .toISOString()
        .slice(0, 10)}">Mark as Done</a> to get it done.</p>
                <p style="margin-bottom: 0">Regards,</p>
                <p style="margin-top: 0">Health and Wellness Management Platform</p>
            </body>
            </html>
        `;

      let messageOptions = {
        from: process.env.GMAIL_USER,
        to: job.data.user.email,
        subject: "Medicine Reminder",
        html: mailTemplate,
      };

      transporter.sendMail(messageOptions, async function (error, info) {
        if (error) {
          throw error;
        } else {
          console.log("Email successfully sent!");
          await createMedicationActivity({
            medication_id: job.data.id,
            notification_timestamp: new Date(),
          });
        }
      });
    } catch (error) {
      console.error("Error performing a medicine reminder job", error);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  }
);

module.exports = medicineReminderQueue;
