import { expect } from "chai";
import path from "path";

import $targetSource from "../src/services/targetsSource.service";

describe("Targets Source Service", () => {
    describe("Smoke Tests", () => {
        it("should exist and be an object", () => {
            expect($targetSource).to.exist;
            expect($targetSource).to.be.an.instanceOf(Object);
        });

        it("should has an read method", () => {
            expect($targetSource.read).to.exist;
            expect($targetSource.read).to.be.an.instanceOf(Function);
        });
    });

    describe("Behavior Tests", () => {
        describe("Happy way", () => {
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
        });

        describe("Unhappy way", () => {
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
    });
});
