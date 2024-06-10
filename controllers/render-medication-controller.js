const { Op } = require("sequelize");
const {
  getMedicationActivities,
  updateMedicationActivity,
} = require("../repositories/medication-activity-repository");

async function renderAddMedicationView(req, res) {
  try {
    return res.render("add-medicine");
  } catch (error) {
    console.error("Error rendering the register view");
  }
}

async function renderMedicationActivityView(req, res) {
  try {
    const medication = await getMedicationActivities({
      id: req.query.medicine,
      userId: req.user.id,
      notification_timestamp: {
        [Op.lte]: req.query.current,
      },
    });

    if (medication.length === 0) {
      return res.render("medicine-activity", {
        data: [],
        message: "You are not Authorized.",
        responseType: "error",
      });
    }

    console.log(medication, "medication.............");

    if (medication.length > 0 && medication[0].done_at) {
      return res.render("medicine-activity", {
        data: [],
        message: "You have already mark the medicine done.",
        responseType: "error",
      });
    }

    await updateMedicationActivity(
      {
        done_at: new Date(),
      },
      {
        where: {
          medication_id: req.query.medicine,
          notification_timestamp: {
            [Op.lte]: req.query.current,
          },
        },
      }
    );

    return res.render("medicine-activity", {
      data: [],
      message: "The medicine is marked as done.",
      responseType: "sucess",
    });
  } catch (error) {
    console.error("Error marking medicine activity", error);
    return res.render("medicine-activity", {
      data: [],
      message: "Something went wrong while marking the medicine as done.",
      responseType: "error",
    });
  }
}

module.exports = { renderAddMedicationView, renderMedicationActivityView };
