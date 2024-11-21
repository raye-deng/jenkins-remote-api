"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('credentials api test', () => {
    let client;
    const credential = {
        "username": "foo_user",
        "usernameSecret": true,
        "password": "foo_password",
        "id": "foo_user_sshd",
        "description": "foo user sshd credential",
    };
    const domain = 'foo_domain_for_credential';
    beforeEach(async () => {
        client = await (0, index_1.init)("http://localhost:8080", "dev", "11549e6ff2c72af6cb380fe1cc5f4405f7");
    });
    it('add credential', async () => {
        const result = await client.credentials.add(credential);
        expect(result).not.toBe(null);
    });
    it('add credential in spec domain', async () => {
        await client.credentials.domain.add(domain);
        const result = await client.credentials.add(credential, domain);
        expect(result).not.toBe(null);
    });
    it('get credentials', async () => {
        const cred = await client.credentials.getById(credential.id);
        expect(cred).not.toBe(null);
    }, 300 * 1000);
    it('get credentials in spec domain', async () => {
        const cred = await client.credentials.getById(credential.id, domain);
        expect(cred).not.toBe(null);
    }, 300 * 1000);
    it('delete credential', async () => {
        const result = await client.credentials.delete(credential.id);
        await client.credentials.domain.remove(domain);
        expect(result).not.toBe(null);
    });
});
//# sourceMappingURL=index.spec.js.map