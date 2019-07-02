import chai, { expect } from "chai";
import deepEqualInAnyOrder from "deep-equal-in-any-order";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import path from "path";

import $settings from "../src/services/settings.service";

chai.use(deepEqualInAnyOrder);
chai.use(sinonChai);

describe("Settings", () => {
    const config = path.resolve(
        __dirname,
        "..",
        "temp",
        "settings_sample.json"
    );

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

    describe("Parse Tests", () => {
        it("should return an object with configs", () => {
            const received = $settings.parse(config);
            expect(received).to.be.an.instanceOf(Object);
        });

        it("should only return camp config props", () => {
            const overloadPath = path.resolve(
                __dirname,
                "..",
                "temp",
                "overload.json"
            );
            const parsed = $settings.parse(overloadPath);
            const received = Object.keys(parsed);
            const expected = [
                "tags",
                "title",
                "targets",
                "subject",
                "template",
            ];

            expect(expected).to.be.deep.equalInAnyOrder(received);
        });

        it("should return null when receives an invalid config path", () => {
            const invalidPath = "./settings.json";

            const received = $settings.parse(invalidPath);
            const expected = null;

            expect(expected).to.be.equal(received);
        });

        it("should return null when received an incomplete config", () => {
            const incompletePath = path.resolve(
                __dirname,
                "..",
                "temp",
                "incomplete.json"
            );
            const received = $settings.parse(incompletePath);
            const expected = null;

            expect(received).to.be.equal(expected);
        });

        it("should return an empty array as default tag prop", () => {
            const withoutTagPath = path.resolve(
                __dirname,
                "..",
                "temp",
                "withoutTag.json"
            );
            const { tags: received } = $settings.parse(withoutTagPath);
            const expected = [];

            expect(received).to.be.deep.equal(expected);
        });
    });
});
