const express = require("express");
const cors = require("cors");
const path = require("path");
const { config } = require("dotenv");
config({ path: `.env` });
const router = require("./routes/index-route");
const app = express();
const cookieParser = require("cookie-parser");
require("./jobs/medication-notification-job");
// require("./jobs/weekly-report-job");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", router);

const PORT = process.env.API_PORT;

const server = app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 App listening on the port ${PORT}`);
  console.log("=================================");
});

const io = require("socket.io")(server);

io.on("connection", (client) => {
  client.on("logout", (data) => {
    client.broadcast.emit(`logout-all-devices-${data.email}`, data);
    client.broadcast.emit(
      `logout-all-devices-except-current-${data.email}`,
      data
    );
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
