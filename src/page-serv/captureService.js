const makeCaptureService = ({ dal }) => {
    return {
        getPages: async (date, {limit, zone, tags, offset}) => {
            offset = offset || 0;
            limit = limit || 50;
            tags = tags || [];
            return await dal.getPages(date, offset, limit, zone, tags);
        },

        getDates: async () => {
            return await dal.getDates()
        },

        getPage: async (date, path_or_hap) => {
            hap_id = parseInt(path_or_hap);
            if (hap_id) {
                return await dal.getPageByHapId(hap_id, date);
            } else {
                return await dal.getPageByPath(path_or_hap_id, date);
            }
        }
    }
}

module.exports = { makeCaptureService }