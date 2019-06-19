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

    describe("Create Method", () => {
        const data = { title: "MyTest" };
        describe("Params", () => {
            let httpStub;

            const path = "/contactdb/lists";

            beforeEach(() => {
                httpStub = sinon.stub($http, "post");
                httpStub.resolves({ data: {} });
            });

            afterEach(() => {
                httpStub.restore();
            });

            it("should call HTTP Post method", () => {
                $lists.create(data);
                expect(httpStub).to.have.been.calledOnce;
            });

            it("should call HTTP Post method with correct URL", () => {
                $lists.create(data);
                expect(httpStub).to.have.been.calledWith(path);
            });

            it("should call HTTP Post method with correct params", () => {
                $lists.create(data);
                expect(httpStub).to.have.been.calledWith(path, data);
            });

            it("shouldn't call HTTP Post with an incomplete payload", () => {
                const emptyPayload = {};

                $lists.create(emptyPayload);
                expect(httpStub).to.not.have.been.called;
            });
        });
        describe("Behavior", () => {
            beforeEach(() => {
                moxios.install($http);
            });

            afterEach(() => {
                moxios.uninstall($http);
            });

            it("should return new ID when receives 201 status", async () => {
                moxios.wait(() => {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status: 201,
                        response: { id: "abc123", title: "dadsadasd" },
                    });
                });

                const expected = "abc123";
                const received = await $lists.create(data);
                expect(received).to.be.equal(expected);
            });

            it("should return null when no receives a 201 status", async () => {
                moxios.wait(() => {
                    const request = moxios.requests.mostRecent();
                    const status = [400, 404, 500];
                    const index = Math.floor(Math.random() * 2);
                    request.respondWith({
                        stauts: status[index],
                    });
                });

                const expected = null;
                const received = await $lists.create(data);
                expect(expected).to.be.equal(received);
            });
        });
    });

    describe("Fill Method", () => {
        const targets = [];
    });
});
