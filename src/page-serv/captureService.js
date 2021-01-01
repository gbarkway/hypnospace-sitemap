const makeCaptureService = (dal) => {
    return {
        getPages: async (date, opts) => {
            opts = opts || {};
            opts.tags = opts.tags || [];
            return await dal.getPages(date, opts);
        },

        getDates: async () => {
            return await dal.getDates()
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