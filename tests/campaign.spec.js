import chai, { expect } from "chai";
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

        const path = `/campaign`;

        beforeEach(() => {
            httpStub = sinon.stub($http, "post");
            httpStub.resolves({});
        });

        afterEach(() => {
            httpStub.restore();
        });

        it("should call HTTP Post method", () => {
            $campaign.create();
            expect(httpStub).to.have.been.calledOnce;
        });

        it("should call HTTP Post method with correct URL", () => {
            $campaign.create();
            expect(httpStub).to.have.been.calledWith(path);
        });
    });
});
