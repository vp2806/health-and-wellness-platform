const { generalResponse } = require("../helpers/response-helper");
const { validationResult } = require("express-validator");
const {
  createMedication,
  getMedications,
  updateMedication,
  deleteMedication,
} = require("../repositories/medication-repository");

const fields = {
  medicationAddType: "medication_add_type_id",
  medicationName: "medication_name",
  startDate: "start_date",
  endDate: "end_date",
};
const medicationPayLoad = {};

async function addMedication(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return generalResponse(
        res,
        { status: false, errors: errors.array() },
        "Invalid medication payload",
        "error",
        true
      );
    }

    for (let key in req.body) {
      if (key === "time") {
        req.body[key] = new Date(req.body.startDate + " " + req.body.time);
      }

      if (fields[key]) {
        medicationPayLoad[fields[key]] = req.body[key];
      } else {
        medicationPayLoad[key] = req.body[key];
      }
    }

    medicationPayLoad["user_id"] = req.user.id;

    const newMedication = await createMedication(medicationPayLoad);
    return generalResponse(
      res,
      newMedication,
      "Inserted new medication successfully",
      true
    );
  } catch (error) {
    console.error("Error inserting user", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while inserting medication",
      "error",
      true
    );
  }
}

async function getAllMedications(req, res) {
  try {
    const medications = await getMedications({
      where: {
        user_id: req.user.id,
      },
    });
    return generalResponse(res, medications, "Fetched Medications", true);
  } catch (error) {
    console.error("Error fetching medications", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while fetching medications",
      "error",
      true
    );
  }
}

async function modifyMedication(req, res) {
  try {
    for (let key in req.body) {
      if (key === "time") {
        req.body[key] = new Date(req.body.startDate + " " + req.body.time);
      }

      if (fields[key]) {
        medicationPayLoad[fields[key]] = req.body[key];
      } else {
        medicationPayLoad[key] = req.body[key];
      }
    }
    medicationPayLoad["user_id"] = req.user.id;

    const updateMedicationData = await updateMedication(medicationPayLoad, {
      where: {
        id: req.params.id,
      },
    });
    return generalResponse(
      res,
      updateMedicationData,
      "Updated Medication",
      true
    );
  } catch (error) {
    console.error("Error updating medication", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while updating medication",
      "error",
      true
    );
  }
}

async function removeMedication(req, res) {
  try {
    const medication = await deleteMedication({
      where: {
        id: req.params.id,
      },
    });
    return generalResponse(res, medication, "Deleted Medication", true);
  } catch (error) {
    console.error("Error deleting medication", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while deleting medication",
      "error",
      true
    );
  }
}

module.exports = {
  addMedication,
  getAllMedications,
  modifyMedication,
  removeMedication,
};
