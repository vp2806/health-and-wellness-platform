const { Router } = require("express");
const router = Router();
const {
  addMedication,
  getUserMedications,
  modifyMedication,
  removeMedication,
  addMedicationActivity,
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

router.post(
  "/mark-medicine-as-done/:authCode",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  addMedicationActivity
);

router.get(
  "/get-medicine-activities",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  getUserMedicationActivities
);

module.exports = router;
