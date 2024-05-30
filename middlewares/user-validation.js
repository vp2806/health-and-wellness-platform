const { body } = require("express-validator");

const userValidation = [
  body("firstName").trim().notEmpty().withMessage("First Name can't be empty."),
  body("lastName").trim().notEmpty().withMessage("Last Name can't be empty."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email can't be empty.")
    .isEmail()
    .withMessage("Invalid Email Adress."),
  body("dob")
    .trim()
    .notEmpty()
    .withMessage("DOB can't be empty.")
    .isDate()
    .withMessage("Invalid Date Format (YYYY-MM-DD)."),
  body("contactNumber")
    .trim()
    .notEmpty()
    .withMessage("Contact Number can't be empty.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Invalid Contact Number."),
];

const passwordValidation = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password can't be empty.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm Password can't be empty.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

module.exports = { userValidation, passwordValidation };
