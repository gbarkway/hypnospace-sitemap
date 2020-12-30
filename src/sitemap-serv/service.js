getSitemapByDate = async (date) => {
    return {
        sites: [
            {
                hapId: 1,
                name: 'example.hsp',
            },
            {
                hapId: 2,
                name: 'example2.hsp',
            },
        ],
        links: [
            {
                source: 1,
                target: 2,
            },
        ],
    }
}

const dates = new Set(['1999-11-05','1999-11-26','1999-12-31'])
hasDate = async (date) => {
    return dates.has(date);
}

module.exports = { getSitemapByDate, hasDate }