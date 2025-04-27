import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Logger } from "../common/logger";

const qs = require('qs');

export default class APIClient {
    client: AxiosInstance;
    logger: Logger;
    crumb: any;

    /**
     * jenkins remote api access client, only support api-token auth method
     * @param url
     * @param username
     * @param apiToken
     */
    constructor(private readonly url: string, private readonly username: string, private readonly apiToken: string,) {
    }

    async init() {
        this.client = axios.create({
            baseURL: this.url,
            auth: { username: this.username, password: this.apiToken }
        });
        this.logger = new Logger();

        this.client.interceptors.request.use((config: AxiosRequestConfig) => {
            if (config.method === "get" && config.url.indexOf("/api/json") === -1 && !config.url.includes('.xml') && config.url.indexOf("/logText/progressiveText") === -1) {
                config.url = `${config.url}/api/json`;
            }
            return config;
        });

        this.client.interceptors.response.use(async (response: AxiosResponse) => {
            this.logger.debug(`url:${response.config.url} response: ${JSON.stringify(response.data)}`);
            const { status } = response;
            if (status === 201) {
                const location = response?.headers["location"];
                if (location) {
                    response.config.baseURL = undefined;
                    response.config.url = location;
                    this.logger.info(`re-location to :${location}`);
                    return await this.client.request(response.config);
                }
            }
            return response;
        }, async (error: AxiosError<any>) => {
            const { response, config } = error;
            if (response?.status === 403 || response?.status === 401) {
                await this.getCrumb();
                config.baseURL = undefined;
                config["isRetry"] = true;
                this.logger.warn(`refresh crumb and retrying api :${config.url}`);
                if (config["isRetry"]) {
                    error.message = `${error.message}, request already retry after first time failure.`;
                    return Promise.reject(error);
                }
                return await this.client.request(config);
            }
            if (response?.status === 404 && error?.request?.path?.indexOf("/api/json") === -1) {
                config.url = `${error?.request?.path}${error?.request?.path?.endsWith("/") ? "" : "/"}api/json`;
                config.baseURL = undefined;
                this.logger.info(`get api re-trying fetch json api url:${config.url}`);
                return await this.client.request(config);
            }

            const { data } = response || {};
            let rawErrorMessage;
            if (data && response.headers['content-type'] !== "application/json") {
                const regexp = /(<div id=\"error-description\">(.*?)<\/div>|<h1>Error<\/h1><p>(.*?)<\/div>)/g;
                rawErrorMessage = data.message ? data.message : data.match(regexp);
                rawErrorMessage = rawErrorMessage ? rawErrorMessage[0].replace(/(<([^>]+)>)/ig, " ").replace(/[\r\n]/g, " ") : rawErrorMessage;
            }

            this.logger.error(`api invoke failed,[${config.method}] ${config.url},${data && typeof data == "string" ? data : JSON.stringify(data)}`);
            const stack = new Error().stack;
            error = Object.assign(error, { message: `${error.message} ${rawErrorMessage ? "(html error message:" + rawErrorMessage + ")" : ''}`, stack });
            return Promise.reject(error);
        });

        await this.getCrumb();
    }

    async getCrumb() {
        try {
            let { data, status } = await this.get("/crumbIssuer/api/json");
            if (status === 404) {
                this.logger.warn(`CSRF protection is not enable on the server at the moment.`);
                return;
            }
            if (data && typeof data === "string") {
                data = JSON.parse(data);
            }
            const crumbConfig = {};
            crumbConfig[data["crumbRequestField"]] = data.crumb;
            this.crumb = crumbConfig;
            this.logger.debug(`refresh crumb:${JSON.stringify(this.crumb)}`);
        } catch (e) {
            if (e?.response?.status === 404) {
                this.logger.warn(`CSRF protection is not enable on the server at the moment.`);
                return;
            }
            e.message = "CSRF protection is not enabled on the server at the moment." +
                " Perhaps the client was initialized when the CSRF setting was" +
                " enabled. Please re-initialize the client, also the root cause:\n" + e.message;
            throw e;
        }
    }

    async get(path: string, options?: AxiosRequestConfig) {
        return this.client.get(path, Object.assign({ headers: this.crumb }, options || {}));
    }

    async post(path: string, data: any = {}, options?: AxiosRequestConfig) {
        if (data.json) {
            Object.keys(this.crumb).map(k => data.json[k] = this.crumb[k]);
            data.json = JSON.stringify(data.json);
        }
        data = Object.assign({ Submit: "" }, this.crumb, data);
        if (!data.json) {
            data.json = JSON.stringify(data);
        }
        return this.client.post(path, qs.stringify(data), Object.assign({ headers: this.crumb }, options || { "content-type": "application/x-www-form-urlencoded" }));
    }

    async postConfig(path: string, data: any = {}, options?: AxiosRequestConfig) {
        return this.client.post(path, data, Object.assign({ headers: this.crumb }, options || { "content-type": "text/xml" }));
    }

}