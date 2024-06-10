const { body } = require("express-validator");

const medicationValidation = [
  body("medicationAddType")
    .trim()
    .notEmpty()
    .withMessage("Medicine Add Type can't be empty."),
  body("medicationName")
    .trim()
    .notEmpty()
    .withMessage("Medicine Name can't be empty."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description can't be empty.")
    .isLength({ max: 255 })
    .withMessage(
      "Description must contains less than or equal to 255 characters."
    ),
  body("startDate")
    .trim()
    .notEmpty()
    .withMessage("Date can't be empty.")
    .isDate()
    .withMessage("Invalid Date Format (YYYY-MM-DD)."),
  body("time")
    .trim()
    .notEmpty()
    .withMessage("Time can't be empty.")
    .custom((value, { req }) => {
      return value.split(":")[1] === "00" || value.split(":")[1] === "30";
    })
    .withMessage("Time interval must be of 30 minutues"),
  async (req, res, next) => {
    if (req.body.medicationAddType === "2") {
      await body("endDate")
        .trim()
        .notEmpty()
        .withMessage("End Date can't be empty.")
        .isDate()
        .withMessage("Invalid Date Format (YYYY-MM-DD).")
        .run(req);
    }

    if (req.body.medicationAddType === "3") {
      await body("day")
        .trim()
        .notEmpty()
        .withMessage("Day can't be empty.")
        .custom((value, { req }) => {
          return value >= 0 && value <= 6;
        })
        .withMessage("Day Must be from 0 to 6 only")
        .run(req);
    }

    next();
  },
];

module.exports = {
  medicationValidation,
};
