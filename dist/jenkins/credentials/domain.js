"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainAPI {
    constructor(client) {
        this.client = client;
    }
    getByName(name) {
        return this.client.get(`/credentials/store/system/domain/${name}/api/json`);
    }
    add(name, description) {
        return this.client.post(`/credentials/store/system/createDomain?name=${name}`, { json: { name, description } });
    }
    remove(name) {
        return this.client.post(`/credentials/store/system/domain/${name}/doDelete`, { json: {} });
    }
    update(name, description) {
        return this.client.post(`/credentials/store/system/domain/${name}/configSubmit?name=${name}`, { json: { name, description } });
    }
}
exports.default = DomainAPI;
//# sourceMappingURL=domain.js.map