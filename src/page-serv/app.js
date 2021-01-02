const express = require('express');
const { makeDal } = require('./mongoDal');
const { makeCaptureService } = require('./captureService');

const dal = makeDal();
const service = makeCaptureService(dal);
const app = express();

app.get('/captures', async (req, res) => {
    const dates = await service.getDates();
    res.json(dates);
});

app.get('/captures/:date/pages', async (req, res) => {
    const date = req.params['date'];
    const opts = req.query || {};
    if (opts.tags) {
        opts.tags = opts.tags.split(',')
    }

    const pages = await service.getPages(date, opts);
    res.json(pages);
});

app.get('/captures/:date/pages/:path_or_hap', async (req, res) => {
    const pathOrHap = req.params['path_or_hap'];
    if (!parseInt(pathOrHap) && !pathOrHap.endsWith(".hsp")) {
        res.status(400).json('Invalid page identifier');
        return;
    }

    const page = await service.getPage(req.params['date'], req.params['path_or_hap']);
    if (page) {
        res.status(200).json(page);
    } else {
        res.status(400).json('Page not found');
    }
})

const port = process.env.PORT || 3000; // look into dotenv
const server = app.listen(port, () => {
    console.log(`Page service started on port ${port}`);
});

const close = async () => {
    await new Promise((resolve) => server.close(resolve));
    await dal.disconnect();
}

module.exports = { app, close }
