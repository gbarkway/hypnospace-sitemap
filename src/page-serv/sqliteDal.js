const sqlite3 = require('sqlite3').verbose();

const makeDal = (path) => {
    path = path || "./pageserv.db";
    let connected = false;
    const db = new sqlite3.Database(path, (err) => {
        if (err) {
            return console.error(err.message, path);
        }

        console.log('Connected to database at ', path);
    }); 

    return {
        getPages: async (date, opts) => {
            opts = opts || {};
            if (opts.user) {
              
            }
            if (opts.zone) {
          
            }
            if (opts.tags) {

            }
            if (opts.nameOrDescription) {

            }

            return [];
        },

        getDates: async () => {
            return [];
        },

        getPageByPath: async (date, path) => {
            return [];
        },

        disconnect: async () => {
            return;
        }
    }
}