const cors = require("cors");
const express = require("express");
const winston = require("winston");
const expressWinston = require("express-winston");

const { makeCaptureService } = require("./captureService");
const { makeDal } = require("./sqliteDal");

const dal = makeDal();
const service = makeCaptureService(dal);
const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.json(),
    })
  );  
}

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use(cors());
} else if (process.env.CORS_ALLOWED_ORIGINS) {
  app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGINS.split(",") }));
}

app.get("/captures", async (req, res, next) => {
  try {
    const dates = await service.getDates();
    res.json(dates);
  } catch (err) {
    next(err);
  }
});

app.get("/captures/:date/pages", async (req, res, next) => {
  const date = req.params["date"];
  const expectedQuery = new Set(["tags", "citizenName", "zone", "nameOrDescription"]);
  if (Object.keys(req.query).some((q) => !expectedQuery.has(q))) {
    res.status(400).json("Unexpected query param");
    return;
  }
  const opts = req.query || {};
  if (opts.tags === "") {
    res.status(400).json("Empty tags parameter");
    return;
  } else if (opts.tags) {
    opts.tags = opts.tags.split(",");
    if (!opts.tags.length || opts.tags.some((t) => !t)) {
      res.status(400).json("Invalid tags parameter");
      return;
    }
  }

  if (opts.citizenName === "") {
    res.status(400).json("Empty citizenName parameter");
    return;
  }

  if (opts.zone === "") {
    res.status(400).json("Empty zone parameter");
    return;
  }

  if (opts.nameOrDescription === "") {
    res.status(400).json("Empty nameOrDescription parameter");
    return;
  }

  try {
    if (!(await service.hasDate(date))) {
      res.status(404).json("Invalid capture date");
      return;
    }

    const pages = await service.getPages(date, opts);
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

app.get("/captures/:date/pages/:path", async (req, res, next) => {
  const date = req.params["date"];
  const path = req.params["path"].replace("|", "\\");
  if (!path.endsWith(".hsp")) {
    res.status(400).json("Invalid page identifier");
    return;
  }

  try {
    if (!(await service.hasDate(date))) {
      res.status(404).json("Invalid capture date");
      return;
    }

    const page = await service.getPage(req.params["date"], path);
    if (page) {
      res.status(200).json(page);
    } else {
      res.status(404).json("Page not found");
    }
  } catch (err) {
    next(err);
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
  console.log(`Page service started on port ${port}`);
});

const close = async () => {
  await new Promise((resolve) => server.close(resolve));
  await dal.disconnect();
};

module.exports = { app, close, readyPromise: dal.readyPromise };
