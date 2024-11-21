"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const domain_1 = __importDefault(require("./domain"));
class CredentialsAPI {
    constructor(client) {
        this.client = client;
        this.domain = new domain_1.default(client);
    }
    async getById(id, domain = '_') {
        const { data } = await this.client.get(`/credentials/store/system/domain/${domain}/credential/${id}/api/json`);
        return data;
    }
    async add(payload, domain = '_') {
        const form = {
            json: {
                "": "0",
                "credentials": {
                    "scope": "GLOBAL",
                    "username": payload.username,
                    "usernameSecret": false,
                    "password": payload.password,
                    "$redact": "password",
                    "id": payload.id,
                    "description": payload.description,
                    "stapler-class": "com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl",
                    "$class": "com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl"
                }
            }
        };
        return this.client.post(`credentials/store/system/domain/${domain}/createCredentials`, form);
    }
    async delete(id, domain = '_') {
        return this.client.post(`/credentials/store/system/domain/${domain}/credential/${id}/doDelete`, { json: {} });
    }
}
exports.default = CredentialsAPI;
//# sourceMappingURL=index.js.map