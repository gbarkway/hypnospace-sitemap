const captures = require('./captures.json')
const dates = new Set(captures.map(c => c.date))

getCaptureByDate = date => captures.find(c => c.date == date.toUpperCase())
getDates = () => [...dates]
hasDate = date => dates.has(date.toUpperCase());

module.exports = { getCaptureByDate, hasDate, getDates }