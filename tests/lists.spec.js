import chai, { expect } from "chai";
import moxios from "moxios";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import "../src/config/global.config";
import $http from "../src/services/http.service";
import $lists from "../src/services/lists.service";

chai.use(sinonChai);

describe("Lists Service", () => {
    describe("Smoke Tests", () => {
        it("should exist an be an object", () => {
            expect($lists).to.exist;
            expect($lists).to.be.an.instanceOf(Object);
        });

        it("should has a create method", () => {
            expect($lists.create).to.exist;
            expect($lists.create).to.be.an.instanceOf(Function);
        });

        it("should has a fill method", () => {
            expect($lists.fill).to.exist;
            expect($lists.fill).to.be.an.instanceOf(Function);
        });
    });

    describe("Create Method", () => {});
    describe("Fill Method", () => {});
});
