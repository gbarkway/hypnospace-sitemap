/* eslint-disable no-undef */
const chai = require("chai");
const captureService = require("../captureService");

chai.should();

describe("captureService.hasDates", function () {
  const ds = [
    "1999-11-05",
    "1999-11-26",
    "1999-12-31",
    "20xx-xx-xx",
    "20XX-XX-XX",
  ];
  for (const d of ds) {
    it(`has ${d}`, function () {
      captureService.hasDate(d).should.equal(true);
    });
  }

  it("does not have 1992-11-25", function () {
    captureService.hasDate("1992-11-25").should.equal(false);
  });

  it("does not have 1999-11-055", function () {
    captureService.hasDate("1999-11-055").should.equal(false);
  });
});

describe("captureService.getDates", () => {
  const ds = ["1999-11-05", "1999-11-26", "1999-12-31", "20XX-XX-XX"];
  it("has all expected elements", function () {
    captureService.getDates().should.have.all.members(ds);
  });
});

describe("captureService.getCaptureByDate", () => {
  const ds = ["1999-11-05", "1999-11-26", "1999-12-31", "20XX-XX-XX"];
  ds.forEach((d) => {
    const r = captureService.getCaptureByDate(d);
    it(`${d} has correct date`, () => {
      r.should.have.property("date", d);
    });

    it(`${d} has >1 pages`, () => {
      r.should.have.property("pages").that.has.lengthOf.greaterThan(1);
    });

    it(`${d} has >1 links`, () => {
      r.should.have.property("links").that.has.lengthOf.greaterThan(1);
    });
  });
});
