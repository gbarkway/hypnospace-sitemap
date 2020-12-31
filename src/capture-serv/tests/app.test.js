const request = require('supertest')
const { app, server } = require('../app')

afterAll(() => {
    server.close();
});

it('GET /captures returns 200 w 4 elements', async () => {
    const res = await request(app).get('/captures');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(4)
})


describe('GET /captures/:date', () => {
    it('Returns 404 if not found', async () => {
        const res = await request(app).get('/captures/1999-10-08');
        expect(res.statusCode).toEqual(404);
    });

    it('Returns 200 with expected fields', async () => {
        const res = await request(app).get('/captures/1999-11-05');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('date');
        expect(res.body).toHaveProperty('pages');
        expect(res.body).toHaveProperty('links');
    });
});
