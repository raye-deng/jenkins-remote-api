import APIClient from "../api-client";
import DomainAPI from "./domain";
export declare type UsernamePasswordCredentialCreateParameter = {
    "username": string;
    "usernameSecret": true;
    "password": string;
    "id": string;
    "description": string;
};
export default class CredentialsAPI {
    private readonly client;
    domain: DomainAPI;
    constructor(client: APIClient);
    getById(id: string, domain?: string): Promise<any>;
    add(payload: UsernamePasswordCredentialCreateParameter, domain?: string): Promise<import("axios").AxiosResponse<any, any>>;
    delete(id: string, domain?: string): Promise<import("axios").AxiosResponse<any, any>>;
}
