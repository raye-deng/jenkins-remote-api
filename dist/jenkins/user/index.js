"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserAPI {
    constructor(client) {
        this.client = client;
    }
    async add(user) {
        const payload = {
            "username": user.fullName, "password1": user.password, "password2": user.password, "fullname": user.fullName, "email": user.email,
            json: { "username": user.fullName, "password1": user.password, "$redact": ["password1", "password2"], "password2": user.password, "fullname": user.fullName, "email": user.email }
        };
        const { data } = await this.client.post(`/securityRealm/createAccountByAdmin`, payload);
        return data;
    }
    async remove(username) {
        return this.client.post(`/securityRealm/user/${username}/doDelete`, { json: {} });
    }
    async list(filter) {
        const { data } = await this.client.get(`/asynchPeople`);
        return data === null || data === void 0 ? void 0 : data.users.filter(u => filter ? u.fullName.match(new RegExp(filter)) : true);
    }
    async createToken(username, name) {
        const { data } = await this.client.post(`/user/${username}/descriptorByName/jenkins.security.ApiTokenProperty/generateNewToken?newTokenName=${name}`, { json: { newTokenName: name } });
        return data;
    }
    async getUser(username) {
        const { data } = await this.client.get(`/user/${username}/api/json`);
        return data;
    }
    async update(user) {
        const u = await this.getUser(user.fullName);
        if (!u) {
            throw new Error(`user not found!`);
        }
        const password = user.password ? { password: user.password, password2: user.password } : {};
        const payload = Object.assign(Object.assign({ "fullName": user.fullName }, password), { apiToken: 'Token is hidden', "email.address": user.email, "user.password": user.password, "user.password2": user.password, "Submit": "Save", "providerId": "default", "core:apply": "", json: {
                "fullName": user.fullName,
                "description": user.description,
                "userProperty0": { "apiToken": "Token is hidden" },
                "userProperty2": { "address": user.email },
                "userProperty5": { "primaryViewName": "" },
                "userProperty6": { "providerId": "default" },
                "userProperty8": user.password ? Object.assign({ "$redact": ["password", "password2"] }, password) : undefined,
                "userProperty9": { "authorizedKeys": "" },
                "userProperty11": { "insensitiveSearch": true },
                "userProperty12": { "timeZoneName": "" },
                "core:apply": ""
            } });
        const { data } = await this.client.post(`/user/${user.fullName}/configSubmit`, payload);
        return data;
    }
}
exports.default = UserAPI;
//# sourceMappingURL=index.js.map