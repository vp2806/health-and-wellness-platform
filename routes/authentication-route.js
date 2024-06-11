const { Router } = require("express");
const router = Router();
const {
  registerUser,
  modifyUser,
  removeUser,
  loginUser,
  authenticateUser,
  resetPassword,
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
const {
  renderRegisterView,
  renderActivateAccountView,
  renderLoginView,
  renderDashboardView,
  renderForgotPasswordView,
  renderProfileView,
} = require("../controllers/render-authentication-controller");

router.post("/register", userValidation, registerUser);
router.post(
  "/activate-account/:activateCode",
  setPasswordValidation,
  authenticateUser
);
router.post("/reset-password", emailValidation, resetPassword);
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
    failureRedirect: "/login",
  }),
  logoutUser
);

router.get(
  "/user-logged-devices",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  getAllDevices
);

router.delete(
  "/logout-all-device-except-current",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  logoutAllDevicesExceptCurrent
);

router.delete(
  "/logout-all-devices",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  logoutAllDevices
);

//Front-end Routes
router.get("/", renderLoginView);
router.get("/register", renderRegisterView);
router.get("/activate-account/:activateCode", renderActivateAccountView);
router.get("/login", renderLoginView);
router.get("/forgot-password", renderForgotPasswordView);
router.get("/reset-password/:activateCode", renderActivateAccountView);
router.get(
  "/dashboard",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  renderDashboardView
);
router.get(
  "/profile",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  renderProfileView
);

module.exports = router;
