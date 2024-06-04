const cron = require("node-cron");
const nodemailer = require("nodemailer");
const {
  getMedicationWeeklyActivity,
} = require("../repositories/medication-activity-repository");
async function sendWeeklyReport() {
  console.log(await getMedicationWeeklyActivity());
  console.log("Cron job executed at:", new Date());
}

cron.schedule("* * * * *", () => {
  sendWeeklyReport();
});
