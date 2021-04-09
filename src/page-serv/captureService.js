const makeCaptureService = (dal) => {
  return {
    getPages: async (date, opts) => {
      opts = opts || {};
      return await dal.getPages(date, opts);
    },
  };
};

module.exports = { makeCaptureService };
