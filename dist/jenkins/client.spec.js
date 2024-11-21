"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
describe('api client unit test', () => {
    let client;
    beforeEach(async () => {
        client = await (0, index_1.init)("http://localhost:8080", "dev", "11549e6ff2c72af6cb380fe1cc5f4405f7");
    });
    it('hello jenkins', async () => {
    });
});
//# sourceMappingURL=client.spec.js.map