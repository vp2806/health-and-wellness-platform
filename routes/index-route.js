const { Router } = require("express");
const router = Router();
const authenticationRoutes = require("../routes/authentication-route");
const medicationRoutes = require("../routes/medication-route");
require("../middlewares/passport");

router.use("/", authenticationRoutes);
router.use("/", medicationRoutes);
module.exports = router;
