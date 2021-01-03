const mongoose = require('mongoose');

const Page = mongoose.model('Page', {
    path: String,
    zone: String,
    date: String,
    name: String,
    description: String,
    tags: [String],
    user: String,
});

const Capture = mongoose.model('Capture', {
    date: String,
});

const startConnect = (host) => {
    let connectFailures = 0;
    const connectAndRetry = () => {
        mongoose.connect(host)
            .then(() => console.log('Connected to Mongo'))
            .catch((err) => {
                connectFailures += 1;
                if (connectFailures <= 5) {
                    console.log('Failed to connect to mongo. Retrying in 1 second')
                    new Promise((resolve) => setTimeout(resolve, 1000)).then(connectAndRetry);
                } else {
                    throw err;
                }
            })
    }
    connectAndRetry();
};

const degoosify = (document) => {
    if (!document) return document;
    return document.toObject({transform: function(doc, ret, options) {
        delete ret._id;
        return ret;
    }});
}

const makeDal = () => {
    let host = process.env.MONGO_HOST;
    if (!host) {
        console.log('Set env variable MONGO_HOST');
    }
    
    startConnect(host);

    return {
        getPages: async (date, opts) => {
            opts = opts || {};
            const filter = { date };
            if (opts.user) {
                filter.user = opts.user;
            }
            if (opts.zone) {
                filter.zone = opts.zone;
            }
            if (opts.tags) {
                if (opts.tags.length == 1) {
                    filter.tags = opts.tags[0];
                } else if (opts.tags.length > 1) {
                    filter.tags = { $all: opts.tags }
                } // else no tag filter
            }

            const docs = await Page.find(filter);
            return docs.map(degoosify);
        },

        getDates: async () => {
            const found = await Capture.find();
            return found.map(f => f.date);
        },

        getPageByHapId: async () => {
            throw 'HAP IDs not implemented';
        },

        getPageByPath: async (date, path) => {
            return degoosify(await Page.findOne({ date, path }));
        },

        disconnect: async () => {
            await mongoose.disconnect();
        }
    }
}

module.exports = { makeDal } 