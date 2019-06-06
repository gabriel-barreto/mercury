import chai, { expect } from "chai";
import moxios from "moxios";
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

        it("shouldn't call get when no receives an email", () => {
            const email = "";
            $contacts.fetch(email);
            expect(httpStub).to.not.have.been.called;
        });
    });

    describe("Check Method", () => {
        let contactStub;

        beforeEach(() => {
            moxios.install($http);
        });

        afterEach(() => {
            moxios.uninstall($http);
        });

        it("should return false when no receives id", async () => {
            moxios.stubRequest(/recipients/, {
                status: 200,
                response: {},
            });

            const received = await $contacts.check("email@something.com");
            const expected = false;

            expect(received).to.be.equal(expected);
        });

        it("should return true when received a contact id", async () => {
            moxios.wait(() => {
                const response = {
                    recipient_count: 1,
                    recipients: [
                        {
                            id: "ZGV2QGVudHJlY2xpcXVlcy5jb20uYnI=",
                            email: "dev@entrecliques.com.br",
                            first_name: "Entrecliques",
                            last_name: "Developer",
                        },
                    ],
                };
                const request = moxios.requests.mostRecent();

                request.respondWith({ stauts: 200, response });
            });

            const received = await $contacts.check("dev@entrecliques.com,br");
            const expected = true;

            expect(received).to.be.equal(expected);
        });
    });

    describe("Create method", () => {
        let httpStub;
        const contactData = {
            first_name: "Gabriel",
            last_name: "Barreto",
            email: "barreto-gabriel@outlook.com",
        };

        beforeEach(() => {
            httpStub = sinon.stub($http, "post");
            httpStub.resolves({ data: { persisted_recipients: [] } });
        });

        afterEach(() => {
            httpStub.restore();
        });

        it("should call post method from HTTP", () => {
            $contacts.create({ first_name: "a", last_name: "b", email: "c" });
            expect(httpStub).to.have.been.calledOnce;
        });

        it("shouldn't call post method from HTTP without payload", () => {
            $contacts.create({});
            expect(httpStub).to.not.have.been.called;
        });

        it("shouldn't call post method with empty props", () => {
            $contacts.create({});
            expect(httpStub).to.not.have.been.called;
        });

        it("should call post method with correct params", () => {
            const url = "/contactdb/recipients";
            const data = [contactData];

            $contacts.create(contactData);
            expect(httpStub).to.have.been.calledWith(url, data);
        });
    });

    describe("Remove Method", () => {
        let httpStub;

        beforeEach(() => {
            httpStub = sinon.stub($http, "delete");
            httpStub.resolves({});
        });

        afterEach(() => {
            httpStub.restore();
        });

        it("should call delete method from HTTP", () => {
            $contacts.remove("abc123");
            expect(httpStub).to.have.been.calledOnce;
        });

        it("shouldn't call delete method from HTTP without an ID", () => {
            $contacts.remove("");
            expect(httpStub).to.not.have.been.called;
        });

        it("should return true when get a successful response", async () => {
            moxios.install($http);
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({ status: 204 });
            });

            const received = await $contacts.remove("contactId");
            const expected = true;

            expect(received).to.be.equal(expected);
            moxios.uninstall($http);
        });
    });
});
