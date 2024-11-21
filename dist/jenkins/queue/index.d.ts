import APIClient from "../api-client";
export default class QueueAPI {
    private readonly client;
    constructor(client: APIClient);
    getById(id: number): Promise<import("axios").AxiosResponse<any, any>>;
    list(name: string): Promise<any[]>;
    causes(id: number): Promise<any>;
    reason(id: number): Promise<any>;
}
