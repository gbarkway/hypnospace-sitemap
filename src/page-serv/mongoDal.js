const mongoose = require("mongoose");
const promiseRetry = require("promise-retry");
const escapeStringRegexp = require("escape-string-regexp");

const Page = mongoose.model("Page", {
  path: String,
  zone: String,
  date: String,
  name: String,
  description: String,
  tags: [String],
  user: String,
});

const Capture = mongoose.model("Capture", {
  date: String,
});

const degoosify = (document) => {
  if (!document) return document;
  return document.toObject({
    transform: function (doc, ret) {
      delete ret._id;
      return ret;
    },
  });
};

const makeDal = () => {
  const host = process.env.MONGO_HOST;
  if (!host) {
    throw new Error("Env variable MONGO_HOST must be set");
  }

  let disconnectRequested = false;
  let connected = false;
  const p = promiseRetry(function (retry, number) {
    // if you let vscode turn this callback async, it stops working
    if (disconnectRequested) return;

    console.log(`Connecting to mongodb attempt number ${number}`);
    return mongoose.connect(host).catch(retry);
  })
    .then(() => {
      console.log("Connected to mongodb");
      connected = true;
    })
    .catch((err) => console.error("Failed to connect to Mongo", err));

  const throwIfNotConnected = () => {
    if (!connected) throw new Error("mongodb not connected");
  };

  return {
    readyPromise: p, // TODO: is this weird, would it be better to emit an event?

    getPages: async (date, opts) => {
      throwIfNotConnected();
      opts = opts || {};
      const filter = { date };
      if (opts.user) {
        filter.user = new RegExp(`.*${escapeStringRegexp(opts.user)}.*`, "i");
      }
      if (opts.zone) {
        filter.zone = opts.zone;
      }
      if (opts.tags) {
        if (opts.tags.length == 1) {
          filter.tags = opts.tags[0];
        } else if (opts.tags.length > 1) {
          filter.tags = { $all: opts.tags };
        } // else no tag filter
      }
      if (opts.nameOrDescription) {
        const re = new RegExp(
          `.*${escapeStringRegexp(opts.nameOrDescription)}.*`,
          "i"
        );
        filter.$or = [{ name: re }, { description: re }, { path: re }];
      }

      const docs = await Page.find(filter);
      return docs.map(degoosify);
    },

    getDates: async () => {
      throwIfNotConnected();
      const found = await Capture.find();
      return found.map((f) => f.date);
    },

    getPageByHapId: async () => {
      throw new Error("HAP IDs not implemented");
    },

    getPageByPath: async (date, path) => {
      throwIfNotConnected();
      return degoosify(await Page.findOne({ date, path }));
    },

    disconnect: async () => {
      disconnectRequested = true;
      await mongoose.disconnect();
    },
  };
};

module.exports = { makeDal };
