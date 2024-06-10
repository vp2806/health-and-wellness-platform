const cron = require("node-cron");
const { config } = require("dotenv");
config({ path: `.env` });
const {
  getMedicationWithUser,
} = require("../repositories/medication-repository");
const medicineReminderQueue = require("../queues/medicine-reminder-queue");

async function sendMedicineNotification() {
  const medications = await getMedicationWithUser();

  medications
    .filter((medication) => {
      return (
        medication.start_date.split(" ").pop() ===
        new Date(new Date().getTime() + 330 * 1000 * 60)
          .toISOString()
          .slice(11, 16) +
          ":00"
      );
    })
    .forEach(async (medication) => {
      medicineReminderQueue.add("reminder", medication);
    });

  console.log("Cron job of medicine reminder executed at:", new Date());
}

cron.schedule("* * * * *", () => {
  sendMedicineNotification();
});
