const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
config({ path: `.env` });
const router = require("./routes/index-route");
const app = express();
const cookieParser = require("cookie-parser");
require("./jobs/medication-notification-job");
require("./jobs/weekly-report-job");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", router);

const PORT = process.env.API_PORT;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 App listening on the port ${PORT}`);
  console.log("=================================");
});
