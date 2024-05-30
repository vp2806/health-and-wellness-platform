const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  activateAccount,
  getUser,
} = require("../repositories/authentication-repository");
const { generalResponse } = require("../helpers/response-helper");
const { generateRandomString } = require("../helpers/random-string-generator");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

async function registerUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return generalResponse(
        res,
        { status: false, errors: errors.array() },
        "Invalid user payload",
        "error",
        true
      );
    }

    const { firstName, lastName, email, dob, contactNumber } = req.body;
    const activationCode = generateRandomString(16);

    const newUser = await createUser({
      first_name: firstName,
      last_name: lastName,
      email,
      dob,
      contact_number: contactNumber,
      activation_code: activationCode,
    });
    return generalResponse(
      res,
      newUser,
      "Inserted new user successfully",
      true
    );
  } catch (error) {
    console.error("Error inserting user", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while inserting user",
      "error",
      true
    );
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await getUsers({});
    return generalResponse(res, users, "Fetched Users", true);
  } catch (error) {
    console.error("Error fetching user", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while fetching user",
      "error",
      true
    );
  }
}

async function modifyUser(req, res) {
  try {
    const { firstName, lastName, email, dob, contactNumber } = req.body;
    const updateUserData = await updateUser(
      {
        first_name: firstName,
        last_name: lastName,
        email,
        dob,
        contact_number: contactNumber,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    return generalResponse(res, updateUserData, "Updated Users", true);
  } catch (error) {
    console.error("Error updating user", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while updating user",
      "error",
      true
    );
  }
}

async function removeUser(req, res) {
  try {
    const user = await deleteUser({
      where: {
        id: req.params.id,
      },
    });
    return generalResponse(res, user, "Deleted Users", true);
  } catch (error) {
    console.error("Error deleting user", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while deleting user",
      "error",
      true
    );
  }
}

async function authenticateUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return generalResponse(
        res,
        { status: false, errors: errors.array() },
        "Invalid user payload",
        "error",
        true
      );
    }

    const user = await getUser({
      where: {
        activation_code: req.params.activateCode,
      },
    });

    if (!user) {
      return generalResponse(
        res,
        { success: false },
        "The link is not valid or expired.",
        "error",
        true
      );
    }

    const timeDifference = new Date() - user.dataValues.created_at;
    if (timeDifference > 2 * 60 * 60 * 1000) {
      return generalResponse(
        res,
        { success: false },
        "The link is expired.",
        "error",
        true
      );
    }

    const saltRounds = 10;
    const { password } = req.body;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    await activateAccount(
      {
        password: passwordHash,
      },
      {
        where: {
          id: user.dataValues.id,
        },
      }
    );

    return generalResponse(res, [], "Password Set Successfully", true);
  } catch (error) {
    console.error("Error authenticating user", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while authenticating user",
      "error",
      true
    );
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await getUsers({
      where: {
        email: email,
      },
    });

    if (user.length === 0) {
      return generalResponse(
        res,
        { success: false },
        "Email or Password is invalid",
        "error",
        true
      );
    }

    if (!bcrypt.compareSync(password, user[0].password)) {
      return generalResponse(
        res,
        { success: false },
        "Email or Password is invalid",
        "error",
        true
      );
    }

    return generalResponse(res, user, "Logged In", true);
  } catch (error) {
    console.error("Error logging user", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while logging user",
      "error",
      true
    );
  }
}

module.exports = {
  registerUser,
  getAllUsers,
  modifyUser,
  removeUser,
  authenticateUser,
  loginUser,
};
