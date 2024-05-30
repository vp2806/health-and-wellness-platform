const { Router } = require("express");
const router = Router();
const authenticationRoutes = require("../routes/authentication-route");

router.use("/", authenticationRoutes);
module.exports = router;
