const sqlite3 = require("sqlite3").verbose();

const toApiPage = (dbPage) => {
  if (!dbPage) return null;
  return {
    path: dbPage.path,
    zone: dbPage.zone,
    date: dbPage.date,
    name: dbPage.name,
    description: dbPage.description,
    tags: JSON.parse(dbPage.tags),
    citizenName: dbPage.citizen_name,
  };
};

const makeDal = (path) => {
  path = path || "./pageserv.db";

  const db = new sqlite3.Database(path, (err) => {
    if (err) {
      return console.error(err.message, path);
    }
    console.log("Connected to database at ", path);
  });

  const promiseAll = (sql, param) => {
    return new Promise(function (resolve, reject) {
      db.all(sql, param, function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  const promiseGet = (sql, param) => {
    return new Promise(function (resolve, reject) {
      db.get(sql, param, function (err, row) {
        if (err) reject(err);
        resolve(row);
      });
    });
  };

  return {
    readyPromise: Promise.resolve(),
    getPages: (date, opts) => {
      opts = opts || {};
      const expressions = [];
      const params = [];

      if (date) {
        expressions.push("page.date = ?");
        params.push(date);
      }
      if (opts.citizenName) {
        expressions.push("page.citizen_name LIKE ?");
        params.push(`%${opts.citizenName}%`);
      }
      if (opts.zone) {
        expressions.push("page.zone = ?");
        params.push(opts.zone);
      }
      if (opts.tags) {
        expressions.push(
          `tag.value IN (${"?,".repeat(opts.tags.length).slice(0, -1)})`
        );
        params.push(...opts.tags);
      }
      if (opts.nameOrDescription) {
        expressions.push(
          "(page.name LIKE ? OR page.description LIKE ? OR page.path LIKE ?)"
        );
        const s = `%${opts.nameOrDescription}%`;
        params.push(s, s, s);
      }

      let query =
        "SELECT DISTINCT page.path, page.zone, page.date, page.name, page.description, page.tags, page.citizen_name FROM page LEFT JOIN json_each(page.tags) as tag";
      if (expressions.length) {
        query += " WHERE ";
        query += expressions.join(" AND ");
      }

      return promiseAll(query, params).then((rows) => rows.map(toApiPage));
    },

    getDates: () => {
      return promiseAll("SELECT DISTINCT date FROM page", []).then((rows) =>
        rows.map((row) => row.date)
      );
    },

    getPageByPath: (date, path) => {
      path = path.replace("|", "\\");
      return promiseGet("SELECT * FROM page WHERE date = ? AND path = ?", [
        date,
        path,
      ]).then((row) => toApiPage(row));
    },

    disconnect: () => {
      return new Promise((resolve, reject) => {
        db.close((err) => {
          if (err) {
            reject(err);
          }

          resolve();
        });
      });
    },
  };
};

module.exports = { makeDal };
