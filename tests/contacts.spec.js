import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";

chai.use(sinonChai);

import path from "path";
import dotenv from "dotenv";

import $http from "../src/services/http.service";
import $contacts from "../src/services/contacts.service";

beforeAll(() => {
    dotenv.config({ path: path.resolve(__dirname, path.join("..", ".env")) });
});

describe("Contacts Service", () => {
    describe("Smoke Tests", () => {
        it("should exist and be an object", () => {
            expect($contacts).to.exist;
            expect($contacts).to.be.an.instanceOf(Object);
        });

        it("should has a method to get contact info", () => {
            expect($contacts.fetch).to.exist;
            expect($contacts.fetch).to.be.an.instanceOf(Function);
        });

        it("should has a method to check contact info", () => {
            expect($contacts.check).to.exist;
            expect($contacts.check).to.be.an.instanceOf(Function);
        });

        it("should has a method to create contacts", () => {
            expect($contacts.create).to.exist;
            expect($contacts.create).to.be.an.instanceOf(Function);
        });

        it("should has a method to delete contacts", () => {
            expect($contacts.remove).to.exist;
            expect($contacts.remove).to.be.an.instanceOf(Function);
        });
    });

    describe("Fetch Method", () => {
        let httpStub;

        beforeEach(() => {
            httpStub = sinon.stub($http, "get");
            httpStub.resolves({});
        });

        afterEach(() => {
            httpStub.restore();
        });

        it("should call get method", () => {
            $contacts.fetch("dev@entrecliques.com.br");
            expect(httpStub).to.have.been.calledOnce;
        });

        it("should call with correct params", () => {
            const email = "dev@entrecliques.com.br";

            // ==> Expected
            const url = "/contactdb/recipients/search";
            const options = { params: { email } };

            // ==> Calling
            $contacts.fetch(email);

            // ==> Expect
            expect(httpStub).to.have.been.calledWith(url, options);
        });
    });

    describe("Check Method", () => {});

    // describe("Check method", () => {});
});
