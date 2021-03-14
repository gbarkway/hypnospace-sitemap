const express = require('express');
const { getCaptureByDate, hasDate, getDates } = require('./captureService')
const cors = require('cors');

const app = express();

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    app.use(cors());
} else if (process.env.CORS_ALLOWED_ORIGINS) {
    app.use(cors({origin: process.env.CORS_ALLOWED_ORIGINS.split(',')}))
}

app.get('/captures', (req, res) => {
    res.send(getDates());
});

app.get('/captures/:date', (req, res) => {
    const date = req.params['date'];
    if (!hasDate(date)) {
        res.status(404).end()
    } else {
        res.type('json')
        res.send(getCaptureByDate(date));
    }
});

const port = process.env.PORT || 3000; // look into dotenv
const server = app.listen(port, () => {
    console.log(`Express started on port ${port}`);
});

module.exports = { app, server } 
