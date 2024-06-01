const { Router } = require("express");
const router = Router();
const {
  registerUser,
  getAllUsers,
  modifyUser,
  removeUser,
  loginUser,
  authenticateUser,
  resetPassword,
  testFunction,
  logoutUser,
} = require("../controllers/authentication-controller");
const {
  getAllDevices,
  logoutAllDevicesExceptCurrent,
  logoutAllDevices,
} = require("../controllers/login-activity-controller");
const {
  userValidation,
  passwordValidation,
  setPasswordValidation,
  emailValidation,
} = require("../middlewares/user-validation");
const { generateToken, sendToken } = require("../helpers/token-helper");
const passport = require("passport");

router.post("/register", userValidation, registerUser);
router.post(
  "/activate-account/:activateCode",
  setPasswordValidation,
  authenticateUser
);
router.post("/reset-password", emailValidation, resetPassword);
router.get("/get-users", getAllUsers);
router.put("/update-user/:id", modifyUser);
router.delete("/delete-user/:id", removeUser);

router.post(
  "/login",
  emailValidation,
  passwordValidation,
  loginUser,
  generateToken,
  sendToken
);

router.delete(
  "/logout",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  logoutUser
);

router.get(
  "/user-logged-devices",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  getAllDevices
);

router.delete(
  "/logout-all-device-except-current",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  logoutAllDevicesExceptCurrent
);

router.delete(
  "/logout-all-devices",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  logoutAllDevices
);

router.get(
  "/test-route",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/get-users",
  }),
  testFunction
);

module.exports = router;
