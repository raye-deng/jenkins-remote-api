import APIClient from "../api-client";
import { UsernamePasswordCredentialCreateParameter } from "../type";
export default class CredentialsAPI {
    private readonly client;
    constructor(client: APIClient);
    getById(id: string): Promise<any>;
    add(payload: UsernamePasswordCredentialCreateParameter): Promise<import("axios").AxiosResponse<any, any>>;
    delete(id: string): Promise<import("axios").AxiosResponse<any, any>>;
}
