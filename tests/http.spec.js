import { expect } from "chai";

import $http from "../src/services/http.service";

describe("HTTP Service", () => {
    describe("Smoke Tests", () => {
        it("should exists and be a funcion", () => {
            expect($http).to.exist;
            expect($http).to.be.a.instanceOf(Function);
        });
    });
});
