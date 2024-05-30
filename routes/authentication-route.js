const { Router } = require("express");
const router = Router();
const {
  registerUser,
  getAllUsers,
  modifyUser,
  removeUser,
  loginUser,
  authenticateUser,
} = require("../controllers/authentication-controller");
const {
  userValidation,
  passwordValidation,
} = require("../middlewares/user-validation");

router.post("/register", userValidation, registerUser);
router.get("/get-users", getAllUsers);
router.put("/update-user/:id", modifyUser);
router.delete("/delete-user/:id", removeUser);
router.post("/login", loginUser);
router.post(
  "/activate-account/:activateCode",
  passwordValidation,
  authenticateUser
);

module.exports = router;
