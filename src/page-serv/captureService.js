const makeCaptureService = (dal) => {
    return {
        getPages: async (date, opts) => {
            opts = opts || {};
            return await dal.getPages(date, opts);
        },

        getDates: async () => {
            return await dal.getDates()
        },

        hasDate: async function (date) { //make this refer to return object
            const dates = await this.getDates();
            return dates.indexOf(date) !== -1;
        },

        getPage: async (date, path) => {
            return await dal.getPageByPath(date, path);
        }
    }
}

module.exports = { makeCaptureService }