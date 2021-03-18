/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../app')

chai.use(chaiHttp);
chai.should();

after(async function() {
    await new Promise((resolve) => server.close(resolve));
});

describe('GET /captures', function () {
    it('Returns 200 w/ 4 elements', async function () {
        const res = await chai.request(app).get('/captures');
        res.statusCode.should.equal(200);
        res.body.should.be.a('Array');
        res.body.should.have.all.members(['1999-11-05', '1999-11-26', '1999-12-31', '20XX-XX-XX'])
    })
})

it('GET /captures returns 200 w 4 elements', async () => {
    const res = await chai.request(app).get('/captures');
    res.statusCode.should.equal(200);
    res.body.should.have.lengthOf(4);
})


describe('GET /captures/:date', function() {
    it('Returns 404 if not found', async function() {
        const res = await chai.request(app).get('/captures/1999-10-08');
        res.statusCode.should.equal(404);
    });

    it('Returns 200 with expected fields', async function() {
        const res = await chai.request(app).get('/captures/1999-11-05');
        res.statusCode.should.equal(200);
        res.body.should.have.all.keys('date', 'pages', 'links');
    });
});
