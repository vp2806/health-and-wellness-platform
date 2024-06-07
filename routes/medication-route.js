const { Router } = require("express");
const router = Router();
const {
  addMedication,
  getUserMedications,
  modifyMedication,
  removeMedication,
  markMedicationActivity,
} = require("../controllers/medication-controller");
const {
  renderAddMedicationView,
} = require("../controllers/render-medication-controller");
const passport = require("passport");

router.post(
  "/add-medication",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  addMedication
);

router.get(
  "/get-medications",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  getUserMedications
);

router.put(
  "/update-medication/:id",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  modifyMedication
);

router.delete(
  "/delete-medication/:id",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  removeMedication
);

router.get(
  "/mark-medicine-as-done",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  markMedicationActivity
);

//Front-end Routes
router.get(
  "/add-medicine",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  renderAddMedicationView
);

module.exports = router;
