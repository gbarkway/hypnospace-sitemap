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

const makeDal = (path = "./page-serv.db") => {
  const db = new sqlite3.Database(path, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return console.error(err.message, path);
    }
    console.log("Connected to database at ", path);
  });

  const dbAllAsync = (sql, param) => {
    return new Promise(function (resolve, reject) {
      if (!db.open) {
        reject(new Error("Database closed"));
      }

      db.all(sql, param, function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  const dbGetAsync = (sql, param) => {
    return new Promise(function (resolve, reject) {
      if (!db.open) {
        reject(new Error("Database closed"));
      }

      db.get(sql, param, function (err, row) {
        if (err) reject(err);
        resolve(row);
      });
    });
  };

  let getDatesResult = null;
  return {
    getPages: async (date, opts) => {
      opts = opts || {};
      const expressions = [];
      const params = [];

      if (date) {
        expressions.push("page.date = ?");
        params.push(date);
      }

      if (opts.citizenName === "") {
        expressions.push("page.citizen_name IS NULL");
      } else if (opts.citizenName) {
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

      const query = `SELECT DISTINCT page.path, page.zone, page.date, page.name, page.description, page.tags, page.citizen_name 
        FROM page 
        LEFT JOIN json_each(page.tags) as tag
        ${expressions.length ? " WHERE " + expressions.join(" AND ") : ""}`;

      const rows = await dbAllAsync(query, params);
      return rows.map(toApiPage);
    },

    getDates: async () => {
      // cache forever
      getDatesResult =
        getDatesResult ||
        (await dbAllAsync("SELECT DISTINCT date FROM page", [])).map(
          (row) => row.date
        );
      return getDatesResult;
    },

    getPageByPath: async (date, path) => {
      path = path.replace("|", "\\");
      const row = await dbGetAsync(
        "SELECT * FROM page WHERE date = ? AND path = ?",
        [date, path]
      );
      return toApiPage(row);
    },
  };
};

module.exports = { makeDal };
