import mocha from "mocha";
import chai from "chai";
import { app } from "../src/app";
import chaiHttp from "chai-http";
chai.use(chaiHttp);

const expect = chai.expect;

export { app, chai, expect, mocha };

