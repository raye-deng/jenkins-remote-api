import APIClient from "../api-client";
import DomainAPI from "./domain";


export type UsernamePasswordCredentialCreateParameter = {
    "username": string,
    "usernameSecret": true,
    "password": string,
    "id": string,
    "description": string,
}

/**
 * only support manage global system domain credentials
 */
export default class CredentialsAPI {
    domain: DomainAPI;

    constructor(private readonly client: APIClient) {
        this.domain = new DomainAPI(client);
    }

    async getById(id: string, domain: string = '_') {
        const {data} = await this.client.get(`/credentials/store/system/domain/${domain}/credential/${id}/api/json`);
        return data;
    }

    async add(payload: UsernamePasswordCredentialCreateParameter, domain: string = '_') {
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
        return this.client.post(`credentials/store/system/domain/${domain}/createCredentials`, form)
    }

    async delete(id: string, domain: string = '_') {
        return this.client.post(`/credentials/store/system/domain/${domain}/credential/${id}/doDelete`, {json: {}});
    }

}