import { expect } from "chai";

import validator from "../src/utils/validator";

describe("Validator", () => {
    describe("Smoke Tests", () => {
        it("should export a object with methods", () => {
            expect(validator).to.exist;
            expect(validator).to.be.an.instanceOf(Object);
        });

        it("should had a validate method", () => {
            expect(validator.validate).to.exist;
            expect(validator.validate).to.be.an.instanceOf(Function);
        });
    });

    describe("Validate Method", () => {
        it("should return a boolean", () => {
            const received = validator.validate([0], {});
            expect(received.constructor).to.be.equal(Boolean);
        });

        it("should return false when no receives a payload", () => {
            const received = validator.validate([0], undefined);
            expect(received).to.be.equal(false);
        });

        it("should return true no receives a props array", () => {
            const received = validator.validate([], {});
            expect(received).to.be.equal(true);
        });

        it("should throw an error when props isn't an array", () => {
            expect(() => validator.validate(undefined, {})).to.throws(Error);
            expect(() => validator.validate(undefined, {})).to.throws(
                "Required props must be an array of fields"
            );
        });

        it("should return false when payload don't match with props", () => {
            const props = ["firstName", "lastName", "email"];
            const payload = { firstName: "A", lastName: "B" };

            expect(validator.validate(props, payload)).to.be.equal(false);
        });

        it("should return true when payload match with props", () => {
            const props = ["firstName", "lastName", "email"];
            const payload = { firstName: "A", lastName: "B", email: "C" };

            expect(validator.validate(props, payload)).to.be.equal(true);
        });
    });
});
