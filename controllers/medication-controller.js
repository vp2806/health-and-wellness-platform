const { generalResponse } = require("../helpers/response-helper");
const { validationResult } = require("express-validator");
const {
  createMedication,
  getMedications,
  updateMedication,
  deleteMedication,
} = require("../repositories/medication-repository");
const {
  createMedicationActivity,
  getMedicationActivities,
} = require("../repositories/medication-activity-repository");

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

async function getUserMedications(req, res) {
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

async function addMedicationActivity(req, res) {
  try {
    const medication = await getMedications({
      where: {
        authentication_code: req.params.authCode,
      },
    });

    console.log(medication);

    if (medication.length === 0) {
      return generalResponse(
        res,
        [],
        "You have already mark the medicine done.",
        true,
        true
      );
    }

    const newMedicationActivity = await createMedicationActivity({
      medication_id: medication[0].id,
      done_at: new Date(),
    });

    await updateMedication(
      {
        authentication_code: null,
      },
      {
        where: {
          id: medication[0].id,
        },
      }
    );

    return generalResponse(
      res,
      newMedicationActivity,
      "The medicine is marked as done.",
      true,
      true
    );
  } catch (error) {
    console.error("Error inserting medicine activity", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while marking the medicine as done.",
      "error",
      true
    );
  }
}

async function getUserMedicationActivities(req, res) {
  try {
    const medicationActivities = await getMedicationActivities(req.user.id);
    return generalResponse(
      res,
      medicationActivities,
      "Fetched Medication Activities",
      true
    );
  } catch (error) {
    console.error("Error fetching medication activities", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while fetching medication activities",
      "error",
      true
    );
  }
}

module.exports = {
  addMedication,
  getUserMedications,
  modifyMedication,
  removeMedication,
  addMedicationActivity,
  getUserMedicationActivities,
};
