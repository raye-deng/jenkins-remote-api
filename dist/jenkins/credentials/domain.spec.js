"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('domain api test', () => {
    let client;
    const domain = {
        "name": "foo_domain",
        "description": "domain for foo business"
    };
    beforeEach(async () => {
        client = await (0, index_1.init)("http://localhost:8080", "dev", "11549e6ff2c72af6cb380fe1cc5f4405f7");
    });
    it('add domain', async () => {
        const d = await client.credentials.domain.add(domain.name, domain.description);
        expect(d).not.toBe(null);
    }, 300 * 1000);
    it('update domain', async () => {
        const d = await client.credentials.domain.update(domain.name, `${domain.description} update description`);
        expect(d).not.toBe(null);
    }, 300 * 1000);
    it('get by name', async () => {
        const { data } = await client.credentials.domain.getByName(domain.name);
        expect(data.displayName).toEqual(domain.name);
    });
    it('remove domain', async () => {
        const d = await client.credentials.domain.remove(domain.name);
        expect(d).not.toBe(null);
    }, 300 * 1000);
});
//# sourceMappingURL=domain.spec.js.map