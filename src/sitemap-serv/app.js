const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // look into dotenv
const { getSitemapByDate, hasDate } = require('./service')

app.get('/snapshots/:date', async (req, res) => {
    const date = req.params['date'];
    if (!(await hasDate(date))) {
        res.sendStatus(404);
        res.end();
    }

    res.type('json')
    res.send(await getSitemapByDate('asdf'));
});

app.listen(port, () => {
    `Express started on port ${port}`;
});
