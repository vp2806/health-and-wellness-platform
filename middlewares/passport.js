const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwtStrategy = passportJWT.Strategy;
const { config } = require("dotenv");
config({ path: `.env` });
const { getUserLogins } = require("../repositories/user-login-repository");

let cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.SECERT_KEY,
    },
    async (jwtPayload, next) => {
      if (jwtPayload) {
        const userLogins = await getUserLogins({
          where: {
            user_id: jwtPayload.id,
            token_id: jwtPayload.tokenId,
          },
        });

        if (userLogins.length === 0) {
          return next(null, false);
        }

        if (userLogins[0].logged_out_at) {
          return next(null, false);
        }

        return next(null, jwtPayload);
      }
    }
  )
);
