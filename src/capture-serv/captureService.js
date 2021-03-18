const captures = require('./captures.json')
const dates = new Set(captures.map(c => c.date))

const getCaptureByDate = date => captures.find(c => c.date == date.toUpperCase())
const getDates = () => [...dates]
const hasDate = date => dates.has(date.toUpperCase());

module.exports = { getCaptureByDate, hasDate, getDates }