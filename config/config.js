const { config } = require("dotenv");
config({ path: `.env` });

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
};
