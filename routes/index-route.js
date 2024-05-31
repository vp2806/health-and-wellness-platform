const { Router } = require("express");
const router = Router();
const authenticationRoutes = require("../routes/authentication-route");
require("../middlewares/passport");

router.use("/", authenticationRoutes);
module.exports = router;
