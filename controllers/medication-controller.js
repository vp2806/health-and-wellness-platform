const { generalResponse } = require("../helpers/response-helper");
const { validationResult } = require("express-validator");
const {
  createMedication,
  getMedications,
  updateMedication,
  deleteMedication,
} = require("../repositories/medication-repository");
const {
  getMedicationActivities,
  updateMedicationActivity,
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
    console.log(req.body);
    // for (let key in req.body) {
    //   if (key === "time") {
    //     req.body[key] = new Date(req.body.startDate + " " + req.body.time);
    //   }

    //   if (fields[key]) {
    //     medicationPayLoad[fields[key]] = req.body[key];
    //   } else {
    //     medicationPayLoad[key] = req.body[key];
    //   }
    // }

    // medicationPayLoad["user_id"] = req.user.id;

    // const newMedication = await createMedication(medicationPayLoad);
    return generalResponse(
      res,
      [],
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

async function markMedicationActivity(req, res) {
  try {
    const medication = await getMedicationActivities({
      id: req.query.medicine,
      userId: req.user.id,
    });

    if (medication.length === 0) {
      return generalResponse(res, [], "Not Authorized", true, true, 401);
    }

    if (medication.length > 0 && medication[0].done_at) {
      return generalResponse(
        res,
        [],
        "You have already mark the medicine done",
        true,
        true
      );
    }

    const markingMedicationActivity = await updateMedicationActivity(
      {
        done_at: new Date(),
      },
      {
        where: {
          medication_id: req.query.medicine,
          notification_date: req.query.current,
        },
      }
    );

    return generalResponse(
      res,
      markingMedicationActivity,
      "The medicine is marked as done.",
      true,
      true
    );
  } catch (error) {
    console.error("Error marking medicine activity", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while marking the medicine as done.",
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
  markMedicationActivity,
};
