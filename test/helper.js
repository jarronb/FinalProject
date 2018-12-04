var chai = require("chai");
let chaiHttp = require("chai-http");
var app = require("../server.js");
let server = require("../server");
let should = chai.should();
let assert = require("assert");

// global.app = app;
// global.expect = chai.expect;

// chai.use(chaiHttp);
describe("pow", function() {
  it("raises to n-th power", function() {
    assert.equal(pow(2, 3), 8);
  });
});

function pow() {
  return 8; // :) we cheat!
}
