const { Queue, Worker } = require("bullmq");
const csvWriter = require("csv-writer");
const path = require("path");
const transporter = require("../helpers/send-mail-helper");
const { config } = require("dotenv");
config({ path: `.env` });
const uploadWeeklyReportToCloud = require("../storage/storage");
const fs = require("fs");

const medicationReportQueue = new Queue("reportQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const sendReportWorker = new Worker(
  "reportQueue",
  async (job) => {
    try {
      const weeklyReportData = job.data;
      let fileName = "";

      weeklyReportData.map((medicationActivity) => {
        if (!medicationActivity.medication.day) {
          medicationActivity.medication.day = "-";
        }

        if (!medicationActivity.medication.end_date) {
          medicationActivity.medication.end_date = "-";
        }

        if (!medicationActivity.done_at) {
          medicationActivity.done_at = "-";
        }
        return medicationActivity;
      });

      //Generate Weekly Report in CSV format
      if (weeklyReportData[0].medication) {
        fileName = `${Date.now()}-${
          weeklyReportData[0].medication.user.first_name
        }-${weeklyReportData[0].medication.user.last_name}-Report.csv`;
      }

      const writer = csvWriter.createObjectCsvWriter({
        path: path.resolve(__dirname, "../uploads", fileName),
        header: [
          {
            id: "medication.medication_add_type.type",
            title: "Medicine Add Type",
          },
          { id: "medication.medication_name", title: "Medicine Name" },
          { id: "medication.description", title: "Medicine Description" },
          { id: "medication.day", title: "Day of the Week" },
          { id: "medication.time", title: "Time" },
          { id: "medication.start_date", title: "Start Date" },
          { id: "medication.end_date", title: "End Date" },
          { id: "notification_date", title: "Notification Date" },
          { id: "done_at", title: "Done At" },
        ],
        headerIdDelimiter: ".",
      });

      await writer.writeRecords(weeklyReportData);

      //Upload the report to cloud
      const uploadReport = await uploadWeeklyReportToCloud(fileName);

      const mailTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Weekly Medicine Report</title>
            </head>
            <body>
                <p>Hello, ${weeklyReportData[0].medication.user.first_name} ${weeklyReportData[0].medication.user.last_name}</p>
                <p>I hope this email finds you well. Herewith, we've attached the weekly report. Please go through the weekly report.</p>
                <p style="margin-bottom: 0">Regards,</p>
                <p style="margin-top: 0">Health and Wellness Management Platform</p>
            </body>
            </html>
        `;

      let messageOptions = {
        from: process.env.GMAIL_USER,
        to: weeklyReportData[0].medication.user.email,
        subject: `Weekly Medicine Report [ ${new Date(
          new Date().setDate(new Date().getDate() - 6)
        )
          .toJSON()
          .slice(0, 10)} - ${new Date().toJSON().slice(0, 10)}]`,
        html: mailTemplate,
        attachments: [
          {
            filename: fileName,
            path: path.resolve(__dirname, "../uploads", fileName),
          },
        ],
      };

      transporter.sendMail(messageOptions, async function (error, info) {
        if (error) {
          throw error;
        } else {
          if (uploadReport) {
            fs.unlinkSync(path.resolve(__dirname, "../uploads", fileName));
          }
          console.log("Email successfully sent!");
        }
      });

      console.log("Job is successfully processed by worker.....");
    } catch (error) {
      console.error("Error performing an job", error);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  }
);

module.exports = medicationReportQueue;
