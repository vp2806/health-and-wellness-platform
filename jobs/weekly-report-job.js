const cron = require("node-cron");
const nodemailer = require("nodemailer");
const {
  getMedicationWeeklyActivity,
} = require("../repositories/medication-activity-repository");
const { getUsers } = require("../repositories/authentication-repository");
const medicineReminderQueue = require("../queues/weekly-medication-report-queue");

async function sendWeeklyReport() {
  const medicationActivities = await getMedicationWeeklyActivity();
  const allUsers = await getUsers({});

  allUsers.forEach((user) => {
    const userWeeklyReportData = medicationActivities.filter(
      (medicationActivity) => {
        return medicationActivity.medication.user_id === user.id;
      }
    );

    medicineReminderQueue.add("report", userWeeklyReportData);
  });
  console.log("Cron Job of weekly report executed at", new Date());
}

cron.schedule("59 23 * * 0", () => {
  sendWeeklyReport();
});
