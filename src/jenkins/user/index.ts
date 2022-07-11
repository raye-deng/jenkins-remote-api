import APIClient from "../api-client";

export type User = {
    id?: string,
    fullName: string,
    description?: string,
    absoluteUrl?: string,
    properties?: { _class: string, [key: string]: any },
    password?: string,
    email?: string
}
export type ListUser = {
    "lastChange": string,
    "project": string,
    user: User
}

export type TokenResponse = {
    data: {
        tokenName: string,
        tokenUuid: string,
        tokenValue: string
    },
    status: string
}
export default class UserAPI {
    constructor(private readonly client: APIClient) {
    }

    async add(user: User) {
        const payload = {
            "username": user.fullName, "password1": user.password, "password2": user.password, "fullname": user.fullName, "email": user.email,
            json: {"username": user.fullName, "password1": user.password, "$redact": ["password1", "password2"], "password2": user.password, "fullname": user.fullName, "email": user.email}
        };
        const {data} = await this.client.post(`/securityRealm/createAccountByAdmin`, payload);
        return data;
    }

    async remove(username: string) {
        return this.client.post(`/securityRealm/user/${username}/doDelete`, {json: {}})
    }

    async list(filter: string): Promise<ListUser> {
        const {data} = await this.client.get(`/asynchPeople`);
        return data?.users.filter(u => filter ? u.fullName.match(new RegExp(filter)) : true);
    }

    async createToken(username: string, name: string): Promise<TokenResponse> {
        const {data} = await this.client.post(`/user/${username}/descriptorByName/jenkins.security.ApiTokenProperty/generateNewToken?newTokenName=${name}`, {json: {newTokenName: name}})
        return data;
    }

    async getUser(username: string): Promise<User> {
        const {data} = await this.client.get(`/user/${username}/api/json`);
        return data;
    }

    async update(user: User) {

        const u = await this.getUser(user.fullName);
        if (!u) {
            throw new Error(`user not found!`);
        }
        const password = user.password ? {password: user.password, password2: user.password} : {};
        const payload = {
            "fullName": user.fullName,
            ...password,
            apiToken: 'Token is hidden',
            "email.address": user.email,
            "user.password": user.password,
            "user.password2": user.password,
            "Submit": "Save",
            "providerId": "default",
            "core:apply": "",
            json: {
                "fullName": user.fullName,
                "description": user.description,
                "userProperty0": {"apiToken": "Token is hidden"},
                "userProperty2": {"address": user.email},
                "userProperty5": {"primaryViewName": ""},
                "userProperty6": {"providerId": "default"},
                "userProperty8": user.password ? {"$redact": ["password", "password2"], ...password} : undefined,
                "userProperty9": {"authorizedKeys": ""},
                "userProperty11": {"insensitiveSearch": true},
                "userProperty12": {"timeZoneName": ""},
                "core:apply": ""
            }
        };

        const {data} = await this.client.post(`/user/${user.fullName}/configSubmit`, payload);
        return data;
    }
}