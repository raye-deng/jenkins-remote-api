import APIClient from "../api-client";
export default class JobAPI {
    private readonly client;
    constructor(client: APIClient);
    list(filter: string): Promise<void>;
}
