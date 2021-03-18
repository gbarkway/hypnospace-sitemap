/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, close, readyPromise } = require("../app");

chai.use(chaiHttp);
chai.should();

//wait a second for db to be online
before(function (done) {
  readyPromise.finally(() => done());
});

describe("GET /captures", function () {
  it("should be array with 4 elements", function (done) {
    chai
      .request(app)
      .get("/captures")
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.be.a("Array");
        res.body.length.should.equal(4);
        done();
      });
  });
});

describe("GET /captures/:date/pages", function () {
  describe("no filter", function () {
    ["1999-12-31", "1999-11-05", "1999-11-26", "20XX-XX-XX"].forEach(function (
      date
    ) {
      it(`returns data for ${date}`, function (done) {
        chai
          .request(app)
          .get(`/captures/${date}/pages`)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.a("Array");
            res.body.should.have.lengthOf.above(8);
            res.body[0].should.have.all.keys(
              "tags",
              "path",
              "zone",
              "date",
              "name",
              "description",
              "user"
            );
            done();
          });
      });
    });

    it("returns 404 for invalid date", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-24/pages")
        .end((err, res) => {
          res.status.should.equal(404);
          res.body.should.be.a("string");
          done();
        });
    });
  });

  it("returns 400 for unexpected query string parameter", function (done) {
    chai
      .request(app)
      .get("/captures/1999-11-05/pages?unexpected=true")
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.should.be.a("string");
        done();
      });
  });

  describe("zone filter", function () {
    it("valid zone filter returns data", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?zone=Hypnospace Central")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body[0].should.have.all.keys(
            "tags",
            "path",
            "zone",
            "date",
            "name",
            "description",
            "user"
          );
          res.body.should.include.deep.members([
            {
              tags: [],
              path: "01_hypnospace central\\~easysurvey-fin.hsp",
              zone: "Hypnospace Central",
              date: "1999-11-05",
              name: "TV Spot Survey",
              description: "",
              user: "Merchantsoft",
            },
          ]);
          res.body
            .filter((p) => p.zone != "Hypnospace Central")
            .length.should.equal(0);
          done();
        });
    });
    it("nonexistent zone filter returns empty array", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?zone=fake")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body.length.should.equal(0);
          done();
        });
    });
    it("empty zone query string returns 400", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?zone=")
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.should.be.a("string");
          done();
        });
    });
  });

  describe("user filter", function () {
    it("valid user filter returns data", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?user=DarkTwilightTiff")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body.should.have.lengthOf(2);
          res.body
            .filter((p) => p.user != "DarkTwilightTiff")
            .length.should.equal(0);
          done();
        });
    });

    it("empty user filter returns 400", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?user=")
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.should.be.a("string");
          done();
        });
    });

    it("user filter is sloppy", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?user=darkTwilight")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body.should.have.lengthOf(2);
          res.body
            .filter((p) => p.user != "DarkTwilightTiff")
            .length.should.equal(0);
          done();
        });
    });

    it("special characters are escaped in user filter", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?user=*GraysPeak")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body.should.have.lengthOf(3);
          res.body.filter((p) => p.user != "*GraysPeak").length.should.equal(0);
          done();
        });
    });
  });

  describe("tags filter", function () {
    it("returns valid data for single tag", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?tags=bullring")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body
            .map((p) => p.tags)
            .forEach(function (tags) {
              tags.should.include.members(["bullring"]);
            });
          res.body.should.have.lengthOf(5);
          done();
        });
    });

    it("returns valid data for multiple tags", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?tags=bullring,roddy")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body
            .map((p) => p.tags)
            .forEach(function (tags) {
              tags.should.include.members(["bullring", "roddy"]);
            });
          res.body.should.have.lengthOf(4);
          done();
        });
    });

    it("returns valid data for tag with whitespace", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?tags=adrian merchant")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          done();
        });
    });

    it("returns 400 for empty tags", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?tags=")
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.should.be.a("string");
          done();
        });
    });
    it("returns 400 for trailing comma", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?tags=bullring,")
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.should.be.a("string");
          done();
        });
    });
    it("returns 400 for tags=,,", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?tags=,,")
        .end((err, res) => {
          res.status.should.equal(400);
          done();
        });
    });
    it("returns 400 for single tag with whitespace", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?tags= ")
        .end((err, res) => {
          res.status.should.equal(400);
          done();
        });
    });
  });

  describe("nameOrDescription filter", function () {
    it("HS News - Y2k Glitch returns 1 page with expected name", function (done) {
      chai
        .request(app)
        .get(
          "/captures/1999-11-05/pages?nameOrDescription=HS News - Y2k Glitch"
        )
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body.should.have.lengthOf(1);
          res.body[0].name.should.equal("HS News - Y2k Glitch");
          done();
        });
    });

    it("is case insensitive", function (done) {
      chai
        .request(app)
        .get(
          "/captures/1999-11-05/pages?nameOrDescription=hS nEwS - y2K gLiTcH"
        )
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body.should.have.lengthOf(1);
          res.body[0].name.should.equal("HS News - Y2k Glitch");
          done();
        });
    });

    it("Returns 400 for empty query", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?nameOrDescription=")
        .end((err, res) => {
          res.status.should.equal(400);
          done();
        });
    });

    it("Searches by path", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?nameOrDescription=outlaw.hsp")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body.should.have.lengthOf(1);
          res.body[0].name.should.equal("outlaw network testing");
          done();
        });
    });
  });

  describe("combined filters", function () {
    it("filters right with stacked", function (done) {
      chai
        .request(app)
        .get("/captures/1999-11-05/pages?tags=guide&user=ProfessorHelper")
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.be.a("Array");
          res.body.should.have.lengthOf(1);
          res.body[0].path.should.equal("07_open eyed\\professorhelper.hsp");
          done();
        });
    });
  });
});

