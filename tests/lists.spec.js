import chai, { expect } from "chai";
import moxios from "moxios";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import "../src/config/global.config";
import $http from "../src/services/http.service";
import $lists from "../src/services/lists.service";

chai.use(sinonChai);

describe("Lists Service", () => {
    const path = "/contactdb/lists";

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
        const targets = ["abc123"];
        const target = 123;

        describe("Params", () => {
            let httpStub;

            beforeEach(() => {
                httpStub = sinon.stub($http, "post");
                httpStub.resolves({});
            });

            afterEach(() => {
                httpStub.restore();
            });

            it("should call HTTP Post method", () => {
                $lists.fill(target, targets);
                expect(httpStub).to.have.been.calledOnce;
            });

            it("should call HTTP Post method with correct URL", () => {
                const expectedUrl = `${path}/${target}/recipients`;
                $lists.fill(target, targets);
                expect(httpStub).to.have.been.calledWith(expectedUrl);
            });

            it("should call HTTP Post method with correct body", () => {
                const expectedUrl = `${path}/${target}/recipients`;
                $lists.fill(target, targets);
                expect(httpStub).to.have.been.calledWith(expectedUrl, targets);
            });

            it("shouldn't call HTTP Post method without an listId", () => {
                $lists.fill(undefined, []);
                expect(httpStub).to.not.have.been.called;
            });

            it("shouldn't call HTTP Post method without a target at least", () => {
                $lists.fill(target, []);
                expect(httpStub).to.not.have.been.called;
            });

            it("should throw an error if id isn't an int", () => {
                const expected = "should be a number";

                expect(() => $lists.fill(true, [])).to.throws(Error);
                expect(() => $lists.fill(true, [])).to.throws(expected);
            });

            it("should throw an error if targets isn't an array", () => {
                const expected = "should be an array";

                expect(() => $lists.fill(123, "aa")).to.throws(Error);
                expect(() => $lists.fill(123, "aa")).to.throws(expected);
            });
        });

        describe("Behavior", () => {
            beforeEach(() => {
                moxios.install($http);
            });

            afterEach(() => {
                moxios.uninstall($http);
            });

            it("should return true when success request", async () => {
                moxios.wait(() => {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({ status: 201, response: { a: 1 } });
                });

                const received = await $lists.fill(target, targets);
                expect(received).to.be.equal(true);
            });

            it("should return false when fail request", async () => {
                const failStatus = [400, 401, 404];
                const index = Math.floor(Math.random() * 2);
                moxios.wait(() => {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({ status: failStatus[index] });
                });

                const received = await $lists.fill(target, targets);
                expect(received).to.be.equal(false);
            });
        });
    });
});
