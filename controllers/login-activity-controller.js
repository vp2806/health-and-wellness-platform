const {
  getUserLogins,
  updateUserLogin,
} = require("../repositories/user-login-repository");
const { generalResponse } = require("../helpers/response-helper");

async function getAllDevices(req, res) {
  try {
    let data = null;
    const getDevices = await getUserLogins({
      where: {
        user_id: req.user.id,
        logged_out_at: null,
      },
    });

    data = getDevices;
    data.forEach((user) => {
      if (user.token_id === req.user.tokenId) {
        user.dataValues.current = "Current";
      }
    });

    return generalResponse(res, data, "Fetched all logged devices", true);
  } catch (error) {
    console.error("Error fetching logging devices", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while fetching logging devices",
      "error",
      true
    );
  }
}

async function logoutAllDevicesExceptCurrent(req, res) {
  try {
    let data = null;
    const getAllDevices = await getUserLogins({
      where: {
        user_id: req.user.id,
        logged_out_at: null,
      },
    });

    data = getAllDevices;

    data.forEach(async (user) => {
      if (user.token_id === req.user.tokenId) {
        user.dataValues.current = "Current";
      } else {
        await updateUserLogin(
          {
            logged_out_at: new Date(),
          },
          {
            where: {
              id: user.id,
            },
          }
        );
      }
    });

    return generalResponse(
      res,
      { success: true },
      "Logged out all device sucessfully except current device",
      true
    );
  } catch (error) {
    console.error("Error fetching logging devices", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while logged out all device  except current devices",
      "error",
      true
    );
  }
}

async function logoutAllDevices(req, res) {
  try {
    const getAllDevices = await getUserLogins({
      where: {
        user_id: req.user.id,
        logged_out_at: null,
      },
    });

    getAllDevices.forEach(async (user) => {
      await updateUserLogin(
        {
          logged_out_at: new Date(),
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    });

    res.clearCookie("token");
    return generalResponse(
      res,
      { success: true },
      "Logged out from all devices sucessfully",
      true
    );
  } catch (error) {
    console.error("Error fetching logging devices", error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while logged out from all devices",
      "error",
      true
    );
  }
}

module.exports = {
  getAllDevices,
  logoutAllDevicesExceptCurrent,
  logoutAllDevices,
};
