const db = require("../models");
const { user_login, user } = db;

async function createUserLogin(userLoginPayLoad) {
  try {
    const newUserLogin = await user_login.create(userLoginPayLoad);
    return newUserLogin;
  } catch (error) {
    console.error("Error creating an user login", error);
    throw error;
  }
}

async function getUserLogins(options) {
  try {
    const getAllUserLogins = await user_login.findAll(options);
    return getAllUserLogins;
  } catch (error) {
    console.error("Error getting user logins.", error);
    throw error;
  }
}

async function getUserLoginsWithUser(options) {
  try {
    const getAllUserLogins = await user_login.findAll({
      include: user,
      attributes: ["id"],
      where: {
        "$user.email$": options.email,
        logged_out_at: null,
      },
    });
    return getAllUserLogins;
  } catch (error) {
    console.error("Error getting user logins.", error);
    throw error;
  }
}

async function updateUserLogin(userLoginPayLoad, options) {
  try {
    const updateUserLoginData = await user_login.update(
      userLoginPayLoad,
      options
    );
    return updateUserLoginData;
  } catch (error) {
    console.error("Error updating user logins.", error);
    throw error;
  }
}

module.exports = {
  createUserLogin,
  getUserLogins,
  updateUserLogin,
  getUserLoginsWithUser,
};
