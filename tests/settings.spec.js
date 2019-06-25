import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import $settings from "../src/services/settings.service";

chai.use(sinonChai);

describe("Settings", () => {
    describe("Smoke Tests", () => {
        it("should be an object with methods", () => {
            expect($settings).to.exist;
            expect($settings).to.be.an.instanceOf(Object);
        });

        it("should had a parse settigns method", () => {
            expect($settings.parse).to.exist;
            expect($settings.parse).to.be.an.instanceOf(Function);
        });
    });
});
