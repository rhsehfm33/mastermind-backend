const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

const authService = require("./auth");

// 앱 초기화
const app = express();
// 포트 정의
const port = process.env.PORT || 3000;
// db 연결
const { MONGO_URL } = require("./libs/db-connection");

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const userRoute = require("./routes/user");
const boardRoute = require("./routes/board");
const listRoute = require("./routes/list");
const cardRoute = require("./routes/card");

app.use("/", userRoute);
app.use("/boards", authService.ensureAuth(), boardRoute);
app.use("/lists", authService.ensureAuth(), listRoute);
app.use("/cards", authService.ensureAuth(), cardRoute);

const startT = Date.now();
app.use("/health", (_, res) => res.json({ time: Date.now() - startT }));

app.use((req, res, next) => {
  res.status = 404;
  next(Error("not found"));
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(res.statusCode || 500);
  res.json({ error: err.message || "internal server error" });
});

module.exports = app;
