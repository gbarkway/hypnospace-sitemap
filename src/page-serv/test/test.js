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
    describe('no filter', function() {
        ['1999-12-31', '1999-11-05', '1999-11-26', '20XX-XX-XX'].forEach(function(date) {
            it(`returns data for ${date}`, function(done) {
                chai.request(app)
                .get(`/captures/${date}/pages`)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.be.a('Array');
                    res.body.should.have.lengthOf.above(8);
                    res.body[0].should.have.all.keys('tags', 'path', 'zone', 'date', 'name', 'description', 'user');
                    done();
                })
            })
        })

        it('returns 404 for invalid date', function(done) {
            chai.request(app)
                .get('/captures/1999-11-24/pages')
                .end((err, res) => {
                    res.status.should.equal(404);
                    res.body.should.be.a('string');
                    done();
                })
        })
    })

    it('returns 400 for unexpected query string parameter', function(done) {
        chai.request(app)
            .get('/captures/1999-11-05/pages?unexpected=true')
            .end((err, res) => {
                res.status.should.equal(400);
                res.body.should.be.a('string');
                done();
            })
    })

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
        it('nonexistent zone filter returns empty array', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?zone=fake')
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.be.a('Array');
                    res.body.length.should.equal(0);
                    done();
                })
        })
        it('empty zone query string returns 400', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?zone=')
                .end((err, res) => {
                    res.status.should.equal(400);
                    res.body.should.be.a('string');
                    done();
                })
        })
    })

    describe('user filter', function(){
        it('valid user filter returns data', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?user=DarkTwilightTiff')
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.be.a('Array');
                    res.body.should.have.lengthOf(16);
                    res.body.filter(p => p.user != 'DarkTwilightTiff').length.should.equal(0);
                    done();
                })
        });

        it('empty user filter returns 400', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?user=')
                .end((err, res) => {
                    res.status.should.equal(400);
                    res.body.should.be.a('string');
                    done();
                })
        })
    })

    describe('tags filter', function(){
        it('returns valid data for single tag', function (done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?tags=bullring')
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.be.a('Array');
                    res.body.map(p => p.tags).forEach(function (tags) {
                        tags.should.include.members(['bullring']);
                    });
                    res.body.should.have.lengthOf(5);
                    done();
                });
        });

        it('returns valid data for multiple tags', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?tags=bullring,roddy')
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.be.a('Array');
                    res.body.map(p => p.tags).forEach(function (tags) {
                        tags.should.include.members(['bullring', 'roddy']);
                    });
                    res.body.should.have.lengthOf(4);
                    done();
                })
        });

        it('returns 400 for empty tags', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?tags=')
                .end((err, res) => {
                    res.status.should.equal(400);
                    res.body.should.be.a('string');
                    done();
                })
        })
        it('returns 400 for trailing comma', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?tags=bullring,')
                .end((err, res) => {
                    res.status.should.equal(400);
                    res.body.should.be.a('string');
                    done();
                });
        })
        it('returns 400 for tags=,,', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?tags=,,')
                .end((err, res) => {
                    res.status.should.equal(400);
                    done();
                })
        })
        it('returns 400 for whitespace in tags', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?tags=bullring, roddy')
                .end((err, res) => {
                    res.status.should.equal(400);
                    done();
                });
        })
        it('returns 400 for single tag with whitespace', function(done) {
            chai.request(app)
                .get('/captures/1999-11-05/pages?tags= ')
                .end((err, res) => {
                    res.status.should.equal(400);
                    done();
                })
        })
    })

    it('filters right with stacked', function (done) {
        chai.request(app)
            .get('/captures/1999-11-05/pages?tags=guide&user=ProfessorHelper')
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.should.be.a('Array');
                res.body.should.have.lengthOf(1);
                res.body[0].path.should.equal('07_open eyed\\professorhelper.hsp');
                done();
            })
    })
    //filters: zone, tags, username. combined
    //4 valid dates + invalid date
})

after(async function() {
    await close();
});

