const makeDal = () => {
    return {
        getPages: async () => {
            return [];
        },

        getDates: async () => {
            return ['1999-11-05'];
        },

        getPageByHapId: async () => {
            return {
                test: 'hello!'
            };
        },

        getPageByPath: async () => {
            return {
                test: 'hello!'
            };
        }
    }
}

module.exports = { makeDal } 