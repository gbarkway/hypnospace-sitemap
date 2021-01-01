const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app, close }= require('../app')

chai.use(chaiHttp);
chai.should();

//wait a second for db to be online
before(function(done) {
    setTimeout(done, 1000);
});

describe('GET /captures', function() {
    it('should be array with 4 elements', function(done) {
        chai.request(app)
            .get('/captures')
            .end((err, res) => {
                res.body.should.be.a('Array');
                res.body.length.should.equal(4);
                done();
            });
    });
})

after(async function() {
    await close();
});

