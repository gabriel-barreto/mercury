import { expect } from "chai";

import $http from "../src/services/http.service";

describe("HTTP Service", () => {
    describe("Smoke Tests", () => {
        it("should exists and be a funcion", () => {
            expect($http).to.exist;
            expect($http).to.be.a.instanceOf(Function);
        });

        it("should have all HTTP methods", () => {
            expect($http.get).to.be.an.instanceOf(Function);
            expect($http.post).to.be.an.instanceOf(Function);
            expect($http.put).to.be.an.instanceOf(Function);
            expect($http.delete).to.be.an.instanceOf(Function);
        });
    });
});
