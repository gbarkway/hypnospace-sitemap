const cors = require("cors");
const express = require("express");
const winston = require("winston");
const expressWinston = require("express-winston");

const { getCaptureByDate, hasDate, getDates } = require("./captureService");

const app = express();
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
  })
);
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use(cors());
} else if (process.env.CORS_ALLOWED_ORIGINS) {
  app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGINS.split(",") }));
}

app.get("/captures", (req, res) => {
  res.send(getDates());
});

app.get("/captures/:date", (req, res) => {
  const date = req.params["date"];
  if (!hasDate(date)) {
    res.status(404).end();
  } else {
    res.type("json");
    res.send(getCaptureByDate(date));
  }
});

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
  })
);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Express started on port ${port}`);
});

// Make the process exit faster on polite kill signals (Ctrl-C, docker container stop):
process.once("SIGTERM", () => {
  server.close();
});

module.exports = { app, server };