describe("GET /captures/:date/pages/:path_or_hap", function () {
  const expected = {
    tags: [
      "cybercog",
      "fiction",
      "interactive",
      "game",
      "gary",
      "teknoshamanatrix",
      "cogs",
      "sprockets",
      "control",
      "story",
      "stories",
      "HS_CyberCog",
      "HS_InteractiveTheater",
    ],
    path: "06_starport castle dreamstation\\~garyscontrolroom.hsp",
    zone: "Starport Castle Dreamstation",
    date: "1999-11-05",
    name: "Gary's CyberCog Control Room",
    description:
      "Gary's Control Room - 2.6.99 - Welcome aboard visitor, and do keep your hands off the computers unless you know what you're doing!",
    user: "FirstCaptainGary",
  };
  it("returns expected page for valid path", function (done) {
    chai
      .request(app)
      .get(
        "/captures/1999-11-05/pages/06_starport castle dreamstation%5C~garyscontrolroom.hsp"
      )
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.deep.equal(expected);
        done();
      });
  });
  it("returns expected page for valid path w/ | instead of \\", function (done) {
    chai
      .request(app)
      .get(
        "/captures/1999-11-05/pages/06_starport castle dreamstation|~garyscontrolroom.hsp"
      )
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.deep.equal(expected);
        done();
      });
  });
  it("returns 404 if page doesn't exist", function (done) {
    chai
      .request(app)
      .get("/captures/1999-11-05/pages/i_dont_exist.hsp")
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.should.equal("Page not found");
        done();
      });
  });
  it('returns 400 if page doesn\'t end with ".hsp"', function (done) {
    chai
      .request(app)
      .get(
        "/captures/1999-11-05/pages/06_starport castle dreamstation|~garyscontrolroom"
      )
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.should.be.a("string");
        done();
      });
  });
  it("returns 404 if date capture doesn't exist", function (done) {
    chai
      .request(app)
      .get("/captures/1999-11-06/pages/i_dont_exist.hsp")
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.should.equal("Invalid capture date");
        done();
      });
  });
});

after(async function () {
  await close();
});
