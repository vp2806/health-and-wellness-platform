const { config } = require("dotenv");
config({ path: `.env` });

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  host: "127.0.0.1",
  dialect: "mysql",
};
