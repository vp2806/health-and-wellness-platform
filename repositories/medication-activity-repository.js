const db = require("../models");
const { medication_activity, medication, medication_add_type } = db;

async function createMedicationActivity(medicationActivityPayLoad) {
  try {
    const newMedicationActivity = await medication_activity.create(
      medicationActivityPayLoad
    );
    return newMedicationActivity;
  } catch (error) {
    console.error("Error creating a medication activity", error);
    throw error;
  }
}

async function getMedicationActivities(options) {
  try {
    const medicationActivities = await medication_activity.findAll({
      include: {
        model: medication,
        attributes: ["id", "user_id"],
      },
      where: {
        "$medication.user_id$": options.userId,
        "$medication.id$": options.id,
      },
    });
    return medicationActivities;
  } catch (error) {
    console.error("Error getting medication activities.", error);
    throw error;
  }
}

async function updateMedicationActivity(medicationActivityPayLoad, options) {
  try {
    const updateMedicationActivity = await medication_activity.update(
      medicationActivityPayLoad,
      options
    );
    return updateMedicationActivity;
  } catch (error) {
    console.error("Error updating a medication activity", error);
    throw error;
  }
}

async function getMedicationWeeklyActivity() {
  try {
    const weeklyMedicationActivities = await medication_activity.findAll({
      include: {
        model: medication,
        attributes: {
          exclude: ["created_at", "updated_at", "deleted_at"],
        },
      },
      where: {
        notification_date: {
          [db.Sequelize.Op.lte]: new Date().toJSON().slice(0, 10),
          [db.Sequelize.Op.gte]: new Date(
            new Date().setDate(new Date().getDate() - 6)
          )
            .toJSON()
            .slice(0, 10),
        },
      },
    });
    return weeklyMedicationActivities;
  } catch (error) {
    console.error("Error fetching a weekly medication activity", error);
    throw error;
  }
}

module.exports = {
  createMedicationActivity,
  getMedicationActivities,
  updateMedicationActivity,
  getMedicationWeeklyActivity,
};
