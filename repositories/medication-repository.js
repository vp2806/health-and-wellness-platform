const db = require("../models");
const { medication, user } = db;
const { Op } = require("sequelize");

async function createMedication(medicationPayLoad) {
  try {
    const newMedication = await medication.create(medicationPayLoad);
    return newMedication;
  } catch (error) {
    console.error("Error creating a medication", error);
    throw error;
  }
}
async function getMedications(options) {
  try {
    const medications = await medication.findAll(options);
    return medications;
  } catch (error) {
    console.error("Error getting medications.", error);
    throw error;
  }
}

async function updateMedication(medicationPayLoad, options) {
  try {
    const updateMedicationData = await medication.update(
      medicationPayLoad,
      options
    );
    return updateMedicationData;
  } catch (error) {
    console.error("Error updating medication.", error);
    throw error;
  }
}

async function deleteMedication(medicationPayLoad) {
  try {
    const removeMedication = await medication.destroy(medicationPayLoad);
    return removeMedication;
  } catch (error) {
    console.error("Error deleting medication.", error);
    throw error;
  }
}

async function getMedicationWithUser() {
  try {
    const medications = await medication.findAll({
      include: {
        model: user,
        attributes: ["id", "first_name", "last_name", "email"],
      },
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              {
                medication_add_type_id: 1,
              },
              {
                start_date: new Date(),
              },
              {
                end_date: null,
              },
            ],
          },
          {
            [Op.and]: [
              { medication_add_type_id: 2 },
              {
                start_date: {
                  [Op.lte]: new Date(),
                },
                end_date: {
                  [Op.gte]: new Date(),
                },
              },
              {
                day: null,
              },
            ],
          },
          {
            [Op.and]: [
              { medication_add_type_id: 3 },
              {
                end_date: {
                  [Op.gte]: new Date(),
                },
              },
              {
                day: new Date().getDay(),
              },
            ],
          },
        ],
      },
    });
    return medications;
  } catch (error) {
    console.error("Error getting medication with user.", error);
    throw error;
  }
}
module.exports = {
  createMedication,
  getMedications,
  updateMedication,
  deleteMedication,
  getMedicationWithUser,
};
