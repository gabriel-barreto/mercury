import chai, { expect } from "chai";
import moxios from "moxios";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import axios from "axios";
import $template from "../src/services/template.service";

chai.use(sinonChai);

describe("Template", () => {
    describe("Smoke Tests", () => {
        it("should be an object with methods", () => {
            expect($template).to.exist;
            expect($template).to.be.an.instanceOf(Object);
        });

        it("should has a get method", () => {
            expect($template.get).to.exist;
            expect($template.get).to.be.an.instanceOf(Function);
        });
    });

    describe("Get Method", () => {
        const url = "https://google.com";

        describe("Params", () => {
            let httpStub;

            beforeEach(() => {
                httpStub = sinon.stub(axios, "get");
                httpStub.resolves({ data: {} });
            });

            afterEach(() => {
                httpStub.restore();
            });

            it("should call HTTP Get method", () => {
                $template.get(url);
                expect(httpStub).to.have.been.called;
            });

            it("should call HTTP Get method with correct URL", () => {
                $template.get(url);
                const config = { headers: { Accept: "text/html" } };

                expect(httpStub).to.have.been.calledWith(url, config);
            });

            it("shouldn't call HTTP Get method without an URL", () => {
                $template.get(undefined).catch(() => {});
                expect(httpStub).to.not.have.been.called;
            });
        });

        describe("Behavior", () => {
            beforeEach(() => {
                moxios.install();
            });

            afterEach(() => {
                moxios.uninstall();
            });

            it("should return template when success response", async () => {
                const expected = "<html lang='pt-br'></html>";

                moxios.wait(() => {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status: 200,
                        response: expected,
                    });
                });

                const received = await $template.get(url);

                expect(expected).to.be.equal(received);
            });

            it("should return null when fails", async () => {
                const status = [400, 401, 402, 404, 500];
                const index = Math.floor(Math.random() * 4);

                moxios.wait(() => {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status: status[index],
                        response: "",
                    });
                });

                const received = await $template.get(url);
                expect(received).to.be.equal(null);
            });
        });
    });
});
