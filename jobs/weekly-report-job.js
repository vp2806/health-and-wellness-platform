const cron = require("node-cron");
const nodemailer = require("nodemailer");
const {
  getMedicationWeeklyActivity,
} = require("../repositories/medication-activity-repository");
const { getUsers } = require("../repositories/authentication-repository");
const medicationReportQueue = require("../queues/weekly-medication-report-queue");

async function sendWeeklyReport() {
  const medicationActivities = await getMedicationWeeklyActivity();
  const allUsers = await getUsers({});

  allUsers.forEach((user) => {
    const userWeeklyReportData = medicationActivities.filter(
      (medicationActivity) => {
        return medicationActivity.medication.user_id === user.id;
      }
    );

    medicationReportQueue.add("report", userWeeklyReportData);
  });
  console.log("Cron Job executed at", new Date());
}

cron.schedule("* * * * *", () => {
  sendWeeklyReport();
});
