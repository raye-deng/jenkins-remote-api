"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CredentialsAPI {
    constructor(client) {
        this.client = client;
    }
    async getById(id) {
        const { data } = await this.client.get(`/credentials/store/system/domain/_/credential/${id}/api/json`);
        return data;
    }
    async add(payload) {
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
                },
                "Jenkins-Crumb": "ed418e597e2953ce83485dc945ec31223531fcc2f7dff2090a0cbf6e469c53d4"
            }
        };
        return this.client.post(`credentials/store/system/domain/_/createCredentials`, form);
    }
    async delete(id) {
        return this.client.post(`/credentials/store/system/domain/_/credential/${id}/doDelete`, { json: {} });
    }
}
exports.default = CredentialsAPI;
//# sourceMappingURL=index.js.map