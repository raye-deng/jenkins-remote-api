import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Logger } from "../common/logger";
export default class APIClient {
    private readonly url;
    private readonly username;
    private readonly apiToken;
    client: AxiosInstance;
    logger: Logger;
    crumb: any;
    constructor(url: string, username: string, apiToken: string);
    init(): Promise<void>;
    getCrumb(): Promise<void>;
    get(path: string, options?: AxiosRequestConfig): Promise<AxiosResponse<any, any>>;
    post(path: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse<any, any>>;
    postConfig(path: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse<any, any>>;
}
