import chai, { expect } from "chai";
import moxios from "moxios";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import $campaign from "../src/services/campaign.service";
import $http from "../src/services/http.service";

chai.use(sinonChai);

describe("Campaigns Methods", () => {
    describe("Smoke Tests", () => {
        it("should be an object of methods", () => {
            expect($campaign).to.exist;
            expect($campaign).to.be.instanceOf(Object);
        });

        it("should had a create method", () => {
            expect($campaign.create).to.exist;
            expect($campaign.create).to.be.an.instanceOf(Function);
        });

        it("should had a shoot method", () => {
            expect($campaign.shoot).to.exist;
            expect($campaign.shoot).to.be.an.instanceOf(Function);
        });
    });

    describe("Create Method", () => {
        let httpStub;

        const path = `/campaigns`;
        const payload = {
            title: "Lorem",
            subject: "a",
            list_ids: [1],
            sender_id: 123,
            categories: ["tag"],
            html_content: "a",
        };

        describe("Params", () => {
            beforeEach(() => {
                httpStub = sinon.stub($http, "post");
                httpStub.resolves({ data: { id: 1 } });
            });

            afterEach(() => {
                httpStub.restore();
            });

            it("should call HTTP Post method", () => {
                $campaign.create(payload);
                expect(httpStub).to.have.been.calledOnce;
            });

            it("should call HTTP Post method with correct URL", () => {
                $campaign.create(payload);
                expect(httpStub).to.have.been.calledWith(path);
            });

            it("should call HTTP Post method with correct payload", () => {
                $campaign.create(payload);
                expect(httpStub).to.have.been.calledWith(path, payload);
            });

            it("shouldn't call HTTP Post method without payload", () => {
                $campaign.create().catch(() => {});
                expect(httpStub).to.not.have.been.called;
            });

            it("shouldn't call HTTP Post method with an invalid payload", () => {
                $campaign.create({ title: "a" }).catch(() => {});
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

            it("should return ID when success response", async () => {
                const id = 123;

                moxios.wait(() => {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({ status: 201, response: { id } });
                });

                const received = await $campaign.create(payload);

                expect(received).to.be.equal(id);
            });

            it("should return null when fails", async () => {
                const status = [400, 401, 404, 500];
                const index = Math.floor(Math.random() * 3);

                moxios.wait(() => {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        stauts: status[index],
                        response: {},
                    });
                });

                const received = await $campaign.create(payload);
                const expected = null;

                expect(received).to.be.equal(expected);
            });
        });
    });

    describe("Shoot Mehtod", () => {
        const id = 1234;

        describe("Param", () => {
            let httpStub;

            beforeEach(() => {
                httpStub = sinon.stub($http, "post");
                httpStub.resolves({ data: {} });
            });

            afterEach(() => {
                httpStub.restore();
            });

            it("should use HTTP Post method to send campaigns", () => {
                $campaign.shoot(id);
                expect(httpStub).to.have.been.calledOnce;
            });

            it("should call HTTP Post method with correct URL", () => {
                const expected = `/campaigns/${id}/schedules/now`;

                $campaign.shoot(id);
                expect(httpStub).to.have.been.calledWith(expected);
            });

            it("shouldn't call HTTP Post method without an ID", () => {
                $campaign.shoot(undefined).catch(() => {});
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

            it("should return true when success response", async () => {
                moxios.wait(() => {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({ status: 200, response: {} });
                });

                const received = await $campaign.shoot(id);
                const expected = true;

                expect(received).to.be.equal(expected);
            });

            it("should return false when fail response", async () => {
                const status = [400, 401, 403, 404, 500];
                const index = Math.floor(Math.random() * 4);
                const payload = { status: status[index] };

                moxios.wait(function() {
                    const request = moxios.requests.mostRecent();
                    request.respondWith(payload);
                });

                const received = await $campaign.shoot(id);
                const expected = false;

                console.log(received);
                expect(received).to.be.equal(expected);
            });
        });
    });
});
