import { expect } from "chai";
import path from "path";

import $targetSource from "../src/services/targetsSource.service";

describe("Targets Source Service", () => {
    describe("Smoke Tests", () => {
        it("should exist and be an object", () => {
            expect($targetSource).to.exist;
            expect($targetSource).to.be.an.instanceOf(Object);
        });

        it("should had a read method", () => {
            expect($targetSource.read).to.exist;
            expect($targetSource.read).to.be.an.instanceOf(Function);
        });

        it("should had a segment method", () => {
            expect($targetSource.segment).to.exist;
            expect($targetSource.segment).to.be.an.instanceOf(Function);
        });
    });

    describe("Read", () => {
        it("should receive an CSV filepath and return an array", async () => {
            const received = await $targetSource.read("/file/path");
            expect(received).to.be.an.instanceOf(Array);
        });

        it("should return CSV content mapped to an object", async () => {
            const filename = "test_dataset.csv";
            const filepath = path.resolve(
                __dirname,
                path.join("..", "temp", filename)
            );
            const expected = [
                {
                    name: "Gabriel Barreto",
                    email: "dev@entrecliques.com.br",
                },
            ];
            const received = await $targetSource.read(filepath);

            expect(received).to.be.deep.equal(expected);
        });

        it("should ignore other columns from targets source spreadsheet", async () => {
            const filename = "test_dataset_2.csv";
            const filepath = path.resolve(
                __dirname,
                path.join("..", "temp", filename)
            );
            const expected = [
                {
                    name: "Gabriel Barreto",
                    email: "dev@entrecliques.com.br",
                },
                {
                    name: "Gabriel Barreto",
                    email: "barreto-gabriel@outlook.com",
                },
            ];
            const received = await $targetSource.read(filepath);

            expect(received).to.be.deep.equal(expected);
        });

        it("should return an empty Array when no receives filepath", async () => {
            const filepath = null;
            const expected = [];
            const received = await $targetSource.read(filepath);

            expect(received).to.be.deep.equal(expected);
        });

        it("should receive an invalid filepath and return an empty Array", async () => {
            const filepath = path.join("file", "path");
            const expected = [];
            const received = await $targetSource.read(filepath);

            expect(received).to.be.deep.equal(expected);
        });
    });

    describe("Segment", () => {
        const randomSize = (min = 1001, max = 3500) => {
            return Math.floor(Math.random() * (max - min)) + min;
        };

        const round = val => {
            const r = parseInt(val);
            if (r < val) return r + 1;
            return r;
        };

        it("should segment an array in parts with max 1000 items", () => {
            const size = randomSize();
            const received = $targetSource.segment(Array(size)).length;
            const expected = round(size / 1000);

            expect(received).to.be.equal(expected);
        });

        it("should had the same length in sum of splited arrays", () => {
            const size = randomSize();
            const splitted = $targetSource.segment(Array(size));
            const received = splitted.reduce(
                (acc, each) => acc + each.length,
                0
            );

            expect(size).to.be.equal(received);
        });

        it("should return one slice if length is lower than 1000", () => {
            const size = 990;
            const received = $targetSource.segment(Array(size)).length;
            const expected = 1;

            expect(received).to.be.equal(expected);
        });
    });
});
