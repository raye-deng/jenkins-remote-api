import APIClient from "../api-client";
export default class JobAPI {
    private readonly client;
    constructor(client: APIClient);
    list(filter: string): Promise<any[]>;
    createOrUpdate(name: string, configXML: string): Promise<import("axios").AxiosResponse<any, any>>;
    create(name: string, configXML: string): Promise<import("axios").AxiosResponse<any, any>>;
    update(name: string, configXML: string): Promise<import("axios").AxiosResponse<any, any>>;
    rename(name: string, targetName: string): Promise<import("axios").AxiosResponse<any, any>>;
    clone(sourceName: string, targetName: string): Promise<import("axios").AxiosResponse<any, any>>;
    remove(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    disable(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    enable(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    build(name: string, params?: any): Promise<import("axios").AxiosResponse<any, any>>;
    getBuild(name: string, buildNumber: string | number): Promise<import("axios").AxiosResponse<any, any>>;
    abortBuild(name: string, buildNumber: string | number): Promise<import("axios").AxiosResponse<any, any>>;
    getByName(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    isInQueue(name: string): Promise<any>;
    nextBuildNumber(name: string): Promise<number>;
    guessBuildNumberInQueue(name: string, id: number, ids?: number[]): Promise<number>;
    getInQueueBuild(name: string): Promise<{
        queueId: number;
        guessBuildNumber: number;
    }[]>;
    private getInQueueIds;
}
