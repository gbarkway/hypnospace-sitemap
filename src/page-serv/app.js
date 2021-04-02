const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const { makeCaptureService } = require("./captureService");
const { makeDal } = require("./mongoDal");

const dal = makeDal();
const service = makeCaptureService(dal);
const app = express();

app.use(morgan("combined"));
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use(cors());
} else if (process.env.CORS_ALLOWED_ORIGINS) {
  app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGINS.split(",") }));
}

app.get("/captures", async (req, res) => {
  try {
    const dates = await service.getDates();
    res.json(dates);
  } catch (err) {
    res.status(500).end();
    return;
  }
});

app.get("/captures/:date/pages", async (req, res) => {
  const date = req.params["date"];
  const expectedQuery = new Set(["tags", "user", "zone", "nameOrDescription"]);
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

  if (opts.user === "") {
    res.status(400).json("Empty username parameter");
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
    res.status(500).end();
  }
});

app.get("/captures/:date/pages/:path", async (req, res) => {
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
    res.status(500).end();
  }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Page service started on port ${port}`);
});

const close = async () => {
  await new Promise((resolve) => server.close(resolve));
  await dal.disconnect();
};

module.exports = { app, close, readyPromise: dal.readyPromise };
