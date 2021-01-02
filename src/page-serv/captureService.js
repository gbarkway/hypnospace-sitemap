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

        getPage: async (date, path_or_hap) => {
            hap_id = Number(path_or_hap);
            if (hap_id) {
                return await dal.getPageByHapId(date, hap_id);
            } else {
                return await dal.getPageByPath(date, path_or_hap);
            }
        }
    }
}

module.exports = { makeCaptureService }