
var chai = require('chai');
let chaiHttp = require('chai-http');
var app = require('../server.js');
let server = require('../server');
let should = chai.should();

global.app = app;
global.expect = chai.expect;

chai.use(chaiHttp);
