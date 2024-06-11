const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
config({ path: `.env` });
const router = require("./routes/index-route");
const app = express();
const cookieParser = require("cookie-parser");
require("./jobs/medication-notification-job");
// require("./jobs/weekly-report-job");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use("/public", express.static("public"));
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
    console.log(`logout-all-devices-${data.userId}`, "user");
    client.broadcast.emit(`logout-all-devices-${data.userId}`, data);
    client.broadcast.emit(
      `logout-all-devices-except-current-${data.userId}`,
      data
    );
  });
});
