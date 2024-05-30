const db = require("../models");
const { user } = db;

async function createUser(userPayLoad) {
  try {
    const newUser = await user.create(userPayLoad);
    return newUser;
  } catch (error) {
    console.error("Error creating an user", error);
    throw error;
  }
}
async function getUsers(options) {
  try {
    const users = await user.findAll(options);
    return users;
  } catch (error) {
    console.error("Error getting users.", error);
    throw error;
  }
}

async function updateUser(userPayLoad, options) {
  try {
    const updateUserData = await user.update(userPayLoad, options);
    return updateUserData;
  } catch (error) {
    console.error("Error updating users.", error);
    throw error;
  }
}

async function deleteUser(userPayLoad) {
  try {
    const removeUser = await user.destroy(userPayLoad);
    return removeUser;
  } catch (error) {
    console.error("Error deleting users.", error);
    throw error;
  }
}

async function activateAccount(userPayLoad, options) {
  try {
    const authenticateUser = await user.update(userPayLoad, options);
    return authenticateUser;
  } catch (error) {
    console.error("Error authenticating user.", error);
    throw error;
  }
}

async function getUser(userPayLoad) {
  try {
    const getUser = await user.findOne(userPayLoad);
    return getUser;
  } catch (error) {
    console.error("Error fetching user.", error);
    throw error;
  }
}
module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  activateAccount,
  getUser,
};
