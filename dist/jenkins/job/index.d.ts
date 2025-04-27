import APIClient from "../api-client";
import { BuildResponse, JobDetailResponse } from "../../types";
export default class JobAPI {
    private readonly client;
    constructor(client: APIClient);
    list(filter: string): Promise<any[]>;
    detail(jobName: string): Promise<JobDetailResponse>;
    createOrUpdate(name: string, configXML: string, viewPath?: string): Promise<import("axios").AxiosResponse<any, any>>;
    create(name: string, configXML: string): Promise<import("axios").AxiosResponse<any, any>>;
    createInView(name: string, viewPath: string, configXML: string): Promise<import("axios").AxiosResponse<any, any>>;
    update(name: string, configXML: string): Promise<import("axios").AxiosResponse<any, any>>;
    rename(name: string, targetName: string): Promise<import("axios").AxiosResponse<any, any>>;
    getConfig(name: any): Promise<import("axios").AxiosResponse<any, any>>;
    clone(sourceName: string, targetName: string): Promise<import("axios").AxiosResponse<any, any>>;
    remove(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    disable(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    enable(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    build(name: string, params?: any): Promise<import("axios").AxiosResponse<any, any>>;
    rebuild(name: string, id: number, params?: any): Promise<import("axios").AxiosResponse<any, any>>;
    replay(name: string, id: number, script: string): Promise<import("axios").AxiosResponse<any, any>>;
    getBuild(name: string, buildNumber: string | number): Promise<BuildResponse>;
    abortBuild(name: string, buildNumber: string | number): Promise<import("axios").AxiosResponse<any, any>>;
    deleteBuild(name: string, buildNumber: string | number): Promise<import("axios").AxiosResponse<any, any>>;
    getByName(name: string): Promise<import("axios").AxiosResponse<any, any>>;
    getByNameWithTree(name: string, tree: string): Promise<import("axios").AxiosResponse<any, any>>;
    isInQueue(name: string): Promise<any>;
    nextBuildNumber(name: string): Promise<number>;
    guessBuildNumberInQueue(name: string, id: number, ids?: number[]): Promise<number>;
    getInQueueBuild(name: string): Promise<{
        queueId: number;
        guessBuildNumber: number;
    }[]>;
    private getInQueueIds;
    getLog(name: string, buildNumber: string | number): Promise<import("axios").AxiosResponse<any, any>>;
    getArtifactUrls(name: string, buildNumber: string | number): Promise<string[]>;
    getProgressiveLog(name: string, buildNumber: string | number, pollInterval?: number): Promise<string>;
}
