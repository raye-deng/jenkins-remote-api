import APIClient from "../api-client";
export default class DomainAPI {
    private readonly client;
    constructor(client: APIClient);
    getByName(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    add(name: string, description?: string): Promise<import("axios").AxiosResponse<any, any>>;
    remove(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    update(name: string, description: string): Promise<import("axios").AxiosResponse<any, any>>;
}
