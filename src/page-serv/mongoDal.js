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

const connect = async (host) => {
    const maxTries = 5;
    for (let i = 0; i < maxTries; i++) {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await mongoose.connect(host);
            break;
        } catch (e) {
            if (i < maxTries - 1) {
                console.log('Connecting to Mongo failed. Retrying in 1 second')
            } else {
                throw e;
            }
        }
    }
};

const degoosify = (document) => {
    if (!document) return document;
    return document.toObject({transform: function(doc, ret, options) {
        delete ret._id;
        return ret;
    }});
}

const makeDal = () => {
    const host = process.env.MONGO_HOST;
    if (!host) {
        throw new Error('Env variable MONGO_HOST must be set');
    }

    let connected = false;
    connect(host)
        .then(() => {
            console.log('Connected to mongodb');
            connected = true;
        })
        .catch((err) => console.error('Failed to connect to Mongo', err));

    throwIfNotConnected = () => {
        if (!connected) throw new Error('mongodb not connected')
    }

    return {
        getPages: async (date, opts) => {
            throwIfNotConnected();
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
            if (opts.nameOrDescription) {
                const re = new RegExp(`.*${opts.nameOrDescription}.*`, 'i');
                filter.$or = [
                    { "name": re },
                    { "description": re },
                ]
            }

            const docs = await Page.find(filter);
            return docs.map(degoosify);
        },

        getDates: async () => {
            throwIfNotConnected();
            const found = await Capture.find();
            return found.map(f => f.date);
        },

        getPageByHapId: async () => {
            throw new Error('HAP IDs not implemented');
        },

        getPageByPath: async (date, path) => {
            throwIfNotConnected();
            return degoosify(await Page.findOne({ date, path }));
        },

        disconnect: async () => {
            await mongoose.disconnect();
        }
    }
}

module.exports = { makeDal } 