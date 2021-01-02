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

describe('GET /captures/:date/pages', function() {
    describe('zone filter', function() {
        it('valid zone filter returns data', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?zone=Hypnospace Central')
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.be.a('Array');
                    res.body[0].should.have.all.keys('tags', 'path', 'zone', 'date', 'name', 'description', 'user')
                    res.body.should.include.deep.members([{
                        tags: [],
                        path: "01_hypnospace central\\~easysurvey-fin.hsp",
                        zone: "Hypnospace Central",
                        date: "1999-11-05",
                        name: "TV Spot Survey",
                        description: "",
                        user: "Merchantsoft"
                    }]);
                    res.body.filter(p => p.zone != 'Hypnospace Central').length.should.equal(0);
                    done();
                })
        })
    })
    //filters: zone, tags, username. combined
    //4 valid dates + invalid date
})

after(async function() {
    await close();
});

