const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../app')

chai.use(chaiHttp);
chai.should();

after(async function() {
    await new Promise((resolve) => server.close(resolve));
});

// it('GET /captures returns 200 w 4 elements', async () => {
//     const res = await request(app).get('/captures');
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.length).toBe(4)
// })


describe('GET /captures/:date', function() {
    it('Returns 404 if not found', async function() {
        const res = await chai.request(app).get('/captures/1999-10-08');
        res.statusCode.should.equal(404);
    });

    // it('Returns 200 with expected fields', async () => {
    //     const res = await request(app).get('/captures/1999-11-05');
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('date');
    //     expect(res.body).toHaveProperty('pages');
    //     expect(res.body).toHaveProperty('links');
    // });
});
