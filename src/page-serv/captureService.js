const makeCaptureService = (dal) => {
  return {
    getPages: async (date, opts) => {
      opts = opts || {};
      return await dal.getPages(date, opts);
    },

    getDates: async () => {
      return await dal.getDates();
    },

    hasDate: async function (date) {
      const dates = await this.getDates();
      return dates.indexOf(date) !== -1;
    },

  };
};

module.exports = { makeCaptureService };
