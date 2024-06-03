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

async function getMedicationActivities(userId) {
  try {
    const medicationActivities = await medication_activity.findAll({
      include: {
        model: medication,
        exclude: ["id", "created_at", "upated_at", "deleted_at"],
        include: {
          model: medication_add_type,
          include: ["type"],
        },
      },
      where: {
        "$medication.user_id$": userId,
      },
    });
    return medicationActivities;
  } catch (error) {
    console.error("Error getting medication activities.", error);
    throw error;
  }
}

module.exports = { createMedicationActivity, getMedicationActivities };
