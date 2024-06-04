const { Router } = require("express");
const router = Router();
const {
  addMedication,
  getUserMedications,
  modifyMedication,
  removeMedication,
  markMedicationActivity,
  getUserMedicationActivities,
} = require("../controllers/medication-controller");
const passport = require("passport");

router.post(
  "/add-medication",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  addMedication
);

router.get(
  "/get-medications",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  getUserMedications
);

router.put(
  "/update-medication/:id",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  modifyMedication
);

router.delete(
  "/delete-medication/:id",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  removeMedication
);

router.get(
  "/mark-medicine-as-done",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  markMedicationActivity
);

module.exports = router;
