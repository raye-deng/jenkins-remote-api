import APIClient from "../api-client";
import { Computer, ComputerStatus } from "../type";
export default class ComputerAPI {
    private readonly client;
    constructor(client: APIClient);
    list(filter?: string, slaveOnly?: boolean): Promise<any>;
    add(computer: Computer): Promise<any>;
    delete(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    disconnect(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    launch(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    status(name: string): Promise<ComputerStatus>;
}
