const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../repositories/authentication-repository");
const { generalResponse } = require("../helpers/response-helper");
const {
  generateRandomString,
} = require("../helpers/random-string-generator-helper");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { updateUserLogin } = require("../repositories/user-login-repository");

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

    let user = await getUser({
      where: {
        email,
      },
    });

    if (user) {
      return generalResponse(
        res,
        [],
        "Email is already registered",
        "error",
        true
      );
    }

    user = await getUser({
      where: {
        contact_number: contactNumber,
      },
    });

    if (user) {
      return generalResponse(
        res,
        [],
        "Contact Number is already registered",
        "error",
        true
      );
    }

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
    let timeDifference = 0;

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

    if (user.dataValues.created_at === user.dataValues.updated_at) {
      timeDifference = new Date() - user.dataValues.created_at;
    } else {
      timeDifference = new Date() - user.dataValues.updated_at;
    }

    if (timeDifference > 2 * 60 * 60 * 1000) {
      return generalResponse(
        res,
        { success: false },
        "The link is expired.",
        "error",
        true
      );
    }

    if (!errors.isEmpty()) {
      return generalResponse(
        res,
        { status: false, errors: errors.array() },
        "Invalid user payload",
        "error",
        true
      );
    }

    const saltRounds = 10;
    const { password } = req.body;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    await updateUser(
      {
        password: passwordHash,
        status: 1,
        activation_code: null,
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

async function loginUser(req, res, next) {
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

    const { email, password } = req.body;
    const user = await getUser({
      where: {
        email: email,
      },
    });

    if (!user) {
      return generalResponse(
        res,
        { success: false },
        "Email or Password is invalid",
        "error",
        true
      );
    }

    if (!user.status) {
      return generalResponse(
        res,
        { success: false },
        "Please activate your account by setting the Password",
        "error",
        true
      );
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return generalResponse(
        res,
        { success: false },
        "Email or Password is invalid",
        "error",
        true
      );
    }
    req.user = {
      id: user.dataValues.id,
    };
    next();
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

async function resetPassword(req, res) {
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
        email: req.body.email,
      },
    });

    if (!user) {
      return generalResponse(
        res,
        { success: false },
        "Please enter a valid email.",
        "error",
        true
      );
    }

    const activationCode = generateRandomString(16);
    await updateUser(
      {
        activation_code: activationCode,
      },
      {
        where: {
          id: user.dataValues.id,
        },
      }
    );

    return generalResponse(
      res,
      {
        activationCode,
      },
      "Email is verified and now you can reset your password",
      true
    );
  } catch (error) {
    console.error("Error fetching user while resetting password", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while resetting user password",
      "error",
      true
    );
  }
}

async function logoutUser(req, res) {
  try {
    await updateUserLogin(
      {
        logged_out_at: new Date(),
      },
      {
        where: {
          token_id: req.user.tokenId,
        },
      }
    );

    res.clearCookie("token");
    return generalResponse(
      res,
      {
        success: true,
      },
      "Logged out successfully",
      true
    );
  } catch (error) {
    console.error("Error fetching user while logging out user", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while logging out user",
      "error",
      true
    );
  }
}

module.exports = {
  registerUser,
  modifyUser,
  removeUser,
  authenticateUser,
  loginUser,
  resetPassword,
  logoutUser,
};
