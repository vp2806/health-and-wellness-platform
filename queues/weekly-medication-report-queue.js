const { Queue, Worker } = require("bullmq");
const csvWriter = require("csv-writer");
const path = require("path");
const transporter = require("../helpers/send-mail-helper");
const { config } = require("dotenv");
config({ path: `.env` });
const uploadWeeklyReportToCloud = require("../storage/storage");
const {
  createMedicationReport,
} = require("../repositories/medication-report-repository");

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

        if (!medicationActivity.medication.endDate) {
          medicationActivity.medication.endDate = "-";
        }

        if (!medicationActivity.done_at) {
          medicationActivity.done_at = "-";
        }
        return medicationActivity;
      });

      if (weeklyReportData.length === 0) {
        return;
      }

      fileName = `${Date.now()}-${
        weeklyReportData[0].medication.user.first_name
      }-${weeklyReportData[0].medication.user.last_name}-Report.csv`;

      const writer = csvWriter.createObjectCsvStringifier({
        header: [
          {
            id: "medication.medication_add_type.type",
            title: "Medicine Add Type",
          },
          { id: "medication.medication_name", title: "Medicine Name" },
          { id: "medication.description", title: "Medicine Description" },
          { id: "medication.day", title: "Day of the Week" },
          { id: "medication.startDate", title: "Start Date" },
          { id: "medication.endDate", title: "End Date" },
          { id: "medication.time", title: "Time" },
          { id: "notification_timestamp", title: "Notification Date" },
          { id: "done_at", title: "Done At" },
        ],
        headerIdDelimiter: ".",
      });

      const weeklyReportString = writer.stringifyRecords(weeklyReportData);

      const reportDataBuffer = Buffer.from(weeklyReportString, "utf-8");

      const uploadReport = await uploadWeeklyReportToCloud(
        reportDataBuffer,
        fileName
      );

      const mailTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Weekly Medicine Report</title>
            </head>
            <body>
                <p>Hello, ${weeklyReportData[0].medication.user.first_name} ${
        weeklyReportData[0].medication.user.last_name
      }</p>
                <p>I hope this email finds you well. Herewith, we've attached the weekly report from <strong>${new Date(
                  new Date().setDate(new Date().getDate() - 6)
                )
                  .toISOString()
                  .slice(0, 10)} to ${new Date()
        .toISOString()
        .slice(0, 10)} </strong> . Please go through the weekly report.</p>
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
          .toISOString()
          .slice(0, 10)} to ${new Date().toISOString().slice(0, 10)} ]`,
        html: mailTemplate,
        attachments: [
          {
            filename: fileName,
            content: reportDataBuffer,
          },
        ],
      };

      transporter.sendMail(messageOptions, async function (error, info) {
        if (error) {
          throw error;
        } else {
          await createMedicationReport({
            user_id: weeklyReportData[0].medication.user.id,
            report_url:
              uploadReport.url ||
              path.resolve(__dirname, "../uploads", fileName),
          });

          console.log("Weekly Report Email successfully sent!");
        }
      });
    } catch (error) {
      console.error("Error performing a weekly report job", error);
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
