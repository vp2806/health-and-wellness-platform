const jwt = require("jsonwebtoken");
const customId = require("custom-id");
const {
  createUserLogin,
  getUserLogins,
  updateUserLogin,
} = require("../repositories/user-login-repository");
const { generalResponse } = require("../helpers/response-helper");
const { config } = require("dotenv");
config({ path: `.env` });
let token = null;

async function createToken(req) {
  const tokenId = customId({
    user_id: req.user.id,
    date: Date.now(),
    randomLength: 8,
  });

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const userLogins = await getUserLogins({
    where: {
      user_id: req.user.id,
      logged_out_at: null,
      ip_address: ip,
      device: req.headers["user-agent"],
    },
  });

  if (userLogins.length > 0) {
    await updateUserLogin(
      {
        logged_out_at: new Date(),
      },
      {
        where: {
          user_id: req.user.id,
          logged_out_at: null,
          ip_address: ip,
          device: req.headers["user-agent"],
        },
      }
    );
  }

  await createUserLogin({
    user_id: req.user.id,
    token_id: tokenId,
    ip_address: ip,
    device: req.headers["user-agent"],
  });

  const userPayLoad = {
    id: req.user.id,
    tokenId: tokenId,
  };

  const accessToken = jwt.sign(userPayLoad, process.env.SECERT_KEY);
  return accessToken;
}

module.exports = {
  generateToken: async function (req, res, next) {
    token = await createToken(req);
    res.cookie("token", token, {
      httpOnly: true,
    });
    return next();
  },
  sendToken: function (req, res) {
    return generalResponse(
      res,
      {
        token,
      },
      "User Logged In Successfully",
      true
    );
  },
};
